#!/usr/bin/env python3

import pages

from result         import Success, Failure, Result
import static
from display_result import display_result





dependencies = {
	'javascript-head': static.loadJS([

	]),

	'javascript-bottom': static.loadJS([
		"lib-jquery",
		"lib-mustache",
		"lib-is",
		"lib-require",

		"pubsub",
		"engram",
		"cache",
		"update-query",
		"update-time",
		"sync-bookmarks",
		"delete-bookmark",
		"draw-bookmarks",
		"search",
		"main"

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
