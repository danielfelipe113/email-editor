function froalaDirective(angular, app, onReadyCallback) {
	'use strict';

	loadCSS('/bower_components/froala-wysiwyg-editor/css/froala_editor.min.css');
	loadCSS('/bower_components/froala-wysiwyg-editor/css/froala_style.min.css');
	loadCSS('/bower_components/font-awesome/css/font-awesome.min.css');
	loadCSS('/bower_components/froala-wysiwyg-editor/css/plugins/colors.min.css');
	loadJS('/bower_components/froala-wysiwyg-editor/js/froala_editor.min.js', function onFroalaLoaded(){

		loadJS('/bower_components/froala-wysiwyg-editor/js/plugins/align.min.js');
		loadJS('/bower_components/froala-wysiwyg-editor/js/plugins/lists.min.js');
		loadJS('/bower_components/froala-wysiwyg-editor/js/plugins/colors.min.js');
		loadJS('/bower_components/froala-wysiwyg-editor/js/plugins/link.min.js');
		loadJS('/bower_components/froala-wysiwyg-editor/js/plugins/font_size.min.js');

		loadJS('/bower_components/froala-wysiwyg-editor/js/plugins/font_family.min.js', function onLastFroalaPlugin(){
			// 'personalization'
			// 'updateprofile'
			app.directive('froala', froala);

			if(typeof onReadyCallback === 'function'){
				onReadyCallback();
			}
		});
	});


	froala.$inject = ['$log', '_','$q'];

	/**
	* @name app.directive: froala
	*
	* @description
	*  WYSIWYG HTML Editor
	* 
	* @example
	<froala></froala>
	 */
	function froala($log, _, $q){

		return {
			restrict:'E',
			link: link
		};


		function link(scope, element, attributes, ctrl){

		}
	}
}

module.exports = froalaDirective;