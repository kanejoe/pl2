<?php
/* 
NEEDS A QUERY STRING: READ THE RULES ON WHAT COMBINATIONS OF VALUES ARE ALLOWED... 

If you get errors, please read about HTTP status codes at http://en.wikipedia.org/wiki/List_of_HTTP_status_codes

Examples (restrictions apply with test api key):

Search for Google. Show a max of 10 rows. Both business names and Companies:
http://localhost/testjson.php?company_name=google&max=10&company_bus_ind=e

Search for Google business names only:
http://localhost/testjson.php?company_name=google&company_bus_ind=b

Search for ryanair companies and business names on dawson street:
http://localhost/testjson.php?company_name=ryanair&address=dawson%20street&company_bus_ind=e

Search for number 83740. We don't know if we are looking for a company or business, so supply E. Otherwise, only companies would be searched:
http://localhost/testjson.php?company_num=83740&company_bus_ind=e
*/
$company_name 		= isset($_GET["company_name"]) 		? $_GET["company_name"] 	: '';
$company_num 		= isset($_GET["company_num"]) 		? $_GET["company_num"] 	: '';
$company_bus_ind 	= isset($_GET["company_bus_ind"]) 	? $_GET["company_bus_ind"] 	: '';
$skip 				= isset($_GET["skip"]) 				? $_GET["skip"] 			: '';
$max				= isset($_GET["max"]) 				? $_GET["max"] 				: '';
$address 			= isset($_GET["address"]) 			? $_GET["address"] 			: '';
$searchType			= isset($_GET["searchType"]) 		? $_GET["searchType"] 		: '';
$sortBy 			= isset($_GET["sortBy"]) 			? $_GET["sortBy"] 			: '';
$sortDir 			= isset($_GET["sortDir"]) 			? $_GET["sortDir"] 			: '';


//$company_name = $_GET["company_name"];
//$company_num = $_GET["company_num"]; 
//$company_bus_ind = $_GET["company_bus_ind"];
//$skip = $_GET["skip"];
//$max = $_GET["max"];
//$address = $_GET["address"];
//$searchType = $_GET["searchtype"];	// If left blank, default is 2 (Starts with).  READ THE MANUAL.
//$sortBy = $_GET["sortby"];
//$sortDir = $_GET["sortdir"];

// Just to summarise, let's keep the the data in array, and then encode the whole lot.  
$testdata = array (
				"company_name"=>$company_name,
				"company_num"=>$company_num,
				"company_bus_ind"=>$company_bus_ind,
				"address"=>$address,
				"skip"=>$skip,
				"max"=>$max,
				"searchType"=>$searchType,
				"sortBy"=>$sortBy,
				"sortDir"=>$sortDir,
				"htmlEnc"=>"1");  // "format"=>"json" -- you can do this if you like... or use the "Content-Type" header value... 


// Encode everything that will be sent to query string.
$encoded = '';
foreach($testdata as $name => $value){
    $encoded .= urlencode($name).'='.urlencode($value).'&';
}
// chop off the last ampersand
$encoded = substr($encoded, 0, strlen($encoded)-1);


echo '<p>The query string we are going to send is: </p>';
echo "<h4>". $encoded ."</h4>";


$ch = curl_init();
$url = "https://services.cro.ie/cws/companies?" . $encoded;


// base64_encode email_address:api_key, preceeded with "Basic ".  
// Use the exact email address you signed up with, values are case sensitive.
$headers = array( "Authorization: Basic ".base64_encode("test@cro.ie:da093a04-c9d7-46d7-9c83-9c9f8630d5e0"),  
	"Content-Type: application/json", 
	"charset: utf-8");


curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);
// curl_setopt($ch, CURLOPT_PROXY, 'http://ip of your proxy:8080');  // Proxy if applicable
curl_setopt($ch, CURLOPT_FAILONERROR,1);
curl_setopt($ch, CURLOPT_TIMEOUT, 15);
curl_setopt($ch, CURLINFO_HEADER_OUT, true);
curl_setopt($ch, CURLOPT_URL, $url );
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_POST, 0); 

$response = curl_exec($ch);

// Some values from the header if want to take a look... 
$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$headerOut = curl_getinfo($ch, CURLINFO_HEADER_OUT);
echo $code.'<p>'.$headerOut.'</p>';


// Don't forget to close handle.
curl_close($ch);

echo "<h4>Results: </h4>";

// One way of handling json... use your own preferred method.
$results_array = json_decode($response);

// To view the array structure:
// print_r('<pre>');
// print_r($results_array);
// print_r('</pre>');


// Please READ THE DOCUMENTATION on the list of fields avaiable: 
// ------->>>>    https://services.cro.ie/datadict.aspx
foreach($results_array as $Object){
        // Let's just show the name, first line of address, and the primary key , i.e. company num + comp business indicator:
		$primarykey = $Object->company_num.'/'.$Object->company_bus_ind;
		$company_name = $Object->company_name;
	    $addr1 = $Object->company_addr_1;
        $addr2 = $Object->company_addr_2;
        print_r ($primarykey.'<br />'.
			$company_name.'<br .>'.$addr1.' '.$addr2.'<br /><br />' );
		print_r ("===========================<br />");
}


?>