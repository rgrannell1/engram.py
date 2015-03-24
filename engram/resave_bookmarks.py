#!/usr/bin/env python3

import sql
import utils

from result           import Success, Failure, Result
from extract_metadata import extract_metadata

from normalise_uri    import normalise_uri

import urllib
from bookmark         import bookmark, getID
from display_result   import display_result

from flask            import jsonify
from save_bookmark    import save_bookmark

import urllib.parse
import time




def resave_bookmark(bookmark, db):

	return (

		Result.of(lambda: (
			urllib.parse.unquote(bookmark['url']),
			int(bookmark['ctime'])
		))
		.then(lambda data: save_bookmark(db, *data))

	)






def resave_bookmarks(db, body):
	"""save a bookmark to a database.
	"""

	# -- TODO fix this; refactor to use Result types.
	# -- needs serious work.
	#

	fn = lambda dict: int(dict['ctime'])

	bookmarks_result = Result.of( lambda: [body['data'][key] for key in body['data']] )

	importable_result = (
		bookmarks_result
		.then(lambda bookmarks: [book for book in bookmarks if isinstance(book, dict)])
		.then(lambda bookmarks: [book for book in bookmarks if 'ctime' in book and 'url' in book])
	)

	imports = importable_result.from_success( )
	imports.sort(key = fn)

	for bookmark in imports:
		resave_bookmark(bookmark, db)
