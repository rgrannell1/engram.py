#!/usr/bin/env python3

from result import Ok, Err, Result
from flask  import Flask, redirect, url_for, request, jsonify

from bookmark import bookmark, getID

import sql

import logging
logging.basicConfig(level =  logging.INFO)
logger = logging.getLogger(__name__)






def parse_bookmarks(rows):

	bookmark_results = [bookmark(row) for row in rows]

	fails     = [bookmark for bookmark in bookmark_results if bookmark.is_err( )]
	successes = [bookmark for bookmark in bookmark_results if bookmark.is_ok( )]

	if len(fails) > 0:
		logger.warning('failed to reparse %d bookmarks', len(fails))

	return Ok(successes).product_of( )





def fetch_chunk(db, max_id, amount):
	"""send a certain number of bookmarks from an id offset to the client.
	"""

	logging.info('fetch_chunk: %d %d' % (max_id, amount))

	return (
		Result.of(lambda: sql.fetch_chunk(db, max_id, amount))
		.then(parse_bookmarks)
		.then(lambda data: {
			'data':    data,
			'next_id': getID(min(data, key = getID)) - 1 if data else max_id
		})
		.then(jsonify)
	)
