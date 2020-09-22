
(function ($) {
    $.fn.UCGridViewMain = function (options) { return new $.UCGridViewMain(this, options) };
    $.UCGridViewMain = function (e, options) {
        var defaults = {
            _parentEle: {}
        };
        this.options = $.extend(defaults, options);
        this.container = $(e);
        //this.s3MetaData = this.options.nativemanager.meta;
        this.s3MetaData = {};
        this.s3MetaData.cBTagatCloud = true;
        this.initialization();
        return this;
    }

    /* EXTEND */
    $.UCGridViewMain.fn = $.UCGridViewMain.prototype = { UCGridViewMain: '0.0.1' };
    $.UCGridViewMain.fn.extend = $.UCGridViewMain.extend = $.extend;
    $.UCGridViewMain.fn.extend({

        initialization: function () {
            this.query = "";
            this.commonSearch = false;
            this.inputQuery = $("#_inputQuery", this.options._parentEle.container);
            this.divCloseSearch = $('_divCloseSearch', this.options._parentEle.container);
            this.divSearch = $("#_divSearch", this.options._parentEle.container);
            this.cmbSearchTypes = $("#_cmbSearchTypes", this.container);
            //this.tblDataViewGrid = $("#_tblViewDataGrid", this.container);
            this.divGridpaginator = $("#_divGridPaginator", this.container);
            //this.funcPopulateSearchAction();
            this.funcBindEvents();
            this.funcLoadValues();
            this.funcPopulateDataGrid();
        },

        sliderBtn_click: function (btnVal) {
            switch (btnVal) {
                case 'done':
                    this.funcReloadDataGrid();
                    this.slider.close();
                    break;
                case 'close':
                    this.slider.close()
                    break
            }
        },

        funcLoadValues: function () {
            if (!this.options._parentEle.cBNew) {
                objFilter = {};
                objFilter.groupOp = this.options._parentEle.cView.cSearchParam.cStrGroupOp;
                objFilter.rules = this.options._parentEle.cView.cSearchParam.cLConditionList;
                this.postData = { filters: JSON.stringify(objFilter) };
                if(this.options._parentEle.cView.cLSelectedColumnList != undefined){
                    this.options._parentEle.cLSelectedColumnList = this.options._parentEle.cView.cLSelectedColumnList;
                }
            }
        },

        funcBindEvents: function () {
            var self = this;
            $(this.options._parentEle).bind("onCommonSearch", function () {
                self.commonSearch = true;
                $("#_tblViewDataGrid", self.container).trigger('reloadGrid');
                //$("#_tblViewDataGrid", self.container).setGridParam({
                //    postData: { "filters": "" }
                //});
                //$("#_tblViewDataGrid", self.container).jqGrid('setGridParam', { search: false, postData: { "filters": "" } }).trigger("reloadGrid");
            });
        },

        funcPopulateSearchAction: function () {
            var self = this;
            if (!this.s3MetaData.cBTagatCloud)
                $("#_divCommonSearchContiner", this.container).hide();
            this.defaultSearchValue = this.inputQuery.val();
            this.inputQuery.bind('keydown', function (e) { if (e.keyCode == 13) { self.funcDoCommonSearch(); } });
            this.divCloseSearch.click(function () { self.inputQuery.val(""); });
        },

        funcReloadDataGrid: function () {
            $("#_tblViewDataGrid", this.container).jqGrid('GridUnload');
            this.funcPopulateDataGrid();
        },

        funcPopulateDataGrid: function () {
            gridHight = this.container.height() - 72;
            gridWidth = this.container.width() - 1;
            var self = this;
            this.funPopulateGridColumns();
            this.viewDataGrid = $("#_tblViewDataGrid", this.container).jqGrid({
                sortable: false,
                url: "",
                tagret: this,
                datatype: "postback",
                caption: "",
                //width: 1200,
                //height: 300,
                width: gridWidth,//$(window).width(),
                height: gridHight,//($(window).height() - 458),
                mtype: "GET",
                colNames: this.gridColNames,
                colModel: this.gridColModels,
                pager: '#_divGridPaginator',
                rownumbers: true,
                postData: this.postData,
                rowNum: 50,
                rowList: [50, 100, 150, 200],
                viewrecords: true,
                recordpos: "right",
                loadComplete :this.funcLoadCompleted
            });
            $("#_tblViewDataGrid", this.container).jqGrid('filterToolbar', {
                searchOperators: true,
                stringResult: true,
                defaultSearch: "eq",
                beforeSearch: function () {
                    self.commonSearch = false;
                    //self.funcBeforeSearch();
                }
            });
            $("#_tblViewDataGrid", this.container).setGridParam({
                onPaging: function (event) {
                    self.funcOnPaging(event);
                }
            });
            //$("#last__divGridPaginator").hide();
            //$("#first__divGridPaginator").hide();
        },
        
        funcLoadCompleted:function(pdata){
        },

        funPopulateGridColumns: function () {
            var self = this;
            this.gridColNames = [];
            this.gridColModels = [];
            this.cLSelectFieldList = [];
            for (var i = 0; i < this.options._parentEle.cLSelectedColumnList.length; i++) {
                mField = this.options._parentEle.cLFieldList.get(this.options._parentEle.cLSelectedColumnList[i]);
                objColumn = {};
                objColumn.search = true;
                objColumn.name = mField.cStrGCID;
                if (mField.cBElement) {
                    objColumn = self.funcPopulateElementColumn(objColumn, mField.cMetaData);
                }
                else {
                    if (mField.cBNumber) {
                        objColumn.formatter = this.funcFormatDateValue;
                        objColumn.searchoptions = { sopt: ['eq', 'ne', 'lt', 'gt'] };
                    }
                    else {
                        objColumn.searchoptions = { sopt: ['eq', 'ne'] };
                    }
                }
                objColumn.index = objColumn.name;
                objColumn.align = 'center';
                objColumn.width = 120;
                objColumn.sorttype = 'string';
                self.gridColModels.push(objColumn);
                self.gridColNames.push(mField.cStrLable)
                this.cLSelectFieldList.push(objColumn.name);
            }
        },

        funcPopulateElementColumn: function (objColumn, element) {
            switch (element.cSElementType) {
                case ctrlTypesRadio:
                    //objColumn.edittype = "select";
                    _valueoptions = "";
                    _suboptionarr = [];
                    switch (element.cSElementSubType) {
                        case '0': _suboptionarr = element.cLElementSubElement; break;
                        case '1': _suboptionarr = yesnojason; break;
                        case '2': _suboptionarr = yesnoUnknownjason; break;
                    }
                    if (_suboptionarr == null) { _suboptionarr = []; }
                    for (ii = 0; ii < _suboptionarr.length; ii++) {
                        _thissubelement = _suboptionarr[ii];
                        if (this.s3MetaData.cBTagatCloud) {
                            _valueoptions = _valueoptions + _thissubelement.cSSubElementId + ":" + _thissubelement.cSSubElementLable;
                        }
                        else {
                            _valueoptions = _valueoptions + _thissubelement.cSSubElementLable + ":" + _thissubelement.cSSubElementLable;
                        }
                        if (ii != _suboptionarr.length - 1)
                            _valueoptions = _valueoptions + ";";
                    }
                    //objColumn.editoptions = { value: _valueoptions };
                    objColumn.stype = 'select';
                    objColumn.searchoptions = { sopt: ['eq', 'ne'], value: ':All;' + _valueoptions };
                    break;

                case ctrlTypesDropdown:
                    //objColumn.edittype = "select";
                    _valueoptions = "";
                    _suboptionarr = [];
                    switch (element.cSElementSubType) {
                        case '0': _suboptionarr = element.cLElementSubElement; break;
                        case '1': _suboptionarr = countryjson; break;
                        case '2': _suboptionarr = titlejason; break;
                        case '3': _suboptionarr = yesnojason; break;
                        case '4': _suboptionarr = ethnicityjson; break;
                        case '5': _suboptionarr = religionjason; break;
                        case '6': _suboptionarr = languagejson; break;
                        case '7': _suboptionarr = genderjson; break;
                    }
                    if (_suboptionarr == null) { _suboptionarr = []; }
                    for (ii = 0; ii < _suboptionarr.length; ii++) {
                        _thissubelement = _suboptionarr[ii];
                        if (this.s3MetaData.cBTagatCloud) {
                            _valueoptions = _valueoptions + _thissubelement.cSSubElementLable + ":" + _thissubelement.cSSubElementLable;
                        }
                        else {
                            _valueoptions = _valueoptions + _thissubelement.cSSubElementId + ":" + _thissubelement.cSSubElementLable;
                        }
                        if (ii != _suboptionarr.length - 1) _valueoptions = _valueoptions + ";";
                    }
                    objColumn.stype = 'select';
                    objColumn.searchoptions = { sopt: ['eq', 'ne'], value: ':All;' + _valueoptions };
                    break;

                case ctrlTypesCheckBox:
                    objColumn.formatter = 'checkbox';
                    objColumn.stype = 'select';
                    if (this.s3MetaData.cBTagatCloud) {
                        objColumn.searchoptions = { sopt: ['eq', 'ne'], value: ':All;Yes:Yes;No:No' };
                    }
                    else {
                        objColumn.searchoptions = { sopt: ['eq', 'ne'], value: ':All;1:Yes;0:No' };
                    }
                    break;

                case ctrlTypesMultiSelect:
                    _valueoptions = "";
                    _suboptionarr = [];
                    _suboptionarr = element.cLElementSubElement;
                    if (_suboptionarr == null) {
                        _suboptionarr = [];
                    }
                    for (ii = 0; ii < _suboptionarr.length; ii++) {
                        _thissubelement = _suboptionarr[ii];
                        if (this.s3MetaData.cBTagatCloud) {
                            _valueoptions = _valueoptions + _thissubelement.cSSubElementLable + ":" + _thissubelement.cSSubElementLable;
                        }
                        else {
                            _valueoptions = _valueoptions + _thissubelement.cSSubElementId + ":" + _thissubelement.cSSubElementLable;
                        }
                        if (ii != _suboptionarr.length - 1) _valueoptions = _valueoptions + ";";
                    }
                    objColumn.stype = 'select';
                    objColumn.searchoptions = { sopt: ['eq', 'ne'], value: ':All;' + _valueoptions };
                    break;

                case ctrlTypesPicture:
                    objColumn.formatter = this.funcFormatPictureValue;
                    objColumn.search = false;
                    break;

                default:
                    objColumn.searchoptions = { sopt: ['eq', 'ne'] };
                    break;
            }
            return objColumn;
        },

        funcFormatDateValue: function (cellvalue, options, rowObject) {
            return new moment(cellvalue * 1000).local().format('DD/MM/YYYY-HH:mm:ss');
        },

        funcFormatPictureValue: function (cellvalue, options, rowObject) {
            if (cellvalue != null && cellvalue != "") {
                eleData = cellvalue.split("e_h_d");
                if (eleData[2])
                    return "<img src=\"data:image/gif;base64," + eleData[2] + "\"/>";
                else
                    return "";
            }
            else {
                return "";
            }
        },

        funcOnPaging: function (event) {
            action = event.split("__")[0];
            switch (action) {
                case "next":
                    this.cStrCursor = this.cStrNextCoursor;
                    break;
                case "prev":
                    this.cStrCursor = this.cStrPreviousCoursor;
                    break;
                case "last":
                    break;
                case "first":
                    break;
                default:
            }
        },

        funcBeforeSearch: function () {
            this.commonSearch = false;
            mPostData = this.viewDataGrid.getGridParam("postData");

            alert(mPostData.page);

            searchParam = this.viewDataGrid.getGridParam("postData");
            filterParam = JSON.parse(searchParam.filters);
            alert(searchParam.filters);

            return;
            searchParam = this.viewDataGrid.getGridParam("postData");
            filterParam = JSON.parse(searchParam.filters);

            if (this.s3MetaData.cBTagatCloud) {
                this.params.commonSearch = false;
                this.params.queryString = "";
                this.params.filters = filterParam;
                $("#_tblViewDataGrid", this.container).setGridParam({
                    postData: {
                        params: JSON.stringify(this.params)
                    }
                });
            }
            else {
                for (var i = 0; i < filterParam.rules.length; i++) {
                    itmRule = filterParam.rules[i];
                    metaData = this.metaDataList[itmRule.field];
                    if (metaData.cBElement) {
                        itmRule.cStrConditionType = "0";
                        itmRule.cStrFormID = metaData.cSFormId;
                        itmRule.cStrSectionID = metaData.cSSectionId;
                    }
                    else {
                        itmRule.cStrConditionType = "5";
                        itmRule.cStrOtherConditionType = metaData.cStrOtherConditionType;
                    }
                    filterParam.rules[i] = itmRule;
                }
                $("#_tblViewDataGrid", this.container).setGridParam({
                    postData: {
                        filters: JSON.stringify(filterParam)
                    }
                });
            }
        },

        funcGetRequestParams: function (pPostData) {
            //condition
            if (pPostData.filters != null) {
                filterParam = JSON.parse(pPostData.filters);
                mLConditionList = filterParam.rules;
                mStrGroupOp = filterParam.groupOp;
            }
            else {
                mLConditionList = [];
                mStrGroupOp = "AND";
            }
            //sort field type
            //cISortField
            if (this.commonSearch || pPostData.sidx == "") {
                mStrSortField = "DocLastEditedDate"; mISortFieldType = 4; mISortType = 1;
            }
            else {
                mStrSortField = pPostData.sidx;
                switch (mStrSortField) {
                    case "TempCreatedDate": case "TempLastEditedDate":
                    case "DocCreatedDate": case "DocLastEditedDate":
                        mISortFieldType = 4;//number
                        break;
                    default: mISortFieldType = 1;//text
                        break;
                }
                mISortType = (pPostData.sord == "asc" ? 0 : 1);//ascending/decending
            }
            objParam = {};
            objParam.cStrTableName = "od_" + this.options._parentEle.cTemplate.cSTemplateId;
            objParam.cLSelectFieldList = this.cLSelectFieldList;
            objParam.cStrQuery = $("#_inputQuery", this.options._parentEle.container).val();
            objParam.cBCommonSearch = this.commonSearch;
            objParam.cIOffset = (pPostData.page - 1) * pPostData.rows;
            objParam.cILimit = pPostData.rows;
            objParam.cStrSortField = mStrSortField;
            objParam.cISortType = mISortType;
            objParam.cISortFieldType = mISortFieldType;
            objParam.cLConditionList = mLConditionList;
            objParam.cStrGroupOp = mStrGroupOp;
            this.options._parentEle.cView.cSearchParam = objParam;
            return { cStrAction: "OpenDataAdvancedSearch", cObject: JSON.stringify(objParam) };
        },

        funcDoCommonSearch: function () {
            query = "";
            if (this.inputQuery.val() != this.default_value && this.inputQuery.val() != "") {
                query = this.inputQuery.val();
                this.divCloseSearch.show();
            }
            else {
                query = "";
                this.divCloseSearch.hide();
            }
            if (this.s3MetaData.cBTagatCloud) {
                this.params.commonSearch = true;
                this.params.queryString = query;
                this.params.filters = null;
                $("#_tblViewDataGrid", this.container).setGridParam({
                    postData: {
                        params: JSON.stringify(this.params)
                    }
                }).trigger('reloadGrid');
            }
            else {

            }
        },

        funcPopulateResult: function (pData) {
            this.commonSearch = false;
            if (pData != undefined && pData.cBSuccess) {
                data = {};
                data.records = pData.cObject.cITotal;
                data.rows = pData.cObject.cLResultList;
                //don't see a better place
                $('#_spnnofrecs').html(pData.cObject.cITotal.toLocaleString());
                return data;
            }
        },

        funcSetting: function () {
            var self = this;
            this.slider = $().slider({ _widthPx: 800 });
            //this.slider.setTitleIcon('_26TitleIcon');
            this.slider.setTitle('Grid Setting');
            btnarr = [{ txt: 'Done', type: 1, val: 'done' }, { txt: 'Close', type: 2, val: 'close' }]
            this.slider.drowbtns(btnarr);
            this.jsGridElements = $(this.slider.divSlideBody).GridViewFilter({ _Parent: self, _SelectFieldList: self.options._parentEle.cLSelectedColumnList, _Temp: self.options._parentEle.cTemplate });            
            $(this.slider).bind('slidebtnClick', function (event, btnVal) { self.sliderBtn_click(btnVal); });
            this.slider.show()
        },

        funcPopulateView: function (pStrFeedbackFunction) {
            this.options._parentEle.cView.cLSelectedColumnList = this.options._parentEle.cLSelectedColumnList;
            //generate thumbnail
            var self = this;
            this.viewThumbID = "";
            this.cStrThumb = "";
            html2canvas(document.getElementById("gridContent"), {
                useCORS: false,
                onrendered: function (canvas) {
                    self.options._parentEle[pStrFeedbackFunction](__guidGenerator(), canvas.toDataURL());
                }
            });
        },

        funcSave: function () {
            _viewObj = {};
            _viewObj.cMeta = this.options._parentEle.cMeta;
            $().ViewSave({ _data: _viewObj, _saveas: false });
        },

        funcSaveAs: function () {
            this.funcgenthumb();
        },

        funcgenthumb: function () {
            html2canvas(document.getElementById("gridContent"), {
                onrendered: function (canvas) {
                    var dataUrl = canvas.toDataURL();
                    $('#gridContent').html('<img src="' + dataUrl + '" />');
                }
            });
        }


    });
})(jQuery);