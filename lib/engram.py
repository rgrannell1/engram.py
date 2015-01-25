#!/usr/bin/env python

import os
import time

from result     import Success, Failure
from flask      import Flask, redirect, url_for, request

from database   import Database
from fill_cache import fill_cache

import routes
import sql






def main():

	app       = Flask(__name__)
	db_result = Success('data/engram').then(Database)

	cache_result = fill_cache(db_result)
	route_result = (

		Success(app).cross( [db_result, cache_result] )

		.tap( lambda pair: routes.delete             (pair[0], pair[1], pair[2]) )
		.tap( lambda pair: routes.index              (pair[0]) )
		.tap( lambda pair: routes.bookmarks          (pair[0]) )
		.tap( lambda pair: routes.favicon            (pair[0], pair[1]) )
		.tap( lambda pair: routes.public             (pair[0]) )
		.tap( lambda pair: routes.default            (pair[0], pair[1], pair[2]) )
		.tap( lambda pair: routes.bookmarks_api_route(pair[0], pair[1]) )



	)

	main_result = (

		db_result
		.tap(sql.create_tables)
		.tap(lambda _: app.run())

	)





	db_result.tap(lambda db: db.close())





if __name__ == "__main__":
	main()
