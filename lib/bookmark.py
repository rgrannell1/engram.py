#!/usr/bin/env python

from urlparse import urlparse





def bookmark(row):

	if len(row) < 4:
		raise Exception("bookmark row too short.")

	try:
		hostname = urlparse(row[2]).hostname
	except Exception, err:
		raise err
	else:
		return {
			'bookmark_id': row[0],
			'title':       row[1],
			'url':         row[2],
			'ctime':       row[3],
			'hostname':    hostname,
			'hosturl':     row[2]
		}





def getID(bookmark):

	if 'bookmark_id' in bookmark:
		return bookmark['bookmark_id']
	else:
		raise Exception('no key "bookmark_id" found in bookmark object.')
