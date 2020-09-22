<?php
require_once ('Handler/TagatMain.php');
require_once ('Handler/ParamHandler.php');

$cAction = $_POST["cStrAction"];
$cJson = $_POST["cObject"];

if ($cAction == null ){
    _senderror("Forbidden-action is null");
}
else if($cAction == 'getawssessionkey'){
    $cAction = 'Signin';
}

$tagatMain = new TagatMain();
$tagatMain->cpPostBack($cAction, json_decode($cJson));
?>