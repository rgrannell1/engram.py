#!/usr/bin/env python3

import pages

from result         import Success, Failure
from display_result import display_result
from fetch_chunk    import fetch_chunk





def export_bookmarks(db):

	page_result = (

		pages.export()
		.then(lambda html: {
			'message': html,
			'code':    200
		})

	)

	return display_result(page_result)
