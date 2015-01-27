#!/usr/bin/env python3

import urllib





def bookmark(row):

	if len(row) < 4:
		raise Exception("bookmark row too short.")

	try:
		parse_data = urllib.parse.urlparse(row[2])

	except Exception as err:
		raise err
	else:
		# this won't work for all URI schemes.

		return {
			'bookmark_id': row[0],
			'title':       row[1],
			'url':         row[2],
			'ctime':       row[3],
			'hostname':    parse_data.hostname,
			'hosturl':     parse_data.scheme + '://' + parse_data.hostname
		}





def getID(bookmark):

	if 'bookmark_id' in bookmark:
		return bookmark['bookmark_id']
	else:
		raise Exception('no key "bookmark_id" found in bookmark object.')
