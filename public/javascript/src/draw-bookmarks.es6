":use strict"




// -- remove this if I find an objective reason
// -- this is bad.

ENGRAM.drawFocus = function ( ) {

	setTimeout(( ) => ENGRAM.drawFocus(ENGRAM.inFocus), 100)
}





var prettifyDate = date => {

	var dateString = date.getFullYear( ) + '-' + (date.getMonth( ) + 1) + '-' + date.getDate( )
	var timeString = date.getHours( ) + ":" + date.getMinutes( )

	return dateString + ' ' + timeString

}





$.get('/public/html/bookmark-template.html', function (template) {

	var renderBookmark = bookmark => {

		bookmark.date = prettifyDate(new Date(1000 * bookmark.ctime))

		return Mustache.render(template, bookmark)

	}

	ENGRAM.drawFocus = focus => {

		ENGRAM.drawFocus.precond(focus)

		$('#bookmark-container').html(
			focus.value
			.map(
				({bookmark, _}) => renderBookmark(bookmark))
			.reduce(
				(html0, html1) => html0 + html1, '')
		)

		ENGRAM.eventBus.fire(':redraw', { })

	}

	ENGRAM.drawFocus.precond = focus => {

		is.always.object(focus)
		is.always.array(focus.value)
		is.always.string(focus.currentQuery)

	}

})





ENGRAM.eventBus.on(":update-focus", ENGRAM.drawFocus)
