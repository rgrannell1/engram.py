
const Cache = function (getID) {

	var self = {}

	self.contents = []
	self.ids      = []

	self.maxID    = -1





	/*
		Cache.has :: Cache x number -> boolean

		check if an id has a corresponding id within the cache.

	*/

	self.has = function (id) {
		return self.ids.indexOf(id) !== -1
	}





	/*

		Cache.add :: Cache x object -> undefined

		add an entry to the cache. If an entry with
		the same ID is already in the cache throw an error.

	*/

	self.add = function (entry) {

		const id = getID(entry)
		console.log(entry)

		if (typeof id === 'undefined') {
			throw "undefined id."
		}

		if (self.has(id)) {
			throw "already has id " + id
		} else {

			self.maxID = Math.max(id, self.maxID)
			self.ids.push(id)
			self.contents.push(entry)

		}

	}




	/*
		Cache.remove :: Cache x number -> undefined

		remove an entry from the cache by id. Throws an
		error if no match is found.

	*/
	self.remove = function (id) {

		if (self.has(id)) {

			const id_ith = self.ids.indexOf(id)

			self.ids      = self.ids.slice(id_ith, 1)
			self.contents = self.contents.filter(function (entry) {
				return getID(entry) != id
			})

		} else {
			throw "no match found for " + id
		}

	}





	/*
		Cache.retrieve :: Cache x number -> object

		retrive an entry from the cache by ID.

	*/

	self.retrieve = function (id) {

		if (self.has(id)) {

			const matches = contents.filter( function (entry) {
				return getID(entry) === id}
			)

			return matches[0]

		} else {
			throw "no match found for " + id
		}

	}

	return self

}
