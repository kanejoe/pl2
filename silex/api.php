<?php

require_once '/silex.phar';

$app = new Silex\Application();

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

$app['debug'] = true;

// http://127.0.0.1:8888/intranet/developer/pl2/silex/api.php/hello/joe
$app->get('/hello/{name}', function ($name) use ($app) {
  return 'Hello '.$app->escape($name);
});

$app['autoloader']->registerNamespace('CambridgeSoftware', __DIR__.'/libs');
 
$app->register(new CambridgeSoftware\ParisServiceProvider(), array(
  'paris.dsn'      => 'mysql:host=localhost;dbname=silextest',
  'paris.username' => 'root',
  'paris.password' => ''
));

$app->run();