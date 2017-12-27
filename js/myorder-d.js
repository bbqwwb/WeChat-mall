var params;
$(function() {
params = parseQueryString(location.href);
if (!params.openid) {
    $.ajax({
        url:myurl.openurl,
        type:'get',
        dataType:'json',
        data:{
            code:params.code
        },
        success:function(data, status){
            params.openid = data.openid;
            window.location.href=myurl.durl.replace(myurl.token.openid, params.openid)
        },
        error:function(xhr, str, e){
            tips(e,error.system);
        }
    });
}else{
    $('.myordera').attr('href',myurl.aurl.replace(myurl.token.openid, params.openid)+'&random='+parseInt(Math.random()*500000));
    $('.myorderc').attr('href',myurl.curl.replace(myurl.token.openid, params.openid)+'&random='+parseInt(Math.random()*500000));
    $('.myorderd').attr('href',myurl.durl.replace(myurl.token.openid, params.openid)+'&random='+parseInt(Math.random()*500000));
    $('.myordere').attr('href',myurl.eurl.replace(myurl.token.openid, params.openid)+'&random='+parseInt(Math.random()*500000));
    $('.myorderf').attr('href',myurl.furl.replace(myurl.token.openid, params.openid)+'&random='+parseInt(Math.random()*500000));
    loadData();
}
function loadData(){
    $.ajax({
        url: myurl.openidurl,
        type: 'get',
        dataType: 'json',
        data:{
            openid:params.openid
        },
        success: function(data, status) {
            if (data.code == 0) {
                for (var i = 0; i < data.data.records.length; i++) {
                    if (data.data.records[i].status == 0) {
                         mall.hint.unpay++;
                    } else if (data.data.records[i].status == 1) {
                        mall.hint.unship++;
                    } else if(data.data.records[i].status == 2){
                        mall.hint.shipped++;
                        $('.con').prepend('<div class="item"><div class="itemtop clearfix"><span class="showoid">订单号：' + data.data.records[i].oid + '</span><span class="status">已发货</span></div><div class="itemcenter clearfix"><div class="centerleft"><img src="'+myurl.imgurl.replace(myurl.token.imgfile, data.data.records[i].productIndex).replace(myurl.token.imgname, data.data.records[i].productIndex)+'"></div><div class="centerright"><div class="inf">' + data.data.records[i].productName + '</div><div class="infcount"><span>&times;' + data.data.records[i].quantity + '</span><span class="heji"><em>合计：</em>&yen;' + (data.data.records[i].price/100).toFixed(2) + '</span></div></div></div><div class="itembottom clearfix"><input value="退货" class="btn btn-sm mydefault return" data-oid="' + data.data.records[i].oid + '"  type="button" /><input value="查看物流" class="btn btn-sm mydefault wuliu" data-oid="321321321321321321" type="button" /><input value="确认收货" class="btn btn-sm mywarning confirm" type="button" /></div><div style="display: none;"><ul class="wl" id="' + data.data.records[i].oid + '"></ul></div></div>');
                    }else if (data.data.records[i].status == 9) {
                        mall.hint.shipped++;
                        $('.con').prepend('<div class="item"><div class="itemtop clearfix"><span class="showoid">订单号：' + data.data.records[i].oid + '</span><span class="status">备货中</span></div><div class="itemcenter clearfix"><div class="centerleft"><img src="'+myurl.imgurl.replace(myurl.token.imgfile, data.data.records[i].productIndex).replace(myurl.token.imgname, data.data.records[i].productIndex)+'"></div><div class="centerright"><div class="inf">' + data.data.records[i].productName + '</div><div class="infcount"><span>&times;' + data.data.records[i].quantity + '</span><span class="heji"><em>合计：</em>&yen;' + (data.data.records[i].price/100).toFixed(2) + '</span></div></div></div><div class="itembottom clearfix"><input value="退货" class="btn btn-sm mydefault return" data-oid="' + data.data.records[i].oid + '"  type="button" /></div><div style="display: none;"></div></div>');
                    } else if (data.data.records[i].status == 3 || data.data.records[i].status == 4 || data.data.records[i].status == 8) {
                        mall.hint.service++;
                    } else if(data.data.records[i].status == 10){
                        mall.hint.unevaluate++;
                    }
                }
                setHint();
                //查物流
                $(".return").bind("click",function(){
                    var toid = $(this).data('oid');
                    window.location.href = myurl.jumpreturnurl.replace(myurl.token.oid, toid).replace(myurl.token.openid, params.openid);
                });
                $(".wuliu").bind("click", function() {
                    var oid = $(this).prev().data('oid');
                    if($(this).parent().next().css("display") == "none"){
                        $.ajax({
                            type: 'get',
                            url: myurl.wuliuurl,
                            dataType: 'json',
                            async : false,
                            data:{
                                oid:oid
                            },
                            success: function(data, status) {
                                if (data.code == 0) {
                                    var ddata = JSON.parse(data.data);
                                    eval("var tmp=$('#" + oid + "');");
                                    var delivery = '';
                                    if (ddata.status == 200) {
                                        $.each(ddata.data, function(i, v) {
                                            delivery += '<li><p>' + v.context + '</p><p>' + v.time + '</p></li>'
                                        });
                                        tmp.append(delivery);
                                    } else {
                                        tmp.html("<li><p>暂时没有物流信息</p><p>");
                                    }
                                    tmp.parent().animate({
                                        height: 'toggle',
                                    }, 100);
                                } else {
                                    tips(null,data.desc);
                                }
                            },
                            error: function(xhr, str, e) {
                                tips(e,error.system);
                            }
                        });
                    }else{
                        $(this).parent().next().animate({
                            height: 'toggle',
                        }, 100);
                        $(this).parent().next().children().html("");
                    }
                    // $(this).parent().next().animate({
                    //     height: 'toggle',
                    // }, 100);
                    // $(this).parent().next().show();
                });
                $(".confirm").bind("click", function() {
                    var oid = $(this).prev().prev().data('oid');
                    $.ajax({
                        url: myurl.confirmurl,
                        type: 'post',
                        dataType: 'json',
                        data:{
                            oid:oid
                        },
                        success: function(data, status) {
                            tips(null,data.desc,function(){
                            window.location.reload();
                            });
                        },
                        error: function(xhr, str, e) {
                            tips(e,error.system);
                        }
                    });
                });
            } else {
                tips(null,data.desc);
            }
        },
        error: function(xhr, str, e) {
            tips(e,error.system);
        },
        complete: function() {
            hideLoading();
        }
    });
}

});

