#!/usr/bin/env python3

import unittest
import os
import sys
import requests

import utils

from multiprocessing import Process
import time



sys.path.append(os.path.abspath('engram'))

import engram










class TestExists(utils.EngramTestCase):

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







unittest.main()
