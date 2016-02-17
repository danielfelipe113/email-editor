function layoutServiceWrapper(angular, app) {
	'use strict';


	app.factory('layoutService', layoutService);

	layoutService.$inject = ['constants','values', '$q', '$http'];

	function layoutService(constants, values, $q, $http){
		function getAll(){
			return $http.get(constants.endpoints.getLayouts).then(function onOk(response){
				return response.data;
			});
		}

		return {
			getAll:getAll
		};
	}
}

module.exports = layoutServiceWrapper;