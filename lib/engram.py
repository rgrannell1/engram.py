#!/usr/bin/env python

import time

from result           import Success, Failure
from flask            import Flask, redirect, url_for, request

from database         import Database

import routes
import sql


from flask.ext.socketio import SocketIO, emit




def main():

	app       = Flask(__name__)
	socketio  = SocketIO(app)

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





	@socketio.on('connect', namespace = '/bookmarks/cache')
	def test_message(message):
		emit('my response', {'data': "running"})




	main_result = (
		db_result
		.tap(sql.create_tables)
		.tap(lambda _: socketio.run(app))
	)

	db_result.tap(lambda db: db.close())





if __name__ == "__main__":
	main()
