yaMap
==========

**yaMap** This is an easy way to add a Yandex map to your page AngularJS

Using
-----
1. Add api support yandex map and yaMap module:

   ```html
   <script src="js/ya-map.js"></script>
   ```
2. Specify dependence yaMap module for your application:

   ```javascript
   var app = angular.module('myApp', ['yaMap']);
   ```

3. Configure the service provider YandexMapProvider

   ```javascript
   app.config(['YandexMapProvider', function(yaMapOptions){
       		yaMapOptions.options({
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
       				},
                       //параметры отображения рисуемых объектов
                       drawing:{
                           strokeWidth: 1,
                           strokeColor: "#000000",
                           fillColor: '#00ffff10',
                           strokeStyle: 'shortdash'
                       }
       			}
       		});

       	}]);
   ```

4. When you need a map on your page, use the following markup. Set the style for the div that displays the map. To display the map you need to set the width and height.:

   ```html
   <div style="width:600px;height:400px;" ya-map ng-model="geoObjects" ya-properties="mapProperties" ya-select-index="selectIndex"></div>
   ```
Example
-----
[Demo](http://tulov-alex.ru)

A directory in the example are examples of the directive.
You need to run the examples:
    1 run bower install in the root folder
    2 start node web-server.js in the root folder.
    3 type in the browser to: localhost: 8000
