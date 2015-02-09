
ENGRAM.Cache = function (getID) {

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

		return self

	}





	/*


	*/

	self.addAll = function (entries) {

		if (self.contents.length === 0){
			console.log(entries)
		}

		entries.forEach(function (entry) {
			self.add(entry)
		})

		return self

	}





	/*
		Cache.remove :: Cache x number -> undefined

		remove an entry from the cache by id. Throws an
		error if no match is found.

	*/

	self.remove = function (id) {

		if (!is.number(id)) {
			throw "remove: attempt to retrieve a non-number"
		}

		if (self.has(id)) {

			const id_ith = self.ids.indexOf(id)

			self.ids      = self.ids.slice(id_ith, 1)
			self.contents = self.contents.filter(function (entry) {
				return getID(entry) != id
			})

		} else {
			throw "no match found for " + id
		}

		return self

	}





	/*
		Cache.retrieve :: Cache x number -> object

		retrive an entry from the cache by ID.

	*/

	self.retrieve = function (id) {

		if (!is.number(id)) {
			throw "retrieve: attempt to retrieve a non-number"
		}

		if (self.has(id)) {

			const matches = self.contents.filter( function (entry) {
				return getID(entry) === id}
			)

			return matches[0]

		} else {
			throw "no match found for " + id
		}

	}




	self.fetchChunk = function (maxID, amount, pred) {

		if (!is.number(maxID)) {
			throw "fetchChunk: attempt to set maxID to non-number (" + JSON.stringify(maxID) + ")"
		}

		if (!is.number(amount)) {
			throw "fetchChunk: attempt to set amount to non-number (" + JSON.stringify(amount) + ")"
		}

		pred = pred || function (entry) {return true}





		const chunk = []

		for (var ith = 0; ith < self.contents.length; ++ith) {

			var entry = self.contents[ith]

			if ( getID(entry) <= maxID && pred(entry) ) {
				chunk.push(entry)
			}

			if (chunk.length >= amount) {
				break
			}

		}

		if (chunk.length > amount) {
			throw RangeError('internal error: chunk was too long (' + chunk.length + ')')
		} else if (chunk.length > 0) {

			const minID = chunk.reduce(function (smallest, current) {
				return Math.min(smallest, getID(current))
			}, Infinity)

			return {
				data:   chunk,
				nextID: minID - 1,
				maxID:  chunk.map(getID).reduce(function (a, b) {return Math.max(a, b)})
			}

		} else {
			return {
				data:   chunk,
				nextID: -1,
				maxID:  -1
			}
		}

	}






	return self

}
