<?php

class GCConnection{
    public function _contruct(){}

    public function loadGCUserInfo(){
        if (!class_exists('GCUserInfo')){ 
            if(file_exists('../GCCloud/Process/GCUserInfo.php')){
                require_once ('../GCCloud/Process/GCUserInfo.php');
            }
        }
    }

    public function loadGCInboxSearch(){
        if (!class_exists('GCInboxSearch')){ 
            if(file_exists('../GCCloud/Process/Inbox/GCInboxSearch.php')){
                require_once ('../GCCloud/Process/Inbox/GCInboxSearch.php');
            }
        }
    }
}

?>