#!/usr/bin/env python3

import sql
import utils

from result           import Success, Failure
from extract_metadata import extract_metadata

from normalise_uri    import normalise_uri

import urllib
from bookmark         import bookmark, getID
from display_result   import display_result




def save_bookmark(db, url, time):
	"""save a bookmark to a database.

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
		.then( lambda title: (db, url, title, time) )
		.tap(  lambda data:  sql.insert_bookmark(*data) )
		.then( lambda data: {
			'message': '',
			'code':    204
		})
	)

	return display_result(insert_result)
