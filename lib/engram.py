#!/usr/bin/env python

import time

from result           import Success, Failure
from flask            import Flask, redirect, url_for, request

from database         import Database

import sql
import html
from show_bookmarks   import show_bookmarks
from add_bookmark     import add_bookmark
from criteria         import criteria

from extract_metadata import extract_metadata














def main():

	app = Flask(__name__)
	db  = Success('data/engram').then(Database)






	@app.route("/", defaults = {'path': ''})
	def index_page():
		return redirect(url_for('bookmark_page'))

	@app.route("/bookmarks")
	def bookmark_page():

		criteria_result = Success(request).then(criteria)
		return show_bookmarks(criteria_result, db)





	@app.route("/bookmarks/<int:id>", methods = ["DELETE"])
	def delete_page(id):
		'noop'





	@app.route("/<path:path>")
	def add_bookmark_page(path):
		return add_bookmark(db, path)





	main_result = (
		db
		.tap(sql.create_tables)
		.tap(lambda _: app.run())
	)





if __name__ == "__main__":
	main()
