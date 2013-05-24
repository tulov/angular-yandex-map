'use strict';

angular.module('yaMap', []).
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
			modes=['view','select','edit', 'add'],
			//возвращает true, если geoObj поддерживает визуальное редактирование
			hasEditor = function(geoObj){
				return editingTypes.indexOf(geoObj.geometry.getType())>-1
			},
			getDisplayOptions=function(geoObjectType, mode){
				var globalDisplay=globalOptions.displayOptions && globalOptions.displayOptions.general
					?globalOptions.displayOptions.general
					:{},
					modeOptions = mode === 'edit' || mode === 'add' ? {draggable:true} : {};
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
			VALID_TYPES_POINT = 'Point',
			VALID_TYPES_LINE_STRING = 'LineString',
			VALID_TYPES_RECTANGLE = 'Rectangle',
			VALID_TYPES_POLYGON = 'Polygon',
			VALID_TYPES_CIRCLE = 'Circle',
			VALID_TYPES = {
				point:VALID_TYPES_POINT,
				linestring:VALID_TYPES_LINE_STRING,
				rectangle:VALID_TYPES_RECTANGLE,
				polygon:VALID_TYPES_POLYGON,
				circle:VALID_TYPES_CIRCLE
			};


		this.options = function(val){
			globalOptions = val;
		};

		this.$get = ['$window', function($window){
			/**
			* Конструктор
			* divId идентификатор div в котором будем создавать карту
			 * mapParams параметры карты
			 * mapControls элементы управления картой
			 * mapMode режим работы карты. (view, select, edit)
			* */
			function YandexMapWrapper(divId, mapParams, mapControls, mapMode, validTypes, maxCountGeometry){
				var self = this,
					//устанавливает режим работы карты
					setMode=function(val){
						var m = val ? val : 'view';
						if(modes.indexOf(m)>-1){
							self.mode = m;
						}else{
							self.mode = 'view';
						}
					},
					//создание екземпляра карты
					createMap=function(params, controls){
						setMode(mapMode);
						self._map = new ymaps.Map(divId, params);
						for(var control in controls){
							if(control==='default'){
								var d = controls[control];
								for(var i= 0,ii= d.length;i<ii;i++){
									self._map.controls.add(d[i]);
								}
							}else{
								self._map.controls.add(control, controls[control]);
							}
						}

						self.collections={};
						var collectionKey, type;
						for(var i=0, ii=self._validTypes.length;i<ii;i++){
							type=self._validTypes[i];
							collectionKey = angular.lowercase(type);
							self.collections[collectionKey] =
								new ymaps.GeoObjectCollection({},getDisplayOptions(type, self.mode));
						}

						self._allGeoObjects = {};
						self._selectedObjectIndex = null;
						self.selectedObjectBackOptions = null;
						
						//добавляем коллекции на карту
						for(var key in self.collections){
							self._map.geoObjects.add(self.collections[key]);
						}

						//генерируем событие, карта создана
						self.trigger('mapcreated');
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
				return this.mode === 'edit';
			};
			/**
			 * возвращает возможность выбора мышью элементов катры
			 * */
			YandexMapWrapper.prototype.isSelectable = function(){
				return this.mode === 'select' || this.isEditable();
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
			YandexMapWrapper.prototype._createGeoObject = function(data, index){
				if(!this.possibleCreateGeoObject(data.geometry.type)){
					return;
				}
				if(!angular.isObject(data)){
					throw new Error('data has been Object');
				}
				if(!data.geometry){
					throw new Error('Not property geometry');
				}

				if(!data.geometry.type){
					throw new Error('Not property geometry.type');
				}
				else if(data.geometry.type === 'Circle' && !data.geometry.radius){
					throw new Error('Not property geometry.radius');
				}

				if(!data.geometry.coordinates){
					throw new Error('Not property geometry.coordinates');
				}
				else if(!angular.isArray(data.geometry.coordinates)){
					throw new Error('geometry.coordinates has been Array');
				}

				var key = angular.lowercase(data.geometry.type),
					geoObject = new ymaps.GeoObject(data, data.displayOptions);
				this.collections[key].add(geoObject);
				if(this._allGeoObjects[index]){
					throw new Error('index already busy');
				}
				this._allGeoObjects[index]={mapObject:geoObject, originObject:data};
				if(data.geometry.type === 'Polygon'){
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
					this.onOne('mapcreated', fn);
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
								addedGeoObjects.push({index:i,element:curSourceElement});
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
						addedGeoObjects.push({index:i, element:changedData[i]});
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
			};

			/**
			 * изменяет гео объект
			 * */
			YandexMapWrapper.prototype.changeGeoObject = function(geoObjOnMap, geoObjInSource){
				var type = geoObjOnMap.geometry.getType();
				if(type==='Circle'){
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
				this.trigger('selectchange',{newIndex:val,oldIndex:backValue});
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
						selectedObject.options.set(this.selectedObjectBackOptions);
						if(hasEditor(selectedObject)){
							selectedObject.editor.stopEditing();
						}
					}

					//очищаем старые значения
					this.selectedObjectBackOptions = null;
					this.setSelectedObjectIndex(null);
					/*
					 if(runAngularContext){
					 scope.yaSelect = null;
					 }else{
					 scope.$apply(function(){
					 scope.yaSelect = null;
					 })
					 }
					 */
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
						geoObj = this._allGeoObjects[index].mapObject;

					for(var option in selectedOptions){
						//сохраняем старые опции объекта, которые будем менять
						backOptions[option]=geoObj.options.get(option);
					}
					//задаем ему новые опции
					geoObj.options.set(selectedOptions);

					//включаем режим редактирования
					if(hasEditor(geoObj)){
						geoObj.editor.startEditing();
					}
					this.selectedObjectBackOptions = backOptions;
					this.setSelectedObjectIndex(index);
				};
				this.callFunctionForMap(fn);
			};

			/**
			 * возвращает индеск гео объекта в коллекции
			 * */
			YandexMapWrapper.prototype.findIndex = function(geoObject){
				var result = null;
				angular.forEach(this._allGeoObjects, function(value, key){
					if(value.mapObject === geoObject){
						result = key;
					}
				});
				return result;
			};

			/**
			 * подписывает объекты на события
			 * */
			YandexMapWrapper.prototype._subscribeEvent = function(geoObject){
				var self = this;
				if(this.isEditable()){
					geoObject.events.add('geometrychange', function (event) {
						//получаем оригинальное событие
						var originEvent = event;
						while(originEvent.originalEvent){
							if(originEvent.type==='change')
								break;
							originEvent = originEvent.originalEvent;
						}
						//обновляем измененный объект
						self.trigger('geometrychange',{
							type:event.get('target').geometry.getType(),
							newCoordinates:originEvent.newCoordinates,
							oldCoordinates:originEvent.oldCoordinates
						});
					});
				}
				geoObject.events.add('click', function () {
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
						this._validTypes = [VALID_TYPES_POINT,VALID_TYPES_LINE_STRING, VALID_TYPES_RECTANGLE,
							VALID_TYPES_POLYGON, VALID_TYPES_CIRCLE];
					}
					else{
						this._validTypes = [];
						for(var i= 0,ii=curTypes.length;i<ii;i++){
							this._validTypes.push(VALID_TYPES[curTypes[i]]);
						}
					}
				}else{
					this._validTypes = [VALID_TYPES_POINT,VALID_TYPES_LINE_STRING, VALID_TYPES_RECTANGLE,
						VALID_TYPES_POLYGON, VALID_TYPES_CIRCLE];
				}
			};

			/**
			 * проверяет, является ли тип геометрии допустимым для данной карты
			 * */
			YandexMapWrapper.prototype.isValidType = function(type){
				return this._validTypes.indexOf(type)>-1;
			}

			return {
				createMap:function(divId, params, controls, mode, validTypes, maxCoutnGeometry){
					return new YandexMapWrapper(divId, params, controls, mode, validTypes, maxCoutnGeometry);
				}
			};
		}];
	}).
	directive('yaMap', ['$window', 'YandexMap', function($window, yandexMap) {
		var directiveObj = {
			restrict:'AC',
			scope:{
				yaProperties:'=',
				yaGeoObjects:'=',
				yaSelectIndex:'='
			},
			template:'<div id="map"></div>',
			replace:true,
			link:function(scope, iElement, iAttrs){
				var isRunAngularContext = false,
					maxCountGeometry = iAttrs["yaMaxCountGeometry"] ? iAttrs['yaMaxCountGeometry'] * 1 : 0;


				//устанавливаем значения по умолчанию
				scope.yaProperties = scope.yaProperties || {};
				scope.yaSelectIndex = scope.yaSelectIndex || null;
				scope.yaGeoObjects = scope.yaGeoObjects || [];

				//создаем новую карту в диве в идентификатором 'map', с параметрами заданными во втором аргументе
				//элементы управления задаются в третьем елементе, режим карты задаем в последнем аргументе.
				//допустимые режимы 'veiw','select' или 'edit'
				var map = yandexMap.createMap('map',
					scope.yaProperties.params,
					scope.yaProperties.controls,
					iAttrs['yaMode'],
					iAttrs['yaValidTypes'],
					maxCountGeometry
				);

				//создаем на карте объекты
				map.createGeoObject(scope.yaGeoObjects);

				//подписываемся на события карты
				map.on('geometrychange',function(eventData){
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
				map.on('selectchange',function(eventData){
					if(isRunAngularContext){
						scope.yaSelectIndex	= eventData.newIndex;
					}else{
						scope.$apply(function(){
							scope.yaSelectIndex	= eventData.newIndex;
						});
					}
				});

				//включаем отслеживаение изменений в scope
				scope.$watch('yaGeoObjects', function(newGeoObjects){
					isRunAngularContext = true;
					map.synchronise(newGeoObjects);
					isRunAngularContext = false;
				}, function(){return false});
				scope.$watch('yaSelectIndex', function(newSelectIndex){
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

