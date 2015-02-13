#!/usr/bin/env python3

from utils    import ensure
from result   import Success, Failure
import urllib
import httplib2

from normalise_uri import normalise_uri





def create_tables(db):

	create_table_archives = """
	CREATE TABLE IF NOT EXISTS archives (

		archive_id    integer     PRIMARY KEY    AUTOINCREMENT,

		content       text        NOT NULL,
		ctime         integer     NOT NULL

	);
	"""

	create_table_bookmarks = """
	CREATE TABLE IF NOT EXISTS bookmarks (

		bookmark_id    integer    PRIMARY KEY    AUTOINCREMENT,

		url            text       NOT NULL,
		title          text       NOT NULL,
		ctime          integer    NOT NULL

	);
	"""

	create_table_bookmark_archives = """
	CREATE TABLE IF NOT EXISTS bookmark_archives (

		bookmark_archive_id    integer    PRIMARY KEY    AUTOINCREMENT,

		bookmark_id            REFERENCES bookmarks(bookmark_id),
		archive_id             REFERENCES archives(archive_id)

	);
	"""

	create_table_failed_archive_jobs = """
	CREATE TABLE IF NOT EXISTS failed_archive_jobs (

		failed_archive_job_id    integer    PRIMARY KEY    AUTOINCREMENT,
		bookmark_id              REFERENCES bookmarks(bookmark_id)

	);
	"""

	return (

		Success(db)
		.tap(lambda db: db.commit(create_table_archives))
		.tap(lambda db: db.commit(create_table_bookmarks))
		.tap(lambda db: db.commit(create_table_bookmark_archives))
		.tap(lambda db: db.commit(create_table_failed_archive_jobs))

	)





def insert_bookmark(db, title, url, ctime):

	sql = """
	INSERT INTO bookmarks VALUES (NULL, ?, ?, ?);
	"""

	assert isinstance(title, str),          "title was not a string."
	assert isinstance(url,   str),          "url was not a string."

	assert normalise_uri(url).is_success(), "inserting invalid bookmark uri."

	assert isinstance(ctime, int),          "ctime was not a number."
	assert ctime      > 0,                  "ctime was a nonpositive value."

	assert len(title) > 0,                  "attempted to insert empty title."
	assert len(url)   > 0,                  "attempted to insert empty url."




	return (
		Success(db)
		.tap(lambda _:   normalise_uri(url))
		.tap( lambda db: db.commit(sql, (url, title, ctime)) )
	)







def insert_archive(db, url, content, ctime):

	sql = """
	INSERT INTO archives VALUES (NULL, ?, ?);
	"""

	assert isinstance(url,   str),          "url was not a string."
	assert normalise_uri(url).is_success(), "inserting invalid bookmark uri."

	assert isinstance(archive,   str),      "archive was not a string."

	assert isinstance(ctime, int),          "ctime was not a number."
	assert ctime      > 0,                  "ctime was a nonpositive value."






	return (
		Success(db)
		.tap( lambda db: db.commit(sql, (content, ctime)) )
	)





def select_bookmark(db, id, column = 'url'):

	valid_columns = {'bookmark_id', 'url', 'title', 'ctime'}

	if column not in valid_columns:
		return Failure('%s is not a valid column name.')


	sql = """
	SELECT %s
	FROM bookmarks
	WHERE bookmark_id = ?;
	""" % (column, )

	assert isinstance(id, int), "id must be an integer."
	assert id >= 0,             "id must be nonnegative."

	return (
		Success(db)
		.then( lambda db: db.execute(sql, (id, )) )
		.then( lambda cursor: cursor.fetchall())
	)





def select_bookmarks(db):

	sql = """
	SELECT bookmark_id, url, title, ctime
	FROM bookmarks
	ORDER BY ctime DESC
	"""

	return (
		Success(db)
		.then( lambda db: db.execute(sql) )
		.then( lambda cursor: cursor.fetchall())
	)




def lookup_bookmark(db, id):

	sql = """
	SELECT *
	FROM bookmarks
	WHERE bookmark_id = ?;
	"""

	assert isinstance(id, int), "id must be an integer."
	assert id >= 0,             "id must be nonnegative."

	return (
		Success(db)
		.then( lambda db: db.execute(sql, (id, )) )
		.then( lambda cursor: cursor.fetchall())
	)





def select_unarchived_bookmarks(db):

	sql = """
	SELECT bookmark_id
	FROM bookmarks
	WHERE bookmark_id NOT IN
	    (SELECT bookmark_id FROM bookmark_archives)

	AND bookmark_id NOT IN
		(SELECT bookmark_id FROM failed_archive_jobs);
	"""

	return (
		Success(db)
		.then( lambda db: db.execute(sql) )
		.then( lambda cursor: cursor.fetchall())
	)




def fetch_chunk(db, max_id, amount):


	sql = """
	SELECT bookmark_id, url, title, ctime
	FROM bookmarks
	WHERE bookmark_id <= ?
	ORDER BY ctime DESC
	LIMIT ?
	"""

	assert isinstance(max_id, int), "max_id must be an integer."
	assert max_id >= 0,             "max_id must be nonnegative."

	return (
		Success(db)
		.then( lambda db: db.execute(sql, (max_id, amount)) )
	)






def delete_bookmark(db, id):

	sql = """
	DELETE FROM bookmarks
	WHERE bookmark_id = ?
	"""

	assert isinstance(id, int), "id must be an integer."
	assert id >= 0,             "id must be nonnegative."

	return (
		Success(db)
		.tap( lambda db: db.commit(sql, (id, )) )
	)
