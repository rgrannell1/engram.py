#!/usr/bin/env python

import time

from result           import Success, Failure
from flask            import Flask, redirect, url_for, request

from database         import Database

import routes
import sql





def main():

	app       = Flask(__name__)
	db_result = Success('data/engram').then(Database)





	route_result = (

		Success(app)
		.cross(Success(db_result))

		.tap( lambda pair: routes.delete    (pair[0], pair[1]) )
		.tap( lambda pair: routes.index     (pair[0], pair[1]) )
		.tap( lambda pair: routes.bookmarks (pair[0], pair[1]) )
		.tap( lambda pair: routes.favicon   (pair[0], pair[1]) )
		.tap( lambda pair: routes.default   (pair[0], pair[1]) )

	)






	main_result = (
		db_result
		.tap(sql.create_tables)
		.tap(lambda _: app.run())
	)





	db_result.tap(lambda db: db.close())





if __name__ == "__main__":
	main()
