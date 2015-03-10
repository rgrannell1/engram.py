
$(window).on('scroll', ( ) => {

	var $window   = $(window)
	var windowTop = $window.scrollTop( )

	ENGRAM.eventBus.publish(':scroll', {

		windowTop:      windowTop,
		scrollHeight:   $(document).height( ),
		scrollPosition: $window.height( ) + windowTop

	})

})

ENGRAM.eventBus.subscribe(':scroll', function detectEdge ({windowTop, scrollHeight, scrollPosition}) {

	if (scrollHeight - scrollPosition < ENGRAM.LOADOFFSET) {
		// what data should these publish ?

		ENGRAM.eventBus.publish(':atTop', { })

	} else if (windowTop < 50) {
		// what data should these publish ?

		ENGRAM.eventBus.publish(':atBottom', { })

	}

})
