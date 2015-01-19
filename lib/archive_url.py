#!/usr/bin/env python

import pdfkit
from result import Success, Failure




def archive_url(bookmark_id, url):

	(
		Success(url)
		.then(lambda url: pdfkit.from_url(url, False))
	)
