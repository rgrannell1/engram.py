#!/usr/bin/env python3

import sql
import utils
import queue

from result           import Ok, Err, Result
from extract_metadata import extract_metadata

import normalise_uri

import urllib
from bookmark         import bookmark, getID
from display_result   import display_result
from request_url      import request_url
import threading

from create_archive  import create_archive
from db              import Database, WriteJob, ReadJob
from shareddict      import SharedDict






def extract_title_thread(url, content_result, time, database_in, database_out):

	title_result = (
		content_result.
		then(lambda content: extract_metadata(url, content))
	)

	if title_result.is_ok( ):

		title = title_result.from_ok( )

		job = WriteJob(
			"INSERT INTO bookmarks VALUES (NULL, ?, ?, ?);",
			(normalise_uri.add_default_scheme(url), title, time)
		)

		database_in.put(job)

		insert_result = Result.of( lambda: database_out[id(job)] )

	else:

		insert_result = title_result





def create_archive_thread(url, content_result, time, database_in, database_out):

	# -- TODO account for failed archiving.

	#archive_result = (
	#	content_result.
	#	then( lambda content: create_archive(content, url) )
	#)

	pass

	# -- save bookmark to db here!




def save_bookmark_thread(url, time, database_in, database_out):

	content_result = Result.of(lambda: request_url(url))

	thread_kwargs = {
		'url':            url,
		'content_result': content_result,
		'time':           time,
		'database_in':    database_in,
		'database_out':   database_out
	}

	title_thread   = threading.Thread(target = extract_title_thread,  kwargs = thread_kwargs)
	archive_thread = threading.Thread(target = create_archive_thread, kwargs = thread_kwargs)

	title_thread.start( )
	archive_thread.start( )





def save_bookmark(database_in, database_out, url, time):
	"""save a bookmark to a database.

	this is triggered by a GET request, so it has perverse
	behaviour. It returns a 204 when the save succeeds so the
	browser doesn't leave the current page.

	This is bad when you are already on the page generated upon
	failure, and then you get the result right it doesn't update.
	"""

	url_result = Result.of(lambda: normalise_uri.normalise_uri(url)).then(urllib.parse.unquote)

	if url_result.is_ok( ):

		save_thread = threading.Thread(target = save_bookmark_thread, kwargs = {
			'url':          url_result.from_ok( ),
			'time':         time,
			'database_in':  database_in,
			'database_out': database_out
		})

		save_thread.start( )

	return display_result(url_result)
