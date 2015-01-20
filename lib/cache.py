#!/usr/bin/env python





class Cache(object):

	def __init__(self, getID):
		self.contents = []





	def self.has(id):
		return id in self.ids





	def self.add(entry):

		id = getID(entry)

		if self.has(id):
			return Failure("already has ID.")
		else:
			self.ids.push(id)
			self.contents.push(entry)

			return Success(self)





	def self.remove(id):

		id = getID(entry)

		if self.has(id):

			id_ith = self.ids.index(id)

			self.ids.remove(id)
			self.contents = [entry for entry in self.contents if getID(entry) != id ]

			return Success(self)

		else:

			return Failure("already contained " + id)





	def self.retrieve(id):

		if self.has(id):
			return Success(next(entry for entry in self.contents if getID(entry) == id))
		else:
			return Failure("no match found for " + id)
