#!/usr/bin/env python

import os
from result import Success, Failure





def serve_public_file(resource_type, resource):

	load_result = (
		Success(os.path.join('public', resource_type, resource))
		.then(lambda fpath: open(fpath, 'r').read())
	)

	if load_result.is_success():
		return load_result.from_success()
	else:
		return "%s/%s not found." % (resource_type, resource), 404