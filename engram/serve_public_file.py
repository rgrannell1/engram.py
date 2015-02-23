#!/usr/bin/env python3

import os
from result         import Success, Failure
from display_result import display_result




def serve_public_file(resource_type, resource):


	try:
		resource_path = os.path.join('public', resource_type, resource)
	except Exception as err:
		path_result = Failure(resource_path)
	else:
		path_result = Success(resource_path)

	load_result = (
		path_result
		.then(lambda fpath: open(fpath, 'r').read())
		.then(lambda data: {
			'message': data,
			'code':    200
		})
	)

	return display_result(load_result)
