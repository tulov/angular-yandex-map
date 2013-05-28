'use strict';


// Declare app level module which depends on filters, and services
var app = angular.module('myApp', ['yaMap']).
	controller('MapCtrl', ['$scope',function($scope){
		$scope.selectIndex = 3;
		$scope.geoObjects=[
			{
				// Геометрия = тип объекта + географические координаты объекта
				geometry: {
					// Тип геометрии - точка
					type: 'Point',
					// Координаты точки.
					coordinates: [55.85, 37.8]
				},
				// Свойства
				properties: {
					// Контент метки.
					iconContent: 'Метка 1'
				}
			},
			{
				// Геометрия = тип объекта + географические координаты объекта
				geometry: {
					// Тип геометрии - точка
					type: 'Point',
					// Координаты точки.
					coordinates: [55.75, 37.8]
				},
				// Свойства
				properties: {
					// Контент метки.
					iconContent: 'Метка 2'
				}
			},
			{
				// Геометрия = тип объекта + географические координаты объекта
				geometry: {
					// Тип геометрии - точка
					type: 'Point',
					// Координаты точки.
					coordinates: [55.8, 37.85]
				},
				// Свойства
				properties: {
					// Контент метки.
					iconContent: 'Метка 3'
				}
			},
			{
				// Геометрия = тип объекта + географические координаты объекта
				geometry: {
					// Тип геометрии - точка
					type: 'Point',
					// Координаты точки.
					coordinates: [55.8, 37.75]
				},
				// Свойства
				properties: {
					// Контент метки.
					iconContent: 'Метка 4'
				}
			},
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
					iconContent: 'Метка 5'
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
					balloonContent: "балуна контент",
					draggable:true
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
			if($scope.geoObjects.length === ++$scope.selectIndex){
				$scope.selectIndex=0;
			}
		};
	}]).
	config(['YandexMapProvider', function(yaMapOptions){
		yaMapOptions.options({
			//параметры передаваемые к конструктор карты
			params:{
				//yandex#map (схема) - по умолчанию;
				// yandex#satellite (спутник);
				// yandex#hybrid (гибрид);
				// yandex#publicMap (народная карта);
				// yandex#publicMapHybrid (гибрид народной карты)
				type: 'yandex#map',

				zoom:10, //от 0 до 23 включительно, 23 - самое большой массштаб

				//"default" — короткий 	синоним для включения/отключения поведений карты по умолчанию:
				// для настольных браузеров - "drag", "dblClickZoom", "rightMouseButtonMagnifier",
				// для мобильных - "drag", "dblClickZoom" и "multiTouch"
				//"drag" — перемещание 	карты при нажатой левой кнопке мыши либо одиночным касанием;
				//"scrollZoom" — изменение масштаба колесом мыши
				// "dblClickZoom" — масштабирование кар	ты двойным щелчком кнопки мыши
				// "multiTouch" — масштабирование карты двойным касанием (например, пальцами на сенсорном экране)
				// "rightMouseButtonMagnifier" — увеличение области, выделенной правой кнопкой мыши (только для настоль	ных браузеров)
				// "leftMouseButtonMagnifier" — увеличение области, выделенной левой кнопкой мыши либо одиночным касанием
				// "ruler" — измерение 	расстояния
				// "routeEditor" — редактор маршрутов
				behaviors:["default"] //массив поведений карты
			},
			//элементы управления, которые должны быть расположенны на карте
			controls:{
				//в этом массиве перечисляются имена контроллов для добавления со стандартными параметрами
				default:['zoomControl','typeSelector','mapTools','scaleLine','miniMap'],
				//а так можно добавить контрол со своими параметрами
				smallZoomControl: { right: 5, top: 75 }
			},
			//параметры отображения различных объектов на карте
			displayOptions:{
				//параметры отображения объектов в обычном состоянии
				general:{
					//эти параметры относятся ко всем объектам
					all:{
						//возможность перетаскивания мышью
						draggable: false,
						//ширина границы
						strokeWidth: 3,
						//цвет границы
						strokeColor: "#FFFF00",
						// Цвет и прозрачность заливки
						fillColor: '#ffff0022'
					},
					point:{
						// Иконка метки будет растягиваться под ее контент
						preset: 'twirl#pinkStretchyIcon'
					},
					linestring:{
						// Опции PolyLine
						// Сделать доступным для перетаскивания.
						draggable: true,
						strokeWidth: 5
					},
					// Опции прямоугольника
					rectangle:{
					},
					// Опции многоугольника
					polygon:{
						// Стиль линии
						strokeStyle: 'shortdash'
					},
					circle:	{
					}
				},
				//параметры отображения выбранных объектов
				selected:{
					//ширина границы
					strokeWidth: 7,
					//цвет границы
					strokeColor: "#000000",
					// Цвет и прозрачность заливки
					fillColor: '#00ffff10',
					//стиль границы
					strokeStyle: 'solid',
					//представление для точки на карте
					preset: 'twirl#blackStretchyIcon'
				},
                drawing:{
                    strokeWidth: 1,
                    strokeColor: "#000000",
                    fillColor: '#00ffff10',
                    strokeStyle: 'shortdash'
                }
			}
		});

	}])/*.
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/view1', {templateUrl: 'partials/partial1.html', controller: MyCtrl1});
    $routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: MyCtrl2});
    $routeProvider.otherwise({redirectTo: '/view1'});
  }])*/;
