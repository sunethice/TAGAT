
(function ($) {
    $.fn.ViewMain = function (options) { return new $.ViewMain(this, options) };
    $.ViewMain = function (e, options) {
        var defaults = {
            _data: null,
            _gridmeta: null,
            _viewobj: null,
            _filters: null,
            _hashEle: null
        }
        this.container = $(e);
        this.options = $.extend(defaults, options);
        this.hashAllTempEle = new Hashtable();
        this.setup();
        this.initialization();
        return this;
    }

    $.ViewMain.fn = $.ViewMain.prototype = { ViewMain: '0.0.1' };
    $.ViewMain.fn.extend = $.ViewMain.extend = $.extend;
    $.ViewMain.fn.extend({

        setup: function () {
            var self = this;
            this.container.html(
            '<nav class="navbar navbar-default sub-header">' +
                '<div class="container">' +
                '<div class="row margin-0">' +
                    '<div class="col-md-12">' +

                        '<div id="btnBack" class="back-button pull-left">' +
                            '<i class="fa fa-angle-left"></i>' +
                        '</div>	' +
                        //Brand and toggle get grouped for better mobile display
                        '<div class="navbar-header">' +
                          '<button aria-expanded="false" data-target="#bs-example-navbar-collapse-1" data-toggle="collapse" class="navbar-toggle collapsed" type="button">' +
                            '<span class="sr-only">Toggle navigation</span>' +
                            '<span class="icon-bar"></span>' +
                            '<span class="icon-bar"></span>' +
                            '<span class="icon-bar"></span>' +
                          '</button>' +
                        '</div>' +
                        //Collect the nav links, forms, and other content for toggling
                        '<div id="bs-example-navbar-collapse-1" class="collapse navbar-collapse">' +
                          '<form role="search" class="navbar-form navbar-left">' +
                            '<div class="form-group">' +
                              '<input id="_inputQuery" type="text" placeholder="Search" class="form-control">' +
                            '</div>' +
                            '<button id="_btnSearch" class="btn btn-white btn-search" type="submit"><i class="fa fa-search"></i></button>' +
                          '</form>' +
                          '<div class="dropdown fun-dropdown">' +
                            '<button aria-expanded="true" aria-haspopup="true" data-toggle="dropdown" id="functionMenu" type="button" class="btn btn-white dropdown-toggle">' +
                                    '<i class="fa fa-bars"></i> &nbsp;  ' +

                                    '<span class="caret"></span>' +
                            '</button>' +
                              '<ul aria-labelledby="dropdownMenu1" class="dropdown-menu" id="frunDropBody">' +
                                '<li val="Setting">Setting</li>' +
                                '<li val="Save">Save</li>' +
                                //'<li val="SaveAs">SaveAs</li>' +
                              '</ul>' +
                            '</div>' +

                            '<button class="btn btn-green aa-div-hide"><i class="fa fa-floppy-o"></i></button>' +

                            '<ul class="view-filter-wrap pull-right">' +
                                '<li>' +
                                    '<div id="_icongirdv" val="table" class="view-filter-btn ">' +
                                    '   <i class="fa fa-table"></i>' +
                                    '</div>' +
                                '</li>' +
                                '<li>' +
                                    '<div id="_iconmapv" val="map"  class="view-filter-btn">' +
                                        '<i class="fa fa-map-marker"></i>' +
                                    '</div>' +
                                '</li>' +
                                '<li>' +
                                    '<div id="_iconchartv"  val="chart" class="view-filter-btn aa-div-disable">' +
                                        '<i class="fa fa-bar-chart"></i>' +
                                    '</div>' +
                                '</li>' +
                                '<li>' +
                                    '<div id="_iconcalv" val="calendar"  class="view-filter-btn aa-div-disable">' +
                                        '<i class="fa fa-calendar"></i>' +
                                    '</div>' +
                                '</li>' +
                            '</ul>' +
                        '</div>' +//navbar-collapse
                      '</div>' +//container
                    '</div>' +
                '</div>' +
            '</nav>' +
            '<div class="container-fluid con-wrapper">' +
            '<section class="container">' +
			'<div class="row margin-t20">' +
				'<div class="col-md-12">' +
					'<h1 id="_viewTitle"  class="view-hdr-txt">--</h1>' +
					'<p  id="_viewDesc" class="view-hdr-p">--</p>' +
				'</div>' +
			'</div>' +
            '<div class="row">' +
				'<div class="col-md-12">' +
                    '<div id="tagContent" class="open-tag-wrap">' +
                        '<span class="open-tags">map</span>' +
                        '<span class="open-tags">google</span>' +
                        '<span class="open-tags">opendata</span>' +
                    '</div>' +
                '</div>' +
			'</div>' +
			'<div class="row margin-t20">' +
				'<div class="col-md-12">' +
					'<div id="gridContent" class="grid-wrap"></div>' +
				'</div>' +
			'</div>' +
			'<div class="row margin-t20">' +
				'<div class="col-md-12">' +
					'<h4 class="view-hdr-txt">More Details</h4>' +
					'<hr>' +

					'<div class="row">' +
						'<div class="col-md-3">' +
							'<div class="panel panel-default">' +
							  '<div class="panel-heading">' +
								'<h3 class="panel-title">Last Modified</h3>' +
							  '</div>' +
							  '<div class="panel-body" id="_spnlastmodified">' +
								'Sep 8, 2015' +
							  '</div>' +
							'</div>' +
						'</div>' +
						'<div class="col-md-3">' +
							'<div class="panel panel-default">' +
							  '<div class="panel-heading">' +
								'<h3 class="panel-title">Modified by</h3>' +
							  '</div>' +
							  '<div class="panel-body" id="_spnmodifiedby">' +
								'Nuwan Marks' +
							  '</div>' +
							'</div>' +
						'</div>' +
						'<div class="col-md-3">' +
							'<div class="panel panel-default">' +
							  '<div class="panel-heading">' +
								'<h3 class="panel-title" >Created on</h3>' +
							  '</div>' +
							  '<div class="panel-body" id="_spncreatedon">' +
								'May 28, 2015' +
							  '</div>' +
							'</div>' +
						'</div>' +
						'<div class="col-md-3">' +
							'<div class="panel panel-default">' +
							  '<div class="panel-heading">' +
								'<h3 class="panel-title">Publisher</h3>' +
							  '</div>' +
							  '<div class="panel-body" id="_spnpublisher">' +
								'Ali Khan' +
							  '</div>' +
							'</div>' +
						'</div>' +
						'<div class="col-md-3">' +
							'<div class="panel panel-default">' +
							  '<div class="panel-heading">' +
								'<h3 class="panel-title">Space</h3>' +
							  '</div>' +
							  '<div class="panel-body" id="_spnspace">' +
								'Public Health England' +
							  '</div>' +
							'</div>' +
						'</div>' +
						'<div class="col-md-3">' +
							'<div class="panel panel-default">' +
							  '<div class="panel-heading">' +
								'<h3 class="panel-title">No. of Records</h3>' +
							  '</div>' +
							  '<div class="panel-body" id="_spnnofrecs">' +
								'1,502' +
							  '</div>' +
							'</div>' +
						'</div>' +
						'<div class="col-md-3">' +
							'<div class="panel panel-default">' +
							  '<div class="panel-heading">' +
								'<h3 class="panel-title">File Formats</h3>' +
							  '</div>' +
							  '<div class="panel-body">' +
								'RDF, CSV, JSON-LD, XML' +
							  '</div>' +
							'</div>' +
						'</div>' +
					'</div>' +

				'</div>' +
			'</div>' +
            '</section>' +
            '</div>'
            );
        },

        initialization: function () {
            var self = this;
            this.divGridContent = $('#gridContent', this.container);
            this.btnFuncMenu = $('#functionMenu', this.container);
            this.divFuncBody = $('#frunDropBody', this.container);
            this.divViewTitle = $('#_viewTitle', this.container);
            this.divViewDesc = $('#_viewDesc', this.container);
            this.txtSearch = $('#_inputQuery', this.container);
            this.btnBack = $('#btnBack', this.container);
            this.searchbuttn = $('#_btnsearch', this.container);
            this.searchtext = $('#_inputsearch', this.container);


            this.cTemplate = $('#__tempjson__').val();
            if (this.cTemplate != null && this.cTemplate != "") {
                this.cTemplate = JSON.parse(this.cTemplate);
            }
            else {
                this.cTemplate = JSON.parse(this.funcGetTemplate());
            }
            this.cMeta = $('#__docmeta__').val();
            if (this.cMeta != null && this.cMeta != "") {
                this.cMeta = JSON.parse(this.cMeta);
            }
            this.bindEvent();
            this.drowGridMeta();
            this.funcConfigure();
            this.assignvalue();
            this.redirect();
        },

        assignvalue: function () {
            //this.options._viewobj= JSON.parse('{"cStrName":"vishwas loactions","cStrDescription":"vishwas loactions","cSearchObj":{"cStrTableName":"od_8f7425f6-8540-4ee1-8738-81f002a9c80d","cLSelectFieldList":["DocID","DocName","DocCreatedDate","DocLastEditedDate","cjegachfkjjdckacajkcfcakgbcehaighcaj","acabcadgkbhfakfcifkgbabkajcfbdbfagbc","fgdcidabkbdbekdjeekjgcbkjbedjjcgbccc"],"cBCommonSearch":false,"cILimit":5,"cIOffset":0,"cStrSortField":"DocLastEditedDate","cISortType":1,"cISortFieldType":4,"cLConditionList":[{"field":"cjegachfkjjdckacajkcfcakgbcehaighcaj","op":"eq","data":"vishwa"}],"cStrGroupOp":"AND"},"lcondtions":[{"conditionId":"85c7a027-e20d-8eb0-1d5a-f2bdea37e365","ConditionType":"0","cDisplayLabel":"Name","cSElementId":"2946027f-9932-0ca9-cf2a-612e7a8672a9","cOperator":"eq","cValue":"vishwa","cDisplayValue":"vishwa","GCId":"cjegachfkjjdckacajkcfcakgbcehaighcaj"}],"cStrMapSetting":{"DisplayEleId":["f6328301-b314-d9ee-9621-9b439926b22c","0201c0d6-b750-f28f-61a1-092f13b5061c"],"DisplayAllSetting":[{"id":"0201c0d6-b750-f28f-61a1-092f13b5061c","Label":"Home location","PathObj":{"cSFormId":"cfa3b50f-aa43-b6f8-94d9-7b5cc12589a6","cSSectionId":"e8e886fa-f2a3-e2f1-b89b-ecd23f86484d","cSElementId":"0201c0d6-b750-f28f-61a1-092f13b5061c","cSFormName":"New Form","cSSectionName":"New Section","cSElementLable":"Home location","cSElementType":"12","cSTemplateId":"8f7425f6-8540-4ee1-8738-81f002a9c80d"},"DisColor":"#8EB125","DisplayObjs":["0201c0d6-b750-f28f-61a1-092f13b5061c","2946027f-9932-0ca9-cf2a-612e7a8672a9","docname"]},{"id":"f6328301-b314-d9ee-9621-9b439926b22c","Label":"Office location","PathObj":{"cSFormId":"cfa3b50f-aa43-b6f8-94d9-7b5cc12589a6","cSSectionId":"e8e886fa-f2a3-e2f1-b89b-ecd23f86484d","cSElementId":"f6328301-b314-d9ee-9621-9b439926b22c","cSFormName":"New Form","cSSectionName":"New Section","cSElementLable":"Office location","cSElementType":"12","cSTemplateId":"8f7425f6-8540-4ee1-8738-81f002a9c80d"},"DisColor":"#2F5184","DisplayObjs":["docname"]}],"MapSetting":{"selectedMapEleIDs":[],"lat":22.593388655174422,"lang":6.026856550000037,"zoom":3}}}')
            if (this.cBNew) {
                this.divViewTitle.html(this.cTemplate.cSTemplateName + " - data view");
                this.divViewDesc.html("Data view from template " + this.cTemplate.cSTemplateName);
            }
            else {
                this.divViewTitle.html(this.cMeta.cStrName +" ("+this.cMeta.cStrParentName+")");
                this.divViewDesc.html(this.cMeta.cStrDescription);
            }
            $('#tagContent', this.container).html("");
            for (var f = 0; f < this.cMeta.cLTagList.length; f++) {
                $('#tagContent', this.container).append('<span class="open-tags">' + this.cMeta.cLTagList[f] + '</span>');
            }
            $('#_spnlastmodified', this.container).html(new moment(this.cMeta.cDEpochModified).local().format('llll'));
            $('#_spnmodifiedby', this.container).html(this.cMeta.cStrPublisherName);
            $('#_spncreatedon', this.container).html(new moment(this.cMeta.cDEpochCreated).local().format('llll'));
            $('#_spnpublisher', this.container).html(this.cMeta.cStrPublisherName);
            $('#_spnspace', this.container).html(this.cMeta.cStrSpaceName);
        },

        bindEvent: function () {
            var self = this;
            $('.view-filter-btn').bind('click', function (event) { self.filter_click(event) });
            $(this.btnFuncMenu).bind('click', function (event) { self.btnFuncMenu_click(event) });
            $('li', this.divFuncBody).bind('click', function (event) { self.divFuncBody_click(event) });
            $(this.btnBack).bind('click', function (event) { self.btnBack_click(event) });
            $(this.txtSearch).bind("keydown", function (e) { if (e.keyCode == 13) { self.Search_trigger(); return false; } });
            $("#_btnSearch", this.container).click(function () { self.Search_trigger(); return false; });
            $("#opndataHdr").click(function () { self.hdr_click(); return false; });
        },

        Search_trigger: function (event) {
            var self = this;
            mSearchValue = this.txtSearch.val();
            $(self).trigger("onCommonSearch", [mSearchValue]);
        },

        funcGetTemplate: function () {
            return '{"$type":"TagatClassLibrary.Common.Template, TagatClassLibrary","cSTemplateId":"d1193ea8-2788-4846-a3f7-d064d28a9718","cStrPublicID":"D0JH","cSTemplateName":"tmp1","cImageType":0,"cStrImageID":null,"cSModelId":"f674c9a0-9cca-40fd-95e7-ac34c0ac9415","cSType":"3","cConcepts":null,"cPermissions":[],"cLanguage":null,"cIDocCount":4,"cSTemplateCreatedBy":"c4a07c62-04df-416e-a7ac-eb4c527d9d01","cSTemplateLastEditBy":"c4a07c62-04df-416e-a7ac-eb4c527d9d01","cBIsArchive":false,"cBIsEditing":false,"cBIsLocalOnly":false,"cSPermissionType":"3","cDTemplateDateCreatedEpoch":1431321787102.4148,"cDTemplateDateLastEditEpoch":1431321787102.4148,"cDLocalTemplateDateLastEditEpoch":1431321787102.4148,"cSTemplateHighlitedText":null,"cLFormList":[{"$type":"TagatClassLibrary.Common.TempForm, TagatClassLibrary","cSFormId":"a1a1175f-312b-74ae-1469-549c8ee3297c","cSFormName":"New Form","cSDisplayName":null,"cSTemplateId":null,"cLanguage":null,"cLSectionList":[{"$type":"TagatClassLibrary.Common.TempSection, TagatClassLibrary","cSFormID":"a1a1175f-312b-74ae-1469-549c8ee3297c","cSSectionId":"4db3fbcb-ec75-e4ac-a942-9156f1741912","cSSectionName":"New Section","cSDisplayName":null,"cSFontsize":null,"cLanguage":null,"cLElementList":[{"$type":"TagatClassLibrary.Common.EleTextBox, TagatClassLibrary","cSElementSize":"1","cTextType":0,"cSPrfixText":"","cSPrfixLength":"","cSDocumentCount":"0","cBSelfSearch":false,"cSTemplateId":null,"cSFormId":"a1a1175f-312b-74ae-1469-549c8ee3297c","cSSectionId":"4db3fbcb-ec75-e4ac-a942-9156f1741912","cSElementId":"44f234c3-e524-5851-af43-9438acfce422","cSElementType":"1","cSElementLable":"name","cSElementDisplayLable":null,"cSElementAlign":"1","cSElementName":"New Textbox","cLanguage":"","cSPermissionType":"3","cStrTag":"ac7e10ea-0c96-e5e6-7077-0837238a5792","cSElementInfo":null,"cSResults":"0","cSValidation":"0","cSElementVisibility":null,"cSElementPublishPermission":null},{"$type":"TagatClassLibrary.Common.EleTextBox, TagatClassLibrary","cSElementSize":"1","cTextType":0,"cSPrfixText":"","cSPrfixLength":"","cSDocumentCount":"0","cBSelfSearch":false,"cSTemplateId":null,"cSFormId":"a1a1175f-312b-74ae-1469-549c8ee3297c","cSSectionId":"4db3fbcb-ec75-e4ac-a942-9156f1741912","cSElementId":"d6fa6747-12d0-1083-b530-ae224f2f1cfa","cSElementType":"1","cSElementLable":"age","cSElementDisplayLable":null,"cSElementAlign":"1","cSElementName":"New Textbox","cLanguage":"","cSPermissionType":"3","cStrTag":"a8686b95-9faa-fefc-0815-b1a89819d51b","cSElementInfo":null,"cSResults":"0","cSValidation":"0","cSElementVisibility":null,"cSElementPublishPermission":null}],"cSPermissionType":"3","cStrTag":null}],"cSPermissionType":"3","cStrTag":null}],"cLCoreOwners":null,"cLLinkedWorkfolwStatusList":null,"cLLinkedWorkflowList":null,"cLHistoryList":null,"cMediaFileList":null,"cILinkedTempCount":0,"cStrTag":"250c3a1a-dc34-dbb0-83af-a4c33d2c82e5","cLDocNamePrifix":null}';
        },

        funcConfigure: function () {
            this.cLFieldList = new Hashtable();
            this.cLSelectedColumnList = [];
            this.funcPopulateField("TempID", "Template ID", false, false, this.cTemplate.cSTemplateId);
            this.funcPopulateField("TempName", "Template Name", false, false, this.cTemplate.cSTemplateName);
            this.funcPopulateField("TempCreatedDate", "Template Created Date", true, false, this.cTemplate.cDTemplateDateCreatedEpoch);
            this.funcPopulateField("TempLastEditedDate", "Template Last Edited Date", true, false, this.cTemplate.cDTemplateDateLastEditEpoch);
            this.funcPopulateField("DocID", "Document ID", false, false, ""); this.cLSelectedColumnList.push("DocID");
            this.funcPopulateField("DocName", "Document Name", false, false, ""); this.cLSelectedColumnList.push("DocName");
            this.funcPopulateField("DocCreatedDate", "Document Created Date", true, false, ""); this.cLSelectedColumnList.push("DocCreatedDate");
            this.funcPopulateField("DocLastEditedDate", "Document Last Edited Date", true, false, ""); this.cLSelectedColumnList.push("DocLastEditedDate");
            for (var f = 0; f < this.cTemplate.cLFormList.length; f++) {
                form = this.cTemplate.cLFormList[f];
                for (var s = 0; s < form.cLSectionList.length; s++) {
                    section = form.cLSectionList[s];
                    for (var e = 0; e < section.cLElementList.length; e++) {
                        element = section.cLElementList[e];
                        this.funcPopulateField(element.cSElementId, element.cSElementLable, false, true, element);
                        this.cLSelectedColumnList.push(element.cSElementId);
                    }
                }
            }
            this.pagedtr = _SERVERSESSION.page.split('?');
            this.viewType = this.pagedtr[0].split('/')[4];
            this.cStrID = this.pagedtr[0].split('/')[3];
            this.inputViewJson = $('#__viewjson__');           
            if (this.inputViewJson.val() != undefined && this.inputViewJson.val() != "") {
                this.cView = JSON.parse(this.inputViewJson.val());
                if (this.cView.cIType != undefined && this.cView.cIType != null) {
                    switch (this.cView.cIType) {
                        case 1://grid view
                            this.viewType = 'grid';
                            break;
                        case 2://map view
                            this.viewType = 'map';
                            break
                        case 3://graph
                            this.viewType = 'graph';
                            break;
                    }
                    this.cBNew = false;
                }
                else {
                    this.funcGenerateNewView();
                }
            }
            else {
                this.funcGenerateNewView();
            }
        },

        funcPopulateField: function (pStrID, pStrLable, pBNumber, pBElement, pMetaData) {
            objData = {};
            objData.cStrID = pStrID;
            objData.cStrGCID = getIDInGoogleFormat(pStrID);
            objData.cStrLable = pStrLable;
            objData.cBNumber = pBNumber;
            objData.cBElement = pBElement;
            objData.cMetaData = pMetaData;
            this.cLFieldList.put(pStrID, objData);
        },

        funcGenerateNewView: function () {
            this.cBNew = true;
            this.cView = {};
            this.cView.cStrID = __guidGenerator(); this.cMeta.cStrID = this.cView.cStrID;
            this.cView.cStrName = ""; this.cMeta.cStrDescription = "";
            this.cMeta.cIType = 4;//view           
            //this.cMeta.cLTagList = [];
            this.cView.cStrTemplateID = this.cTemplate.cSTemplateId; this.cMeta.cStrParentID = this.cView.cStrTemplateID;
            this.cView.cStrTemplateName = this.cTemplate.cSTemplateName; this.cMeta.cStrParentName = this.cView.cStrTemplateName;
            this.cView.cDEpochCreated = 0;
            this.cView.cDEpochModified = this.cView.cDEpochCreated;
        },

        redirect: function () {
            //this.objtype = this.pagedtr[0].split('/')[2]
            switch (this.viewType) {
                case 'grid':
                    this.funcLoadGridView();
                    $("#_icongirdv", this.container).addClass('tab-selected');
                    break;
                case 'map':
                    $("#_iconmapv", this.container).addClass('tab-selected');
                    this.funcLoadMapView();
                    break;
                case "graph":
                    this.funcLoadGraphView();
                    $("#_iconchartv", this.container).addClass('tab-selected');
                    break;
                default:
                    $("#_icongirdv", this.container).addClass('tab-selected');
                    this.viewType = 'grid';
                    this.funcLoadGridView();
                    break
            }
        },

        filter_click: function (event) {
            mVal = $(event.currentTarget).attr('val');

            switch (mVal) {
                case 'table':
                    __navigateto('/opendata/data/' + this.cStrID + '/grid', false);
                    break;
                case 'chart':

                    break;
                case 'map':
                    __navigateto('/opendata/data/' + this.cStrID + '/map', false);
                    break;
                case 'calendar':

                    break;
            }
        },

        funcLoadGridView: function () {
            var self = this;
            this.cView.cIType = 1;//grid view
            $(this.divGridContent).html("");
            $(this.divGridContent).load(__S3COMPONENTPATH + "OpenData/CustomView/GridView/html/UCGridViewMain.htm", function () {
                self.ctrlView = $(self.divGridContent).UCGridViewMain({ _parentEle: self });
            });
        },

        funcLoadMapView: function () {
            this.cView.cIType = 2;//map view
            obj = {};
            obj._gridmeta = this.GridMeta;
            obj._data = this.cTemplate;
            obj._Parent = this;
            obj._viewobj = (this.cView.cDEpochCreated == 0 ? null: this.cView);   
            this.ctrlView = $(this.divGridContent).MapViewMain(obj);
        },

        funcLoadGraphView: function (event) {
            this.cView.cIType = 3;//graph view
        },

        drowGridMeta: function () {
            var self = this;
            this.GridMeta = [];
            $.each(this.cTemplate.cLFormList, function (inx, _form) {
                $.each(_form.cLSectionList, function (inx, _sec) {
                    $.each(_sec.cLElementList, function (inx, _ele) {
                        self.GridMeta.push(_ele);
                        self.hashAllTempEle.put(_ele.cSElementId,_ele)
                    })
                })
            })
        },

        btnFuncMenu_click: function (event) {
            var self = this;
            event.stopPropagation();
            if (!$(this.divFuncBody).is(':visible')) {
                $(this.divFuncBody).show();
                $(this.divFuncBody).slideDown();
                $(document).bind('click.funcdrop', function(event){
                $(document).unbind('click.funcdrop');
                $(self.divFuncBody).slideUp()});
            }
            else {
                $(this.divFuncBody).slideUp();
            }
        },

        divFuncBody_click: function (event) {
            var self = this;
            _val = $(event.currentTarget).attr('val');
            //func = this.viewType + '_' + _val;

            switch (this.viewType + _val) {
                case 'gridSetting':
                case 'mapSetting':
                    this.ctrlView['func' + _val]();
                    break;
                case 2:
                    this.funcLoadGraphView();
                    break;
                case 'mapSave':
                    this.funcSave();
                    return;
                    $(this.jsMainView).unbind('thumbReady');
                    $(this.jsMainView).bind('thumbReady', function (event) {
                        $(self.jsMainView).unbind('thumbReady')
                        self.funcSave(self.jsMainView);
                    });
                    this.jsMainView.funcgenthumb();
                    break;
                case 'gridSave':
                    this.funcSave();
                    break
                default:
                    //this.jsGridiew['func' + _val]();
                    break
            }
            $(this.divFuncBody).slideUp();
        },

        funcSave: function () {
            this.ctrlView.funcPopulateView("funcOnPopulateFeedback");            
        },

        funcOnPopulateFeedback: function (pStrThumbID,pStrThumb) {
            this.cMeta.cStrThumbID = pStrThumbID;
            this.cMeta.cStrThumb = pStrThumb;//based64 string
            objParam = {};
            objParam.cMetaData = this.cMeta;
            objParam.cObject = this.cView;     
            $().ViewSave({ _data: objParam });
        },

        btnBack_click: function (event) {
            window.history.back();
            //__navigateto('/opendata');
        },
        
        hdr_click : function(){
            __navigateto('/opendata', false);
        }

    });
})(jQuery);

