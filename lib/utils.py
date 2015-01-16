#!/usr/bin/env python

import os





root = os.path.dirname(os.path.dirname(__file__))





def relative(fpath):
	return os.path.join(root, fpath)
