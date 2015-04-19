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
		return Ok(None).then(lambda _: fn( ))





	def from_ok(self):
		"""Extract the contents of a Ok object

		Throws a TypeError when called on a non-success object.

		>> Err('contents').from_ok()
		'contents'

		>> Ok('contents').from_ok()
		TypeError('attempted to call from_ok on a Err object.')

		"""

		if isinstance(self, Ok):
			return self.value
		elif isinstance(self, Err):
			raise TypeError("attempted to call from_ok on a Err object.")





	def from_err(self):
		"""Extract the contents of a Err object

		Throws a TypeError when called on a non-failure object.

		>> Err('contents').from_err()
		'contents'

		>> Ok('contents').from_err()
		TypeError('attempted to call from_err on a Ok object.')

		"""

		if isinstance(self, Err):
			return self.value
		elif isinstance(self, Self):
			raise TypeError("attempted to call from_err on a Ok object.")





	def is_ok(self):
		"""Is this Result a Ok instance?
		"""
		return isinstance(self, Ok)

	def is_err(self):
		"""Is this Result a Err instance?
		"""
		return isinstance(self, Err)










class Err(Result):

	def __init__(self, value):

		self.value = value.value if isinstance(value, Result) else value
		logging.error(self.value)

		#traceback.print_exc()


	def __str__(self):
		return "Err(%s)" % (str(self.value))





	def then(self, fn):
		return self

	def tap(self, fn):
		return self

	def product_of(self):
		return self



	def cross(self, results):
		return self





class Ok(Result):

	def __init__(self, value):
		super(Ok, self).__init__(value)





	def __str__(self):
		return "Ok(%s)" % (str(self.value))





	def then(self, fn):

		try:
			result = fn(self.value)

			if isinstance(result, Err):
				return result
			else:
				return Ok(result)

		except Exception as err:
			return Err(err)

		return result





	def tap(self, fn):
		"""apply a function to a Result object, but only keep the new result if the call fails.
		"""

		result = self.then(fn)

		if isinstance(result, Err):
			return result
		else:
			return self





	def cross(self, results):
		"""get the product of two Result object.

		>> Ok('a').cross(Ok(['b']))
		Ok(['a', 'b'])
		"""

		values = [self.value]

		for result in results:
			if not isinstance(result, Result):
				raise Exception("result wasn't a Result instance.")

			if isinstance(result, Ok):
				values.append(result.value)
			else:
				return result

		return Ok(values)





	def product_of(self):

		values = []

		for result in self.value:

			if not isinstance(result, Result):
				raise Exception("result wasn't a Result instance.")

			if isinstance(result, Ok):
				values.append(result.value)
			else:
				return result

		return Ok(values)
