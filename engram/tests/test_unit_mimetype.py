#!/usr/bin/env python3

import unittest
import utils_test
import sys
import os





sys.path.append(os.path.abspath('engram'))

import mimetype





class TestMimetype(unittest.TestCase):
	def test_tokenise_parametre(self):

		cases = [
			('q=0',                 ['q',       '0']),
			('param="=app=4"'),     ['param',   '"=app=4"']
			('version="app/3.0.0"', ['version', '"app/3.0.0"'])
		]

		for before, after in cases:
			assert mimetype.tokenise_parametre(before) == after, str(before) + " wasn't " + str(after)





unittest.main()
