#!/usr/bin/env python3

import sql
from result         import Ok, Err, Result
from display_result import display_result





def delete_bookmark(db, id):
	"""
	delete_bookmark :: Result Database x number -> string, number

	try to delete a bookmark from the database by id.
	"""

	delete_result = (
		Result.of(lambda: sql.delete_bookmark(db, id))
		.then(lambda _: {
			'message': '',
			'code':    204
		})
	)

	return display_result(delete_result)
