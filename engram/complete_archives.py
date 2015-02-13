#!/usr/bin/env python3

import sql
import utils

from result import Success, Failure

import logging
logging.basicConfig(level =  logging.INFO)
logger = logging.getLogger(__name__)





def select_unarchived_bookmarks(db):
	""" """

	logger.info('fetching unarchived bookmarks.')

	return (
		Success(db)
		.then(lambda db: sql.select_unarchived_bookmarks(db))
	)





def complete_archives(db):
	""" given the database, finish creating archives for every bookmark.  """

	logger.info('completing archives.')

	# find bookmarks that didn't fail, and aren't bookmarked.

	unarchived_result = select_unarchived_bookmarks(db)
	print(unarchived_result)

	# find unarchived urls
	# for each , try archive
