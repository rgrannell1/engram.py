#!/usr/bin/env python3

import pages

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

		"update-times",
		"draw-bookmarks",
		"link-tab-highlight",

		"delete-bookmark",

		"choose",
		"search"
	]),

	'css': static.loadCSS([
		"style"
	])
}





def show_bookmarks():
	"""
	return a html page showing the user's bookmarks.

	show_bookmarks :: Database -> string, number

	.
	"""

	html_result = pages.index(dependencies)

	if html_result.is_success():
		return html_result.from_success(), 200
	else:
		return "something went terribly wrong!", 500
