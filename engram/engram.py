#!/usr/bin/env python3

import os
import time
import sys



import sql
import routes
import signal
import threading

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

	db_result = Success(fpath).then(Database).tap(sql.create_tables)

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

	main_result    = db_result.tap(lambda _: app.run( ))
	overall_result = db_result.cross([route_result, main_result])


	if overall_result.is_failure( ):
		print(overall_result.from_failure( ))

	return app





def create(fpath, test = None):

	def sigterm_handler(signal, stack_frame):
		"""	cleanly shut down when the SIGTERM signal is sent. """

		logger.info('shutting down.')

		request.environ.get('werkzeug.server.shutdown')( )
		sys.exit(0)

	signal.signal(signal.SIGTERM, sigterm_handler)






	create_server(fpath, test = None)






if __name__ == "__main__":

	create('data/engram')
