/**
 * Created by владелец on 05.11.13.
 */
var app = angular.module('myApp', ['yaMap']).
    controller('MapCtrl', ['$scope',function($scope){
        $scope.center = [37.8,55.85];
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
        $scope.change = function(){
            $scope.geoObjects[0].geometry.coordinates=[38.3,56.35];
            $scope.geoObjects[0].properties.iconContent='пометка';
        };
        $scope.del = function(){
            $scope.geoObjects.length -= 1;
        };
        $scope.add = function(){
            $scope.geoObjects.push({
                // Геометрия = тип объекта + географические координаты объекта
                geometry: {
                    // Тип геометрии - точка
                    type: 'Point',
                    // Координаты точки.
                    coordinates: [37.3,55.35]
                },
                // Свойства
                properties: {
                    // Контент метки.
                    iconContent: 'add'
                }
            });
        };
        var i= 0,
            //так как внутри используется $eval, строки нужно брать в двойные кавычки
            centers = [[37.8,55.85],'Казахстан, город астана',undefined];
        $scope.changeCenter = function(){
            $scope.center = centers[++i%3];
        }
    }]);