
(function ($) {
    $.fn.ODUCSpace = function (options) { return new $.ODUCSpace(this, options) };
    $.ODUCSpace = function (e, options) {
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

    $.ODUCSpace.fn = $.ODUCSpace.prototype = { ODUCSpace: '0.0.1' };
    $.ODUCSpace.fn.extend = $.ODUCSpace.extend = $.extend;
    $.ODUCSpace.fn.extend({

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
            this.jsUCMain.spnHdr1.addClass('open-space');
            this.jsUCMain.divUrl.text(__OPENDATAURL +  'space/' + this.objData.cStrID);
            
        },

        bindEvent: function () {
            var self = this;
            $(this.jsUCMain.spnHdr1).bind('click', function (event) { self.spnHdr1_click(event) });
        },

        spnHdr1_click: function (event) {
            event.stopPropagation();

        }
    });
})(jQuery);
