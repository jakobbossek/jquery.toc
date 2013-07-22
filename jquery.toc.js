(function($) {
	// FIXME: overwork "hash function". If toc() is applied multiple times,
	// the hash values are reused!!!
	$.fn.toc = function(options) {
		// set default settings for plugin
		var settings = $.extend({
			// option to strip headlines that are too long
			stripAfter: 50,
			scrollSpeed: 400,
			wrapWith: '<div class="toc_container"/>'
		}, options);

		// helper function for animation
		// FIXME: make plugin depend on smoothScroll plugin
		var scrollToHeadline = function(target) {
			// smoothly scroll to corresponding headline
			$(document.body).animate(
				{'scrollTop': $(target).offset().top}, 
				settings.scrollSpeed, 
				"swing",
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
				var currentHeadline = $(headline).html();
				$(this).html('<a id="' + headlineId + '">' + currentHeadline);
				toc += '<li><a href="#' + headlineId + '">' + currentHeadline + '</a></li>';
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