
class searchState {

	constructor() {
		this.previousQuery = ''
		this.currentQuery  = ''
	}

	setQuery(query) {
		this.previousQuery = this.currentQuery
		this.currentQuery  = query
	}

}
