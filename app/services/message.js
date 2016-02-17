function messageServiceWrapper(angular, app) {
	'use strict';


	app.factory('messageService', messageService);

	messageService.$inject = ['constants','values', '$q', '$http'];

	function messageService(constants, values, $q, $http){

		function get(id, type){

			var endpoint;

			if(type === 'message'){
				endpoint = constants.endpoints.getMessage.replace('{id}', id);
			}
			else{
				endpoint = constants.endpoints.getLayout.replace('{id}', id);				
			}

			console.log(endpoint);

			return $http.get(endpoint).then(function onOk(response){
				return response.data;
			});
		}

		return {
			get:get
		};
	}
}

module.exports = messageServiceWrapper;