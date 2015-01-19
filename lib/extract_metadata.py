#!/usr/bin/env python

import utils

import urllib2
import lxml.html as lh

import subprocess

from result import Success, Failure





def extract_metadata(url):

	return (
		Success(url)
		.then(urllib2.urlopen)
		.then(lh.parse)
		.then(lambda page: page.find('.//title').text)
	)
