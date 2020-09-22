<?php
    require_once ('api/include/header.php');
    require_once ('ActionBase.php');
    if (!class_exists('GCOpenData')) require_once ('GCCloud/Process/GCOpenData.php');
    if (!class_exists('S3')) require_once 'api/model/S3.php';

    class OpenDataGet_Action extends ActionBase{
        public $cS3Obj;
        public $cGCOpenData;
        public $awsInfo;

	    public function __construct()	{
            $this->awsInfo = cpGetAwsInfo();
            $this->cS3Obj = new S3($this->awsInfo->accessKey,$this->awsInfo->secretKey);
            $this->cGCOpenData = new GCOpenData();
        }
        
        /**
        *@Param : $pObjData{cStrID,cObjectType = 0:fullObject,1:metaObject,2:object}     
        */
        function cpRun($pObjData=null){ 
            if($pObjData == null){
                cpSendResponseObject(false,"Parameter object is null");
            }
            else{
                try
                {
                    $mParam =  json_decode($pObjData);
                    switch($mParam->cObjectType){
                        case 0://full object
                            $gcResult = $this->cGCOpenData->cpGet($mParam->cStrID);
                            if($gcResult == null){
                               cpSendResponseObject(false, "Couldn't find gc data");
                            }
                            $s3Result = $this->cS3Obj->getObject($this->awsInfo->s3Bucket, "opendatajsons/".$mParam->cStrID);            
                            if($s3Result == null){
                                cpSendResponseObject(false, "Couldn't find S3 data");
                            }                    
                            $response = null;
                            $response->cMetaData = $gcResult;
                            $response->cObject = json_decode($s3Result);
                            cpSendResponseObject(true, $response);
                            break;    
                        case 1://meta object
                            $gcResult = $this->cGCOpenData->cpGet($mParam->cStrID);
                            if($gcResult == null){
                               cpSendResponseObject(false, "Couldn't find gc data");
                            }
                            cpSendResponseObject(true, $gcResult);
                            break;
                        case 2://object
                            $s3Result = $this->cS3Obj->getObject($this->awsInfo->s3Bucket, "opendatajsons/".$mParam->cStrID);            
                            if($s3Result == null){
                                cpSendResponseObject(false, "Couldn't find S3 data");
                            }      
                            cpSendResponseObject(true, json_decode($s3Result));
                            break;                        
                    }                 
                    cpSendResponseObject(false, "Couldn't find data");   
                }
                catch (Exception $mEx)
                {
                    cpSendResponseObject(false, $mEx->getMessage());
                }
            }
        }    
    }
?>