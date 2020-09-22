


(function ($) {
    $.fn.ODInputMain = function (options) { return new $.ODInputMain(this, options) };
    $.ODInputMain = function (e, options) {
        var defaults = {
            hdr: null
        }
        var self = this;
        this.options = $.extend(defaults, options);
        this.container = $(e);
        //this.generateTempdata();
        //setTimeout(function () {  }, 1);
        this.changecount = 0;
        self.setup();
        return this;
    }

    $.ODInputMain.fn = $.ODInputMain.prototype = { ODInputMain: '0.0.1' };
    $.ODInputMain.fn.extend = $.ODInputMain.extend = $.extend;
    $.ODInputMain.fn.extend({

        setup: function () {
            var self = this;
            //this.initialization();
            //this.loadMainSearch();
            //this.bindEvent();
            this.redirect();
            //this.assignValue();
        },

        initialization: function () {
            var self = this;
            this.txtSearch = $('#txtSearch', this.container);


        },

        redirect: function () {
            this.pagedtr = _SERVERSESSION.page.split('?');
            //            if(this.pagedtr[0].split('/')[1] != "opendata")
            //            return;



            this.objtype = this.pagedtr[0].split('/')[2]
            this.cStrID = this.pagedtr[0].split('/')[3];

            switch (this.objtype) {
                case 'T':
                    this.getTemplate();
                    break;
                case 'D':
                    this.getDocument();
                    break;
            }
        },

        getTemplate: function () {
            var self = this;
            var objGet = $().ODGet({ 'cStrID': this.cStrID, 'cObjectType': 0 });
            $(objGet).bind('Feedback', function (event, tempObj) {
                //alertj(tempObj)
                _temp = tempObj.cObject;
                _nativemanager = {}
                _nativemanager.meta = tempObj.cMetaData;
                __InputMain = $(self.container).InpMain({ _Temp: self.Temp, _nativemanager: _nativemanager });
                self.drowHeader();
            })
        },

        getDocument: function () {
            var self = this;
            var objGet = $().ODGet({ 'cStrID': this.cStrID, 'cObjectType': 1 });
            $(objGet).bind('Feedback', function (event, tempObj) {
                //alertj(tempObj)
                _temp = tempObj.cObject;
                _nativemanager = {}
                _nativemanager.meta = tempObj.cMetaData;
                __InputMain = $(self.container).InpMain({ _Temp: _temp, _nativemanager: _nativemanager });
                self.drowHeader();
            })
        },


        drowHeader: function () {

            var self = this;
            this.divHdr = $('#_canvashdr', this.container);
            $(this.divHdr).html(
                '<div class="CanvasTop">' +
                    '<div id="_documentname" class="CanDocTxtWrap _action">' +
                        '<div id="_a1" class="CanDocName">New Document</div>' +
                        '<div class="CanTopTxt">' +
                            '<div id="_a0" class="CanTopTxt2">New Template</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="workFlowWrp2" id="workFlowWrp"></div>' +
                    '<div id="openDataSave"  class="CanDocSave" style="display:none;">Save</div>' +
                    '<div class="CanDocLastUpload">' +
                        '<div class="CanDocLastUploadTxt1" id="docLastUploadLbl">Last uploaded</div>' +
                        '<div class="CanDocLastUploadTxt2" id="docLastUploadDtTime"></div>' +
                    '</div>' +
                '<div class="CanDocSaveTxt aa-div-hide">Saving your data...</div>'
            );
            $(this.divHdr).show();
            this.btnSave = $('#openDataSave', self.divHdr);

            $(this.btnSave).bind('click', function (event) { self.btnSave_click(event) });
            $(__inpEve).bind('hasUpdate', function (event) {
                $(self.btnSave).show();
            });
        },

        btnSave_click: function (event) {
        return;
            obj = {};
            obj.cObject = "";

            alert('save click');
            $().ODSave({});      

            this._savestattarget = target;
            this._savestatcall = savestatuscallback;
            this.changecount++;
            this.cansave = false;

            if (force && force == true) {
                this.cansave = true;
                __jInpValidate.validateDocEle();
                if (__jInpValidate.validateHard.length > 0) {
                    this.cansave = false;
                    this._savestattarget[this._savestatcall](3);
                    return;

                }
                else {

                    if (this.options.publicobject && this.options.publicobject == true && publicsubmitconfirmed == false) {

                        if (ismobile) {
                            var r = confirm('Are you sure your information is correct?');
                            if (r == true)
                                this.cansave = true;
                            else
                                this.cansave = false;
                        }
                        else {
                            this._savestattarget[this._savestatcall](3);
                            $('.POPPublicDocsave', this.container).show();
                            return;
                        }
                    }
                }
            }
            if (this.saving) {
                this._savestattarget[this._savestatcall](1);
            }
            else if (this.cansave != true) {
                this._savestattarget[this._savestatcall](3);
            }
            else {
                this.saving = true;
                this.changecount = 0;
                this._savestattarget[this._savestatcall](1);
                if (this.options.publicobject && this.options.publicobject == true) {
                    _obj = this.get_obj_to_publishclouddocument_public();
                    __calljsonp("savepublicdata", this, "onsave", "onsave", _obj, true); //post
                }
                else {
                    _obj = this.get_obj_to_publishclouddocument();
                    __calljsonp("savedata", this, "onsave", "onsave", _obj, true); //post

                }
            }
        }
    });
})(jQuery);

