<?php
//require_once ('api/include/header.php');
require_once ('api/include/session.php');
if (!class_exists('S3')) require_once 'api/model/S3.php';
//require_once 'purl-master/src/Purl.php';   
require_once ('api/model/gcuser.php');
require_once ('api/model/tagat_sms.php');
require_once ('api/model/sts.php');
require_once ('api/model/AWSAccess.php');
require_once ('api/model/baseconv.php'); 
require_once ('ActionBase.php');

class Signin_Action extends ActionBase{
    public $cS3Obj;
    public $awsInfo;

	public function __construct()	{
        $this->awsInfo = cpGetAwsInfo();
        $this->cS3Obj = new S3($this->awsInfo->accessKey,$this->awsInfo->secretKey);
        _session_clear();
    }
    
    function cpRun($pObjData=null){
        if($pObjData == null){
            cpSendResponseMessage(false,"Parameter object is null");
        }   
        $pObjData =  json_decode($pObjData);
        if($pObjData == null || $get_deviceagent == "") $pObjData->cStrDeviceAgent = $_SERVER['HTTP_USER_AGENT'];             
        if ($pObjData->cStrAction == null || $pObjData->cStrAction == "") $pObjData->cStrAction = "2passauth"; 

        $user =null;
        $gcuser = new gcuser();  
        //POLICY JSONS
        $s3PrivatePolicy = _s3_policy_private($pObjData->cStrEmail); 
        //PRIVATE
        $user = $gcuser->userLogin($pObjData->cStrEmail ,$pObjData->cStrPassword);  
        if($user != null)
        {            
            //TWO PASS AUTHENTICATION
            if ($user->TwoPassAuthentication != null && $user->TwoPassAuthentication == true && $user->UserPrimaryMobile != null && $user->UserPrimaryMobile != "")
            {
                //validate deviceids
                //$s3 = new S3($awsAccessKey, $awsSecretKey);                
                $dviceobj = $this->cS3Obj->getObject($this->awsInfo->s3Bucket, $pObjData->cStrEmail.$this->awsInfo->s3DeviceFolder.$pObjData->cStrDeviceID);            
                if ($dviceobj == NULL || $pObjData->cStrDeviceCode == "RESET" )
                {                
                    //TOW PASS AUTH SMS
                    $responseParam = $this->twopassauth_send($pObjData->cStrDeviceID, $pObjData->cStrDeviceAgent,$pObjData->cStrEmail, $user->UserPrimaryMobile,false, $dviceobj);                
                    cpSendResponseObject(true,$responseParam);
                }
                else
                {
                    //cached coockkied
                    $dviceobj = json_decode($dviceobj);
                    if (_session_devicevalidate($dviceobj, $pObjData->cStrDeviceID, $pObjData->cStrDeviceCode))
                    {
                        $dviceobj = _session_get_deviceobject($pObjData->cStrDeviceID, $dviceobj->devicecode, $pObjData->cStrDeviceAgent, $dviceobj->devicename, $dviceobj->deviceforcecode);
                        //save obj
                        $saved = $this->cS3Obj->putObjectCustom(json_encode($dviceobj),$pObjData->cStrEmail.$this->awsInfo->s3DeviceFolder.$pObjData->cStrDeviceID, null , array(),'application/json');
                        //continue to NORMAL AUTHENTICATION                    
                    }
                    else
                    {                    
                        //DEVICE CODE VALIDATION FAILED
                        //NEW CODE IF SIGNIN, ERROR IF INPUTCODE
                        if ($pObjData->cStrAction == "Signin")
                        {
                            //TOW PASS AUTH SMS
                            if (_session_devicevalidation_forced($dviceobj))
                                $responseParam = $this->twopassauth_send($pObjData->cStrDeviceID, $pObjData->cStrDeviceAgent,$pObjData->cStrEmail, $user->UserPrimaryMobile,true, $dviceobj);
                            else
                                $responseParam = $this->twopassauth_send($pObjData->cStrDeviceID, $pObjData->cStrDeviceAgent,$pObjData->cStrEmail, $user->UserPrimaryMobile,false , $dviceobj);                        
                            cpSendResponseObject(true,$responseParam);
                        }
                        else
                        {                        
                            _senderror("Wrong device code");                        
                        }                    
                    }            
                }          
            }
            //END OF TWO PASS AUTHENTICATION       
            $responseParam = null;
            $responseParam->cICodeSMS = 0;
            $responseParam->cUser = $user;
            $responseParam->cStrSessionID = session_id();
            $responseParam->cPHPSession = null;
            $responseParam->cPHPSession->cStrUserID = $user->UserID;
            $responseParam->cPHPSession->cStrUserFirstName = $user->FirstName;
            $responseParam->cPHPSession->cStrUserLastName = $user->LastName;
            $responseParam->cPHPSession->cStrUserIMGID = $user->ImageID;
            $responseParam->cPHPSession->sPHPSESSIONID = session_id();     
            //NORMAL AUTHENTICATION        
            $stsclient = new STS($awsFTAccessKey, $awsFTSecretKey);
            $awsInfo = $stsclient->getfederatedtoken($pObjData->cStrEmail, $s3PrivatePolicy, "86400");                
            if (count($awsInfo) == 0 )
            {
                $responseParam->cPHPSession->cStrAWSKey = "";
                $responseParam->cPHPSession->cStrSecretkey = "";
                $responseParam->cPHPSession->cStrSessionToken = "";
            }
            else
            {
                $responseParam->cPHPSession->cStrAWSKey = $awsInfo["AccessKeyId"];
                $responseParam->cPHPSession->cStrSecretkey = $awsInfo["SecretAccessKey"];
                $responseParam->cPHPSession->cStrSessionToken = $awsInfo["SessionToken"];
            }        
            //save session
            _session_save($user, $pObjData->cStrDeviceID, null,$response->cPHPSession);
            cpSendResponseObject(true,$responseParam);
        }    
        else
        {        
            cpSendResponseMessage(false,"Sorry, logging failed,please check username and password.");
            //_senderror("Sorry, logging failed,please check username and password.");       
        }      
    }

    function twopassauth_send($get_deviceid, $get_deviceagent,$get_username, $userphone, $forced, $deviceobj=null)
    {        
        //forced device code
        if ($forced)
        {            
            $response = null;
            $response->cICodeSMS = 3; //FORCED CODE
            $response->cStrDeviceName = $deviceobj->devicename;
            return $response;       
        }        
        //first time
        //$md5_hash = md5(rand(0,999));
        //$security_code = substr($md5_hash, 15, 8);
        $security_code = rand(1000, 9999);        
        $dviceobj = _session_get_deviceobject($get_deviceid,
                                              base64_encode(md5($security_code,true)), $get_deviceagent, ($deviceobj != null ? $deviceobj->devicename : null) );
        
        //save s3 object
        $saved = $this->cS3Obj->putObjectCustom(json_encode($dviceobj),$get_username.$this->awsInfo->s3DeviceFolder.$get_deviceid, null , array(),
                                'application/json');
        if (!$saved){            
            $response = null;
            $response->cICodeSMS = 2; //ERROR
            $response->cStrMessage = "Error generating verification code";
            return $response;            
        }       
        //send SMS
        $smssender = new tagat_sms();
        if ($smssender->sendsms($userphone , "Your Tagat verification code is ".$security_code))
        {
            //OK ask for code inputting
            $response = null;
            $response->cICodeSMS = 1; //OK
            $response->cStrMessageSentTo = "*** *** **".substr($userphone, -2, 2);
            return $response;            
        }
        else
        {
            //ERROR SENDING SMS
            $response = null;
            $response->cICodeSMS = 2; //ERROR
            $response->cStrMessage = "Error sending verification sms";
            return $response;  
        }        
    } 
}
?>
