function constants(angular, app, options, _){
	'use strict';

	var defaultOptions = {
		sessionKey: null,
		hasSocialMediaEnabled: false,
		maxFileSize: 5 * 1048576,  // 5 MB
		editorDefinitions: {
            TextOnlyEditor: 'text',
            ImageEditor: 'image'
        },
        contentBlockEvents: {
            Reordered: 'Content Blocks Reordered',
            Deleted: 'Content Block Deleted',
            Created: 'Content Block Created'
        },
        canvasClass: 'layout-table',
        contentBlockClass: 'editor-content-block',
        contentBlockDefaultValue: 'editor-default-value',
        draggableContentBlockClass: 'draggable-content-block',
        editorHtmlContainerId: 'editorCanvas',
        overlayClass: 'content-block-overlay',
        imageEditorModal: 'imageEditorModal',
        overlayMenuBarClass: 'content-block-menu-bar',
        multiColumnClass: 'multiColumn',
		onEditorContentChangeMessage: 'OnEditorContentChange',
		storageEditorContentKey: 'EditorContent',
        textEditorToolbar: ['bold', 'italic', 'underline','|','formatOL', 'formatUL','|', 'align','|', 'indent', 'outdent','|','fontFamily', 'fontSize','color','|','insertLink'],
        autoSaveFrequency: 180000,
        allowedHtml: null,
        debug: false,
        loaded: false,
        endpoints:{
            'getContentBlocks':'/api/contentblocks',
            'getLayouts':'/api/layouts',
            'getLayout':'/api/layouts/{id}',
            'getMessage':'/api/messages/{id}'
        }
	};

	_.extend(defaultOptions, options);

	app.constant('constants', defaultOptions);
}

module.exports = constants;
