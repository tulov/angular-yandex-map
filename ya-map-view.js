/**
 * Created by владелец on 05.11.13.
 */
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
                    var center = attrs.center ? scope.$eval(attrs.center) : null,
                        zoom = Number(attrs.zoom),
                        behaviors = attrs.behaviors ? attrs.behaviors.split(' ') : ['default'];
                    zoom = zoom <0 ? 0 : zoom;
                    zoom = zoom>23 ? 23 : zoom;
                    var setCenter = function(){
                        if(!center){
                            //устанавливаем в качестве центра местоположение пользователя
                            mapApiLoad(function(){
                                if(yaMapSettings.order==='longlat'){
                                    center =  [ymaps.geolocation.longitude, ymaps.geolocation.latitude];
                                }else{
                                    center =  [ymaps.geolocation.latitude, ymaps.geolocation.longitude];
                                }
                                mapInit();
                            });
                        }else if(angular.isArray(center)){
                            mapApiLoad(mapInit);
                        }else if(angular.isString(center)){
                            //проводим обратное геокодирование
                            mapApiLoad(function(){
                                ymaps.geocode(center, { results: 1 }).then(function (res) {
                                    var firstGeoObject = res.geoObjects.get(0);
                                    center = firstGeoObject.geometry.getCoordinates();
                                    mapInit();
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

                    setCenter();
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

    controller('GeoObjectsCtrl',['$scope','mapApiLoad',function($scope,mapApiLoad){
        this.add = function(geoObject){
            $scope.collection.add(geoObject);
        };
        this.remove = function(geoObject){
            $scope.collection.remove(geoObject);
        };
    }]).
    directive('geoObjects',['$compile','mapApiLoad',function($compile,mapApiLoad){
        return {
            require:'^yaMap',
            restrict:'E',
            scope:true,
            compile:function(tElement){
                var childNodes = tElement.contents();
                tElement.html('');
                return function(scope, element,attrs,yaMap) {
                    scope.collection = new ymaps.GeoObjectCollection();
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
                scope.$watch('source',function(newValue){
                    if(newValue){
                        if(obj){
                            obj.geometry.setCoordinates(newValue.geometry.coordinates);
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
                            obj = new ymaps.GeoObject(newValue);
                            geoObjects.add(obj);
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