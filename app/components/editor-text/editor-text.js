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

		return {
			restrict:'A',
			link: link
		};

		function link(scope, element, attributes, ctrl){
			element = $(element);
			var contentBlock = element.parents('.editor-content-block:eq(0)');

		    element.froalaEditor({
		    	initOnClick:true,
				toolbarInline:true,
				toolbarButtons: ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'indent', 'outdent', 'insertImage', 'insertLink', 'insertFile', 'insertVideo', 'undo', 'redo'],
				// heightMax:50
		    });

			contentBlock.on('click',
				'.content-block-overlay, .content-block-menu-bar .edit', 
				function onContentBlockClick(e){
					contentBlock.addClass('active');
					element.froalaEditor('events.focus');
				}
			);



		    scope.$on('$destroy', function onDestroy(){
				element
					.parents('.editor-content-block').find('.content-block-overlay, .content-block-menu-bar .edit')
					.off();
		    });
		}
	}
};

module.exports = editorText;