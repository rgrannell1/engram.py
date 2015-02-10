#!/usr/bin/env python3

import re
from result import Success, Failure





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
