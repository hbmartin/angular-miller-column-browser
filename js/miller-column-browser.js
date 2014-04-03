'use strict';

angular.module('millerColumnBrowser', [])
  .directive('columnBrowser', function($parse, $q, $http) {
  	var settings = {
		  				'tabindex': 0,
		  				'toolbar': {
		  					'options': {}
		  				},
		  				'pane': {
		  					'options': {}
		  				}
		  			};
    var currentLine = null;
	var path, columns, toolbar, wrapper;
	var callback;
	
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
			currentLine = angular.element(event.target);
			var id = currentLine.data('id');
			currentLine.addClass('selected').addClass('loading');
			// TODO: pass callback handler into here
			// then que up the result and pass back into buildColumn
			var promise = $q.when(callback(currentLine));
			promise.then(function(data){
				currentLine.removeClass('loading');
				buildColumn(data);
			});
	};
	
	var buildColumn = function(lines) {
			if (toolbar) {
//					toolbar.children().remove();
//					$.each(settings.toolbar.options, function(key, callback) {
//							$('<span>', { 'text': key })
//								.click(function() { callback.call(miller, loading.data('id')) })
//								.appendTo(toolbar)
//							;
//						}
//					);
			}
			
			if (!Array.isArray(lines) || lines.length <= 0) {
				if (settings.pane.options.length) {
					var pane = angular.element('<ul>')
						.css({ 'top': 0, 'left': width })
						.addClass('pane')
					;

					var id = line.data('id');

					angular.forEach(settings.pane.options, function(callback, key) {
							var j = angular.element('<li>').text(key)
								.click(function() { callback.call(miller, loading.data('id')) })
							;
							pane.append(j);
						}
					);

					columns.append(pane);
				}
			} else {
				var column = angular.element("<ul class='miller-column-browser-column'>");
				angular.forEach(lines, function(data, id) {
						var line = angular.element('<li>').text(data['name'] || data['id'])
							.attr('id', data['uid'] || data['id'] || "")
							.on('click', removeNextColumns)
							.on('click', getLines)
						;
						column.append(line);

						if (data['child']) {
							line.attr('data-child', JSON.stringify(data['child'])).addClass('parent');
						}
					}
				);
				columns.append(column);
				var width = columns.children().length * 302;
				columns.css("width", width + "px");
				wrapper[0].scrollLeft = width;
			}
		}
	;

    function link(scope, element, attrs) {
		if (!element.attr('tabindex')) {
			element.attr('tabindex', settings.tabindex);
		}
		if (scope.onSelected) {
			callback=$parse(scope.onSelected)(scope);
		}
		if (scope.settings) {
			angular.extend(settings, scope.settings);
		}
		element.addClass('miller-column-browser');
		var children = element.children();
		path = angular.element(children[0]);
		wrapper = angular.element(children[1]) 
		columns = angular.element(wrapper.children()[0]);
		toolbar = angular.element(children[2]);
		
		if (scope.initData) {
			// TODO: what if this is a function?
			try {
				buildColumn(JSON.parse(attrs.init));
			} catch (e) { }
		}
		else if (scope.initUrl) {
			$http.get(scope.initUrl)
					.success(function(data) {
						buildColumn(data);
					});
		}
	}
	
    return {
		link: link,
		restrict: 'E',
        scope: {
          onSelected: '&onSelected',
		  settings: '=',
		  initData: '=',
		  initUrl: '@'
        },
		template: '<div class="path"></div><div class="wrapper"><div class="columns"></div></div><div class="toolbar"></div>'
    };
  });
