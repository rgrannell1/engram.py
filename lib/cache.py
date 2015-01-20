#!/usr/bin/env python

import utils
from result import Success, Failure



class Cache(object):

	def __init__(self, getID):
		self.contents = []
		self.ids      = []

		self.getID    = getID

	def __str__(self):
		return str(self.contents)





	def has(self, id):
		return id in self.ids





	def add(self, entry):

		id = self.getID(entry)

		if self.has(id):
			return Failure("already has ID.")
		else:
			self.ids.append(id)
			self.contents.append(entry)

			self.ids.sort()
			self.contents.sort(key = self.getID)

			return Success(self)




	def addAll(self, entries):

		result = Success(self)

		for entry in entries:
			result = result.then(lambda self: self.add(entry))

		return result





	def remove(self, id):

		id = self.getID(entry)

		if self.has(id):

			id_ith = self.ids.index(id)

			self.ids.remove(id)
			self.contents = [entry for entry in self.contents if self.getID(entry) != id ]

			return Success(self)

		else:

			return Failure("already contained " + id)





	def retrieve(self, id):

		if self.has(id):
			return Success(next(entry for entry in self.contents if self.getID(entry) == id))
		else:
			return Failure("no match found for " + id)




	def fetchChunk(self, min_id, amount):

		result = Success([ ])

		for id in range(min_id, amount + 1):
			if self.has(id):
				result = result.then( lambda entries: utils.append(entries, self.retrieve[id]) )

		return result
