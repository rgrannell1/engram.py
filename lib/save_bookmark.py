#!/usr/bin/env python

import html
import sql
import utils

from result           import Success, Failure
from extract_metadata import extract_metadata






"""

save_bookmark :: Result Database x string -> string, number

this is a STATEFUL get request, so the error codes are a
bit screwy. This behaviour is required for browsers to be
able to send something like

engr.am/http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html

from the address bar and create a new bookmark.
"""

def save_bookmark(db_result, path):

	insert_result = (
		Success(path)
		.then(extract_metadata)
		.then( lambda title: sql.insert_bookmark(db_result, title, path, utils.now()) )
	)

	if insert_result.is_failure():
		message = "failed to add %s: '%s'" % (path, insert_result.value)
		return message % path, 500
	else:
		return '', 304
