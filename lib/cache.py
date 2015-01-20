#!/usr/bin/env python





class Cache(object):

	def __init__(self, getID):
		self.contents = []





	def has(id):
		return id in self.ids





	def add(entry):

		id = getID(entry)

		if self.has(id):
			return Failure("already has ID.")
		else:
			self.ids.push(id)
			self.contents.push(entry)

			return Success(self)





	def remove(id):

		id = getID(entry)

		if self.has(id):

			id_ith = self.ids.index(id)

			self.ids.remove(id)
			self.contents = [entry for entry in self.contents if getID(entry) != id ]

			return Success(self)

		else:

			return Failure("already contained " + id)





	def retrieve(id):

		if self.has(id):
			return Success(next(entry for entry in self.contents if getID(entry) == id))
		else:
			return Failure("no match found for " + id)
