#!/usr/bin/env python

from result           import Success, Failure
from flask            import Flask, redirect, url_for, request

from database         import Database

import sql
import html
from show_bookmarks   import show_bookmarks
from criteria         import criteria

from extract_metadata import extract_metadata














def main():

	app = Flask(__name__)
	db  = Success('data/engram').then(Database)






	@app.route("/")
	def index_page():
		return redirect(url_for('bookmark_page'))

	@app.route("/bookmarks")
	def bookmark_page():
		return show_bookmarks({}, db)





	@app.route("/bookmarks/search")
	def search_routes():

		print (
			Success(None)
			.then(lambda _: request)
		)

		print(criteria(request))

		return "running."


	@app.route("/bookmarks/<int:id>", methods = ["DELETE"])
	def delete_page(id):
		1






	main_result = (
		db
		.tap(sql.create_tables)
		.tap(lambda _: app.run())
	)





if __name__ == "__main__":
	main()
