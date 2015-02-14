#!/usr/bin/env python3

from result import Success, Failure
from flask  import Flask, redirect, url_for, request, jsonify

from bookmark import bookmark, getID

import sql

import logging
logging.basicConfig(level =  logging.INFO)
logger = logging.getLogger(__name__)










def fetch_chunk(db, max_id, amount):
	"""send a certain number of bookmarks from an id offset to the client.
	"""

	logging.info('fetch_chunk: %d %d' % (max_id, amount))

	if max_id < 0:
		return Failure({
			'message': 'max_id must be larger than zero.',
			'code':    422
		})

	if amount < 0:
		return Failure({
			'message': 'amount must be larger than zero.',
			'code':    422
		})

	if max_id > 9223372036854775807:
		# -- good to have an upper limit on fields.
		return Failure({
			'message': 'max_id was too large.',
			'code':    422
		})

	if amount > 9223372036854775807:
		# -- good to have an upper limit on fields.
		return Failure({
			'message': 'amount was too large.',
			'code':    422
		})






	fetch_result = (
		Success(db)
		.then(lambda db:   sql.fetch_chunk(db, max_id, amount))
		.then(lambda rows: Success([bookmark(row) for row in rows]).productOf())
		.tap(print)
		.then(lambda data: {
			'data':    data,
			'next_id': getID(min(data, key = getID)) - 1 if data else max_id
		})
		.then(jsonify)
	)

	if fetch_result.is_success():
		return fetch_result.from_success(), 200
	else:
		print(fetch_result.from_failure())
		return '', 500
