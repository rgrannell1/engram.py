#!/usr/bin/env python3

import os
import time
import sys



import sql
import routes
import signal
import threading

from complete_archives import complete_archives
from request_url       import request_url

from database import Database
from result   import Success, Failure
from flask    import Flask, redirect, url_for, request

import logging
logging.basicConfig(level =  logging.INFO)
logger = logging.getLogger(__name__)





def create_server(fpath, test = None):

	app = Flask(__name__)

	if test:
		app.config['TESTING'] = True

	db_result = Success(fpath).then(Database)

	route_result = (

		Success(app).cross( [db_result] )

		.tap( lambda pair: routes.delete             (pair[0], pair[1]) )
		.tap( lambda pair: routes.index              (pair[0]) )
		.tap( lambda pair: routes.bookmarks          (pair[0]) )

		.tap( lambda pair: routes.export             (pair[0], pair[1]) )
		.tap( lambda pair: routes.restore            (pair[0], pair[1]) )

		.tap( lambda pair: routes.archives           (pair[0], pair[1]) )
		.tap( lambda pair: routes.favicon            (pair[0], pair[1]) )
		.tap( lambda pair: routes.public             (pair[0]) )

		.tap( lambda pair: routes.resave             (pair[0], pair[1]) )
		.tap( lambda pair: routes.default            (pair[0], pair[1]) )

		.tap( lambda pair: routes.bookmarks_api_route(pair[0], pair[1]) )
	)

	main_result = (

		db_result
		.tap(lambda _: app.run())

	)

	overall_result = (
		db_result
		.cross([route_result, main_result])
	)


	if overall_result.is_failure():
		print(overall_result.from_failure())

	return app





def create_archiver(fpath, test = None):

	logger.info('connecting to database for archiving.')

	while True:

		# -- TODO note the archive result.
		(
			Success('data/engram')
			.then(Database)
			.tap(sql.create_tables)
			.then(lambda db: complete_archives(db))
		)

		# -- when all bookmarks are archived this prevents
		# -- pointless CPU shredding.
		time.sleep(10)




def create(fpath, test = None):

	def sigterm_handler(signal, stack_frame):
		"""	cleanly shut down when the SIGTERM signal is sent. """

		logger.info('shutting down.')

		request.environ.get('werkzeug.server.shutdown')()
		sys.exit(0)

	signal.signal(signal.SIGTERM, sigterm_handler)





	archiver_result = (
		Success(lambda:      create_archiver(fpath, test))
		.then(lambda task:   threading.Thread(target = task))
		.then(lambda thread: thread.start())
	)

	create_server(fpath, test = None)

	if archiver_result.is_failure():
		print(archiver_result.from_failure())





if __name__ == "__main__":

	create('data/engram')
