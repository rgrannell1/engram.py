#!/usr/bin/env python3

import os
import pystache

from result import Success, Failure





pages = {
	'index':  open('public/html/index.html',  'r').read(),
	'export': open('public/html/export.html', 'r').read()
}





def index(context):

	return (
		Success(pages['index'])
		.then(lambda html: pystache.render(html, context))
	)

def export(context):

	return (
		Success(pages['export'])
		.then(lambda html: pystache.render(html, context))
	)
