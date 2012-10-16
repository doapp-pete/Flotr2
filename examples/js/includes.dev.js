
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


  { complete : function () { 
	  var
	  d1    = [],
	  d2    = [],
	  d3 	= [],
	  start = new Date("2009/01/01 01:00").getTime(),
	  options,
	  graph,
	  i, x, o,
	  container = document.getElementById("placeholder");
	  
	  
	  d1.push([1230793200000,4]);
	  d1.push([1230879600000,13]);
	  d1.push([1230966000000,17]);
	  d1.push([1231052400000,23]);
	  
	  d2.push([1230793200000,5]);
	  d2.push([1230879600000,8]);
	  d2.push([1230966000000,13]);
	  d2.push([1231052400000,14]);
	  

	  d3.push([1230793200000,25]);
	  d3.push([1230879600000,13]);
	  d3.push([1230966000000,16]);
	  d3.push([1231052400000,12]);
	
	// Draw Graph
	  graph = Flotr.draw(container, [ {data:d1,format:{time:true, label:"Unique Users",labelImage:"http://sandbox.local/blue.png"}}, 
	                                  {data:d2, format:{label:"New Users",labelImage:"http://sandbox.local/gray.png"},lines:{fill:true}}, 
	                                  {data:d3, format:{label:"Android",labelImage:"http://sandbox.local/gray.png"}} ], {
	  colors:['#8cbdd7','#a1a1a1', '#CB4B4B'],
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
	  	relative: true,
	  	fillColor:"#efefef",
	  	fillOpacity:1,
	  	trackFormatter: Flotr.customTrackFormater
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
