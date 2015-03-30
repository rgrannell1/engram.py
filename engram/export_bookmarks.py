#!/usr/bin/env python3

import pages

from result         import Success, Failure, Result
from display_result import display_result
from fetch_chunk    import fetch_chunk

from bookmark import bookmark, getID
import sql

import logging
logging.basicConfig(level =  logging.INFO)
logger = logging.getLogger(__name__)





def parse_bookmarks(rows):
	return Result.of(lambda: [bookmark(row) for row in rows]).product_of( )





def export_bookmarks(db):

	logger.info('exporting bookmarks.')

	bookmark_result = (
		Result.of(lambda: sql.fetch_chunk(db, 1000000, 1000000))
		.then(parse_bookmarks)
	)

	page_result = (
		bookmark_result
		.then( lambda bookmark: pages.export({'bookmark': bookmark}) )
		.then(lambda html: {
			'message': html,
			'code':    200
		})

	)

	return display_result(page_result)
