// Define a new module for our app
var app = angular.module("AlbumSearch", ['ui.bootstrap', 'ngAnimate']);

app.directive('imgPreload', ['$rootScope', function($rootScope) {
    return {
      restrict: 'A',
      scope: {
        ngAttrSrc: '@'
      },
      link: function(scope, element, attrs) {
        element.on('load', function() {
          element.addClass('in');
        }).on('error', function() {
          //
        });

        scope.$watch('ngSrc', function(newVal) {
          element.removeClass('in');
        });
		
		scope.$watch('ngAttrSrc', function(newVal) {
          element.removeClass('in');
        });
      }
    };
}]);

app.controller('AlbumSearchController', AlbumSearchController);

function AlbumSearchController($scope, $http, $anchorScroll){
	
	var local_search_param = "";
	$scope.isNavCollapsed = true;
	
	$scope.search_album = function(){
		jQuery(".navbar-collapse.in").collapse('hide');
		if($scope.search_param != null)
			local_search_param = $scope.search_param;
		$scope.setPage(1);
		$scope.start_search(0);
		$scope.info_hide = true;
	};
	
	$scope.pagination_hide = true;
	$scope.info_hide = false;
	
	$scope.start_search = function(offset){
		$scope.search_offset = offset;
		console.log($scope.search_param);
		var url = "https://api.spotify.com/v1/search";
		$http({
				method : "GET",
				url : url,
				params: {
					q : local_search_param,
					type: "album",
					offset: $scope.search_offset
				}
			}).then(function mySucces(response) {
				$scope.album_result = response.data;
				console.log(response.data);
				$scope.totalItems = $scope.album_result.albums.total;
				$scope.pagination_hide = false;
			}, function myError(response) {
				$scope.query_error = response.statusText;
			});
		$anchorScroll();
	};
	
	$scope.totalItems = 60;
	$scope.currentPage = 1;

	$scope.setPage = function (pageNo) {
		$scope.currentPage = pageNo;
	};

	$scope.pageChanged = function() {
		console.log('Page changed to: ' + $scope.currentPage);
		$scope.start_search(($scope.currentPage - 1)*20);
	};
	
	$scope.maxSize = 20;
	$scope.itemsPerPage = 20;
	
	$scope.showImage = function(item){
		console.log(item.currentTarget.getAttribute("data-img-full-res"));
		$scope.img_src = item.currentTarget.getAttribute("data-img-full-res");
		$scope.artist_name = item.currentTarget.getAttribute("data-artist-name");
		$scope.album_name = item.currentTarget.getAttribute("data-album-name");
		jQuery('#imageModal').modal("show");
	}
	
	$scope.maxSize = 3;
};