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
        DRAWINGTYPECHANGE:'drawingTypeChange'
    }).
    filter('geometryTypeTitle', ['GEOMETRY_TYPES',function(GEOMETRY_TYPES){
        return function(geometryType){
            switch(geometryType){
                case GEOMETRY_TYPES.POINT:
                    return 'точка';
                case GEOMETRY_TYPES.LINESTRING:
                    return 'ломанная';
                case GEOMETRY_TYPES.RECTANGLE:
                    return 'прямоугольник';
                case GEOMETRY_TYPES.POLYGON:
                    return 'многоугольник';
                case GEOMETRY_TYPES.CIRCLE:
                    return 'круг';
                default:
                    throw new Error('not correct geometry type');
            }
        };
    }]).
	provider('YandexMap', function(){
		var globalOptions={},
			getParams = function(parameters){
				return angular.extend({}, globalOptions.params, parameters);
			},
			getControls=function(controls){
				if(controls)
					return controls;
				if(globalOptions.controls)
					return globalOptions.controls;
				return null;
			},
			editingTypes=['LineString', 'Polygon'],
            MODES = {
                VIEW:'view',
                SELECT:'select',
                EDIT:'edit',
                ADD:'add'
            },
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
			getSelectedObjectDisplayOptions=function(){
				return globalOptions.displayOptions && globalOptions.displayOptions.selected
					?globalOptions.displayOptions.selected
					:{};
            },
            getDrawingOptions = function(){
                return globalOptions.displayOptions && globalOptions.displayOptions.drawing
                        ?globalOptions.displayOptions.drawing
                        :{};
            };

		this.options = function(val){
			globalOptions = val;
		};

		this.$get = ['$window', 'GEOMETRY_TYPES', 'MAP_EVENTS', 'geometryTypeTitleFilter',
        function($window, GEOMETRY_TYPES, EVENTS, geometryTypeTitle){
           	/**
			* Конструктор
			* divId идентификатор div в котором будем создавать карту
			 * mapParams параметры карты
			 * mapControls элементы управления картой
			 * mapMode режим работы карты. (view, select, edit)
			* */
			function YandexMapWrapper(divId, mapParams, mapControls, mapMode, validTypes, maxCountGeometry, isClusterer){
                var self = this,
                    addGeometryClickHandler = function(e){
                        self.addDrawingPoint( e.get('coordPosition'));
                    },
                    drawingPointsChangeHandler = function(){
                        var type = self.getDrawingType(),
                            coordinates = self.getDrawingPoints();
                        if(type === GEOMETRY_TYPES.POINT){
                            self._customButtons[type].deselect();
                        }
                        else if(type === GEOMETRY_TYPES.POLYGON || type === GEOMETRY_TYPES.LINESTRING){
                            if(self._drawingGeoObject){
                                self._map.geoObjects.remove(self._drawingGeoObject);
                            }
                            var drawingGeoObject = new ymaps.GeoObject({
                                geometry: {
                                    type: type,
                                    coordinates: GEOMETRY_TYPES.POLYGON===type ? [coordinates,[]] : coordinates
                                }
                            }, getDrawingOptions());
                            self._map.geoObjects.add(drawingGeoObject);
                            self._drawingGeoObject = drawingGeoObject;
                        }
                        else if(type===GEOMETRY_TYPES.RECTANGLE || type === GEOMETRY_TYPES.CIRCLE){
                            if(coordinates.length === 2){
                                self._customButtons[type].deselect();
                            }
                        }
                    },

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
                                    self._addControl(d[i]);
                                }
                            }else{
                                self._addControl(control, controls[control]);
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
                            self.on(EVENTS.ADDSTATECHANGE, function(eventData){
                                if(eventData.oldValue !== ADD_STATES.NONE){
                                    self._map.events.remove(EVENTS.CLICK, addGeometryClickHandler);
                                    self.off(EVENTS.DRAWINGPOINTSCHANGE, drawingPointsChangeHandler);
                                    self.drawingEnd();
                                }
                                var geometryType=null;
                                switch(eventData.newValue){
                                    case ADD_STATES.NONE:
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
                                if(eventData.newValue !== ADD_STATES.NONE){
                                    self.setDrawingType(geometryType);
                                    self._map.events.add(EVENTS.CLICK, addGeometryClickHandler);
                                    self.on(EVENTS.DRAWINGPOINTSCHANGE, drawingPointsChangeHandler);
                                }
                            });
                        }

                        //генерируем событие, карта создана
						self.trigger(EVENTS.MAPCREATED);
					};

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

				this.setValidTypes(validTypes);
				this.setMaxCountGeometry(maxCountGeometry);
                this._isClusterer = isClusterer;
                this.setAddState(null);
                this._customButtons = {};
                this._drawingPoints = [];
                this._drawingType = null;
                this._drawingGeoObject = null;
			}

            /**
             * Добавляет новую точку в коллекцию точек геообъекта
             * @param point добавляемая точка в виде массива координат
             */
            YandexMapWrapper.prototype.addDrawingPoint = function(point){
                if(!angular.isArray(point)){
                    throw new Error('point has been Array');
                }
                this._drawingPoints.push(point);
                this.trigger(EVENTS.DRAWINGPOINTSCHANGE);
            };

            /**
             * Возвращает массив точек нарисованной фигуры
             * @returns {Array} координаты фигуры
             */
            YandexMapWrapper.prototype.getDrawingPoints = function(){
                return this._drawingPoints;
            };

            /**
             * Возвращает тип рисуемой геометрии
             * @returns {*} тип рисуемой геометрии
             */
            YandexMapWrapper.prototype.getDrawingType = function(){
                return this._drawingType;
            };

            /**
             * Устанавливает тип рисуемой геометрии
             * @param type тип рисуемой геометрии
             */
            YandexMapWrapper.prototype.setDrawingType = function(type){
                if(this._drawingType === type){
                    return;
                }
                var backValue = this.getDrawingType();
                this._drawingType = type;
                this.trigger(EVENTS.DRAWINGTYPECHANGE, {newValue:this.getDrawingType(), oldValue:backValue});
            };

            /**
             * Заканчивает рисование объекта
             */
            YandexMapWrapper.prototype.drawingEnd = function(){
                var type = this.getDrawingType(),
                    coordinates = this.getDrawingPoints(),
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
                this.trigger(EVENTS.GEOOBJECTCREATED, geometry);
                this._drawingPoints = [];
                this._drawingType = null;
                if(this._drawingGeoObject){
                    this._map.geoObjects.remove(this._drawingGeoObject);
                }
                this._drawingGeoObject = null;
            };

            /**
             * Устанавливает состояние редактирования
             * @param geoObjectType тип гео объекта который будет добавляться
             */
            YandexMapWrapper.prototype.setAddState = function(geoObjectType){
                var key = angular.uppercase(geoObjectType),
                    backValue = this.getAddState();
                this._addState = ADD_STATES[key] || ADD_STATES.NONE;
                if(backValue !== this.getAddState()){
                    this.trigger(EVENTS.ADDSTATECHANGE, {newValue: this.getAddState(), oldValue:backValue});
                }
            };

            /**
             * возвращает состояние при добавлении элементов
             * @returns {*} член перечислимого ADD_STATES
             */
            YandexMapWrapper.prototype.getAddState = function(){
                return this._addState;
            };

            /**
             * Определяет, используются ли на карте кластеры
             * @returns истина, если кластеры используются
             */
            YandexMapWrapper.prototype.isClusterer = function(){
                return this._isClusterer;
            }

            /**
             * Добавляет элементы управления на карту
             * @param key - ключ элемента управления
             * @param options - опции элемента управления
             * @private
             */
            YandexMapWrapper.prototype._addControl = function(key, options){
                //если это стандартная панель управления, добавляем кнопки для редактирования
                if(key === 'mapTools' && this.isEditable()){
                    var mapTools = new ymaps.control.MapTools(['default'], options);
                    mapTools.add(new ymaps.control.ToolBarSeparator(1));
                    var myButton = new ymaps.control.Button('<b>Удалить</b>',{
                        selectOnClick: false
                    });
                    var self = this;

                    //кнопка удаления выделенного объекта
                    myButton.events.add(EVENTS.CLICK, function(){
                        var index = self.getSelectedObjectIndex();
                        if(index === null){
                            return;
                        }
                        self.removeGeoObject(index);
                    });
                    mapTools.add(myButton);
                    this._customButtons.delete = myButton;
                    self.on(EVENTS.SELECTCHANGE, function(eventData){
                        if(eventData.newIndex !== null && eventData.newIndex !== undefined){
                            myButton.enable();
                        } else{
                            myButton.disable();
                        }
                    });

                    if(this.isAddable()){
                        //список с возможными вариантами добавления элементов
                        var rollupItems = [], button;
                        for(var prop in GEOMETRY_TYPES){
                            if(this.isValidType(GEOMETRY_TYPES[prop])){
                                button = new ymaps.control.Button(geometryTypeTitle(GEOMETRY_TYPES[prop]));
                                button.geometryType = GEOMETRY_TYPES[prop];
                                rollupItems.push(button);
                                self._customButtons[GEOMETRY_TYPES[prop]] = button;
                            }
                        }
                        var myRollupButton = new ymaps.control.RollupButton({
                            items: rollupItems
                        });

                        myRollupButton.events.add(EVENTS.SELECT,function(e){
                            var button = e.get('item');
                            self.setAddState(button.geometryType);
                        });
                        myRollupButton.events.add(EVENTS.DESELECT,function(e){
                            var button = e.get('item');
                            self.setAddState(null);
                        });
                        mapTools.add(myRollupButton);
                    }
                    this._map.controls.add(mapTools);
                }else{
                    this._map.controls.add(key,options);
                }
            }

			 // Подписка на событие
			 // Использование:
			 // YandexMapWrapper.on('maploaded', function(item) { ... }
			YandexMapWrapper.prototype.on = function(eventName, handler) {
				if (!this._eventHandlers) this._eventHandlers = [];
				if (!this._eventHandlers[eventName]) {
					this._eventHandlers[eventName] = [];
				}
				this._eventHandlers[eventName].push(handler);
			};
			/**
			 * Однократная подписка на событие
			* */
			YandexMapWrapper.prototype.onOne = function(eventName, handler) {
				if (!this._oneEventHandlers) this._oneEventHandlers = [];
				if (!this._oneEventHandlers[eventName]) {
					this._oneEventHandlers[eventName] = [];
				}
				this._oneEventHandlers[eventName].push(handler);
			};

			 // Прекращение подписки
			 //  menu.off('select',  handler)
			YandexMapWrapper.prototype.off= function(eventName, handler) {
				var handlers = this._eventHandlers[eventName];
				if (!handlers) return;
				for(var i=0; i<handlers.length; i++) {
					if (handlers[i] == handler) {
						handlers.splice(i--, 1);
					}
				}
			};

			// Генерация события с передачей данных
			//  this.trigger('select', item);
			YandexMapWrapper.prototype.trigger = function(eventName) {
				// вызвать обработчики
				var handlers, i, ii;
				if(this._eventHandlers && this._eventHandlers[eventName]){
					handlers = this._eventHandlers[eventName];
					for (i = 0, ii=handlers.length; i < ii; i++) {
						handlers[i].apply(this, [].slice.call(arguments, 1));
					}
				}

				if(this._oneEventHandlers && this._oneEventHandlers[eventName]){
					handlers = this._oneEventHandlers[eventName];
					for (i = 0, ii=handlers.length; i < ii; i++) {
						handlers[i].apply(this, [].slice.call(arguments, 1));
					}
					this._oneEventHandlers[eventName]=[];
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
			 * проверяет, можно ли создать новый объект определенного типа
			 * */
			YandexMapWrapper.prototype.possibleCreateGeoObject = function(geometryType){
				var maxCount = this.getMaxCountGeometry();
				return (maxCount === 0 || maxCount > this.getCountGeometry())
					&& this.isValidType(geometryType);
			};

			/**
			 * создает гео объект на карте
			 * */
			YandexMapWrapper.prototype._createGeoObject = function(data, index, generateEvent){
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
                if(!this.possibleCreateGeoObject(data.geometry.type)){
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
					this._subscribeEvent(geoObject);
				}
				this.incrementCountGeometry();
			};

 			/**
			 * создает гео объект(ы) на карте.
			 * */
			YandexMapWrapper.prototype.createGeoObject = function(data, index){
				var fn = function(){
					if(angular.isArray(data)){
						for(var i= 0, ii=data.length;i<ii;i++){
							this._createGeoObject(data[i], i);
						}
					}
					else if(angular.isObject(data)){
						this._createGeoObject(data, index)
					}
					else{
						throw new Error('not correct type argument data');
					}
				};
				this.callFunctionForMap(fn);
			};

			/**
			 * Вызывает переданную функцию только после создания объекта карты
			 * */
			YandexMapWrapper.prototype.callFunctionForMap = function(fn){
				if(this.isMapCreated()){
					fn.apply(this);
				}else{
					this.onOne(EVENTS.MAPCREATED, fn);
				}
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
								this.changeGeoObject(curMapElement, curSourceElement);
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
				this.callFunctionForMap(fn);
			};

			/**
			 * удаляет элемент с карты
			 * */
			YandexMapWrapper.prototype.removeGeoObject = function(indexOfAllGeoObjects){
				var geoObj = this._allGeoObjects[indexOfAllGeoObjects].mapObject,
					key = angular.lowercase(geoObj.geometry.getType());
				this.collections[key].remove(geoObj)
				delete this._allGeoObjects[indexOfAllGeoObjects];
				if(indexOfAllGeoObjects===this.getSelectedObjectIndex()){
					this.setSelectedObjectIndex(null);
				}
				this.decrementCountGeometry();
                this.trigger(EVENTS.REMOVEGEOOBJ,{index:indexOfAllGeoObjects});
			};

			/**
			 * изменяет гео объект
			 * */
			YandexMapWrapper.prototype.changeGeoObject = function(geoObjOnMap, geoObjInSource){
				var type = geoObjOnMap.geometry.getType();
				if(type===GEOMETRY_TYPES.CIRCLE){
					geoObjOnMap.geometry.setRadius(geoObjInSource.geometry.radius);
				}
				geoObjOnMap.geometry.setCoordinates(geoObjInSource.geometry.coordinates);
			};

			/**
			 * устанавливает индекс выбранного элемента
			 * */
			YandexMapWrapper.prototype.setSelectedObjectIndex = function(val){
				if(this._selectedObjectIndex===val){
					return;
				}
				var backValue = this._selectedObjectIndex;
				this._selectedObjectIndex = val;
				this.trigger(EVENTS.SELECTCHANGE,{newIndex:val,oldIndex:backValue});
			};

			/**
			 * возвращает индекс выбранного элемента
			 * */
			YandexMapWrapper.prototype.getSelectedObjectIndex = function(){
				return this._selectedObjectIndex;
			}

			//отмена выделения текщего выбранного объекта
			YandexMapWrapper.prototype.deselect = function(){
				var fn = function(){
					var selectIndex = this.getSelectedObjectIndex();
					if(selectIndex!==null && selectIndex>-1){
						var selectedObject = this._allGeoObjects[selectIndex].mapObject;
						selectedObject.options.set(this.selectedObjectBackOptions.setOptions);
						selectedObject.options.unset(this.selectedObjectBackOptions.unsetOptions);
                  		if(hasEditor(selectedObject)){
							selectedObject.editor.stopEditing();
						}
					}

					//очищаем старые значения
					this.selectedObjectBackOptions = null;
					this.setSelectedObjectIndex(null);
				};
				this.callFunctionForMap(fn);
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
                    this.setSelectedObjectIndex(index);
				};
				this.callFunctionForMap(fn);
			};

			/**
			 * возвращает индеск гео объекта в коллекции
			 * */
			YandexMapWrapper.prototype.findIndex = function(geoObject){
				return geoObject.properties.get('_index');
			};

			/**
			 * подписывает объекты на события
			 * */
			YandexMapWrapper.prototype._subscribeEvent = function(geoObject){
				var self = this;
				if(this.isEditable()){
					geoObject.events.add(EVENTS.GEOMETRYCHANGE, function (event) {
						//получаем оригинальное событие
						var originEvent = event;
						while(originEvent.originalEvent){
							if(originEvent.type===EVENTS.CHANGE)
								break;
							originEvent = originEvent.originalEvent;
						}
						//обновляем измененный объект
						self.trigger(EVENTS.GEOMETRYCHANGE,{
							type:event.get('target').geometry.getType(),
							newCoordinates:originEvent.newCoordinates,
							oldCoordinates:originEvent.oldCoordinates
						});
					});
				}
				geoObject.events.add(EVENTS.CLICK, function () {
					self.select(self.findIndex(geoObject));
				});
			};

			/**
			 * увтанавливает максимально допустимое количество объектов на карте
			 * */
			YandexMapWrapper.prototype.setMaxCountGeometry = function(val){
				this._maxCountGeometry = val;
			};

			/**
			 * возвращает максимально допустимое количество объектов на карте
			 * */
			YandexMapWrapper.prototype.getMaxCountGeometry = function(){
				return this._maxCountGeometry ? this._maxCountGeometry : 0;
			};

			/**
			 * декрементирует текущее количество объектов на карте
			 * */
			YandexMapWrapper.prototype.decrementCountGeometry = function(){
				this._countGeometry--;
			};

			/**
			 * инкрементирует текущее количество объектов на карте
			 * */
			YandexMapWrapper.prototype.incrementCountGeometry = function(){
				if(!this._countGeometry){
					this._countGeometry = 0;
				}
				this._countGeometry++;
			};

			/**
			 * возвращает количество объектов на карте
			 * */
			YandexMapWrapper.prototype.getCountGeometry = function(){
				return this._countGeometry ? this._countGeometry : 0;
			};

			/**
			 * устанавливает типы геометрий, которые могут присутствовать на карте
			 * */
			YandexMapWrapper.prototype.setValidTypes = function(types){
				if(types){
					var validTypes = types.split(' ');
					var curTypes = validTypes.map(function(type){
						return angular.lowercase(type);
					});
					if(curTypes.indexOf('all')>-1){
						this._validTypes = [GEOMETRY_TYPES.POINT,GEOMETRY_TYPES.LINESTRING, GEOMETRY_TYPES.RECTANGLE,
							GEOMETRY_TYPES.POLYGON, GEOMETRY_TYPES.CIRCLE];
					}
					else{
						this._validTypes = [];
						for(var i= 0,ii=curTypes.length;i<ii;i++){
							this._validTypes.push(GEOMETRY_TYPES[angular.uppercase(curTypes[i])]);
						}
					}
				}else{
                    this._validTypes = [GEOMETRY_TYPES.POINT,GEOMETRY_TYPES.LINESTRING, GEOMETRY_TYPES.RECTANGLE,
                        GEOMETRY_TYPES.POLYGON, GEOMETRY_TYPES.CIRCLE];
				}
			};

			/**
			 * проверяет, является ли тип геометрии допустимым для данной карты
			 * */
			YandexMapWrapper.prototype.isValidType = function(type){
                return this._validTypes.indexOf(type)>-1;
			}

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
                SELECT_INDEX:'yaSelectIndex'
            },
		    directiveObj = {
			restrict:'AC',
			scope:{
				yaProperties:'=',
				yaGeoObjects:'=',
				yaSelectIndex:'='
			},
			link:function(scope, iElement, iAttrs){
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
                });

				//включаем отслеживаение изменений в scope
				scope.$watch(ATTRIBUTE_NAMES.GEO_OBJECTS, function(newGeoObjects){
					isRunAngularContext = true;
					map.synchronise(newGeoObjects);
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
			}
		};
		return directiveObj;
	}]);

