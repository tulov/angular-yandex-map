angular.module('yaMap',[]).
    constant('GEOMETRY_TYPES', {
        POINT:'Point',
        LINESTRING:'LineString',
        RECTANGLE: 'Rectangle',
        POLYGON: 'Polygon',
        CIRCLE: 'Circle'
    }).

    value('yaMapSettings',{
        lang:'ru-RU',
        order:'longlat',
        controls:{
            zoomControl:null,
            typeSelector:null,
            mapTools:null,
            scaleLine:null,
            miniMap:null,
            smallZoomControl:{right: 5, top: 75}
        },
        //параметры отображения различных объектов на карте
        displayOptions:{
            //параметры отображения объектов в обычном состоянии
            //какие опции устанавливаются для каких фигур, смотрите в документации по API
            general:{
                //возможность перетаскивания мышью
                draggable: false,
                //ширина границы
                strokeWidth: 3,
                //цвет границы
                strokeColor: "#FFFF00",
                // Цвет и прозрачность заливки
                fillColor: '#ffff0022',
                // Иконка метки будет растягиваться под ее контент
                preset: 'twirl#pinkStretchyIcon',
                // Стиль линии
                strokeStyle: 'shortdash'
            }
        }
    }).

    factory('mapApiLoad',['yaMapSettings',function(yaMapSettings){
        var loaded = false;
        var callbacks = [];
        var runCallbacks = function(){
            loaded = true;
            var callback;
            while(callbacks.length){
                callback = callbacks.splice(0,1);
                callback[0]();
            }
        };
        var loadUrl = 'http://api-maps.yandex.ru/2.0/?load=package.full&lang=' +
            (yaMapSettings.lang || 'ru-RU') +'&coordorder=' +(yaMapSettings.order || 'longlat');
        var _loading = false;
        var loadScript = function(url, callback){
            if(_loading){
                return;
            }
            _loading=true;
            var script = document.createElement("script");
            script.type = "text/javascript";
            if (script.readyState){ // IE
                script.onreadystatechange = function(){
                    if (script.readyState=="loaded" || script.readyState=="complete"){
                        script.onreadystatechange = null;
                        _loading=false;
                        callback();
                    }
                };
            } else { // Другие броузеры
                script.onload = function(){
                    _loading=false;
                    callback();
                };
            }
            script.src = url;
            document.getElementsByTagName("head")[0].appendChild(script);
        };

        return function(callback){
            callbacks.push(callback);
            if(loaded){
                runCallbacks();
            }else{
                loadScript(loadUrl, function(){
                    ymaps.ready(function(){
                        runCallbacks();
                    });
                });
            }
        };
    }]).

    controller('YaMapCtrl',['$scope','mapApiLoad',function($scope,mapApiLoad){
        var self = this;
        mapApiLoad(function(){
            self.addCollection = function(collection){
                $scope.map.geoObjects.add(collection);
            };
            self.addControl = function(name, options){
                $scope.map.controls.add(name,options);
            };
            self.getMap = function(){
                return $scope.map;
            };
        });
    }]).
    directive('yaMap',['$compile','mapApiLoad','yaMapSettings','$window',function($compile, mapApiLoad,yaMapSettings,$window){
        return {
            restrict:'E',
            scope: true,
            compile: function(tElement) {
                var childNodes = tElement.contents();
                tElement.html('');
                return function(scope, element,attrs) {
                    var getEvalOrValue = function(value){
                        try{
                            return scope.$eval(value);
                        }catch(e){
                            return value;
                        }
                    };
                    var center = getEvalOrValue(attrs.center),
                        zoom = Number(attrs.zoom),
                        behaviors = attrs.behaviors ? attrs.behaviors.split(' ') : ['default'];
                    zoom = zoom <0 ? 0 : zoom;
                    zoom = zoom>23 ? 23 : zoom;
                    var setCenter = function(callback){
                        if(!center){
                            //устанавливаем в качестве центра местоположение пользователя
                            mapApiLoad(function(){
                                if(yaMapSettings.order==='longlat'){
                                    center =  [ymaps.geolocation.longitude, ymaps.geolocation.latitude];
                                }else{
                                    center =  [ymaps.geolocation.latitude, ymaps.geolocation.longitude];
                                }
                                if(callback){
                                    callback();
                                }
                            });
                        }else if(angular.isArray(center)){
                            mapApiLoad(callback);
                        }else if(angular.isString(center)){
                            //проводим обратное геокодирование
                            mapApiLoad(function(){
                                ymaps.geocode(center, { results: 1 }).then(function (res) {
                                    var firstGeoObject = res.geoObjects.get(0);
                                    center = firstGeoObject.geometry.getCoordinates();
                                    if(callback){
                                        callback();
                                    }
                                }, function (err) {
                                    // Если геокодирование не удалось, сообщаем об ошибке
                                    $window.alert(err.message);
                                })
                            });
                        }
                    };

                    var mapInit = function(){
                        scope.map = new ymaps.Map(element[0],{
                            center: center,
                            zoom:zoom,
                            type:attrs.type || 'yandex#map',
                            behaviors:behaviors
                        });

                        element.append(childNodes);
                        scope.$apply(function() {
                            $compile(childNodes)(scope.$parent);
                        });
                    };

                    attrs.$observe('center',function(newValue){
                        center = getEvalOrValue(newValue);

                        setCenter(function(){
                            scope.map.setCenter(center);
                        });
                    });
                    scope.$on('$destroy',function(){
                        if(scope.map){
                            scope.map.destroy();
                        }
                    });

                    setCenter(mapInit);
                };
            },
            controller: 'YaMapCtrl'
        };
    }]).

    controller('MapControlsCtrl',['$scope',function($scope){
        this.add = function(name, options){
            $scope.yaMap.addControl(name,options);
        };
    }]).
    directive('mapControls',['$compile','yaMapSettings',function($compile,yaMapSettings){
        return {
            restrict:'E',
            require:'^yaMap',
            scope:true,
            compile:function(tElement){
                var childNodes = tElement.contents();
                var hasControls = tElement.find('map-control').length > 0;
                tElement.html('');
                return function(scope, element,attrs,yaMap) {
                    scope.yaMap = yaMap;
                    if(!hasControls){
                        var controls = yaMapSettings.controls;
                        if(controls){
                            for(var key in controls){
                                yaMap.addControl(key, controls[key] || undefined);
                            }
                        }
                    }
                    element.append(childNodes);
                    $compile(childNodes)(scope.$parent);
                };
            },
            controller:'MapControlsCtrl'
        }
    }]).

    directive('mapControl',[function(){
        return{
            require:'^mapControls',
            restrict:'E',
            scope:true,
            link:function(scope,elm,attrs,mapControls){
                if(!attrs.name){
                    throw new Error('not pass attribute "name"');
                }
                var options = attrs.options ? scope.$eval(attrs.options) : undefined;
                mapControls.add(attrs.name, options);
            }
        }
    }]).

    controller('GeoObjectsCtrl',['$scope','GEOMETRY_TYPES',function($scope,GEOMETRY_TYPES){
        this.add = function(geoObject){
            if($scope.cluster && geoObject.geometry.getType()===GEOMETRY_TYPES.POINT){
                $scope.cluster.add(geoObject);
            }else{
                $scope.collection.add(geoObject);
            }
        };
        this.remove = function(geoObject){
            if($scope.cluster && geoObject.geometry.getType()===GEOMETRY_TYPES.POINT){
                $scope.cluster.remove(geoObject);
            }else{
                $scope.collection.remove(geoObject);
            }
        };
        this.changeCoordinates = function(backObj, coordinates){
            if($scope.cluster && backObj.geometry.getType()===GEOMETRY_TYPES.POINT){
                this.remove(backObj);
                return null;
            }else{
                backObj.geometry.setCoordinates(coordinates);
                return backObj;
            }
        }
    }]).
    directive('geoObjects',['$compile','yaMapSettings','$timeout',function($compile,yaMapSettings,$timeout){
        return {
            require:'^yaMap',
            restrict:'E',
            scope:true,
            compile:function(tElement){
                var childNodes = tElement.contents();
                tElement.html('');
                return function(scope, element,attrs,yaMap) {
                    var options = attrs.options ? scope.$eval(attrs.options) : {};
                    var settingOptions = yaMapSettings.displayOptions && yaMapSettings.displayOptions.general
                        ? yaMapSettings.displayOptions.general : {};
                    var collectionOptions = angular.extend({}, settingOptions, options);

                    //отобразить все элементы на карте. будет срабатывать при любом добавлении объекта на карту.
                    var showAll = angular.isDefined(attrs.showAll) && attrs.showAll!='false';
                    if(showAll){
                        var map = yaMap.getMap();
                        var timeout;
                        var addEventHandler = function(){
                            if(timeout){
                                $timeout.cancel(timeout);
                            }
                            timeout = $timeout(function(){
                                map.geoObjects.events.remove('add',addEventHandler);
                                var bounds = map.geoObjects.getBounds();
                                if(bounds){
                                    map.setBounds(bounds);
                                }
                            }, 300);
                        };
                        map.geoObjects.events.add('add',addEventHandler);
                    }
                    //включение кластеризации
                    var isCluster = angular.isDefined(attrs.isCluster) && attrs.isCluster!='false';
                    if(isCluster){
                        scope.cluster = new ymaps.Clusterer(collectionOptions);
                        yaMap.addCollection(scope.cluster);
                    }

                    scope.collection = new ymaps.GeoObjectCollection({},collectionOptions);
                    yaMap.addCollection(scope.collection);
                    element.append(childNodes);
                    $compile(childNodes)(scope.$parent);
                };
            },
            controller:'GeoObjectsCtrl'
        };
    }]).

    directive('geoObject',['GEOMETRY_TYPES',function(GEOMETRY_TYPES){
        return {
            require:'^geoObjects',
            restrict:'E',
            scope:{
                source:'='
            },
            link:function(scope,elm,attrs,geoObjects){
                var obj;
                var options = attrs.options ? scope.$eval(attrs.options) : undefined;
                var createGeoObject = function(from, options){
                    obj = new ymaps.GeoObject(from, options);
                    geoObjects.add(obj);
                };
                scope.$watch('source',function(newValue){
                    if(newValue){
                        if(obj){
                            var result = geoObjects.changeCoordinates(obj, newValue.geometry.coordinates);
                            if(result){
                                if (obj.geometry.getType() === GEOMETRY_TYPES.CIRCLE) {
                                    obj.geometry.setRadius(newValue.geometry.radius);
                                }
                                var properties = newValue.properties;
                                for(var key in properties){
                                    if(properties.hasOwnProperty(key)){
                                        obj.properties.set(key, properties[key]);
                                    }
                                }
                            }else{
                                createGeoObject(newValue,options);
                            }
                        }else{
                            createGeoObject(newValue,options);
                        }
                    }
                },function(){return true;});
                scope.$on('$destroy', function () {
                    if (obj) {
                        geoObjects.remove(obj);
                    }
                });
            }
        };
    }]);