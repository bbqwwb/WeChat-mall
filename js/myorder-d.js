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
            $('.myordera').attr('href',myurl.aurl.replace(myurl.token.openid, params.openid));
            $('.myorderc').attr('href',myurl.curl.replace(myurl.token.openid, params.openid));
            $('.myordere').attr('href',myurl.eurl.replace(myurl.token.openid, params.openid));
            $('.myorderf').attr('href',myurl.furl.replace(myurl.token.openid, params.openid));
        },
        error:function(xhr, str, e){
            tips(e,error.system);
        }
    });
}else{
    $('.myordera').attr('href',myurl.aurl.replace(myurl.token.openid, params.openid));
    $('.myorderc').attr('href',myurl.curl.replace(myurl.token.openid, params.openid));
    $('.myordere').attr('href',myurl.eurl.replace(myurl.token.openid, params.openid));
    $('.myorderf').attr('href',myurl.furl.replace(myurl.token.openid, params.openid));
}

    $.ajax({
        url: myurl.openidurl.replace(myurl.token.openid, params.openid),
        type: 'get',
        dataType: 'json',
        success: function(data, status) {
            if (data.code == 0) {
                for (var i = 0; i < data.data.length; i++) {
                    if (data.data[i].status == 2) {
                        var pricesum = (data.data[i].price * data.data[i].quantity / 100).toFixed(2);
                        $(".fa-truck span").attr("class", "hint");
                        $('.con').prepend('<div class="item"><div class="itemtop clearfix"><span class="showoid">订单号：' + data.data[i].oid + '</span><span class="status">已发货</span></div><div class="itemcenter clearfix"><div class="centerleft"><img src="images/d2.jpg"></div><div class="centerright"><div class="inf">' + data.data[i].productName + '</div><div class="infcount"><span>&times;' + data.data[i].quantity + '</span><span class="heji"><em>合计：</em>&yen;' + pricesum + '</span></div></div></div><div class="itembottom clearfix"><input value="退货" class="btn btn-sm return" data-oid="' + data.data[i].oid + '"  type="button" /><input value="查看物流" class="btn btn-sm wuliu" data-oid="321321321321321321" type="button" /><input value="确认收货" class="btn btn-sm btn-warning confirm" type="button" /></div><div style="display: none;"><ul class="wl" id="' + data.data[i].oid + '"></ul></div>');
                    } else if (data.data[i].status == 0) {
                        $(".fa-credit-card span").attr("class", "hint");
                    } else if (data.data[i].status == 1) {
                        $(".fa-hourglass-half span").attr("class", "hint");
                    } else if (data.data[i].status == 3) {
                        $(".fa-hourglass-half span").attr("class", "hint");
                    } else if (data.data[i].status == 4) {
                        var pricesum = (data.data[i].price * data.data[i].quantity / 100).toFixed(2);
                        $(".fa-truck span").attr("class", "hint");
                        $('.container.mycontainer').prepend('<ul class="list-group"><li class="list-group-item clearfix"><span class="gloleft">订单号：' + data.data[i].oid + '</span><span class="gloright glocolor">退货中</span></li><li class="list-group-item clearfix"><a href="#" class="pull-left thumbnail glowidth1 mya1"><img src="' + myurl.mip+'products/' + data.data[i].productId + '.jpg" alt="" /></a><h4 class="media-heading myfont1 pull-right"><span class="myleft">' + data.data[i].productName + '</span><span class="myright" >&yen;<em>' + (data.data[i].price / 100).toFixed(2) + '</em></span></h4><p class="glogray myfont1"><span class="myleft">' + data.data[i].productModelName + '</span><span class="myright">&times;<em>' + data.data[i].quantity + '</em></span></p></li><li class="list-group-item clearfix"><em class="glocolor">合计：&yen;</em><span class="glocolor pricesum">' + pricesum + '</span></li></ul>');
                    }
                }
                //查物流
                $(".return").bind("click",function(){
                    var toid = $(this).data('oid');
                    window.location.href = myurl.jumpreturnurl.replace(myurl.token.oid, toid).replace(myurl.token.openid, params.openid);
                });
                $(".wuliu").bind("click", function() {
                    var oid = ($(this).parent().parent().prev().prev().children(".showoid").text()).split("：")[1];
                    if($(this).parent().next().css("display") == "none"){
                        $.ajax({
                            type: 'get',
                            url: myurl.wuliuurl.replace(myurl.token.oid, oid),
                            dataType: 'json',
                            async : false,
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
                    var oid = ($(this).parent().parent().prev().prev().children(".showoid").text()).split("：")[1];
                    $.ajax({
                        url: myurl.confirmurl.replace(myurl.token.oid, oid),
                        type: 'post',
                        dataType: 'json',
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
});
