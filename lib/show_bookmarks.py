#!/usr/bin/env python

import sql
import html

from result import Success, Failure
from urlparse import urlparse
from bookmark import bookmark

import datetime
import utils

import css
import js





static_files = {
	'javascript-head': [
	],

	'javascript-bottom': [
		js.jQuery,

		js.cache,
		js.modifyCache,

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
