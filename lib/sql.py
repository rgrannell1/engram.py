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









def create_tables(conn):

	return (

		conn
		.tap(lambda conn: conn.execute(create_table_archives))
		.tap(lambda conn: conn.execute(create_table_bookmarks))
		.tap(lambda conn: conn.execute(create_table_bookmark_archives))

	)

def prepare_statements(conn):

	return (

		conn
		.tap(lambda conn: conn.execute(prepare_insert_bookmark))

	)
