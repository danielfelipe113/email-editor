window.editorText = function editorText(angular, app, onReadyCallback) {
	'use strict';


	// loads wysiwyg editor
	require('./../froala/froala.js')(angular,app, function bootstrapEditor(){
		app.directive('editorText', editorText);
		if(typeof onReadyCallback === 'function'){
			onReadyCallback();
		}
	});

	editorText.$inject = ['$log', '_','$compile'];

	/**
	* @name app.directive: editorText
	*
	* @description
	*  Email Text Editor
	* 
	* @example
	<div data-editor-text></div>
	 */
	function editorText($log, _, compile){

		console.log('editorText');

		return {
			restrict:'A',
			link: link
		};

		function link(scope, element, attributes, ctrl){
			console.log(element);
			element = $(element);

		    element.froalaEditor({
		      toolbarInline: true,
		      charCounterCount: false,
		      toolbarButtons: ['bold', 'italic', 'underline', 'strikeThrough', 'color', 'emoticons', '-', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'indent', 'outdent', '-', 'insertImage', 'insertLink', 'insertFile', 'insertVideo', 'undo', 'redo']
		    });
		}
	}
};

module.exports = editorText;