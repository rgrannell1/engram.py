#!/usr/bin/env python3





def display_result(result, default_ok = None, default_err = None):
	"""convert a failure object to a server message, code response.
	"""

	if default_ok is None:
		def default_ok(val):
			return '', 200

	if default_err is None:
		def default_err(val):
			return '', 500





	if result.is_err():

		failure = result.from_err()

		if isinstance(failure, dict):
			return failure['message'], failure['code']
		else:
			return default_err(failure)

	elif result.is_ok():

		success = result.from_ok()

		if isinstance(success, dict):
			return success['message'], success['code']
		else:
			return default_ok(success)

	else:

		raise TypeError('attempted to return fron non-success object %s' % (result.from_ok(),))
