
import sql
from result import Success, Failure





def delete_bookmark(conn, id):

	delete_result = (
		Success(id)
		.then(lambda id: sql.delete_bookmark(conn, id))
	)

	return "", 204
