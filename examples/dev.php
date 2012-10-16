<!DOCTYPE html>
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
start = new Date("2012/04/25 00:00").getTime(),
options,
graph,
i, x, o,
container = document.getElementById("placeholder");

<?php 
//select everything.
try {
$mongInst = new Mongo();
$dbSel = $mongInst->selectDB('metric_agg');
$col = $dbSel->selectCollection('DailyItems');
$cursor = $col->find(array('_metaData.appId'=>'fac245c0cd451a91e8fa12de5db066de'));

$todaysMetrics = array();
$todaysMetrics = array();
$devices = array();
$uDevices = array();
$i=0;
$e=0;
}
catch(Exception $e){
  print_r($e);
}
foreach ($cursor as $obj) {
  $devices[$obj['_metaData']['deviceType']]=0;
  $date = $obj['_metaData']['date'];
  
  foreach($obj['hours'] as $hour=>$data){
        $trackedDate = $date.' ';
    if($hour<10){
      $trackedDate.='0';
    }
    $trackedDate.=$hour.':00:00 GMT';


    if(!isset($todaysMetrics[strtotime($trackedDate)])){
      $todaysMetrics[strtotime($trackedDate)] =0;
    }
    
    $todaysMetrics[strtotime($trackedDate)]  += $data['userSessions'];
    $i+=$data['userSessions'];
    $devices[$obj['_metaData']['deviceType']]+= $data['userSessions'];
  }
  
}

$uniqueSessions = array();
foreach ($cursor as $obj) {
  $uDevices[$obj['_metaData']['deviceType']]=0;
  $date = $obj['_metaData']['date'];

  foreach($obj['hours'] as $hour=>$data){
    $trackedDate = $date.' ';
    if($hour<10){
      $trackedDate.='0';
    }
    $trackedDate.=$hour.':00:00 GMT';


    if(!isset($uniqueSessions[strtotime($trackedDate)])){
      $uniqueSessions[strtotime($trackedDate)] =0;
    }

    $uniqueSessions[strtotime($trackedDate)]  += $data['userNewSessions'];
    $e+=$data['userNewSessions'];
    $uDevices[$obj['_metaData']['deviceType']]+= $data['userNewSessions'];
  }

}

foreach($todaysMetrics as $key=>$value){
  echo('d1.push(['.$key.'000,'.$value.']);');
}

foreach($uniqueSessions as $key=>$value){
  echo('d2.push(['.$key.'000,'.$value.']);');
}

?>


</script>
<?php 
echo('<pre>');
echo('Total: '.$i.'<br />Unique: '.$e.'<br />');
print_r($devices);
print_r($uDevices);
?>
<script type="text/javascript" src="../lib/yepnope.js"></script>
<script type="text/javascript" src="js/includes.dev.js"></script>
</html>
