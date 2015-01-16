#!/usr/bin/env python

import os





def relative(fpath):
	return os.path.join(os.path.dirname(__file__), fpath)
