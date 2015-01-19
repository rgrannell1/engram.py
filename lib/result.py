#!/usr/bin/env python





class Result(object):

	# -- idempotent constructor.

	def __init__(self, value):

		if isinstance(value, (Success, Failure)):
			self.value = value.value
		else:
			self.value = value





class Failure(Result):

	def __init__(self, value):
		super(Failure, self).__init__(value)



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

		if not isinstance(result, (Success, Failure)):
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

		if not isinstance(result, (Success, Failure)):
			raise Exception("result wasn't a Result instance.")

		if isinstance(result, Success):
			return Success([self.value, result.value])
		else:
			return result
