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










class EngramTestCase(unittest.TestCase):

	def setUp(self):

		self.process = Process(target = engram.create, args = (':memory', True))
		self.process.start()

		print('running tests in four seconds...')
		time.sleep(4)




	def tearDown(self):

		try:

			self.process.terminate()
			self.process.join()

		except Exception as err:

			print('failed to terminate process.')
			print(err)
