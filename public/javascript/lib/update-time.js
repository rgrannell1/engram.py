"use strict";

{
	var formatInterval;
	var extractTime;
	var secondsBetween;
	var renderTime;

	(function () {

		var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

		var oneSecond = 1;
		var oneMinute = 60;
		var oneHour = 3600;
		var oneDay = 24 * 3600;

		formatInterval = function (seconds) {

			var now = new Date();
			var ctime = new Date(now - 1000 * seconds);

			if (seconds < oneMinute) {
				return "" + seconds + "s";
			} else if (seconds < oneHour) {
				return "" + Math.round(seconds / oneMinute) + "m";
			} else if (seconds < oneDay) {
				return "" + Math.round(seconds / oneHour) + "h";
			} else {

				var year = ctime.getFullYear() === now.getFullYear() ? "" : ctime.getFullYear();

				return "" + months[ctime.getMonth()] + " " + ctime.getDate() + " " + year;
			}
		};

		extractTime = function (time) {
			return new Date(parseInt($(time).attr("data-ctime"), 10) * 1000);
		};

		secondsBetween = function (recent, old) {
			return Math.floor((recent.getTime() - old.getTime()) / 1000);
		};

		renderTime = function ($time) {

			var elapsed = secondsBetween(new Date(), extractTime($time));
			$time.text(formatInterval(elapsed));
		};

		ENGRAM.updateTimes = function () {

			$(".bookmark time").each(function () {
				renderTime($(this));
			});
		};
	})();
}
