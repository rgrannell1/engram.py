#!/usr/bin/env python

from result import Success, Failure
from flask import Flask

from database import Database

import sql
import html
import routes

from extract_metadata import extract_metadata




app = Flask(__name__)





def select_bookmarks(criteria_result, conn):
	1




@app.route('/')
def show_bookmarks():

	return html.index({
		'bookmark': ['this is a bookmark']
	})










def main():

	db = Database('data/engram')

	main_result = (
		Success(db)
		.tap(sql.create_tables)
		.tap(lambda _: app.run())
	)





if __name__ == "__main__":
	main()
