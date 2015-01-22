#!/usr/bin/env python

from result   import Success, Failure
from cache    import Cache

from bookmark import bookmark, getID
import sql





def fill_cache(db_result):
	"""fill_cache :: Result Database -> Result Cache

	given a database result, extract each row and
	insert it into a cache object.
	"""

	return (
		Success(db_result)
		.then(sql.select_bookmarks)
		.then(lambda rows: [bookmark(row) for row in rows])
		.then(Cache(getID).addAll)
	)
