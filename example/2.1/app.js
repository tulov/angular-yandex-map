/**
 * Created by владелец on 05.11.13.
 */
angular.module('myApp', ['ui.bootstrap','yaMap'], function($routeProvider, $locationProvider) {
    $routeProvider.when('/2.1/', {
            templateUrl: '2.1/partials/map-add.html',
            controller: MapAddCtrl
        })
        .when('/2.1/map/change', {
            templateUrl: '2.1/partials/map-change.html',
            controller: MapChangeCtrl
        })
        .when('/2.1/map/create', {
            templateUrl: '2.1/partials/create.html',
            controller: EmptyCtrl
        })
        .when('/2.1/map/own-map',{
            templateUrl:'2.1/partials/own-map.html',
            controller:OwnMapCtrl
        })
        .when('/2.1/balloon-and-hint',{
            templateUrl:'2.1/partials/hint-and-balloon.html',
            controller:HintAndBalloonCtrl
        })
        .when('/2.1/balloon-and-hint/dynamic-balloon',{
            templateUrl:'2.1/partials/dynamic-balloon.html',
            controller:DynamicBalloonCtrl
        })
        .when('/2.1/balloon-and-hint/balloon-panel',{
            templateUrl:'2.1/partials/balloon-panel.html',
            controller:BalloonPanelCtrl
        })
        .when('/2.1/active-area',{
            templateUrl:'2.1/partials/active-area-layout.html',
            controller:EmptyCtrl
        })
        .when('/2.1/geoobjects/points',{
            templateUrl:'2.1/partials/points.html',
            controller:PointsCtrl
        })
        .when('/2.1/geoobjects/linestring',{
            templateUrl:'2.1/partials/linestring.html',
            controller:LineStringCtrl
        })
        .when('/2.1/geoobjects/rectangle',{
            templateUrl:'2.1/partials/rectangle.html',
            controller:RectangleCtrl
        })
        .when('/2.1/geoobjects/polygon',{
            templateUrl:'2.1/partials/polygon.html',
            controller:PolygonCtrl
        })
        .when('/2.1/geoobjects/circle',{
            templateUrl:'2.1/partials/circle.html',
            controller:CircleCtrl
        })
        .when('/2.1/geoobjects/add-to-collection',{
            templateUrl:'2.1/partials/add-to-collection.html',
            controller:AddObjToCollection
        })
        .when('/2.1/geoobjects/linestring-edit',{
            templateUrl:'2.1/partials/linestring-edit.html',
            controller:LineStringEditCtrl
        })
        .when('/2.1/geoobjects/polygon-draw',{
            templateUrl:'2.1/partials/polygon-draw.html',
            controller:PolygonDrawCtrl
        })
        .when('/2.1/geoobjects/list-objects',{
            templateUrl:'2.1/partials/list-objects.html',
            controller:ListObjectsCtrl
        })
        .when('/2.1/geoobjects/change-parameters',{
            templateUrl:'2.1/partials/change-parameters.html',
            controller:ChangeParametersCtrl
        })
        .when('/2.1/cluster/create',{
            templateUrl:'2.1/partials/create-cluster.html',
            controller:CreateClusterCtrl
        })
        .when('/2.1/cluster/own-icon',{
            templateUrl:'2.1/partials/own-icon.html',
            controller:CreateClusterCtrl
        })
        .when('/2.1/cluster/color',{
            templateUrl:'2.1/partials/cluster-color.html',
            controller:ColorClusterCtrl
        })
        .when('/2.1/cluster/set-size',{
            templateUrl:'2.1/partials/set-size-cluster.html',
            controller:SetSizeClusterCtrl
        })
        .when('/2.1/cluster/two-column',{
            templateUrl:'2.1/partials/cluster-balloon-template-two-column.html',
            controller:ClusterTwoColumnCtrl
        })
        .when('/2.1/cluster/carousel',{
            templateUrl:'2.1/partials/cluster-balloon-template-carousel.html',
            controller:ClusterTwoColumnCtrl
        })
        .when('/2.1/cluster/accordion',{
            templateUrl:'2.1/partials/cluster-balloon-template-accordion.html',
            controller:ClusterAccordionCtrl
        })
        .when('/2.1/cluster/self',{
            templateUrl:'2.1/partials/cluster-balloon-template-self.html',
            controller:ClusterSelfCtrl
        })
        .when('/2.1/geoquery/point-inside-circle',{
            templateUrl:'2.1/partials/point-inside-circle.html',
            controller:PointInsideCircleCtrl
        })
        .when('/2.1/geoquery/find-objects',{
            templateUrl:'2.1/partials/find-objects.html',
            controller:FindObjectsCtrl
        })
        .when('/2.1/geoquery/add-bounds-objects',{
            templateUrl:'2.1/partials/add-bounds-objects.html',
            controller:AddBoundsObjectsCtrl
        })
        .when('/2.1/geoquery/route-mkad',{
            templateUrl:'2.1/partials/route-mkad.html',
            controller:RouteMKADCtrl
        })
        .when('/2.1/geoquery/geocode-result-view',{
            templateUrl:'2.1/partials/geocode-result-view.html',
            controller:GeocodeResultViewCtrl
        })
        .when('/2.1/behaviors/map',{
            templateUrl:'2.1/partials/behaviors.html',
            controller:EmptyCtrl
        })
        .when('/2.1/behaviors/dragger',{
            templateUrl:'2.1/partials/dragger.html',
            controller:DraggerCtrl
        })
        .when('/2.1/geoobjects/events',{
            templateUrl:'2.1/partials/geoobject-events.html',
            controller:GeoObjectEventsCtrl
        })
        .when('/2.1/geoobjects/active-area',{
            templateUrl:'2.1/partials/active-area.html',
            controller:ActiveAreaCtrl
        })
        .when('/2.1/behaviors/coordinate-click',{
            templateUrl:'2.1/partials/click-coordinate.html',
            controller:ClickCoordinateCtrl
        })
        .when('/2.1/geoobjects/change-color',{
            templateUrl:'2.1/partials/change-color.html',
            controller:ChangeColorCtrl
        })
        .when('/2.1/balloon-and-hint/template',{
            templateUrl:'2.1/partials/balloon-template.html',
            controller:BalloonTemplateCtrl
        })
        .when('/2.1/toolbar/standart',{
            templateUrl:'2.1/partials/toolbar-standart.html',
            controller:EmptyCtrl
        })
        .when('/2.1/toolbar/add',{
            templateUrl:'2.1/partials/toolbar-add.html',
            controller:EmptyCtrl
        })
        .when('/2.1/toolbar/add-batton',{
            templateUrl:'2.1/partials/toolbar-batton.html',
            controller:EmptyCtrl
        })
        .when('/2.1/toolbar/button',{
            templateUrl:'2.1/partials/button-template.html',
            controller:EmptyCtrl
        })
        .when('/2.1/toolbar/zoom',{
            templateUrl:'2.1/partials/zoom-template.html',
            controller:ZoomTemplateCtrl
        })
        .when('/2.1/toolbar/list-box',{
            templateUrl:'2.1/partials/list-box-template.html',
            controller:ListBoxTemplateCtrl
        })
        .when('/2.1/geocode/one',{
            templateUrl:'2.1/partials/geocode.html',
            controller:GeocodeCtrl
        })
        .when('/2.1/geocode/multi',{
            templateUrl:'2.1/partials/multi-geocode.html',
            controller:MultiGeocodeCtrl
        })
        .when('/2.1/traffic/element',{
            templateUrl:'2.1/partials/traffic.html',
            controller:EmptyCtrl
        })
        .when('/2.1/traffic/without-button',{
            templateUrl:'2.1/partials/traffic-without-button.html',
            controller:TrafficWithoutButtonCtrl
        })
        .when('/2.1/geolocation/api',{
            templateUrl:'2.1/partials/geolocation-api.html',
            controller:GeolocationApiCtrl
        })
        .when('/2.1/geolocation/place',{
            templateUrl:'2.1/partials/geolocation-place.html',
            controller:EmptyCtrl
        })
        .when('/2.1/route/create',{
            templateUrl:'2.1/partials/route.html',
            controller:RouteCtrl
        })
        .when('/2.1/route/edit',{
            templateUrl:'2.1/partials/route-edit.html',
            controller:RouteEditCtrl
        })
        .when('/2.1/route/calculate-cost',{
            templateUrl:'2.1/partials/calculate-cost.html',
            controller:CalculateCostCtrl
        })
        .when('/2.1/performance/test',{
            templateUrl:'2.1/partials/performance-test.html',
            controller:PerformanceTestCtrl
        })
    ;

    // configure html5 to get links working on jsfiddle
    $locationProvider.html5Mode(true);
}).run(function($rootScope, $location){
        $rootScope.$on('$routeChangeSuccess',function(){
            $rootScope.curPath=$location.path();
        });
    }).
directive('activeClass',function(){
        return function(scope, elm){
            scope.$watch('curPath',function(newPath){
                if(newPath){
                    var href = elm.find('a').attr('href');
                    if(newPath===href){
                        if(!elm.hasClass('active')){
                            elm.addClass('active');
                        }
                    }else{
                        if(elm.hasClass('active')){
                            elm.removeClass('active');
                        }
                    }
                }
            });
        };
    });

function DraggerCtrl($scope){
    var markerOffset,
        markerPosition,
        map;
    $scope.afterInit=function(target){
        map=target;
    };
    var marker = document.getElementById('marker');
    $scope.onStart=function(event) {
        var position = event.get('position');
        // Сохраняем смещение маркера относительно точки начала драга.
        markerOffset = [
                position[0] - marker.offsetLeft,
                position[1] - marker.offsetTop
        ];
        markerPosition = [
                position[0] - markerOffset[0],
                position[1] - markerOffset[1]
        ];

        applyMarkerPosition();
    };

    $scope.onMove=function(event) {
        applyDelta(event);
    };

    $scope.onStop=function(event) {
        applyDelta(event);
        markerPosition[0] += markerOffset[0];
        markerPosition[1] += markerOffset[1];
        // Переводим координаты страницы в глобальные пиксельные координаты.
        var markerGlobalPosition = map.converter.pageToGlobal(markerPosition),
        // Получаем центр карты в глобальных пиксельных координатах.
            mapGlobalPixelCenter = map.getGlobalPixelCenter(),
        // Получением размер контейнера карты на странице.
            mapContainerSize = map.container.getSize(),
            mapContainerHalfSize = [mapContainerSize[0] / 2, mapContainerSize[1] / 2],
        // Вычисляем границы карты в глобальных пиксельных координатах.
            mapGlobalPixelBounds = [
                [mapGlobalPixelCenter[0] - mapContainerHalfSize[0], mapGlobalPixelCenter[1] - mapContainerHalfSize[1]],
                [mapGlobalPixelCenter[0] + mapContainerHalfSize[0], mapGlobalPixelCenter[1] + mapContainerHalfSize[1]]
            ];
        // Проверяем, что завершение работы драггера произошло в видимой области карты.
        if (containsPoint(mapGlobalPixelBounds, markerGlobalPosition)) {
            // Теперь переводим глобальные пиксельные координаты в геокоординаты с учетом текущего уровня масштабирования карты.
            var geoPosition = map.options.get('projection').fromGlobalPixels(markerGlobalPosition, map.getZoom());
            alert(geoPosition.join(' '));
        }
    };

    function applyDelta (event) {
        // Поле 'delta' содержит разницу между положениями текущего и предыдущего события драггера.
        var delta = event.get('delta');
        markerPosition[0] += delta[0];
        markerPosition[1] += delta[1];
        applyMarkerPosition();
    }

    function applyMarkerPosition () {
        marker.style.left=markerPosition[0]+'px';
        marker.style.top=markerPosition[1]+'px';
    }

    function containsPoint (bounds, point) {
        return point[0] >= bounds[0][0] && point[0] <= bounds[1][0] &&
            point[1] >= bounds[0][1] && point[1] <= bounds[1][1];
    }
}

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
    $scope.center=[40.925358,57.767265];
    $scope.type='yandex#satellite';
    $scope.changeCenter = function(){
        $scope.center = [37.64,55.76];
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

function EmptyCtrl($scope){
    $scope.geoObjects=[
        {
            geometry:{
                type:'Point',
                coordinates:[37.64,55.76]
            }
        }
    ]
}

function ChangeParametersCtrl($scope){
    $scope.point = {
        geometry:{
            type:'Point',
            coordinates:[42.1, 47.6]
        },
        properties: {
            iconContent:'Щелкни по мне правой кнопкой мыши!',
            hintContent: "",
            balloonContent: ""
        }
    };
    $scope.params={position:{}};
    $scope.contextmenu=function(e){
        $scope.params.position.left = e.get('pagePixels')[0]+'px';
        $scope.params.position.top = e.get('pagePixels')[1]+'px';
        $scope.params.show=!$scope.params.show;
    };
}

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
            map.hint.open(map.getCenter(), "Содержимое хинта", {
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

function BalloonPanelCtrl($scope){
    $scope.point = {
        geometry: {
            // Тип геометрии - точка
            type: 'Point',
            // Координаты точки.
            coordinates: [37.588227,55.733835]
        },
        // Свойства
        properties: {
            balloonContentBody: [
                '<address>',
                '<strong>Офис Яндекса в Москве</strong>',
                '<br/>',
                'Адрес: 119021, Москва, ул. Льва Толстого, 16',
                '<br/>',
                'Подробнее: <a href="http://company.yandex.ru/">http://company.yandex.ru</a>',
                '</address>'
            ].join('')
        }
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
            geometry: {
                type: "Point",
                coordinates: [37.8,55.8]
            },
            // Свойства.
            properties: {
                // Контент метки.
                iconContent: 'Я тащусь',
                hintContent: 'Ну давай уже тащи'
            }
        },
        {
            // Геометрия = тип объекта + географические координаты объекта
            geometry: {
                // Тип геометрии - точка
                type: 'Point',
                // Координаты точки.
                coordinates: [37.738521,55.684758]
            },
            // Свойства
            properties: {
                balloonContent: 'цвет <strong>воды пляжа бонди</strong>'
            }
        },
        {
            // Геометрия = тип объекта + географические координаты объекта
            geometry: {
                // Тип геометрии - точка
                type: 'Point',
                // Координаты точки.
                coordinates: [37.715175,55.833436]
            },
            // Свойства
            properties: {
                balloonContent: '<strong>серобуромалиновый</strong> цвет'
            }
        },
        {
            // Геометрия = тип объекта + географические координаты объекта
            geometry: {
                // Тип геометрии - точка
                type: 'Point',
                // Координаты точки.
                coordinates: [37.529789,55.687086]
            },
            // Свойства
            properties: {
                balloonContent: 'цвет <strong>влюбленной жабы</strong>'
            }
        },
        {
            // Геометрия = тип объекта + географические координаты объекта
            geometry: {
                // Тип геометрии - точка
                type: 'Point',
                // Координаты точки.
                coordinates: [37.614924,55.782392]
            },
            // Свойства
            properties: {
                balloonContent: 'цвет <strong>детской неожиданности</strong>'
            }
        },
        {
            // Геометрия = тип объекта + географические координаты объекта
            geometry: {
                // Тип геометрии - точка
                type: 'Point',
                // Координаты точки.
                coordinates: [37.656123,55.642063]
            },
            // Свойства
            properties: {
                balloonContent: 'цвет <strong>бисмарк-фуриозо</strong>'
            }
        },
        {
            // Геометрия = тип объекта + географические координаты объекта
            geometry: {
                // Тип геометрии - точка
                type: 'Point',
                // Координаты точки.
                coordinates: [37.487208,55.826479]
            },
            // Свойства
            properties: {
                balloonContent: 'цвет <strong>фэйсбука</strong>'
            }
        },
        {
            // Геометрия = тип объекта + географические координаты объекта
            geometry: {
                // Тип геометрии - точка
                type: 'Point',
                // Координаты точки.
                coordinates: [37.435023,55.694843]
            },
            // Свойства
            properties: {
                balloonContent: 'цвет <strong>вконтакте</strong>'
            }
        },
        {
            // Геометрия = тип объекта + географические координаты объекта
            geometry: {
                // Тип геометрии - точка
                type: 'Point',
                // Координаты точки.
                coordinates: [37.814052,55.790139]
            },
            // Свойства
            properties: {
                balloonContent: 'цвет <strong>твиттера</strong>'
            }
        },
        {
            // Геометрия = тип объекта + географические координаты объекта
            geometry: {
                // Тип геометрии - точка
                type: 'Point',
                // Координаты точки.
                coordinates: [37.573856,55.790139]
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

function AddObjToCollection($scope){
    $scope.oneObjects = [
        {
            geometry: {
                type: 'Point',
                coordinates: [37.75, 55.73]
            }
        },
        {
            geometry: {
                type: 'Point',
                coordinates: [37.75, 55.81]
            }
        }
    ];
    $scope.twoObjects=[
        {
            geometry: {
                type: 'Point',
                coordinates: [37.65, 55.73]
            }
        },
        {
            geometry: {
                type: 'Point',
                coordinates: [37.65,55.81]
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

function SetSizeClusterCtrl($scope){
    $scope.params={
        pointCount:100,
        useCluster:false,
        size:64
    };
    $scope.cluster=[];
    $scope.collection=[];
    function getRandomCoordinates (bounds) {
        var size = [bounds[1][0] - bounds[0][0], bounds[1][1] - bounds[0][1]];
        return [Math.random() * size[0] + bounds[0][0], Math.random() * size[1] + bounds[0][1]];
    }
    $scope.add = function(){
        var placemarksNumber = $scope.params.pointCount,
            bounds = _map.getBounds(),
        // Флаг, показывающий, нужно ли кластеризовать объекты.
            useClusterer = $scope.params.useCluster,
        // Размер ячейки кластеризатора, заданный пользователем.
            gridSize = $scope.params.size;

        if (gridSize > 0 && useClusterer) {
            _cluster.options.set({
                gridSize: gridSize
            });
        }
        for (var i = 0; i < placemarksNumber; i++) {
            var point = {
                geometry:{
                    type:'Point',
                    coordinates:getRandomCoordinates(bounds)
                }
            };
            if(useClusterer){
                $scope.cluster.push(point);
            }else{
                $scope.collection.push(point);
            }
        }
    };
    $scope.remove = function(){
        $scope.cluster.length=0;
        $scope.collection.length=0;
    };
    var _map, _cluster;
    $scope.init=function(map){
        _map=map;
    };
    $scope.initCluster=function(cluster){
        _cluster=cluster;
    }
}

function ClusterTwoColumnCtrl($scope){
    var objs=[];
    $scope.mapCenter=[37.619044,55.755381];
    for(var i= 0;i<100;i++){
        objs.push({
            geometry:{
                type:'Point',
                coordinates:getRandomCoordinates()
            },
            properties:{
                // Устаналиваем данные, которые будут отображаться в балуне.
                balloonContentHeader: 'Метка №' + (i + 1),
                balloonContentBody: getContentBody(i),
                balloonContentFooter: 'Мацуо Басё'
            }
        });
    }
    $scope.geoObjects=objs;
    function getRandomCoordinates () {
        return [
            $scope.mapCenter[0] + (Math.random() * 0.3 - 0.15),
            $scope.mapCenter[1] + (Math.random() * 0.5 - 0.25)
        ];
    }
    var placemarkBodies;
    function getContentBody (num) {
        if (!placemarkBodies) {
            placemarkBodies = [
                ['Желтый лист в ручье.', 'Просыпайся, цикада,', 'Берег все ближе.'].join('<br/>'),
                ['Ива на ветру.', 'Соловей в ветвях запел,', 'Как ее душа.'].join('<br/>'),
                ['Лежу и молчу,', 'Двери запер на замок.', 'Приятный отдых.'].join('<br/>')
            ];
        }
        return '<strong>Тело метки №' + (num + 1) + '</strong><br/>' + placemarkBodies[num % placemarkBodies.length];
    }
}

function ClusterSelfCtrl($scope){
    var objs=[];
    $scope.mapCenter=[37.619044,55.755381];
    for(var i= 0;i<100;i++){
        objs.push({
            geometry:{
                type:'Point',
                coordinates:getRandomCoordinates()
            },
            properties:{
                // Устаналиваем данные, которые будут отображаться в балуне.
                balloonContentHeader: 'Метка №' + (i + 1),
                balloonContentBody: 'Информация о метке №'+i,
                placemarkId: i
            }
        });
    }
    $scope.geoObjects=objs;
    function getRandomCoordinates () {
        return [
            $scope.mapCenter[0] + (Math.random() * 0.3 - 0.15),
            $scope.mapCenter[1] + (Math.random() * 0.5 - 0.25)
        ];
    }
}

function ClusterAccordionCtrl($scope){
    var objs=[];
    $scope.mapCenter=[37.619044,55.755381];
    var placemarkColors = [
        '#FF1F1F', '#1F44FF', '#1FFF8E', '#FF1FF5',
        '#FFEF1F', '#FF931F', '#AE6961', '#6193AE'
    ];
    $scope.getRandomColor = function(){
        return placemarkColors[Math.round(Math.random() * placemarkColors.length)];
    };
    for(var i= 0;i<100;i++){
        objs.push({
            geometry:{
                type:'Point',
                coordinates:getRandomCoordinates()
            },
            properties:{
                // Устаналиваем данные, которые будут отображаться в балуне.
                balloonContentHeader: 'Метка №' + (i + 1),
                balloonContentBody: getContentBody(i),
                balloonContentFooter: 'Мацуо Басё'
            }
        });
    }
    $scope.geoObjects=objs;
    function getRandomCoordinates () {
        return [
            $scope.mapCenter[0] + (Math.random() * 0.3 - 0.15),
            $scope.mapCenter[1] + (Math.random() * 0.5 - 0.25)
        ];
    }
    var placemarkBodies;
    function getContentBody (num) {
        if (!placemarkBodies) {
            placemarkBodies = [
                ['Желтый лист в ручье.', 'Просыпайся, цикада,', 'Берег все ближе.'].join('<br/>'),
                ['Ива на ветру.', 'Соловей в ветвях запел,', 'Как ее душа.'].join('<br/>'),
                ['Лежу и молчу,', 'Двери запер на замок.', 'Приятный отдых.'].join('<br/>')
            ];
        }
        return '<strong>Тело метки №' + (num + 1) + '</strong><br/>' + placemarkBodies[num % placemarkBodies.length];
    }
}

function ColorClusterCtrl($scope){
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
    $scope.enter = function(e){
        var target = e.get('target');
        if (typeof target.getGeoObjects != 'undefined') {
            // Событие произошло на кластере.
            target.options.set('preset', 'islands#invertedPinkClusterIcons');
        } else {
            // Событие произошло на геообъекте.
            target.options.set('preset', 'islands#pinkIcon');
        }
    };
    $scope.leave = function(e){
        var target = e.get('target');
        if (typeof target.getGeoObjects != 'undefined') {
            // Событие произошло на кластере.
            target.options.set('preset', 'islands#invertedVioletClusterIcons');
        } else {
            // Событие произошло на геообъекте.
            target.options.set('preset', 'islands#violetIcon');
        }
    };
}

function PointInsideCircleCtrl($scope){
    var objects, collection;
    $scope.afterInit = function(col){
        collection = col;
    };
    $scope.circle = {
        geometry:{
            type:'Circle',
            coordinates:[37.7,55.43],
            radius:10000
        }
    };
    $scope.geoQuerySource = [
        {
            geometry:{
                type: 'Point',
                coordinates: [37.75,55.73]
            }
        },
        {
            geometry:{
                type: 'Point',
                coordinates: [37.45,55.10]
            }
        },
        {
            geometry:{
                type: 'Point',
                coordinates: [37.35,55.25]
            }
        }
    ];
    $scope.drag = function(event){
        if(!objects){
            objects = ymaps.geoQuery(collection);
        }
        var circle = event.get('target');
        var objectsInsideCircle = objects.searchInside(circle);
        objectsInsideCircle.setOptions('preset', 'islands#redIcon');
        // Оставшиеся объекты - синими.
        objects.remove(objectsInsideCircle).setOptions('preset', 'islands#blueIcon');
    };
}

function FindObjectsCtrl($scope){
    var cafe, collection;
    $scope.cafes = [
        {
            properties: {
                balloonContent: 'Кофейня "Дарт Вейдер" - у нас есть печеньки!'
            },
            geometry: {
                type: 'Point',
                coordinates: [37.545849,55.724166]
            }
        }, {
            properties: {
                balloonContent: 'Кафе "Горлум" - пирожные прелесть.'
            },
            geometry: {
                type: 'Point',
                coordinates: [37.567886,55.717495]
            }
        }, {
            properties: {
                balloonContent: 'Кафе "Кирпич" - крепкий кофе для крепких парней.'
            },
            geometry: {
                type: 'Point',
                coordinates: [37.631057,55.7210180]
            }
        }
    ];
    $scope.afterInit = function(col){
        collection=col;
    };
    $scope.mapClick=function(event){
        if(!cafe){
            cafe = ymaps.geoQuery(collection);
        }
        cafe.getClosestTo(event.get('coords')).balloon.open();
    };
}

function AddBoundsObjectsCtrl($scope){
    var searchInside = function(geoObjects, bounds){
        var coord, results = [];
        for (var i = 0, ii = geoObjects.length; i < ii; i++) {
            coord = geoObjects[i].geometry.coordinates;
            if(coord[0]>bounds[0][0]
                && coord[0]<bounds[1][0]
                && coord[1]>bounds[0][1]
                && coord[1]<bounds[1][1]){
                results.push(geoObjects[i]);
            }
        }
        return results;
    };
    var points = [
        {geometry:{
            type: 'Point',
            coordinates: [37.75,55.73]
        }},{geometry:{
            type: 'Point',
            coordinates: [37.45,55.10]
        }},{geometry:{
            type: 'Point',
            coordinates: [37.35,55.25]
        }},{geometry:{
            type: 'Point',
            coordinates: [67.35,55.25]
        }}];
    $scope.afterInit=function(map){
        $scope.onMap = searchInside(points, map.getBounds());
    };
    $scope.mapBoundschange=function(event){
        var myMap = event.get('target');
        $scope.onMap = searchInside(points, myMap.getBounds());
    };
}

function RouteMKADCtrl($scope, $http){
    $http.get('/json/moscow.json').success(
        function(moscow){
            $scope.moscow= {geometry:moscow};
        }
    );

    var hasChange=false;
    var changeColor = function(){
        hasChange=true;
        if(!moscow){
            return;
        }
        var routeObjects = ymaps.geoQuery(collection);
        var objectsInMoscow = routeObjects.searchInside(moscow);
        objectsInMoscow.setOptions(
            {
                strokeColor: '#ff0005',
                preset: 'islands#redIcon'
            }
        );
        routeObjects.remove(objectsInMoscow).setOptions({
            strokeColor: '#0010ff',
            preset: 'islands#blueIcon'
        });
    };
    $scope.beforeInit = function(){
        ymaps.route([[37.527034,55.654884], [37.976100,55.767305]]).then(
            function (res) {
                // Объединим в выборку все сегменты маршрута.
                var pathsObjects = ymaps.geoQuery(res.getPaths()),
                    edges = [];

                // Переберем все сегменты и разобьем их на отрезки.
                pathsObjects.each(function (path) {
                    var coordinates = path.geometry.getCoordinates();
                    for (var i = 1, l = coordinates.length; i < l; i++) {
                        edges.push({geometry:{
                            type: 'LineString',
                            coordinates: [coordinates[i], coordinates[i - 1]]
                        }});
                    }
                });
                res.getWayPoints().each(function(obj){
                    var g = obj.geometry;
                    edges.push({
                        geometry:{
                            type: g.getType(),
                            coordinates: g.getCoordinates()
                        },
                        properties:{
                            iconContent:obj.properties.get('iconContent')
                        }
                    });
                });
                res.getViaPoints().each(function(obj){
                    var g = obj.geometry;
                    edges.push({
                        geometry:{
                            type: g.getType(),
                            coordinates: g.getCoordinates()
                        },
                        properties:{
                            iconContent:obj.properties.get('iconContent')
                        }
                    });
                });
                $scope.$apply(function(){
                    $scope.edges = edges;
                });
            }
        );
    };

    $scope.afterInit = function(geoObject, last){
        if(!last){
            return;
        }
        changeColor();
    };
    var moscow;
    $scope.added = function(obj){
        moscow = obj;
        if(hasChange){
            changeColor();
        }
    };

    var collection;
    $scope.initCollection = function(col){
        collection = col;
    };
}

function GeocodeResultViewCtrl($scope){
    var _map;
    $scope.ifLast = function(last){
        if(!last){
            return;
        }
        _map.geoObjects.each(function(obj){
            _map.setBounds(obj.getBounds());
            return false;
        });
    };
    $scope.afterInit = function(map){
        _map=map;
        ymaps.geocode('Арбат').then(
            function(res){
                var geos = [];
                res.geoObjects.each(function(obj){
                    geos.push({
                        geometry:{
                            type:obj.geometry.getType(),
                            coordinates:obj.geometry.getCoordinates()
                        },
                        properties:{
                            balloonContentBody:obj.properties.get('balloonContentBody')
                        }
                    });
                });
                $scope.$apply(function(){
                    $scope.res = geos;
                });
            }
        );
    };
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
            var coords = e.get('coords');
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
        map.hint.open(e.get('coords'), 'Кто-то щелкнул правой кнопкой');
    };
    $scope.balloonOpen=function(){
        map.hint.close();
    }
}
/*
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
*/
function ActiveAreaCtrl($scope){
    $scope.geoObjects=[
        {
            geometry:{
                type:'Point',
                coordinates:[37.682145,55.725118]
            },
            properties:{
                hintContent: 'Метка с прямоугольным HTML макетом'
            }
        },{
            geometry:{
                type:'Point',
                coordinates:[37.605584,55.783202]
            },
            properties:{
                hintContent: 'Метка с круглым HTML макетом'
            }
        },{
            geometry:{
                type:'Point',
                coordinates:[37.558416,55.662693]
            },
            properties:{
                hintContent: 'HTML метка сложной формы'
            }
        }
    ];
}

function ChangeColorCtrl($scope){
    $scope.point = {
        geometry:{
            type:'Point',
            coordinates:[37.617761,55.755773]
        }
    };
    $scope.mouseenter=function(e){
        e.get('target').options.set('preset', 'islands#greenIcon');
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

function ZoomTemplateCtrl($scope,templateLayoutFactory){
    $scope.over={
        build: function () {
            // Вызываем родительский метод build.
            var ZoomLayout = templateLayoutFactory.get('zoomTemplate');
            ZoomLayout.superclass.build.call(this);

            // Привязываем функции-обработчики к контексту и сохраняем ссылки
            // на них, чтобы потом отписаться от событий.
            this.zoomInCallback = ymaps.util.bind(this.zoomIn, this);
            this.zoomOutCallback = ymaps.util.bind(this.zoomOut, this);

            // Начинаем слушать клики на кнопках макета.
            angular.element(document.getElementById('zoom-in')).bind('click', this.zoomInCallback);
            angular.element(document.getElementById('zoom-out')).bind('click', this.zoomOutCallback);
        },

        clear: function () {
            // Снимаем обработчики кликов.
            angular.element(document.getElementById('zoom-in')).unbind('click', this.zoomInCallback);
            angular.element(document.getElementById('zoom-out')).unbind('click', this.zoomOutCallback);

            // Вызываем родительский метод clear.
            var ZoomLayout = templateLayoutFactory.get('zoomTemplate');
            ZoomLayout.superclass.clear.call(this);
        },

        zoomIn: function () {
            var map = this.getData().control.getMap();
            // Генерируем событие, в ответ на которое
            // элемент управления изменит коэффициент масштабирования карты.
            this.events.fire('zoomchange', {
                oldZoom: map.getZoom(),
                newZoom: map.getZoom() + 1
            });
        },

        zoomOut: function () {
            var map = this.getData().control.getMap();
            this.events.fire('zoomchange', {
                oldZoom: map.getZoom(),
                newZoom: map.getZoom() - 1
            });
        }
    };
}

function ListBoxTemplateCtrl($scope,templateLayoutFactory){
    $scope.overList={
        build: function() {
            // Вызываем метод build родительского класса перед выполнением
            // дополнительных действий.
            var ListBoxLayout = templateLayoutFactory.get('listBoxTemplate');
            ListBoxLayout.superclass.build.call(this);

            this.childContainerElement = angular.element(document.getElementById('my-listbox'))[0];
            // Генерируем специальное событие, оповещающее элемент управления
            // о смене контейнера дочерних элементов.
            this.events.fire('childcontainerchange', {
                newChildContainerElement: this.childContainerElement,
                oldChildContainerElement: null
            });
        },

        // Переопределяем интерфейсный метод, возвращающий ссылку на
        // контейнер дочерних элементов.
        getChildContainerElement: function () {
            return this.childContainerElement;
        },

        clear: function () {
            // Заставим элемент управления перед очисткой макета
            // откреплять дочерние элементы от родительского.
            // Это защитит нас от неожиданных ошибок,
            // связанных с уничтожением dom-элементов в ранних версиях ie.
            this.events.fire('childcontainerchange', {
                newChildContainerElement: null,
                oldChildContainerElement: this.childContainerElement
            });
            this.childContainerElement = null;
            // Вызываем метод clear родительского класса после выполнения
            // дополнительных действий.
            var ListBoxLayout = templateLayoutFactory.get('listBoxTemplate');
            ListBoxLayout.superclass.clear.call(this);
        }
    };
    $scope.click = function(e){
        var item = e.get('target');
        if (item.data.get('title') != 'Выберите пункт') {
            var myMap = item.getMap();
            myMap.setCenter(
                item.data.get('center'),
                item.data.get('zoom')
            );
        }
    };
}
/*
function ClusterBalloonTemplateCtrl($scope, templateLayoutFactory){
    $scope.center = [37.621587,55.74954];
    $scope.overrides={
        build: function () {
            // Сначала вызываем метод build родительского класса.
            var MainContentLayout = templateLayoutFactory.get('mainTemplate');
            MainContentLayout.superclass.build.call(this);
            // Нужно отслеживать, какой из пунктов левого меню выбран,
            // чтобы обновлять содержимое правой части.
            this.stateListener = this.getData().state.events.group()
                .add('change', this.onStateChange, this);
            // Запоминаем текущий активный объект.
            this.activeObject = this.getData().state.get('activeObject');
            this.applyContent();
        },

        clear: function () {
            if (this.activeObjectLayout) {
                this.activeObjectLayout.setParentElement(null);
                this.activeObjectLayout = null;
            }
            // Снимаем слушателей изменения полей.
            this.stateListener.removeAll();
            // А затем вызываем метод clear родительского класса.
            var MainContentLayout = templateLayoutFactory.get('mainTemplate');
            MainContentLayout.superclass.clear.call(this);
        },

        onStateChange: function () {
            // При изменении одного из полей состояния
            // проверяем, не сменился ли активный объект.
            var newActiveObject = this.getData().state.get('activeObject');
            if (newActiveObject != this.activeObject) {
                // Если объект изменился, нужно обновить
                // содержимое правой части.
                this.activeObject = newActiveObject;
                this.applyContent();
            }
        },

        applyContent: function () {
            if (this.activeObjectLayout) {
                this.activeObjectLayout.setParentElement(null);
            }
            // Чтобы было удобнее формировать текстовый шаблон,
            // создадим внутренний макет, в который будем передавать
            // модифицированный dataSet.
            var MainContentSubLayout = templateLayoutFactory.get('subMainTemplate');
            this.activeObjectLayout = new MainContentSubLayout({
                // Поскольку внутренний макет будет отображать
                // информацию какого-то геообъекта,
                // будем передавать во входном хэше данные и опции
                // текущего активного геообъекта.
                options: this.options,
                properties: this.activeObject.properties
            });

            // Прикрепляем внутренний макет к внешнему.
            this.activeObjectLayout.setParentElement(this.getParentElement());
        }
    };
    var init = function(){
        var geos = [];
        for (var i = 0; i < 500; i++) {
            var coordinates = [
                $scope.center[0] + 0.5 * Math.random() * (Math.random() < 0.5 ? -1 : 1),
                $scope.center[1] + 0.7 * Math.random() * (Math.random() < 0.5 ? -1 : 1)
            ];
            geos.push({
                geometry:{
                    type:'Point',
                    coordinates:coordinates
                },
                properties:{
                    name: 'Метка №' + i,
                    clusterCaption: '№' + i,
                    balloonContentBody: '<br>Варкалось. Хливкие шорьки<br>' +
                        'Пырялись по наве<br>' +
                        'И хрюкотали зелюки,<br>' +
                        'Как мюмзики в мове.<br>',
                    balloonContentHeader: 'Бармаглот',
                    balloonContentFooter: 'Л. Кэрролл'
                }
            });
        }
        $scope.geoObjects = geos;
    };
    init();
}

function ClusterBalloonCarouselTemplateCtrl($scope){
    $scope.center = [37.611619,55.819543];
    var content = [
            [
                "Пятнадцать человек на сундук мертвеца, ",
                "Йо-хо-хо, и бутылка рому! ",
                "Пей, и дьявол тебя доведёт до конца. ",
                "Йо-хо-хо, и бутылка рому!"
            ],
            [
                "Их мучила жажда, в конце концов, ",
                "Йо-хо-хо, и бутылка рому! ",
                "Им стало казаться, что едят мертвецов. ",
                "Йо-хо-хо, и бутылка рому!"
            ],
            [
                "Что пьют их кровь и мослы их жуют. ",
                "Йо-хо-хо, и бутылка рому! ",
                "Вот тут-то и вынырнул чёрт Дэви Джонс. ",
                "Йо-хо-хо, и бутылка рому!"
            ],
            [
                "Он вынырнул с чёрным большим ключом, ",
                "Йо-хо-хо, и бутылка рому! ",
                "С ключом от каморки на дне морском. ",
                "Йо-хо-хо, и бутылка рому!"
            ],
            [
                "Таращил глаза, как лесная сова, ",
                "Йо-хо-хо, и бутылка рому! ",
                "И в хохоте жутком тряслась голова. ",
                "Йо-хо-хо, и бутылка рому!"
            ],
            [
                "Сказал он: «Теперь вы пойдёте со мной, ",
                "Йо-хо-хо, и бутылка рому! ",
                "Вас всех схороню я в пучине морской». ",
                "Йо-хо-хо, и бутылка рому!"
            ],
            [
                "И он потащил их в подводный свой дом, ",
                "Йо-хо-хо, и бутылка рому! ",
                "И запер в нём двери тем чёрным ключом. ",
                "Йо-хо-хо, и бутылка рому!"
            ]
        ];
    function getRandomCoordinates () {
        return [
            $scope.center[0] + 5.5 * Math.random() * Math.random() * (
                Math.random() < 0.5 ? -1 : 1),
            $scope.center[1] + 5.5 * Math.random() * Math.random() * (
                Math.random() < 0.5 ? -1 : 1)
        ];
    }
    function getRandomContentPart () {
        return content[Math.floor(Math.random() * content.length)].join('<br/>');
    }
    var init = function(){
        var geos = [];
        for (var i = 0; i < 99; i++) {
            geos.push({
                geometry:{
                    type:'Point',
                    coordinates:getRandomCoordinates()
                },
                properties:{
                    balloonContentHeader: 'Пиратская песня (' + (i + 1) + ')',
                    balloonContentBody: getRandomContentPart(),
                    balloonContentFooter: 'Р.Л.Стивенсон'
                }
            });
        }
        $scope.geoObjects = geos;
    };
    init();
}

function ClusterBalloonAccordionTemplateCtrl($scope){
    $scope.center = [37.611619,55.819543];
    var icons = ['pizza', 'burger', 'film', 'food', 'market', 'pharmacy'];
    function getRandomIcon () {
        return icons[Math.floor(Math.random() * icons.length)];

    }
    function getRandomCoordinates () {
        return [
            $scope.center[0] + 5.5 * Math.random() * Math.random() * (
                Math.random() < 0.5 ? -1 : 1),
            $scope.center[1] + 5.5 * Math.random() * Math.random() * (
                Math.random() < 0.5 ? -1 : 1)
        ];
    }
    var init = function(){
        var geos = [], icos=[];
        for (var i = 0; i < 99; i++) {
            geos.push({
                geometry:{
                    type:'Point',
                    coordinates:getRandomCoordinates()
                },
                properties:{
                    clusterCaption: 'Метка ' + (i + 1),
                    balloonContentHeader: 'Чайлд Роланд к Тёмной Башне пришёл',
                    balloonContentBody: ['...',
                        'Его слова — мне дальше не пройти,',
                        'Мне надо повернуть на этот тракт,',
                        'Что уведет от Темной Башни в мрак…',
                        'Я понял: предо мной — конец пути,',
                        'И рядом цель, что я мечтал найти…',
                        'Но смысл за годы обратился в прах,',
                        '...'].join('<br/>'),
                    balloonContentFooter: 'Роберт Браунинг'
                }
            });
            var icon = getRandomIcon();
            icos.push({
                iconImageHref: 'img/pin_' + icon + '.png',
                iconImageSize: [32, 36],
                iconImageOffet: [-16, -36],
                // иконка геообъекта в балуне кластера
                balloonIconImageHref: 'img/' + icon + '.png',
                balloonIconImageOffset: [2, 2],
                balloonIconImageSize: [14, 14]
            });
        }
        $scope.icons = icos;
        $scope.geoObjects = geos;
    };
    init();
}
*/
function GeocodeCtrl($scope){
    $scope.beforeInit = function(){
        ymaps.geocode('Нижний Новгород', { results: 1 }).then(function (res) {
            // Выбираем первый результат геокодирования.
            var firstGeoObject = res.geoObjects.get(0);
            // Задаем центр карты.
            $scope.$apply(function(){
                $scope.center = firstGeoObject.geometry.getCoordinates();
            });
        }, function (err) {
            // Если геокодирование не удалось, сообщаем об ошибке.
            alert(err.message);
        });
    };
    var loadMetro = function(){
        if(!$scope.center || !$scope.map){
            return;
        }
        // Поиск станций метро.
        // Делаем запрос на обратное геокодирование.
        ymaps.geocode($scope.center, {
            // Ищем только станции метро.
            kind: 'metro',
            // Ищем в пределах области видимости карты.
            boundedBy: $scope.map.getBounds(),
            // Запрашиваем не более 20 результатов.
            results: 20
        }).then(function (res) {
                var geos = [];
                res.geoObjects.each(function(obj){
                    geos.push({
                        geometry:{
                            type:'Point',
                            coordinates:obj.geometry.getCoordinates()
                        }
                    });
                });
                $scope.$apply(function(){
                    $scope.metros = geos;
                });
            });
    };
    $scope.$watch('center',loadMetro);
    $scope.$watch('map', loadMetro);
    $scope.afterInit = function(map){
        $scope.map = map;
    };
    $scope.geoObjects = [];
    $scope.mapClick=function(e){
        var coords = e.get('coords');

        // Отправим запрос на геокодирование.
        ymaps.geocode(coords).then(function (res) {
            var names = [];
            // Переберём все найденные результаты и
            // запишем имена найденный объектов в массив names.
            res.geoObjects.each(function (obj) {
                names.push(obj.properties.get('name'));
            });
            // Добавим на карту метку в точку, по координатам
            // которой запрашивали обратное геокодирование.
            var geoObj = {
                geometry:{
                    type:'Point',
                    coordinates:coords
                },
                properties:{
                    // В качестве контента иконки выведем
                    // первый найденный объект.
                    iconContent:names[0],
                    // А в качестве контента балуна - подробности:
                    // имена всех остальных найденных объектов.
                    balloonContent:names.reverse().join(', ')
                }
            };
            $scope.$apply(function(){
                $scope.geoObjects.push(geoObj);
            });
        });
    };
}

function MultiGeocodeCtrl($scope){
    var geocodes = [
        'Москва, Слесарный переулок, д.3',
        'Люберцы, Октябрьский проспект д.143',
        [37.588628,55.734046],
        'Мытищи, ул. Олимпийский проспект, владение 13, корпус А',
        'Москва, 3-я Хорошевская улица д.2, стр.1',
        'Москва, Нижний Сусальный переулок, д.5, стр.4'
    ];
    $scope.beforeInit = function(){
        var geocodeQuery;
        for (var i = 0, ii = geocodes.length; i < ii; i++) {
            geocodeQuery = geocodes[i];
            ymaps.geocode(geocodeQuery).then(function (res) {
                res.geoObjects.each(function(geoObject){
                    $scope.$apply(function(){
                        $scope.geoObjects.push({
                            geometry:{
                                type:'Point',
                                coordinates:geoObject.geometry.getCoordinates()
                            },
                            properties:{
                                // А в качестве контента балуна - подробности:
                                // имена всех остальных найденных объектов.
                                balloonContent:geoObject.properties.get('name')
                            }
                        });
                    });
                });
            });
        }
    };
    $scope.geoObjects = [];
}

function TrafficWithoutButtonCtrl($scope){
    $scope.afterInit=function(map){
        var actualProvider = new ymaps.traffic.provider.Actual({}, { infoLayerShown: true });
        // И затем добавим его на карту.
        actualProvider.setMap(map);
    };
}

function GeolocationApiCtrl($scope){
    $scope.beforeInit = function(){
        var geolocation = ymaps.geolocation;
        geolocation.get({
            provider: 'yandex',
            mapStateAutoApply: true
        }).then(function (result) {
            $scope.geoObjects.push({
                geometry:{
                    type:'Point',
                    coordinates:result.geoObjects.position
                },
                properties:{
                    balloonContent:'Определено по IP'
                }
            });
            $scope.center = result.geoObjects.position;
            $scope.$digest();
        });

        geolocation.get({
            provider: 'browser',
            mapStateAutoApply: true
        }).then(function (result) {
            // Синим цветом пометим положение, полученное через браузер.
            // Если браузер не поддерживает эту функциональность, метка не будет добавлена на карту.
            $scope.geoObjects.push({
                geometry:{
                    type:'Point',
                    coordinates:result.geoObjects.position
                },
                properties:{
                    balloonContent:'Определено по данным браузера'
                }
            });
            $scope.$digest();
        });
    };
    $scope.geoObjects=[];
}

function RouteCtrl($scope){
    var routePoints = [
        'Москва, улица Крылатские холмы',
        {
            point: 'Москва, метро Молодежная',
            // метро "Молодежная" - транзитная точка
            // (проезжать через эту точку, но не останавливаться в ней).
            type: 'viaPoint'
        },
        [55.731272, 37.447198], // метро "Кунцевская".
        'Москва, метро Пионерская'
    ];
    $scope.route = function(map){
        ymaps.route(routePoints).then(function (route) {
            map.geoObjects.add(route);
            // Зададим содержание иконок начальной и конечной точкам маршрута.
            // С помощью метода getWayPoints() получаем массив точек маршрута.
            // Массив транзитных точек маршрута можно получить с помощью метода getViaPoints.
            var points = route.getWayPoints(),
                lastPoint = points.getLength() - 1;
            // Задаем стиль метки - иконки будут красного цвета, и
            // их изображения будут растягиваться под контент.
            points.options.set('preset', 'islands#redStretchyIcon');
            // Задаем контент меток в начальной и конечной точках.
            points.get(0).properties.set('iconContent', 'Точка отправления');
            points.get(lastPoint).properties.set('iconContent', 'Точка прибытия');

            // Проанализируем маршрут по сегментам.
            // Сегмент - участок маршрута, который нужно проехать до следующего
            // изменения направления движения.
            // Для того, чтобы получить сегменты маршрута, сначала необходимо получить
            // отдельно каждый путь маршрута.
            // Весь маршрут делится на два пути:
            // 1) от улицы Крылатские холмы до станции "Кунцевская";
            // 2) от станции "Кунцевская" до "Пионерская".

            var way,
                segments,
                path=['Трогаемся'];
            // Получаем массив путей.
            for (var i = 0; i < route.getPaths().getLength(); i++) {
                way = route.getPaths().get(i);
                segments = way.getSegments();
                for (var j = 0; j < segments.length; j++) {
                    var street = segments[j].getStreet();
                    path.push('Едем ' + segments[j].getHumanAction() +
                        (street ? ' на ' + street : '') +
                        ', проезжаем ' + segments[j].getLength() + ' м.,'
                    );
                }
            }
            path.push('Останавливаемся');
            $scope.$apply(function(){
                $scope.path = path;
            });
        }, function (error) {
            alert('Возникла ошибка: ' + error.message);
        });
    };
}

function RouteEditCtrl($scope){
    var routePoints = [
        'Москва, метро Смоленская',
        {
            // Метро Арбатская - транзитная точка (проезжать через эту точку,
            // но не останавливаться в ней).
            type: 'viaPoint',
            point: 'Москва, метро Арбатская'
        },
        // Метро "Третьяковская".
        [37.62561,55.74062]
    ];
    var startEditing=false;
    $scope.btnLabel = 'Включить редактор маршрута';
    $scope.route = function(map){
        ymaps.route(routePoints, {
            // Автоматически позиционировать карту.
            mapStateAutoApply: true
        }).then(function (route) {
                map.geoObjects.add(route);
                $scope.routeEdit = function(){
                    if (!startEditing) {
                        // Включаем редактор.
                        startEditing=!startEditing;
                        route.editor.start({ addWayPoints: true });
                        $scope.btnLabel = 'Отключить редактор маршрута';
                    } else {
                        // Выключаем редактор.
                        startEditing=!startEditing;
                        route.editor.stop();
                        $scope.btnLabel='Включить редактор маршрута';
                    }
                };
            }, function (error) {
                alert("Возникла ошибка: " + error.message);
            });
    };
}

function CalculateCostCtrl($scope){
    function DeliveryCalculator(map, finish) {
        this._map = map;
        this._start = null;
        this._route = null;
        map.events.add('click', this._onClick, this);
    }

    var ptp = DeliveryCalculator.prototype;

    ptp._onClick= function (e) {
        if (this._start) {
            this.setFinishPoint(e.get('coords'));
        } else {
            this.setStartPoint(e.get('coords'));
        }
    };

    ptp._onDragEnd = function (e) {
        this.getDirection();
    };

    ptp.getDirection = function () {
        if(this._route) {
            this._map.geoObjects.remove(this._route);
        }

        if (this._start && this._finish) {
            var self = this,
                start = this._start.geometry.getCoordinates(),
                finish = this._finish.geometry.getCoordinates();

            ymaps.geocode(start, { results: 1 })
                .then(function (geocode) {
                    var address = geocode.geoObjects.get(0) &&
                        geocode.geoObjects.get(0).properties.get('balloonContentBody') || '';

                    ymaps.route([start, finish])
                        .then(function (router) {
                            var distance = Math.round(router.getLength() / 1000),
                                message = '<span>Расстояние: ' + distance + 'км.</span><br/>' +
                                    '<span style="font-weight: bold; font-style: italic">Стоимость доставки: %sр.</span>';

                            self._route = router.getPaths();

                            self._route.options.set({ strokeWidth: 5, strokeColor: '0000ffff', opacity: 0.5 });
                            self._map.geoObjects.add(self._route);
                            self._start.properties.set('balloonContentBody', address + message.replace('%s', self.calculate(distance)));

                        });
                });
            self._map.setBounds(self._map.geoObjects.getBounds())
        }
    };

    ptp.setStartPoint = function (position) {
        if(this._start) {
            this._start.geometry.setCoordinates(position);
        }
        else {
            this._start = new ymaps.Placemark(position, { iconContent: 'А' }, { draggable: true });
            this._start.events.add('dragend', this._onDragEnd, this);
            this._map.geoObjects.add(this._start);
        }
        if (this._finish) {
            this.getDirection();
        }
    };

    ptp.setFinishPoint = function (position) {
        if(this._finish) {
            this._finish.geometry.setCoordinates(position);
        }
        else {
            this._finish = new ymaps.Placemark(position, { iconContent: 'Б' }, { draggable: true });
            this._finish.events.add('dragend', this._onDragEnd, this);
            this._map.geoObjects.add(this._finish);
        }
        if (this._start) {
            this.getDirection();
        }
    };

    ptp.calculate = function (len) {
        // Константы.
        var DELIVERY_TARIF = 20,
            MINIMUM_COST = 500;

        return Math.max(len * DELIVERY_TARIF, MINIMUM_COST);
    };

    var calculator;
    $scope.afterInit = function(map){
        calculator = new DeliveryCalculator(map, map.getCenter());
    };
    $scope.resultSelectOne = function(e){
        var results = e.get('target').getResultsArray(),
            selected = e.get('index'),
            point = results[selected].geometry.getCoordinates();

        calculator.setStartPoint(point);
    };
    $scope.resultSelectTwo = function(e){
        var results = e.get('target').getResultsArray(),
            selected = e.get('index'),
            point = results[selected].geometry.getCoordinates();

        calculator.setFinishPoint(point);
    };

    $scope.loadOne=function(event){
        if (!event.get('skip') && event.get('target').getResultsCount()) {
            event.get('target').showResult(0);
        }
    };
    $scope.loadTwo=function(event){
        if (!event.get('skip') && event.get('target').getResultsCount()) {
            event.get('target').showResult(0);
        }
    };
}

function PerformanceTestCtrl($scope){
    $scope.count = 500;
    $scope.results = [];
    $scope.center = [37.611619,55.819543];
    var start, end;
    function getRandomCoordinates () {
        return [
            $scope.center[0] + 5.5 * Math.random() * Math.random() * (
                Math.random() < 0.5 ? -1 : 1),
            $scope.center[1] + 5.5 * Math.random() * Math.random() * (
                Math.random() < 0.5 ? -1 : 1)
        ];
    }
    function getRandomGeoObjects (count){
        var result = [];
        for (var i = 0; i < count; i++) {
            result.push({
                geometry:{
                    type:'Point',
                    coordinates:getRandomCoordinates()
                }
            });
        }
        return result;
    }
    $scope.run = function(){
        var geos = getRandomGeoObjects($scope.count);
        start = new Date();
        $scope.geoObjects = geos;
    };
    $scope.test = function(last){
        if(last){
            end=new Date();
            var dur = end.getTime() - start.getTime();
            $scope.results.push({
                count:$scope.count,
                duration: dur,
                forOne:dur/$scope.count
            });
        }
    };
}
