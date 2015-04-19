#!/usr/bin/env python3

import os
import pystache

from result import Ok, Err, Result





pages = {
	'index':  open('public/html/index.html',  'r').read(),
	'import': open('public/html/import.html', 'r').read(),
	'export': open('public/html/export.html', 'r').read()
}





def index(context):

	return (
		Ok(pages['index'])
		.then(lambda html: pystache.render(html, context))
	)

def export(context):

	return (
		Ok(pages['export'])
		.then(lambda html: pystache.render(html, context))
	)

def restore(context):

	return (
		Ok(pages['import'])
		.then(lambda html: pystache.render(html, context))
	)
