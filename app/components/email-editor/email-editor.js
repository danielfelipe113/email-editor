function emailEditorDirective(angular, app) {
	'use strict';

	'use angular template'; //jshint ignore:line

	//services
	require('./../../services/content-block.js')(angular, app);
	require('./../../services/message.js')(angular, app);
	require('./../../services/editor-actions.js')(angular, app);
	require('./../../services/layout.js')(angular, app);
	require('./../modal/modal.service.js')(angular, app);

	// directives
	require('./../draggable-content-block/draggable-content-block.js')(angular, app);
	require('./../editor-content-block/editor-content-block.js')(angular, app);
	require('./../editor-canvas/editor-canvas.js')(angular, app);
	require('./../modal/modal.js')(angular, app);

	app.directive('fbEmailEditor', emailEditorDirective);

	emailEditorDirective.$inject = ['$log', '_', '$compile', '$q', 'email-editor.template.html', 'constants', 
		'fbModalService', 'contentBlockService', 'messageService', 'editorActionsService', 'layoutService'];

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
	function emailEditorDirective($log, _, compile, $q, template, constants, modalService, cbService, messageService, actionsService, layoutService){

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
				redoEnabled = false,
				currentMessageId,
				currentTemplateType;

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
					changeLayout: changeLayout,
					layoutsVisible:false,
					contentBlocksVisible:true,
					designsVisible:false,
					changeLayoutConfig:{
						showHeader: true,
						showFooter: false,
						callbacks: {
							onInit: undefined,
							onShow: undefined,
							onShown: undefined,
							onHide: undefined,
							onHidden: undefined,
							onCancel: undefined,
							onAccept: undefined
						},
						labels: {
							title: 'Warning - Changing Layout',
							cancel: 'Cancel',
							accept: 'Accept'
						},
		        		cssClass: ''
					},
					currentLayout:0
				});

				self.undoRedoPromise = $q.defer();
				self.performUndoRedo = $q.defer();

				self.undoRedoPromise.promise.then(null, null, function(change){
					actionsService.saveChanges(change);
				});

				cbService.getAll().then(function onAllCb(response){
					self.contentBlocks = response;
				});

				getLayouts();

			}

			/**
			 * Gets Message Html
			 * @param  {Number} id          message or layout id
			 * @param  {String} messageType - message to edit or layout
			 * @return {Object}             Get Message promise that contains the html to render
			 */
			function getMessage(id, messageType){
				return messageService.get(id, messageType).then(function onMessageOk(response){

					// logic to know which one is the current message we are composing
					// and to make easier layout transition
					currentTemplateType = response.type;
					currentMessageId = response.id;

					if(response.type === constants.templateTypes.layout){
						self.currentLayout = response.id;
					}
					else{
						self.currentLayout = 0;
					}

					return response.html;
				});
			}

			function undo() {
				var collection = actionsService.saveUndo();
				self.performUndoRedo.notify(collection);
			}

			function redo() {
				var collection = actionsService.saveRedo();
				self.performUndoRedo.notify(collection);
			}

			/**
			 * Shows the available predefined content blocks
			 * @return {[type]} [description]
			 */
			function showContentBlocks(){
				self.contentBlocksVisible = true;
				self.layoutsVisible = false;
				self.designsVisible = false;
			}

			/**
			 * Shows the available predefined layouts
			 * @return {[type]} [description]
			 */
			function showLayouts(){
				self.contentBlocksVisible = false;
				self.layoutsVisible = true;
				self.designsVisible = false;
			}

			/**
			 * Shows the available email designs
			 * @return {[type]} [description]
			 */
			function showDesigns(){
				self.contentBlocksVisible = false;
				self.layoutsVisible = false;
				self.designsVisible = true;
			}

			/**
			 * It changes the email layout
			 * @return {[type]} [description]
			 */
			function changeLayout(layoutId){
				console.log(layoutId);

				// check if we are not selecting exactly the same layout id
				if(!(constants.templateTypes.layout === currentTemplateType && layoutId === currentMessageId)){

					modalService.openModal('changeLayoutModal');

					// change the layout
					return;
				}

				modalService.openModal('changeLayoutModal');
			}

			/**
			 * Gets the list of available layouts
			 * @return {Array} List of available layouts
			 */
			function getLayouts(){
				layoutService.getAll().then(function onAllLayouts(response){
					self.layouts = response;
				});
			}
		}

	}
}

module.exports = emailEditorDirective;
