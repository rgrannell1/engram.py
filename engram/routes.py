#!/usr/bin/env python3

from result                import Success, Failure
from flask                 import redirect, request

from database              import Database

import routes
import sql
import pages

from show_bookmarks        import show_bookmarks
from save_bookmark         import save_bookmark

from delete_bookmark       import delete_bookmark
from fetch_chunk           import fetch_chunk
from serve_public_file     import serve_public_file
from process_fetch_request import process_fetch_request








def index(app):
	"""
	GET /

	redirects to /bookmarks
	"""

	@app.route("/")
	def index_page():

		print('/')

		return redirect('/bookmarks', 302)






def bookmarks_api_route(app, db):
	"""
	GET /api/bookmarks

	api aspects of bookmarks.
	"""

	@app.route("/api/bookmarks")
	def bookmarks_api():

		print('/api/bookmarks')
		return process_fetch_request(db, request)





def delete(app, db):
	"""
	DELETE /bookmarks/:id
	"""

	@app.route("/bookmarks/<int:id>", methods = ["DELETE"])
	def delete_route(id):

		print('DELETE /bookmarks/' + str(id))

		return delete_bookmark(db, id)





def public(app):
	"""
	GET /public/:resourcetype/:resource

	return a public javascript/css/html resource.
	"""

	@app.route('/public/<resource_type>/<resource>')
	def serve_resource(resource_type, resource):

		print('/public/' + resource_type + '/' + resource)

		return serve_public_file(resource_type, resource)





def bookmarks(app):
	"""
	GET /bookmarks

	return a page displaying all saved bookmarks.
	"""

	@app.route("/bookmarks")
	def bookmark_page():

		print('/bookmarks')

		return show_bookmarks()





def archives(app):
	"""
	GET /archives/<int:id>

	return a pdf.
	"""

	@app.route("/archives/<int:id>")
	def archives_route(id):
		return "this is a stand-in for a pdf " + str(id)





def favicon(app, db):
	"""
	GET /favicon.ico

	return a favicon.
	"""

	@app.route("/favicon.ico")
	def favicon():

		print('/favicon.ico')

		return "no available favicon.", 404





def default(app, db):
	"""
	/<path>

	fallback route. Save the bookmark.
	"""

	@app.route("/<path:path>")
	def default_route(path):

		print('/' + path)

		return save_bookmark(db, path)
