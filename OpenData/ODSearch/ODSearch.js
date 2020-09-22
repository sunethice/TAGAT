

(function ($) {
    $.fn.MainSearch = function (options) { return new $.MainSearch(this, options) };
    $.MainSearch = function (e, options) {
        var defaults = {
            _data: null,
        }
        this.container = $(e);
        this.options = $.extend(defaults, options);
        this.Limit = 10;
        this.setup();
        return this;
    }

    $.MainSearch.fn = $.MainSearch.prototype = { MainSearch: '0.0.1' };
    $.MainSearch.fn.extend = $.MainSearch.extend = $.extend;
    $.MainSearch.fn.extend({

        setup: function () {
            this.reSet();
        },

        reSet: function () {
            this.Total = 0;
            this.Archive = false;
            this.cStrSpaceID = "";
            this.cStrOrderBy1 = "";
            this.Approx = 0;
            this.Query = "";
            this.Cursor = "";
            this.SortType = 0;//_enumSortType['NEWEST_MODIFIED'];
        },

        searchQuery: function (pQuery) {
            this.Approx = 0;
            this.Cursor = "";
            this.Query = pQuery;
            this.Total = 0;
            __jsMain.divBodyEmpty();
            this.doSearch();
        },

        newSearch: function (_type,pObj) {
            __jsMain.divBodyEmpty();
            this.reSet();
            if (pObj != undefined) {
                for (var propt in pObj) {
                    this[propt] = pObj[propt];
                }
            }
            if (_type != undefined && _type != null)
                this.SearchType = enumODSearch[_type];
            this.doSearch();

        },

        doSearch: function () {
            objParam = {}
            objParam.cIType = this.SearchType;
            objParam.cStrSpaceID = this.cStrSpaceID;
            objParam.cStrOrderBy1 = this.cStrOrderBy1;
            objParam.cStrQuery = this.Query;
            objParam.cSortType = this.SortType;
            objParam.cStrCursor = this.Cursor;
            objParam.cBArchive = this.Archive;
            objParam.cILimit = this.Limit;
            objParam.cIApprox = this.Approx;
            //__Bussy(true, __divBody);
            jQuery.postback('OpenDataSearch', objParam, this, "funcMainSearchFeedback");

        },

        funcMainSearchFeedback: function (pData) {
            // __Bussy(false);
            //__showHtml(JSON.stringify(pData))

            if (pData.cBSuccess) {
                $(__divBody).attr('Current', 'MainSearch')
                mResults = pData.cObject.cLResultList;

                this.Total = this.Total + mResults.length;
                this.Approx = pData.cObject.cIApprox;
                this.Cursor = pData.cObject.cStrCursor;
                switch (this.SearchType) {
                    case enumODSearch['ALL']:
                    case enumODSearch['SPACE']:
                    case enumODSearch['TEMPLATE']:
                    case enumODSearch['DATA']:
                    case enumODSearch['VIEW']:
                        $.each(mResults, function (inx, val) {
                            __jsMain.drowResult(val)
                        })
                        break;
                }
                
            
                
                $("body").SearchHighlight({
                exact: "exact", style_name_suffix: false, keys:this.Query,
                highlight: this.DivDataWrp
                });
                
                
                
                          
                if (this.Total == 0) {
                    this.showNoResult();
                }
                else
                {
                   $('#spnresult').html(this.Total + " Results found");
                
                }
                
                if (this.Cursor != null && this.Cursor != "") {
                    //if (this.Approx > this.Total) {
                    this.bindScroll();
                    //}
                }
                
                
                
                
            }
            else {
                //__jsMsg.show(0, { '_msg': pData.cStrMessage, '_css': '_00MsgRed' });
            }
            return;
        },

        bindScroll: function () {
            var self = this;
            __divBody.unbind('scroll')
            __divBody.bind('scroll', function (event) { self.divBody_scroll(event); });
        },

        divBody_scroll: function () {
            var self = this;
            if (__divBody.scrollTop() + __divBody.innerHeight() > __divBody[0].scrollHeight - 10) {
                __divBody.unbind('scroll');
                this.doSearch();
            }
        },

        showNoResult: function () {
        
          $('#spnresult').html("0 Results found");
            __divBody.html('<div class="_01NoResult">No results to display</div>')
        },



    });
})(jQuery);


var enumODSearch = {
    'ALL': 0,
    'SPACE': 1,
    'TEMPLATE': 2,
    'DATA': 3,
    'VIEW': 4
}