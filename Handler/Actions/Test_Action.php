<?php
require_once ('ActionBase.php');
class Test_Action extends ActionBase{

    private $aaa;
    private $bbb;

	public function __construct()	{
    }
    
    function cpRun($pObjData=null){ 
        if($pObjData == null){
            return "cpRun in Test_Action";;
            exit();
        }
    }
}

?>