#!/usr/bin/env python3

import pages

from result         import Success, Failure
import static
from display_result import display_result




dependencies = {
	'javascript-head': static.loadJS([

	]),

	'javascript-bottom': static.loadJS([
		'lib-jquery',
		'lib-is',
		'import-bookmarks'
	])
}

def restore_bookmarks(db):

	page_result = (

		pages.restore(dependencies)
		.then(lambda html: {
			'message': html,
			'code':    200
		})

	)

	return display_result(page_result)
