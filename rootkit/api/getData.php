<?php
// JSONP 回调名缺少校验
$CB_NAME = $_GET['callback'];
$CB_DATA = time();

header('Content-Type: application/javascript');
echo("$CB_NAME($CB_DATA)");
