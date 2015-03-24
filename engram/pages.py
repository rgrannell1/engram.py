#!/usr/bin/env python3

import os
import pystache

from result import Success, Failure, Result





pages = {
	'index':  open('public/html/index.html',  'r').read(),
	'import': open('public/html/import.html', 'r').read(),
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

def restore(context):

	return (
		Success(pages['import'])
		.then(lambda html: pystache.render(html, context))
	)
