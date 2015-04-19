#!/usr/bin/env python3





class Database:

	def __init__(self, fpath):

		self.name = fpath
		self.conn = Result.of(lambda: lite.connect(fpath))

	def __str__(self):
		return "Database(" + self.name + ")"




	def perform(job):

		if isinstance(job, ReadJob):

			read_result = Result.of(lambda: self.conn.execute(job.query, job.args))

			job.callback(read_result)

		elif isinstance(job, WriteJob):

			write_result = (
				Result.of(lambda:    self.conn.cursor( ))
				.then(lambda cursor: cursor.execute(job.query, job.args))
				.then(lambda _:      self.conn.commit( ))
			)

			job.callback(write_result)





	def close(self):
		self.conn.close( )






class ReadJob:
	def __init__(self, query, callback):

		self.query    = query
		self.callback = callback

class WriteJob:
	def __init__(self, query):

		self.query = query





class Job:

	def write(self, query):
		return WriteJob(self, query)

	def read(self, query, callback = lambda x: x):
		return ReadJob(self, query, callback)
