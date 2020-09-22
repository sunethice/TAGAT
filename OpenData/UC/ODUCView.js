
(function ($) {
    $.fn.ODUCView = function (options) { return new $.ODUCView(this, options) };
    $.ODUCView = function (e, options) {
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

    $.ODUCView.fn = $.ODUCView.prototype = { ODUCView: '0.0.1' };
    $.ODUCView.fn.extend = $.ODUCView.extend = $.extend;
    $.ODUCView.fn.extend({

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
            this.jsUCMain.spnHdr1.addClass('open-view');
            this.jsUCMain.divUrl.text('http://www.tagat.com/public/view/' + this.objData.cStrID);
//            if(this.objData.cStrThumbID != null && this.objData.cStrThumbID != ""){
//            __showIThubImg(this.jsUCMain.divThumbImg,this.objData.cStrThumbID);
//            this.jsUCMain.divThumbImg.show();
//            }

            if(this.objData.cStrThumb != null && this.objData.cStrThumb != ""){
                _width = $(this.jsUCMain.divThumbImg).css('width');
                _height = $(this.jsUCMain.divThumbImg).css('height');
                this.jsUCMain.divThumbImg.html('<img src="'+this.objData.cStrThumb+'"/>');
                $('img', $(this.jsUCMain.divThumbImg)).css('height', _height);
                $('img', $(this.jsUCMain.divThumbImg)).css('width', _width);
                this.jsUCMain.divThumbImg.show();
            }
        },

        bindEvent: function () {
            var self = this;
            $(this.jsUCMain.spnHdr1).bind('click', function (event) { self.spnHdr1_click(event) });
        },

        spnHdr1_click: function (event) {
            event.stopPropagation();
            var win = window.open('/opendata/v/' + this.objData.cStrID , '_blank');
            
           // __navigateto('/opendata/data/' + this.objData.cStrID + '/grid', false);

        },
    });
})(jQuery);
