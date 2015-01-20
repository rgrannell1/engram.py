#!/usr/bin/env python

import traceback





class Result(object):

	# -- idempotent constructor.

	def __init__(self, value):
		self.value = value.value if isinstance(value, Result) else value





class Failure(Result):

	def __init__(self, value):

		self.value = value.value if isinstance(value, Result) else value
		self.stack = value.stack if isinstance(value, Failure) else traceback.print_exc()

	def __str__(self):
		return "Failure(%s)" % (str(self.value))





	def is_success(self):
		return False

	def is_failure(self):
		return True




	def then(self, fn):
		return Failure(self.value)

	def tap(self, fn):
		return Failure(self.value)





	def cross(self, result):

		if not isinstance(result, Result):
			raise Exception("result wasn't a Result instance.")

		return self






class Success(Result):

	# -- idempotent constructor.

	def __init__(self, value):
		super(Success, self).__init__(value)





	def __str__(self):
		return "Success(%s)" % (str(self.value))




	def is_success(self):
		return True

	def is_failure(self):
		return False





	def then(self, fn):

		try:
			result = fn(self.value)

			if isinstance(result, Failure):
				return result
			else:
				return Success(result)

		except Exception as err:
			return Failure(err)

		return result

	def tap(self, fn):

		result = self.then(fn)

		if isinstance(result, Failure):
			return result
		else:
			return self





	def cross(self, result):

		if not isinstance(result, Result):
			raise Exception("result wasn't a Result instance.")

		if isinstance(result, Success):
			return Success([self.value, result.value])
		else:
			return result
