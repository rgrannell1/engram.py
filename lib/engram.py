#!/usr/bin/env python

from result import Success, Failure
from flask import Flask

from database import connect_database
import sql





app = Flask(__name__)





def main():

	main_result = (
		connect_database('data/engram')
		.tap(sql.create_tables)
	)





if __name__ == "__main__":
	main()
