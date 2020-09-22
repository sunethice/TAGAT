<?php
require_once ('ActionBase.php');
if (!class_exists('GCConnection')){ 
    if(file_exists('../Handler/GCConnection.php')){
        require_once ('Handler/GCConnection.php');
    } 
}

class ParamRequest
{
    public $cIType;
    public $cStrOrderBy1;
    public $cStrOrderBy2;
    public $cStrQuery;
    public $cSortType;
    public $cStrCursor;
    public $cBArchive;
    public $cILimit;
}

class Search_Action extends ActionBase{
    private $gcSearchBody;
    private $cIApprox = 0;
    public $cParam;

	public function __construct(){
        $this->cParam = new ParamRequest();
        $this->gcConnection = new GCConnection();
    }
    
    function cpRun($pObjData=null){ 
        if($pObjData == null){
            return "cpRun in Test_Action";
            exit();
        }
        else{
            try
            {
                $this->cParam = $pObjData;
                $this->loadGCSearchBody($this->cParam->cIType);
                switch ($this->cParam->cIType)
                {
                    case SearchType::MY_CONTACT: $this->cpSearchMyContact(); break;
                    case SearchType::MY_GROUP: $this->cpSearchMyGrouup(); break;
                    case SearchType::MY_BACKUP_HISTORY: $this->cpSearchMyBackupHistory(); break;
                    case SearchType::INBOX: $this->cpSearchInbox(); break;
                    default:
                        cpSendResponse(false, "Couldn't find search type !");
                        break;
                }
            }
            catch (Exception $mEx)
            {
                cpSendResponse(false, $mEx->getMessage());
            }
        }
    }

    function loadGCSearchBody($pIType){
        $constVal = constant('SearchBody::SEARCH_BODY'.$pIType);
        $functName = 'load'.$constVal;
        $this->gcConnection->$functName();
        $this->gcSearchBody = new $constVal();
    }

    function cpSearchMyContact()
    {
        $mLResultList = $this->gcSearchBody->cpSearchMyContact($this->cParam->cStrQuery, $this->cParam->cSortType, $this->cParam->cBArchive, $this->cParam->cILimit, $this->cParam->cStrCursor, $this->cIApprox);
        $this->cpSendSearchResult($mLResultList);
    }

    function cpSearchMyGrouup()
    {
        $mLResultList = $this->gcSearchBody->cpSearchMyGroup($this->cParam->cStrQuery, $this->cParam->cSortType, $this->cParam->cBArchive, $this->cParam->cILimit, $this->cParam->cStrCursor, $this->cIApprox);
        $this->cpSendSearchResult($mLResultList);
    }

    function cpSearchMyBackupHistory()
    {
        $mLResultList = $this->gcSearchBody->cpSearchMyBackupHistory($this->cParam->cStrQuery, $this->cParam->cSortType, $this->cParam->cBArchive, $this->cParam->cILimit, $this->cParam->cStrCursor, $this->cIApprox);
        $this->cpSendSearchResult($mLResultList);
    }

    function cpSearchInbox()
    {
        $mLResultList = $this->gcSearchBody->cpSearchInbox($this->cParam->cStrOrderBy1,$this->cParam->cStrQuery, $this->cParam->cSortType, $this->cParam->cBArchive, $this->cParam->cILimit, $this->cParam->cStrCursor, $this->cIApprox);
        $this->cpSendSearchResult($mLResultList);
    }

    function cpSendSearchResult($pLResultList)
    {
        cpSendResponse4(true, "Success", new ParamResponse($pLResultList, $this->cIApprox, $this->cParam->cStrCursor));
    }
}

class ParamResponse
{
    public $cLResultList = array();
    public $cIApprox;
    public $cStrCursor;

    public function __construct($pLResultList, $pIApprox, $pStrCursor)
    {
        $this->cLResultList = $pLResultList;
        $this->cIApprox = $pIApprox;
        $this->cStrCursor = $pStrCursor;
    }
}
?>