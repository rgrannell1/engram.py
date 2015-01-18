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




def create_tables(conn):

	return (

		Success(conn)
		.tap(lambda conn: conn.commit(create_table_archives))
		.tap(lambda conn: conn.commit(create_table_bookmarks))
		.tap(lambda conn: conn.commit(create_table_bookmark_archives))

	)

def insert_bookmark(conn, title, url, ctime):

	return (

		Success(conn)
		.tap(lambda conn: conn.commit(insert_bookmark, (conn, title, url, ctime)) )

	)
