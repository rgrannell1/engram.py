#!/usr/bin/env python3

import traceback
import logging

logger = logging.getLogger(__name__)






class Result(object):

	def __init__(self, value):
		self.value = value.value if isinstance(value, Result) else value

	@staticmethod
	def of(fn):
		"""Create a Result from the return result of a normal function.
		"""
		return Success(None).then(lambda _: fn( ))





	def from_success(self):
		"""Extract the contents of a Success object

		Throws a TypeError when called on a non-success object.

		>> Failure('contents').from_success()
		'contents'

		>> Success('contents').from_success()
		TypeError('attempted to call from_success on a Failure object.')

		"""

		if isinstance(self, Success):
			return self.value
		elif isinstance(self, Failure):
			raise TypeError("attempted to call from_success on a Failure object.")





	def from_failure(self):
		"""Extract the contents of a Failure object

		Throws a TypeError when called on a non-failure object.

		>> Failure('contents').from_failure()
		'contents'

		>> Success('contents').from_failure()
		TypeError('attempted to call from_failure on a Success object.')

		"""

		if isinstance(self, Failure):
			return self.value
		elif isinstance(self, Self):
			raise TypeError("attempted to call from_failure on a Success object.")





	def is_success(self):
		"""Is this Result a Success instance?
		"""
		return isinstance(self, Success)

	def is_failure(self):
		"""Is this Result a Failure instance?
		"""
		return isinstance(self, Failure)










class Failure(Result):

	def __init__(self, value):

		self.value = value.value if isinstance(value, Result) else value
		logging.error(self.value)

		#traceback.print_exc()


	def __str__(self):
		return "Failure(%s)" % (str(self.value))





	def then(self, fn):
		return self

	def tap(self, fn):
		return self

	def product_of(self):
		return self



	def cross(self, results):
		return self





class Success(Result):

	def __init__(self, value):
		super(Success, self).__init__(value)





	def __str__(self):
		return "Success(%s)" % (str(self.value))





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
		"""apply a function to a Result object, but only keep the new result if the call fails.
		"""

		result = self.then(fn)

		if isinstance(result, Failure):
			return result
		else:
			return self





	def cross(self, results):
		"""get the product of two Result object.

		>> Success('a').cross(Success(['b']))
		Success(['a', 'b'])
		"""

		values = [self.value]

		for result in results:
			if not isinstance(result, Result):
				raise Exception("result wasn't a Result instance.")

			if isinstance(result, Success):
				values.append(result.value)
			else:
				return result

		return Success(values)





	def product_of(self):

		values = []

		for result in self.value:

			if not isinstance(result, Result):
				raise Exception("result wasn't a Result instance.")

			if isinstance(result, Success):
				values.append(result.value)
			else:
				return result

		return Success(values)
