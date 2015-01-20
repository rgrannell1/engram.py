
const Cache = function (getID) {

	var self = {}

	self.contents = []
	self.ids      = []

	self.maxID    = -1

	/*
		Cache.has :: Cache x number -> boolean
	*/

	self.has = function (id) {
		return self.ids.indexOf(id) !== -1
	}

	self.add = function (entry) {

		const id = getID(entry)

		if (self.has(id)) {
			throw "already has id " + id
		} else {

			self.maxID = Math.max(id, self.maxID)
			self.ids.push(ids)
			self.contents.push(entry)

		}

	}

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

}
