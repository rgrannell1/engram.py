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
INSERT INTO bookmarks VALUES (NULL, ?, ?, ?);
"""

insert_archive = """
INSERT INTO archives VALUES (NULL, ?, ?)
"""


select_bookmarks = """
SELECT bookmark_id, url, title, ctime
FROM bookmarks
ORDER BY ctime DESC
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
	'insert_archive':                 insert_archive,
	'select_bookmarks':               select_bookmarks,
	'delete_bookmark':                delete_bookmark
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
		.tap(lambda db: db.commit(sql['insert_bookmark'], (title, url, ctime)) )

	)




def insert_archive(db, bookmark_id, content, ctime):

	return (

		Success(db)
		.tap( lambda db: db.commit(sql['insert_archive'], (bookmark_id, content, ctime)) )

	)





def select_bookmarks(db):

	# -- be careful; this is almost SQL injection,
	# -- but the allowed column inputs are screened for earlier, and the boolean
	# -- parametre is handled here.

	return (

		Success(db)
		.then( lambda db: db.execute(sql['select_bookmarks']) )
		.then( lambda cursor: cursor.fetchall())

	)





def delete_bookmark(db, id):

	return (
		Success(db)
		.tap( lambda db: db.commit(sql['delete_bookmark'], (id, )) )
	)
