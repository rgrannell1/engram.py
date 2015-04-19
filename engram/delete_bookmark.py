#!/usr/bin/env python3

import sql
from result         import Ok, Err, Result
from display_result import display_result
from db       import Database, WriteJob, ReadJob




# -- hack
id_fn = id




def delete_bookmark(database_in, database_out, id):
	"""
	delete_bookmark :: Result Database x number -> string, number

	try to delete a bookmark from the database by id.
	"""

	job = WriteJob(
		"DELETE FROM bookmarks WHERE bookmark_id = ?",
		(id, ))


	database_in.put(job)

	delete_result = (

		Result.of( lambda: database_out[id_fn(job)] )
		.then(lambda _: {
			'message': '',
			'code':    204
		})

	)

	return display_result(delete_result)
