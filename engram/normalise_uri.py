#!/usr/bin/env python3

import urllib
import httplib2
import utils

from result import Success, Failure





def normalise_uri(url):

	return (
		Success(url)
		.then(httplib2.iri2uri)
		.tap(urllib.parse.urlparse)
	)
