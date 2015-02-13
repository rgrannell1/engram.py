#!/usr/bin/env python

from setuptools import setup




setup(
	name             = 'engram',
	version          = '0.1.0',
	description      = 'minimal bookmarking.',
	author           = 'Ryan Grannell',
	url              = 'https://github.com/rgrannell1/engram.py',
	py_modules       = ["engram"],
	install_requires = [
		"pystache", "requests", "httplib2", "lxml", "flask", "wget"
	]
)
