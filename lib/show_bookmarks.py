#!/usr/bin/env python

import sql
import html

from result import Success, Failure
from urlparse import urlparse
from bookmark import bookmark

import datetime
import utils

import css
import static





static_files = {
	'javascript-head': [
	],

	'javascript-bottom': static.loadJavascript([
		"jquery",
		"mustache",
		"is"

		"engram",

		"cache",
		"modify-cache",

		"draw-bookmarks",
		"update-times",
		"link-tab-highlight",

		"delete-bookmark"

	]),

	'css': static.loadCSS([
		"style"
	])
}




"""
show_bookmarks :: Database -> string, number


"""

def show_bookmarks(db_result):

	search_result = (

		db_result
		.then(sql.select_bookmarks)
		.then( lambda rows: [bookmark(row) for row in rows[1:100]] )

	)

	html_result = (
		search_result
		.then( lambda rows: html.index(dict(**static_files)) )
	)

	if html_result.is_failure():
		return "arrgh!", 500
	else:
		return html_result.from_success(), 200
