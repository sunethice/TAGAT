
(function ($) {
    $.fn.MapGenerateData = function (options) { return new $.MapGenerateData(this, options) };
    $.MapGenerateData = function (e, options) {
        var defaults = {
            _Parent: null
        }
        this.container = $(e);
        this.options = $.extend(defaults, options);
        this.Parent = this.options._Parent;
        //this.gridMeta = this.options._Parent.options._gridmeta;
        //this.lSingleRowViews = [];
        //this.defaultlcondtions = [];
        //this.filtercondtions = [];
        this.cBCommonSearch = true;
        this.lcondtions = [];
        this.GCConditions = [];
        this.isPause = false;
        this.setup();
        return this;
    }

    $.MapGenerateData.fn = $.MapGenerateData.prototype = { MapGenerateData: '0.0.1' };
    $.MapGenerateData.fn.extend = $.MapGenerateData.extend = $.extend;
    $.MapGenerateData.fn.extend({

        setup: function () {
            var self = this;
            this.assignValues();
            this.cLFieldList = [];
            this.cLFieldListObj = new Hashtable();
            $.each(this.Parent.Parent.cLSelectedColumnList, function(inx, val){
                _GCID = getIDInGoogleFormat(val);
                self.cLFieldList.push(_GCID);
                self.cLFieldListObj.put(_GCID,val);
            })
        },

        assignValues: function () {
            var self = this;
            if (this.Parent.options._viewobj != null) {
                this.lcondtions = this.Parent.options._viewobj.lcondtions;
                this.srcObj = this.Parent.options._viewobj.cSearchParam;
                this.cLFieldList = this.Parent.options._viewobj.cSearchParam.cLSelectFieldList;
                this.cBCommonSearch = this.Parent.options._viewobj.cSearchParam.cBCommonSearch;
                this.GCConditions = this.Parent.options._viewobj.cSearchParam.cLConditionList;
                this.reset();
                //this.searchMap();
            }
        },
        
        reset : function(){
            this.isNewSearch = true;
            this.page = 1;
            this.reciveCount = 0;
            this.Approx = 0;
            this.TotSampleResult = [];
            this.Parent.removePionters();
            this.Parent.indexCount = 1;
        },
        
        
        newDataSearch: function (event) {
            this.reset();
            this.get_datafrmsearch();
        },
        
        get_datafrmsearch : function(){
            this.srcObj = {};
            this.srcObj.cStrTableName = "od_"+ this.Parent.Parent.cTemplate.cSTemplateId;
            this.srcObj.cLSelectFieldList = this.cLFieldList;
            this.srcObj.cStrQuery = this.cStrQuery;
            this.srcObj.cBCommonSearch = this.cBCommonSearch;
            this.srcObj.cILimit = 50;
            this.srcObj.cIOffset = (this.page - 1) * this.srcObj.cILimit ;
            this.srcObj.cStrSortField = "DocLastEditedDate";
            this.srcObj.cISortType = 1;
            this.srcObj.cISortFieldType = 4;
            this.srcObj.cLConditionList = this.GCConditions;
            this.srcObj.cStrGroupOp = 'AND';
            this.searchMap();
        },
        
        searchMap : function(){
            jQuery.postback('OpenDataAdvancedSearch', this.srcObj, this, "funcMainSearchFeedback")
        },
        
        funcMainSearchFeedback: function (pData) {
            var self = this;
            if (pData.cBSuccess)
            {
                this.isNewSearch = false;
                this.Approx = pData.cObject.cITotal;
                this.reciveCount = this.reciveCount + pData.cObject.cLResultList.length;
                this.TotSampleResult = this.TotSampleResult.concat(pData.cObject.cLResultList);
                if (this.TotSampleResult.length < pData.cObject.cITotal) {
                    this.page++;
                    this.get_datafrmsearch();
                }
                $(self).trigger('dataRecive',[pData.cObject.cLResultList]);
            }
        },
        

        singleCondition: function (_type, _meta, _op, _data, _disVal) {
            _thiscondition = {};
            switch (_type) {
                case '0':
                    //_paramAdvsearchElementpath = {};
                    ///_paramAdvsearchElementpath.cSTemplateId = _meta.cSTemplateId;
                    ////_paramAdvsearchElementpath.cSFormId = _meta.cSFormId;
                    //_paramAdvsearchElementpath.cSSectionId = _meta.cSSectionId;
                    //_paramAdvsearchElementpath.cSElementId = _meta.cSElementId;

                    _thiscondition.conditionId = guidGenerator();
                    _thiscondition.ConditionType = _type;
                    _thiscondition.cDisplayLabel = _meta.cSElementLable;
                    //_thiscondition.elementpath = _paramAdvsearchElementpath;
                    //_thiscondition.cSFormId = _meta.cSFormId;
                    //_thiscondition.cSSectionId = _meta.cSSectionId;
                    _thiscondition.cSElementId = _meta.cSElementId;
                    _thiscondition.cOperator = _op;
                    _thiscondition.cValue = _data;
                    _thiscondition.cDisplayValue = _disVal != undefined ? _disVal : _data;
                    _thiscondition.GCId = getIDInGoogleFormat(_meta.cSElementId)
                    break;
                default:
                    _thiscondition.elementpath = {};
                    _thiscondition.ConditionType = _type;
                    break
            }
            
            //alert("thiscondition : " + JSON.stringify(_thiscondition))
            this.lcondtions.push(_thiscondition);
            this.generateCGConditions();
            $(this.Parent).trigger('conditionAdd', [_thiscondition]);
        },
        
        generateCGConditions : function(){
        var self = this;
            this.GCConditions = []
            this.cBCommonSearch = false;
            $.each(this.lcondtions, function(inx, con){
                mCon = {};
              mCon.field = con.GCId;
              mCon.op = con.cOperator;
              mCon.data = con.cValue;
                self.GCConditions.push(mCon)
            
            });

        }
    });
})(jQuery);
