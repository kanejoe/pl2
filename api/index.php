<?php
require 'Slim/Slim.php';
require 'db.php';

$app = new Slim();

//require('Slim/Pusher.php');
/*$pusher = new Pusher('b4ecb0e71bc6c0677fa1', 'dc064e15fdf218e3f23f', '7117');
$pusher->trigger('chCourts', 'juris', 'updating the courts');
*/
$app->get('/init', 'getAll');

$app->get('/today', 'getToday');
$app->post('/today', 'addCall');


$app->get('/courts/:id', 'getCourt');
$app->get('/courts/search/:query', 'findByName');
$app->post('/courts', 'addCourts');
$app->put('/courts/:id', 'updateCourts');
$app->delete('/courts/:id',	'deleteCourts');

$app->run();

function getAll() {
	$sql = "SELECT callid, caller, COUNT( caller ) AS countCaller, GROUP_CONCAT( DISTINCT phone ) AS numbers FROM tblcalls GROUP BY caller";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$wines = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		header("Access-Control-Allow-Origin: *"); // http://enable-cors.org/#how-php
		echo json_encode($wines);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function getToday() { // get the cases from a particular court list
	$cid = '2012-02-16';
	$sql = "SELECT * FROM tbl_calls WHERE calldate=:cid" ;
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$stmt->bindParam("cid", $cid);
		$stmt->execute();
		$cases = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;	
		header("Access-Control-Allow-Origin: *"); // http://enable-cors.org/#how-php
		echo json_encode($cases);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function addCall() {
	//error_log('addWine\n', 3, '/var/tmp/php.log');
	$request = Slim::getInstance()->request();
	$call = json_decode($request->getBody());
	$sql = "INSERT INTO tbl_calls (caller, calldate, calltime) VALUES (:caller, :calldate, :calltime)";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("caller", $call->caller);
		$stmt->bindParam("calldate", $call->calldate);
		$stmt->bindParam("calltime", $call->calltime);
		$stmt->execute();
		$call->id = $db->lastInsertId();
		$db = null;
		echo json_encode($call); 
	} catch(PDOException $e) {
		//error_log($e->getMessage(), 3, '/var/tmp/php.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}



function getCourt($id) {
	$sql = "SELECT * FROM courts WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$wine = $stmt->fetchObject();  
		$db = null;
		echo json_encode($wine); 
		
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function addCourts() {
	//error_log('addWine\n', 3, '/var/tmp/php.log');
	$request = Slim::getInstance()->request();
	$wine = json_decode($request->getBody());
	$sql = "INSERT INTO courts (courtname) VALUES (:courtname)";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("courtname", $wine->courtname);
		$stmt->execute();
		$wine->id = $db->lastInsertId();
		$db = null;
		echo json_encode($wine); 
	} catch(PDOException $e) {
		//error_log($e->getMessage(), 3, '/var/tmp/php.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function updateCourts($id) {
	$request = Slim::getInstance()->request();
	$body = $request->getBody();
	$juris = json_decode($body);
	$sql = "UPDATE courts SET courtname=:courtname WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("courtname", $juris->courtname);
		$stmt->bindParam("id", $id);
		
		$stmt->execute();
		$db = null;
		echo json_encode($juris); 
		
		$pusher = new Pusher('b4ecb0e71bc6c0677fa1', 'dc064e15fdf218e3f23f', '7117');
		$pusher->trigger('chCourts', 'juris', $juris->courtname);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function deleteCourts($id) {
	$sql = "DELETE FROM courts WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$db = null;
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function findByName($query) {
	$sql = "SELECT * FROM wine WHERE UPPER(courtname) LIKE :query ORDER BY courtname";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$query = "%".$query."%";  
		$stmt->bindParam("query", $query);
		$stmt->execute();
		$wines = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo '{"wine": ' . json_encode($wines) . '}';
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}


function updateCases($id) {
	$request = Slim::getInstance()->request();
	$body = $request->getBody();
	$case = json_decode($body);
	$sql = "UPDATE caselist SET favourite=:favourite WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("favourite", $case->favourite);
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$db = null;
		echo json_encode($case); 		
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}


?>