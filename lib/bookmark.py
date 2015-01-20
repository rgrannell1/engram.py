#!/usr/bin/env python

from urlparse import urlparse

def bookmark(row):

	hostname = urlparse(row[2]).hostname

	return {
		'bookmark_id': row[0],
		'title':       row[1],
		'url':         row[2],
		'ctime':       row[3],
		'hostname':    hostname,
		'hosturl':     'http://' + hostname # not idempotent.
	}

def getID(bookmark):
	return bookmark['bookmark_id']
