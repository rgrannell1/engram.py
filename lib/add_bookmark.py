#!/usr/bin/env python

import html
import sql
import utils

from result           import Success, Failure
from extract_metadata import extract_metadata



def add_bookmark(db_result, path):

	insert_result = (
		Success(path)
		.then(extract_metadata)
		.then( lambda title: sql.insert_bookmark(db_result, title, path, utils.now()) )
	)

	if insert_result.is_failure():
		return "failed insert."
	else:
		return "insert result."
