function messageServiceWrapper(angular, app) {
	'use strict';


	app.factory('messageService', messageService);

	messageService.$inject = ['constants','values', '$q', '$http'];

	function messageService(constants, values, $q, $http){

		function get(id, type){

			id = id || constants.defaultMessage.id;
			type = type || constants.defaultMessage.type;

			var endpoint;

			if(type === constants.templateTypes.message){
				endpoint = constants.endpoints.getMessage.replace('{id}', id);
			}
			else{
				endpoint = constants.endpoints.getLayout.replace('{id}', id);				
			}

			return $http.get(endpoint).then(function onOk(response){
				response = {
					html: response.data,
					id: id,
					type: type
				};

				return response;
			});
		}

		return {
			get:get
		};
	}
}

module.exports = messageServiceWrapper;