'use strict';


// Declare app level module which depends on filters, and services
var app = angular.module('myApp', ['yaMap']).
	controller('MapCtrl', ['$scope',function($scope){
		var selectIndex = 3;
		$scope.geoObjects=[
			{
				// Геометрия = тип объекта + географические координаты объекта
				geometry: {
					// Тип геометрии - точка
					type: 'Point',
					// Координаты точки.
					coordinates: [55.8, 37.8]
				},
				// Свойства
				properties: {
					// Контент метки.
					iconContent: 'Метка 2'
				},
				displayOptions:{
					preset: 'twirl#blueStretchyIcon'
				}
			},
			{
				// Геометрия = тип объекта + географические координаты объекта
				geometry: {
					// Тип геометрии - линия
					type: "LineString",
					// Координаты точки
					coordinates: [
						[55.80, 37.30],
						[55.70, 37.90],
						[55.70, 37.40]
					]
				},
				// Свойства геообъекта
				properties: {
					// Контент хинта
					hintContent: "Я геообъект",
					// Контент балуна
					balloonContent: "балуна контент"
				}
			},
			{
				// Задаем модель геообъекта.
				// Модель = геометрия + свойства гообъекта.
				// Геометрия = тип геометрии + координаты геообъекта.
				geometry: {
					// Тип геометрии - прямоугольник
					type: 'Rectangle',
					// Координаты
					coordinates: [
						[55.665, 37.66],
						[55.64, 37.53]
					]
				},
				// Свойства
				properties: {
					hintContent: 'Перетащи меня!',
					balloonContent: 'balloon content'
				}
			},
			{
				// Геометрия.
				geometry: {
					// Тип геометрии - полигон.
					type: "Polygon",
					// Координаты точек.
					coordinates: [
						// Координаты вершин внешнего контура
						[
							[55.75, 37.80],
							[55.80, 37.90],
							[55.75, 38.00],
							[55.70, 38.00],
							[55.70, 37.80]
						],
						// Координаты вершин внутренней границы многоугольника.
						[
							[55.75, 37.82],
							[55.75, 37.98],
							[55.65, 37.90]
						]
					]
				},
				properties:{
					//Свойства
					hintContent: "Многоугольник"
				}
			},
			{
				// Геометрия.
				geometry: {
					// Тип геометрии - круг.
					type: "Circle",
					// Координаты центра.
					coordinates: [55.76, 37.60],
					radius:10000
				},
				properties:{
					//Свойства
					hintContent: "Круг"
				}
			}
		];
		$scope.mapProperties = {
			params:{
				center:[55.76, 37.64]
			}
		};
		$scope.select = $scope.geoObjects[selectIndex];
		$scope.deleteObj = function(){
			if($scope.geoObjects.length){
				$scope.geoObjects.pop();
			}
		};
		$scope.addObj = function(){
			$scope.geoObjects.push({
				// Геометрия.
				geometry: {
					// Тип геометрии - круг.
					type: "Circle",
					// Координаты центра.
					coordinates: [55.8, 37.8],
					radius:10000
				},
				properties:{
					//Свойства
					hintContent: "Круг"
				}
			});
		};
		$scope.changeObj = function(){
			for(var i= 0,ii=$scope.geoObjects.length;i<ii;i++){
				if($scope.geoObjects[i].geometry.type === 'Circle'){
					$scope.geoObjects[i].geometry.radius /= 2;
					return;
				}
			}
		};
		$scope.changeSelect = function(){
			if($scope.geoObjects.length === ++selectIndex){
				selectIndex=0;
			}
			$scope.select = $scope.geoObjects[selectIndex];
		};
	}]).
	config(['YandexMapOptionsProvider', function(yaMapOptions){
		yaMapOptions.options({
			params:{
				type: 'yandex#map'
			}
		});
	}])/*.
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/view1', {templateUrl: 'partials/partial1.html', controller: MyCtrl1});
    $routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: MyCtrl2});
    $routeProvider.otherwise({redirectTo: '/view1'});
  }])*/;
