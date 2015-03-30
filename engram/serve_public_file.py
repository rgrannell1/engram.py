#!/usr/bin/env python3

import os
from result         import Success, Failure, Result
from display_result import display_result




def serve_public_file(resource_type, resource):

	load_result = (
		Result.of(lambda: os.path.join('public', resource_type, resource))
		.then(lambda fpath: open(fpath, 'r').read())
		.then(lambda data: {
			'message': data,
			'code':    200
		})
	)

	return display_result(load_result)
