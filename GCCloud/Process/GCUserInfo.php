<?php
if(!class_exists('ParamHandler')) require_once ('../../Handler/ParamHandler.php'); 
if (!class_exists('gcsearch')) require_once ('../api/model/googleCon.php');
if (!function_exists('curl_init')) require_once '../purl-master/src/Purl.php';
require_once ('../api/include/session.php');
//if (!class_exists('S3')) require_once '../api/model/S3.php';


class GCUserInfo {
    private $loggeinuser;
    public function __construct(){}
    
    public function cpSearchMyContact($pStrSearchQuery, $pSort_Type, $pBArchive, $pILimit, $pStrCursor, $pIApprox){ 
        try{
            $loggeinuser = _session_getuser();
            if($loggeinuser== null)
            {
                _senderror("Forbidden1");
            }
            $gcsearch = new gcsearch();
            $mSBQuery = "";
            if (!IsNullOrEmptyString($pStrSearchQuery))
            {
                $mSBQuery = sprintf("%s", $pStrSearchQuery);
            }
            $mStrSortField = "cDEpochContactedOnDate";
            $mISortField = 4;
            $mBAccensing = false;
            switch ($pSort_Type)
            {
                case Sort_Type::NEWEST_MODIFIED:
                case Sort_Type::NEWEST_CREATED:
                    $mStrSortField = "cDEpochContactedOnDate"; $mBAccensing = false; $mISortField = 4; break;
                case Sort_Type::OLDEST_MODIFIED:
                case Sort_Type::OLDEST_CREATED:
                    $mStrSortField = "cDEpochContactedOnDate"; $mBAccensing = true; $mISortField = 4; break;
                case Sort_Type::A_Z: $mStrSortField = "cStrUserName"; $mBAccensing = true; $mISortField = 1; break;
                case Sort_Type::Z_A: $mStrSortField = "cStrUserName"; $mBAccensing = false; $mISortField = 1; break;
            }
            $mGCResponse = $gcsearch->listObjectsPostCommon(sprintf("%s_contact", $loggeinuser->UserEmail), $mSBQuery, $pILimit, $pStrCursor, array("json"), $mISortField, $mStrSortField, $mBAccensing);
            $mGCResponse = json_decode($mGCResponse);
            if ($mGCResponse->bSUCCESS)
            {
                $mAlResultList = array();
                $pStrCursor = $mGCResponse->sCURSOR;
                $pIApprox = $mGCResponse->iTOTAL;
                foreach ($mGCResponse->oRESULT as $itmData)
                {
                    $mAlResultList[] = $itmData->json;
                }
                return $mAlResultList;
            }
            else
            {
                return null;
            }
        }
        catch(Exception $mEx){
            cpSendResponse(false, $mEx->getMessage());
        }
    }   

    public function cpSearchMyGroup($pStrSearchQuery, $pSort_Type, $pBArchive, $pILimit, $pStrCursor, $pIApprox)
    {
        try{
            $loggeinuser = _session_getuser();
            if($loggeinuser== null)
            {
                _senderror("Forbidden1");
            }
            $gcsearch = new gcsearch();
            $mSBQuery = "";
            if (!IsNullOrEmptyString($pStrSearchQuery))
            {
                $mSBQuery = sprintf("%s", $pStrSearchQuery);
            }
            $mStrSortField = "cDEpochLastEditedDate";
            $mISortField = 4;
            $mBAccensing = false;
            switch ($pSort_Type)
            {
                case Sort_Type::NEWEST_MODIFIED:
                case Sort_Type::NEWEST_CREATED:
                    $mStrSortField = "cDEpochLastEditedDate"; $mBAccensing = false; $mISortField = 4; break;
                case Sort_Type::OLDEST_MODIFIED:
                case Sort_Type::OLDEST_CREATED:
                    $mStrSortField = "cDEpochLastEditedDate"; $mBAccensing = true; $mISortField = 4; break;
                case Sort_Type::A_Z: $mStrSortField = "cStrName"; $mBAccensing = true; $mISortField = 1; break;
                case Sort_Type::Z_A: $mStrSortField = "cStrName"; $mBAccensing = false; $mISortField = 1; break;
            }
            $mGCResponse = $gcsearch->listObjectsPostCommon(sprintf("%s_mygroup", $loggeinuser->UserEmail), $mSBQuery, $pILimit, $pStrCursor, array("json"), $mISortField, $mStrSortField, $mBAccensing);
            $mGCResponse = json_decode($mGCResponse);
            if ($mGCResponse->bSUCCESS)
            {
                $mAlResultList = array();
                $pStrCursor = $mGCResponse->sCURSOR;
                $pIApprox = $mGCResponse->nTOTAL;
                foreach ($mGCResponse->oRESULT as $itmData)
                {
                    $mAlResultList[] = $itmData->json;
                }
                return $mAlResultList;
            }
            else
            {
                return null;
            }
        }
        catch(Exception $mEx){
            cpSendResponse(false, $mEx->getMessage());
        }
    } 

    public function cpSearchMyBackupHistory($pStrSearchQuery, $pSort_Type, $pBArchive, $pILimit, $pStrCursor, $pIApprox)
    {
        try{
            $loggeinuser = _session_getuser();
            if($loggeinuser== null)
            {
                _senderror("Forbidden1");
            }
            $gcsearch = new gcsearch();
            $mSBQuery = "";
            if (!IsNullOrEmptyString($pStrSearchQuery))
            {
                $mSBQuery = sprintf("%s", $pStrSearchQuery);
            }
            $mStrSortField = "cDEpochLastEditedDate";
            $mISortField = 4;
            $mBAccensing = false;
            switch ($pSort_Type)
            {
                case Sort_Type::NEWEST_MODIFIED:
                case Sort_Type::NEWEST_CREATED:
                    $mStrSortField = "cDEpochLastEditedDate"; $mBAccensing = false; $mISortField = 4; break;
                case Sort_Type::OLDEST_MODIFIED:
                case Sort_Type::OLDEST_CREATED:
                    $mStrSortField = "cDEpochLastEditedDate"; $mBAccensing = true; $mISortField = 4; break;
                case Sort_Type::A_Z: $mStrSortField = "cStrBackupName"; $mBAccensing = true; $mISortField = 1; break;
                case Sort_Type::Z_A: $mStrSortField = "cStrBackupName"; $mBAccensing = false; $mISortField = 1; break;
            }
            $mGCResponse = $gcsearch->listObjectsPostCommon(sprintf("%s_mybackuphistory", $loggeinuser->UserEmail), $mSBQuery, $pILimit, $pStrCursor, array("json"), $mISortField, $mStrSortField, $mBAccensing);
            $mGCResponse = json_decode($mGCResponse);
            if ($mGCResponse->bSUCCESS)
            {
                $mAlResultList = array();
                $pStrCursor = $mGCResponse->sCURSOR;
                $pIApprox = $mGCResponse->nTOTAL;
                foreach ($mGCResponse->oRESULT as $itmData)
                {
                    $mAlResultList[] = $itmData->json;
                }
                return $mAlResultList;
            }
            else
            {
                return null;
            }
        }catch(Exception $mEx){
            cpSendResponse(false, $mEx->getMessage());
        }
    }
}
?>