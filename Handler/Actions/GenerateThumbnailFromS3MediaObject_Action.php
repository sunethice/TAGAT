<?php
require_once ('api/include/header.php');
require_once ('ActionBase.php');
if (!class_exists('S3')) require_once 'api/model/S3.php';

class GenerateThumbnailFromS3MediaObject_Action extends ActionBase{
    public $awsInfo;
    public $cS3Obj;   
    
    public function __construct()	{
        $this->awsInfo = cpGetAwsInfo();
        $this->cS3Obj = new S3($this->awsInfo->accessKey,$this->awsInfo->secretKey);
    }    
    
    /**
    @$pObjData
        cStrS3Path        
    */
    function cpRun($pObjData){ 
        if($pObjData == null){
            cpSendResponseMessage(false,"Parameter object is null");
        }
        else{
            try{               
                $mParam =  json_decode($pObjData);     
                $s3Result = $this->cS3Obj->getObject($this->awsInfo->s3Bucket, $mParam->cStrS3Path);
                if($s3Result == null){
                    cpSendResponseObject(false, "Couldn't find S3 image data");
                }
                $mMediaObject = json_decode($s3Result);
                //cpSendResponseMessage(false, $mMediaObject->cOSource);
                $mStrImageSource = $mMediaObject->cOSource;                   
                $mResourceImage = imagecreatefromstring(base64_decode($mStrImageSource));     
                $mIThimWidth = 100;
                $mIThimHeight = 100;
                if (imagesx($mResourceImage) > imagesy($mResourceImage))
                    $mIThimHeight = $mIThimWidth * imagesy($mResourceImage) / imagesx($mResourceImage);
                else //if(imagesx($mResourceImage) < imagesy($mResourceImage))
                    $mIThimWidth = $mIThimHeight * imagesx($mResourceImage) / imagesy($mResourceImage); 
                $image_p = imagecreatetruecolor($mIThimWidth, $mIThimHeight); 
                imagecopyresampled($image_p, $mResourceImage, 0, 0, 0, 0, $mIThimWidth, $mIThimHeight, imagesx($mResourceImage), imagesy($mResourceImage));                
                
                ob_start();
                imagepng($image_p, null, 5);
                $idata = ob_get_contents();
                ob_end_clean();
                imagedestroy($image_p);
                
                cpSendResponseMessage(true,base64_encode($idata));

                /*
                //start buffering
                ob_start();
                imagepng($image_p);
                $data = ob_get_contents();
                ob_end_clean();
                cpSendResponseMessage(true,base64_encode($data));
                // start buffering
                //ob_start();
                //imagepng($image);
                //$contents =  ob_get_contents();
                //ob_end_clean();
                //echo "<img src='data:image/png;base64,".base64_encode($contents)."' />";
                //imagedestroy($image);      
                 */
            }
            catch (Exception $mEx){
                cpSendResponseMessage(false, $mEx->getMessage());
            }
        }   
    }
}


?>