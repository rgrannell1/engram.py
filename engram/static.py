#!/usr/bin/env python3

import os





def loadStatic(fpath, extension, fnames):
	return [{'content': open(os.path.join(fpath, name + extension), 'r').read()} for name in fnames]


def loadJS(fnames):
	return loadStatic('public/javascript/lib', '.js', fnames)

def loadCSS(fnames):
	return loadStatic('public/css', '.css', fnames)
