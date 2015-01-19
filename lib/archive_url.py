#!/usr/bin/env python

import pdfkit
import sql

from result import Success, Failure




def archive_url(conn, bookmark_id, url):

	(
		Success(url)
		.then(lambda url: pdfkit.from_url(url, False))
		.then(lambda content: sql.insert_archive(conn, content, ))
	)
