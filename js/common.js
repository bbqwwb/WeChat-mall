var myurl = {
    rooturl:"http://gd.360yhs.com/",
	sip:"http://gd.360yhs.com/mall-backend/",
	mip:"http://gd.360yhs.com/",
    soldurl:"http://gd.360yhs.com/mall/sold.html",//售罄
    jumppayurl:"http://gd.360yhs.com/mall/pay.html?oid={oid}&openid={openid}",//跳转到支付页面
    aurl:"http://gd.360yhs.com/mall/myorder-a.html?openid={openid}",//待付款
    curl:"http://gd.360yhs.com/mall/myorder-c.html?openid={openid}",//待发货
    durl:"http://gd.360yhs.com/mall/myorder-d.html?openid={openid}",//已发货
    eurl:"http://gd.360yhs.com/mall/myorder-e.html?openid={openid}",//待评价
    furl:"http://gd.360yhs.com/mall/myorder-f.html?openid={openid}",//退款/售后
    jumprefundurl:"http://gd.360yhs.com/mall/refund.html?oid={oid}&openid={openid}",//跳转到退款页
    jumpreturnurl:"http://gd.360yhs.com/mall/return.html?oid={oid}&openid={openid}",//跳转到退货页
    jumpevaluate:"http://gd.360yhs.com/mall/evaluate.html?oid={oid}&openid={openid}",//跳转到评价页
    imgurl:"http://gd.360yhs.com/products/{imgfile}/{imgname}.png",//获取图片
    detailsurl:"http://gd.360yhs.com/mall/detail.html",//detail页面url
    openurl:"http://gd.360yhs.com/mall-backend/wechat/openid/",//获取openid
    jsconfigurl:"http://gd.360yhs.com/mall-backend/wechat/jsconfig",//获取jsconfig参数
    producturl:"http://gd.360yhs.com/mall-backend/public/products/{pid}",//detail获取单个商品信息
    orderurl:"http://gd.360yhs.com/mall-backend/public/orders",//提交订单
    refundurl:"http://gd.360yhs.com/mall-backend/public/orders/refund",//退款
    returnurl:"http://gd.360yhs.com/mall-backend/public/orders/return",//退货
    oidurl:"http://gd.360yhs.com/mall-backend/public/orders",//根据订单号获取信息
    payurl:"http://gd.360yhs.com/mall-backend/wechat/orders/pay",//支付
    openidurl:"http://gd.360yhs.com/mall-backend/public/orders",//根据openid获取所有订单
    cancelorderurl:"http://gd.360yhs.com/mall-backend/public/orders/cancel",//取消订单
    remainurl:"http://gd.360yhs.com/mall-backend/public/orders/notify",//提醒发货
    wuliuurl:"http://gd.360yhs.com/mall-backend/public/orders/shipments",//查看物流
    confirmurl:"http://gd.360yhs.com/mall-backend/public/orders/confirm",//确认收货
    evaluateurl:"http://gd.360yhs.com/mall-backend/public/orders/comment",//提交评价
    getevaluateurl:"http://gd.360yhs.com/mall-backend/public/products/comments",//获取评价
    token:{
        pid:"{pid}",
        oid:"{oid}",
        openid:"{openid}",
        imgfile:"{imgfile}",
        imgname:"{imgname}"
    }
};
var error = {
    system:"系统错误！请稍后重试！",
    addaddress:"请添加地址",
    otherpay:"其他支付方式暂未开通！"
};
var mall = {
    config:{
        debug:false,
    },
    hint:{
        unpay:0,
        unship:0,
        shipped:0,
        unevaluate:0,
        service:0
    }
};
function setHint(){
    if(mall.hint.unpay){
        $(".myordera span span").text(mall.hint.unpay).attr("class", "hint");
    }
    if(mall.hint.unship){
        $(".myorderc span span").text(mall.hint.unship).attr("class", "hint");
    }
    if(mall.hint.shipped){
        $(".myorderd span span").text(mall.hint.shipped).attr("class", "hint");
    }
    if(mall.hint.service){
        $(".myorderf span span").text(mall.hint.service).attr("class", "hint");
    }
    if(mall.hint.unevaluate){
        $(".myordere span span").text(mall.hint.unevaluate).attr("class", "hint");
    }
}
function parseQueryString(url) {
        var param = {};
        var str = url.split('?');
        if (str.length > 1) {
            var query = str[1].split('#')[0];
            var arr = query.split('&');
            $.each(arr, function(i, v) {
                var kvs = v.split('=');
                param[kvs[0]] = kvs[1];
            });
        }
        return param;
}
function tips(error,msg,callback){
    if(error){
        console.log(error);
    }
    $("#tip span").html(msg);
    $("#tip").fadeIn("slow");
    setTimeout(function() {
        $("#tip").fadeOut("slow");
        if(callback){
            callback();
        }
    }, 2000)
}
// function loadData(url, data, type, successCallback, beforeSendcall, completecall) {
// 	$.ajax({
// 		method: type || 'GET',
// 		url: url,
// 		data: data || {},
// 		dataType: 'json',
// 		beforeSend: beforeSendcall || function(xhr) {
//             showLoading();
//         },
// 		success: successCallback || function(data, status) { // success callback
// 			if (data.code == 0) {
// 				console.log(data.desc);
// 			} else {
// 				console.log(data.desc);
// 			}
// 		},
// 		error: function(xhr, str, e) {
// 			$('#response').text(e.message);
// 		},
// 		complete: completecall || function(msg) {
// 			hideLoading();
// 		}
// 	});
// }