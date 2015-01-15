#!/usr/bin/env python3

from result import Success, Failure
import sqlite3 as lite





def connect_database(fpath):
	return Success(fpath).then(lite.connect)
