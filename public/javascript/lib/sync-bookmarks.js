"use strict";

{
	var recur;

	(function () {

		// -- request all bookmarks below a given id number.

		var requestBookmarks = function (maxID, callback) {

			requestBookmarks.precond(maxID, callback);

			$.ajax({
				url: "/api/bookmarks?max_id=" + maxID + "&amount=" + ENGRAM.PERREQUEST,
				dataType: "json",
				success: function (_ref) {
					var data = _ref.data;
					var next_id = _ref.next_id;

					data.forEach(function (bookmark) {
						ENGRAM.eventBus.fire(":load-bookmark", bookmark);
					});

					callback({ data: data, next_id: next_id });
				},
				failure: function (res) {
					console.log("internal failure: bookmark chunk failed to load.");
				}

			});
		};

		requestBookmarks.precond = function (maxID, callback) {

			is.always.number(maxID, function (maxID) {
				"requestBookmarks: maxID was not a number (actual value: " + JSON.stringify(maxID) + ")";
			});

			is.always["function"](callback);
		};

		recur = (function (_recur) {
			var _recurWrapper = function recur(_x) {
				return _recur.apply(this, arguments);
			};

			_recurWrapper.toString = function () {
				return _recur.toString();
			};

			return _recurWrapper;
		})(function (_ref) {
			var data = _ref.data;
			var next_id = _ref.next_id;

			recur.precond(data, next_id);

			next_id > 0 && data.length > 0 ? setTimeout(requestBookmarks, ENGRAM.loadInterval, next_id, recur) : console.log("loaded all bookmarks.");
		});

		recur.precond = function (data, next_id) {
			is.always.array(data);
			is.always.number(next_id);
		};

		// -- sync bookmarks recurs when the data is loaded, fetching all bookmarks.

		ENGRAM.syncBookmarks = requestBookmarks.bind({}, ENGRAM.BIGINT, recur);
	})();
}
