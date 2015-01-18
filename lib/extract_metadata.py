#!/usr/bin/env python

import utils

import urllib2
import lxml.html as lh

import subprocess

from result import Success, Failure





def call_phantom(url):

	fpath = utils.relative('lib/extract_metadata.js')

	return (
		Success(fpath)
		.then( lambda fpath: subprocess.check_output(['phantomjs', fpath, url]) )
	)





def extract_metadata(url):

	return (
		Success(url)
		.then(urllib2.urlopen)
		.then(lh.parse)
		.then(lambda page: page.find('.//title').text)
	)
