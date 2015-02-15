#!/usr/bin/env python3

import unittest
import os
import sys
import requests

import utils_test

import time



sys.path.append(os.path.abspath('engram'))

import engram





def fetch_url(max_id, amount):
	return 'http://localhost:5000/api/bookmarks?max_id=%d&amount=%d' % (max_id, amount)





class TestFetchChunk(utils_test.EngramTestCase):

	def test_fetch_chunk(self):
		"""
		Story: Fetching bookmarks

		Scenario: loading bookmarks
		Given a running engram server
		When the client specifies a maximum ID
		And a number designating how many bookmarks to return
		Then the server returns that many bookmarks.
		"""


		for max_id in {0, 1, 2, 10, 100, 1000, 10000, 9007199254740992}:
			for amount in {0, 1, 2, 10, 100, 1000, 10000, 9007199254740992}:

				response = requests.get(fetch_url(max_id, amount))

				assert response.status_code == 200

				response.connection.close()





	def test_fetch_chunk_malformed(self):
		"""
		Story: Fetching bookmarks with a bad uri

		Scenario: loading bookmarks
		Given a running engram server
		When the client specifies an invalid maximum ID
		Or invalid amount of bookmarks to return
		Then the server should return throw an obvious error.
		"""

		assert (
			requests
			.get(fetch_url(-1, 0), headers = {
				'Connection': 'close'
			})
			.status_code == 422
		)

		assert (
			requests
			.get(fetch_url(0, -1), headers = {
				'Connection': 'close'
			})
			.status_code == 422
		)









unittest.main()
