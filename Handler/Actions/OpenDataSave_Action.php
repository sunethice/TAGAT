<?php
require_once ('api/include/header.php');
require_once ('ActionBase.php');
if (!class_exists('GCOpenData')) require_once ('GCCloud/Process/GCOpenData.php');
if (!class_exists('S3')) require_once 'api/model/S3.php';

class OpenDataSave_Action extends ActionBase{
    public $cS3Obj;
    public $cGCOpenData;

	public function __construct()	{
        $awsInfo = cpGetAwsInfo();
        $this->cS3Obj = new S3($awsInfo->accessKey,$awsInfo->secretKey);
        $this->cGCOpenData = new GCOpenData();
    }
    
    function cpRun($pObjData){ 
        if($pObjData == null){
            cpSendResponseMessage(false,"Open data parameter object is null");
        }
        else{
            try
            {               
                $cParam =  json_decode($pObjData);
                $mMetaData = $cParam->cMetaData;
                $mObject = $cParam->cObject;
                if($mMetaData != null && $mObject != null){
                    $saved = $this->cS3Obj->putObjectCustom(json_encode($mObject),"opendatajsons/".$mMetaData->cStrID , null , array(),'text/plain');
                    if (!$saved)
                    {
                        cpSendResponseMessage(false,"Error saving open data in S3.");
                    }
                    $saved = $this->cGCOpenData->cpSave($mMetaData);
                    if (!$saved)
                    {
                        cpSendResponseMessage(false,"Error saving open data in GC.");
                    }
                    if($mMetaData->cIType == 3){
                        //Index for grid(advanced) search
                        $saved = $this->cGCOpenData->cpSaveViewRow($mObject);
                        if (!$saved)
                        {
                            cpSendResponseMessage(false,"Error saving open data doc in GC.");
                        }
                    }
                    cpSendResponseMessage(true,"Success");
                }
                else{
                    cpSendResponseMessage(false,"Invalid data");
                }
            }
            catch (Exception $mEx)
            {
                cpSendResponseMessage(false, $mEx->getMessage());
            }
        }
    }
}

?>