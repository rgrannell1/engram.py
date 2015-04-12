"use strict";

var listeners = {};

{
	(function () {

		var eventCode = {
			escape: 27,
			backspace: 8
		};

		var isTypeable = function (event) {

			return (event.keyCode >= 41 && event.keyCode < 122 || (event.keyCode == 32 || event.keyCode > 186)) && event.key.length === 1;
		};

		var $window = $(window);

		/*
  	rebroadcastKeyEvents
  		convert JS keystroke events into published messages.
  	*/

		listeners.rebroadcastKeyEvents = function () {

			$window.keydown(function (event) {

				var keyCode = event.keyCode;

				if (event.keyCode === eventCode.escape) {
					ENGRAM.eventBus.fire(":press-escape");
				} else if (event.keyCode === eventCode.backspace) {
					ENGRAM.eventBus.fire(":press-backspace");
				} else {

					if (isTypeable(event) && !event.ctrlKey && !event.altKey) {

						ENGRAM.eventBus.fire(":press-typeable", {
							key: event.key
						});
					}
				}
			});
		};
	})();
}

{
	(function () {

		var $document = $(document);

		listeners.deleteBookmark = function () {

			$document.on("click", ".delete-bookmark", function () {

				var $button = $(this);

				var $article = $button.closest("article");
				var id = parseInt($article.attr("id"), 10);

				ENGRAM.eventBus.fire(":delete-bookmark", { id: id, $button: $button });
			});
		};
	})();
}

{
	(function () {

		var $window = $(window);
		var $document = $(document);

		listeners.onScroll = function () {

			$window.on("scroll", function () {

				var windowTop = $window.scrollTop();

				ENGRAM.eventBus.fire(":scroll", {

					windowTop: windowTop,
					scrollHeight: $document.height(),
					scrollPosition: $window.height() + windowTop

				});
			});
		};
	})();
}
