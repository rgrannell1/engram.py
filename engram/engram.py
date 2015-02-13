#!/usr/bin/env python3

import os
import time
import sys

from result     import Success, Failure
from flask      import Flask, redirect, url_for, request

from database   import Database

import routes
import sql
import signal
import threading

from update_archives import update_archives





def create(fpath, test = None):

	app = Flask(__name__)

	if test:
		app.config['TESTING'] = True

	def sigterm_handler(signal, stack_frame):
		"""
		cleanly shut down when the SIGTERM signal is sent.
		"""

		request.environ.get('werkzeug.server.shutdown')()
		sys.exit(0)

	signal.signal(signal.SIGTERM, sigterm_handler)









	db_result = Success(fpath).then(Database)

	route_result = (

		Success(app).cross( [db_result] )

		.tap( lambda pair: routes.delete             (pair[0], pair[1]) )
		.tap( lambda pair: routes.index              (pair[0]) )
		.tap( lambda pair: routes.bookmarks          (pair[0]) )
		.tap( lambda pair: routes.archives           (pair[0]) )
		.tap( lambda pair: routes.favicon            (pair[0], pair[1]) )
		.tap( lambda pair: routes.public             (pair[0]) )
		.tap( lambda pair: routes.default            (pair[0], pair[1]) )
		.tap( lambda pair: routes.bookmarks_api_route(pair[0], pair[1]) )
	)

	main_result = (

		db_result
		.tap(sql.create_tables)
		.tap(lambda _: app.run())

	)

	overall_result = (
		db_result
		.cross([route_result, main_result])
	)


	if overall_result.is_failure():
		print(overall_result.from_failure())

	return app





def start_archiver():

	db_result = Success('data/engram').then(Database)

	print('starting archiver.')

	(
		db_result
		.then(lambda db: update_archives(db))
	)






if __name__ == "__main__":

	if False:
		thread = threading.Thread(target = start_archiver)
		thread.start()

	create('data/engram')

	print('running.')
