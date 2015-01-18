
#!/usr/bin/env python3

from result import Success, Failure
import sqlite3 as lite





class Database:

	def __init__(self, fpath):
		self.name = fpath
		self.conn = Success(fpath).then(lite.connect)

	def __str__(self):
		return "Database(" + self.name + ")"




	def then(self, fn):
		return self.conn.then(fn)

	def tap(self, fn):
		return self.conn.tap(fn)





	def execute(self, str, args = ()):

		return (
			self.conn
			.then(lambda conn:   conn.cursor())
			.then(lambda cursor: cursor.execute(str, args))
		)

	def commit(self, str, args = ()):

		commit_result = (
			self.conn
			.then( lambda conn:   conn.cursor() )
			.then( lambda cursor: cursor.execute(str, args) )
			.then( lambda _: self.conn.then(lambda conn: conn.commit()) )
		)

		return commit_result




	def close(self):
		self.then(lambda conn: conn.close())
