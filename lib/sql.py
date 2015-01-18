#!/usr/bin/env python

from result import Success, Failure




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
INSERT INTO bookmarks VALUES (?, ?, ?)
"""



select_bookmarks = """
SELECT bookmark_id, url, title, ctime
FROM bookmarks
WHERE title LIKE ? AND ctime >= ?;
"""





sql = {
	'create_table_archives':          create_table_archives,
	'create_table_bookmarks':         create_table_bookmarks,
	'create_table_bookmark_archives': create_table_bookmark_archives,

	'insert_bookmark':                insert_bookmark,
	'select_bookmarks':               select_bookmarks
}





def create_tables(conn):

	return (

		Success(conn)
		.tap( lambda conn: conn.commit(sql['create_table_archives']) )
		.tap( lambda conn: conn.commit(sql['create_table_bookmarks']) )
		.tap( lambda conn: conn.commit(sql['create_table_bookmark_archives']) )

	)

def insert_bookmark(conn, title, url, ctime, criterea):

	return (

		Success(conn)
		.tap(lambda conn: conn.commit(sql['insert_bookmark'], (conn, title, url, ctime)) )

	)

def select_bookmarks(criterea, conn):

	search_tuple = (criterea['query'], criterea['oldest'])

	return (

		Success(conn)
		.then( lambda conn: conn.execute(sql['select_bookmarks'], search_tuple) )
		.then( lambda cursor: cursor.fetchall())

	)
