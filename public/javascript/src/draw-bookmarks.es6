":use strict"




// -- remove this if I find an objective reason
// -- this is bad.

ENGRAM.drawFocus = function ( ) {

	setTimeout(( ) => ENGRAM.drawFocus(ENGRAM.inFocus), 100)
}

$.get('/public/html/bookmark-template.html', function (template) {

	var renderBookmark = bookmark => Mustache.render(template, bookmark)

	ENGRAM.drawFocus = focus => {

		ENGRAM.drawFocus.precond(focus)

		$('#bookmark-container').html(
			focus.value
			.map(
				({bookmark, _}) => renderBookmark(bookmark))
			.reduce(
				(html0, html1) => html0 + html1, '')
		)

		ENGRAM.eventBus.publish(':redraw', { })

	}

	ENGRAM.drawFocus.precond = focus => {

		is.always.object(focus)
		is.always.array(focus.value)
		is.always.string(focus.currentQuery)

	}

})





ENGRAM.eventBus.subscribe(":update-focus", ENGRAM.drawFocus)
