function editorContentBlockDirective(angular, app) {
	'use strict';

	'use angular template'; //jshint ignore:line


	var editorsLoaded = [];
	app.directive('editorContentBlock', editorContentBlockDirective);
	editorContentBlockDirective.$inject = ['$log', '_','$compile','constants','values'];

	/**
	* @name app.directive: editorContentBlock
	*
	* @description
	*  block of content with editor associated
	*
	* @example
	<table class="editor-content-block">
	</table>
	 */
	function editorContentBlockDirective($log, _,compile, constants,values){

		return {
			restrict:'C',
			link: link,
			scope: {
				undoRedoPromise: '='
			}
		};


		function link(scope, element, attributes, ctrl){

			function init(){

				element = $(element);
				element.attr('data-id', scope.$id);

				/*scope.performUndoRedo.promise.then(null, function(change){
					if(change.actionType === 'remove'){
					 	console.log('removed!', change);
					}
				}, null);*/

				setupContentBlockElements();
			}

			/**
			 * @name setupContentBlockElements
			 * @description Adds extra html needed for the content block:
			 *              drop-here placeholders
			 *              hover menu
			 *              overlay
			 * @return {void}
			 */
			function setupContentBlockElements() {

				// insert "drop-here" legend after each element
				var dropHere = compile($('#viewTemplates .drop-here').clone())(scope);
				dropHere.insertAfter(element);
				dropHere.attr('data-content-block', scope.$id);
				dropHere.droppable(values.droppableOptions);

				var hoverMenuBar = compile($('#viewTemplates .' + constants.overlayMenuBarClass).clone())(scope);
				element.append(hoverMenuBar);

				hoverMenuBar.find('.duplicate').on('click', function duplicateContentBlock(){
					var duplicate = getCleanHtml(element.clone());
					duplicate.insertAfter(element);

					notifyChange('duplicate', 1, duplicate.data('id'), '', $.fn.outerHTML(duplicate));

					compile(duplicate)(scope);
				});

				hoverMenuBar.find('.delete').on('click', function deleteContentBlock(){
					element.remove();

					notifyChange('remove', 1, element.data('id'), $.fn.outerHTML(element), '');
				});

				var overlay = $('#viewTemplates .' + constants.overlayClass).clone();
				element.append(overlay);

				element.on('mouseover', function onContentBlockMouseOver() {
					hoverMenuBar.position({ my: 'center bottom', at: 'center top', of: element });

					overlay.height(element.height()).width(element.width());
					overlay.position({ my: 'center center', at: 'center center', of: element, collision: 'none', within: element });
				});

				loadEditors();
			}

			/**
			 * @name notifyChange
			 * @description Notifies changes to the actions service for undo/redo
			 */
			function notifyChange(type, target, cbId, previous, current) {
				var change = {
					actionType: type,
					target: target,
					contentBlockId: cbId,
					previousValue: previous,
					currentValue: current
				};

				scope.undoRedoPromise.notify(change);
			}

			/**
			 * @name getCleanHtml
			 * @description Removes content block extra elements from cloned content block
			 * @return {[type]} [description]
			 */
			function getCleanHtml(contentBlockHtml) {
				contentBlockHtml
					.removeClass('ng-isolate-scope ng-scope')
					.find('.' + constants.overlayClass + ', .' + constants.overlayMenuBarClass)
					.remove();
				return contentBlockHtml;
			}

			/**
			 * Load directives for the different kind of editors associated with the content block
			 * @return {[type]} [description]
			 */
			function loadEditors(){

				// regex to parse from camelCase to dash camel-case
				var rmultiDash = /([a-z])([A-Z])/g,
					// get the different editable areas
					editableAreas = element.find('[data-editable]');

				// foreach editable area, loads its editors
				for (var i = 0; i < editableAreas.length; i++) {
					var editableArea = $(editableAreas[i]);

					for(var keys in editableArea.data()){

						// check for data-editor attributes on editable area
						if(keys.indexOf('editor') === 0 && !editorsLoaded[keys]){

							editorsLoaded[keys] = keys;

							//converts editorText to editor-text
							var parsedName = keys.replace(rmultiDash, "$1-$2" ).toLowerCase();

							// /components/editor-text/editor-text.bundle.js
							loadJS('/components/' + parsedName + '/' + parsedName + '.bundle.js',
								_.bind(onEditorLoaded, null, keys, editableArea));
						}
					}
				}
			}

			/**
			 * Once the editor file is loaded, it bootstrap the directive and editable area
			 * @param  {String} factoryName name of the directive factory
			 * @param {jQueryObject} editableArea - DOM Element of the editable area
			 *      IT NEEDS TO BE COMPILED once the directive is load
			 *
			 * @return {void}
			 */
			function onEditorLoaded(factoryName, editableArea){
				var editor = window[factoryName](angular, app, function compileEditableArea(){
					compile(editableArea)(scope);
				});
			}

			init();
		}

	}
}

module.exports = editorContentBlockDirective;
