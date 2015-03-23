#!/usr/bin/env python3

import sql
import utils

from result           import Success, Failure
from extract_metadata import extract_metadata

from normalise_uri    import normalise_uri

import urllib
from bookmark         import bookmark, getID
from display_result   import display_result

from flask            import jsonify
from save_bookmark    import save_bookmark

import urllib.parse



def resave_bookmark(db, entity_body):
	"""save a bookmark to a database.
	"""

	# -- TODO fix this; refactor to use Result types.

	bookmarks_result = (
		Success(entity_body)
		.then(lambda body: body['data'].values( ))
	)

	for bookmark in entity_body['data'].values( ):

		url   = bookmark['url']
		ctime = bookmark['ctime']

		url   = urllib.parse.unquote(url)
		ctime = int(ctime)

		save_bookmark(db, url, ctime)
