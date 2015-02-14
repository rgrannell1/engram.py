#!/usr/bin/env python3

from result import Success, Failure
from flask  import Flask, redirect, url_for, request, jsonify

from bookmark import bookmark, getID

import sql

import logging
logging.basicConfig(level =  logging.INFO)
logger = logging.getLogger(__name__)






def handle_fetch_result(result):

	if result.is_failure():

		failure = result.from_failure()

		if isinstance(failure, dict):
			return failure['message'], failure['code']
		else:
			return "failed to fetch", 500

	else:
		return '', 200









def fetch_chunk(db, max_id, amount):
	"""send a certain number of bookmarks from an id offset to the client.
	"""

	logging.info('fetch_chunk: %d %d' % (max_id, amount))

	# -- fix this crap.
	if max_id < 0:
		return handle_fetch_result( Failure({
			'message': 'max_id must be larger than zero.',
			'code':    422
		}) )

	if amount < 0:
		return handle_fetch_result( Failure({
			'message': 'amount must be larger than zero.',
			'code':    422
		}) )

	if max_id > 9223372036854775807:
		# -- good to have an upper limit on fields.
		return handle_fetch_result( Failure({
			'message': 'max_id was too large.',
			'code':    422
		}) )

	if amount > 9223372036854775807:
		# -- good to have an upper limit on fields.
		return handle_fetch_result( Failure({
			'message': 'amount was too large.',
			'code':    422
		}) )






	fetch_result = (
		Success(db)
		.then(lambda db:   sql.fetch_chunk(db, max_id, amount))
		.then(lambda rows: Success([bookmark(row) for row in rows]).productOf())
		.then(lambda data: {
			'data':    data,
			'next_id': getID(min(data, key = getID)) - 1 if data else max_id
		})
		.then(jsonify)
	)


	return handle_fetch_result(fetch_result)
