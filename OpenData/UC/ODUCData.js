
(function ($) {
    $.fn.ODUCData = function (options) { return new $.ODUCData(this, options) };
    $.ODUCData = function (e, options) {
        var defaults = {
            _data: null,
            _prepend: false,
            _parent: {}

        }
        this.containerWrp = $(e);
        this.options = $.extend(defaults, options);
        this.parent = this.options._parent;
        this.type = this.parent.type;
        this.objData = this.options._data;
        this.Setup();
        return this;
    }

    $.ODUCData.fn = $.ODUCData.prototype = { ODUCData: '0.0.1' };
    $.ODUCData.fn.extend = $.ODUCData.extend = $.extend;
    $.ODUCData.fn.extend({

        Setup: function () {
            var self = this;
            this.jsUCMain = $(this.containerWrp).ODUCMain({ _data: this.objData, _parent: self });

            this.initialization();
            this.assignValue();
            this.bindEvent();
            this.jsUCMain.container.fadeIn(600);
        },

        initialization: function () {
            //this.divIcn = $('#icn', this.container);
        },

        assignValue: function () {
            this.jsUCMain.spnHdr1.addClass('open-data');
            this.jsUCMain.divUrl.text(__OPENDATAURL + 'data/' + this.objData.cStrID);
        },

        bindEvent: function () {
            var self = this;
            $(this.jsUCMain.spnHdr1).bind('click', function (event) { self.spnHdr1_click(event) });
        },

        spnHdr1_click: function (event) {
           
            event.stopPropagation();
            var win = window.open('/opendata/data/' + this.objData.cStrParentID + '/grid', '_blank');
            //__navigateto('/opendata/data/' + this.objData.cStrParentID + '/grid', true);
          

        },
    });
})(jQuery);
