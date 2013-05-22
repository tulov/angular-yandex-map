'use strict';

angular.module('yaMap', []).
	provider('YandexMapOptions', function(){
		var defaults = {
			//параметры передаваемые к конструктор карты
			params:{
				//yandex#map (схема) - по умолчанию;
				// yandex#satellite (спутник);
				// yandex#hybrid (гибрид);
				// yandex#publicMap (народная карта);
				// yandex#publicMapHybrid (гибрид народной карты)
				type: 'yandex#map',

				zoom:10, //от 0 до 23 включительно, 23 - самое большой массштаб

				//"default" — короткий 	синоним для включения/отключения поведений карты по умолчанию:
				// для настольных браузеров - "drag", "dblClickZoom", "rightMouseButtonMagnifier",
				// для мобильных - "drag", "dblClickZoom" и "multiTouch"
				//"drag" — перемещание 	карты при нажатой левой кнопке мыши либо одиночным касанием;
				//"scrollZoom" — изменение масштаба колесом мыши
				// "dblClickZoom" — масштабирование кар	ты двойным щелчком кнопки мыши
				// "multiTouch" — масштабирование карты двойным касанием (например, пальцами на сенсорном экране)
				// "rightMouseButtonMagnifier" — увеличение области, выделенной правой кнопкой мыши (только для настоль	ных браузеров)
				// "leftMouseButtonMagnifier" — увеличение области, выделенной левой кнопкой мыши либо одиночным касанием
				// "ruler" — измерение 	расстояния
				// "routeEditor" — редактор маршрутов
				behaviors:["default"] //массив поведений карты
			},
			//элементы управления, которые должны быть расположенны на карте
			controls:{
				//в этом массиве перечисляются имена контроллов для добавления со стандартными параметрами
				default:['zoomControl','typeSelector','mapTools','scaleLine','miniMap'],
				//а так можно добавить контрол со своими параметрами
				smallZoomControl: { right: 5, top: 75 }
			},
			//параметры отображения различных объектов на карте
			displayOptions:{
				//параметры отображения объектов в обычном состоянии
				general:{
					//эти параметры относятся ко всем объектам
					all:{
						//возможность перетаскивания мышью
						draggable: false,
						//ширина границы
						strokeWidth: 3,
						//цвет границы
						strokeColor: "#FFFF00",
						// Цвет и прозрачность заливки
						fillColor: '#ffff0022'
					},
					point:{
						// Иконка метки будет растягиваться под ее контент
						preset: 'twirl#pinkStretchyIcon'
					},
					linestring:{
						// Опции PolyLine
						// Сделать доступным для перетаскивания.
						draggable: true,
						strokeWidth: 5
					},
					// Опции прямоугольника
					rectangle:{
					},
					// Опции многоугольника
					polygon:{
						// Стиль линии
						strokeStyle: 'shortdash'
					},
					circle:	{
					}
				},
				//параметры отопражения выбранных объектов
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
		};
		var globalOptions={};
		this.options = function(val){
			globalOptions = val;
		};
		this.$get = function(){
			return {
				getParams:function(parameters){
					return angular.extend({}, defaults.params, globalOptions.params, parameters);
				},
				getControls:function(controls){
					if(controls)
						return controls;
					if(globalOptions.controls)
						return globalOptions.controls;
					if(defaults.controls)
						return defaults.controls;
				},
				getDisplayOptions:function(geoObjectType, options){
					var globalDisplay=globalOptions.displayOptions && globalOptions.displayOptions.general
						?globalOptions.displayOptions.general
						:{};
					return angular.extend(
						{},
						defaults.displayOptions.general.all,
						defaults.displayOptions.general[angular.lowercase(geoObjectType)],
						globalDisplay.all,
						globalDisplay[angular.lowercase(geoObjectType)],
						options
					);
				},
				getSelectedObjectDisplayOptions:function(){
					var globalSelectedDisplay=globalOptions.displayOptions && globalOptions.displayOptions.selected
						?globalOptions.displayOptions.selected
						:{};

					return angular.extend({}, defaults.displayOptions.selected, globalSelectedDisplay);
				}
			};
		};
	}).
	directive('yaMap', ['$window', 'YandexMapOptions', function($window, yaMapOptions) {
		var directiveObj = {
			restrict:'AC',
			scope:{
				yaProperties:'=',
				yaGeoObjects:'=',
				yaSelect:'='
			},
			template:'<div id="map"></div>',
			replace:true,
			link:function(scope, iElement, iAttrs){
				scope.yaProperties = scope.yaProperties || {};
				scope.yaSelect = scope.yaSelect || {};
				scope.yaGeoObjects = scope.yaGeoObjects || [];
				var map, i, ii, runAngularContext = false,
					editingTypes=['LineString', 'Polygon'],
					mode,
					modes=['view','select','edit'],
					setMode=function(){
						var m = iAttrs['yaMode'] ? iAttrs['yaMode'] : 'view';
						if(modes.indexOf(m)>-1){
							mode = m;
						}else{
							mode = 'view';
						}
					},
					selectedGeoObject=null,
					backOptionsSelectedGeoObject=null,
					//находит объект во входной коллекции ангулаг
					findGeoObject = function(coordinates, type){
						var result = null;
						angular.forEach(scope.yaGeoObjects, function(obj){
							if(obj.geometry.type === type
								&& angular.equals(obj.geometry.coordinates, coordinates)){
								result = obj;
							}
						});
						return result;
					},
					//находит гео объект на карте по его представлению в области видимости
					findGeoObjectOnMap = function(geoObjInScope){
						var index = scope.yaGeoObjects.indexOf(geoObjInScope),
							result = null;
						map.geoObjects.each(function(geoObj){
							if(geoObj.properties.get('index')===index){
								result = geoObj;
								return false;
							}
						});
						return result;
					},
					//отмена выделения текщего выбранного объекта
					deselect = function(){
						if(selectedGeoObject && backOptionsSelectedGeoObject){
							//востанавливаем старые значения
							for(var option in backOptionsSelectedGeoObject){
								selectedGeoObject.options.set(option, backOptionsSelectedGeoObject[option]);
							}
							//прекращаем редактирование
							if(hasEditor(selectedGeoObject)){
								selectedGeoObject.editor.stopEditing();
							}
						}
						//очищаем старые значения
						backOptionsSelectedGeoObject = null;
						selectedGeoObject = null;
						if(runAngularContext){
							scope.yaSelect = null;
						}else{
							scope.$apply(function(){
								scope.yaSelect = null;
							})
						}
					},
					//установка выбранного объекта
					select = function(geoObj){
						deselect();
						var backOptions = {},
							selectedOptions = yaMapOptions.getSelectedObjectDisplayOptions();

						for(var option in selectedOptions){
							//сохраняем старые опции объекта, которые будем менять
							backOptions[option]=geoObj.options.get(option);
							//задаем ему новые опции
							geoObj.options.set(option, selectedOptions[option]);
						}

						//включаем режим редактирования
						if(hasEditor(geoObj)){
							geoObj.editor.startEditing();
						}
						backOptionsSelectedGeoObject = backOptions;
						selectedGeoObject = geoObj;
						if(runAngularContext){
							scope.yaSelect = findGeoObject(geoObj.geometry.getCoordinates(), geoObj.geometry.getType());
						}else{
							scope.$apply(function(){
								scope.yaSelect = findGeoObject(geoObj.geometry.getCoordinates(), geoObj.geometry.getType());
							});
						}
					},
					//возвращает true, если geoObj поддерживает визуальное редактирование
					hasEditor = function(geoObj){
						return editingTypes.indexOf(geoObj.geometry.getType())>-1
					},
					isEditable = function(){
						return mode === 'edit';
					},
					isSelectable = function(){
						return mode === 'select' || isEditable();
					},
					//подписка на события
					subscribeEvent = function(geoObject){
						if(isEditable()){
							geoObject.events.add('geometrychange', function (event) {
								if(!runAngularContext){
									//получаем оригинальное событие
									var originEvent = event;
									while(originEvent.originalEvent){
										if(originEvent.type==='change')
											break;
										originEvent = originEvent.originalEvent;
									}
									//обновляем измененный объект
									scope.$apply(function(){
										var obj = findGeoObject(originEvent.oldCoordinates, event.get('target').geometry.getType());
										obj.geometry.coordinates = originEvent.newCoordinates;
									});
								}
							});
						}
						geoObject.events.add('click', function () {
							select(geoObject);
						});
					},
					changeGeoObjectOnMap = function(geoObjOnMap, geoObjInScope){
						var type = geoObjOnMap.geometry.getType();
						if(type==='Circle'){
							geoObjOnMap.geometry.setRadius(geoObjInScope.geometry.radius);
						}
						geoObjOnMap.geometry.setCoordinates(geoObjInScope.geometry.coordinates);
					},
					removeFromMap = function(geoObj){
						if(geoObj===selectedGeoObject){
							deselect();
						}
						map.geoObjects.remove(geoObj);
					},
					synchronise = function(changedGeoObjects){
						var processedIds = [], removedGeoObjects=[], addedGeoObjects=[];
						map.geoObjects.each(function(geoObj){
							var index = geoObj.properties.get('index'),
								curElement = changedGeoObjects[index];
							if(curElement){
								if(geoObj.geometry.getType()===curElement.geometry.type){
									changeGeoObjectOnMap(geoObj, curElement);
								}else{
									removedGeoObjects.push(geoObj);
									addedGeoObjects.push({index:index, element:curElement});
								}
							}else{
								removedGeoObjects.push(geoObj);
							}
							processedIds[index]=true;
						});
						for(var j= 0, jj=changedGeoObjects.length; j<jj; j++){
							if(processedIds[j]){
								continue;
							}
							addedGeoObjects.push({index:j, element:changedGeoObjects[j]});
						}
						for(j=0,jj=removedGeoObjects.length;j<jj;j++){
							removeFromMap(removedGeoObjects[j]);
						}
						for(j=0,jj=addedGeoObjects.length;j<jj;j++){
							addOnMap(addedGeoObjects[j].element,addedGeoObjects[j].index);
						}
					},
					addOnMap = function(geoObj, index){
						var displayOptions = getDisplayOptions(geoObj);
						var mapGeoObject = new ymaps.GeoObject(geoObj,
							yaMapOptions.getDisplayOptions(geoObj.geometry.type, displayOptions)
						);
						mapGeoObject.properties.set('index', index);
						//т.к. координаты замкнутых фигур могут не содержать последней точки, мы их обновляем
						//так чтобы эта точка была
						if(geoObj.geometry.type === 'Polygon'){
							if(runAngularContext){
								geoObj.geometry.coordinates = mapGeoObject.geometry.getCoordinates();
							}else{
								scope.$apply(function(){
									geoObj.geometry.coordinates = mapGeoObject.geometry.getCoordinates();
								});
							}
						}

						map.geoObjects.add(mapGeoObject);

						//если режим редактирования, тогда подписываемся на события
						if(isEditable() || isSelectable()){
							if(angular.equals(scope.yaSelect, geoObj)){
								select(mapGeoObject);
							}
							subscribeEvent(mapGeoObject);
						}
					},
					getDisplayOptions = function(geoObj){
						//если режим редактирования, тогда всем элементам добавляем поведение перетаскивания мышью
						if(isEditable()){
							return angular.extend({}, geoObj.displayOptions, {draggable: true})
						}else{
							return geoObj.displayOptions;
						}
					},
					//создание екземпляра карты и отображение объектов
					createMap=function(params, controls, geoObjects){
						setMode();
						map = new ymaps.Map('map', params);
						for(var control in controls){
							if(control==='default'){
								var d = controls[control];
								for(i= 0,ii= d.length;i<ii;i++){
									map.controls.add(d[i]);
								}
							}else{
								map.controls.add(control, controls[control]);
							}
						}

						//добавляем объекты на карту
						for(i = 0, ii= geoObjects.length; i<ii; i++){
							addOnMap(geoObjects[i], i);
						}

						//включаем отслеживаение изменений в коллекции гео данных
						scope.$watch('yaGeoObjects', function(newGeoObjects){
							runAngularContext = true;
							synchronise(newGeoObjects);
							runAngularContext = false;
						}, function(){return false});

						scope.$watch('yaSelect', function(newSelect){
							runAngularContext = true;
							if(newSelect===null){
								deselect();
							}else{
								var geoObj = findGeoObjectOnMap(newSelect);
								select(geoObj);
							}
							runAngularContext = false;
						});
					};
				ymaps.ready(function(){
					var params = yaMapOptions.getParams(scope.yaProperties.params),
						controls = yaMapOptions.getControls(scope.yaProperties.controls),
						geoObjs = scope.yaGeoObjects;
					if (undefined === params.zoom) {
						params.zoom = 10;
					}

					//если не переданы параметры центр, тогда по API определяем его
					if(!params.center){
						params.center =  [ymaps.geolocation.latitude, ymaps.geolocation.longitude];
					}

					//если переданы координаты начальной точки
					if(angular.isArray(params.center)){
						createMap(params,controls, geoObjs);
					}
					//иначе считаем что передан адрес начальной точки
					else{
						// Поиск координат переданного адреса
						ymaps.geocode(params.center, { results: 1 }).then(function (res) {
							var firstGeoObject = res.geoObjects.get(0);
							params.center = firstGeoObject.geometry.getCoordinates();
							createMap(params,controls, geoObjs);
						}, function (err) {
							// Если геокодирование не удалось, сообщаем об ошибке
							$window.alert(err.message);
						})
					}
				});
			}
		};
		return directiveObj;
	}]);

