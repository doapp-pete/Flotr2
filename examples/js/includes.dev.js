yepnope([
  // Libs
  '../lib/bean-min.js',
  '../lib/underscore-min.js',
  {
  test : (navigator.appVersion.indexOf("MSIE") != -1  && parseFloat(navigator.appVersion.split("MSIE")[1]) < 9),
    // Load for IE < 9
    yep : [
      '../lib/excanvas.js',
      '../lib/base64.js',
      '../lib/canvastext.js'
    ]
  },
  'lib/codemirror/lib/codemirror.js',
  'lib/codemirror/mode/javascript/javascript.js',
  'lib/beautify.js',
  'lib/randomseed.js',
  'lib/jquery-1.7.1.min.js',

  // Flotr
  '../js/Flotr.js',
  '../js/DefaultOptions.js',
  '../js/Color.js',
  '../js/Date.js',
  '../js/DOM.js',
  '../js/EventAdapter.js',
  '../js/Text.js',
  '../js/Graph.js',
  '../js/Axis.js',
  '../js/Series.js',
  '../js/types/lines.js',
  '../js/types/bars.js',
  '../js/types/points.js',
  '../js/types/pie.js',
  '../js/types/candles.js',
  '../js/types/markers.js',
  '../js/types/radar.js',
  '../js/types/bubbles.js',
  '../js/types/gantt.js',
  '../js/types/timeline.js',
  '../js/plugins/download.js',
  '../js/plugins/selection.js',
  '../js/plugins/spreadsheet.js',
  '../js/plugins/grid.js',
  '../js/plugins/hit.js',
  '../js/plugins/crosshair.js',
  '../js/plugins/labels.js',
  '../js/plugins/legend.js',
  '../js/plugins/titles.js',

  // Examples
  'js/Examples.js',
  'js/ExampleList.js',
  'js/Example.js',
  'js/Editor.js',
  'js/Profile.js',
  'js/examples/basic.js',
  'js/examples/basic-axis.js',
  'js/examples/basic-bars.js',
  'js/examples/basic-bars-stacked.js',
  'js/examples/basic-pie.js',
  'js/examples/basic-radar.js',
  'js/examples/basic-bubble.js',
  'js/examples/basic-candle.js',
  'js/examples/basic-legend.js',
  'js/examples/mouse-tracking.js',
  'js/examples/mouse-zoom.js',
  'js/examples/mouse-drag.js',
  'js/examples/basic-time.js',
  'js/examples/negative-values.js',
  'js/examples/click-example.js',
  'js/examples/download-image.js',
  'js/examples/download-data.js',
  'js/examples/advanced-titles.js',
  'js/examples/color-gradients.js',
  'js/examples/profile-bars.js',
  'js/examples/basic-timeline.js',
  'js/examples/advanced-markers.js',

  { complete : function () { 
	  var
	  d1    = [],
	  d2    = [],
	  start = new Date("2009/01/01 01:00").getTime(),
	  options,
	  graph,
	  i, x, o,
	  container = document.getElementById("placeholder");
	  
	  d2[[],[],[],[]];
	  
	  d1.push([1230793200000,4]);
	  d1.push([1230879600000,13]);
	  d1.push([1230966000000,17]);
	  d1.push([1231052400000,23]);
	  
	  d2.push([1230793200000,5]);
	  d2.push([1230879600000,8]);
	  d2.push([1230966000000,13]);
	  d2.push([1231052400000,14]);
	
	// Draw Graph
	  graph = Flotr.draw(container, [ {data:d1, lines:{fill:true}}, {data:d2} ], {
	  colors:['#8cbdd7','#a1a1a1'],
	  shadowSize:0,
	  fontColor:"#616161",
	  xaxis: {
	    mode: 'time',
	  }, 
	  yaxis: {
	    noTicks:2
	  },
	  grid: {
	    backgroundColor:"#efefef",
	    horizontalLines: true,
	    verticalLines: false,
	    color:"#e1e1e1"
	  },
	  mouse: {
	  	track: true,
	  	trackAll: true,
	  	trackAllPoints: true,
	  	fillColor:"#efefef",
	  	fillOpacity:1
	  }
	});
//	  console.log(Flotr);
//      if (Flotr.ExamplesCallback) {
//        Flotr.ExamplesCallback();
//      } else {
//        Examples = new Flotr.Examples({
//          node : document.getElementById('examples')
//        });
//      }
    }
  }
]);
