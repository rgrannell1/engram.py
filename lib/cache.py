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
		"""
		does the cache contain a particular id/entry?.

		Cache.has :: id -> boolean
		"""
		return id in self.ids





	def add(self, entry, sort = True):
		"""
		Try to add an entry to the cache.

		Cache.add :: any x boolean -> Result Cache
		"""

		id = self.getID(entry)

		if self.has(id):
			return Failure("already has ID.")
		else:
			self.ids.append(id)
			self.contents.append(entry)

			if sort:
				self.ids.sort()
				self.contents.sort(key = self.getID)

			return Success(self)




	def addAll(self, entries):

		result = Success(self)

		for entry in entries:
			result = result.then(lambda self: self.add(entry, False))

		self.ids.sort()
		self.contents.sort(key = self.getID)

		return result





	def remove(self, id):

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




	def fetchChunk(self, maxID, amount):

		chunk = []

		for entry in self.contents[::-1]:
			if self.getID(entry) <= maxID:
				chunk.append(entry)

			if len(chunk) >= amount:
				break

		if chunk:

			return {
				'data':   chunk,
				'nextID': self.getID(min(chunk, key = self.getID)) - 1
			}

		else:

			return {
				'data':   chunk,
				'nextID': -1
			}

