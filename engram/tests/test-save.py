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





def assert_saved_correctly(uri):
	"""ensure that a url saved correctly to the database.
	"""

	if requests.get(uri).status_code == 200:

		save_path = 'http://localhost:5000' + '/' + uri

		assert requests.get(save_path).status_code == 204

	else:
		print('could not resolve %s' % (uri, ))





class TestSave(utils_test.EngramTestCase):

	def test_save_http(save):
		"""
		Story: Saving HTTP links.

		In order

		Scenario: saving IRIs
		Given a running engram server
		And a working URI
		When the client submits the URI as a path
		Then the server should return a 'no content' status  code.
		"""

		iris = [
			"http://graphemica.com/💩",
			"http://þorn.info/",
			"http://山东大学.cn/",
			"http://ar.wikipedia.org/wiki/إليزابيث_الأولى_ملكة_إنجلترا"
		]

		[assert_saved_correctly(iri) for iri in iris]





unittest.main()
