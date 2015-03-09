#!/usr/bin/env python3

import pages

from result         import Success, Failure
import static
from display_result import display_result





dependencies = {
	'javascript-head': static.loadJS([

	]),

	'javascript-bottom': static.loadJS([
		"jquery",
		"mustache",
		"is",
		"require",
		"pubsub",

		"engram",
		"sync-bookmarks",
		"delete-bookmark",
		"new",
		"update-time",
		"search",
		"main"
#
#		"cache",
#		"modify-cache",
#
#		"update-times",
#		"draw-bookmarks",
#
#		"keylog",
#		"delete-bookmark",
#		"search"
	]),

	'css': static.loadCSS([
		"style"
	])
}





def show_bookmarks():
	"""
	return a html page showing the user's bookmarks.

	show_bookmarks :: Database -> string, number.
	"""

	page_result = (

		pages.index(dependencies)
		.then(lambda html: {
			'message': html,
			'code':    200
		})

	)

	return display_result(page_result)
