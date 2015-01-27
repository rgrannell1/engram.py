#!/usr/bin/env python3

import urllib
import httplib2
import utils

from result import Success, Failure




def add_default_scheme(uri):
	return uri if ':' in uri else 'http://' + uri

def normalise_uri(uri):

	return (
		Success(uri)
		.then(add_default_scheme)
		.then(httplib2.iri2uri)
		.tap(urllib.parse.urlparse)
	)
