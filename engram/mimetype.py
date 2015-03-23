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

	'subtype': dict({
		';': '_SPACE',
	},
	**{key: 'subtype' for key in token_char}),





	'attribute': dict({
		'=': '_EQUAL',
	},
	**{key: 'attribute' for key in token_char}),





	'single-quoted': dict({
		"'": '_SPACE'
	},
	**{key: 'single-quoted' for key in ascii if key != "'"}),

	'double-quoted': dict({
		'"': '_SPACE'
	},
	**{key: 'double-quoted' for key in ascii if key != '"'}),

	'unquoted': dict({
		';': '_SPACE'
	},
	**{key: 'unquoted' for key in token_char}),





	'_SLASH': {key: 'subtype' for key in token_char},

	'_EQUAL': dict({
		'"': 'double-quoted',
		"'": 'single-quoted'
	},

	**{key: 'unquoted' for key in token_char}),

	'_SPACE': dict({
		';':   '_SPACE',
		' ':   '_SPACE',
		'\t':  '_SPACE',
		'\n':  '_SPACE',
	},

	**{key: 'attribute' for key in token_char})

}





def lex(content_type):
	"""
	# http://tools.ietf.org/html/rfc2045#page-10
	"""

	state       = 'type'
	transitions = []

	for char in content_type:

		if len(transitions) > 0:
			state = transitions[-1][1]

		if char in grammar[state]:
			transitions.append( (char, grammar[state][char]) )
		else:
			return Failure('"%s" not allowed in content-type header (%s)' % (char, state))

	return Success( [trans for trans in transitions if not trans[1].startswith('_')] )






def label(lexeme):

	tokens = []

	for char_state in lexeme:

		if tokens and tokens[-1] and tokens[-1][-1][1] == char_state[1]:
			tokens[-1].append(char_state)
		else:
			tokens.append([char_state])

	labelled = []

	for token in tokens:

		label = token[0][1]
		text  = ''.join([char_state[0] for char_state in token])

		if label == 'double-quoted':
			text += '"'
		elif label == 'single-quoted':
			text += "'"

		labelled.append((label, text))

	return labelled




def parse_lexeme(lexeme):

	labels = label(lexeme)
	types  = {'application', 'audio', 'example', 'image', 'message', 'model', 'multipart', 'text', 'video'}

	if not labels[0][0].lower() in types:
		return Failure('invalid content type "%s"' % labels[0][0].lower())

	params  = {}
	options = labels[2:]

	if not len(options) % 2 == 0:
		return Failure('no argument value supplied to final parametre.')

	for ith in range(0, len(options), 2):
		params[options[ith][0]] = options[ith + 1][0]

	return Success({
		'type':    labels[0][0].lower(),
		'subtype': labels[1][0].lower(),
		'params':  params
	})





def parse(content_type):
	"""parse the Content-Type header.
	"""
	return (
		Success(content_type)
		.then(lex)
		.then(label)
		.then(parse_lexeme)
	)





def is_html(type):
	""""determine whether a mimetype says a resource is a html
	file.
	"""

	return type in {'text/html', 'application/xhtml+xml'}




def is_pdf(type):
	return type in {'application/pdf', 'application/x-pdf'}
