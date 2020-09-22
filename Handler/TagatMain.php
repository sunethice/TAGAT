<?php
require_once('ParamHandler.php');
require_once ('api/include/header.php');
class TagatMain{

    private $cStrRequestID;
    private $cStrSuccessFunction;
    private $cStrErrorFunction;
    private $cBSuccess;
    private $cSMessage;

	public function __construct(){}
    
    function cpPostback($pStrAction, $pObject=null, $pStrSuccessFunction=null, $pStrErrorFunction=null, $pStrRequestID=null){ 
        $this->cStrRequestID = $pStrRequestID;
        $cStrSuccessFunction = $pStrSuccessFunction;
        $cStrErrorFunction = $pStrErrorFunction;
        $mAction = $pStrAction."_Action";
        if(file_exists(dirname(__FILE__).'/Actions/'.$mAction.'.php')){
            require_once ('Actions/'.$mAction.'.php');
        }
        else{
            cpSendResponseMessage(false, sprintf("NOT FOUND - %s.php", $pStrAction));
            exit();
        }
        
        if (class_exists($mAction)) {
            $object = new $mAction();
            $object->cpRun($pObject);
        }
        else{
            cpSendResponseMessage(false, sprintf("NOT FOUND - %s", $pStrAction));
        }
    }    
}
?>