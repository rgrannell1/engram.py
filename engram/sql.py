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

	return (
		Success(db)

		# what the fuck is this !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

		.tap(lambda _: ensure(isinstance(title, str), "title was not a string."))
		.tap(lambda _: ensure(isinstance(url, str),   "url was not a string.") )
		.tap(lambda _: ensure(isinstance(ctime, int),        "ctime was not a number."))

		.tap(lambda _: ensure(title,     "attempted to insert empty title."))
		.tap(lambda _: ensure(url,       "attempted to insert empty url."))
		.tap(lambda _: ensure(ctime > 0, "ctime was a nonpositive value."))
		.tap(lambda _: normalise_uri(url))

		.tap( lambda db: db.commit(sql, (title, url, ctime)) )

	)







def insert_archive(db, url, content, ctime):

	sql = """
	INSERT INTO archives VALUES (NULL, ?, ?);
	"""

	return (
		Success(db)
		.tap( lambda db: db.commit(sql, (content, ctime)) )
	)





def select_bookmark(db, id):

	sql = """
	SELECT url
	FROM bookmarks
	WHERE bookmark_id = ?;
	"""

	return (
		Success(db)
		.then( lambda db: db.execute(sql, (id, )) )
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

	return (
		Success(db)
		.then( lambda db: db.execute(sql, (max_id, amount)) )
	)






def delete_bookmark(db, id):

	sql = """
	DELETE FROM bookmarks
	WHERE bookmark_id = ?
	"""

	return (
		Success(db)
		.tap( lambda db: db.commit(sql, (id, )) )
	)
