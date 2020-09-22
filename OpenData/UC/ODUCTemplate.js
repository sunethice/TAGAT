
(function ($) {
    $.fn.ODUCTemplate = function (options) { return new $.ODUCTemplate(this, options) };
    $.ODUCTemplate = function (e, options) {
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

    $.ODUCTemplate.fn = $.ODUCTemplate.prototype = { ODUCTemplate: '0.0.1' };
    $.ODUCTemplate.fn.extend = $.ODUCTemplate.extend = $.extend;
    $.ODUCTemplate.fn.extend({

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
            this.jsUCMain.spnHdr1.addClass('open-temp');
            this.jsUCMain.divUrl.text(__OPENDATAURL + 'temp/' + this.objData.cStrID);
            this.jsUCMain.spnHdr2.show();
        },

        bindEvent: function () {
            var self = this;
            $(this.jsUCMain.spnHdr1).bind('click', function (event) { self.spnHdr1_click(event) });
            $(this.jsUCMain.spnHdr2).bind('click', function (event) { self.spnHdr2_click(event) });
        },

        spnHdr1_click: function (event) {
            event.stopPropagation();
            var win = window.open('/opendata/data/' + this.objData.cStrID + '/grid', '_blank');
            
           // __navigateto('/opendata/data/' + this.objData.cStrID + '/grid', false);

        },
        spnHdr2_click: function (event) {
            event.stopPropagation();
            var win = window.open('/opendata/T/'+this.objData.cStrID, '_blank');
            //__navigateto('/opendata/T/'+this.objData.cStrID, true);
        }
    });
})(jQuery);
