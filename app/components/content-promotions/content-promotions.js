window.contentPromotions = function contentPromotions(angular, app, onReadyCallback) {
	'use strict';

  'use angular template'; //jshint ignore:line

  //services
  require('./../../services/promotions.js')(angular, app);

  app.directive('contentPromotions', contentPromotions);

  if(typeof onReadyCallback === 'function'){
    setTimeout(onReadyCallback, 0);
  }

  contentPromotions.$inject = ['$log', '_', '$compile', 'content-promotions.template.html', 'constants', 'contentPromotionsService'];

  function contentPromotions($log, _, compile, template, constants, promotionsService){

		return {
      restrict:'A',
			link: link,
      template: template
		};

		function link(scope, element, attributes, ctrl){
			element = $(element);

      scope.promotions = [];

			function init(){
        promotionsService.getAll().then(function onAllPromos(response){
					scope.promotions = response;
					console.log(response);
				});
			}

	    init();
		}

    /*contentPromotionsCtrl.$inject = ['$scope', 'contentPromotionsService'];
		function contentPromotionsCtrl($scope, promotionsService){
      var self = this; //jshint ignore:line

      function init(){
				promotionsService.getAll().then(function onAllPromos(response){
					self.promotions = response;
				});
			}

    }*/
	}
};

module.exports = contentPromotions;
