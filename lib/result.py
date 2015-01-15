#!/usr/bin/env python3





class Result(object):

	# -- idempotent constructor.

	def __init__(self, value):

		if isinstance(value, (Success, Failure)):
			self.value = value.value
		else:
			self.value = value











class Failure(Result):

	def __init__(self, value):
		super().__init__(value)



	def __str__(self):
		return "Failure(%s)" % (str(self.value))





	def isSuccess(self):
		return False

	def isFailure(self):
		return True




	def then(self, fn):
		return Failure(self.value)

	def tap(self, fn):
		return Failure(self.value)







class Success(Result):

	# -- idempotent constructor.

	def __init__(self, value):
		super().__init__(value)





	def __str__(self):
		return "Success(%s)" % (str(self.value))




	def isSuccess(self):
		return True

	def isFailure(self):
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
