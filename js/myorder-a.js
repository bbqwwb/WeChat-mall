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
			location.href=myurl.aurl.replace(myurl.token.openid, params.openid);
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
	function loadData() {    
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
						debug: mall.config.debug,
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
                        $('.con').prepend('<div class="item"><div class="itemtop clearfix"><span class="showoid">订单号：' + data.data.records[i].oid + '</span><span class="status">待付款</span></div><div class="itemcenter clearfix"><div class="centerleft"><img src="'+myurl.imgurl.replace(myurl.token.imgfile, data.data.records[i].productIndex).replace(myurl.token.imgname, data.data.records[i].productIndex)+'"></div><div class="centerright"><div class="inf">' + data.data.records[i].productName + '</div><div class="infcount"><span>&times;' + data.data.records[i].quantity + '</span><span class="heji"><em>合计：</em>&yen;' + (data.data.records[i].price/100).toFixed(2) + '</span></div></div></div><div class="itembottom clearfix"><input value="取消" class="btn mydefault btn-sm cancel" type="button" /><input value="付款" class="btn btn-sm mywarning wcallpay" type="button" /></div></div>');
                    } else if (data.data.records[i].status == 1) {
                        mall.hint.unship++;
                    } else if (data.data.records[i].status == 2 || data.data.records[i].status == 9) {
                        mall.hint.shipped++;
                    } else if (data.data.records[i].status == 3 || data.data.records[i].status == 4 || data.data.records[i].status == 8) {
                        mall.hint.service++;
                    } else if (data.data.records[i].status == 10) {
                        mall.hint.unevaluate++;
                    }
                }
                setHint();
                $(".cancel").bind("click", function() {
                    var oid = ($(this).parent().prev().prev().children(".showoid").text()).split("：")[1];
                    $.ajax({
                        type: 'post',
                        url: myurl.cancelorderurl, 
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
                $(".wcallpay").bind("click", function() {
                    showLoading();
                    var oid = ($(this).parent().prev().prev().children(".showoid").text()).split("：")[1];
                    $.ajax({
                        url:myurl.payurl,
                        type:'post',
                        dataType:'json',
                        data:{
                            payerId:params.openid,
                            oid:oid
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
	} 
});
