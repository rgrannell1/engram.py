#!/usr/bin/env python3

import unittest
import os
import sys
import requests

import utils_test

import time



sys.path.append(os.path.abspath('engram'))

import engram










def assert_saved_correctly(uri):
	"""ensure that a url saved correctly to the database.
	"""

	is_up_uri = uri if ':' in uri else 'http://' + uri

	try:

		response = requests.get(is_up_uri, headers = {
			'Connection': 'close'
		}, timeout = 10)

		assert response.status_code == 200

		response.connection.close()

	except Exception as err:
		pass
	else:

		print ('============== ' + uri)

		response = requests.get('http://localhost:5000' + '/' + uri, headers = {
			'Connection': 'close'
		}, timeout = 10)

		assert response.status_code in {204, 404}, "%s failed with %d" % (uri, response.status_code)

		response.connection.close()




class TestSave(utils_test.EngramTestCase):

	def test_save_http(self):
		"""
		Story: Saving HTTP links.

		Scenario: saving URIs
		Given a running engram server
		And a working URI
		When the client submits the URI as a path
		Then the server should return a 'no content' status code.
		"""

		iris = [
			"http://graphemica.com/💩",
			"http://þorn.info/",
			"http://山东大学.cn/",
			"http://ar.wikipedia.org/wiki/إليزابيث_الأولى_ملكة_إنجلترا"
		]

		often_breaking = [
			"baidu.com/",
			"山东大学.cn/",
			"a8.net/",
			"weather.com/",
			"pagesperso-orange.fr/",
			"http://artyom.me/lens-over-tea-1",
			"https://www.youtube.com/results?search_query=rachmaninoff+opera"
		]

		uris = ["facebook.com/","twitter.com/","google.com/","youtube.com/","wordpress.org/","adobe.com/","blogspot.com/","wikipedia.org/","linkedin.com/","wordpress.com/","yahoo.com/","amazon.com/"]





		[assert_saved_correctly(iri) for iri in iris]
		[assert_saved_correctly(uri) for uri in often_breaking]
		[assert_saved_correctly(uri) for uri in uris]





unittest.main()
