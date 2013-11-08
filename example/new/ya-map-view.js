"use strict";
angular.module('yaMap',[]).
    constant('GEOMETRY_TYPES', {
        POINT:'Point',
        LINESTRING:'LineString',
        RECTANGLE: 'Rectangle',
        POLYGON: 'Polygon',
        CIRCLE: 'Circle'
    }).

    value('yaMapEvents',{
        geoObject:[
            'balloonclose',
            'balloonopen',
            'beforedrag',
            'click',
            'contextmenu',
            'dblclick',
            'drag',
            'dragend',
            'dragstart',
            'editorstatechange',
            'geometrychange',
            'mapchange',
            'mousedown',
            'mouseenter',
            'mouseleave',
            'mousemove',
            'mouseup',
            'multitouchend',
            'multitouchmove',
            'multitouchstart',
            'optionschange',
            'overlaychange',
            'parentchange',
            'pixelgeometrychange',
            'propertieschange',
            'wheel'
        ],
        geoObjectCollections:[
            'add',
            'boundschange',
            'click',
            'contextmenu',
            'dblclick',
            'geometrychange',
            'mapchange',
            'mousedown',
            'mouseenter',
            'mouseleave',
            'mousemove',
            'mouseup',
            'multitouchend',
            'multitouchmove',
            'multitouchstart',
            'optionschange',
            'overlaychange',
            'parentchange',
            'pixelboundschange',
            'pixelgeometrychange',
            'propertieschange',
            'remove',
            'wheel'
        ],
        clusterCollections:[
            'add',
            'objectsaddtomap',
            'remove'
        ],
        /*control:[
            'click',
            'deselect',
            'disable',
            'enable',
            'mapchange',
            'optionschange',
            'parentchange',
            'select'
        ],*/
        map:[
            'actionbegin',
            'actionbreak',
            'actionend',
            'actiontick',
            'actiontickcomplete',
            'balloonclose',
            'balloonopen',
            'boundschange',
            'click',
            'contextmenu',
            'dblclick',
            'destroy',
            'hinthide',
            'hintshow',
            'mousedown',
            'mouseenter',
            'mouseleave',
            'mousemove',
            'mouseup',
            'multitouchend',
            'multitouchmove',
            'multitouchstart',
            'optionschange',
            'sizechange',
            'typechange',
            'wheel'
        ]
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
                /*//возможность перетаскивания мышью
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
                strokeStyle: 'shortdash'*/
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

    service('yaSubscriber',function(){
        var subscribeEvent = function(eventName, attrName, obj,scope){
            obj.events.add(eventName,function(event){
                setTimeout(function(){
                    scope.$apply(function(){
                        scope[attrName]({$event:event});
                    });
                });
            });
        };
        var getAttributeName = function(eventName){
            return 'ya' + eventName[0].toUpperCase() + eventName.substring(1);
        };
        this.subscribeEvents = function(obj, attrs, scope, events){
            var eventName, attrName;
            for (var i = 0, ii = events.length; i < ii; i++) {
                eventName = events[i];
                attrName = getAttributeName(eventName);
                if(angular.isDefined(attrs[attrName])){
                    subscribeEvent(eventName,attrName,obj,scope);
                }
            }
        };
        this.addEventProperty = function(directiveObj, events){
            for (var i = 0, ii = events.length;i < ii;i++) {
                directiveObj.scope[getAttributeName(events[i])]='&';
            }
        };
    }).

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
    directive('yaMap',['$compile','mapApiLoad','yaMapSettings','$window','yaSubscriber','yaMapEvents',function($compile, mapApiLoad,yaMapSettings,$window,yaSubscriber,yaMapEvents){
        var directiveObject = {
            restrict:'E',
            scope: {
                center:'@',
                type:'@',
                beforeInit:'&',
                afterInit:'&'
            },
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
                        scope.beforeInit();
                        var options = attrs.options ? scope.$eval(attrs.options) : undefined;
                        if(options && options.projection){
                            options.projection = new ymaps.projection[options.projection.type](options.projection.bounds);
                        }
                        scope.map = new ymaps.Map(element[0],{
                            center: center,
                            zoom:zoom,
                            type:attrs.type || 'yandex#map',
                            behaviors:behaviors
                        }, options);
                        yaSubscriber.subscribeEvents(scope.map, attrs,scope,yaMapEvents.map);
                        scope.afterInit({$map:scope.map});
                        element.append(childNodes);
                        setTimeout(function(){
                            scope.$apply(function() {
                                $compile(childNodes)(scope.$parent);
                            });
                        });
                    };

                    scope.$watch('center',function(newValue){
                        center = getEvalOrValue(newValue);
                        setCenter(function(){
                            scope.map.setCenter(center);
                        });
                    });
                    scope.$watch('type',function(newValue){
                        if(newValue){
                            scope.map.setType(newValue);
                        }
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
        yaSubscriber.addEventProperty(directiveObject,yaMapEvents.map);
        return directiveObject;
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
                var params = attrs.params ? scope.$eval(attrs.params) : undefined;
                if(params){
                    var className = attrs.name[0].toUpperCase() + attrs.name.substring(1);
                    var control = new ymaps.control[className](params);
                    mapControls.add(control,options);
                }else{
                    mapControls.add(attrs.name, options);
                }
            }
        }
    }]).

    controller('GeoObjectsCtrl',['$scope',function($scope){
        this.add = function(geoObject){
            $scope.collection.add(geoObject);
        };
        this.remove = function(geoObject){
            $scope.collection.remove(geoObject);
        };
    }]).
    directive('geoObjects',['$compile','yaMapSettings','$timeout','yaMapEvents','yaSubscriber',
        function($compile,yaMapSettings,$timeout,yaMapEvents,yaSubscriber){
        var directiveObject = {
            require:'^yaMap',
            restrict:'E',
            scope:{},
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
                    /*var isCluster = angular.isDefined(attrs.isCluster) && attrs.isCluster!='false';
                    if(isCluster){
                        scope.cluster = new ymaps.Clusterer(collectionOptions);
                        yaSubscriber.subscribeEvents(scope.cluster, attrs, scope, yaMapEvents.clusterCollections);
                        yaMap.addCollection(scope.cluster);
                    }*/

                    scope.collection = new ymaps.GeoObjectCollection({},collectionOptions);
                    yaSubscriber.subscribeEvents(scope.collection, attrs,scope,yaMapEvents.geoObjectCollections);
                    yaMap.addCollection(scope.collection);
                    element.append(childNodes);
                    $compile(childNodes)(scope.$parent);
                };
            },
            controller:'GeoObjectsCtrl'
        };
        yaSubscriber.addEventProperty(directiveObject,yaMapEvents.geoObjectCollections);
        return directiveObject;
    }]).

    controller('MapClusterCtrl',['$scope',function($scope){
        this.add = function(geoObject){
            $scope.cluster.add(geoObject);
        };
        this.remove = function(geoObject){
            $scope.cluster.remove(geoObject);
        };
    }]).
    directive('mapCluster',['yaMapSettings','yaSubscriber','yaMapEvents','$compile',function(yaMapSettings,yaSubscriber,yaMapEvents,$compile){
        var directiveObject = {
            require:'^yaMap',
            restrict:'E',
            scope:{},
            compile:function(tElement){
                var childNodes = tElement.contents();
                tElement.html('');
                return function(scope, element,attrs,yaMap) {
                    var options = attrs.options ? scope.$eval(attrs.options) : {};
                    var settingOptions = yaMapSettings.displayOptions && yaMapSettings.displayOptions.general
                        ? yaMapSettings.displayOptions.general : {};
                    var collectionOptions = angular.extend({}, settingOptions, options);

                    //включение кластеризации
                    scope.cluster = new ymaps.Clusterer(collectionOptions);
                    yaSubscriber.subscribeEvents(scope.cluster, attrs, scope, yaMapEvents.clusterCollections);
                    yaMap.addCollection(scope.cluster);
                    element.append(childNodes);
                    $compile(childNodes)(scope.$parent);
                };
            },
            controller:'MapClusterCtrl'
        };
        yaSubscriber.addEventProperty(directiveObject,yaMapEvents.geoObjectCollections);
        return directiveObject;
    }]).

    directive('mapMarker',['yaSubscriber','yaMapEvents',function(yaSubscriber,yaMapEvents){
        var directiveObject = {
            require:'^mapCluster',
            restrict:'E',
            scope:{
                source:'=',
                showBalloon:'=yaShowBalloon'
            },
            link:function(scope,elm,attrs,mapCluster){
                var obj;
                var options = attrs.options ? scope.$eval(attrs.options) : undefined;
                var createGeoObject = function(from, options){
                    obj = new  ymaps.GeoObject(from, options);
                    yaSubscriber.subscribeEvents(obj,attrs,scope,yaMapEvents.geoObject);
                    mapCluster.add(obj);
                    checkShowBalloon(scope.showBalloon);
                };
                scope.$watch('source',function(newValue){
                    if(newValue){
                        if(obj){
                            obj.geometry.setCoordinates(newValue.geometry.coordinates);
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
                        mapCluster.remove(obj);
                    }
                },function(){return true;});
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
                scope.$watch('showBalloon',checkShowBalloon);
                scope.$on('$destroy', function () {
                    if (obj) {
                        mapCluster.remove(obj);
                    }
                });
            }
        };
        yaSubscriber.addEventProperty(directiveObject, yaMapEvents.geoObject);

        return directiveObject;
    }]).

    directive('geoObject',['GEOMETRY_TYPES','yaMapEvents','yaSubscriber',function(GEOMETRY_TYPES, yaMapEvents,yaSubscriber){
        var directiveObject = {
            require:'^geoObjects',
            restrict:'E',
            scope:{
                source:'=',
                editor:'=editorMenuManager',
                showBalloon:'=yaShowBalloon'
            },
            link:function(scope,elm,attrs,geoObjects){
                var obj;
                var options = attrs.options ? scope.$eval(attrs.options) : undefined;
                if(scope.editor){
                    if(!options){
                        options={};
                    }
                    options.editorMenuManager = scope.editor;
                    //console.log(scope.editor);
                }
                var createGeoObject = function(from, options){
                    obj = new ymaps.GeoObject(from, options);
                    yaSubscriber.subscribeEvents(obj,attrs,scope,yaMapEvents.geoObject);
                    geoObjects.add(obj);
                    checkEditing(attrs.yaEdit);
                    checkDrawing(attrs.yaDraw);
                    checkShowBalloon(scope.showBalloon);
                };
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
                            createGeoObject(newValue,options);
                        }
                    }else{
                        geoObjects.remove(obj);
                    }
                },function(){return true;});
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
                scope.$watch('showBalloon',checkShowBalloon);
                scope.$on('$destroy', function () {
                    if (obj) {
                        geoObjects.remove(obj);
                    }
                });
            }
        };
        yaSubscriber.addEventProperty(directiveObject, yaMapEvents.geoObject);

        return directiveObject;
    }]).
    directive('hotspotLayer',[function(){
        return {
            restrict:'E',
            require:'^yaMap',
            link:function(scope,elm,attrs,yaMap){
                if(!attrs.urlTemplate){
                    throw new Error('not exists required attribute "url-template"');
                }
                if(!attrs.keyTemplate){
                    throw new Error('not exists required attribute "key-template"');
                }
                var options = attrs.options ? scope.$eval(attrs.options) : undefined;
                yaMap.addHotspotLayer(attrs.urlTemplate, attrs.keyTemplate, options);
            }
        }
    }]).
    directive('imageLayer',[function(){
        return {
            restrict:'E',
            require:'^yaMap',
            link:function(scope,elm,attrs,yaMap){
                if(!attrs.urlTemplate){
                    throw new Error('not exists required attribute "url-template"');
                }
                var options = attrs.options ? scope.$eval(attrs.options) : undefined;
                yaMap.addImageLayer(attrs.urlTemplate, options);
            }
        }
    }]);
