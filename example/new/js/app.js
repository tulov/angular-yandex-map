/**
 * Created by владелец on 05.11.13.
 */
/*var app = angular.module('myApp', ['yaMap']).
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
        };

        $scope.test = function(event, obj){
            console.log(arguments);
        }
    }]);*/
angular.module('myApp', ['yaMap'], function($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
            templateUrl: 'partials/map-add.html',
            controller: MapAddCtrl
        })
        .when('/map/change', {
            templateUrl: 'partials/map-change.html',
            controller: MapChangeCtrl
        })
        .when('/map/fullscreen',{
            templateUrl:'partials/full-screen.html',
            controller:MapFullScreenCtrl
        })
        .when('/map/hidden',{
            templateUrl:'partials/hidden.html',
            controller:EmptyCtrl
        })
        .when('/map/controls',{
            templateUrl:'partials/controls.html',
            controller:EmptyCtrl
        })
        .when('/map/hint-and-balloon',{
            templateUrl:'partials/hint-and-balloon.html',
            controller:HintAndBalloonCtrl
        })
        .when('/map/dynamic-balloon',{
            templateUrl:'partials/dynamic-balloon.html',
            controller:DynamicBalloonCtrl
        })
        .when('/map/own-map',{
            templateUrl:'partials/own-map.html',
            controller:OwnMapCtrl
        })
    ;

    // configure html5 to get links working on jsfiddle
    $locationProvider.html5Mode(true);
});

function MainCtrl($scope, $route, $routeParams, $location) {
    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;
}

function MapAddCtrl($scope) {
    $scope.del = function(){
        angular.element(document.getElementById('map')).data('map').destroy();
    };
}

function MapChangeCtrl($scope) {
    $scope.center=[37.64,55.76];
    $scope.type='yandex#satellite';
    $scope.changeCenter = function(){
        $scope.center = [40.925358,57.767265];
    };
    $scope.changeBounds=function(){
        angular.element(document.getElementById('map'))
            .data('map')
            .setBounds([[38, 37], [40, 39]]);
    };
    $scope.replace=function(){
        $scope.type='yandex#publicMapHybrid';
        angular.element(document.getElementById('map'))
            .data('map')
            .panTo([34.461,62.915], {
                // Задержка перед началом перемещения.
                delay: 1500
            });
    };
}

function MapFullScreenCtrl($scope, $timeout, $window){
    var timeout;
    var resize = function(){
        if(timeout){
            $timeout.cancel(timeout);
        }
        timeout = $timeout(function(){
            var map = angular.element(document.getElementById('map')).data('map');
            map.container.fitToViewport();
        },500);
    };
    $scope.$watch('sizeChecked',function(newValue,oldValue){
        if(newValue){
            angular.element($window).bind('resize', resize);
        }else if(oldValue){
            angular.element($window).unbind('resize',resize);
        }
    });
}

function EmptyCtrl($scope){}

function HintAndBalloonCtrl($scope, $timeout){
    $scope.geoObjects=[
        {
            // Геометрия = тип объекта + географические координаты объекта
            geometry: {
                // Тип геометрии - точка
                type: 'Point',
                // Координаты точки.
                coordinates: [31.260503,55.907228]
            },
            // Свойства
            properties: {
                balloonContentHeader: "Балун метки",
                balloonContentBody: "Содержимое <em>балуна</em> метки",
                balloonContentFooter: "Подвал",
                hintContent: "Хинт метки"
            }
        }
    ];
    $scope.$on('mapinit',function(event, args){
        var map = args.map;
        $timeout(function(){
            map.hint.show(map.getCenter(), "Содержимое хинта", {
                // Опция: задержка перед открытием.
                showTimeout: 1500
            });
        });
        map.balloon.open([38.37,51.85], "Содержимое балуна", {
            // Опция: не показываем кнопку закрытия.
            closeButton: false
        });
    });
}

function DynamicBalloonCtrl($scope, $timeout){
    $scope.geoObjects=[
        {
            // Геометрия = тип объекта + географические координаты объекта
            geometry: {
                // Тип геометрии - точка
                type: 'Point',
                // Координаты точки.
                coordinates: [37.72,55.8]
            },
            // Свойства
            properties: {
                iconContent: "Узнать адрес",
                hintContent: "Перетащите метку и кликните, чтобы узнать адрес"
            }
        }
    ];
    $scope.balloonOpen = function($event){
        var obj = $event.get('target');
        obj.properties.set('balloonContent', "Идет загрузка данных...");

        // Имитация задержки при загрузке данных (для демонстрации примера).
        $timeout(function () {
            ymaps.geocode(obj.geometry.getCoordinates(), {
                results: 1
            }).then(function (res) {
                    var newContent = res.geoObjects.get(0) ?
                        res.geoObjects.get(0).properties.get('name') :
                        'Не удалось определить адрес.';

                    // Задаем новое содержимое балуна в соответствующее свойство метки.
                    obj.properties.set('balloonContent', newContent);
                });
        }, 1500);
    };
}

function OwnMapCtrl($scope){
    $scope.mapInit = function() {
        // Создадим собственный слой карты:
        var MyLayer = function () {
            return new ymaps.Layer(
                // Зададим функцию, преобразующую номер тайла
                // и уровень масштабировая в URL тайла на сервере.
                function (tile, zoom) {
                    return "http://mt.gmapuploader.com/tiles/FVSH1JsvdT/tile-" + zoom + "-" +
                        (tile[1] * Math.pow(2, zoom) + tile[0]) + ".jpg";
                }
            );
        };

        // Добавим конструктор слоя в хранилище слоёв под ключом my#layer.
        ymaps.layer.storage.add('my#layer', MyLayer);
        // Создадим новый тип карты, состоящий только из нашего слоя тайлов,
        // и добавим его в хранилище типов карты под ключом my#type.
        ymaps.mapType.storage.add('my#type', new ymaps.MapType(
            'Схема',
            ['my#layer']
        ));
    };
}