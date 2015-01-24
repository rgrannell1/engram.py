
import time

from result           import Success, Failure
from flask            import Flask, redirect, url_for, request, jsonify

from database         import Database

import routes
import sql
import html
import os

from show_bookmarks   import show_bookmarks
from save_bookmark    import save_bookmark

from extract_metadata import extract_metadata
from delete_bookmark  import delete_bookmark










def index(app, db_result):
	"""
	GET /

	redirects to /bookmarks
	"""

	@app.route("/")
	def index_page():

		print '/'
		return redirect('/bookmarks')





def bookmarks_api_route(app, cache):
	"""
	GET /api/bookmarks

	api aspects of bookmarks.
	"""

	@app.route("/api/bookmarks")
	def bookmarks_api():

		max_id = int(request.args.get('maxID'))
		amount = int(request.args.get('amount'))

		fetchResult = (
			Success(cache)
			.then(lambda cache: cache.fetchChunk(max_id, amount))
			.then(lambda data: jsonify(data) )
		)

		return fetchResult.from_success()




def delete(app, db_result):
	"""
	DELETE /bookmarks/:id
	"""

	@app.route("/bookmarks/<int:id>", methods = ["DELETE"])
	def delete_route(id):

		print 'DELETE /bookmarks/' + id

		return delete_bookmark(db_result, id)


def public(app):
	"""
	GET /public/:resourcetype/:resource

	return a public javascript/css/html resource.
	"""

	@app.route('/public/<resource_type>/<resource>')
	def serve_resource(resource_type, resource):

		fpath = os.path.join('public', resource_type, resource)

		print fpath

		return open(fpath, 'r').read()





def bookmarks(app, db_result):
	"""
	GET /bookmarks

	return a page displaying all saved bookmarks.
	"""

	@app.route("/bookmarks")
	def bookmark_page():

		print '/bookmarks'

		return show_bookmarks(db_result)





def favicon(app, db_result):
	"""
	GET /favicon.ico

	return a favicon.
	"""

	@app.route("/favicon.ico")
	def favicon():

		print '/favicon.ico'

		return "", 404





def default(app, db_result):
	"""
	/<path>

	fallback route. Save the bookmark.
	"""

	@app.route("/save/<path>")
	def default_route(path):
		return save_bookmark(db_result, path)
