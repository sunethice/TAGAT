<?php
require_once ('include/header.php');
require_once ('ActionBase.php');
if (!class_exists('GCOpenData')) require_once ('../GCCloud/Process/GCOpenData.php');
if (!class_exists('S3')) require_once 'model/S3.php';

class ParamRequest
{
    public $cStrID;
    public $cStrArchive;
}

class OpenDataArchive_Action extends ActionBase{
    public $cParam;

	public function __construct()	{
        $this->cParam = new ParamRequest();
        $cS3Obj = new S3($awsAccessKey, $awsSecretKey);
        $cGCOpenData = new $cGCOpenData();
    }
    
    function cpRun($pObjData=null){ 
        if($pObjData == null){
            return "Open data search parameter object is null";
            exit();
        }
         else{
            try
            {
                $this->cParam = $pObjData;
            }
            catch (Exception $mEx)
            {
                cpSendResponse(false, $mEx->getMessage());
            }
        }
    }
}

?>