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
            $('.myorderd').attr('href',myurl.durl.replace(myurl.token.openid, params.openid));
            $('.myorderf').attr('href',myurl.furl.replace(myurl.token.openid, params.openid));
        },
        error:function(xhr, str, e){
            tips(e,error.system);
        }
    });
}else{
    $('.myordera').attr('href',myurl.aurl.replace(myurl.token.openid, params.openid));
    $('.myorderc').attr('href',myurl.curl.replace(myurl.token.openid, params.openid));
    $('.myorderd').attr('href',myurl.durl.replace(myurl.token.openid, params.openid));
    $('.myorderf').attr('href',myurl.furl.replace(myurl.token.openid, params.openid));
}

    $.ajax({
        url: myurl.openidurl.replace(myurl.token.openid, params.openid),
        type: 'get',
        dataType: 'json',
        success: function(data, status) {
            if (data.code == 0) {
                for (var i = 0; i < data.data.length; i++) {
                    if (data.data[i].status == 0) {
                        $(".fa-credit-card span").attr("class", "hint");
                    } else if (data.data[i].status == 1) {
                        $(".fa-hourglass-half span").attr("class", "hint");
                    } else if (data.data[i].status == 2) {
                        $(".fa-truck span").attr("class", "hint");
                    } else if (data.data[i].status == 3) {
                        $(".fa-hourglass-half span").attr("class", "hint");
                    } else if (data.data[i].status == 4) {
                        $(".fa-truck span").attr("class", "hint");
                    } else if (data.data[i].status == 7) {
                        var pricesum = (data.data[i].price * data.data[i].quantity / 100).toFixed(2);
                        $('.container.mycontainer').prepend('<div class="item"><div class="itemtop clearfix"><span class="showoid">订单号：' + data.data[i].oid + '</span><span class="status">待评价</span></div><div class="itemcenter clearfix"><div class="centerleft"><img src="images/d2.jpg"></div><div class="centerright"><div class="inf">' + data.data[i].productName + '</div><div class="infcount"><span>&times;' + data.data[i].quantity + '</span><span class="heji"><em>合计：</em>&yen;' + pricesum + '</span></div></div></div><div class="itembottom clearfix"><input value="评价" class="btn btn-sm btn-warning evaluate" type="button" /></div>');
                    } else if (data.data[i].status == 8) {
                        var pricesum = (data.data[i].price * data.data[i].quantity / 100).toFixed(2);
                        $('.container.mycontainer').prepend('<ul class="list-group"><li class="list-group-item clearfix"><span class="gloleft">订单号：' + data.data[i].oid + '</span><span class="gloright glocolor">已退款</span></li><li class="list-group-item clearfix"><a href="#" class="pull-left thumbnail glowidth1 mya1"><img src="' + myurl.mip+'products/' + data.data[i].productId + '.jpg" alt="" /></a><h4 class="media-heading myfont1 pull-right"><span class="myleft">' + data.data[i].productName + '</span><span class="myright" >&yen;<em>' + (data.data[i].price / 100).toFixed(2) + '</em></span></h4><p class="glogray myfont1"><span class="myleft">' + data.data[i].productModelName + '</span><span class="myright">&times;<em>' + data.data[i].quantity + '</em></span></p></li><li class="list-group-item clearfix"><em class="glocolor">合计：&yen;</em><span class="glocolor pricesum">' + pricesum + '</span></li></ul>');
                    }
                }
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
