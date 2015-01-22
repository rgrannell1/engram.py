#!/usr/bin/env python

import sql
import html

from result import Success, Failure
from urlparse import urlparse
from bookmark import bookmark

import datetime
import utils

import static





dependencies = {
	'javascript-head': static.loadJS([

	]),

	'javascript-bottom': static.loadJS([
		"jquery",
		"jquery-viewport",
		"mustache",
		"is",

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
		.then(lambda rows: html.index(dependencies))
	)

	if html_result.is_success():
		return html_result.from_success(), 200
	else:
		return "something went terribly wrong!", 500
