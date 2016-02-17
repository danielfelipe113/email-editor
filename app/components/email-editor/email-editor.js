function emailEditorDirective(angular, app) {
	'use strict';

	'use angular template'; //jshint ignore:line

	//services
	require('./../../services/content-block.js')(angular, app);
	require('./../../services/message.js')(angular, app);
	require('./../../services/editor-actions.js')(angular, app);

	// directives
	require('./../draggable-content-block/draggable-content-block.js')(angular, app);
	require('./../editor-content-block/editor-content-block.js')(angular, app);
	require('./../editor-canvas/editor-canvas.js')(angular, app);

	app.directive('fbEmailEditor', emailEditorDirective);

	emailEditorDirective.$inject = ['$log', '_', 'email-editor.template.html', 'contentBlockService', 'messageService', 'editorActionsService', '$compile', '$q'];

	/**
	* @name app.directive: fbEmailEditor
	*
	* @description
	*  Drag and drop email editor
	*
	* @example
	<fb-email-editor data-config="home.modalLoginConfig">
	</fb-email-editor>
	 */
	function emailEditorDirective($log, _, template, cbService, messageService, actionsService, compile, $q){

		return {
			restrict:'E',
			link: link,
			template: template,
			controllerAs: 'editorCtrl',
			bindToController: true,
			controller: emailEditorController
		};


		function link(scope, element, attributes, ctrl){
		}

		emailEditorController.$inject = ['$scope'];
		function emailEditorController($scope){

			var self = this, //jshint ignore:line
				autosaveInitialized = false,
				undoEnabled = false,
				redoEnabled = false;

			init();

			/**
			 * @name init
			 * @description Initializes the controller
			 * 1) extends the scope
			 * 2) gets needed data for editor to work
			 * 3) setup $watcher in case if needed
			 * 4) set up the $on('$destroy') method
			 */
			function init(){
				_.extend(self, {
					getMessage:getMessage,
					undo: undo,
					redo: redo,
					showLayouts: showLayouts,
					showContentBlocks: showContentBlocks,
					showDesigns: showDesigns,
					layoutsVisible:false,
					contentBlocksVisible:true,
					designsVisible:false
				});

				self.undoRedoPromise = $q.defer();
				self.performUndoRedo = $q.defer();

				self.undoRedoPromise.promise.then(null, null, function(change){
					actionsService.saveChanges(change);
				});

				cbService.getAll().then(function onAllCb(response){
					self.contentBlocks = response;
				});
			}

			/**
			 * Gets Message Html
			 * @param  {Number} id          message or layout id
			 * @param  {String} messageType - message to edit or layout
			 * @return {Object}             Get Message promise that contains the html to render
			 */
			function getMessage(id, messageType){
				console.log(arguments);
				return messageService.get(id, messageType);
			}

			function undo() {
				var collection = actionsService.saveUndo();
				self.performUndoRedo.notify(collection);
			}

			function redo() {
				var collection = actionsService.saveRedo();
				self.performUndoRedo.notify(collection);
			}

			function showContentBlocks(){
				self.contentBlocksVisible = true;
				self.layoutsVisible = false;
				self.designsVisible = false;
			}

			function showLayouts(){
				self.contentBlocksVisible = false;
				self.layoutsVisible = true;
				self.designsVisible = false;
			}

			function showDesigns(){
				self.contentBlocksVisible = false;
				self.layoutsVisible = false;
				self.designsVisible = true;	
			}
		}

	}
}

module.exports = emailEditorDirective;
