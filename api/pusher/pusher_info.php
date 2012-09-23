<?php

/* 
	How To Push
	===========
	A simple implementation of Pusher App for learning purposes

	Copyright 2010, Tom Arnfeld. With a little help from Max Williams at @pusherapp!
	http://github.com/tarnfeld/How-To-Push

*/

	// Include pusher library
	require_once('Pusher.php');

	// Define constants for the pusher api info
	define('PUSHER_API_KEY', 'b4ecb0e71bc6c0677fa1');
	define('PUSHER_API_SECRET', 'dc064e15fdf218e3f23f');
	define('PUSHER_APP_ID', '7117');
	
	// Creating a connection to Pusher for other files to use
	$_pusher = new Pusher(PUSHER_API_KEY, PUSHER_API_SECRET, PUSHER_APP_ID);