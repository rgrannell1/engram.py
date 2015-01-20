#!/usr/bin/env python

import sql
import html

from result import Success, Failure
from urlparse import urlparse
import datetime
import utils

import css
import js





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






static_files = {
	'javascript-head': [
		js.jQuery
	],

	'javascript-bottom': [
		js.updateTimes,
		js.linkTabHighlight,
		js.deleteBookmark
	],

	'css': [
		css.style
	]
}




"""
show_bookmarks :: Database -> string, number


"""

def show_bookmarks(db_result):

	search_result = (

		db_result
		.then(sql.select_bookmarks)
		.then( lambda rows: [bookmark(row) for row in rows] )

	)

	html_result = (
		search_result
		.then( lambda rows: html.index(dict({'bookmarks': rows}, **static_files)) )
	)

	return html_result.from_success() ## --dangerous
