#!/usr/bin/env python

import utils
import subprocess
from result import Success, Failure





def call_phantom(url):

	fpath = utils.relative('lib/extract_metadata.js')

	return (
		Success(fpath)
		.bind( lambda fpath: subprocess.check_output(['phantomjs', fpath, url]) )
	)





def extract_metadata(url):
	return Success(url).then(call_phantom)
