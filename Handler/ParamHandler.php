<?php
class ParamHandler{}

class Sort_Type
{
    const NEWEST_MODIFIED = 0;
    const NEWEST_CREATED = 1;
    const OLDEST_MODIFIED = 2;
    const OLDEST_CREATED = 3;
    const A_Z = 4;
    const Z_A = 5;
    const RELEVANCE = 6;
}

class SearchType{
    const MY_CONTACT = 1;
    const MY_GROUP = 2;
    const MY_BACKUP_HISTORY = 3;
    const INBOX = 4;
}

class SearchTypeOpenData{
    const SPACE = 1;
    const TEMPLATE = 2;
    const DOCUMENT = 3;
    const VIEW = 4;
}

class SearchBody{
    const SEARCH_BODY1 = "GCUserInfo";
    const SEARCH_BODY2 = "GCUserInfo";
    const SEARCH_BODY3 = "GCUserInfo";
    const SEARCH_BODY4 = "GCInboxSearch";
}

?>