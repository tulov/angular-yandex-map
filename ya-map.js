'use strict';

angular.module('yaMap', []).
    constant('GEOMETRY_TYPES', {
        POINT:'Point',
        LINESTRING:'LineString',
        RECTANGLE: 'Rectangle',
        POLYGON: 'Polygon',
        CIRCLE: 'Circle'
    }).
    constant('MAP_EVENTS',{
        MAPCREATED:'mapcreated',
        SELECTCHANGE:'selectchange',
        GEOMETRYCHANGE:'geometrychange',
        CLICK:'click',
        CHANGE:'change',
        REMOVEGEOOBJ:'removegeoobject',
        SELECT:'select',
        DESELECT:'deselect',
        ADDSTATECHANGE:'addstatechange',
        GEOOBJECTCREATED:'geoobjcreated',
        DRAWINGPOINTSCHANGE:'drawingPointsChange',
        DRAWINGTYPECHANGE:'drawingTypeChange',
        COUNTGEOMETRYCHANGE:'countGeometryChange'
    }).
    provider('YandexMap', function(){
		var globalOptions={},

            //возвращает параметры для карты
			getParams = function(parameters){
				return angular.extend({}, globalOptions.params, parameters);
			},

            /**
             * Возвращает параметры отображения пользовательских кнопок
             */
            getCustomButtonParams = function(key){
                var customButtons = globalOptions.customButtons || {};
                return customButtons[key] ? customButtons[key] : {};
            },

            //возвращает список элементов управления для карты
			getControls=function(controls){
				if(controls)
					return controls;
				if(globalOptions.controls)
					return globalOptions.controls;
				return null;
			},

            //типы, поддерживающие редактирование
			editingTypes=['LineString', 'Polygon'],

            //режимы
            MODES = {
                VIEW:'view',
                SELECT:'select',
                EDIT:'edit',
                ADD:'add'
            },

            //состояния добавления новых объектов на карту
            ADD_STATES = {
                NONE:'N',
                POINT:'P',
                LINESTRING:'L',
                POLYGON:'G',
                RECTANGLE:'R',
                CIRCLE:'C'
            },

			//возвращает true, если geoObj поддерживает визуальное редактирование
			hasEditor = function(geoObj){
				return editingTypes.indexOf(geoObj.geometry.getType())>-1
			},

            //возвращает опции отображения в зависимости от типа объекта и режима работы карты
			getDisplayOptions=function(geoObjectType, mode){
				var globalDisplay=globalOptions.displayOptions && globalOptions.displayOptions.general
					?globalOptions.displayOptions.general
					:{},
					modeOptions = mode === MODES.EDIT || mode === MODES.ADD ? {draggable:true} : {};
				return angular.extend(
					{},
					globalDisplay.all,
					globalDisplay[angular.lowercase(geoObjectType)],
					modeOptions
				);
			},

            //возвращает опции отображения для выбранного объекта на карте
			getSelectedObjectDisplayOptions=function(){
				return globalOptions.displayOptions && globalOptions.displayOptions.selected
					?globalOptions.displayOptions.selected
					:{};
            },

            /**
             * Возращает опции рисуемого объекта
             */
            getDrawingOptions = function(){
                return globalOptions.displayOptions && globalOptions.displayOptions.drawing
                        ?globalOptions.displayOptions.drawing
                        :{};
            },

            /**
             * В стандартной панели элементов создает кнопку для удаления выбранного элемента
             * @param EVENTS Объект с досутпными событиями
             * @param mapTools Объект стандартной панели управления
             */
            createDeleteButton  =  function(EVENTS, mapTools) {
                var myButton = new ymaps.control.Button({
                    data: getCustomButtonParams('delete')
                }, {
                    selectOnClick: false
                });
                var self = this;

                //кнопка удаления выделенного объекта
                myButton.events.add(EVENTS.CLICK, function () {
                    var index = getSelectedObjectIndex.call(self);
                    if (index === null) {
                        return;
                    }
                    self.removeGeoObject(index);
                });
                mapTools.add(myButton);
                this._customButtons.delete = myButton;
                self.on(EVENTS.SELECTCHANGE, function (eventData) {
                    if (eventData.newIndex !== null && eventData.newIndex !== undefined) {
                        myButton.enable();
                    } else {
                        myButton.disable();
                    }
                });
            },

            /**
             * возвращает состояние при добавлении элементов
             * @returns {*} член перечислимого ADD_STATES
             */
            getAddState = function(){
                return this._addState;
            },

            /**
             * Устанавливает состояние редактирования
             * @param geoObjectType тип гео объекта который будет добавляться
             */
            setAddState = function(geoObjectType, EVENTS) {
                var key = angular.uppercase(geoObjectType),
                    backValue = getAddState.call(this);
                this._addState = ADD_STATES[key] || ADD_STATES.NONE;
                if (backValue !== getAddState.call(this)) {
                    trigger.call(this, EVENTS.ADDSTATECHANGE, {newValue: getAddState.call(this), oldValue: backValue});
                }
            },

            /**
             * В стандартной панели элементов создает группу кнопок для добавления новых элементов на карту
             * @param GEOMETRY_TYPES Объект, содержащий возможные типы объектов на карте
             * @param EVENTS Объект с доступными событиями
             * @param mapTools Объект стандартной панели управления
             */
            createAddButtons=function(GEOMETRY_TYPES, EVENTS, mapTools) {
                var self = this;
                //список с возможными вариантами добавления элементов
                var rollupItems = [], button, buttonData;
                for (var prop in GEOMETRY_TYPES) {
                    if (this.isValidType(GEOMETRY_TYPES[prop])) {
                        buttonData = {
                            data: getCustomButtonParams(angular.lowercase(prop))
                        };
                        button = new ymaps.control.Button(buttonData);
                        button.geometryType = GEOMETRY_TYPES[prop];
                        rollupItems.push(button);
                        self._customButtons[GEOMETRY_TYPES[prop]] = button;
                    }
                }
                var myRollupButton = new ymaps.control.RollupButton({
                    items: rollupItems
                });

                self.on(EVENTS.COUNTGEOMETRYCHANGE, function (eventData) {
                    var method = eventData.newValue < self.getMaxCountGeometry() ? 'enable' : 'disable';
                    for (var key in self._customButtons) {
                        if (key === 'delete') {
                            continue;
                        }
                        self._customButtons[key][method]();
                    }
                });
                myRollupButton.events.add(EVENTS.SELECT, function (e) {
                    var button = e.get('item');
                    setAddState.call(self, button.geometryType, EVENTS);
                });
                myRollupButton.events.add(EVENTS.DESELECT, function (e) {
                    var button = e.get('item');
                    setAddState.call(self, null, EVENTS);
                });
                mapTools.add(myRollupButton);
            },

            /**
             * Добавляет новую точку в коллекцию точек геообъекта
             * @param point добавляемая точка в виде массива координат
             * @param EVENTS объект с доступными событиями
             */
            addDrawingPoint = function(point, EVENTS) {
                if (!angular.isArray(point)) {
                    throw new Error('point has been Array');
                }
                this._drawingPoints.push(point);
                trigger.call(this,EVENTS.DRAWINGPOINTSCHANGE);
            },

            /**
             * Возвращает массив точек нарисованной фигуры
             * @returns {Array} координаты фигуры
             */
            getDrawingPoints = function(){
                return this._drawingPoints;
            },

            /**
             * Возвращает тип рисуемой геометрии
             * @returns {*} тип рисуемой геометрии
             */
            getDrawingType = function(){
                return this._drawingType;
            },

            /**
             * Устанавливает тип рисуемой геометрии
             * @param type тип рисуемой геометрии
             */
            setDrawingType = function(type, EVENTS){
                if(this._drawingType === type){
                    return;
                }
                var backValue = getDrawingType.call(this);
                this._drawingType = type;
                trigger.call(this, EVENTS.DRAWINGTYPECHANGE, {newValue:getDrawingType.call(this), oldValue:backValue});
            },

            /**
             * Заканчивает рисование объекта
             */
            drawingEnd = function(GEOMETRY_TYPES, EVENTS){
                var type = getDrawingType.call(this),
                    coordinates = getDrawingPoints.call(this),
                    geometry = {type:type};
                if(coordinates.length===0){
                    return;
                }
                switch(type){
                    case GEOMETRY_TYPES.POINT:
                        geometry.coordinates = coordinates[0]
                        break;
                    case GEOMETRY_TYPES.POLYGON:
                        geometry.coordinates = [coordinates, []];
                        break;
                    case GEOMETRY_TYPES.CIRCLE:
                        geometry.coordinates = coordinates[0];
                        geometry.radius = ymaps.coordSystem.geo.getDistance(coordinates[0], coordinates[1]);
                        break;
                    default:
                        geometry.coordinates = coordinates;
                        break;
                }
                trigger.call(this, EVENTS.GEOOBJECTCREATED, geometry);
                this._drawingPoints = [];
                this._drawingType = null;
                if(this._drawingGeoObject){
                    this._map.geoObjects.remove(this._drawingGeoObject);
                }
                this._drawingGeoObject = null;
            },

            /**
             * Устанавливает поддержку рисования
             */
            setDrawingSupport = function(GEOMETRY_TYPES, EVENTS) {
                var self = this,
                    addGeometryClickHandler = function (e) {
                        addDrawingPoint.call(self, e.get('coordPosition'), EVENTS);
                    },
                    drawingPointsChangeHandler = function () {
                        var type = getDrawingType.call(self),
                            coordinates = getDrawingPoints.call(self);
                        if (type === GEOMETRY_TYPES.POINT) {
                            self._customButtons[type].deselect();
                        }
                        else if (type === GEOMETRY_TYPES.POLYGON || type === GEOMETRY_TYPES.LINESTRING) {
                            if (self._drawingGeoObject) {
                                self._map.geoObjects.remove(self._drawingGeoObject);
                            }
                            var drawingGeoObject = new ymaps.GeoObject({
                                geometry: {
                                    type: type,
                                    coordinates: GEOMETRY_TYPES.POLYGON === type ? [coordinates, []] : coordinates
                                }
                            }, getDrawingOptions());
                            self._map.geoObjects.add(drawingGeoObject);
                            self._drawingGeoObject = drawingGeoObject;
                        }
                        else if (type === GEOMETRY_TYPES.RECTANGLE || type === GEOMETRY_TYPES.CIRCLE) {
                            if (coordinates.length === 2) {
                                self._customButtons[type].deselect();
                            }
                        }
                    };


                var cursor;
                self.on(EVENTS.ADDSTATECHANGE, function (eventData) {
                    if (eventData.oldValue !== ADD_STATES.NONE) {
                        self._map.events.remove(EVENTS.CLICK, addGeometryClickHandler);
                        self.off(EVENTS.DRAWINGPOINTSCHANGE, drawingPointsChangeHandler);
                        drawingEnd.call(self, GEOMETRY_TYPES, EVENTS);
                    }
                    var geometryType = null;
                    switch (eventData.newValue) {
                        case ADD_STATES.NONE:
                            cursor.remove();
                            break;
                        case ADD_STATES.POINT:
                            geometryType = GEOMETRY_TYPES.POINT;
                            break;
                        case ADD_STATES.LINESTRING:
                            geometryType = GEOMETRY_TYPES.LINESTRING;
                            break;
                        case ADD_STATES.RECTANGLE:
                            geometryType = GEOMETRY_TYPES.RECTANGLE;
                            break;
                        case ADD_STATES.POLYGON:
                            geometryType = GEOMETRY_TYPES.POLYGON;
                            break;
                        case ADD_STATES.CIRCLE:
                            geometryType = GEOMETRY_TYPES.CIRCLE;
                            break;
                        default:
                            throw new Error('Not correct new value');
                    }
                    if (eventData.newValue !== ADD_STATES.NONE) {
                        cursor = self._map.cursors.push('crosshair');
                        setDrawingType.call(self, geometryType, EVENTS);
                        self._map.events.add(EVENTS.CLICK, addGeometryClickHandler);
                        self.on(EVENTS.DRAWINGPOINTSCHANGE, drawingPointsChangeHandler);
                    }
                });
            },

            /**
             * Добавляет элементы управления на карту
             * @param key - ключ элемента управления
             * @param options - опции элемента управления
             * @private
             */
            addControl = function(key, options, EVENTS, GEOMETRY_TYPES) {
                //если это стандартная панель управления, добавляем кнопки для редактирования
                if (key === 'mapTools' && this.isEditable()) {
                    var mapTools = new ymaps.control.MapTools(['default'], options);
                    createDeleteButton.call(this, EVENTS, mapTools);
                    if (this.isAddable()) {
                        createAddButtons.call(this, GEOMETRY_TYPES, EVENTS, mapTools);
                    }
                    this._map.controls.add(mapTools);
                } else {
                    this._map.controls.add(key, options);
                }
            },

            /**
             * Генерация события с передачей данных
             * @param eventName имя генерируемого события
             */
            trigger = function(eventName){
                var handlers, i, ii;
                if (this._eventHandlers && this._eventHandlers[eventName]) {
                    handlers = this._eventHandlers[eventName];
                    for (i = 0, ii = handlers.length; i < ii; i++) {
                        handlers[i].apply(this, [].slice.call(arguments, 1));
                    }
                }

                if (this._oneEventHandlers && this._oneEventHandlers[eventName]) {
                    handlers = this._oneEventHandlers[eventName];
                    for (i = 0, ii = handlers.length; i < ii; i++) {
                        handlers[i].apply(this, [].slice.call(arguments, 1));
                    }
                    this._oneEventHandlers[eventName] = [];
                }
            },

            /**
             * проверяет, можно ли создать новый объект определенного типа
             */
            possibleCreateGeoObject = function(geometryType){
                var maxCount = this.getMaxCountGeometry();
                return (maxCount === 0 || maxCount > this.getCountGeometry())
                    && this.isValidType(geometryType);
            },

            /**
             * создает гео объект на карте
             * */
            createGeoObjectOnMap = function(data, index, GEOMETRY_TYPES, EVENTS){
                if(!angular.isObject(data)){
                    throw new Error('data has been Object');
                }
                if(!data.geometry){
                    throw new Error('Not property geometry');
                }

                if(!data.geometry.type){
                    throw new Error('Not property geometry.type');
                }
                else if(data.geometry.type === GEOMETRY_TYPES.CIRCLE && !data.geometry.radius){
                    throw new Error('Not property geometry.radius');
                }

                if(!data.geometry.coordinates){
                    throw new Error('Not property geometry.coordinates');
                }
                else if(!angular.isArray(data.geometry.coordinates)){
                    throw new Error('geometry.coordinates has been Array');
                }
                if(!possibleCreateGeoObject.call(this, data.geometry.type)){
                    return;
                }

                var key = angular.lowercase(data.geometry.type),
                    geoObject = new ymaps.GeoObject(data, data.displayOptions);
                geoObject.properties.set('_index', index);
                this.collections[key].add(geoObject);
                if(this._allGeoObjects[index]){
                    throw new Error('index already busy');
                }
                this._allGeoObjects[index]={mapObject:geoObject, originObject:data};
                if(data.geometry.type === GEOMETRY_TYPES.POLYGON){
                    data.geometry.coordinates = geoObject.geometry.getCoordinates();
                }
                if(this.isSelectable()){
                    subscribeEvent.call(this, geoObject, EVENTS);
                }
                incrementCountGeometry.call(this, EVENTS);
            },

            /**
             * Вызывает переданную функцию только после создания объекта карты
             * */
            callFunctionBeforeMapCreated = function(fn, EVENTS) {
                if (this.isMapCreated()) {
                    fn.apply(this);
                } else {
                    this.onOne(EVENTS.MAPCREATED, fn);
                }
            },

            /**
             * изменяет гео объект
             * */
            changeGeoObject = function(geoObjOnMap, geoObjInSource, GEOMETRY_TYPES) {
                var type = geoObjOnMap.geometry.getType();
                if (type === GEOMETRY_TYPES.CIRCLE) {
                    geoObjOnMap.geometry.setRadius(geoObjInSource.geometry.radius);
                }
                geoObjOnMap.geometry.setCoordinates(geoObjInSource.geometry.coordinates);
            },

            /**
             * Устанавливает индекс выбранного элемента в коллекции
             */
            setSelectedObjectIndex = function(val, EVENTS){
                if(this._selectedObjectIndex===val){
                    return;
                }
                var backValue = this._selectedObjectIndex;
                this._selectedObjectIndex = val;
                trigger.call(this, EVENTS.SELECTCHANGE,{newIndex:val,oldIndex:backValue});
            },

            /**
             * возвращает индеск гео объекта в коллекции
             * */
            findIndex = function(geoObject) {
                return geoObject.properties.get('_index');
            },

            /**
             * подписывает объекты на события
             * */
            subscribeEvent=function(geoObject, EVENTS) {
                var self = this;
                if (this.isEditable()) {
                    geoObject.events.add(EVENTS.GEOMETRYCHANGE, function (event) {
                        //получаем оригинальное событие
                        var originEvent = event;
                        while (originEvent.originalEvent) {
                            if (originEvent.type === EVENTS.CHANGE)
                                break;
                            originEvent = originEvent.originalEvent;
                        }
                        //обновляем измененный объект
                        trigger.call(self, EVENTS.GEOMETRYCHANGE, {
                            type: event.get('target').geometry.getType(),
                            newCoordinates: originEvent.newCoordinates,
                            oldCoordinates: originEvent.oldCoordinates
                        });
                    });
                }
                geoObject.events.add(EVENTS.CLICK, function () {
                    self.select(findIndex.call(self, geoObject));
                });
            },

            /**
             * возвращает индекс выбранного элемента
             * */
            getSelectedObjectIndex = function(){
                return this._selectedObjectIndex;
            },

            /**
             * устанавливает максимально допустимое количество объектов на карте
             * */
            setMaxCountGeometry = function(val){
                this._maxCountGeometry = val;
            },

            /**
             * устанавливает типы геометрий, которые могут присутствовать на карте
             * */
            setValidTypes = function(types, GEOMETRY_TYPES) {
                if (types) {
                    var validTypes = types.split(' ');
                    var curTypes = validTypes.map(function (type) {
                        return angular.lowercase(type);
                    });
                    if (curTypes.indexOf('all') > -1) {
                        this._validTypes = [GEOMETRY_TYPES.POINT, GEOMETRY_TYPES.LINESTRING, GEOMETRY_TYPES.RECTANGLE,
                            GEOMETRY_TYPES.POLYGON, GEOMETRY_TYPES.CIRCLE];
                    }
                    else {
                        this._validTypes = [];
                        for (var i = 0, ii = curTypes.length; i < ii; i++) {
                            this._validTypes.push(GEOMETRY_TYPES[angular.uppercase(curTypes[i])]);
                        }
                    }
                } else {
                    this._validTypes = [GEOMETRY_TYPES.POINT, GEOMETRY_TYPES.LINESTRING, GEOMETRY_TYPES.RECTANGLE,
                        GEOMETRY_TYPES.POLYGON, GEOMETRY_TYPES.CIRCLE];
                }
            },

            /**
             * декрементирует текущее количество объектов на карте
             * */
            decrementCountGeometry= function(EVENTS) {
                this._countGeometry--;
                trigger.call(this, EVENTS.COUNTGEOMETRYCHANGE, {newValue: this._countGeometry});
            },

            /**
             * инкрементирует текущее количество объектов на карте
             * */
            incrementCountGeometry = function(EVENTS) {
                if (!this._countGeometry) {
                    this._countGeometry = 0;
                }
                this._countGeometry++;
                trigger.call(this, EVENTS.COUNTGEOMETRYCHANGE, {newValue: this._countGeometry});
            },

            loadScript = function(url, callback){
                var script = document.createElement("script")
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

		this.options = function(val){
			globalOptions = val;
		};

        this.$get = ['$window', 'GEOMETRY_TYPES', 'MAP_EVENTS',
        function($window, GEOMETRY_TYPES, EVENTS){
            /**
                 * Конструктор
                 * divId идентификатор div в котором будем создавать карту
                 * mapParams параметры карты
                 * mapControls элементы управления картой
                 * mapMode режим работы карты. (view, select, edit)
                 * */
            function YandexMapWrapper(divId, mapParams, mapControls, mapMode, validTypes, maxCountGeometry, isClusterer){
                this._customButtons = {};
                this._drawingPoints = [];
                this._drawingType = null;
                this._drawingGeoObject = null;
                var self = this,
                    //устанавливает режим работы карты
					setMode=function(val){
                        var m = val ? angular.uppercase(val) : MODES.VIEW;
                        self.mode = MODES[m] ? MODES[m] : MODES.VIEW;
					},
					//создание екземпляра карты
					createMap=function(params, controls){
						setMode(mapMode);
						self._map = new ymaps.Map(divId, params);
                        var d;
                        for(var control in controls){
                            if(control==='default'){
                                d = controls[control];
                                for(var i= 0,ii= d.length;i<ii;i++){
                                    addControl.call(self, d[i], undefined,EVENTS,GEOMETRY_TYPES);
                                }
                            }else{
                                addControl.call(self, control, controls[control], EVENTS,GEOMETRY_TYPES);
                            }
                        }

						self.collections={};
						var collectionKey, type, collection;
						for(var i=0, ii=self._validTypes.length;i<ii;i++){
							type=self._validTypes[i];
                            if(type === GEOMETRY_TYPES.POINT && self.isClusterer()){
                                collection = new ymaps.Clusterer(getDisplayOptions(type, self.mode));
                            }else{
                                collection = new ymaps.GeoObjectCollection({},getDisplayOptions(type, self.mode));
                            }

                            collectionKey = angular.lowercase(type);
                            self.collections[collectionKey] = collection;
						}

						self._allGeoObjects = {};
						self._selectedObjectIndex = null;
						self.selectedObjectBackOptions = null;
						
						//добавляем коллекции на карту
						for(var key in self.collections){
							self._map.geoObjects.add(self.collections[key]);
						}

                        //добавляем поддержку рисования
                        if(self.isAddable()){
                            setDrawingSupport.call(self, GEOMETRY_TYPES, EVENTS);
                        }

                        //генерируем событие, карта создана
						trigger.call(self, EVENTS.MAPCREATED);
					};

                setValidTypes.call(this, validTypes, GEOMETRY_TYPES);
                setMaxCountGeometry.call(this, maxCountGeometry);
                this._isClusterer = isClusterer;
                setAddState.call(this, null, EVENTS);

                var ymapReady = function(){
                    //как будет готово API инициализируем карту
                    ymaps.ready(function(){
                        var params = getParams(mapParams),
                            controls = getControls(mapControls);
                        if (undefined === params.zoom) {
                            params.zoom = 10;
                        }

                        //если не переданы параметры центр, тогда по API определяем его
                        if(!params.center){
                            params.center =  [ymaps.geolocation.latitude, ymaps.geolocation.longitude];
                        }

                        //если переданы координаты начальной точки
                        if(angular.isArray(params.center)){
                            createMap(params,controls);
                        }
                        //иначе считаем что передан адрес начальной точки
                        else{
                            // Поиск координат переданного адреса
                            ymaps.geocode(params.center, { results: 1 }).then(function (res) {
                                var firstGeoObject = res.geoObjects.get(0);
                                params.center = firstGeoObject.geometry.getCoordinates();
                                createMap(params,controls);
                            }, function (err) {
                                // Если геокодирование не удалось, сообщаем об ошибке
                                $window.alert(err.message);
                            })
                        }
                    });
                };
                if(!$window.ymaps){
                    loadScript('http://api-maps.yandex.ru/2.0/?load=package.full&lang=ru-RU', ymapReady);
                }else{
                    ymapReady();
                }
			}

            /**
             * Определяет, используются ли на карте кластеры
             * @returns истина, если кластеры используются
             */
            YandexMapWrapper.prototype.isClusterer = function(){
                return this._isClusterer;
            }

            /**
             * Подписка на событие
             * @param eventName имя события
             * @param handler обработчик события, которому может передаваться один аргумент
             */
			YandexMapWrapper.prototype.on = function(eventName, handler) {
				if (!this._eventHandlers) this._eventHandlers = [];
				if (!this._eventHandlers[eventName]) {
					this._eventHandlers[eventName] = [];
				}
				this._eventHandlers[eventName].push(handler);
			};
			/**
			 * Однократная подписка на событие
             * @param eventName имя события
             * @param handler обработчик события, которому может передаваться один аргумент
			*/
			YandexMapWrapper.prototype.onOne = function(eventName, handler) {
				if (!this._oneEventHandlers) this._oneEventHandlers = [];
				if (!this._oneEventHandlers[eventName]) {
					this._oneEventHandlers[eventName] = [];
				}
				this._oneEventHandlers[eventName].push(handler);
			};

            /**
             * Прекращение подписки
             * @param eventName имя события
             * @param handler обработчик события
             */
			YandexMapWrapper.prototype.off= function(eventName, handler) {
				var handlers = this._eventHandlers[eventName];
				if (!handlers) return;
				for(var i=0; i<handlers.length; i++) {
					if (handlers[i] == handler) {
						handlers.splice(i--, 1);
					}
				}
			};


			/**
			 * возвращает возможность редактирования элементов катры
			 * */
			YandexMapWrapper.prototype.isEditable = function(){
				return this.mode === MODES.EDIT || this.isAddable();
			};
			/**
			 * возвращает возможность выбора мышью элементов катры
			 * */
			YandexMapWrapper.prototype.isSelectable = function(){
				return this.mode === MODES.SELECT || this.isEditable();
			};

            /**
             * Возвращает возможность добавлять новые елементы на карту
             * @returns {boolean}
             */
            YandexMapWrapper.prototype.isAddable = function(){
                return this.mode === MODES.ADD;
            };

			/**
			 * возвращает истину, если карта была ранее создана
			 * */
			YandexMapWrapper.prototype.isMapCreated = function(){
				return this._map ? true : false;
			};

 			/**
			 * создает гео объект(ы) на карте.
			 * */
			YandexMapWrapper.prototype.createGeoObject = function(data, index){
				var fn = function(){
					if(angular.isArray(data)){
						for(var i= 0, ii=data.length;i<ii;i++){
							createGeoObjectOnMap.call(this, data[i], i, GEOMETRY_TYPES, EVENTS);
						}
					}
					else if(angular.isObject(data)){
						createGeoObjectOnMap.call(this, data, index, GEOMETRY_TYPES, EVENTS)
					}
					else{
						throw new Error('not correct type argument data');
					}
				};
				callFunctionBeforeMapCreated.call(this, fn, EVENTS);
			};

			/**
			 * синхронизирует состояние объектов на карте с переданным данными
			 * */
			YandexMapWrapper.prototype.synchronise = function(changedData){
				var fn = function(){
					var processedIds = [], removedIndexes=[], addedGeoObjects=[],
						curSourceElement, curMapElement;
					for(var i in this._allGeoObjects){
						curSourceElement = changedData[i];
						curMapElement = this._allGeoObjects[i].mapObject;
						if(curSourceElement){
							if(curMapElement.geometry.getType()===curSourceElement.geometry.type){
								changeGeoObject.call(this, curMapElement, curSourceElement, GEOMETRY_TYPES);
							}else{
								removedIndexes.push(i);
                                if(curSourceElement){
								    addedGeoObjects.push({index:i,element:curSourceElement});
                                }
							}
						}else{
							removedIndexes.push(i);
						}
						processedIds[i]=true;
					}
					var ii;
					for(i = 0, ii=changedData.length;i<ii;i++){
						if(processedIds[i]){
							continue;
						}
                        if(changedData[i]){
                            addedGeoObjects.push({index:i, element:changedData[i]});
                        }
					}
					for(i=0,ii=removedIndexes.length;i<ii;i++){
						this.removeGeoObject(removedIndexes[i]);
					}
					for(i=0,ii=addedGeoObjects.length;i<ii;i++){
						this.createGeoObject(addedGeoObjects[i].element,addedGeoObjects[i].index);
					}
				};
				callFunctionBeforeMapCreated.call(this, fn, EVENTS);
			};

			/**
			 * удаляет элемент с карты
			 * */
			YandexMapWrapper.prototype.removeGeoObject = function(indexOfAllGeoObjects){
				var geoObj = this._allGeoObjects[indexOfAllGeoObjects].mapObject,
					key = angular.lowercase(geoObj.geometry.getType());
				this.collections[key].remove(geoObj)
				delete this._allGeoObjects[indexOfAllGeoObjects];
				if(indexOfAllGeoObjects===getSelectedObjectIndex.call(this)){
					setSelectedObjectIndex.call(this, null, EVENTS);
				}
				decrementCountGeometry.call(this, EVENTS);
                trigger.call(this, EVENTS.REMOVEGEOOBJ,{index:indexOfAllGeoObjects});
			};

			//отмена выделения текщего выбранного объекта
			YandexMapWrapper.prototype.deselect = function(){
				var fn = function(){
					var selectIndex = getSelectedObjectIndex.call(this);
					if(selectIndex!==null && selectIndex>-1 && this._allGeoObjects[selectIndex]){
						var selectedObject = this._allGeoObjects[selectIndex].mapObject;
						selectedObject.options.set(this.selectedObjectBackOptions.setOptions);
						selectedObject.options.unset(this.selectedObjectBackOptions.unsetOptions);
                  		if(hasEditor(selectedObject)){
							selectedObject.editor.stopEditing();
						}
					}

					//очищаем старые значения
					this.selectedObjectBackOptions = null;
					setSelectedObjectIndex.call(this,null,EVENTS);
				};
				callFunctionBeforeMapCreated.call(this, fn, EVENTS);
			};

			//установка выбранного объекта
			YandexMapWrapper.prototype.select = function(index){
				var fn = function(){
					if(!this._allGeoObjects[index]){
						return;
					}
					this.deselect();
					var backOptions = {},
						selectedOptions = getSelectedObjectDisplayOptions(),
						geoObj = this._allGeoObjects[index].mapObject,
                        unsetOptions = [];

                    var opt;
					for(var option in selectedOptions){
                        //сохраняем старые опции объекта, которые будем менять
                        opt = geoObj.options.get(option);
                        if(opt){
                            backOptions[option]=opt;
                        }else{
                            unsetOptions.push(option);
                        }
					}

                    //задаем ему новые опции
					geoObj.options.set(selectedOptions);

					//включаем режим редактирования
					if(hasEditor(geoObj)){
						geoObj.editor.startEditing();
					}
					this.selectedObjectBackOptions = {
                        setOptions:backOptions,
                        unsetOptions:unsetOptions
                    };
                    setSelectedObjectIndex.call(this,index,EVENTS);
				};
				callFunctionBeforeMapCreated.call(this, fn, EVENTS);
			};

			/**
			 * возвращает максимально допустимое количество объектов на карте
			 * */
			YandexMapWrapper.prototype.getMaxCountGeometry = function(){
				return this._maxCountGeometry ? this._maxCountGeometry : 0;
			};

			/**
			 * возвращает количество объектов на карте
			 * */
			YandexMapWrapper.prototype.getCountGeometry = function(){
				return this._countGeometry ? this._countGeometry : 0;
			};

			/**
			 * проверяет, является ли тип геометрии допустимым для данной карты
			 * */
			YandexMapWrapper.prototype.isValidType = function(type){
                return this._validTypes.indexOf(type)>-1;
			};

            /**
             * Задает центр карты
             * @param center может быть объектом, массивом координат, или строкой. В случае строки применяется геокодирование
             */
            YandexMapWrapper.prototype.setCenter = function(center){
                if(!center){
                    center = [ymaps.geolocation.latitude, ymaps.geolocation.longitude];
                }
                if(center.x && center.y){
                    this._map.setCenter([center.x, center.y]);
                }else if(center.length === 2){
                    this._map.setCenter(center);
                }else{
                    var self = this;
                    var myGeocoder = ymaps.geocode(center);
                    myGeocoder.then(
                        function (res) {
                            var firstGeoObject = res.geoObjects.get(0);
                            self._map.setCenter(firstGeoObject.geometry.getCoordinates());
                        }
                    );
                }
            };

			return {
				createMap:function(divId, params, controls, mode, validTypes, maxCoutnGeometry, isClusterer){
					return new YandexMapWrapper(divId, params, controls, mode, validTypes, maxCoutnGeometry, isClusterer);
				}
			};
		}];
	}).
	directive('yaMap', ['$window', 'YandexMap', 'MAP_EVENTS', function($window, yandexMap, MAP_EVENTS) {
        var ATTRIBUTE_NAMES = {
                MAX_COUNT_GEOMETRY:'yaMaxCountGeometry',
                ID:'id',
                CLUSTERER:'yaClusterer',
                MODE:'yaMode',
                VALID_TYPES:'yaValidTypes',
                GEO_OBJECTS:'yaGeoObjects',
                SELECT_INDEX:'yaSelectIndex',
                PROPERTIES_CENTER:'yaProperties.params.center'
            };
		return {
			restrict:'AC',
            require:'ngModel',
			scope:{
				yaProperties:'=',
				yaGeoObjects:'=ngModel',
				yaSelectIndex:'=',
                yaRequired:'&'
			},
			link:function(scope, iElement, iAttrs, controller){
				var isRunAngularContext = false,
					maxCountGeometry = iAttrs[ATTRIBUTE_NAMES.MAX_COUNT_GEOMETRY]
                        ? iAttrs[ATTRIBUTE_NAMES.MAX_COUNT_GEOMETRY] * 1 : 0;


				//устанавливаем значения по умолчанию
				scope.yaProperties = scope.yaProperties || {};
				scope.yaSelectIndex = scope.yaSelectIndex || null;
				scope.yaGeoObjects = scope.yaGeoObjects || [];
                var divId = iAttrs[ATTRIBUTE_NAMES.ID];
                if(!divId){
                    throw new Error('not value in attribute "'+ATTRIBUTE_NAMES.ID + '"');
                }
                var isClusterer = false;
                if(angular.isDefined(iAttrs[ATTRIBUTE_NAMES.CLUSTERER])){
                    isClusterer = iAttrs[ATTRIBUTE_NAMES.CLUSTERER]==='' || iAttrs[ATTRIBUTE_NAMES.CLUSTERER]==true;
                }

				//создаем новую карту в диве в идентификатором 'map', с параметрами заданными во втором аргументе
				//элементы управления задаются в третьем елементе, режим карты задаем в последнем аргументе.
				//допустимые режимы 'veiw','select' или 'edit'
				var map = yandexMap.createMap(
                    divId,
					scope.yaProperties.params,
					scope.yaProperties.controls,
					iAttrs[ATTRIBUTE_NAMES.MODE],
					iAttrs[ATTRIBUTE_NAMES.VALID_TYPES],
					maxCountGeometry,
                    isClusterer
				);

				//создаем на карте объекты
				map.createGeoObject(scope.yaGeoObjects);

				//подписываемся на события карты
				map.on(MAP_EVENTS.GEOMETRYCHANGE,function(eventData){
					var curObject, result=null;
					for(var i= 0,ii=scope.yaGeoObjects.length;i<ii;i++){
						curObject = scope.yaGeoObjects[i];
						if(!curObject){
							continue;
						}
						if(curObject.geometry.type === eventData.type
							&& angular.equals(curObject.geometry.coordinates, eventData.oldCoordinates)){
							result = curObject;
							break;
						}
					}
					if(result){
						if(isRunAngularContext){
							result.geometry.coordinates = eventData.newCoordinates;
						}else{
							scope.$apply(function(){
								result.geometry.coordinates = eventData.newCoordinates;
							});
						}
					}
				});
				map.on(MAP_EVENTS.SELECTCHANGE,function(eventData){
					if(isRunAngularContext){
						scope.yaSelectIndex	= eventData.newIndex;
					}else{
						scope.$apply(function(){
							scope.yaSelectIndex	= eventData.newIndex;
						});
					}
				});
                map.on(MAP_EVENTS.REMOVEGEOOBJ, function(eventData){
                    if(isRunAngularContext){
                        delete scope.yaGeoObjects[eventData.index];
                    }else{
                        scope.$apply(function(){
                            delete scope.yaGeoObjects[eventData.index];
                        });
                    }
                    parser(scope.yaGeoObjects);
                });
                map.on(MAP_EVENTS.GEOOBJECTCREATED, function(eventData){
                    var geoObj = {
                            geometry:eventData
                        },
                        index = scope.yaGeoObjects.length,
                        setScopeProperty = function(){
                            scope.yaGeoObjects[index] = geoObj;
                            scope.yaSelectIndex = index;
                        };
                    if(isRunAngularContext){
                        setScopeProperty();
                    }else{
                        scope.$apply(setScopeProperty());
                    }
                    parser(scope.yaGeoObjects);
                });

				//включаем отслеживаение изменений в scope
				scope.$watch(ATTRIBUTE_NAMES.GEO_OBJECTS, function(newGeoObjects){
					isRunAngularContext = true;
					map.synchronise(newGeoObjects);
                    parser(scope.yaGeoObjects);
					isRunAngularContext = false;
				}, function(){return false});
				scope.$watch(ATTRIBUTE_NAMES.SELECT_INDEX, function(newSelectIndex){
					isRunAngularContext = true;
					if(newSelectIndex===undefined){
						return;
					}
					if(newSelectIndex===null){
						map.deselect();
					}else{
						map.select(newSelectIndex)
					}
					isRunAngularContext = false;
				});
                scope.$watch(ATTRIBUTE_NAMES.PROPERTIES_CENTER, function(newCenter, oldCenter){
                    if(angular.equals(newCenter, oldCenter)){
                        return;
                    }
                    map.setCenter(newCenter);
                });

                var parser = function(viewValue){
                    if(!iAttrs.yaRequired && !iAttrs.required){
                        return viewValue;
                    }
                    if(iAttrs.yaRequired){
                        if(scope.yaRequired()){
                            iAttrs.required = true;
                        }else{
                            delete iAttrs.required;
                        }
                    }

                    var req = iAttrs.required !== undefined;
                    if(req){
                        var item, valid = false;
                        for (var i = 0, ii = viewValue.length; i < ii; i++) {
                            item = viewValue[i];
                            if(item){
                                valid = true;
                                break;
                            }
                        }
                        controller.$setValidity('required', valid);
                    }
                    return viewValue;
                };
                controller.$render = function(){
                    parser(scope.yaGeoObjects);
                };
                controller.$parsers.push(parser);
                scope.$watch(scope.yaRequired, function(){
                    parser(scope.yaGeoObjects);
                });
			}
		};
	}]);

