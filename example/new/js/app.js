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
        .when('/map/active-area',{
            templateUrl:'partials/active-area.html',
            controller:EmptyCtrl
        })
        .when('/geoobjects/points',{
            templateUrl:'partials/points.html',
            controller:PointsCtrl
        })
        .when('/geoobjects/linestring',{
            templateUrl:'partials/linestring.html',
            controller:LineStringCtrl
        })
        .when('/geoobjects/rectangle',{
            templateUrl:'partials/rectangle.html',
            controller:RectangleCtrl
        })
        .when('/geoobjects/polygon',{
            templateUrl:'partials/polygon.html',
            controller:PolygonCtrl
        })
        .when('/geoobjects/circle',{
            templateUrl:'partials/circle.html',
            controller:CircleCtrl
        })
        .when('/geoobjects/linestring-edit',{
            templateUrl:'partials/linestring-edit.html',
            controller:LineStringEditCtrl
        })
        .when('/geoobjects/polygon-draw',{
            templateUrl:'partials/polygon-draw.html',
            controller:PolygonDrawCtrl
        })
        .when('/geoobjects/list-objects',{
            templateUrl:'partials/list-objects.html',
            controller:ListObjectsCtrl
        })
        .when('/cluster/create',{
            templateUrl:'partials/create-cluster.html',
            controller:CreateClusterCtrl
        })
        .when('/cluster/set-size',{
            templateUrl:'partials/set-size-cluster.html',
            controller:CreateClusterCtrl
        })
        .when('/geoquery/point-inside-circle',{
            templateUrl:'partials/point-inside-circle.html',
            controller:PointInsideCircleCtrl
        })
        .when('/geoquery/find-objects',{
            templateUrl:'partials/find-objects.html',
            controller:FindObjectsCtrl
        })
        .when('/geoquery/add-bounds-objects',{
            templateUrl:'partials/add-bounds-objects.html',
            controller:AddBoundsObjectsCtrl
        })
        .when('/geoquery/route-mkad',{
            templateUrl:'partials/route-mkad.html',
            controller:RouteMKADCtrl
        })
        .when('/geoquery/geocode-result-view',{
            templateUrl:'partials/geocode-result-view.html',
            controller:GeocodeResultViewCtrl
        })
        .when('/behaviors/map',{
            templateUrl:'partials/behaviors.html',
            controller:EmptyCtrl
        })
        .when('/events/geoobect',{
            templateUrl:'partials/geoobject-events.html',
            controller:GeoObjectEventsCtrl
        })
        .when('/events/coordinate-click',{
            templateUrl:'partials/click-coordinate.html',
            controller:ClickCoordinateCtrl
        })
        .when('/events/edit-geoobject',{
            templateUrl:'partials/edit-geoobject.html',
            controller:EditGeoobjectCtrl
        })
        .when('/events/change-color',{
            templateUrl:'partials/change-color.html',
            controller:ChangeColorCtrl
        })
        .when('/template/balloon',{
            templateUrl:'partials/balloon-template.html',
            controller:BalloonTemplateCtrl
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
    var _map;
    $scope.afterMapInit = function(map){
        _map = map;
    };
    $scope.del = function(){
        _map.destroy();
    };
}

function MapChangeCtrl($scope) {
    $scope.center=[37.64,55.76];
    $scope.type='yandex#satellite';
    $scope.changeCenter = function(){
        $scope.center = [40.925358,57.767265];
    };
    var map;
    $scope.afterMapInit=function(nMap){
        map = nMap;
    };
    $scope.changeBounds=function(){
        map.setBounds([[38, 37], [40, 39]]);
    };
    $scope.replace=function(){
        $scope.type='yandex#publicMapHybrid';
        map.panTo([34.461,62.915], {
            // Задержка перед началом перемещения.
            delay: 1500
        });
    };
}

function MapFullScreenCtrl($scope, $timeout, $window){
    var map;
    $scope.afterMapInit=function(nMap){
        map = nMap;
    };
    var timeout;
    var resize = function(){
        if(timeout){
            $timeout.cancel(timeout);
        }
        timeout = $timeout(function(){
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
    $scope.afterMapInit=function(map){
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
    };
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
                }).then(
                    function (res) {
                         var newContent = res.geoObjects.get(0) ?
                         res.geoObjects.get(0).properties.get('name') :
                         'Не удалось определить адрес.';

                         // Задаем новое содержимое балуна в соответствующее свойство метки.
                         obj.properties.set('balloonContent', newContent);
                    }, function(err){
                        console.log(err);
                    });
            }, 1500
        );
    };
}

function OwnMapCtrl($scope, yaLayer, layerStorage,mapTypeStorage,yaMapType){
    $scope.mapInit = function() {
        // Создадим собственный слой карты:
        var MyLayer = function () {
            return yaLayer.create(function (tile, zoom) {
                return "http://mt.gmapuploader.com/tiles/FVSH1JsvdT/tile-" + zoom + "-" +
                    (tile[1] * Math.pow(2, zoom) + tile[0]) + ".jpg";
            });
        };

        // Добавим конструктор слоя в хранилище слоёв под ключом my#layer.
        layerStorage.get(function(storage){
            storage.add('my#layer', MyLayer);
        });
        // Создадим новый тип карты, состоящий только из нашего слоя тайлов,
        // и добавим его в хранилище типов карты под ключом my#type.
        mapTypeStorage.get(function(storage){
            storage.add('my#type', yaMapType.create(
                'Схема',
                ['my#layer']
            ));
        });
    };
}

function PointsCtrl($scope){
    $scope.geoObjects=[
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
                iconContent: 'Метка',
                balloonContent: 'Меня можно перемещать'
            }
        },
        {
            // Геометрия = тип объекта + географические координаты объекта
            geometry: {
                // Тип геометрии - точка
                type: 'Point',
                // Координаты точки.
                coordinates: [37.6,55.8]
            },
            // Свойства
            properties: {
                iconContent: '1',
                balloonContent: 'Балун',
                hintContent: 'Стандартный значок метки'
            }
        },
        {
            // Геометрия = тип объекта + географические координаты объекта
            geometry: {
                // Тип геометрии - точка
                type: 'Point',
                // Координаты точки.
                coordinates: [37.56,55.76]
            },
            // Свойства
            properties: {
                hintContent: 'Собственный значок метки'
            }
        }
    ];
}

function LineStringCtrl($scope){
    $scope.geoObjects=[
        {
            geometry: {
                type: 'LineString',
                coordinates: [
                    [37.50,55.80],
                    [37.40,55.70]
                ]
            },
            properties: {
                hintContent: "Я геообъект",
                balloonContent: "Меня можно перетащить"
            }
        },
        {
            geometry: {
                type: 'LineString',
                coordinates: [
                    [37.50,55.80],
                    [37.40,55.80],
                    [37.50,55.70],
                    [37.40,55.70]
                ]
            },
            properties: {
                balloonContent: "Ломаная линия"
            }
        }
    ];
}

function LineStringEditCtrl($scope){
    $scope.geoObjects=[
        {
            geometry: {
                type: 'LineString',
                coordinates: [
                    [37.50,55.80],
                    [37.40,55.80],
                    [37.50,55.70],
                    [37.40,55.70]
                ]
            },
            properties: {
                balloonContent: "Ломаная линия"
            }
        }
    ];
    $scope.editor = function (items) {
        items.push({
            title: "Удалить линию",
            onClick: function () {
                $scope.$apply(function(){
                    $scope.geoObjects.length=0;
                });
            }
        });
        return items;
    };
}

function RectangleCtrl($scope){
    $scope.geoObjects=[
        {
            geometry: {
                type: 'Rectangle',
                coordinates: [
                    [37.66,55.665],
                    [37.53,55.64]
                ]
            },
            properties: {
                hintContent: 'Перетащи меня!',
                balloonContent: 'Прямоугольник 2'
            }
        },
        {
            geometry: {
                type: 'Rectangle',
                coordinates: [
                    [37.60,55.66],
                    [37.69,55.71]
                ]
            },
            properties: {
                hintContent: 'Меня перетаскивать нельзя!',
                balloonContent: 'Прямоугольник 1'
            }
        }
    ];
}

function PolygonCtrl($scope){
    $scope.geoObjects=[
        {
            geometry: {
                type: 'Polygon',
                coordinates: [
                    [
                        [37.80,55.75],
                        [37.90,55.80],
                        [38.00,55.75],
                        [38.00,55.70],
                        [37.80,55.70]
                    ],
                    // Координаты вершин внутреннего контура.
                    [
                        [37.82,55.75],
                        [37.98,55.75],
                        [37.90,55.65]
                    ]
                ],
                fillRule: "nonZero"
            },
            properties: {
                balloonContent: "Многоугольник"
            }
        },
        {
            geometry: {
                type: 'Polygon',
                coordinates: [
                    [
                        [37.50,55.75],
                        [37.60,55.80],
                        [37.70,55.75],
                        [37.70,55.70],
                        [37.50,55.70]
                    ],
                    // Координаты вершин внутреннего контура.
                    [
                        [37.52,55.75],
                        [37.68,55.75],
                        [37.60,55.65]
                    ]
                ]
            },
            properties: {
                hintContent: "Многоугольник"
            }
        }
    ];
}

function CircleCtrl($scope){
    $scope.geoObjects=[
        {
            geometry: {
                type: 'Circle',
                coordinates: [37.60,55.76],
                radius: 10000
            },
            properties: {
                balloonContent: "Радиус круга - 10 км",
                hintContent: "Подвинь меня"
            }
        }
    ];
}

function PolygonDrawCtrl($scope){
    $scope.geoObjects=[
        {
            geometry: {
                type: 'Polygon',
                coordinates: []
            }
        }
    ];
}

function ListObjectsCtrl($scope, $filter){
    $scope.all=[
        {
            type:'памятник',
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
                balloonContent: 'Метка 1'
            }
        },
        {
            type:'памятник',
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
                balloonContent: 'Метка 2'
            }
        },
        {
            type:'памятник',
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
                balloonContent: 'Метка 3'
            }
        },
        {
            type:'ресторан',
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
                balloonContent: 'Метка 4'
            }
        },
        {
            type:'ресторан',
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
                balloonContent: 'Метка 5'
            }
        }
    ];
    $scope.types={
        'памятник':true,
        'ресторан':true
    };
    var filter = $filter('filter');
    $scope.runGroup = function(type){
        if(type){
            $scope.types[type]=!$scope.types[type];
        }
        $scope.geoObjects = filter($scope.all, filterFn);
    };
    var filterFn = function(val){
        return $scope.types[val.type];
    };
    $scope.runGroup();
    $scope.runBalloon = function(obj){
        $scope.show = obj;
    };
}

function CreateClusterCtrl($scope){
    var points = [
        [37.411961,55.831903],[37.565466,55.763338],[37.565466,55.763338],[37.616378,55.744522],[37.642889,55.780898],
        [37.435983,55.793559],[37.675638,55.800584],[37.589988,55.716733],[37.56084,55.775724],[37.433781,55.822144],
        [37.669838,55.87417],[37.482338,55.71677],[37.75021,55.78085],[37.654142,55.810906],[37.713329,55.865386],
        [37.525797,55.847121],[37.710743,55.778655],[37.717934,55.623415],[37.737,55.863193],[37.760113,55.86677],
        [37.730838,55.698261],[37.564769,55.6338],[37.5394,55.639996],[37.405853,55.69023],[37.5129,55.77597],
        [37.44218,55.775777],[37.440448,55.811814],[37.404853,55.751841],[37.728976,55.627303],[37.597163,55.816515],
        [37.689397,55.664352],[37.600961,55.679195],[37.658425,55.673873],[37.605126,55.681006],[37.431744,55.876327],
        [37.778445,55.843363],[37.549348,55.875445],[37.702087,55.662903],[37.434113,55.746099],[37.712326,55.83866],
        [37.415725,55.774838],[37.630223,55.871539],[37.571271,55.657037],[37.711026,55.691046],[37.65961,55.803972],
        [37.452759,55.616448],[37.442781,55.781329],[37.74887,55.844708],[37.406067,55.723123],[37.48498,55.858585]
    ];
    var createGeoObjects = function(){
        var geoObjects = [];
        var point;
        for (var i = 0, ii = points.length; i < ii; i++) {
            point = points[i];
            geoObjects.push({
                geometry:{
                    type:'Point',
                    coordinates:point
                },
                properties:{
                    balloonContentBody: 'балун <strong>метки ' + i + '</strong>',
                    clusterCaption: 'метка <strong>' + i + '</strong>'
                }
            });
        }
        $scope.geoObjects = geoObjects;
    };
    createGeoObjects();
}

function PointInsideCircleCtrl($scope){
    var objects;
    $scope.afterInit=function(map){
        objects = ymaps.geoQuery([
            {
                type: 'Point',
                coordinates: [37.75,55.73]
            },
            {
                type: 'Point',
                coordinates: [37.45,55.10]
            },
            {
                type: 'Point',
                coordinates: [37.35,55.25]
            }
        ]).addToMap(map);
    };
    $scope.circle = {
        geometry:{
            type:'Circle',
            coordinates:[37.7,55.43],
            radius:10000
        }
    };
    $scope.drag = function(event){
        var circle = event.get('target');
        var objectsInsideCircle = objects.searchInside(circle);
        objectsInsideCircle.setOptions('preset', 'twirl#redIcon');
        // Оставшиеся объекты - синими.
        objects.remove(objectsInsideCircle).setOptions('preset', 'twirl#blueIcon');
    };
}

function FindObjectsCtrl($scope){
    function findClosestObjects () {
        // Найдем в выборке кафе, ближайшее к найденной станции метро,
        // и откроем его балун.
        cafe.getClosestTo(metro.get(0)).balloon.open();
    }
    var cafe, metro;
    $scope.afterInit=function(map){
        cafe = ymaps.geoQuery({
            type: 'FeatureCollection',
            features: [{
                type: 'Feature',
                properties: {
                    balloonContent: 'Кофейня "Дарт Вейдер" - у нас есть печеньки!'
                },
                geometry: {
                    type: 'Point',
                    coordinates: [37.545849,55.724166]
                }
            }, {
                type: 'Feature',
                properties: {
                    balloonContent: 'Кафе "Горлум" - пирожные прелесть.'
                },
                geometry: {
                    type: 'Point',
                    coordinates: [37.567886,55.717495]
                }
            }, {
                type: 'Feature',
                properties: {
                    balloonContent: 'Кафе "Кирпич" - крепкий кофе для крепких парней.'
                },
                geometry: {
                    type: 'Point',
                    coordinates: [37.631057,55.7210180]
                }
            }
            ]
            // Сразу добавим точки на карту.
        }).addToMap(map);
        // Координаты станции метро получим через геокодер.
        metro = ymaps.geoQuery(ymaps.geocode('Москва, Кропоткинская', {kind: 'metro'}))
            // Нужно дождаться ответа от сервера и только потом обрабатывать полученные результаты.
            .then(findClosestObjects);
    };
    $scope.mapClick=function(event){
        cafe.getClosestTo(event.get('coordPosition')).balloon.open();
    };
}

function AddBoundsObjectsCtrl($scope){
    var objects;
    $scope.afterInit=function(map){
        objects = ymaps.geoQuery([{
            type: 'Point',
            coordinates: [37.75,55.73]
        }, {
            type: 'Point',
            coordinates: [37.45,55.10]
        }, {
            type: 'Point',
            coordinates: [37.35,55.25]
        }, {
            type: 'Point',
            coordinates: [67.35,55.25]
        }]);
        objects.searchInside(map)
            // И затем добавим найденные объекты на карту.
            .addToMap(map);
    };
    $scope.mapBoundschange=function(event){
        var myMap = event.get('target');
        var visibleObjects = objects.searchInside(myMap).addToMap(myMap);
        // Оставшиеся объекты будем удалять с карты.
        objects.remove(visibleObjects).removeFromMap(myMap);
    };
}

function RouteMKADCtrl($scope, $http){
    $http.get('/json/moscow.json').success(
        function(moscow){
            $scope.moscow= {geometry:moscow};
        }
    );
    $scope.added = function(event){
        var child = event.get('child');
        if(child.geometry.getType()==='Polygon'){
            var map = child.getMap();
            ymaps.route([[37.527034,55.654884], [37.976100,55.767305]]).then(
                function (res) {
                    // Объединим в выборку все сегменты маршрута.
                    var pathsObjects = ymaps.geoQuery(res.getPaths()),
                        edges = [];

                    // Переберем все сегменты и разобьем их на отрезки.
                    pathsObjects.each(function (path) {
                        var coordinates = path.geometry.getCoordinates();
                        for (var i = 1, l = coordinates.length; i < l; i++) {
                            edges.push({
                                type: 'LineString',
                                coordinates: [coordinates[i], coordinates[i - 1]]
                            });
                        }
                    });

                    // Создадим новую выборку, содержащую:
                    // - отрезки, описываюшие маршрут;
                    // - начальную и конечную точки;
                    // - промежуточные точки.
                    var routeObjects = ymaps.geoQuery(edges)
                            .add(res.getWayPoints())
                            .add(res.getViaPoints())
                            .setOptions('strokeWidth', 3)
                            .addToMap(map),
                    // Найдем все объекты, попадающие внутрь МКАД.
                        objectsInMoscow = routeObjects.searchInside(child),
                    // Найдем объекты, пересекающие МКАД.
                        boundaryObjects = routeObjects.searchIntersect(child);
                    // Раскрасим в разные цвета объекты внутри, снаружи и пересекающие МКАД.
                    boundaryObjects.setOptions({
                        strokeColor: '#06ff00',
                        preset: 'twirl#greenIcon'
                    });
                    objectsInMoscow.setOptions({
                        strokeColor: '#ff0005',
                        preset: 'twirl#redIcon'
                    });
                    // Объекты за пределами МКАД получим исключением полученных выборок из
                    // исходной.
                    routeObjects.remove(objectsInMoscow).remove(boundaryObjects).setOptions({
                        strokeColor: '#0010ff',
                        preset: 'twirl#blueIcon'
                    });
                }
            );
        }
    };
}

function GeocodeResultViewCtrl($scope){
    $scope.afterInit = function(map){
        var result = ymaps.geoQuery(ymaps.geocode('Арбат')).applyBoundsToMap(map);
        // Откластеризуем полученные объекты и добавим кластеризатор на карту.
        // Обратите внимание, что кластеризатор будет создан сразу, а объекты добавлены в него
        // только после того, как будет получен ответ от сервера.
        map.geoObjects.add(result.clusterize());
    }
}

function GeoObjectEventsCtrl($scope){
    var circle = {
        geometry:{
            type:'Circle',
            radius:1000000
        },
        properties:{
            balloonContentBody: 'Балун',
            hintContent: 'Хинт'
        }
    };
    $scope.log = [];
    $scope.afterInit=function(map){
        circle.geometry.coordinates = map.getCenter();
        $scope.circle = circle;
    };
    $scope.run = function(event){
        $scope.log.push('@' + event.get('type'));
    };
    var geoObj;
    $scope.setObject = function(geoObject){
        geoObj = geoObject;
    };
    $scope.balloonHeader = function(e){
        geoObj.properties.set('balloonContentHeader', e.get('type') == 'select' ? 'Заголовок' : undefined);
    };
    $scope.geodes = function(e){
        geoObj.options.set('geodesic', e.get('type') == 'select');
    };
    $scope.changeRadius = function(e){
        geoObj.geometry.setRadius(e.get('type') == 'select' ? 2000000 : 1000000);
    };
}

function ClickCoordinateCtrl($scope){
    var map;
    $scope.afterInit = function($map){
        map = $map;
    };
    $scope.mapClick = function(e){
        if (!map.balloon.isOpen()) {
            var coords = e.get('coordPosition');
            map.balloon.open(coords, {
                contentHeader:'Событие!',
                contentBody:'<p>Кто-то щелкнул по карте.</p>' +
                    '<p>Координаты щелчка: ' + [
                    coords[0].toPrecision(6),
                    coords[1].toPrecision(6)
                ].join(', ') + '</p>',
                contentFooter:'<sup>Щелкните еще раз</sup>'
            });
        }
        else {
            map.balloon.close();
        }
    };
    $scope.handleContext = function(e){
        map.hint.show(e.get('coordPosition'), 'Кто-то щелкнул правой кнопкой');
    };
}

function EditGeoobjectCtrl($scope){
    var geoObj;
    $scope.afterInit=function(geoObject){
        geoObj = geoObject;
        $scope.params ={
            iconContent:geoObject.properties.get('iconContent'),
            hintContent:geoObject.properties.get('hintContent'),
            balloonContent:geoObject.properties.get('balloonContent')
        };
    };
    $scope.save = function(){
        $scope.show = false;
        geoObj.properties.set($scope.params);
    };
    $scope.point = {
        geometry:{
            type:'Point',
            coordinates:[42.10,47.60]
        },
        properties:{
            hintContent: 'Щелкни по мне правой кнопкой мыши!'
        }
    };
    $scope.contextmenu = function(e){
        $scope.show = !$scope.show;
        if($scope.show){
            $scope.clickCoords = e.get('position');
        }
    };
}

function ChangeColorCtrl($scope){
    $scope.point = {
        geometry:{
            type:'Point',
            coordinates:[37.617761,55.755773]
        }
    };
    $scope.mouseenter=function(e){
        e.get('target').options.set('preset', 'twirl#greenIcon');
    };
    $scope.mouseleave=function(e){
        e.get('target').options.unset('preset');
    };
}

function BalloonTemplateCtrl($scope,templateLayoutFactory){
    var counter=0;
    $scope.overrides={
        build: function () {
            // Сначала вызываем метод build родительского класса.
            console.log('build');
            var BalloonContentLayout = templateLayoutFactory.get('templateOne');
            BalloonContentLayout.superclass.build.call(this);
            // А затем выполняем дополнительные действия.
            angular.element(document.getElementById('counter-button')).bind('click', this.onCounterClick);
            angular.element(document.getElementById('count')).html(counter);
        },

        // Аналогично переопределяем функцию clear, чтобы снять
        // прослушивание клика при удалении макета с карты.
        clear: function () {
            // Выполняем действия в обратном порядке - сначала снимаем слушателя,
            // а потом вызываем метод clear родительского класса.
            angular.element(document.getElementById('counter-button')).unbind('click', this.onCounterClick);
            var BalloonContentLayout = templateLayoutFactory.get('templateOne');
            BalloonContentLayout.superclass.clear.call(this);
        },

        onCounterClick: function () {
            angular.element(document.getElementById('count')).html(++counter);
            if (counter == 5) {
                alert('Вы славно потрудились.');
                counter = 0;
                angular.element(document.getElementById('count')).html(counter);
            }
        }
    };
    $scope.point = {
        geometry:{
            type:'Point',
            coordinates:[37.62708,55.650625]
        },
        properties: {
            name: 'Считаем'
        }
    };
}