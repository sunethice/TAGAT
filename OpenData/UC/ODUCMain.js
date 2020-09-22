var __OPENDATAURL = __GAPPENGINE_DOMAIN + "opendata/";

(function ($) {
    $.fn.ODUCMain = function (options) { return new $.ODUCMain(this, options) };
    $.ODUCMain = function (e, options) {
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

    $.ODUCMain.fn = $.ODUCMain.prototype = { ODUCMain: '0.0.1' };
    $.ODUCMain.fn.extend = $.ODUCMain.extend = $.extend;
    $.ODUCMain.fn.extend({

        Setup: function () {
            if (this.options._prepend) {
                this.containerWrp.prepend('<li style="display:none;"></li>');
                this.container = $('li', this.containerWrp).first();
            }
            else {
                this.containerWrp.append('<li style="display:none;"></li>');
                this.container = $('li', this.containerWrp).last();
            }
            this.container.html(
	            '<span id="hdr1" class="open-hdr"></span><span id="hdr2" class="btn-plus crete-hdr aa-div-hide"><i class="fa fa-plus"></i></span>' +
                '<div class="open-datasub">' +
                    '<div id="thumbImg" class="open-thumb" style="display:none;"></div>' +
	                '<div class="open-txt-wrap">'+
		                '<div id="url" class="open-link">www.tagat.com/Template/PILFrhALA/D0JC</div>' +
		                '<div id="txtwrp1" class="open-txt">Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi.</div>' +
		                '<span id="txtwrp2" class="open-txt"></span>' +
		                '<div id="tagContent" class="open-tag-wrap"></div>'+
	                '</div>'+
                '</div>'
            );
            this.initialization();
            this.drowDetails();
        },

        initialization: function () {
            this.spnHdr1 = $('#hdr1', this.container);
            this.spnHdr2 = $('#hdr2', this.container);
            this.divUrl = $('#url', this.container);
            this.divcontent = $('#txtwrp1', this.container);
            this.spninfo = $('#txtwrp2', this.container);
            this.divtagContent = $('#tagContent', this.container);
            this.divThumbImg = $('#thumbImg',this.container);
            
        },

        drowDetails: function () {
        var self = this;
        this.spnHdr1.text(this.objData.cStrName);
        this.divcontent.text(this.objData.cStrDescription);
        
            this.spninfo.append(
                '<span>ID : </span><span>' + this.objData.cStrID + '</span><span class="open-sep">|</span>' +
                '<span>Language : </span><span>English UK</span><span class="open-sep">|</span>' +
                '<span>Created By : </span><span>' + this.objData.cStrPublisherName + '</span><span class="open-sep">|</span>' +
                '<span>Created On : </span><span>' + __showDate(this.objData.cDEpochCreated) + '</span>'
                )
                if(this.objData.cLTagList != undefined)
                {
                    $.each(this.objData.cLTagList, function(inc, tag){
                        self.divtagContent.append('<span class="open-tags">'+tag+'</span>')
                    });
                }
                
                
                
                
        }
    });
})(jQuery);
