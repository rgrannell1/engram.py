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
				'charset': 'ISO-8859-1'
			}} ),
			( "application/xhtml+xml; charset=utf-8",          {'type': 'application', 'subtype': 'xhtml+xml',               'params': {
				'charset': 'utf-8'
			}} ),
			( "application/x-web-app-manifest+json",           {'type': 'application', 'subtype': 'x-web-app-manifest+json', 'params': {

			}} ),
			( 'multipart/x-mixed-replace; boundary="testing"', {'type': 'multipart',   'subtype': 'x-mixed-replace',         'params': {
				'boundary': '"testing"'
			}} ),

			("text/html;",                        {'type': 'text', 'subtype': 'html',        'params': {

			}} ),
			("text/html; charset=utf-8",          {'type': 'text', 'subtype': 'html',        'params': {
				'charset': 'utf-8'
			}} ),
			("text/html; charset=UTF-8",          {'type': 'text', 'subtype': 'html',        'params': {
				'charset': 'UTF-8'
			}} ),
			("text/html;charset=utf-8",           {'type': 'text', 'subtype': 'html',        'params': {
				'charset': 'utf-8'
			}} ),
			("text/html; charset=ISO-8859-1",     {'type': 'text', 'subtype': 'html',        'params': {
				'charset': 'ISO-8859-1'
			}} ),
			("text/html;charset=UTF-8",           {'type': 'text', 'subtype': 'html',        'params': {
				'charset': 'UTF-8'
			}} ),
			("text/html; charset=GB2312",         {'type': 'text', 'subtype': 'html',        'params': {
				'charset': 'GB2312'
			}} ),
			("text/html;charset=ISO-8859-1",      {'type': 'text', 'subtype': 'html',        'params': {
				'charset': 'ISO-8859-1'
			}} ),
			("text/html; charset=windows-1251",   {'type': 'text', 'subtype': 'html',        'params': {
				'charset': 'windows-1251'
			}} ),
			("text/html; charset=Shift_JIS",      {'type': 'text', 'subtype': 'html',        'params': {
				'charset': 'Shift_JIS'
			}} ),
			("text/html;;charset=utf-8",          {'type': 'text', 'subtype': 'html',        'params': {
				'charset': 'utf-8'
			}} ),
			("text/html; charset=GBK",            {'type': 'text', 'subtype': 'html',        'params': {
				'charset': 'GBK'
			}} ),
			("text/html; charset=utf8",           {'type': 'text', 'subtype': 'html',        'params': {
				'charset': 'utf8'
			}} ),
			("text/html; charset=EUC-JP",         {'type': 'text', 'subtype': 'html',        'params': {
				'charset': 'EUC-JP'
			}} ),
			("text/html; charset=ISO-8859-15",    {'type': 'text', 'subtype': 'html',        'params': {
				'charset': 'ISO-8859-15'
			}} ),
			("text/vnd.wap.wml",                  {'type': 'text', 'subtype': 'vnd.wap.wml', 'params': {

			}} ),
			("text/html; charset=gbk",            {'type': 'text', 'subtype': 'html',        'params': {
				'charset': 'gbk'
			}} ),
			("text/html; charset=iso-8859-1",     {'type': 'text', 'subtype': 'html',        'params': {
				'charset': 'iso-8859-1'
			}} ),
			("text/html; charset=ISO-8859-2",     {'type': 'text', 'subtype': 'html',        'params': {
				'charset': 'ISO-8859-2'
			}} )
		]






		for before, after in content_types:

			parsed = mimetype.parse(before)

			assert parsed.is_ok()

			assert parsed.from_ok() == after, str(parsed.from_ok()) + " wasn't " + str(after)





unittest.main()
