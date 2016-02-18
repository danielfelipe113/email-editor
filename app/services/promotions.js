function contentPromotionsServiceWrapper(angular, app) {
	'use strict';

	app.factory('contentPromotionsService', contentPromotionsService);

	contentPromotionsService.$inject = ['constants','values', '$q', '$http'];

	function contentPromotionsService(constants, values, $q, $http){
		function getAll(){
			return $http.get(constants.endpoints.getPromotions).then(function onOk(response){
				return response.data;
			});
		}

		return {
			getAll:getAll
		};
	}
}

module.exports = contentPromotionsServiceWrapper;
