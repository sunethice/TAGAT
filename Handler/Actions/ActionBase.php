<?php

require_once ('api/include/header.php');
if (!function_exists('curl_init')) require_once 'purl-master/src/Purl.php';

abstract class ActionBase{

    private $cStrRequestID;
    private $cStrSuccessFunction;
    private $cStrErrorFunction;
    private $cBSuccess;
    public $cSMessage;

	public function __construct()	{}
    
    public abstract function cpRun($pObjData);

    protected function cpSerialization(){}

    public function cpDeserialization(){}
}
?>