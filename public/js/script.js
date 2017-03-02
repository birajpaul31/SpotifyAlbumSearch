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

app.controller('AlbumSearchController', ['$scope','$http','$anchorScroll','orderByFilter', AlbumSearchController]);

function AlbumSearchController($scope, $http, $anchorScroll, orderBy){
	
	var local_search_param = "";
	$scope.isNavCollapsed = true;
	$scope.sortBy = "None";
	$scope.resultsPerPage = "20";
	$scope.pagination_hide = true;
	$scope.info_hide = false;
	$scope.error_hide = true;
	
	$scope.sortByChanged = function(){
		console.log($scope.sortBy);
		
		switch($scope.sortBy){
			case "None": 
				$scope.album_result = $scope.response_data.albums.items;
				break;
			case "Album": 
				$scope.album_result = orderBy($scope.response_data.albums.items, 'name');
				break;
			case "Artist": 
				$scope.album_result = orderBy($scope.response_data.albums.items, 'artists[0].name');
				break;
		}
		
	}
	
	$scope.search_album = function(){
		jQuery(".navbar-collapse.in").collapse('hide');
		if($scope.search_param != null)
			local_search_param = $scope.search_param;
		$scope.setPage(1);
		$scope.start_search(0);
		$scope.info_hide = true;
		$scope.error_hide = true;
		$scope.itemsPerPage = parseInt($scope.resultsPerPage);
		jQuery('.search_badge').find('p').text(local_search_param);
	};
	
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
					offset: $scope.search_offset,
					limit: $scope.resultsPerPage
				}
			}).then(function mySuccess(response) {				
				$scope.response_data = response.data;
				$scope.sortByChanged();
				console.log(response.data);
				$scope.totalItems = $scope.response_data.albums.total;
				$scope.pagination_hide = false;
				
				if(response.data.albums.total === 0) {
					$scope.error_hide = false;
					$scope.pagination_hide = true;
				}
				
			}, function myError(response) {
				$scope.query_error = response.statusText;
				$scope.error_hide = false;
			});
		$anchorScroll();
	};
	
	$scope.totalItems = 60;
	$scope.currentPage = 1;
	$scope.itemsPerPage = parseInt($scope.resultsPerPage);

	$scope.setPage = function (pageNo) {
		$scope.currentPage = pageNo;
	};

	$scope.pageChanged = function() {
		console.log('Page changed to: ' + $scope.currentPage);
		$scope.start_search(($scope.currentPage - 1)*($scope.itemsPerPage));
		console.log("Items per page " + $scope.itemsPerPage);
	};
	
	$scope.showImage = function(item){
		console.log(item.currentTarget.getAttribute("data-img-full-res"));
		$scope.img_src = item.currentTarget.getAttribute("data-img-full-res");
		$scope.artist_name = item.currentTarget.getAttribute("data-artist-name");
		$scope.album_name = item.currentTarget.getAttribute("data-album-name");
		jQuery('#imageModal').modal("show");
	}
	
	$scope.maxSize = 3;
	
	$scope.nav_search_toggle = function(){
		$scope.toggleNavSearch = !$scope.toggleNavSearch;
		if($scope.toggleNavSearch === false){
			jQuery('.navbar-form-container').addClass('navbar-form-container-toggle');
			jQuery('.navbar-form-container').find('input[type="text"]').focus();
		}
		else
			jQuery('.navbar-form-container').removeClass('navbar-form-container-toggle');
	}
};