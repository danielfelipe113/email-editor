How to create a layout

	In this case we will convert a zurb email template (http://foundation.zurb.com/emails/email-templates.html) into a layout 
	
	This is roughtly the html structure that all ZURB templates share

		<html>
			<head>
				<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
				<meta name="viewport" content="width=device-width"/>
				<style>Zurb CSS Framework</style>
				<style>Custom css only for this email</style>
			<body>
				<table class="body">
					
					// structural html to center the content on the page
					....

					<table class="row header">
						// HEADER CONTENT HERE
					</table>
					<table class="container"> 
						<tbody>
							<tr>
								<td>
									<!-- START OF EMAIL BODY-->
									<table .... 
									<!--FINISH OF EMAIL BODY-->
								<td>
							</tr>
						</tbody>
					</table>
				</table>
			</body>
		</html>

	Each content block is a table with class="row editor-content-block", and SHOULD GO between Start/Finish of email body indicators


	1) Get the html (http://foundation.zurb.com/downloads/templates-emails/hero.html)
	2) Given that layouts are rendered on a div, we need to remove html/head/body tags and only use

		a) styles
		b) the content inside <body> tags

		So in the step this is how it looks our template

			<style>Zurb CSS Framework</style>
			<style>Custom css only for this email</style>
			<table class="body">
				
				// structural html to center the content on the page
				....

				<table class="row header">
					// HEADER CONTENT HERE
				</table>
				<table class="container"> 
					<tbody>
						<tr>
							<td>
								<!-- START OF EMAIL BODY-->
								<table .... 
								<!--FINISH OF EMAIL BODY-->
							<td>
						</tr>
					</tbody>
				</table>
			</table>

	3) We will wrap all the html on a div with id "layoutContainer"

			<style>Zurb CSS Framework</style>
			<style>Custom css only for this email</style>
			<div id="layoutContainer">	
				<table class="body">
					
					// structural html to center the content on the page
					....

					<table class="row header">
						// HEADER CONTENT HERE
					</table>
					<table class="container"> 
						<tbody>
							<tr>
								<td>
									<!-- START OF EMAIL BODY-->
									<table .... 
									<!--FINISH OF EMAIL BODY-->
								<td>
							</tr>
						</tbody>
					</table>
				</table>
			</div>

		4) We need to add the 'layout-table' css  class to table class="container" in order to make drag and drop work


			<style>Zurb CSS Framework</style>
			<style>Custom css only for this email</style>
			<div id="layoutContainer">	
				<table class="body">
					
					// structural html to center the content on the page
					....

					<table class="row header">
						// HEADER CONTENT HERE
					</table>
					<table class="container layout-table"> 
						<tbody>
							<tr>
								<td>
									<!-- START OF EMAIL BODY-->
									<table .... 
									<!--FINISH OF EMAIL BODY-->
								<td>
							</tr>
						</tbody>
					</table>
				</table>
			</div>

		5) Styles treatment: To avoid email styles to compromise the flow of the editor, we need to prepend every css selector with #layoutContainer. An easy way to achieve this is using less.

			a) Go to app/styles and create a less file called hero.less
			b) write the following code
					#layoutContainer{
						all the styles
					}
			c) run gulp styles
			d) collect the css on dist/styles/hero.css and place raw css on header


			<style>Procesed css</style>
			<div id="layoutContainer">	
				<table class="body">
					
					// structural html to center the content on the page
					....

					<table class="row header">
						// HEADER CONTENT HERE
					</table>
					<table class="container layout-table"> 
						<tbody>
							<tr>
								<td>
									<!-- START OF EMAIL BODY-->
									<table .... 
									<!--FINISH OF EMAIL BODY-->
								<td>
							</tr>
						</tbody>
					</table>
				</table>
			</div>

		6) So far so good, but the content of the template is not editable yet, we need to convert that on content blocks. If you take a look at the content each one is a table with row class


			<table class="row">
			</table>
			<table class="row">
			</table>
			<table class="row">
			</table>

		The first step is add the css class editor-content-block to each one, to have capabilities of sort and contextual menu (edit/duplicate/delete)

			<table class="row editor-content-block">
			</table>
			<table class="row editor-content-block">
			</table>
			<table class="row editor-content-block">
			</table>

		Now depending on the content of each row, we need to adapt its structure to the content block that most fit.

		Lets take the first row here, that is most like the text content block

			<table class="row">
				<tr>
					<td class="wrapper last">
						<table class="twelve columns">
							<tr>
								<td>
									<h1>Hi, Elijah Baily</h1>
									<p class="lead">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et.</p>
									<img width="580" height="300" src="http://placehold.it/580x300">
								</td>
								<td class="expander"></td>
							</tr>
						</table>
					</td>
				</tr>
			</table>			


		This it the actual text content block


		<table class="row editor-content-block" data-undo-redo-promise="undoRedoPromise">
			<tr>
				<td class="wrapper last">
					<table class="twelve columns">
						<tr data-editable="true" class="editor-default-value" data-editor-text="true" style="padding-top: 10px; padding-bottom: 10px;">

							<td data-contenteditable="true" style="font-family:Arial, Helvetica, sans-serif; font-size:11pt;">
								<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam, magni natus voluptas vero sit nesciunt consequatur eveniet iure tempora ex! Quas iure mollitia aut aspernatur. Voluptas non harum reiciendis vel? Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci, nobis, at, accusamus cumque sit laboriosam non voluptatibus totam iste fugit earum harum nam voluptates officiis et laudantium rem dolorem minus!</p>
							</td>
							<td class="expander"></td>
						</tr>
					</table>
				</td>
			</tr>
		</table>

		Add data-undo-redo-promise="undoRedoPromise" and editor-content-block class

		<table class="row editor-content-block" data-undo-redo-promise="undoRedoPromise">
			<tr>
				<td class="wrapper last">
					<table class="twelve columns">
						<tr>
							<td>
								<h1>Hi, Elijah Baily</h1>
								<p class="lead">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et.</p>
								<img width="580" height="300" src="http://placehold.it/580x300">
							</td>
							<td class="expander"></td>
						</tr>
					</table>
				</td>
			</tr>
		</table>	

		Add actual text-editor capabilities to the content block

		<table class="row editor-content-block" data-undo-redo-promise="undoRedoPromise">
			<tr>
				<td class="wrapper last">
					<table class="twelve columns">
						<tr data-editable="true" class="editor-default-value" data-editor-text="true" style="padding-top: 10px; padding-bottom: 10px;">
							<td>
								<h1>Hi, Elijah Baily</h1>
								<p class="lead">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et.</p>
								<img width="580" height="300" src="http://placehold.it/580x300">
							</td>
							<td class="expander"></td>
						</tr>
					</table>
				</td>
			</tr>
		</table>	

		Add custom attributes of the editor

		<table class="row editor-content-block" data-undo-redo-promise="undoRedoPromise">
			<tr>
				<td class="wrapper last">
					<table class="twelve columns">
						<tr data-editable="true" class="editor-default-value" data-editor-text="true" style="padding-top: 10px; padding-bottom: 10px;">
							<td data-contenteditable="true" style="font-family:Arial, Helvetica, sans-serif; font-size:11pt;">
								<h1>Hi, Elijah Baily</h1>
								<p class="lead">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et.</p>
								<img width="580" height="300" src="http://placehold.it/580x300">
							</td>
							<td class="expander"></td>
						</tr>
					</table>
				</td>
			</tr>
		</table>	


		FROM THIS POINT EVERYTHING DEPENDS ON THE BACKEND CONFIG

		7) Once we did this for the whole html, we need to include the layout on the list of available layouts, to do this lets modify get-layouts.json file on /gulp-tasks/middleware/storage/get-layouts.json

			{
				"id":2,
				"thumbnailUrl":"/images/layoutpreviews/hero.jpg",
				"name":"Hero"
			}
		
		8) Save the html on a new file under /gulp-tasks/middleware/storage/, in our case it will be get-layout-hero.html (no convention, you can put any name)

		9) Modify routing to provide that file. Open gulp-tasks/middleware/middleware.js and add the following on the "routes" object

            '/api/layouts/2':'/gulp-tasks/middleware/storage/get-layout-hero.html'
