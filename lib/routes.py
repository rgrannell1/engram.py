
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





def delete(app, db_result):

	@app.route("/bookmarks/<int:id>", methods = ["DELETE"])
	def delete_route(id):
		return delete_bookmark(db_result, id)





def index(app, db_result):
	@app.route("/", defaults = {'path': ''})
	def index_page():
		return redirect(url_for('bookmark_page'))




def bookmarks(app, db_result):
	@app.route("/bookmarks")
	def bookmark_page():
		return show_bookmarks(db_result)





def favicon(app, db_result):
	@app.route("/favicon.ico")
	def favicon():
		return "", 404





def default(app, db_result):
	@app.route("/<path:path>")
	def default_route(path):
		return save_bookmark(db, path)
