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
        order:'longlat'
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
        });
    }]).
    directive('yaMap',['$compile','$q','mapApiLoad',function($compile,$q, mapApiLoad){
        return {
            restrict:'E',
            scope: true,
            compile: function(tElement) {
                var childNodes = tElement.contents();
                tElement.html('');
                return function(scope, element,attrs,ctrl) {
                    var center = scope.$eval(attrs.center),
                        zoom = Number(attrs.zoom);
                    mapApiLoad(function(){
                        scope.map = new ymaps.Map(element[0],{
                            center: center,
                            zoom:zoom
                        });
                        element.append(childNodes);
                        scope.$apply(function() {
                            $compile(childNodes)(scope.$parent);
                        });
                    });
                };
            },
            controller: 'YaMapCtrl'
        };
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
                   /* mapApiLoad(function(){

                    });*/
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