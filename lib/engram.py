#!/usr/bin/env python

import time

from result           import Success, Failure
from flask            import Flask, redirect, url_for, request

from database         import Database

import routes
import sql
import html
from show_bookmarks   import show_bookmarks
from save_bookmark    import save_bookmark

from extract_metadata import extract_metadata
from delete_bookmark  import delete_bookmark





def main():

	app = Flask(__name__)
	db  = Success('data/engram').then(Database)

	routes.delete(app, db)
	routes.index(app, db)
	routes.bookmarks(app, db)
	routes.favicon(app, db)
	routes.default(app, db)

	main_result = (
		db
		.tap(sql.create_tables)
		.tap(lambda _: app.run())
	)





if __name__ == "__main__":
	main()
