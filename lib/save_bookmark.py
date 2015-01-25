#!/usr/bin/env python

import html
import sql
import utils

from result           import Success, Failure
from extract_metadata import extract_metadata

from urlparse         import urlparse
from bookmark import bookmark, getID





def save_bookmark(db, cache, url):
	"""save a bookmark to a database.

	save_bookmark :: Result Database x string -> string, number

	this is triggered by a GET request, so it has perverse
	behaviour. It returns a 304 when the save succeeds so the
	browser doesn't leave the current page.

	This is bad when you are already on the page generated upon
	failure, and then you get the result right it doesn't update.
	"""


	# -- todo clean up this nastiness.
	title_result  = (
		Success(url)
		.tap(urlparse)
		.then(extract_metadata)
		.then( lambda title: [db, title, url, utils.now()] )
	)

	insert_result = (
		title_result
		.then( lambda data: sql.insert_bookmark(data[0], data[1], data[2], data[3]) )
		.then( lambda  row: list(row)[0][0] )
	)

	cache_result = (
		title_result
		.then( lambda data: [insert_result.from_success()] + data[1:] )
		.then( lambda data: cache.add(bookmark(data) ))
	)


	# -- todo RETURN THE INSERTED ROW AND ADD TO CACHE.

	if cache_result.is_failure():

		message = "failed to add %s: '%s'" % (url, insert_result.from_failure())
		return message, 500

	else:
		return '', 304
