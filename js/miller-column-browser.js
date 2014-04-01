'use strict';

angular.module('millerColumnBrowser', [])
  .directive('columnBrowser', function() {
	  var dummy = false;
  	var hasFocus = false;
  	var currentAjaxRequest = null;
  	var settings = angular.extend({}, {
  				'url': function(id) { return id; },
  				'transform': function(lines) { return lines; },
  				'preloadedData': {},
  				'initialPath': [],
  				'tabindex': 0,
  				'minWidth': 40,
  				'carroussel': false,
  				'toolbar': {
  					'options': {}
  				},
  				'pane': {
  					'options': {}
  				}
  			});
    var currentLine = null;
	var path, columns, toolbar;
	
	var removeNextColumns = function(e) {
		var line = angular.element(this),
			column = line.parent(), i;
	
		while ( (i = column.next()) && i.length) {
			i.remove();
		}
	
		column.children().removeClass('selected');
		line.addClass('selected');			
	};
	
	var getLines = function(event) {
			var $el = angular.element(event.target);
			var id = $el.data('id');
			$el.addClass('selected').addClass('loading');

			// TODO: pass callback handler into here
			// then que up the result and pass back into buildColumn
			$el.removeClass('loading');
			buildColumn(dummy);
	};
	
	var buildColumn = function(lines) {
			if (currentLine && toolbar) {
//					toolbar.children().remove();
//					$.each(settings.toolbar.options, function(key, callback) {
//							$('<span>', { 'text': key })
//								.click(function() { callback.call(miller, currentLine.data('id')) })
//								.appendTo(toolbar)
//							;
//						}
//					);
			}
			
			if (lines.length <= 0) {
				var line = $('li.loading')
					.removeClass('parent')
					.addClass('selected')
				;

				if (!$.isEmptyObject(settings.pane.options)) {
					var pane = $('<ul>')
						.css({ 'top': 0, 'left': width })
						.addClass('pane')
					;

					var id = line.data('id');

					$.each(settings.pane.options, function(key, callback) {
							$('<li>', { 'text': key })
								.click(function() { callback.call(miller, currentLine.data('id')) })
								.appendTo(pane)
							;
						}
					);

					columns
						.append(pane)
						.scrollLeft(width + pane.width())
					;
				}
			} else {
//					$('li.loading').addClass('selected');
				var column = angular.element("<ul class='miller-column-browser-column'>");
				angular.forEach(lines, function(data, id) {
						var line = angular.element('<li>').text(data['name'])
							.data('id', data['id'])
							.on('click', removeNextColumns)
							.on('click', getLines)
						;
						column.append(line);

						if (data['parent']) {
							line.addClass('parent');
						}
					}
				);
				columns.append(column);
			}
		}
	;

    function link(scope, element, attrs) {
		if (!element.attr('tabindex')) {
			element.attr('tabindex', settings.tabindex);
		}

		element.addClass('miller-column-browser');
		var children = element.children();
		path = angular.element(children[0]);
		columns = angular.element(children[1]);
		toolbar = angular.element(children[2]);

		if (attrs.init) {
			// TODO: what if this is a function?
			try {
				dummy = JSON.parse(attrs.init);
				buildColumn(dummy);
			} catch (e) { }
		}
	}
	
    return {
		link: link,
		restrict: 'E',
		template: '<div class="path"></div><div class="columns"></div><div class="toolbar"></div>'
    };
  });
