window.editorText = function editorText(angular, app, onReadyCallback) {
	'use strict';


	// loads wysiwyg editor
	require('./../froala/froala.js')(angular,app, function bootstrapEditor(){
		app.directive('editorText', editorText);
		if(typeof onReadyCallback === 'function'){
			loadCSS('/components/editor-text/editor-text.css');
			setTimeout(onReadyCallback, 0);
		}
	});

	editorText.$inject = ['$log', '_','$compile', 'constants'];

	/**
	* @name app.directive: editorText
	*
	* @description
	*  Email Text Editor
	*
	* @example
	<div data-editor-text></div>
	 */
	function editorText($log, _, compile, constants){

		return {
			restrict:'A',
			link: link
		};

		function link(scope, element, attributes, ctrl){

			element = $(element).find('[data-contenteditable]');
			var contentBlock = element.parents('.'+ constants.contentBlockClass +':eq(0)'),
				actionType = 'Text Editor Change',
				lastValue,
				contentBlockId,
				defaultValue;

			function init(){

				setupFroala();
				disableLinks();

			    scope.$on('$destroy', function onDestroy(){
					contentBlock.off('.editorText');
			    });

			    // get content block id

			    // undo/redo events
			    // editorEvents.onPerformUndoRedo(scope, performAction);

			}

			/**
			 * Setups Froala Interaction
			 * @return {[type]} [description]
			 */
			function setupFroala(){
				contentBlock
						.on('editEnable', onEditorFocus);

				element
				    .froalaEditor({
						toolbarButtons: ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'indent', 'outdent', 'insertImage', 'insertLink', 'insertFile', 'insertVideo', 'undo', 'redo'],
				    })
				    .on('froalaEditor.initialized', function onInitialized(e, editor){
			        	//lastValue = instance.getData();
				    })
				    .on('froalaEditor.blur', onEditorBlur);

				// CKEDITOR.config.scayt_autoStartup = configuration.autoSpellCheck;
			}

			/**
			 * Actions to perform once the user let the editor
			 * @param  {Event} e - jQuery event Object
			 * @return {[type]}   [description]
			 */
			function onEditorBlur(e){
				contentBlock.trigger('editDisable');
				// /// restore default text if the user doesnt set any text
				// if (element.hasClass(configuration.contentBlockDefaultValue) && instance.getData() === '') {
				//     instance.setData(configuration.defaultValueText);
				// }

				// //there was a change on content?
				// if (instance.getData() !== lastValue) {

				//     reflectDefaultValue(instance.getData());

				//     //notify "editor content changed" subscribers
				//     editorEvents.editorContentChanged(actionType, scope.editorId, contentBlockId, lastValue, instance.getData());

				//     //update our last value
				//     lastValue = instance.getData();
				// }
			}

			/**
			 * Actions to perform when the user wants to interact with the editor
			 * @param  {Event} e  - jQuery event object
			 * @return {[type]}   [description]
			 */
			function onEditorFocus(e){
				element.froalaEditor('events.focus');

			    // remove default text when user clicks
				// var editorValue = instance.getData().trim();

				// if (editorValue.length > configuration.defaultValueText.length) {
				// 	editorValue = editorValue.substring(0, configuration.defaultValueText.length);
				// }

				// if (editorValue == configuration.defaultValueText && element.hasClass(configuration.contentBlockDefaultValue)) {
				// 	instance.setData('');
				// }
			}

			// function performAction(actionDescriptor, isUndo) {
			//     if (isUndo) {
			//         instance.setData(actionDescriptor.PreviousValue);
			//         reflectDefaultValue(actionDescriptor.PreviousValue);
			//     } else {
			//         instance.setData(actionDescriptor.CurrentValue);
			//         reflectDefaultValue(actionDescriptor.CurrentValue);
			//     }
			// }

			/// used to add/remove the "configuration.contentBlockDefaultValue" class according to the current value
			// function reflectDefaultValue(editorValue) {
			//     // use startWith because sometimes CKEditor picks up the overlay div
			//     if (editorValue.length > configuration.defaultValueText.length) {
			//         editorValue = editorValue.substring(0, configuration.defaultValueText.length);
			//     }

			//     if (editorValue == configuration.defaultValueText) {
			//         element.addClass(configuration.contentBlockDefaultValue);
			//         return true;
			//     }
			//     else {
			//         element.removeClass(configuration.contentBlockDefaultValue);
			//         return false;
			//     }
			// }

			/**
			 * Make useless any link on the editor.
			 */
			function disableLinks(){
			    // needs to be done regardless user clicks or not on content block
		        element.find('a').each(function () {
		            var $link = $(this),
		                url;

		            // generate data-editor-url
		            url = $link.attr('href');

		            if (!url && url !== '') {
		            	$link.data('editorUrl', url);
		            }

		            $link.attr('href','');
		        });
			}

			// function getContent() {

			//     var contentChanged;

			//     // Sometimes CKEditor blur event does not get executed so we run this here
			//     if (instance) {
			//         contentChanged = !reflectDefaultValue(instance.getData());
			//     }

			//     var stripAttributesForSaving = function ($obj) {

			//         var hasContentBlockDefaultValue = $obj.hasClass(configuration.contentBlockDefaultValue);

			//         $obj.removeAttr('spellcheck')
			//             .removeAttr('class')
			//             .removeAttr('role')
			//             .removeAttr('aria-label')
			//             .removeAttr('title')
			//             .removeAttr('aria-describedby')
			//             .removeAttr('tabindex')
			//             .removeAttr('contenteditable');

			//         // if has default value, preserve the class name so the block can be stripped before
			//         // saving in Enterprise
			//         if (hasContentBlockDefaultValue) {
			//             $obj.addClass(configuration.contentBlockDefaultValue);
			//         }

			//         // Remove width from css so that SM preview shows text wrapping around image
			//         // Remove position relative to make img more accesible
			//         $obj.css({ 'width' :'', 'position':'static'});

			//         // contentChanged is not necessarily the opposite of hasContentBlockDefaultValue
			//         // in this situation. contentChanged can only be set if CKEditor was instantiated
			//         if (contentChanged) {
			//             $obj.empty().append(instance.getData());
			//         }
			//     };

			//     var $wrapper = element.clone();

			//     if ($wrapper.attr('contenteditable')) { // Text-Image Combo
			//         stripAttributesForSaving($wrapper);
			//     }
			//     else {
			//         $wrapper.find('[contenteditable]').each(function () {
			//             stripAttributesForSaving($(this));
			//         });
			//     }

			//     $wrapper.find('p').each(function () {
			//         $(this).css('margin', '0');

			//         // if there was no text there is probably we use it only for create a new line (add a br)
			//         if (!$.trim($(this).text()).length && $(this).html().indexOf('<br') == -1) {
			//             $(this).append('<br/>');
			//         }
			//     });

			//     $wrapper.find('a').each(function () {
			//         var $that = $(this);
			//         if ($that.attr('href') !== 'javascript:;') {
			//             return;
			//         }
			//         var url;
			//         if ($that.attr('data-cke-saved-href') && $that.attr('data-cke-saved-href') !== 'javascript:;') {
			//             url = $that.attr('data-cke-saved-href');
			//         }

			//         if ($that.attr('data-editor-url') && $that.attr('data-editor-url') !== 'javascript:;') {
			//             url = $that.attr('data-editor-url');
			//         }

			//         $that.attr({ 'href': url, 'data-cke-saved-href': url, 'data-editor-url': url });
			//     });

			//     $wrapper.find('.ui-widget-overlay').remove();

			//     return $wrapper;
			// }

		    init();
		}

	}
};

module.exports = editorText;
