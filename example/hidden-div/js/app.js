'use strict';

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
                    coordinates: [37.8,55.85]
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
                    coordinates: [37.8,55.75]
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
                    coordinates: [37.85,55.8]
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
                    coordinates: [37.75,55.8]
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
                    coordinates: [37.8,55.8]
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
                        [37.30,55.80],
                        [37.90,55.70],
                        [37.40,55.70]
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
                        [ 37.66,55.665],
                        [37.53,55.64]
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
                            [37.80,55.75],
                            [37.90,55.80],
                            [38.00,55.75],
                            [ 38.00,55.70],
                            [37.80,55.70]
                        ],
                        // Координаты вершин внутренней границы многоугольника.
                        [
                            [37.82,55.75],
                            [37.98,55.75],
                            [37.90,55.65]
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
                    coordinates: [37.60,55.76],
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
				center:[37.64,55.76]
			}
		};
        $scope.class = 'hide';
        $scope.changeClass = function(){
            $scope.class = $scope.class === 'hide' ? 'show' : 'hide';
        }
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
                //параметры отображения рисуемых объектов
                drawing:{
                    strokeWidth: 1,
                    strokeColor: "#000000",
                    fillColor: '#00ffff10',
                    strokeStyle: 'shortdash'
                }
			},
            //путь к папке с иконками отображаемыми на кнопках удалить или добавить новую фигуру
            customButtons:{
                //кнопка удаления фигуры
                delete:{
                    image:'img/delete.png',
                    imageDisabled:'img/delete_gray.png',
                    help:'Нажмите для удаления выделенной фигуры'
                },
                //кнопка добавления метки
                point:{
                    image: 'img/point.png',
                    title: 'Добавить метку'
                },
                //кнопка добавления прямоугольника
                rectangle:{
                    image: 'img/rectangle.png',
                    title: 'Добавить прямоугольник'
                },
                //кнопка добавления ломанной линии
                linestring:{
                    image: 'img/linestring.png',
                    title: 'Добавить ломанную'
                },
                //кнопка добавления полигона
                polygon:{
                    image: 'img/polygon.png',
                    title: 'Добавить многоугольник'
                },
                //кнопка добавления круга
                circle:{
                    image: 'img/circle.png',
                    title: 'Добавить круг'
                }
            }
		});

	}]);
