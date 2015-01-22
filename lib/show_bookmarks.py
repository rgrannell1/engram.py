#!/usr/bin/env python

import html

from result import Success, Failure
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





def show_bookmarks(db_result):
	"""
	return a html page showing the user's bookmarks.

	show_bookmarks :: Database -> string, number

	.
	"""

	html_result = html.index(dependencies)

	if html_result.is_success():
		return html_result.from_success(), 200
	else:
		return "something went terribly wrong!", 500
