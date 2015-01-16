#!/usr/bin/env python

from result import Success, Failure
from flask import Flask

from database import connect_database

import sql
import html
import routes

from extract_metadata import extract_metadata




app = Flask(__name__)





@app.route('/')
def show_bookmarks():

	return html.index({
		'bookmark': ['this is a bookmark']
	})










def main():

	main_result = (
		connect_database('data/engram')
		.tap(sql.create_tables)
		.tap(lambda _: app.run())
	)





if __name__ == "__main__":
	main()
