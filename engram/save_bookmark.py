#!/usr/bin/env python3

import sql
import utils

from result           import Success, Failure
from extract_metadata import extract_metadata
from archive_url      import archive_url

from normalise_uri import normalise_uri

import urllib
from bookmark import bookmark, getID





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
		.then( lambda title: [db, title, url, utils.now()] )
		.then( lambda data: sql.insert_bookmark(data[0], data[1], data[2], data[3]) )
	)

	if insert_result.is_failure():

		message = "failed to add %s: '%s'" % (url, insert_result.from_failure())
		return message, 500

	else:
		return '', 204
