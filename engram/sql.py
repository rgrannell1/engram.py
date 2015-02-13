#!/usr/bin/env python3

from utils    import ensure
from result   import Success, Failure
import urllib
import httplib2

from normalise_uri import normalise_uri






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





insert_bookmark = """
INSERT INTO bookmarks VALUES (NULL, ?, ?, ?);
"""

select_max_bookmark_id = """
SELECT MAX(bookmark_id) FROM bookmarks;
"""

insert_archive = """
INSERT INTO archives VALUES (NULL, ?, ?);
"""


select_bookmarks = """
SELECT bookmark_id, url, title, ctime
FROM bookmarks
ORDER BY ctime DESC
"""

lookup_bookmark = """
SELECT *
FROM bookmarks
WHERE bookmark_id = ?;
"""

select_unarchived_bookmarks = """
SELECT bookmark_id
FROM bookmarks
WHERE bookmark_id NOT IN
    (SELECT DISTINCT bookmark_id FROM bookmark_archives);
"""

fetch_chunk = """
SELECT bookmark_id, url, title, ctime
FROM bookmarks
WHERE bookmark_id <= ?
ORDER BY ctime DESC
LIMIT ?
"""

delete_bookmark = """
DELETE FROM bookmarks
WHERE bookmark_id = ?
"""




sql = {
	'create_table_archives':          create_table_archives,
	'create_table_bookmarks':         create_table_bookmarks,
	'create_table_bookmark_archives': create_table_bookmark_archives,

	'insert_bookmark':                insert_bookmark,
	'select_max_bookmark_id':         select_max_bookmark_id,
	'select_unarchived_bookmarks':    select_unarchived_bookmarks,
	'insert_archive':                 insert_archive,
	'select_bookmarks':               select_bookmarks,
	'lookup_bookmark':                lookup_bookmark,
	'delete_bookmark':                delete_bookmark,

	'fetch_chunk':                    fetch_chunk
}





def create_tables(db):

	return (

		Success(db)
		.tap( lambda db: db.commit(sql['create_table_archives']) )
		.tap( lambda db: db.commit(sql['create_table_bookmarks']) )
		.tap( lambda db: db.commit(sql['create_table_bookmark_archives']) )

	)





def insert_bookmark(db, title, url, ctime):

	return (
		Success(db)

		.tap(lambda _: ensure(isinstance(title, str), "title was not a string."))
		.tap(lambda _: ensure(isinstance(url, str),   "url was not a string.") )
		.tap(lambda _: ensure(isinstance(ctime, int),        "ctime was not a number."))

		.tap(lambda _: ensure(title,     "attempted to insert empty title."))
		.tap(lambda _: ensure(url,       "attempted to insert empty url."))
		.tap(lambda _: ensure(ctime > 0, "ctime was a nonpositive value."))
		.tap(lambda _: normalise_uri(url))

		.tap( lambda db: db.commit(sql['insert_bookmark'], (title, url, ctime)) )

	)







def insert_archive(db, url, content, ctime):

	return (

		Success(db)
		.tap( lambda db: db.commit(sql['insert_archive'], (content, ctime)) )

	)





def select_bookmarks(db):

	return (

		Success(db)
		.then( lambda db: db.execute(sql['select_bookmarks']) )
		.then( lambda cursor: cursor.fetchall())

	)




def lookup_bookmark(db, id):

	return (

		Success(db)
		.then( lambda db: db.execute(sql['lookup_bookmark'], (id, )) )
		.then( lambda cursor: cursor.fetchall())

	)





def select_unarchived_bookmarks(db):

	return (

		Success(db)
		.then( lambda db: db.execute(sql['select_unarchived_bookmarks']) )
		.then( lambda cursor: cursor.fetchall())

	)




def fetch_chunk(db, max_id, amount):

	return (
		Success(db)
		.then( lambda db: db.execute(sql['fetch_chunk'], (max_id, amount)) )
	)






def delete_bookmark(db, id):

	return (
		Success(db)
		.tap( lambda db: db.commit(sql['delete_bookmark'], (id, )) )
	)
