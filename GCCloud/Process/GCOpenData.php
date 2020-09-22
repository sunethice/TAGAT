<?php

if (!class_exists('gcsearch')) require_once ('api/model/googleCon.php');
//if (!function_exists('curl_init')) require_once 'purl-master/src/Purl.php';

class GCOpenData extends gcsearch {

    public $cStrTableName = "opendata";

    public function __construct(){
    }
    
    /**
    Index open data in google cloud
        @param $pData
            $pData = null;
            $pData->cStrID;
            $pData->cStrSpaceID;
            $pData->cStrParentID;
            $pData->cIType;//1:Space,2:Template,3:Document,4:View
            $pData->cStrArchive;
            $pData->cStrPublisherID;
            $pData->cStrPublisherName;
            $pData->cStrPublisherImageID;
            $pData->cStrIndexText;
            $pData->cDEpochCreated;
            $pData->cDEpochModified;
            $pData->json;   
        @TableName opendata 
        @return ID
    */
    public function cpSave($pData){       
        $hashDataRow = array();  
        $hashDataRow["cStrSpaceID"] = parent::populateIndexField(1,$pData->cStrSpaceID);
        $hashDataRow["cIType"] = parent::populateIndexField(4,$pData->cIType);
        $hashDataRow["cStrIndexText"] = parent::populateIndexField(1,$pData->cStrIndexText);//SpaceName/Name/ParentName/cStrPublisherName(F L)
        $hashDataRow["cStrParentID"] = parent::populateIndexField(1,$pData->cStrParentID);
        $hashDataRow["cStrArchive"] = parent::populateIndexField(1,($pData->cBArchive ? "1": "0"));        
        $hashDataRow["cDEpochCreated"] = parent::populateIndexField(4,$pData->cDEpochCreated/1000);
        $hashDataRow["cDEpochModified"] = parent::populateIndexField(4,$pData->cDEpochModified/1000);
        $hashDataRow["json"] = parent::populateIndexField(1,json_encode($pData));
        //index in google cloud open data
        return parent::putObjectPostCommon($this->cStrTableName,$pData->cStrID,$hashDataRow);
    }   
    
    public function cpGet($pStrID){
        $gcResult = parent::getObject($this->cStrTableName, $pStrID);  
        $gcResult = json_decode($gcResult); 
        if($gcResult->bSUCCESS){
           return $gcResult->oRESULT->fields->json;
        }
        else{
            return null;
        } 
        //return parent::getObject($this->cStrTableName, $pStrID);  
    }
    
    /**
    Search open data from google cloud
        @param $pIType : 0:All,1:Space,2:Template,3:Document,4:View
        @param $pSpaceID : SpaceID
        @param $pStrOrderBy1 : ParentID
        @param $pStrQuery : SearchText
        @param $pILimit : Limit
        @param $pStrCursor : Cursoe
        @param $pData            
        @TableName opendata 
        @return result
    */
    public function cpSearch($pIType=0,$pSpaceID=null,$pStrOrderBy1=null,$pBArchive=false,$pStrQuery=null,$pILimit=1,$pStrCursor=""){   
        $conditionList = array();
        if(!cpIsNullOrEmptyString($pStrQuery)){
            array_push($conditionList,$pStrQuery);
        }
        if(!cpIsNullOrEmptyString($pSpaceID)){
            array_push($conditionList,"cStrSpaceID:".$pSpaceID);
        }
        if(!cpIsNullOrEmptyString($pStrOrderBy1)){
            array_push($conditionList,"cStrParentID:".$pStrOrderBy1);
        } 
        array_push($conditionList,"cStrArchive:".($pBArchive?"1":"0"));        
        //if(!cpIsNullOrEmptyString($pStrArchive)){
        //    array_push($conditionList,"cStrArchive:".$pStrArchive);
        //}
        if(!cpIsNullOrEmptyString($pIType)){            
            if($pIType!=0){                
                array_push($conditionList,"cIType:".$pIType);
            }
            else
            {
                //only templates and views in all search
               //TODO:spaces also needs to be there in next version
               array_push($conditionList,"cIType:2 OR cIType:4");            
            }
        }
        $cStrQuery = "";
        $arrlength = count($conditionList);
        for($i = 0; $i < $arrlength; $i++) {
            $cStrQuery = $cStrQuery.$conditionList[$i];
            if($i<$arrlength-1){
                $cStrQuery = $cStrQuery." AND ";
            }            
        }
        return  parent::listObjectsPostCommon($this->cStrTableName, $cStrQuery, $pILimit , $pStrCursor,["json"],1,"unixseconds",4);
    }    
    
    public function cpSaveViewRow($pDoc){
        $mStrIndexText = "";
        $hashDataRow = Array();        
        //Template data
        $hashDataRow["TempID"] = parent::populateIndexField(1,$pDoc->cSTemplateId);
        $hashDataRow["TempName"] = parent::populateIndexField(1,$pDoc->cSTemplateName);
        $mStrIndexText = self::cpAddIndexText($mStrIndexText,$pDoc->cSTemplateName);
        $hashDataRow["TempCreatedDate"] = parent::populateIndexField(4,$pDoc->cDTemplateDateLastEditEpoch/1000);
        $hashDataRow["TempLastEditedDate"] = parent::populateIndexField(4,$pDoc->cDTemplateDateLastEditEpoch/1000);
        //Document data                
        $hashDataRow["DocID"] = parent::populateIndexField(1,$pDoc->cSDocumentID);
        $hashDataRow["DocName"] = parent::populateIndexField(1,$pDoc->cSDocumentName);
        $mStrIndexText =  self::cpAddIndexText($mStrIndexText,$pDoc->cSDocumentName);
        $hashDataRow["DocCreatedDate"] = parent::populateIndexField(4,$pDoc->cDDocumentDateCreatedEpoch/1000);
        $hashDataRow["DocLastEditedDate"] = parent::populateIndexField(4,$pDoc->cDDocumentDateLastEditEpoch/1000);
        //Element data
        if($pDoc->cLElementList != null){
            $mIEleCount = count($pDoc->cLElementList);
            for($i = 0; $i < $mIEleCount; $i++) {            
                $mEle = $pDoc->cLElementList[$i];   
                $mStrValue = "";
                switch($mEle->cSElementType){
                    case "12":
                        $mStrValue = $mEle->cSElementTextData.",Coordinates(".$mEle->cMapCoordinate->lang.",".$mEle->cMapCoordinate->lat.",".$mEle->cMapCoordinate->zoom.")";
                        break;
                    case "22":    
                        $mStrValue = $mEle->cSThumImg != null && $mEle->cSThumImg != "" ? $mEle->cSThumImg : $mEle->cSElementTextData;
                        $mStrValue = "e_h_d".$mEle->cSElementType."e_h_d".$mStrValue;                        
                        break;     
                    default :
                        $mStrValue = $mEle->cSElementTextData;
                        break;                
                }                
                $hashDataRow[$mEle->cSElementId] = parent::populateIndexField(1,$mStrValue);
                $mStrIndexText =  self::cpAddIndexText($mStrIndexText,$mStrValue);  
            }
        }       
        $hashDataRow["IndexText"] = parent::populateIndexField(1,$mStrIndexText);    
        return parent::putObjectPostCommon("od_".$pDoc->cSTemplateId,$pDoc->cSDocumentID,$hashDataRow);
    }
    
    public function cpAddIndexText($pStrIndexText,$pStrValue){
        return $pStrIndexText.$pStrValue." ";    
    }
    
    public function cpSearchViewData($pStrTempID){
        
    }
}

?>