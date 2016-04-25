/*
 *Name: BootStrap Help Code 
 *Author: CooMark
 *version: 1.0
 *BootStrap version: 3.0
 */

//TODO 后面改用requirejs加载依赖
;
(function() {
    window.BSJQ = function() {

    };
    BSJQ.InitBootPager = function(options) {
        var pagerdiv = options.pagerdiv;
        var json_url = options.json_url;
        var totalRecords = options.totalRecords;
        var pageSize = options.pageSize;
        var datafields = options.datafields;
        var extracolumns = options.extracolumns;

        pagerdiv = $(pagerdiv);
        pageSize = pageSize || 20;
        var pages = Math.ceil(totalRecords / pageSize);
        var tmp = ''
        tmp += "<nav>";
        tmp += "    <ul class='pagination'>";
        tmp += "        <li class='disabled previous'><a href='#' aria-label='Next'><span aria-hidden='true'>&laquo;</span></a></li>";
        tmp += "        <li class='active'><a href='#'>1</a></li>";

        var header = tmp;
        var pagers = "";

        for (i = 2; i <= pages; i++) {
            pagers = pagers + "<li><a href='#'>" + i + "</a></li>";
        }

        tmp = ''
        tmp += "        <li class='next'><a href='#' aria-label='Previous'><span aria-hidden='true'>&raquo;</span></a></li>";
        tmp += "    </ul>";
        tmp += "</nav>";
        var footer = tmp;

        pagerdiv.find('#pagerbar').html(header + pagers + footer);
        pagerdiv.data({
            totalrows: totalRecords,
            pagesize: pageSize,
            currentpage: 1,
            dataurl: json_url,
            totalpages: pages,
            datafields: datafields,
            extracolumns: extracolumns
        });

        var ClickPage = function(pagerdiv) {
            var pagerdiv = $(pagerdiv)
            var page_index = pagerdiv.data('currentpage');

            var url = pagerdiv.data('dataurl') + '?' + $.param({
                currentpage: pagerdiv.data('currentpage'),
                pagesize: pagerdiv.data('pagesize')
            })

            $.ajax({
                url: url,
                method: 'get',
                success: function(data) {
                    var table = pagerdiv.find('table');
                    var columns = table.find("tr:eq(0) th").length;
                    var datafields = pagerdiv.data('datafields');
                    var extracolumns = pagerdiv.data('extracolumns');

                    table.find('tr:gt(0)').remove();

                    for (var i = data.length - 1; i >= 0; i--) {
                        var RowData = data[i];

                        var tds = '';
                        for (var j = 0; j < datafields.length; j++) {
                            tds += '<td>' + RowData[datafields[j]] + '</td>';
                        }
                        for (var c = 0; c < columns - datafields.length; c++) {
                            tds += '<td>' + extracolumns[c] + '</td>';
                        }

                        table.append($('<tr>' + tds + '</tr>'));
                    };
                }
            });
        };

        pagerdiv.find('li').on("click", function() {
            var page_index = pagerdiv.data('currentpage');
            // console.log(page_index);
            if ($(this).hasClass('previous')) {
                page_index = page_index - 1;
            } else if ($(this).hasClass('next')) {
                page_index = page_index + 1;
            } else {
                page_index = $(this).find('a').html();
            }

            $('li.next').removeClass('disabled');
            $('li.previous').removeClass('disabled');
            if (page_index <= 0) {
                page_index = 1;
                $('li.previous').addClass('disabled');
            }
            if (page_index > pagerdiv.data('totalpages')) {
                page_index = pagerdiv.data('totalpages');
                $('li.next').addClass('disabled');
            }

            if (page_index == pagerdiv.data('currentpage') && page_index != 1) {
                return false;
            }
            pagerdiv.find('li').removeClass('active');
            pagerdiv.find('li').eq(page_index).addClass('active');
            pagerdiv.data('currentpage', page_index);

            ClickPage(pagerdiv);
        });

        pagerdiv.find('li').eq(1).click();
    };


    // BSJQ.alert("Hello world","this is message body.",callback);
    BSJQ.alert = function(message, title, callback) {
        var message = message || '';
        var title = title || 'Note';
        $("body").find("#bsjq_alert").remove();
        var temp = '';
        temp += ' <div class="modal fade" id="bsjq_alert">';
        temp += '     <div class="modal-dialog">';
        temp += '         <div class="modal-content">';
        temp += '             <div class="modal-header text-primary bg-info">';
        temp += '                 <b style="font-size:5">' + title + '</b>';
        temp += '             </div>';
        temp += '             <div class="modal-body">';
        temp += '                 <p>' + message + '</p>';
        temp += '             </div>';
        temp += '             <div class="modal-footer">';
        temp += '                 <button id="bsjq_alert_ok" type="button" class="btn btn-default" data-dismiss="modal">OK</button>';
        temp += '             </div>';
        temp += '         </div>';
        temp += '     </div>';
        temp += ' </div>';
        $("body").append(temp);

        if (callback) {
            $("#bsjq_alert_ok").on('click', function() {
                if (typeof(callback) == 'function')
                    callback();
            });
        }

        $("#bsjq_alert").modal();
    }


    /*at the end return the object*/
    return BSJQ;
})();
