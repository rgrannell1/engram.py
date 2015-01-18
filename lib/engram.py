#!/usr/bin/env python

from result import Success, Failure
from flask import Flask, redirect, url_for

from database import Database

import sql
import html
import show_bookmarks

from extract_metadata import extract_metadata














def main():

	app = Flask(__name__)
	db  = Success('data/engram').then(Database)





	@app.route("/bookmarks")
	def bookmark_page():
		return show_bookmarks.show_bookmarks(db)

	@app.route("/")
	def index_page():
		return redirect(url_for('bookmark_page'))





	main_result = (
		db
		.tap(sql.create_tables)
		.tap(lambda _: app.run())
	)





if __name__ == "__main__":
	main()
