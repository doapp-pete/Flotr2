<?php 

$appId= '7f6b79cc84e7849f95246e863c7cf059';
if(isset($_GET['appId'])){
	$appId = $_GET['appId'];
}

//select everything.
try {
	$mongInst = new Mongo('pete.server');
	$dbSel = $mongInst->selectDB('generic_metrics');
	$col = $dbSel->selectCollection('i_usage_item');
	$cursor = $col->find(array('_id.appId'=>$appId));
	
}
catch(Exception $e){
  print_r($e);
}

$appMetrics = array();
$i=0;

foreach ($cursor as $obj) {
	$unixTime = strtotime($obj['_id']['date']);
	if(!isset($appMetrics[$unixTime])){
		$appMetrics[$unixTime] = array('iphone'=>0, 'android'=>0, 'ipad'=>0, 'ipod'=>0);
	}
	
	if(isset($appMetrics[$unixTime][$obj['_id']['device']])){
		$appMetrics[$unixTime][$obj['_id']['device']]+=$obj['value']['total_users'];
	}
	else {
		print_r($obj);
		exit;
	}
	$i++;
 	
  
}
ksort($appMetrics);
?><!DOCTYPE html>
<html>


<head>
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<title>Flotr Example Index Page</title>
<link rel="stylesheet" href="lib/codemirror/lib/codemirror.css"
	type="text/css" />
<link rel="stylesheet" href="examples.css" type="text/css" />
<link rel="stylesheet" href="editor.css" type="text/css" />
<style>
.line_pop_over {
	border: 1px solid #9f9f9f;
	float: left;
	padding: 5px 10px;
	background-color: #ffffff;
	font-size: 12px;
	font-family: "Helvetica Neue";
	line-height: 22px;
	box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.18);
	-moz-box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.18);
	-webkit-box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.18);
}

h6 {
	font-size: 12px;
	margin: 0px;
	padding: 0px;
	margin-bottom: 2px;
}

.line_pop_over span {
	font-weight: bold;
}

.line_pop_over img {
	margin-right: 8px;
}
</style>
</head>

<body>
	<h1>Flot Examples</h1>
	<div id="placeholder" style="width: 600px; height: 300px;"></div>

</body>
<script>
var
d1    = [],
d2    = [],
d3    = [],
d4    = [];

<?php 

foreach($appMetrics as $key=>$value){
  echo('d1.push(['.$key.'000,'.$value['iphone'].']);'."\n");
  echo('d2.push(['.$key.'000,'.$value['android'].']);'."\n");
  echo('d3.push(['.$key.'000,'.$value['ipad'].']);'."\n");
  echo('d4.push(['.$key.'000,'.$value['ipod'].']);'."\n");
}
?>
</script>

<script type="text/javascript" src="/flotr2.min.js"></script>
<script>

var graph,
container = document.getElementById("placeholder");


// Draw Graph
graph = Flotr.draw(container, [ {data:d1,format:{time:true, label:"iPhone",labelImage:"http://sandbox.local/blue.png"}}, 
                                {data:d2, format:{label:"Android",labelImage:"http://sandbox.local/gray.png"},lines:{fill:false}}, 
                                {data:d3, format:{label:"iPad",labelImage:"http://sandbox.local/gray.png"}},
                                {data:d4, format:{label:"iPod",labelImage:"http://sandbox.local/blue.png"}} ], {
	colors:['#8cbdd7','#a1a1a1', '#CB4B4B', '#C812BA'],
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

</script>
</html>
