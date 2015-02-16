#!/usr/bin/env python3

import pages

from result         import Success, Failure
from display_result import display_result
from fetch_chunk    import fetch_chunk

from bookmark import bookmark, getID
import sql





def parse_bookmarks(rows):
	return Success([bookmark(row) for row in rows]).productOf()





def export_bookmarks(db):

	bookmark_result = (
		Success(db)
		.then(lambda db:   sql.fetch_chunk(db, max_id, amount))
		.then(parse_bookmarks)
	)

	page_result = (
		bookmark_result
		.then(lambda bookmark: pages.export({
			'bookmark': bookmark
		}))
		.then(lambda html: {
			'message': html,
			'code':    200
		})

	)

	return display_result(page_result)
