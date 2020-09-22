<?php
    require_once ('api/include/header.php');
    require_once ('ActionBase.php');
    if (!class_exists('S3')) require_once 'api/model/S3.php';

    class S3PutObject_Action extends ActionBase{
        public $cS3Obj;
        public $awsInfo;

	    public function __construct()	{
            $this->awsInfo = cpGetAwsInfo();
            $this->cS3Obj = new S3($this->awsInfo->accessKey,$this->awsInfo->secretKey);
        }
        
        /**
        *@Param : $pObjData{cStrBucket,cStrKey,cObject,cStrACL,pStrContentType}     
        */
        function cpRun($pObjData=null){ 
            if($pObjData == null){
                cpSendResponseObject(false,"Parameter object is null");
            }
            else{
                try
                {
                    $mParam =  json_decode($pObjData);
                    if($mParam->cStrBucket == null){
                        $mParam->cStrBucket = $this->awsInfo->s3Bucket;
                    }       
                    if($mParam->cStrKey != null && $mParam->cObject != null){
                        $saved = $this->cS3Obj->putObjectCustom(json_encode($mParam->cObject), $mParam->cStrKey , $mParam->cStrACL , array(),$mParam->pStrContentType);
                        if (!$saved){
                            cpSendResponseMessage(false,"Error saving data in S3.");
                        }                 
                        cpSendResponseObject(true, "Saved data successfully");
                    }
                    else{
                        cpSendResponseObject(false, "Parameter data is null"); 
                    }  
                }
                catch (Exception $mEx)
                {
                    cpSendResponseObject(false, $mEx->getMessage());
                }
            }
        }    
    }
?>