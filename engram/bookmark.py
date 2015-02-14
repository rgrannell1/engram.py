#!/usr/bin/env python3

import urllib
from normalise_uri import normalise_uri

from result import Success, Failure





def bookmark(row):

	# -- todo fix load order.

	return (
		Success(row[2])
		.then(urllib.parse.urlparse)
		.then(lambda parse_data: (
			parse_data if parse_data.scheme else Failure( 'loaded invalid uri "%s"' % (row[2]) ))
		)
		.then(lambda parse_data: {
			'bookmark_id': row[0],
			'url':         row[2],
			'title':       row[1],
			'ctime':       row[3],

			'hostname':    parse_data.hostname,
			'hosturl':     parse_data.scheme + '://' + parse_data.hostname
		})
	)





def getID(bookmark):

	if 'bookmark_id' in bookmark:
		return bookmark['bookmark_id']
	else:
		raise Exception('no key "bookmark_id" found in bookmark object.')
