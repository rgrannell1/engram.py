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





def process_ctime(ctime):

	try:
		ctime = int(ctime)
	except Exception as err:
		return Failure(err)
	else:
		if ctime < 0:
			return Failure({
				'message': 'ctime must be larger than zero.',
				'code':    422
			})
		elif ctime > 2147483647:
			return Failure({
				'message': 'ctime must be less than the largest UNIX date.',
				'code':    422
			})
		else:
			return ctime



def resave_bookmark(db, url, entity_body):
	"""save a bookmark to a database.
	"""

	ctime_result  = (
		Success(entity_body)
		.then(lambda body: body['ctime'])
		.then(process_ctime)
	)

	title_result  = (
		Success(url)
		.then(normalise_uri)
		.then(extract_metadata)
	)

	insert_result = (
		title_result
		.then( lambda title: (db, url, title, ctime_result.from_success()) )
		.tap(  lambda data:  sql.insert_bookmark(*data) )
		.then( lambda data: {
			'message': jsonify(''), # -- todo return entity.
			'code':    201
		})
	)

	return display_result(insert_result, )
