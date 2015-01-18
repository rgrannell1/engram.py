#!/usr/bin/env python

import sql
import html

from result import Success, Failure





def show_bookmarks(criterea_result, db_result):

	print(

		criterea_result
		.cross(db_result)

	)


	return "html"
