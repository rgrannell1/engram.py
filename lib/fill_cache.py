#!/usr/bin/env python

from result import Success, Failure
from cache  import Cache

import bookmark
import sql





def fill_cache(db_result):

	return (
		Success(db_result)
		.then(sql.select_bookmarks)
		.then(lambda rows: [bookmark.bookmark(row) for row in rows])
		.then(Cache(bookmark.getID).addAll)
	)
