
(function ($) {
    $.fn.ODGet = function (options) { return new $.ODGet(this, options) };
    $.ODGet = function (e, options) {
        var defaults = {
            cStrID: null,
            cObjectType:null
        }
        this.container = $(e);
        this.options = $.extend(defaults, options);
        this.getData();
        return this;
    }

    $.ODGet.fn = $.ODGet.prototype = { ODGet: '0.0.1' };
    $.ODGet.fn.extend = $.ODGet.extend = $.extend;
    $.ODGet.fn.extend({

        getData: function (pStrID, pObjectType) {
            objParam = {}
            objParam.cStrID = this.options.cStrID;
            objParam.cObjectType = this.options.cObjectType;
            //alert(JSON.stringify(objParam));
            jQuery.postback('OpenDataGet', objParam, this, "funcODGetFeedback");
        },

        funcODGetFeedback: function (pData) {
                var self = this;
            if (pData.cBSuccess) {
                $(self).trigger('Feedback',[pData.cObject])
            }
            else {
                //__jsMsg.show(0, { '_msg': pData.cStrMessage, '_css': '_00MsgRed' });
            }
            return;
        },

    });
})(jQuery);
