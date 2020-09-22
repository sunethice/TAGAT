
(function ($) {
    $.fn.ViewSave = function (options) { return new $.ViewSave(this, options) };
    $.ViewSave = function (e, options) {
        var defaults = {
            _data: null,
            _saveas: false
        }
        this.container = $(e);
        this.options = $.extend(defaults, options);
        this.data = this.options._data;
        this.cLTagList = [];
        this.setup();
        return this;
    }

    $.ViewSave.fn = $.ViewSave.prototype = { ViewSave: '0.0.1' };
    $.ViewSave.fn.extend = $.ViewSave.extend = $.extend;
    $.ViewSave.fn.extend({

        setup: function () {
            var self = this;
            this.drowSlider();
            this.container = this.slider.divSlideBody;
            this.container.html(
                '<div class="_25ViewWrp">' +
                    '<div class="_25ViewCtrlWrp">' +
                        '<div class="_25ViewLbl _00Lbl2">View Name :</div>' +
                        '<input id="viewName" type="text" class="_00FormTxt _25ViewName" />' +
                    '</div>' +
                    '<div class="_25ViewCtrlWrp">' +
                        '<div class="_25ViewLbl _00Lbl2">Description :</div>' +
                        '<textarea id="viewDescription" type="text" class="_00FormTxtArea _25ViewDiscription" ></textarea>' +
                    '</div>' +
                    '<div class="_25ViewCtrlWrp">' +
                        '<div class="_25ViewLbl _00Lbl2">Tags:</div>' +
                        '<div class="OpenTagIcon"></div>' +
                        '<div class="TSetTagTxtWrap">' +
                            '<div class="OpenTagTxt">Enter a tag name to add.</div>' +
                            '<form id="_frmSpaceGeneralSub" name="frmSpaceGeneralSub">' +
                                '<div id="_divTaggedErrorMsg" class="OpenError" style="display: none;">* Add a name to tag !</div>' +
                                '<div id="_divTaggedSuccessMsg" class="OpenError"></div>' +
                                '<input id="_inputTag" class="POPBodyTxtbox" type="text" name="taggedName">' +
                                '<div id="_btnAddTag" class="OpenTagAddBtn">Add</div>' +
                            '</form>' +
                        '</div>' +
                        '<div id="_divTagNamesContainer" class="OpenTagList"></div>' +
                   ' </div>' +
                '</div>'
                );
            this.initialization();
            this.bindEvent();
            this.assignValue();
            this.slider.show();
        },

        initialization: function () {
            var self = this;
            this.txtViewName = $('#viewName', this.container);
            this.txtViewDescription = $('#viewDescription', this.container);
            this.msg = this.slider.divmsg;
        },

        drowSlider: function () {
            this.slider = $().slider({ _widthPx: 600, _withOther: true, _id: 'viewSave' });
            this.slider.setTitleIcon('_25TitleIcon');
            this.slider.setTitle('Save View');
            btnarr = [{ txt: 'Done', type: 1, val: 'done' }, { txt: 'Close', type: 2, val: 'close' }]
            this.slider.drowbtns(btnarr);
        },

        bindEvent: function () {
            var self = this;
            $(this.slider).bind('slidebtnClick', function (event, btnVal) { self.sliderBtn_click(btnVal); });
            $("#_btnAddTag", this.container).bind('click', function (event) { self.actionFuncAddTag_click(); });
        },

        assignValue: function () {
            var self = this;
            this.txtViewName.val(this.data.cObject.cStrName);
            this.txtViewDescription.val(this.data.cMetaData.cStrDescription);
            if (this.options._saveas) {
                this.slider.setTitle('Save View As');
                this.data.cObject.cStrID = __guidGenerator();
                this.data.cMetaData.cStrID = this.data.cObject.cStrID;
            }
            else {
                this.slider.setTitle('Save View');
            }
            this.cLTagList = this.data.cMetaData.cLTagList;
            $.each(this.cLTagList,function(i,val){
                ctrlTag = $("#_divTagNamesContainer", self.container).UCPODTag({ _tagName: val });
                $(ctrlTag).bind("removeTag", function (event, pStrTag) { self.funcRemoveTag(pStrTag); });
            });
        },

        actionFuncAddTag_click: function () {
            var self = this;
            mStrTag = $("#_inputTag", this.container).val();
            if (mStrTag != null && mStrTag != "") {
                if (!($.inArray(mStrTag, this.cLTagList) > -1)) {
                    ctrlTag = $("#_divTagNamesContainer", this.container).UCPODTag({ _tagName: mStrTag });
                    $(ctrlTag).bind("removeTag", function (event, pStrTag) { self.funcRemoveTag(pStrTag); });
                    this.cLTagList.push(mStrTag);
                }
            }
            $("#_inputTag", this.container).val("");
        },

        funcRemoveTag: function (pStrTag) {
            var self = this;
            for (var i = 0; i < this.cLTagList.length; i++) {
                if (this.cLTagList[i] == pStrTag) {
                    this.cLTagList.splice(i, 1);
                }
            }
        },

        sliderBtn_click: function (btnVal) {
            switch (btnVal) {
                case 'done':
                    this.funcSaveData();
                    break;
                case 'close':
                    this.slider.close();
                    break;
            }
        },

        validate: function () {
            if (this.txtViewName.val() == "") {
                __DisMessage(9, this.msg);
                return false;
            }
            else {
                return true;
            }
        },

        funcSaveData: function () {
            if (this.validate()) {
                this.data.cObject.cStrName = this.txtViewName.val(); this.data.cMetaData.cStrName = this.data.cObject.cStrName;
                this.data.cMetaData.cStrDescription = this.txtViewDescription.val();
                this.data.cMetaData.cLTagList = this.cLTagList;
                this.data.cObject.cDEpochModified = __getEpochTimeNow();
                if (this.data.cObject.cDEpochCreated == 0) {
                    this.data.cObject.cDEpochCreated = this.data.cObject.cDEpochModified;
                }
                this.data.cMetaData.cDEpochCreated = this.data.cObject.cDEpochCreated;
                this.data.cMetaData.cDEpochModified = this.data.cObject.cDEpochModified;                
                jQuery.amBusy();
                jQuery.postback('OpenDataSave', this.data, this, "onSaveOpenDataFeedback");
            }
        },

        onSaveOpenDataFeedback: function (data) {
            jQuery.amReady();
            var self = this;
            if (data.bSUCCESS) {
                __DisMessage(11, this.msg);
                this.slider.close();
            }
            else {
                __DisMessage(10, this.msg);
            }
            return;
        }

    });
})(jQuery);


(function ($) {
    $.fn.UCPODTag = function (options) { return new $.UCPODTag(this, options) };
    $.UCPODTag = function (e, options) {
        var defaults = {
            _tagName: null
        }
        this.options = $.extend(defaults, options);
        $(e).append(
        '<div class="OpenTagWrap">' +
            '<div id="_divTagName" class="OpenTagTxt2">whisky</div>' +
            '<div id="_divRemoveTagName" class="OpenTagClose"></div>' +
        '</div>'
        );
        this.container = $('.OpenTagWrap', $(e)).last();
        this.initialization();
        return this;
    }

    /* EXTEND */
    $.UCPODTag.fn = $.UCPODTag.prototype = { UCPODTag: '0.0.1' };
    $.UCPODTag.fn.extend = $.UCPODTag.extend = $.extend;
    $.UCPODTag.fn.extend({
        initialization: function () {
            $("#_divTagName", this.container).text(this.options._tagName);
            //bind event
            var self = this;
            $("#_divRemoveTagName", this.container).click(function (event) {
                $(self).trigger("removeTag", [self.options._tagName]);
                self.container.remove();
            });
        }
    });
})(jQuery);