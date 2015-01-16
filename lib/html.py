#!/usr/bin/env python3

import os
import pystache

from result import Success, Failure
import utils









def load_template(fpath):

	return (
		Success(fpath)
		.then(lambda fpath: open(fpath, 'r'))
		.then(lambda file:  file.read())
	)





def index(context):

	return (
		load_template('public/html/index.html')
		.then(lambda html: pystache.render(html, context))
	)





def save(context):

	return (
		load_template('public/html/save.html')
		.then(lambda html: pystache.render(html, context))
	)
