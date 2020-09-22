(function ($) {
    $.fn.ODSave = function (options) { return new $.ODSave(this, options) };
    $.ODSave = function (e, options) {
        var defaults = {
            cStrID: null,
            cObjectType: null
        }
        this.container = $(e);
        this.options = $.extend(defaults, options);
        this.getData();
        return this;
    }

    $.ODSave.fn = $.ODSave.prototype = { ODSave: '0.0.1' };
    $.ODSave.fn.extend = $.ODSave.extend = $.extend;
    $.ODSave.fn.extend({

        actionFuncSaveOpenData: function () {
            var self = this;
            $(_connection).unbind("onSaveOpenDataFeedback");
            $(_connection).bind("onSaveOpenDataFeedback", function (event, data) {
                self.onSaveOpenDataFeedback(data);
            });
            __DisMessage(24, this.msg);
            objParam = {};
            objParam.cStrID = this.options._objID;
            objParam.cStrDescription = $("#_inputDescription", this.container).val();
            objParam.cIType = this.options._type;
            objParam.cLTagList = this.cLTagList;
            var json = JSON.stringify(objParam);


            jQuery.postback('OpenDataSave', objParam, this, "onSaveOpenDataFeedback");


            jQuery._post2_viewl2({
                _async: false,
                _data: json,
                _toaddress: _CONST_OPEN_DATA_SAVE,
                _feedbackfunc: 'onSaveOpenDataFeedback',
                _syserrorfunc: 'on_commerror'
            });
        },

        onSaveOpenDataFeedback: function (pData) {
            $(_connection).unbind("onSaveOpenDataFeedback");
            if (pData.bSUCCESS) {
                __DisMessage(25, this.msg);
                this.slider.close();
            }
            else {
                __DisMessage(26, this.msg);
            }
        }


        /*
        
        public string cStrID;
        public string cStrName;
        public string cStrSpaceID;
        public string cStrSpaceName;
        public string cStrParentID;
        public string cStrParentName;
        public string cStrNodeID;
        public string cStrDescription;
        public OpenDataType cIType;
        public List<string> cLTagList;
        public bool cBArchive;
        public string cStrPublisherID;
        public string cStrPublisherName;
        public string cStrPublisherImageID;
        public string cStrIndexText;
        public double cDEpochCreated;
        public double cDEpochModified;
        
        
        
        */
    });
})(jQuery);
