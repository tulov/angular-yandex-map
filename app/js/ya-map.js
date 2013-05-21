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
				type: 'yandex#satellite',

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
				//эти параметры относятся ко всем объектам
				all:{
					draggable: false
				},
				point:{
					// Иконка метки будет растягиваться под ее контент
					preset: 'twirl#pinkStretchyIcon'
				},
				linestring:{
					// Опции PolyLine
					// Сделать доступным для перетаскивания.
					draggable: true,
					// Задаем цвет - желтый
					strokeColor: "#FFFF00",
					strokeWidth: 5
				},
				rectangle:{
					// Опции прямоугольника
					// Объект нельзя перетаскивать
					draggable: false,
					// Цвет и прозрачность заливки
					fillColor: '#ffff0022',
					// Цвет и прозрачность границ
					strokeColor: '#3caa3c88',
					// Ширина линии
					strokeWidth: 7
				},
				polygon:{
					// Опции многоугольника
					// Цвет заливки (зеленый)
					fillColor: '#00FF00',
					// Цвет границ (синий)
					strokeColor: '#0000FF',
					// Прозрачность (полупрозрачная заливка)
					opacity: 0.6,
					// Ширина линии
					strokeWidth: 5,
					// Стиль линии
					strokeStyle: 'shortdash'
				},
				circle:	{
					// Круг нельзя перемещать
					draggable: false,
					// Цвет заливки. Последние цифры "77" - прозрачность.
					// Прозрачность заливки также можно указывать в "fillOpacity".
					fillColor: "#DB709377",
					// Цвет и прозрачность линии окружности.
					strokeColor: "#990066",
					strokeOpacity: 0.8,
					// Ширина линии окружности
					strokeWidth: 5
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
					var globalDisplay = globalOptions.displayOptions || {};
					return angular.extend(
						{},
						defaults.displayOptions.all,
						defaults.displayOptions[angular.lowercase(geoObjectType)],
						globalDisplay.all,
						globalDisplay[angular.lowercase(geoObjectType)],
						options
					);
				}
			};
		};
	}).
	directive('yaMap', ['$window', 'YandexMapOptions', function($window, yaMapOptions) {
		var directiveObj = {
			restrict:'AC',
			scope:{
				yaProperties:'=',
				yaGeoObjects:'='
			},
			template:'<div id="map"></div>',
			replace:true,
			link:function(scope, iElement, iAttrs){
				scope.yaProperties = scope.yaProperties || {};
				scope.yaGeoObjects = scope.yaGeoObjects || [];
				var map, i, ii, clickingGeoObjects=[],
					//подписка на события
					subscribeEvent = function(geoObject){
						var editingTypes=['LineString', 'Polygon']

						geoObject.events.add('geometrychange', function (event) {
							//получаем оригинальное событие
							var originEvent = event;
							while(originEvent.originalEvent){
								if(originEvent.type==='change')
									break;
								originEvent = originEvent.originalEvent;
							}

							//обновляем измененный объект
							scope.$apply(function(){
								angular.forEach(scope.yaGeoObjects, function(go){
									if(angular.equals(go.geometry.coordinates, originEvent.oldCoordinates)){
										go.geometry.coordinates = originEvent.newCoordinates;
									}
								});
							});
						});
						//если объект относиться к редактируемому типу, устанавливаем обработчик
						if(editingTypes.indexOf(geoObject.geometry.getType())>-1){
							clickingGeoObjects.push(geoObject);
							geoObject.events.add('click', function () {
								for(var j= 0, jj=clickingGeoObjects.length;j<jj;j++){
									clickingGeoObjects[j].editor.stopEditing();
								}
								geoObject.editor.startEditing();
							});
						}
					},
					//создание екземпляра карты и отображение объектов
					createMap=function(params, controls, geoObjects){
						var mode = iAttrs['yaMode'] === 'edit' ? 'edit' : 'read';
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
						var geoObj, mapGeoObject, displayOptions;

						//добавляем объекты на карту
						for(i = 0, ii= geoObjects.length; i<ii; i++){
							geoObj=geoObjects[i];
							//если режим редактирования, тогда всем элементам добавляем поведение перетаскивания мышью
							if(mode==='edit'){
								displayOptions = angular.extend({}, geoObj.displayOptions, {draggable: true})
							}else{
								displayOptions = geoObj.displayOptions;
							}
							mapGeoObject = new ymaps.GeoObject(geoObj,
								yaMapOptions.getDisplayOptions(geoObj.geometry.type, displayOptions)
							);
							//если режим редактирования, тогда подписываемся на события
							if(mode==='edit'){
								subscribeEvent(mapGeoObject);
							}
							//т.к. координаты замкнутых фигур могут не содержать последней точки, мы их обновляем
							//так чтобы эта точка была
							scope.$apply(function(){
								geoObj.geometry.coordinates = mapGeoObject.geometry.getCoordinates();
							})

							map.geoObjects.add(mapGeoObject);
						}
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

