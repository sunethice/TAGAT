
var __jsMainSerch;

(function ($) {
    $.fn.ODMain = function (options) { return new $.ODMain(this, options) };
    $.ODMain = function (e, options) {
        var defaults = {
            hdr : null
        }
        var self = this;
        this.options = $.extend(defaults, options);
        this.container = $(e);
        //this.generateTempdata();
        setTimeout(function () { self.setup(); }, 1);
        return this;
    }

    $.ODMain.fn = $.ODMain.prototype = { ODMain: '0.0.1' };
    $.ODMain.fn.extend = $.ODMain.extend = $.extend;
    $.ODMain.fn.extend({

        setup: function () {
            var self = this;
            this.container.html(
              '<div class="containerWrp">' +
              '<div class="container-fluid white-row">'+
	                '<section class="container padding-0">'+
		                '<div class="row text-center top-area margin-0">'+
			                '<div class="col-md-6 col-sm-push-3 col-sm-6">'+
				                '<div class="Search-wrap">'+
					                '<input id="txtSearch" type="search" autocomplete="off" placeholder="Search..." size="40" maxlength="255" class="search-input">' +
					                '<div id="btnSearch" class="search-btn"><i class="fa fa-search"></i></div>' +
				                '</div>'+
			                '</div>'+
			                '<div class="col-md-3 col-sm-3 col-sm-pull-6">'+
				                '<ul class="view-filter">'+
					                '<li>'+
						                '<div class="filter-btn tab-selected"><i class="fa fa-list"></i></div>'+
					                '</li>'+
					                '<li>'+
						                '<div class="filter-btn aa-div-disable"><i class="fa fa-th-large"></i></div>'+
					                '</li>'+
					                '<li>'+
						                '<div class="filter-btn aa-div-disable"><i class="fa fa-map-marker"></i></div>'+
					                '</li>'+
				                '</ul>'+
			                '</div>'+		
			                '<div class="col-md-3">'+
			                '</div>'+
		                '</div>'+
	                '</section>'+
                '</div>'+
                '<section class="container">'	+
			        '<div class="row margin-t20 margin-0">'+
				        '<div class="col-md-6 col-md-push-3 col-sm-12">'+
					        '<ul id="catgoryCon" class="main-filter"></ul>'+
				        '</div>'+
				        '<div id="spnresult" class="col-md-3 col-xs-12 col-md-pull-6 count">'+
					        ''+
				        '</div>'+
				        '<div class="col-md-3 col-xs-12">' +
                            '<div class="filter-tool aa-div-disable">Filter Tools</div>' +
				        '</div>'+
			        '</div>'+
			        '<hr>'+
			        '<div class="row margin-15 open-data-fullwidth">' +
				        '<ul id="BodyWrp" class="data-wrap">' +
				        '</ul>'+
			        '</div>' +
                    '<hr>' +
			        '<div class="row">' +
				        '<ul class="pagination">' +
					        '<li id="example2_previous" class="paginate_button previous disabled">' +
					        '<a href="#" aria-controls="example2" data-dt-idx="0" tabindex="0"><i class="fa  fa-angle-double-left"></i></a>' +
					        '</li>' +
					        '<li class="paginate_button active">' +
					        '<a href="#" aria-controls="example2" data-dt-idx="1" tabindex="0">1</a>' +
					        '</li>' +
					        '<li class="paginate_button ">' +
					        '<a href="#" aria-controls="example2" data-dt-idx="2" tabindex="0">2</a>' +
					        '</li>' +
					        '<li class="paginate_button ">' +
					        '<a href="#" aria-controls="example2" data-dt-idx="3" tabindex="0">3</a>' +
					        '</li>' +
					        '<li class="paginate_button ">' +
					        '<a href="#" aria-controls="example2" data-dt-idx="4" tabindex="0">4</a>' +
					        '</li>' +
					        '<li class="paginate_button ">' +
					        '<a href="#" aria-controls="example2" data-dt-idx="5" tabindex="0">5</a>' +
					        '</li>' +
					        '<li id="example2_next" class="paginate_button next">' +
					        '<a href="#" aria-controls="example2" data-dt-idx="7" tabindex="0"><i class="fa  fa-angle-double-right"></i></a>' +
					        '</li>' +
				        '</ul>' +
			        '</div>' +

		        '</section>'+
                '</div>'
            );
            
            this.initialization();
            this.loadMainSearch();
            this.drowCat();
            this.bindEvent();
            this.redirect();
            //this.assignValue();
        },

        initialization: function () {
            var self = this;
            this.cat = [{ 'txt': 'All', 'val': 'all' }, { 'txt': 'View', 'val': 'view' }, { 'txt': 'Template', 'val': 'temp' }, { 'txt': 'Data', 'val': 'data' }]
            this.divCatgoryCon = $("#catgoryCon", this.container);
            this.txtSearch = $('#txtSearch', this.container);
            this.btnSearch = $('#btnSearch', this.container);
            __divBody = this.divBodyWrp = $('#BodyWrp', this.container);
            
        },

        drowCat: function () {
            var self = this;
            $.each(this.cat, function (inx, val) {
                self.divCatgoryCon.append(
                    '<li id="' + val.val + '">' +
						'<a>' + val.txt + '</a>' +
					'</li>' 
                   );
            });
            $('li', this.divCatgoryCon).bind('click', function (event) { self.navi_click(event) });
        },

        navi_click: function (event) {
            _val = $(event.currentTarget).attr('id');
            $('.filter-selected').removeClass('filter-selected');
            $(event.currentTarget).addClass('filter-selected');
            switch (_val) {
                case 'all':
                    __navigateto('/opendata', true)
                    break;
                case 'data':
                    __navigateto('/opendata/data', true);
                    break;
                case 'temp':
                    __navigateto('/opendata/temp', true);
                    break;
                case 'view':
                    __navigateto('/opendata/view', true);
                    break;
            }
        },

        redirect : function(){
            this.pagedtr = _SERVERSESSION.page.split('?');
            this.type = this.pagedtr[0].split('/')[2];
            this.type = this.type == undefined ? 'all' : this.type;
            $('#' + this.type, this.divCatgoryCon).addClass('filter-selected')
            switch (this.type) {
                case 'all':
                    this.searchAll();
                    break;
                case 'data':
                    this.searchData();
                    break;
                case 'temp':
                    this.searchTemp();
                    break;
                case 'view':
                    this.searchView();
                    break;
                default:
                    this.searchData();
                    break;
            }
        },

        searchAll : function(){
            __jsMainSerch.newSearch('ALL',{ 'Query': this.txtSearch.val() });
        },

        searchData: function () {

            __jsMainSerch.newSearch('DATA', { 'Query': this.txtSearch.val() });
        },

        searchTemp: function () {

            __jsMainSerch.newSearch('TEMPLATE', { 'Query': this.txtSearch.val() });
        },
        searchView: function () {

            __jsMainSerch.newSearch('VIEW', { 'Query': this.txtSearch.val() });
        },

        bindEvent: function () {
            var self = this;
            $(this.btnMore).bind('click', function (event) { self.btnMore_click(event) });
            $(this.btnSearch).bind('click', function (event) { self.btnSearch_click(event) });
            $(this.txtSearch).bind('keyup', function (event) {
                if (event.keyCode == 13) {
                    self.btnSearch_click();
                }
            });

        },

        btnSearch_click: function (event) {
            __jsMainSerch.newSearch(null, { 'Query': this.txtSearch.val() });
        },

        drwoDetails: function () {
            var self = this
            for (i = 0; i < 10; i++) 
                {
                var _obj = {};
                _obj.type = this.type;
                _obj.inx = i;  
            }
        },

            
        divBodyEmpty: function () {
            __divBody.html('');
            __divBody.unbind('scroll');
        },

        loadMainSearch: function () {
            __jsMainSerch = $().MainSearch({});
        },

        drowResult: function (_result) {
            var self = this;
            switch (_result.json.cIType) {
                case enumODSearch['SPACE']:
                    $(__divBody).ODUCSpace({ _data: _result.json, _parent: self });
                    break;
                case enumODSearch['TEMPLATE']:
                    $(__divBody).ODUCTemplate({ _data: _result.json, _parent: self });
                    break;
                case enumODSearch['DATA']:
                    $(__divBody).ODUCData({ _data: _result.json, _parent: self });
                    break;
                case enumODSearch['VIEW']:
                    $(__divBody).ODUCView({ _data: _result.json, _parent: self });
                    break;
            }
        }
    });
})(jQuery);

