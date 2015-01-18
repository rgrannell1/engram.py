#!/usr/bin/env python

import html
import sql
import utils

from result import Success, Failure




def add_bookmark(db_result, path):

	insert_result = (
		Success(path)
		.then( lambda path: sql.insert_bookmark(db_result, 'hi', path, utils.now()) )
	)

	return ""
