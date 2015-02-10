#!/usr/bin/env python3

import sql
import utils

from result           import Success, Failure
from extract_metadata import extract_metadata
from archive_url      import archive_url

from normalise_uri import normalise_uri

import urllib
from bookmark import bookmark, getID





def handle_save_result(result):
	"""report errors to the client, if they occurred."""

	if result.is_failure():

		failure = result.from_failure()

		if isinstance(failure, dict):
			return failure['message'], failure['code']
		else:
			return "failed to add %s: '%s'" % (url, failure), 500

	else:
		return '', 204





def save_bookmark(db, url):
	"""save a bookmark to a database.

	save_bookmark :: Result Database x string -> string, number

	this is triggered by a GET request, so it has perverse
	behaviour. It returns a 204 when the save succeeds so the
	browser doesn't leave the current page.

	This is bad when you are already on the page generated upon
	failure, and then you get the result right it doesn't update.
	"""

	title_result  = (
		Success(url)
		.then(normalise_uri)
		.then(extract_metadata)
	)

	insert_result = (
		title_result
		.then( lambda title: (db, title, url, utils.now()) )
		.then( lambda data:  sql.insert_bookmark(*data) )
	)

	return handle_save_result(insert_result)
