#!/usr/bin/env python3

import unittest
import utils_test
import sys
import os





sys.path.append(os.path.abspath('engram'))

import mimetype





class TestMimetype(unittest.TestCase):
	def test_tokenise_parametre(self):

		content_types = [
			( "text/html; charset=utf-8",                      {'type': 'text',        'subtype': 'html',                    'params': {
				'charset': 'utf-8'
			}} ),
			( "application/java-archive",                      {'type': 'application', 'subtype': 'java-archive',            'params': {

			}} ),
			( "text/html; charset=windows-874",                {'type': 'text',        'subtype': 'html',                    'params': {
				'charset': 'windows-874'
			}} ),
			( "application/xhtml+xml; charset=utf-8",          {'type': 'application', 'subtype': 'xhtml+xml',               'params': {
				'charset': 'utf-8'
			}} ),
			( "application/xml; charset=ISO-8859-1",           {'type': 'application', 'subtype': 'xml',                     'params': {
				'charset': 'charset=ISO-8859-1'
			}} ),
			( "application/xhtml+xml; charset=utf-8",          {'type': 'application', 'subtype': 'xhtml+xml',               'params': {
				'charset': 'utf-8'
			}} ),
			( "application/x-web-app-manifest+json",           {'type': 'application', 'subtype': 'x-web-app-manifest+json', 'params': {

			}} ),
			( 'multipart/x-mixed-replace; boundary="testing"', {'type': 'multipart',   'subtype': 'x-mixed-replace',         'params': {
				'boundary': '"testing"'
			}} )
		]

		for before, after in content_types:

			parsed = mimetype.parse(before)

			assert parsed.is_success()

			assert parsed.from_success() == after, str(parsed.from_success()) + " wasn't " + str(after)





unittest.main()
