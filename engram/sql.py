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

		content       blob        NOT NULL,
		mimetype      text        NOT NULL,
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

	return (

		Success(db)
		.tap(lambda db: db.commit(create_table_archives))
		.tap(lambda db: db.commit(create_table_bookmarks))
		.tap(lambda db: db.commit(create_table_bookmark_archives))

	)





def insert_bookmark(db, url, title, ctime):

	sql = "INSERT INTO bookmarks VALUES (NULL, ?, ?, ?);"

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







def insert_archive(db, id, content, mimetype, ctime):

	insert_archives = "INSERT INTO archives VALUES (NULL, ?, ?);"

	assert isinstance(ctime, int),          "ctime was not a number."
	assert ctime > 0,                       "ctime was a nonpositive value."

	insert_archive          = "INSERT INTO archives VALUES (NULL, ?, ?, ?);"
	insert_bookmark_archive = "INSERT INTO bookmark_archives VALUES (NULL, ?, (SELECT MAX(archive_id) FROM archives));"

	add_archive_result = (
		Success(db)
		.tap( lambda db: db.commitMany(

			[insert_archive, insert_bookmark_archive],
			[(content, mimetype, ctime), (id, )]

	)) )

	return add_archive_result





def select_bookmark(db, id):


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





def select_archive(db, bookmark_id):

	# -- lookup junction table.
	# -- get archive id for bookmark id.
	# -- lookup archive.

	assert isinstance(bookmark_id, int), "bookmark_id must be an integer."
	assert bookmark_id >= 0,             "bookmark_id must be nonnegative."

	sql = """
	SELECT * FROM archives
	WHERE archive_id == (
		SELECT archive_id
		FROM bookmark_archives
		WHERE bookmark_id == ?);
	"""

	return (
		Success(db)
		.then( lambda db: db.execute(sql, (bookmark_id,)) )
		.then( lambda cursor: cursor.fetchall( ))
	)





def select_unarchived_bookmarks(db):

	sql = """
	SELECT bookmark_id
	FROM bookmarks
	WHERE bookmark_id NOT IN
	    (SELECT bookmark_id FROM bookmark_archives);
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
	ORDER BY bookmark_id DESC
	LIMIT ?
	"""

	assert isinstance(max_id, int), "max_id must be an integer."
	assert max_id >= 0,             "max_id must be nonnegative."

	return (
		Success(db)
		.then(lambda db: db.execute(sql, (max_id, amount)))
		.then( lambda cursor: cursor.fetchall())
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
