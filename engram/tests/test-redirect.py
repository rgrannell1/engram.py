#!/usr/bin/env python3

import unittest
import os
import sys
import requests

import utils_test

from multiprocessing import Process
import time



sys.path.append(os.path.abspath('engram'))

import engram







class TestRedirect(utils_test.EngramTestCase):

	def test_index(self):
		"""
		Story: Bookmark pages loads.

		In order to access the bookmarks
		I want to be able to use the endpoint /bookmarks

		Scenario: requesting /bookmarks gets a response.
			Given a running engram server on localhost:5000
			When someone sends /bookmarks
			Then the server sends back a html page
			And the response has status 200.
		"""

		index_response = requests.get('http://localhost:5000/')

		assert index_response.status_code             == 200
		assert index_response.headers['content-type'] == "text/html; charset=utf-8"





unittest.main()
