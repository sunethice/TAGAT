<?php
    require_once ('api/include/header.php');
    require_once ('ActionBase.php');
    if (!class_exists('S3')) require_once 'api/model/S3.php';

    class S3DeleteObject_Action extends ActionBase{
        public $cS3Obj;
        public $awsInfo;

	    public function __construct()	{
            $this->awsInfo = cpGetAwsInfo();
            $this->cS3Obj = new S3($this->awsInfo->accessKey,$this->awsInfo->secretKey);
        }
        
        /**
        *@Param : $pObjData{cStrBucket,cStrKey}     
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
                    if($mParam->cStrKey != null){
                        $deleted = $this->cS3Obj->deleteObjectCustom($mParam->cStrKey);
                        if(!$deleted){
                            cpSendResponseObject(false, "Couldn't delete S3 data");
                        }                   
                        cpSendResponseObject(true, "Deleted data successfully");
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