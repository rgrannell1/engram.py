
import sql
from result import Success, Failure





def delete_bookmark(db_result, id):

	delete_result = (
		Success(id)
		.then(lambda id: sql.delete_bookmark(db_result, id))
	)

	return "", 204
