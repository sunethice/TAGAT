<?php
    require_once ('api/include/header.php');
    require_once ('ActionBase.php');
    if (!class_exists('GCOpenData')) require_once ('GCCloud/Process/GCOpenData.php');

    class OpenDataSearch_Action extends ActionBase{
        public $cGCOpenData;

	    public function __construct()	{
            $this->cGCOpenData = new GCOpenData();
        }
    
        function cpRun($pObjData=null){ 
            if($pObjData == null){
                cpSendResponseMessage(false,"Open data parameter object is null");
            }
            else{
                try
                {
                    $cParam =  json_decode($pObjData);
                    $gcResult = $this->cGCOpenData->cpSearch($cParam->cIType,$cParam->cStrSpaceID,$cParam->cStrOrderBy1,$cParam->cBArchive,$cParam->cStrQuery,$cParam->cILimit,$cParam->cStrCursor);
                    $gcResult = json_decode($gcResult);   
                    if($gcResult->bSUCCESS){                            
                        $response = null;
                        $response->cITotal = $gcResult->nTOTAL;
                        $response->cICount = $gcResult->iCOUNT;
                        $response->cStrCursor = $gcResult->sCURSOR;
                        $response->cLResultList = $gcResult->oRESULT;
                        cpSendResponseObject(true, $response);
                    }
                    else{
                        cpSendResponseObject(false, "Error in searching data");         
                    }                
                }
                catch (Exception $mEx)
                {
                    cpSendResponse(false, $mEx->getMessage());
                }
            }
        }
    }
?>