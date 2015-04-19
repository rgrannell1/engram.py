#!/usr/bin/env python3

import urllib
from normalise_uri import normalise_uri

from result import Ok, Err, Result




def revalidate_bookmark(row):

	if not isinstance(row[0], int):
		return Err('non-integer bookmark id %d' % (row[0], ) )
	elif row[0] < 0:
		return Err('negative bookmark id %d' % (row[0], ))

	if not isinstance(row[3], int):
		return Err('non-integer timestamp %d' % (row[3], ) )
	elif row[3] < 0:
		return Err('negative timestamp %d' % (row[3], ))

	if not isinstance(row[1], str):
		return Err('non-string url %d' % (row[2], ))

	if not isinstance(row[2], str):
		return Err('non-string title %d' % (row[2], ))

	parsed = urllib.parse.urlparse(row[1])

	if not parsed.scheme and not parsed.netloc:
		return Err('url field appeared to contain invalid url %s' % (row[1],))





def bookmark(row):

	return (
		Ok(row)
		.tap(revalidate_bookmark)
		.then( lambda row: urllib.parse.urlparse(row[1]) )
		.then(lambda parse_data: {
			'bookmark_id': row[0],
			'url':         row[1],
			'title':       row[2],
			'ctime':       row[3],

			'hostname':    parse_data.netloc,
			'hosturl':     parse_data.scheme + '://' + parse_data.netloc
		})
	)





def getID(bookmark):

	if 'bookmark_id' in bookmark:
		return bookmark['bookmark_id']
	else:
		raise Exception('no key "bookmark_id" found in bookmark object.')
