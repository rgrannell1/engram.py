#!/usr/bin/env python

import sql
import html

from result import Success, Failure





def show_bookmarks(criterea_result, db_result):

	search_result = (

		criterea_result
		.cross(db_result)
		.then( lambda pair: sql.select_bookmarks(pair[0], pair[1]) )

	)

	html_result = (
		search_result
		.then( lambda rows: html.index({'bookmarks': rows}) )
	)

	print html_result

	return "html"
