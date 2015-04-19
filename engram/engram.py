#!/usr/bin/env python3

import os
import time
import sys


import sql
import queue
import routes
import signal
import threading

from request_url       import request_url

from db       import Database, WriteJob, ReadJob
from result   import Ok, Err, Result
from flask    import Flask, redirect, url_for, request

import threading
import logging
logging.basicConfig(level =  logging.INFO)
logger = logging.getLogger(__name__)





def create_tables(database_in):

	database_in.put( WriteJob("""
	CREATE TABLE IF NOT EXISTS archives (

		archive_id    integer     PRIMARY KEY    AUTOINCREMENT,

		content       blob        NOT NULL,
		mimetype      text        NOT NULL,
		ctime         integer     NOT NULL

	);
	""", ( )) )

	database_in.put( WriteJob("""
	CREATE TABLE IF NOT EXISTS bookmarks (

		bookmark_id    integer    PRIMARY KEY    AUTOINCREMENT,

		url            text       NOT NULL,
		title          text       NOT NULL,
		ctime          integer    NOT NULL

	);
	""", ( )) )

	database_in.put( WriteJob("""
	CREATE TABLE IF NOT EXISTS bookmark_archives (

		bookmark_archive_id    integer    PRIMARY KEY    AUTOINCREMENT,

		bookmark_id            REFERENCES bookmarks(bookmark_id),
		archive_id             REFERENCES archives(archive_id)

	);
	""", ( )) )










def create_server(fpath, database_in, database_out, test = None):

	app = Flask(__name__)

	if test:
		app.config['TESTING'] = True

	create_result = create_tables(database_in)

	route_result  = (
		Ok(None)

		.tap(lambda _: routes.index              (app))
		.tap(lambda _: routes.bookmarks          (app))
		.tap(lambda _: routes.public             (app))
		.tap(lambda _: routes.delete             (app, database_in, database_out))
		.tap(lambda _: routes.export             (app, database_in, database_out))
		.tap(lambda _: routes.restore            (app, database_in, database_out))
		.tap(lambda _: routes.archives           (app, database_in, database_out))
		.tap(lambda _: routes.favicon            (app, database_in, database_out))
		.tap(lambda _: routes.resave             (app, database_in, database_out))
		.tap(lambda _: routes.default            (app, database_in, database_out))
		.tap(lambda _: routes.bookmarks_api_route(app, database_in, database_out))

	)



	app.run(threaded = True)

	return app





def create(fpath, database_in, database_out, test = None):

	def sigterm_handler(signal, stack_frame):
		"""	cleanly shut down when the SIGTERM signal is sent. """

		logger.info('shutting down.')

		request.environ.get('werkzeug.server.shutdown')( )
		sys.exit(0)

	signal.signal(signal.SIGTERM, sigterm_handler)






	create_server(fpath, database_in, database_out, test = None)





class SharedDict:
	def __init__(self, data = { }):

		self.data = data

	def __getitem__(self, id):

		seconds_sleep = 1 / 12
		retries       = 60 * 2

		for ith in range(retries):

			if id in self.data:
				return self.data[id]
			else:
				time.sleep(seconds_sleep)

		raise LookupError('timed out')





if __name__ == "__main__":


	database_in  = queue.Queue( )
	database_out = SharedDict( )





	def consume_database_jobs( ):

		database = Database('data/engram', database_in, database_out)

		while True:
			database.perform( )




	database_thread = threading.Thread(target = consume_database_jobs)
	database_thread.start( )

	create('data/engram', database_in, database_out)
