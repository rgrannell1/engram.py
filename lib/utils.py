#!/usr/bin/env python

import time
import os





root = os.path.dirname(os.path.dirname(__file__))





def relative(fpath):
	return os.path.join(root, fpath)

def merge (dict0, dict1):

	out = dict0.copy()
	out.update(dict1)

	return out

def add_key(dict, key, value):

	out = dict.copy()
	out[key] = value

	return out

def now():
	return int(time.time())

def append(arr, value):

	out = list(arr)
	out.append(value)

	return out
