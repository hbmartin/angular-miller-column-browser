# angular-miller-column-browser

## An implementation of [Miller columns](http://en.wikipedia.org/wiki/Miller_columns) with [AngularJS](http://angularjs.org/)!

It's a work in progress, so use it carefully!  
If you want to see this plugin in action, see [angular-rest-browser](https://github.com/hbmartin/angular-rest-browser).

## Features

* Keyboard navigation. (coming soon)
* Full customizable preview pane.
* Full customizable toolbar.
* Resizable columns.

## How to use it ?

There is no dependencies needed to use this plugin. 
To use it:
1. Clone the repository or download the source in a directory.  
2. Add this line in the head of your html page:--

``` html
<link rel="stylesheet" href="../bower_components/angular-miller-column-browser/css/jquery.miller.css" />
```

3. Add a `<column-browser></column-browser>` directive in your view.  
4. Add this line to your angular scripts:  

``` html
<script src="../bower_components/angular-miller-column-browser/js/miller-column-browser.js"></script>
```

5. TODO: fix this step...
Create a JavaScript script with this content and add it t the end of the body of your html page:

``` JavaScript
$(document).ready(function() { $('div').miller() });
```

You can pass an object litteral to the `miller` function to customize behavior of the plugin.  
The default values are :

``` JavaScript
{
	url: function(id) { return id; }, // generate url for ajax call, id is the value of the node ID
	transform: function(lines) { return lines; }, // transform the data to conform to the JSON array structure outlined below
	preloadedData: {}, // A data object matching the JSON structure below that will be used before calls to 'url' to fetch data
	initialPath: [], // The path to initialize the UI to.  This is an array of IDs.  Currently only works when using preloadedData.
	minWidth: 40, // minimum width of one column
	tabindex: 0, // default tabindex if it is undefined on the DOM element
	carroussel: false, // If set to true, the user will go to the first item of the column if it use ↓ on the last item
	toolbar: {
		options: {} // Add callbacks here to handle actions in the toolbar, see the demo for more informations
	},
	pane: {
		options: {} // Add callbacks here to handle actions in the pane, see the demo for more informations
	}
}
```

The ajax call must return a JSON array with the following structure:

``` JavaScript
[
   { 'id': 'ID of node 1', 'name': 'Name of node 1', 'parent': false }, // this node has no child
   { 'id': 'ID of node 2', 'name': 'Name of node 2', 'parent': true }, // this node has some children
   { 'id': 'ID of node 3', 'name': 'Name of node 3', 'parent': false }, // this node has no child
   { 'id': 'ID of node 4', 'name': 'Name of node 4', 'parent': false, 'image': '../image.png' }, // this node has an image
	// and so on…
]

```
