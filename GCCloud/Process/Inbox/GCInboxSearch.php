<?php
if(!class_exists('ParamHandler')) require_once ('Handler/ParamHandler.php'); 
if (!class_exists('gcsearch'))  require_once ('api/model/googleCon.php');
if (!function_exists('curl_init')) require_once 'purl-master/src/Purl.php';
require_once ('api/include/session.php');

class GCInboxSearch{
    private $loggeinuser;
    public function __construct(){}
    
    public function cpSearchInbox($pStrOrderBy, $pStrSearchQuery, $pSort_Type, $pBArchive, $pILimit, &$pStrCursor, &$pIApprox)
    {
        try{
            $loggeinuser = _session_getuser();
            if($loggeinuser== null)
            {
                //_senderror("Forbidden1");
            }
            $gcsearch = new gcsearch();
            $mSBQuery = "indextype:1";
            if ($pBArchive)
            {
                $mSBQuery= $mSBQuery." AND archived:1";
            }
            else
            {
                $mSBQuery= $mSBQuery." AND archived:0";
                if (IsNullOrEmptyString($pStrOrderBy))
                {
                    $mSBQuery= $mSBQuery." NOT type:(4 OR 6)";
                }
                else
                {
                    switch ($pStrOrderBy)
                    {
                        case "-1": $mSBQuery= $mSBQuery." AND star:1"; break;
                        case "0": $mSBQuery= $mSBQuery." NOT type:(4 OR 6)"; break;
                        default: $mSBQuery= $mSBQuery.sprintf(" AND type:%s", $pStrOrderBy); break;
                    }
                }
            }
            if (!IsNullOrEmptyString($pStrSearchQuery))
            {
                $mSBQuery= $mSBQuery.sprintf(" AND %s", $pStrSearchQuery);
            }
            $mStrSortField = "unixseconds";
            $mISortField = 4;
            $mBAccensing = false;
            switch ($pSort_Type)
            {
                case Sort_Type::NEWEST_MODIFIED:
                case Sort_Type::NEWEST_CREATED:
                    $mStrSortField = "unixseconds"; $mBAccensing = false; $mISortField = 4; break;
                case Sort_Type::OLDEST_MODIFIED:
                case Sort_Type::OLDEST_CREATED:
                    $mStrSortField = "unixseconds"; $mBAccensing = true; $mISortField = 4; break;
                case Sort_Type::A_Z: $mStrSortField = "indextext"; $mBAccensing = true; $mISortField = 1; break;
                case Sort_Type::Z_A: $mStrSortField = "indextext"; $mBAccensing = false; $mISortField = 1; break;
            }
            $mGCResponse = $gcsearch->listObjectsPostCommon("n.rishee@gmail.com", $mSBQuery, $pILimit, $pStrCursor, array("json"), $mISortField, $mStrSortField, $mBAccensing);
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
}
?>