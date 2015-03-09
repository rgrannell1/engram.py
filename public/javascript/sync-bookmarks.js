"use strict";

{
	(function () {

		var requestChunk = function (maxID) {

			requestChunk.precond(maxID);

			$.ajax({
				url: "/api/bookmarks?max_id=" + maxID + "&amount=" + ENGRAM.PERREQUEST,
				dataType: "json",
				success: function (_ref) {
					var data = _ref.data;
					var next_id = _ref.next_id;

					data.forEach(function (bookmark) {
						ENGRAM.eventBus.publish(":load-bookmark", bookmark);
					});

					next_id >= 0 ? console.log("loaded all bookmarks.") : setTimeout(requestChunk, ENGRAM.loadInterval, next_id);
				},
				failure: function (res) {
					console.log("internal failure: bookmark chunk failed to load.");
				}

			});
		};

		requestChunk.precond = function (maxID) {

			is.always.number(maxID, function (maxID) {
				"requestChunk: maxID was not a number (actual value: " + JSON.stringify(maxID) + ")";
			});
		};

		ENGRAM.syncBookmarks = function () {
			requestChunk(ENGRAM.BIGINT);
		};
	})();
}
