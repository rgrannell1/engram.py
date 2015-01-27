#!/usr/bin/env python3

from result import Success, Failure
from flask  import Flask, redirect, url_for, request, jsonify

from bookmark import bookmark, getID

import sql



def fetch_chunk(db, max_id, amount):

	fetch_result = (
		Success(db)
		.then(lambda db:   sql.fetch_chunk(db, max_id, amount))
		.then(lambda rows: [bookmark(row) for row in rows])
		.then(lambda data: {
			'data':    data,
			'next_id': getID(min(data, key = getID)) - 1
		})
		.then(jsonify)
	)

	if fetch_result.is_success():
		return fetch_result.from_success(), 200
	else:
		print(fetch_result.from_failure())
		return '', 500
