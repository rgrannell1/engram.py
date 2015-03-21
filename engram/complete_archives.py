#!/usr/bin/env python3

import sql
import utils

from result          import Success, Failure
from archive_webpage import archive_webpage

import mimetype
from request_url     import request_url

from bookmark        import bookmark, getID

import logging
logging.basicConfig(level =  logging.INFO)
logger = logging.getLogger(__name__)





def select_unarchived_bookmarks(db):
	""" select the bookmark ids that aren't archived, and didn't cause
	a failure when trying to archive."""

	logger.info('fetching unarchived bookmarks.')

	return (
		Success(db)
		.then(sql.select_unarchived_bookmarks)
		.then(lambda ids: (id[0] for id in ids))
	)





def archive_webpage(url):
	""" save the contents of an arbitrary resource to a string giving a valid
	tar-gz file.  """

	logger.info('downloading %s' % (url, ))





def save_content(db, id, row, response):
	"""save the content to the database"""

	content_type_result = mimetype.parse(response.headers['content-type'])

	if content_type_result.is_failure( ):
		return content_type_result
	else:

		content_type = content_type_result.from_success( )
		mime         = content_type['type'] + '/' + content_type['subtype']

		if mimetype.is_pdf(mime):
			# -- pdf's can be saved directly to the database.

			sql.insert_archive(db, id, response.content, response.headers['content-type'], utils.now( ))

		elif mimetype.is_html(mime):
			# -- html is harder to save.
			pass
		else:
			pass




def archive_bookmark(db, id):
	"""  attempt to archive the contents of a particular website """

	# -- load the uri from the database.
	# ---- if it doesn't exist, just exit (likely deleted)
	# ---- otherwise DL the page
	# ----

	archive_result = (
		Success(db)
		.then(lambda db: sql.select_bookmark(db, id))
		.then(lambda row: bookmark(row[0]))
		.then( lambda row: [
			row,
			request_url(row['url'])
		] )
		.then(lambda tuple: save_content(db, id, *tuple))
	)

	return Success(None)




def archive_bookmarks(db, ids):
	""" try to archive each bookmark. """

	archive_result = (
		Success(None)
		.cross([archive_bookmark(db, id) for id in ids])
	)

	if archive_result.is_success( ):
		return Success(None)
	else:
		return archive_result





def complete_archives(db):
	""" given the database, finish creating archives for every bookmark.  """

	logger.info('completing archives.')

	return (
		Success(db)
		.then(select_unarchived_bookmarks)
		.then(lambda ids: archive_bookmarks(db, ids))
	)



	# for each, try to archive the bookmarked content.
