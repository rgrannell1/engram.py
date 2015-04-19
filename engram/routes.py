#!/usr/bin/env python3

from result            import Ok, Err, Result
from flask             import redirect, request
import urllib

import routes
import sql
import pages

import utils

from show_bookmarks    import show_bookmarks
from save_bookmark     import save_bookmark
from resave_bookmarks  import resave_bookmarks

from delete_bookmark   import delete_bookmark
from fetch_chunk       import fetch_chunk
from serve_public_file import serve_public_file
from fetch_bookmarks   import fetch_bookmarks

from export_bookmarks  import export_bookmarks
from restore_bookmarks import restore_bookmarks

from serve_archive     import serve_archive





def index(app):
	"""
	GET /

	redirects to /bookmarks.
	"""

	@app.route("/")
	def index_page( ):

		print('/')
		return redirect('/bookmarks', 302)






def bookmarks_api_route(app, database_in, database_out):
	"""
	GET /api/bookmarks

	api aspects of bookmarks.
	"""

	@app.route("/api/bookmarks")
	def bookmarks_api( ):

		print('/api/bookmarks')
		return fetch_bookmarks(database_in, database_out, request)





def delete(app, database_in, database_out):
	"""
	DELETE /bookmarks/:id
	"""

	@app.route("/bookmarks/<int:id>", methods = ["DELETE"])
	def delete_route(id):

		print('DELETE /bookmarks/' + str(id))

		return delete_bookmark(database_in, database_out, id)





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
	def bookmark_page( ):

		print('/bookmarks')

		return show_bookmarks( )





def export(app, database_in, database_out):

	@app.route("/export")
	def export_route( ):

		print('/export')
		return export_bookmarks(database_in, database_out)





def restore(app, database_in, database_out):

	@app.route("/restore")
	def restore_route( ):

		print('/restore/')

		return restore_bookmarks(database_in, database_out)





def archives(app, database_in, database_out):
	"""
	GET /archives/<int:id>

	return a pdf.
	"""

	@app.route("/archives/<int:id>")
	def archives_route(id):
		return serve_archive(database_in, database_out, id)





def favicon(app, database_in, database_out):
	"""
	GET /favicon.ico

	return a favicon.
	"""

	@app.route("/favicon.ico")
	def favicon( ):

		print('/favicon.ico')
		return "no available favicon.", 404





def resave(app, database_in, database_out):
	"""
	POST /resave/*
	"""

	@app.route("/api/resave", methods = ["POST"])
	def resave_route( ):

		print('/api/resave')

		return resave_bookmarks(database_in, database_out, request.get_json( ))





def default(app, database_in, database_out):
	"""
	/<path>

	fallback route. Save the bookmark.
	"""

	@app.route("/<path:path>")
	def default_route(path):

		full_path = (request.path + '?' + request.query_string.decode('utf-8'))[1:]

		print('/' + full_path)

		return save_bookmark(database_in, database_out, full_path, utils.now( ))
