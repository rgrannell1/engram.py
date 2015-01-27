#!/usr/bin/env python3

import os
import pystache

from result import Success, Failure





pages = {
	'index': open('public/html/index.html', 'r').read(),
	'save':  open('public/html/save.html',  'r').read()
}





def index(context):

	return (
		Success(pages['index'])
		.then(lambda html: pystache.render(html, context))
	)

def save(context):

	return (
		Success(pages['save'])
		.then(lambda html: pystache.render(html, context))
	)
