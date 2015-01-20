#!/usr/bin/env pythonsh

import time

from result           import Success, Failure
from flask            import Flask, redirect, url_for, request

from database         import Database

import sql
import html
from show_bookmarks   import show_bookmarks
from save_bookmark    import save_bookmark

from extract_metadata import extract_metadata
from delete_bookmark  import delete_bookmark


















def main():

	app = Flask(__name__)
	db  = Success('data/engram').then(Database)





	@app.route("/bookmarks/<int:id>", methods = ["DELETE"])
	def delete_route(id):
		return delete_bookmark(db, id)





	@app.route("/", defaults = {'path': ''})
	def index_page():
		return redirect(url_for('bookmark_page'))

	@app.route("/bookmarks")
	def bookmark_page():
		return show_bookmarks(db)





	@app.route("/bookmarks/.json")
	def export_bookmarks():
		return"currently unimplemented."

	@app.route("/favicon.ico")
	def favicon():
		return "", 404



	@app.route("/<path:path>")
	def default_route(path):
		return save_bookmark(db, path)









	main_result = (
		db
		.tap(sql.create_tables)
		.tap(lambda _: app.run())
	)





if __name__ == "__main__":
	main()
