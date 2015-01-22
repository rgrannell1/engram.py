
import sql
from result import Success, Failure





def delete_bookmark(db_result, id):
	"""
	delete_bookmark :: Result Database x number -> string, number

	try to delete a bookmark from the database by id.
	"""

	delete_result = (
		Success(id)
		.then(lambda id: sql.delete_bookmark(db_result, id))
	)

	if delete_result.is_success():
		return "", 204
	else:
		print delete_result
		return "", 500
