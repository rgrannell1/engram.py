#!/usr/bin/env python3

from result import Success, Failure
from flask  import Flask, redirect, url_for, request, jsonify

from bookmark import bookmark, getID

import sql

import logging
logging.basicConfig(level =  logging.INFO)
logger = logging.getLogger(__name__)






def parse_bookmarks(rows):
	return Success([bookmark(row) for row in rows]).productOf()





def fetch_chunk(db, max_id, amount):
	"""send a certain number of bookmarks from an id offset to the client.
	"""

	logging.info('fetch_chunk: %d %d' % (max_id, amount))

	return (
		Success(db)
		.then(lambda db:   sql.fetch_chunk(db, max_id, amount))
		.then(parse_bookmarks)
		.then(lambda data: {
			'data':    data,
			'next_id': getID(min(data, key = getID)) - 1 if data else max_id
		})
		.then(jsonify)
	)
