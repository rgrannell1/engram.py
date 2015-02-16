#!/usr/bin/env python3

import time
import os





root = os.path.dirname(os.path.dirname(__file__))





def relative(fpath):
	return os.path.join(root, fpath)

def now():
	return int(time.time())

def ensure(bool, message = ''):
	if not bool:
		raise AssertionError(message)
