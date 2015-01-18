#!/usr/bin/env python

import sql
import html

from result import Success, Failure
from urlparse import urlparse
import datetime



def bookmark(row):

	hostname = urlparse(row[2]).hostname

	return {
		'bookmark_id': row[0],
		'title':       row[1],
		'url':         row[2],
		'ctime':       datetime.datetime.fromtimestamp(row[3]).strftime('%Y %B %d'),
		'hostname':    hostname,
		'hosturl':     'http://' + hostname
	}






def show_bookmarks(criterea_result, db_result):

	search_result = (

		criterea_result
		.cross(db_result)
		.then( lambda pair: sql.select_bookmarks(pair[0], pair[1]) )
		.then( lambda rows: [bookmark(row) for row in rows] )

	)

	html_result = (
		search_result
		.then( lambda rows: html.index({'bookmarks': rows}) )
	)

	return html_result.value

