#!/usr/bin/env python3

import re
from result import Success, Failure





ascii = {
	" ", "!", '"', "#", "$", "%", "&", "'", "(", ")", "*", "+", ",", "-", ".", "/", "0",
	"1", "2", "3", "4", "5", "6", "7", "8", "9", ":", ";", "<", "=", ">", "?", "@", "A",
	"B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R",
	"S", "T", "U", "V", "W", "X", "Y", "Z", "[", "\\", "]", "^", "_", "`", "a", "b", "c",
	"d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t",
	"u", "v", "w", "x", "y", "z", "{", "|", "}", "~", "\	"
}

tspecials  = {'(', ')', '<', '>', '@', ',', ';', ':', '\\', '"', "/", "[", "]", "?", "="}
token_char = {char for char in ascii if char != ' ' and not char in tspecials}

grammar = {
	'type': dict({
		'/': '_SLASH'
	},
	**{key: 'type' for key in token_char}),






	'_SLASH': {key: 'subtype' for key in token_char},

	'_BIND': dict({
		'"': 'double-quoted',
		"'": 'single-quoted'
	},

	**{key: 'unquoted' for key in token_char}),




	'subtype': dict({
		';': '_SPACE',
	},
	**{key: 'subtype' for key in token_char}),

	'_SPACE': dict({
		' ':   '_SPACE',
		'\t':  '_SPACE',
		'\n':  '_SPACE',
	},

	**{key: 'attribute' for key in token_char}),



	'attribute': dict({
		'=': '_BIND',
	},
	**{key: 'attribute' for key in token_char}),




	'single-quoted': dict({
		"'": 'unquoted'
	},
	**{key: 'single-quoted' for key in ascii if key != "'"}),

	'double-quoted': dict({
		'"': 'unquoted'
	},
	**{key: 'double-quoted' for key in ascii if key != '"'}),

	'unquoted': dict({
		';': '_SPACE'
	},
	**{key: 'unquoted' for key in token_char}),

}





def lex(content_type):
	"""
	# http://tools.ietf.org/html/rfc2045#page-10
	"""

	state       = 'type'
	transitions = []

	for char in list(content_type):

		if len(transitions) > 0:
			state = transitions[-1][1]

		if char in grammar[state]:
			transitions.append( (char, grammar[state][char]) )
		else:
			print(transitions)
			return Failure('"%s" not allowed in content-type header (%s)' % (char, state))

	return Success( [trans for trans in transitions if not trans[1].startswith('_')] )





def parse(lexeme):

	tokens = []

	for char_state in lexeme:

		if tokens and tokens[-1] and tokens[-1][-1][1] == char_state[1]:
			tokens[-1].append(char_state)
		else:
			tokens.append([char_state])

	labelled = []

	for token in tokens:

		labelled.append({
			token[0][1]: ''.join([char_state[0] for char_state in token])
		})

	return labelled





#print(lex( "text/html; charset=utf-8" ))
#print(lex( "application/java-archive" ))
#print(lex( "text/html; charset=windows-874" ))
#print(lex( "application/xhtml+xml; charset=utf-8" ))
#print(lex( "application/xml; charset=ISO-8859-1" ))
#print(lex( "application/xhtml+xml; charset=utf-8" ))
#print(lex( "application/x-web-app-manifest+json" ))
#print(parse(lex( 'multipart/x-mixed-replace; boundary="testingtesting";	charset=utf-8' )))




res = (
	Success('multipart/x-mixed-replace; boundary="testingtesting";	charset=utf-8')
	.then(lex)
	.then(parse)
)

print(res)











def tokenise_parametre(param):
	# -- split on = not surrounded by quotes.
	return re.compile('(?<![\'\"])[=](?![\'\"])').split(param)

def tokenise_mimetype(content_type):

	# -- split on / or ; not surrounded by quotes.
	parts = re.compile('(?<![\'\"])[/](?![\'\"])|(?<![\'\"])[;]+(?![\'\"])').split(content_type)

	return parts[:2] + [tokenise_parametre(param) for param in parts[2:]]





def parse_mimetype_tokens(tokens):
	"""
	currently doesn't check if tokens have correct character set.
	"""

	types = {'application', 'audio', 'example', 'image', 'message', 'model', 'multipart', 'text', 'video'}

	if tokens[0] not in types:
		if not tokens[0].startswith('x-'):
			return Failure('unrecognised content type ' + tokens[0] + '.')
	else:

		# -- this copes with (malformed?) mimetypes of the form text/html;
		params = [pair for pair in tokens[2:] if len(pair) is 2]

		return {
			'type':    tokens[0],
			'subtype': tokens[1],
			'params':  {key: val for (key, val) in params}
		}






def parse(content_type):
	return parse_mimetype_tokens(tokenise_mimetype(content_type))
