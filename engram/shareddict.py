#!/usr/bin/env python3

import time




class SharedDict:
	def __init__(self, data = { }):

		self.data = data

	def __getitem__(self, id):

		seconds_sleep = 1 / 12
		retries       = 60 * 2

		for ith in range(retries):

			if id in self.data:
				return self.data[id]
			else:
				time.sleep(seconds_sleep)

		raise LookupError('timed out')

	def __setitem__(self, key, value):
		self.data[key] = value
