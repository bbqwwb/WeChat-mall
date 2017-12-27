var wechatInfo = navigator.userAgent.match(/MicroMessenger\/([\d\.]+)/i);
if( !wechatInfo ) {
    $("body").html('<img style="width: 100px;margin: 100px auto 0 auto;display: block;" src="images/icon80_smile.2x181c98.png"></br><p style="text-align: center;">请在微信客户端打开链接</p>');
} else if ( wechatInfo[1] < "5.0" ) {
    $("body").html('<img style="width: 100px;margin: 100px auto 0 auto;display: block;" src="images/icon80_smile.2x181c98.png"></br><p style="text-align: center;">本活动仅支持微信5.0以上版本</p>');
}

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
            $('.myorderc').attr('href',myurl.curl.replace(myurl.token.openid, params.openid));
            $('.myorderd').attr('href',myurl.durl.replace(myurl.token.openid, params.openid));
            $('.myordere').attr('href',myurl.eurl.replace(myurl.token.openid, params.openid));
            $('.myorderf').attr('href',myurl.furl.replace(myurl.token.openid, params.openid));
        },
        error:function(xhr, str, e){
            tips(e,error.system);
        }
    });
}else{
    $('.myorderc').attr('href',myurl.curl.replace(myurl.token.openid, params.openid));
    $('.myorderd').attr('href',myurl.durl.replace(myurl.token.openid, params.openid));
    $('.myordere').attr('href',myurl.eurl.replace(myurl.token.openid, params.openid));
    $('.myorderf').attr('href',myurl.furl.replace(myurl.token.openid, params.openid));
}
    $.ajax({
        url:myurl.jsconfigurl,
        type:'get',
        dataType:'json',
        data:{
            url:location.href
        },
        success:function(data, status){
            if (data.code == 0){
                wx.config({
					debug: config.debug,
                    appId: data.data.appId, 
                    timestamp: data.data.timestamp, 
                    nonceStr: data.data.nonceStr, 
                    signature: data.data.signature,
                    jsApiList: [
                    'chooseWXPay'
                    ]
                });
            }else{
                tips(null,data.desc);
            }
        },
        error:function(xhr, str, e){
            tips(e,error.system);
        }
    });
    $.ajax({
        url: myurl.openidurl.replace(myurl.token.openid, params.openid),
        type: 'get',
        dataType: 'json',
        success: function(data, status) {
            if (data.code == 0) {
                for (var i = 0; i < data.data.length; i++) {
                    if (data.data[i].status == 0) {
                        var pricesum = (data.data[i].price * data.data[i].quantity / 100).toFixed(2);
                        $(".myordera span span").attr("class", "hint");
                        $('.con').prepend('<div class="item"><div class="itemtop clearfix"><span class="showoid">订单号：' + data.data[i].oid + '</span><span class="status">待付款</span></div><div class="itemcenter clearfix"><div class="centerleft"><img src="images/d2.jpg"></div><div class="centerright"><div class="inf">' + data.data[i].productName + '</div><div class="infcount"><span>&times;' + data.data[i].quantity + '</span><span class="heji"><em>合计：</em>&yen;' + pricesum + '</span></div></div></div><div class="itembottom clearfix"><input value="取消" class="btn btn-sm cancel" type="button" /><input value="付款" class="btn btn-sm btn-warning wcallpay" type="button" /></div>');
                    } else if (data.data[i].status == 1) {
                        $(".myorderc span span").attr("class", "hint");
                    } else if (data.data[i].status == 2) {
                        $(".myorderd span span").attr("class", "hint");
                    } else if (data.data[i].status == 3) {
                        $(".myordere span span").attr("class", "hint");
                    } else if (data.data[i].status == 4) {
                        $(".fa-truck span").attr("class", "hint");
                    }
                }
                $(".cancel").bind("click", function() {
                    var oid = ($(this).parent().prev().prev().children(".showoid").text()).split("：")[1];
                    $.ajax({
                        type: 'post',
                        url: myurl.cancelorderurl.replace(myurl.token.oid, oid), 
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
                $(".wcallpay").bind("click", function() {
                    showLoading();
                    var oid = ($(this).parent().prev().prev().children(".showoid").text()).split("：")[1];
                    //var paypricesum = $(this).prev().prev().text();
                    $.ajax({
                        url:myurl.payurl.replace(myurl.token.oid, oid),
                        type:'post',
                        dataType:'json',
                        data:{
                            pay_type:0,
                            out_user_id:params.openid
                        },
                        success:function(data, status){
                            if (data.code == 0){
                                wx.chooseWXPay({
                                    timestamp: data.data.timeStamp,
                                    nonceStr: data.data.nonceStr, 
                                    package: data.data.package, 
                                    signType: data.data.signType, 
                                    paySign: data.data.paySign, 
                                    success: function (res) {
                                        window.location.href = myurl.curl.replace(myurl.token.openid, params.openid);
                                    },
                                    fail:function(res){
                                        window.location.href = myurl.aurl.replace(myurl.token.openid, params.openid);
                                    },
                                    cancel:function(res){
                                        window.location.href = myurl.aurl.replace(myurl.token.openid, params.openid);
                                    }
                                });
                            }else{
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
