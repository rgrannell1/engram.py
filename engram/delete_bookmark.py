#!/usr/bin/env python3

import sql
from result import Success, Failure





def delete_bookmark(db, id):
	"""
	delete_bookmark :: Result Database x number -> string, number

	try to delete a bookmark from the database by id.
	"""

	delete_result = (
		Success(id)
		.tap( lambda id: sql.delete_bookmark(db, id))
	)

	if delete_result.is_success():
		return "", 204
	else:
		print(delete_result)
		return "", 500
