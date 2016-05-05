# BSQJ
BootStrap table pageing

#只需要很少的代码就能实现自动填充和分页

#初始化表格和分页
$("#iplisttable").pagingTable({
    json_url: "{% url 'attendence:ip_json'%}",
    pageSize: 2,
    separator: "#" /*V2.1+*/
});
<hr>
#version 2.1 changes:
1.支持模板语法，指定分隔符，默认为 #
2.调整html结构，更符合一般的table结构

#html结构范例:
<table id="iplisttable" class="table table-bordered table-hover table-striped">
    <thead>
        <tr>
            <th width="20%">Name</th>
            <th width="20%">IP</th>
            <th width="20%">Action</th>
        </tr>
    </thead>
    <tbody>
        <tr pk="#ip#" template=1 style="display: none">
            <td>#name#</td>
            <td>#ip#</td>
            <td>
                <a href="javascript:void(0)" onclick="delIP(this)" class="delip" style="cursor:pointer">
                    <span class="glyphicon glyphicon-floppy-remove"></span> <span>(#ip#)</span>
                </a>
                <a style="cursor:pointer;display:inline-block;margin-left:15px;">
                    <span class="glyphicon glyphicon-edit"></span>
                </a>
            </td>
        </tr>
    </tbody>
</table>

<hr>
#version 2.0
#html结构范例:
<table id="iplisttable" class="table table-bordered table-hover table-striped">
    <thead>
        <tr>
            <th width="20%">Name</th>
            <th width="20%">IP</th>
            <th width="20%">Action</th>
        </tr>
        <tr pk-field="ip" template style="display: none">
            <td data-field="name">Name</td>
            <td data-field="ip">IP</td>
            <td>
                <a href="javascript:void(0)" onclick="delIP(this)" class="delip" style="cursor:pointer">
                    <span class="glyphicon glyphicon-floppy-remove"></span>
                </a>
                <a style="cursor:pointer;display:inline-block;margin-left:15px;">
                    <span class="glyphicon glyphicon-edit"></span>
                </a>
            </td>
        </tr>
    </thead>
    <tbody>
    </tbody>
</table>



