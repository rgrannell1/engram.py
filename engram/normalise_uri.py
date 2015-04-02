#!/usr/bin/env python3

import urllib
import httplib2
import utils

from result import Success, Failure, Result




def add_default_scheme(uri, default = 'http://'):
	return uri if ':' in uri else default + uri

def normalise_uri(uri):

	return (
		Result.of(lambda: add_default_scheme(uri))
		.then(httplib2.iri2uri)
		.then(urllib.parse.quote)
		.tap(urllib.parse.urlparse)
	)
