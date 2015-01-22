#!/usr/bin/env python3

import os
import pystache

from result import Success, Failure





html = {
	'index': open('public/html/index.html', 'r').read(),
	'save':  open('public/html/save.html',  'r').read()
}





def index(context):

	return (
		Success(html['index'])
		.then(lambda html: pystache.render(html, context))
	)

def save(context):

	return (
		Success(html['save'])
		.then(lambda html: pystache.render(html, context))
	)
