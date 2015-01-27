#!/usr/bin/env python3

import unittest
import os
import sys
import requests

from multiprocessing import Process
import time



sys.path.append(os.path.abspath('engram'))

import engram










class TestExists(unittest.TestCase):

	def setUp(self):

		self.pid = Process(target = engram.create, args = (':memory', ))
		self.pid.start()

		print('running tests in six seconds...')
		time.sleep(6)





	def tearDown(self):
		self.pid.terminate()





	def test_bookmarks(self):
		"""
		Story: Bookmark pages loads.

		In order to access the bookmarks
		I want to be able to use the endpoint /bookmarks

		Scenario: requesting /bookmarks gets a response.
			Given a running engram server on localhost:5000
			When someone sends /bookmarks
			Then the server sends back a response code indicating the page exists (anything but 404).
		"""

		bookmarks_response = requests.get('http://localhost:5000/bookmarks')
		assert bookmarks_response.status_code != 404





	def test_shutdown(self):
		"""
		Story: Server can be shutdown.

		In order to turn off a server
		I want to be able to trigger a shutdown using an endpoint

		Scenario: posting a shutdown kills the server.
			Given a running engram server on localhost:5000
			When someone sends a shutdown request
			Then the server sends back an acknowledgement that it is shutting down.
		"""

		response = requests.post('http://localhost:5000/shutdown')

		assert response.status_code == 200
		assert response.text        == 'shutting down.'





unittest.main()
