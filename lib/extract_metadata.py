#!/usr/bin/env python

import utils
import subprocess
from result import Success, Failure





def call_phantom(url):

	fpath = utils.relative('lib/extract_metadata.js')

	try:

		output = subprocess.check_output(['phantomjs', fpath, url])
		return Success(output)

	except subprocess.CalledProcessError as err:
		return Failure(err)





def extract_metadata(url):

	return (
		Success(url).then(call_phantom)
	)
