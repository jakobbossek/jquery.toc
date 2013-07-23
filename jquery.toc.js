(function($) {
	// FIXME: overwork "hash function". If toc() is applied multiple times,
	// the hash values are reused!!!
	// FIXME: eventually add possibility to determine maximal depth
	// i.e., the maximal header level that is taken into account
	$.fn.toc = function(options) {
		// set default settings for plugin
		var settings = $.extend({
			// option to shorten headlines that are too long
			shorten: false,
			// strip them after 
			shortenAfter: 50,
			// speed of scrolling animation
			scrollSpeed: 400,
			// wrapper for toc (for example if displayed in bubble)
			wrapWith: '<div class="tocContainer"/>',
		}, options);

		// helper function for animation
		// FIXME: make plugin depend on smoothScroll plugin
		var scrollToHeadline = function(target) {
			// smoothly scroll to corresponding headline
			$(document.body).animate(
				{'scrollTop': $(target).offset().top}, 
				settings.scrollSpeed,
				function() {}
			);
		};

		// iterate over all selected elements
		return this.each(function(index1) {
			// select all headers in current container
			var container = $(this);
			var headlines = $(':header', container);
			var toc = '<ul class="toc">';
			// init healine level
			// FIXME: determine initial level (extract from headlines)
			var level = 1;
			headlines.each(function(index2, headline) {
				// extract headline level
				console.log(headline);
				var cLevel = headline.tagName.replace(/[^\d]/g, "");
				// check whether it is necessary to start a nested list
				if (cLevel != level) {
					console.log("Entering new headline layer: " + cLevel);
					// making the following stuff is mandatory, because
					// there might be missing header levels
					// FIXME: make this better
					if (cLevel > level) {
						for (i = cLevel; i > level; i--) {
							toc += "<li><ul>";
						}
					} else {
						for (i = cLevel; i < level; i++) {
							toc += "</ul></li>";
						}
					}
					level = cLevel;
				}
				// build unique hash (for scrolling)
				var headlineId = 'hl_' + (index1 + 1) + (index2 + 1) + level;
				
				// build new TOC entry
				console.log($(headline).text());

				var currentHeadlineHTML = $(headline).html();
				var currentHeadlineText = $(headline).text();
				var shortenedHeadlineText = currentHeadlineText
				if (settings.strip) {
					shortenedHeadlineText = shortenedHeadlineText.substring(0, settings.stripAfter) + "...";
				}
				$(this).html('<a id="' + headlineId + '">' + currentHeadlineHTML);
				toc += '<li><a href="#' + headlineId + '" title="' + currentHeadlineText + '">' + shortenedHeadlineText + '</a></li>';
			});

			// finish list and append to parent element
			toc += '<ul>';
			container.append($(toc));

			$(".toc", container).wrap(settings.wrapWith);

			// make the links scroll fine
			$("li a", $(".toc")).click(function(e) {
				// prevent link to behave as usual
				e.preventDefault();

				// extract destination
				var target = $(e.target).attr('href');
				scrollToHeadline(target);
			});

		});
	};
})(jQuery);