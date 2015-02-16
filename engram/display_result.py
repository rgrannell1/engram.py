#!/usr/bin/env python3





def display_result(result, default_success = None, default_failure = None):
	"""convert a failure object to a server message, code response.
	"""

	if default_success is None:
		def default_success(val):
			return '', 200

	if default_failure is None:
		def default_failure(val):
			return '', 500





	if result.is_failure():

		failure = result.from_failure()

		if isinstance(failure, dict):
			return failure['message'], failure['code']
		else:
			return default_failure(failure)

	elif result.is_success():

		success = result.from_success()

		if isinstance(success, dict):
			return success['message'], success['code']
		else:
			return default_success(success)

	else:

		raise TypeError('attempted to return fron non-success object %s' % (result.from_success(),))
