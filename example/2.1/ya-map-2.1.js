"use strict";
angular.module('yaMap',[]).
    constant('GEOMETRY_TYPES', {
        POINT:'Point',
        LINESTRING:'LineString',
        RECTANGLE: 'Rectangle',
        POLYGON: 'Polygon',
        CIRCLE: 'Circle'
    }).

    provider('yaMapSettings',function yaMapSettingsProvider(){
        var options = {
            version:'2.1',
            lang:'ru_RU',
            order:'longlat'
        };
        this.setLanguage=function(lang){
            options.lang=lang;
            return this;
        };
        this.setOrder=function(order){
            options.order = order;
            return this;
        };
        this.$get=[function(){
            return options;
        }];
    }).

    factory('mapApiLoad',['yaMapSettings',function(yaMapSettings){
        var loaded = false;
        var callbacks = [];
        var runCallbacks = function(){
            var callback;
            while(callbacks.length){
                callback = callbacks.splice(0,1);
                callback[0]();
            }
        };
        var loadUrl = '//api-maps.yandex.ru/'+yaMapSettings.version+'/?load=package.full&lang=' +
            yaMapSettings.lang +'&coordorder=' +yaMapSettings.order;
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
                        callback();
                    }
                };
            } else { // Другие броузеры
                script.onload = function(){
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
            }else if(!_loading){
                loadScript(loadUrl, function(){
                    ymaps.ready(function(){
                        loaded=true;
                        runCallbacks();
                    });
                });
            }
        };
    }]).

    service('yaLayer',[function(){
        this.create = function(tileZoomFn, options){
            return new ymaps.Layer(tileZoomFn, options);
        };
    }]).

    service('yaMapType',[function(){
        this.create = function(name, layers){
            return new ymaps.MapType(name,layers);
        };
    }]).

    service('layerStorage',['mapApiLoad',function(mapApiLoad){
        this.get = function(callback){
            if(this._storage){
                callback(this._storage);
            }else{
                var self = this;
                mapApiLoad(function(){
                    self._storage = ymaps.layer.storage;
                    callback(self._storage);
                });
            }
        };
    }]).

    service('mapTypeStorage',['mapApiLoad',function(mapApiLoad){
        this.get = function(callback){
            if(this._storage){
                callback(this._storage);
            }else{
                var self = this;
                mapApiLoad(function(){
                    self._storage = ymaps.mapType.storage;
                    callback(self._storage);
                });
            }
        };
    }]).

    service('yaSubscriber',function(){
        var eventPattern = /^yaEvent(\w*)?([A-Z]{1}[a-z]+)$/;
        this.subscribe = function(target, parentGet, attrName, scope){
            var res = eventPattern.exec(attrName);
            var eventName = res[2].toLowerCase();
            var propertyName = res[1] ? (res[1][1].toLowerCase()+res[1].substring(1)) : undefined;
            scope[attrName]=function(locals){
                return parentGet(scope.$parent || scope, locals);
            };
            var events = propertyName ? target[propertyName].events : target.events;
            events.add(eventName,function(event){
                setTimeout(function(){
                    scope.$apply(function(){
                        scope[attrName]({
                            $event:event
                        });
                    });
                });
            });
        };
    }).
    service('templateLayoutFactory',['mapApiLoad',function(mapApiLoad){
        this._cache = {};
        this.get=function(key){
            return this._cache[key] || key;
        };
        this.create = function(key, template, overadice){
            if(this._cache[key]){
                return;
            }
            var self=this;
            mapApiLoad(function(){
                self._cache[key] = ymaps.templateLayoutFactory.createClass(template,overadice);
            });
        };
    }]).

    directive('yaTemplateLayout',['templateLayoutFactory',function(templateLayoutFactory){
        return{
            restrict:'E',
            priority:1001,
            scope:{
                overrides:'=yaOverrides'
            },
            compile: function(tElement) {
                var html = tElement.html();
                tElement.children().remove();
                return function(scope,elm,attrs){
                    if(!attrs.yaKey){
                        throw new Error('not require attribute "key"');
                    }
                    var key = attrs.yaKey;
                    templateLayoutFactory.create(key, html, scope.overrides);
                };
            }
        };
    }]).

    controller('YaMapCtrl',['$scope','mapApiLoad',function($scope,mapApiLoad){
        var self = this;
        mapApiLoad(function(){
            self.addGeoObjects = function(obj){
                $scope.map.geoObjects.add(obj);
            };
            self.removeGeoObjects = function(obj){
                $scope.map.geoObjects.remove(obj);
            };

            self.addControl = function(name, options){
                $scope.map.controls.add(name,options);
            };
            self.getMap = function(){
                return $scope.map;
            };
            self.addImageLayer = function(urlTemplate, options){
                var imgLayer = new ymaps.Layer(urlTemplate, options);
                $scope.map.layers.add(imgLayer);
            };
            self.addHotspotLayer = function(urlTemplate, keyTemplate, options){
                // Создадим источник данных слоя активных областей.
                var objSource = new ymaps.hotspot.ObjectSource(urlTemplate,keyTemplate);
                var hotspotLayer = new ymaps.hotspot.Layer(objSource, options);
                $scope.map.layers.add(hotspotLayer);
            };
        });
    }]).
    directive('yaMap',['$compile','mapApiLoad','yaMapSettings','$window','yaSubscriber','$parse','$q','$timeout',function($compile, mapApiLoad,yaMapSettings,$window,yaSubscriber,$parse,$q,$timeout){
        return {
            restrict:'E',
            scope: {
                yaCenter:'@',
                yaType:'@',
                yaBeforeInit:'&',
                yaAfterInit:'&'
            },
            compile: function(tElement) {
                var childNodes = tElement.children(),
                    centerCoordinatesDeferred = null;
                tElement.children().remove();
                return function(scope, element,attrs) {
                    var getEvalOrValue = function(value){
                        try{
                            return scope.$eval(value);
                        }catch(e){
                            return value;
                        }
                    };
                    var getCenterCoordinates = function(center){
                        if(centerCoordinatesDeferred)
                            centerCoordinatesDeferred.reject();
                        centerCoordinatesDeferred = $q.defer();
                        if(!center){
                            //устанавливаем в качестве центра местоположение пользователя
                            mapApiLoad(function(){
                                ymaps.geolocation.get({
                                    // Выставляем опцию для определения положения по ip
                                    provider: 'yandex'//,
                                    // Карта автоматически отцентрируется по положению пользователя.
                                    //mapStateAutoApply: true
                                }).then(function (result) {
                                    $timeout(function(){
                                        centerCoordinatesDeferred.resolve(result.geoObjects.position);
                                    });
                                });
                            });
                        }else if(angular.isArray(center)){
                            $timeout(function(){
                                centerCoordinatesDeferred.resolve(center);
                            });
                        }else if(angular.isString(center)){
                            //проводим обратное геокодирование
                            mapApiLoad(function(){
                                ymaps.geocode(center, { results: 1 }).then(function (res) {
                                    var firstGeoObject = res.geoObjects.get(0);
                                    scope.$apply(function(){
                                        centerCoordinatesDeferred.resolve(firstGeoObject.geometry.getCoordinates());
                                    });
                                }, function (err) {
                                    scope.$apply(function(){
                                        centerCoordinatesDeferred.reject(err);
                                    });
                                });
                            });
                        }
                        return centerCoordinatesDeferred.promise;
                    };
                    var zoom = Number(attrs.yaZoom),
                        behaviors = attrs.yaBehaviors ? attrs.yaBehaviors.split(' ') : ['default'];
                    var controls = ['default'];
                    if(attrs.yaControls){
                        controls=attrs.yaControls.split(' ');
                    }else if(angular.isDefined(attrs.yaControls)){
                        controls=[];
                    }
                    var disableBehaviors=[], enableBehaviors=[], behavior;
                    for (var i = 0, ii = behaviors.length; i < ii; i++) {
                        behavior = behaviors[i];
                        if(behavior[0]==='-'){
                            disableBehaviors.push(behavior.substring(1));
                        }else{
                            enableBehaviors.push(behavior);
                        }
                    }

                    if(zoom<0){
                        zoom=0;
                    }else if(zoom>23){
                        zoom=23;
                    }

                    var mapPromise;
                    var mapInit = function(center){
                        var deferred = $q.defer();
                        mapApiLoad(function(){
                            scope.yaBeforeInit();
                            var options = attrs.yaOptions ? scope.$eval(attrs.yaOptions) : undefined;
                            if(options && options.projection){
                                options.projection = new ymaps.projection[options.projection.type](options.projection.bounds);
                            }
                            scope.map = new ymaps.Map(element[0],{
                                center: center,
                                zoom:zoom,
                                controls:controls,
                                type:attrs.yaType || 'yandex#map',
                                behaviors:enableBehaviors
                            }, options);
                            scope.map.behaviors.disable(disableBehaviors);
                            //подписка на события
                            for(var key in attrs){
                                if(key.indexOf('yaEvent')===0){
                                    var parentGet=$parse(attrs[key]);
                                    yaSubscriber.subscribe(scope.map, parentGet,key,scope);
                                }
                            }
                            deferred.resolve(scope.map);
                            scope.yaAfterInit({$target:scope.map});
                            element.append(childNodes);
                            setTimeout(function(){
                                scope.$apply(function() {
                                    $compile(element.children())(scope.$parent);
                                });
                            });
                        });
                        return deferred.promise;
                    };

                    scope.$watch('yaCenter',function(newValue){
                        var center = getEvalOrValue(newValue);
                        getCenterCoordinates(center).then(
                            function(coords){
                                if(!mapPromise){
                                    mapPromise = mapInit(coords);
                                    var isInit = true;
                                }
                                mapPromise.then(
                                    function(map){
                                        if(!isInit){
                                            map.setCenter(coords);
                                        }
                                    }
                                );
                            }
                        );
                        /*if(_center){
                            setCenter(function(){
                                scope.map.setCenter(_center);
                            });
                        }*/
                    });
                    scope.$watch('yaType',function(newValue){
                        if(newValue && mapPromise){
                            mapPromise.then(
                                function(map){
                                    map.setType(newValue);
                                }
                            );
                        }
                    });

                    scope.$on('$destroy',function(){
                        if(scope.map){
                            scope.map.destroy();
                        }
                    });
                };
            },
            controller: 'YaMapCtrl'
        };
    }]).

    directive('yaControl',['yaSubscriber','templateLayoutFactory','$parse',function(yaSubscriber,templateLayoutFactory,$parse){
        return {
            restrict:'E',
            require:'^yaMap',
            scope:{
                yaAfterInit:'&'
            },
            link:function(scope,elm,attrs,yaMap){
                var className = attrs.yaType[0].toUpperCase() + attrs.yaType.substring(1);
                var getEvalOrValue = function(value){
                    try{
                        return scope.$eval(value);
                    }catch(e){
                        return value;
                    }
                };
                var params = getEvalOrValue(attrs.yaParams);
                var options = attrs.yaOptions ? scope.$eval(attrs.yaOptions) : undefined;
                if(options && options.layout){
                    options.layout = templateLayoutFactory.get(options.layout);
                }
                if(options && options.itemLayout){
                    options.itemLayout = templateLayoutFactory.get(options.itemLayout);
                }
                if(params && params.items){
                    var items = [];
                    var item;
                    for (var i = 0, ii = params.items.length; i < ii; i++) {
                        item = params.items[i];
                        items.push(new ymaps.control.ListBoxItem(item));
                    }
                    params.items=items;
                }
                var obj = new ymaps.control[className](params);
                for(var key in options){
                    if(options.hasOwnProperty(key)){
                        obj.options.set(key,options[key]);
                    }
                }
                //подписка на события
                for(key in attrs){
                    if(key.indexOf('yaEvent')===0){
                        var parentGet=$parse(attrs[key]);
                        yaSubscriber.subscribe(obj, parentGet,key,scope);
                    }
                }
                yaMap.addControl(obj, options);
                scope.yaAfterInit({$target:obj});
            }
        };
    }]).

    controller('CollectionCtrl',['$scope',function($scope){
        this.addGeoObjects = function(geoObject){
            $scope.collection.add(geoObject);
        };
        this.removeGeoObjects = function(geoObject){
            $scope.collection.remove(geoObject);
        };
    }]).
    directive('yaCollection',['$compile','yaMapSettings','$timeout','yaSubscriber','$parse',
        function($compile,yaMapSettings,$timeout,yaSubscriber,$parse){
        return {
            require:'^yaMap',
            restrict:'E',
            scope:{
                yaAfterInit:'&'
            },
            compile:function(tElement){
                var childNodes = tElement.contents();
                tElement.children().remove();
                return function(scope, element,attrs,yaMap) {
                    var options = attrs.yaOptions ? scope.$eval(attrs.yaOptions) : {};

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
                    scope.collection = new ymaps.GeoObjectCollection({},options);
                    //подписка на события
                    for(var key in attrs){
                        if(key.indexOf('yaEvent')===0){
                            var parentGet=$parse(attrs[key]);
                            yaSubscriber.subscribe(scope.collection, parentGet,key,scope);
                        }
                    }

                    yaMap.addGeoObjects(scope.collection);
                    scope.yaAfterInit({$target:scope.collection});
                    scope.$on('$destroy', function () {
                        if (scope.collection) {
                            yaMap.removeGeoObjects(scope.collection);
                        }
                    });
                    element.append(childNodes);
                    $compile(element.children())(scope.$parent);
                };
            },
            controller:'CollectionCtrl'
        };
    }]).

    directive('yaCluster',['yaMapSettings','yaSubscriber','$compile','templateLayoutFactory','$parse',function(yaMapSettings,yaSubscriber,$compile,templateLayoutFactory,$parse){
        return {
            require:'^yaMap',
            restrict:'E',
            scope:{
                yaAfterInit:'&'
            },
            compile:function(tElement){
                var childNodes = tElement.contents();
                tElement.children().remove();
                return function(scope, element,attrs,yaMap) {
                    var collectionOptions = attrs.yaOptions ? scope.$eval(attrs.yaOptions) : {};
                    if(collectionOptions && collectionOptions.clusterBalloonItemContentLayout){
                        collectionOptions.clusterBalloonItemContentLayout =
                            templateLayoutFactory.get(collectionOptions.clusterBalloonItemContentLayout);
                    }
                    if(collectionOptions && collectionOptions.clusterBalloonContentLayout){
                        collectionOptions.clusterBalloonContentLayout =
                            templateLayoutFactory.get(collectionOptions.clusterBalloonContentLayout);
                    }
                    //включение кластеризации
                    scope.collection = new ymaps.Clusterer(collectionOptions);
                    //подписка на события
                    for(var key in attrs){
                        if(key.indexOf('yaEvent')===0){
                            var parentGet=$parse(attrs[key]);
                            yaSubscriber.subscribe(scope.collection, parentGet,key,scope);
                        }
                    }

                    yaMap.addGeoObjects(scope.collection);
                    scope.yaAfterInit({$target:scope.collection});
                    scope.$on('$destroy', function () {
                        if (scope.collection) {
                            yaMap.removeGeoObjects(scope.collection);
                        }
                    });
                    element.append(childNodes);
                    $compile(element.children())(scope.$parent);
                };
            },
            controller:'CollectionCtrl'
        };
    }]).

    directive('yaGeoObject',['GEOMETRY_TYPES','yaSubscriber','templateLayoutFactory','$parse',function(GEOMETRY_TYPES,yaSubscriber,templateLayoutFactory,$parse){
        return {
            restrict:'E',
            require:['^yaMap','?^yaCollection','?^yaCluster'],
            scope:{
                yaSource:'=',
                yaShowBalloon:'=',
                yaAfterInit:'&'
            },
            link:function(scope,elm,attrs,ctrls){
                var ctrl = ctrls[2] || ctrls[1] || ctrls[0],
                    obj;
                var options = attrs.yaOptions ? scope.$eval(attrs.yaOptions) : undefined;
                if(options && options.balloonContentLayout){
                    options.balloonContentLayout = templateLayoutFactory.get(options.balloonContentLayout);
                }
                if(options && options.iconLayout){
                    options.iconLayout = templateLayoutFactory.get(options.iconLayout);
                }
                var createGeoObject = function(from, options){
                    obj = new ymaps.GeoObject(from, options);
                    //подписка на события
                    for(var key in attrs){
                        if(key.indexOf('yaEvent')===0){
                            var parentGet=$parse(attrs[key]);
                            yaSubscriber.subscribe(obj, parentGet,key,scope);
                        }
                    }
                    ctrl.addGeoObjects(obj);
                    scope.yaAfterInit({$target:obj});
                    checkEditing(attrs.yaEdit);
                    checkDrawing(attrs.yaDraw);
                    checkShowBalloon(scope.yaShowBalloon);
                };
                scope.$watch('yaSource',function(newValue){
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
                            createGeoObject(newValue,options);
                        }
                    }else if(obj){
                        ctrl.removeGeoObjects(obj);
                    }
                },angular.equals);
                var checkEditing = function(editAttr){
                    if(angular.isDefined(editAttr) && editAttr!=='false'){
                        if(obj){
                            obj.editor.startEditing()
                        }
                    }else if(angular.isDefined(editAttr)){
                        if(obj){
                            obj.editor.stopEditing();
                        }
                    }
                };
                var checkDrawing = function(drawAttr){
                    if(angular.isDefined(drawAttr) && drawAttr!=='false'){
                        if(obj){
                            obj.editor.startDrawing()
                        }
                    }else if(angular.isDefined(drawAttr)){
                        if(obj){
                            obj.editor.stopDrawing();
                        }
                    }
                };
                var checkShowBalloon = function(newValue){
                    if(newValue){
                        if(obj){
                            obj.balloon.open();
                        }
                    }else{
                        if(obj){
                            obj.balloon.close();
                        }
                    }
                };
                attrs.$observe('yaEdit',checkEditing);
                attrs.$observe('yaDraw',checkDrawing);
                scope.$watch('yaShowBalloon',checkShowBalloon);
                scope.$on('$destroy', function () {
                    if (obj) {
                        ctrl.removeGeoObjects(obj);
                    }
                });
            }
        };
    }]).

    directive('yaHotspotLayer',[function(){
        return {
            restrict:'E',
            require:'^yaMap',
            link:function(scope,elm,attrs,yaMap){
                if(!attrs.yaUrlTemplate){
                    throw new Error('not exists required attribute "url-template"');
                }
                if(!attrs.yaKeyTemplate){
                    throw new Error('not exists required attribute "key-template"');
                }
                var options = attrs.yaOptions ? scope.$eval(attrs.yaOptions) : undefined;
                yaMap.addHotspotLayer(attrs.yaUrlTemplate, attrs.yaKeyTemplate, options);
            }
        }
    }]).

    directive('yaImageLayer',[function(){
        return {
            restrict:'E',
            require:'^yaMap',
            link:function(scope,elm,attrs,yaMap){
                if(!attrs.yaUrlTemplate){
                    throw new Error('not exists required attribute "url-template"');
                }
                var options = attrs.yaOptions ? scope.$eval(attrs.yaOptions) : undefined;
                yaMap.addImageLayer(attrs.yaUrlTemplate, options);
            }
        }
    }]).

    directive('yaDragger',['yaSubscriber','$parse','mapApiLoad',function(yaSubscriber,$parse,mapApiLoad){
        return {
            restrict:'EA',
            scope:{
                yaAfterInit:'&'
            },
            link:function(scope,elm,attrs){
                var options = attrs.yaOptions ? scope.$eval(attrs.yaOptions) : {};
                mapApiLoad(function(){
                    options.autoStartElement=elm[0];
                    var obj = new ymaps.util.Dragger(options);
                    //подписка на события
                    for(var key in attrs){
                        if(key.indexOf('yaEvent')===0){
                            var parentGet=$parse(attrs[key]);
                            yaSubscriber.subscribe(obj, parentGet,key,scope);
                        }
                    }
                    scope.yaAfterInit({$target:obj});
                });
            }
        };
    }]);
