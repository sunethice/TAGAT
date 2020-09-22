<?php
    require_once ('api/include/header.php');
    require_once ('ActionBase.php');
    if (!class_exists('S3')) require_once 'api/model/S3.php';

    class S3GetObject_Action extends ActionBase{
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
                        $s3Result = $this->cS3Obj->getObject($mParam->cStrBucket, $mParam->cStrKey); 
                        if($s3Result == null){
                            cpSendResponseObject(false, "Couldn't find S3 data");
                        }                   
                        cpSendResponseObject(true, $s3Result);
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