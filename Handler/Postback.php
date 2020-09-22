<?php
    require_once ('api/include/header.php');
    require_once ('Handler/ParamHandler.php');
    try{
        $cAction = $_POST["cStrAction"];
        $pObject = $_POST["cObject"];
        if ($cAction == null ){
            cpSendResponseMessage(false,"Forbidden-action not found");
        }
        else if($cAction == 'getawssessionkey'){
            $cAction = 'Signin';
        }
        $cAction = $cAction."_Action";
        if(file_exists(dirname(__FILE__).'/Actions/'.$cAction.'.php')){
            require_once ('Actions/'.$cAction.'.php');
        }
        else{
            cpSendResponseMessage(false, sprintf("NOT FOUND - %s.php", $cAction));
        }
        if (class_exists($cAction)) { 
            $object = new $cAction();        
            $object->cpRun($pObject);
        }
        else{
            cpSendResponseMessage(false, sprintf("NOT FOUND - %s", $cAction));
        }
    }
    catch(Exception $mEx){
        cpSendResponseMessage(false, $mEx->getMessage());
    }
?>