#!/usr/bin/env python3

import time
import os





root = os.path.dirname(os.path.dirname(__file__))





def relative(fpath):
	return os.path.join(root, fpath)

def now():
	return int(time.time())

def ensure(bool, message = ''):
	if not bool:
		raise AssertionError(message)

def display_result(result):

	if result.is_failure():

		failure = result.from_failure()

		if isinstance(failure, dict):
			return failure['message'], failure['code']
		else:
			return "failed to fetch: '%s'" % (failure,), 500

	else:
		return result.from_success(), 200

