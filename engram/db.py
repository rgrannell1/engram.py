#!/usr/bin/env python3

from result import Ok, Err, Result
import sqlite3 as lite

from collections import namedtuple





class Database:

	def __init__(self, fpath, input_queue, output_queue):

		self.name = fpath
		self.conn = lite.connect(fpath)

		self.input_queue  = input_queue
		self.output_queue = output_queue






	def __str__(self):
		return "Database(" + self.name + ")"




	def perform(self):

		job = self.input_queue.get( )

		if isinstance(job, ReadJob):

			result = (
				Result.of(lambda: self.conn.execute(job.query, job.args))
				.then(lambda cursor: cursor.fetchall( ))
			)

		elif isinstance(job, WriteJob):

			result = (
				Result.of(lambda:    self.conn.cursor( ))
				.then(lambda cursor: cursor.execute(job.query, job.args))
				.then(lambda _:      self.conn.commit( ))
			)

		self.output_queue.data[id(job)] = result
		self.input_queue.task_done( )





	def close(self):
		self.conn.close( )




ReadJob  = namedtuple('ReadJob',  ['query', 'args'])
WriteJob = namedtuple('WriteJob', ['query', 'args'])
