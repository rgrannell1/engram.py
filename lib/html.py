#!/usr/bin/env python3

from result import Success, Failure
import pystache





def render_template(fpath):

	template_result = (
		Success(fpath)
		.then(lambda fpath: open(fpath, 'r'))
		.then(lambda file:  file.read)
	)

	return (
		template_result
		.then(lambda html: lambda context: pystache.render(html, context))
	)





def index(context):
	return render_template()
