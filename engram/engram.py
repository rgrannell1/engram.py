#!/usr/bin/env python3

import os
import time

from result     import Success, Failure
from flask      import Flask, redirect, url_for, request

from database   import Database

import routes
import sql






def create(fpath, test = None):

	app       = Flask(__name__)

	if test:
		app.config['TESTING'] = True






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



if __name__ == "__main__":

	create('data/engram')
