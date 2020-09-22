
(function ($) {
    $.fn.MapViewMain = function (options) { return new $.MapViewMain(this, options) };
    $.MapViewMain = function (e, options) {
        var defaults = {
            _data: null,
            _gridmeta: null,
            _viewobj: null,
            _filters: null,
            _hashEle: null
        }
        this.container = $(e);
        this.options = $.extend(defaults, options);

        this.Parent = this.options._Parent;
        this.cStrMapSetting = {};
        this.cStrMapSetting.selectedMapEleIDs = [];
        this.gPointersByEleID = [];

        this.hashGridMeta = new Hashtable();
        this.hashSelectEle = new Hashtable();
        this.hashDisplayEle = new Hashtable();
        this.isSampleData = true;
        this.setup();
        return this;
    }

    $.MapViewMain.fn = $.MapViewMain.prototype = { MapViewMain: '0.0.1' };
    $.MapViewMain.fn.extend = $.MapViewMain.extend = $.extend;
    $.MapViewMain.fn.extend({

        setup: function () {
            var self = this;
            this.load_Arry();
            this.container.html(
                '<div class="_22CalendarWrp">' +
                    '<div  class="_22FunctionWrp">' +
                        '<div class="_22FuncLabel _00GridHdr">All Map Elements of Template</div>' +
                        '<div id="funcWrpNew" class="_22FuncEleContain"></div>' +
                    '</div>' +
		            '<div id="mapContent" class="_26MapContain"></div>' +
                '</div>'
            );
            this.initialization();

            // $(__EvntSlider).bind('generateSuccess', function (event) { self.generateSuccess_trigger() });
            if (this.options._viewobj == null) {
                this.assignValue();
                this.drowSetting();
                this.drowGenerateData();
                this.bindEvent();
                this.showSetting();
                this.jsMapData.newDataSearch();
                this.DrowMap();
                this.jsMapElements.generateValue();
            }
            else {
                this.isFirstDrow = true;

                this.assignValue();
                this.DrowMap();
                this.drowGenerateData();
                this.drowSetting();
                this.bindEvent();
                this.jsMapData.newDataSearch();
                this.jsMapElements.generateValue();
            }
        },

        initialization: function () {
            var self = this;
            this.divMapContent = $('#mapContent', this.container);
            this.divfuncWrpNew = $('#funcWrpNew', this.container);
        },

        bindEvent: function () {
            var self = this;
            $(this.slider).bind('slidebtnClick', function (event, btnVal) { self.sliderBtn_click(btnVal); });
            $(this.jsMapData).bind('sampleLoad', function (event) { self.jsMapData_loadNew() });
            $(this.jsMapData).bind('dataRecive', function (event, _result) { self.jsMapData_dataRecive(event, _result) });
            $(this.jsMapElements).bind('generateSuccess', function (event) { self.generateSuccess_trigger() });
            $(this.Parent).bind('onCommonSearch', function (event, val) { self.CommonSearch_trigger(event, val) });
        },

        DrowMap: function () {
            var self = this;
            this.cStrMapSetting['lat'] == undefined ? this.cStrMapSetting['lat'] = 51.508515 : "";
            this.cStrMapSetting['lang'] == undefined ? this.cStrMapSetting['lang'] = -0.12548719999995228 : "";
            this.cStrMapSetting['zoom'] == undefined ? this.cStrMapSetting['zoom'] = 3 : "";

            this.maptype = google.maps.MapTypeId.ROADMAP;
            _myLatlng = new google.maps.LatLng(this.cStrMapSetting.lat, this.cStrMapSetting.lang);
            _myOptions = {
                streetViewControl: false,
                center: _myLatlng,
                mapTypeId: this.maptype
            };
            this.gMap = new google.maps.Map(this.divMapContent[0], _myOptions);
            google.maps.event.addListenerOnce(self.gMap, 'idle', function () {
                setTimeout(function () {
                    google.maps.event.trigger(self.gMap, 'resize');
                    self.gMap.setZoom(self.cStrMapSetting.zoom);
                    self.gMap.setCenter(_myLatlng);
                }, 100)
            });
        },

        drowGenerateData: function () {
            var self = this;
            this.jsMapData = $().MapGenerateData({ _Parent: self });
        },

        drowSetting: function () {
            var self = this;
            this.slider = $().slider({ _widthPx: 800 });
            //this.slider.setTitleIcon('_26TitleIcon');
            this.slider.setTitle('Map Setting');
            btnarr = [{ txt: 'Done', type: 1, val: 'done' }, { txt: 'Close', type: 2, val: 'close' }]
            this.slider.drowbtns(btnarr);
            _tbarr = [{ 'txt': 'SELECT MAP ELEMENTS', 'val': 'mapele' }, { 'txt': 'CONDITIONS', 'val': 'condition' }];

            this.tbs = $(this.slider.divSlideBody).tabs({ _Array: _tbarr });
            this.jsMapElements = $('#mapele', this.tbs.divTabBodyWrp).MapSelectElement({ _Parent: self });
            this.jsMapFilter = $('#condition', this.tbs.divTabBodyWrp).MapViewFilter({ _Parent: self });
        },

        showSetting: function () {
            if (this.slider.HTMLRemoved)
                this.drowSetting();
            this.slider.show();
        },

        destroyed: function () {
            __hdrActionSearch.Community = null;
            $(_connection).unbind('NewObjAdd');
        },

        assignValue: function () {
            var self = this;
            if (this.options._viewobj != null) {
                _DisplayEleId = this.options._viewobj.DisplayEleId;
                $.each(_DisplayEleId, function (inx, _eleID) {
                    self.hashDisplayEle.put(_eleID, _eleID);
                });
                this.cStrMapSetting = this.options._viewobj.MapSetting;
            }
        },

        sliderBtn_click: function (btnVal) {
            switch (btnVal) {
                case 'done':
                    this.jsMapElements.generateValue();
                    this.jsMapData.newDataSearch();
                    this.slider.close()
                    break;
                case 'close':
                    this.slider.close()
                    break
            }
        },

        CommonSearch_trigger: function (event, val) {
            this.jsMapData.cStrQuery = val;
            this.jsMapData.cBCommonSearch = true;
            this.jsMapData.newDataSearch();
        },


        EleSelect_trigger: function () {
            this.jsMapData_load();
        },


        getDisplayValue: function (disEleObjs, docData) {
            var self = this;
            var DisplayData = [];
            $.each(docData, function (_inx, rowResult) {
                $.each(disEleObjs, function (_eleinx, DisplyEleID) {
                    if (DisplyEleID == rowResult.cStrID.toLowerCase()) {
                        obj = {};
                        obj.label = self.jsMapElements.hashAllEleLbel.get(DisplyEleID).label;   //DisplyEle.cSElementLable;
                       
                       _tempEle = self.Parent.hashAllTempEle.get(DisplyEleID);
                       
                        obj.value = getDisplayValue(null,_tempEle,rowResult.cStrValue)
                        obj.type = self.jsMapElements.hashAllEleLbel.get(DisplyEleID).type
                        DisplayData.push(obj);
                    }

                    /*
                    if (DisplyEle.cSElementId == undefined && DisplyEle == rowResult.cStrID) {
                        obj = {};
                        obj.label = "Document Title";
                        obj.value = rowResult.cStrValue;
                        DisplayData.push(obj);
                        //return false;
                    }
                    else if (DisplyEle.cSElementId == rowResult.cStrID) {
                        obj = {};
                        obj.label = self.jsMapElements.hashAllEleLbel.get(DisplyEle.cSElementId).label;   //DisplyEle.cSElementLable;
                        obj.value = rowResult.cStrValue;
                        DisplayData.push(obj);
                        //return false;
                    }*/
                });
            });
            return DisplayData;
        },

        generateSuccess_trigger: function () {
            var self = this;
            this.drowFuncElement();
        },

        drowFuncElement: function () {
            var self = this;
            self.divfuncWrpNew.html('');
            if (this.jsMapElements.hashAllEventEle.size() == 0) {
                self.divfuncWrpNew.html('<div class="_22NoMsgContent"><div id="NoMsg" class="_22NoMsg"></div></div>')
                //__DisMessage(3, $('#NoMsg', self.divfuncWrpNew));
                return;
            }
            self.hashSelectEle = new Hashtable();

            $.each(this.jsMapElements.hashAllEventEle.values(), function (inx, eventEle) {
                self.divfuncWrpNew.append(
                    '<div class="_22UCEventWrp">' +
                        '<input type="checkbox" class="_22inpCheckNew" />' +
                        '<div class="_22DateEleNew"></div>' +
                        '<div class="_22EventColorNew"></div>' +
                    '</div>');

                var _divWrp = $('._22UCEventWrp', self.divfuncWrpNew).last();
                $('._22DateEleNew', _divWrp).DrowElementPath({ _temp: self.options._data, _default: eventEle.id })
                $('._22EventColorNew', _divWrp).css('background-color', eventEle.DisColor);
                $('[type="checkbox"]', _divWrp).attr('val', eventEle.id);
                $('[type="checkbox"]', _divWrp).bind('click', function (event) { self.checkbox_click(event) });

                //if (self.options._viewobj != null) {

                //}
                //else {
                if (self.hashDisplayEle.containsKey(eventEle.id)) {
                    self.hashSelectEle.put(eventEle.id, eventEle);
                    $('[type="checkbox"]', _divWrp).attr('checked', 'checked')
                }
                //}
            });
            //this.jsMapData_loadNew();
        },

        checkbox_click: function (event) {
            _eleId = $(event.currentTarget).attr('val');
            if ($(event.currentTarget).is(':checked')) {
                if (!this.hashSelectEle.containsKey(_eleId)) {
                    _obj = this.jsMapElements.hashAllEventEle.get(_eleId)
                    this.hashSelectEle.put(_eleId, _obj);
                    this.hashDisplayEle.put(_eleId, _eleId);
                    this.showHidePionters(_eleId, true);
                }
            }
            else {
                this.hashSelectEle.remove(_eleId);
                this.hashDisplayEle.remove(_eleId);

                this.showHidePionters(_eleId, false);
            }
            // this.jsMapData_loadNew();
        },



        jsMapData_dataRecive: function (event, pResult) {
            var self = this;
            this.cITotal = this.jsMapData.Approx;
            $('#_spnnofrecs').html(this.cITotal.toLocaleString());

            //if(this.jsMapData.page == 0)
            //   this.removePionters();

            $.each(pResult, function (inx, pDocData) {
                docData = self.getDrowResult(pDocData);
                $.each(docData, function (_inx, eleResult) {
                    // alert("ele.cStrID : " + ele.cStrID)
                    if (eleResult.cStrID != null && self.hashSelectEle.containsKey(eleResult.cStrID)) {
                        datType = self.hashSelectEle.get(eleResult.cStrID)
                        obj = {};
                        //var aa = self.getDisplayValue(datType.DisplayObjs, docData);
                        //obj.displayValues = aa;
                        obj.backgroundColor = datType.DisColor;
                        obj.borderColor = datType.DisColor;
                        obj.color = '#FFFFFF';
                        totInx = self.indexCount++;
                        self.drowPins(totInx, obj, eleResult, datType, docData)
                    }
                });
            });
        },


        getDrowResult: function (_result) {
            _finalresult = []
            for (var propt in _result) {
                this[propt] = _result[propt];
                var obj = {};
                obj.cStrID = this.jsMapData.cLFieldListObj.get(propt);
                obj.cStrID == null || obj.cStrID == undefined ? obj.cStrID = 'id' : "";
                obj.cStrValue = _result[propt];

                _finalresult.push(obj)
            }
            return _finalresult;
        },


        /*
                jsMapData_loadNew: function () {
                    var self = this;
                    this.events = [];
                    if (this.isFirstDrow) {
                        this.isFirstDrow = false;
                        this.jsMapElements.generateValue();
                    }
                    else {
                        this.removePionters();
                        
                        $.each(this.jsMapData.TotSampleResult, function (inx, docData) {
                            $.each(docData, function (_inx, ele) {
                                if (self.hashSelectEle.containsKey(ele.cStrID)) {
                                    datType = self.hashSelectEle.get(ele.cStrID)
                                    obj = {};
                                    var aa = self.getDisplayValue(datType.DisplayObjs, docData);
                                    obj.displayValues = aa;
                                    obj.backgroundColor = datType.DisColor;
                                    obj.borderColor = datType.DisColor;
                                    obj.color = '#FFFFFF';
                                    self.drowPins(inx, obj, ele, datType.id,docData)
                                }
                            });
                        });
                    }
                },*/

        drowPins: function (resinx, EleObj, result, datType, rowResult) {
            var self = this;

            var iconBase = self.getIconBase(resinx, EleObj.backgroundColor);
            if (result.cStrValue.split('Coordinates(')[1] != undefined) {
                _cSCordiantes = result.cStrValue.split('Coordinates(')[1].slice(0, -1).split(',')
            }
            else {
                return;
            }
            this._myLatlng = new google.maps.LatLng(_cSCordiantes[1], _cSCordiantes[0]);
            var _gPointers = new google.maps.Marker({
                position: this._myLatlng,
                map: self.gMap,
                title: "",
                draggable: false,
                animation: google.maps.Animation.DROP,
                icon: iconBase
            });
            google.maps.event.addListener(_gPointers, "click", function (event) { self.gPointer_onClick(event, _gPointers, EleObj, datType, rowResult) });
            if (this.gPointersByEleID[datType.id] == undefined || this.gPointersByEleID[datType.id] == null)
                this.gPointersByEleID[datType.id] = [];
            this.gPointersByEleID[datType.id].push(_gPointers);
        },

        getIconBase: function (index, color) {
            hexColor = color.replace('#', '');
            var pinIcon = new google.maps.MarkerImage(
				'http://www.googlemapsmarkers.com/v1/' + (index + 1) + '/' + hexColor + '/FFFFFF/' + hexColor,
				null, /* size is determined at runtime */
				null, /* origin is 0,0 */
				null, /* anchor is bottom center of the scaled image */
				new google.maps.Size(21, 34)
			);
            return pinIcon;
        },

        showHidePionters: function (EleID, isShow) {
            $.each(this.gPointersByEleID[EleID], function (inx, val) {
                val.setVisible(isShow);
            })
        },

        removePionters: function () {
            for (var key in this.gPointersByEleID) {
                $.each(this.gPointersByEleID[key], function (_inx, val) {
                    val.setMap(null);
                })
            }
        },

        getCenterPosition: function () {
            this.cStrMapSetting['lat'] = this.gMap.getCenter().lat();
            this.cStrMapSetting['lang'] = this.gMap.getCenter().lng();
            this.cStrMapSetting['zoom'] = this.gMap.getZoom();
        },

        gPointer_onClick: function (event, _gPointers, EleObj, datType, rowResult) {
            var self = this;
            newDataType = this.jsMapElements.hashAllEventEle.get(datType.id, obj);
            var displayValues = self.getDisplayValue(newDataType.DisplayObjs, rowResult);
            var contentString = "";
            $.each(displayValues, function (inx, _val) {
                contentString = contentString +
                    '<div class="_26UCMapTip">' +
                        '<span class="_26MapTipLbl  _00Lbl2">' + _val.label + ' : </span>' +
                        self.getDisValue(_val) +
                    '</div>';
            });
            if (this.infoWindow == null || this.infoWindow == undefined) {
                this.infoWindow = new google.maps.InfoWindow({
                    content: contentString
                });
            }
            else {
                this.infoWindow.setContent(contentString);
            }
            this.infoWindow.open(this.gMap, _gPointers);
        },


        getDisValue: function (_val) {
            if (_val.type == '22') {
                _val = _val.value.split('e_h_d');
                str = "<img class='_26ImgGif' src=\"data:image/gif;base64," + _val[2] + "\"/>";
                return str;
            }
            else {
                str = '<span class="_26MapTipVal">' + _val.value + '</span>';
                return str;
            }
        },



        funcSetting: function () {
            this.showSetting();
        },

        funcSave: function () {
            _saveViewObj = {};
            _saveViewObj.viewMain = this;
            _saveViewObj.cMeta = this.options._Parent.cMeta;
            $().ViewSave({ _data: _saveViewObj, _saveas: false, });
        },

        funcSaveAs: function () {
            this.funcgenthumb();

        },

        funcgenthumb: function () {
            var self = this;
            this.viewThumbID = "";
            this.cStrThumb = "";
            html2canvas(document.getElementById("gridContent"), {
                useCORS: true,
                onrendered: function (canvas) {
                    self.cStrThumb = canvas.toDataURL();

                    self.viewThumbID = __guidGenerator();
                    $(self).trigger('thumbReady');
                    //uploadFileToCloudFrontS3(dataUrl, "opendataviewimages", self.thumbID, "image/png", self, "onUploadFileToS3Feedback");
                    //$('#gridContent').html('<img src="' + dataUrl + '" />');
                }
            });
        },

        onUploadFileToS3Feedback: function () {
            alert("success")
        },

        load_Arry: function () {
            this.arrResult = JSON.parse('{"bSUCESS":true,"sMSG":"","sEncryptedData":null,"alReqult":[[{"cStrID":"f720b743-7da0-4a5e-fabb-50b68591399e","cStrValue":"chamara"},{"cStrID":"8e5b5376-f44d-a2da-8c37-83a0e3425703","cStrValue":"Colombo, Sri Lanka,Coordinates(79.86124300000006,6.9270786,10)"},{"cStrID":"75cefe22-566e-a458-0c8f-8b3432dd71d2","cStrValue":"Old Kesbewa Road, Jambugasmulla, Sri Lanka,Coordinates(79.8962619208985,6.870499651038252,11)"},{"cStrID":"docname","cStrValue":"New Document"}],[{"cStrID":"f720b743-7da0-4a5e-fabb-50b68591399e","cStrValue":"rishan"},{"cStrID":"8e5b5376-f44d-a2da-8c37-83a0e3425703","cStrValue":"Norris Canal Rd, Colombo 01000, Sri Lanka,Coordinates(79.8669001103516,6.919224744071939,11)"},{"cStrID":"75cefe22-566e-a458-0c8f-8b3432dd71d2","cStrValue":"Kottala Rd, Veyangoda, Sri Lanka,Coordinates(80.06998323437506,7.158776356783283,10)"},{"cStrID":"docname","cStrValue":"New Document"}]],"alMeta":null,"sOrderBy":null,"sSEARCH_ID":"72174905-e702-722f-7fee-5e7d5669b630","sNEXT_TOKEN":"","bCURSOR":false,"iAprox":2}');
        },

        funcPopulateView: function (feedbackFunction) {
            //populate object
            this.Parent.cView.cSearchParam = this.jsMapData.srcObj;
            this.Parent.cView.DisplayEleId = this.hashDisplayEle.values();
            this.Parent.cView.DisplayAllSetting = this.jsMapElements.hashAllEventEle.values();
            this.Parent.cView.MapSetting = this.cStrMapSetting;
            this.Parent.cView.lcondtions = this.jsMapData.lcondtions;
            
            //generate thumbnail
            var self = this;
            this.viewThumbID = "";
            this.cStrThumb = "";
            html2canvas(document.getElementById("gridContent"), {
                useCORS: true,
                onrendered: function (canvas) {
                    self.Parent[feedbackFunction](__guidGenerator(),canvas.toDataURL());                    
                }
            });
        }

    });
})(jQuery);




