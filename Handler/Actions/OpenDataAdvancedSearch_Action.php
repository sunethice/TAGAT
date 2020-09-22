<?php
    require_once ('api/include/header.php');
    require_once ('ActionBase.php');
    if (!class_exists('GCOpenData')) require_once ('GCCloud/Process/GCOpenData.php');
    if (!class_exists('gcsearch')) require_once 'api/model/googleCon.php';

    class OpenDataAdvancedSearch_Action extends ActionBase{
        public $cGCOpenData;

	    public function __construct()	{
            $this->cGCOpenData = new gcsearch();
        }
    
        function cpRun($pObjData=null){ 
            if($pObjData == null){
                cpSendResponseMessage(false,"Open data parameter object is null");
            }
            else{
                try
                {   
                    //"unixseconds"
                    $mParam =  json_decode($pObjData);
                    $mStrQuery = "";
                    if($mParam->cBCommonSearch){
                        $mStrQuery = $mParam->cStrQuery;
                    }
                    else{
                        $mIConditionCount = count($mParam->cLConditionList);                    
                        for ($i = 0; $i < $mIConditionCount; $i++){    
                            $mCondition = $mParam->cLConditionList[$i];
                            switch ($mCondition->op)
                            {
        	                    case "eq"://equals
                                    $mStrQuery = $mStrQuery.$mCondition->field." : ".$mCondition->data;
                                    break;
                                case "ne"://does not equal
                                    $mStrQuery = $mStrQuery."NOT ".$mCondition->field." : ".$mCondition->data;
                                    break;
                                case "cn"://contains
                                    $mStrQuery = $mStrQuery.$mCondition->field." : %".$mCondition->data."%";
                                    break;                                     
                                case "nc"://does not contain
                                    $mStrQuery = $mStrQuery."NOT ".$mCondition->field." : %".$mCondition->data."%";
                                    break;    
                                case "lt"://less than      
                                    $mStrQuery = $mStrQuery.$mCondition->field." < ".$mCondition->data;
                                    break; 
                                case "le"://less or equal      
                                    $mStrQuery = $mStrQuery.$mCondition->field." < ".$mCondition->data;
                                    break; 
                                case "gt"://greater than      
                                    $mStrQuery = $mStrQuery.$mCondition->field." > ".$mCondition->data;
                                    break; 
                                case "ge"://greater or equal      
                                    $mStrQuery = $mStrQuery.$mCondition->field." > ".$mCondition->data;
                                    break;
                                case "bw"://begins with
                                    $mStrQuery = $mStrQuery.$mCondition->field." : %".$mCondition->data;
                                    break;     
                                case "bn"://does not begin with
                                    $mStrQuery = $mStrQuery."NOT ".$mCondition->field." : %".$mCondition->data;
                                    break;  
                                case "ew"://ends with
                                    $mStrQuery = $mStrQuery.$mCondition->field." : ".$mCondition->data."%";
                                    break;     
                                case "en"://does not end with
                                    $mStrQuery = $mStrQuery."NOT ".$mCondition->field." : ".$mCondition->data."%";
                                    break;       
                                default:
                                    $mStrQuery = $mStrQuery.$mCondition->field." : ".$mCondition->data;
                                    //$mStrQuery = $mStrQuery.$mCondition->field.":\"".$mCondition->data."\"";
                                    break;                    
                            }
                            if($i<$mIConditionCount-1){
                                $mStrQuery = $mStrQuery." ".$mParam->cStrGroupOp." ";                            
                            }  
                        }  
                    }
                    $gcResult =  $this->cGCOpenData->listObjectsPostCommonOffset(
                                                                $mParam->cStrTableName, 
                                                                $mStrQuery, 
                                                                $mParam->cILimit, 
                                                                $mParam->cIOffset,
                                                                $mParam->cLSelectFieldList,
                                                                $mParam->cISortType,
                                                                $mParam->cStrSortField,$mParam->cISortFieldType);
                    
                    $gcResult = json_decode($gcResult);   
                    if($gcResult->bSUCCESS){                            
                        $response = null;
                        $response->cITotal = $gcResult->nTOTAL;
                        $response->cICount = $gcResult->iCOUNT;
                        $response->cStrCursor = $gcResult->sCURSOR;
                        $response->cStrPreviousCursor = $mParam->cStrCursor;
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