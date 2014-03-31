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
	var getLines = function(event) {
			var $el = angular.element(event.target);
			var id = $el.data('id');
			console.log(id);
			$el.removeClass('parentSelected').addClass('parentLoading');

			// TODO: pass callback handler into here
			// then que up the result and pass back into buildColumn
			$el.removeClass('parentLoading');
			buildColumn(dummy);
		}
	;
	var buildColumn = function(lines) {
			if (lines == null) {
				$('li.parentLoading').remove();
			} else {
				if (currentLine && toolbar) {
					toolbar.children().remove();

					$.each(settings.toolbar.options, function(key, callback) {
							$('<span>', { 'text': key })
								.click(function() { callback.call(miller, currentLine.data('id')) })
								.appendTo(toolbar)
							;
						}
					);
				}

				if (currentLine) {
					var currentColumn = currentLine.parent();
					var scroll = 0;
					var scrollTop = currentColumn.scrollTop();
					var topOfCurrentLine = currentLine.position().top;

					if (topOfCurrentLine < 0) {
						scroll = topOfCurrentLine;
					} else {
						var bottomOfCurrentLine = currentLine.position().top + currentLine.height();
						var heightOfCurrentColumn = currentColumn.height();

						if (bottomOfCurrentLine > heightOfCurrentColumn) {
							scroll = bottomOfCurrentLine - heightOfCurrentColumn;
						}
					}

					currentColumn.scrollTop(scrollTop + scroll);
				}

				var width = 0;
				
				if (lines.length <= 0) {
					var line = $('li.parentLoading')
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
//					$('li.parentLoading').addClass('parentSelected');
					var column = angular.element("<ul class='miller-column-browser-column'>");
					angular.forEach(lines, function(data, id) {
							var line = angular.element('<li>').text(data['name'])
								.data('id', data['id'])
								.on('click', getLines)
//								.click(removeNextColumns)
//								.click(getLines)
							;
							column.append(line);

							if (data['parent']) {
								line.addClass('parent');
							}
							if (data['class']) {
								line.addClass(data['class']);
							}
						}
					);
					columns.append(column);
				}
			}
		}
	;

    function link(scope, element, attrs) {
		if (!element.attr('tabindex')) {
			element.attr('tabindex', settings.tabindex);
		}

		element.addClass('miller-column-browser');
		path = angular.element(element.append('<div class="path">').children()[0]);
		columns = angular.element(element.append('<div class="columns">').children()[1]);
		toolbar = angular.element(element.append('<div class="toolbar">').children()[2]);

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
		template: ''
    };
  });
