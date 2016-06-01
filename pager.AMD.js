/*
 *Name: BootStrap Pager 
 *Author: CooMark
 *version: 2.2
 *BootStrap version: 3.0
 *AMD defin module for requirejs
 */
define('pager', function() {

    var Pager = new Class();

    Pager.fn.init = function(options) {
        var pager = this;
        pager.tableObj = $(options.table);

        pager.json_url = null;
        pager.pagesize = 10;
        pager.pageNumber = 10; /*how many buttons want to show*/
        pager.separator = "#";
        pager.callback = null;
        $.extend(pager, options);

        pager.currentpage = 1;
        pager.totalrecords = 0;
        pager.pagesize = pager.pagesize;
        pager.dataurl = pager.json_url;
        pager.callback = pager.callback;
        pager.pageNumber = pager.pageNumber;

        if (!pager.tableObj.is("table")) {
            return false;
        }

    };

    Pager.fn.reload = function() {
        this.load(this.currentpage);
    };

    Pager.fn.load = function() {
        var pager = this;

        var load_json = function(currentpage) {
            var currentpage = currentpage || 1;
            $.ajax({
                url: pager.json_url,
                method: 'get',
                data: 'pagesize=' + pager.pagesize + '&currentpage=' + currentpage,
                success: function(resp) {
                        var re_pagebar = pager.totalrecords == resp.totalrecords ? 0 : 1;
                        pager.totalrecords = resp.totalrecords;
                        var data = resp.data;
                        pager.totalpages = Math.ceil(resp.totalrecords / pager.pagesize);
                        pager.tableObj.find('tbody tr[template!=1]').remove();

                        //re-generate the paging bar
                        var template = pager.tableObj.find("tbody tr[template=1]");
                        var tds = template.find('td');

                        var datarow = (template.clone())
                            .removeAttr('template')
                            .removeAttr('style');

                        var template_str = $("<div></div>").append(datarow).html();

                        for (var dr = 0; dr < data.length; dr++) {
                            var newrow = template_str;
                            for (var field in data[dr]) {
                                var reg = new RegExp(pager.separator + field + pager.separator, 'ig');
                                newrow = newrow.replace(reg, data[dr][field]);
                            }
                            pager.tableObj.find('tbody').append(newrow);
                        }

                        if (re_pagebar) {
                            getPageBar(1);
                        }

                        if (pager.callback && typeof(pager.callback) == 'function') {
                            pager.callback();
                        }
                    } //end success
            });
        };

        load_json(1);

        var getPageBar = function(startPage, activePage) {
            var totalpages = pager.totalpages;
            var activePage = activePage || (startPage || 1);
            var startPage = startPage || 1;
            var endPage = startPage + pager.pageNumber - 1;
            endPage = endPage > totalpages ? totalpages : endPage;

            var tmp = '';
            tmp += "<nav>";
            tmp += "    <ul class='pagination'>";
            tmp += "        <li title='First Page' class='disabled first'><a href='javascript:void(0)' aria-label='First'><span class='glyphicon glyphicon-step-backward'></span></a></li>";
            tmp += "        <li title='Previous " + pager.pageNumber + " Pages' class='disabled previous'><a href='javascript:void(0)' aria-label='Next'><span class='glyphicon glyphicon-chevron-left'></span></a></li>";

            var header = tmp;
            var pagers = "";

            for (i = startPage; i <= endPage; i++) {
                pagers = pagers + "<li><a href='javascript:void(0)'>" + i + "</a></li>";
            }

            tmp = ''
            tmp += "        <li title='Last Page' class='next'><a href='javascript:void(0)' aria-label='Previous'><span class='glyphicon glyphicon-chevron-right'></span></a></li>";
            tmp += "        <li title='Next " + pager.pageNumber + " Pages' class='last'><a href='javascript:void(0)' aria-label='First'><span class='glyphicon glyphicon-step-forward'></span></a></li>";
            tmp += "    </ul>";
            tmp += "</nav>";
            var footer = tmp;

            var barName = 'pagerbar_' + pager.tableObj.attr("id");
            $("#" + barName).remove();

            var pagerbar = $("<div></div>").attr("id", barName);
            pagerbar.html(header + pagers + footer).insertAfter(pager.tableObj);

            pagerbar.find('li').on("click", function() {
                page_click(this);
            });

            pagerbar.find('li').each(function() {
                if ($(this).find('a:eq(0)').text() == activePage) {
                    page_click(this);
                }
            });

        };

        var page_click = function(obj) {
            if ($(obj).hasClass('disabled')) {
                return false;
            }

            var pagerbar = $(obj).parents('ul');
            var totalpages = pager.totalpages;
            var pageNumber = pager.pageNumber;
            var startPage = parseInt(pagerbar.find("li:eq(2) a").text());
            var endPage = startPage + pageNumber - 1;
            endPage = endPage > totalpages ? totalpages : endPage;

            var currentpage = pager.currentpage;
            var page_index = currentpage;

            if ($(obj).hasClass('previous')) {
                getPageBar(startPage - pageNumber);
                return;
            } else if ($(obj).hasClass('next')) {
                getPageBar(startPage + pageNumber);
                return;
            } else if ($(obj).hasClass('first')) {
                getPageBar(1);
                return;
            } else if ($(obj).hasClass('last')) {
                getPageBar(totalpages - totalpages % pager.pageNumber + 1, totalpages);
                return;
            } else {
                page_index = $(obj).find('a').text();
            }

            pagerbar.find('li').removeClass('disabled').removeClass('active');

            if (startPage <= 1 || totalpages <= pageNumber) {
                pagerbar.find('li.previous, li.first').addClass('disabled');
            }
            if (endPage >= totalpages || totalpages <= pageNumber) {
                pagerbar.find('li.next, li.last').addClass('disabled');
            }

            page_index = parseInt(page_index);
            pager.currentpage = page_index;
            pagerbar.find('li').each(function() {
                if ($(this).find('a:eq(0)').text() == page_index) {
                    $(this).addClass('active');
                }
            });

            if (page_index != currentpage) {
                load_json(page_index);
            }
        };
    }; //end init

    return Pager;
});
