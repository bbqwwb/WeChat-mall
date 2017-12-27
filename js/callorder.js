var wechatInfo = navigator.userAgent.match(/MicroMessenger\/([\d\.]+)/i);
if( !wechatInfo ) {
    $("body").html('<img style="width: 100px;margin: 100px auto 0 auto;display: block;" src="images/icon80_smile.2x181c98.png"></br><p style="text-align: center;">请在微信客户端打开链接</p>');
} else if ( wechatInfo[1] < "5.0" ) {
    $("body").html('<img style="width: 100px;margin: 100px auto 0 auto;display: block;" src="images/icon80_smile.2x181c98.png"></br><p style="text-align: center;">本活动仅支持微信5.0以上版本</p>');
}
var sid='';
var uid='';
var params;
$(function(){
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
				location.href = myurl.detailsurl+'?pid='+params.pid+'&openid='+data.openid;
			},
			error:function(xhr, str, e){
				tips(e,error.system);
			}
		});
	}else{
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
						debug:mall.config.debug,
					    appId: data.data.appId, 
					    timestamp: data.data.timestamp, 
					    nonceStr: data.data.nonceStr, 
					    signature: data.data.signature,
					    jsApiList: [
					    'openAddress'
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
			url:myurl.producturl.replace(myurl.token.pid, params.pid),
			type:'get',
			dataType:'json',
			beforeSend:function (XMLHttpRequest) {
			},
			success:function(data, status) {
				if (data.code == 0) { 
					if(data.data.status == 1){
						var lpoint = "";
						var playimg = "";
						var detailimg = "";
						$.each(data.data.images, function(i, v){
							playimg += '<div class="item"><img src="'+myurl.rooturl+data.data.images[i]+'"></div>';
							lpoint += '<li data-target="#myCarousel" data-slide-to="'+i+'"></li>';
						});
						$.each(data.data.images, function(i, v){
							detailimg +='<img src="'+myurl.rooturl+data.data.detailImages[i]+'">';
						});
						$("#coverimg").append(playimg);
						$("#locationpoint").append(lpoint);
						$(".detailimg").append(detailimg);
						$("#locationpoint li:first-child").addClass("active");
						$("#coverimg div:first-child").addClass("active");
						$("#pro-name").html(data.data.name);
						$("#desc").html(data.data.desc);
						for(var i=0; i<data.data.models.length; i++){
							if(data.data.models[i].stock !== 0){
								$("#properties").append('<font data-id="'+data.data.models[i].id+'" data-price="'+data.data.models[i].price+'">'+data.data.models[i].name+'<i></i></font>');
							}
						}
						var priceView = ($(".myguige font:first-child").data("price")/100).toFixed(2);
						$("#price").html(priceView);
						$(".myguige font:first-child").addClass("myactive");
						// 规格选择
						$('.myguige font').bind('click', function() {
							$(this).addClass('myactive').siblings().removeClass('myactive');
							var pricechange = ($(this).data("price")/100).toFixed(2);
							$("#price").html(pricechange);
						 });
					}else{
						document.location.href = myurl.soldurl;
					}
				} else {
					tips(null,data.desc);
				}
				$.ajax({
					url:myurl.getevaluateurl,
					type:'get',
					dataType:'json',
					data:{
						pid:params.pid
					},
					success:function(data, status){
						if (data.code == 0){
							var star=Math.ceil(data.data.statistics.averageRating*2);
							if(star == 0){
								$('.evaluate').remove();
							}else{
								$('.starcount').append('<img src="images/star'+star+'.jpg"><em>'+data.data.statistics.averageRating+'</em>分');
								$('.peoplecount').append('<em>'+data.data.statistics.totalCount+'</em>人评价');
								if(data.data.records.length>=6){
									for(var i=0; i<6; i++){
										$('.evaluatecon').append('<span>'+data.data.records[i].comment.substr(0,8)+'...</span>')
									}
								}else{
									for(var i=0; i<data.data.records.length; i++){
										$('.evaluatecon').append('<span>'+data.data.records[i].comment.substr(0,8)+'...</span>')
									}
								}
							}
						} else {
							tips(null,data.desc);
						}
					},
					error:function(xhr, str, e){
						tips(e,error.system);
					}
				});
			},
			error:function(xhr, str, e){
				tips(e,error.system);
			},
			complete:function(){
				hideLoading();
			}
		});
	}
});

$("#beforeadd").bind('click', function() {
	wx.openAddress({
	  success: function (res) {
	  $("#userName").text(res.userName);
	  $("#telNumber").text(res.telNumber);
	  $("#detailAddress").text(res.provinceName+res.cityName+res.countryName+res.detailInfo);
	  $("#beforeadd").hide();
	  $("#afteradd").show();
	  },
	  cancel: function (res) {
	  },
	  fail: function (res) {
	  }
	});
});
$("#afteradd").bind('click', function() {
	wx.openAddress({
	  success: function (res) {
	  $("#userName").text(res.userName);
	  $("#telNumber").text(res.telNumber);
	  $("#detailAddress").text(res.provinceName+res.cityName+res.countryName+res.detailInfo);
	  },
	  cancel: function (res) {
	  },
	  fail: function (res) {
	  }
	});
});
//跳转到支付页
$("#jumppay").bind("click",function(){
	showLoading();
	var userName = $("#userName").text();
	var telNumber = $("#telNumber").text();
	var detailAddress = $("#detailAddress").text();
	if(userName !== "" && telNumber !== "" && detailAddress !==""){
		var quantity = $("#quantity").val();
		var pmid = $(".myactive").data("id");
		var price = $(".myactive").data("price");
		$.ajax({
			url:myurl.orderurl,
			type:'post',
			dataType:'json',
			data:{
				pmid:pmid,
				quantity:quantity,
				note:'已提交订单',
				name:userName,
				phone:telNumber,
				location:detailAddress,
				uid:uid,
				openid:params.openid,
				sid:sid
			},
			success: function(data, status) {
				if (data.code == 0) {
					var oid = data.data.oid;
					document.location.href = myurl.jumppayurl.replace(myurl.token.oid, oid).replace(myurl.token.openid, params.openid);
				} else {
					tips(null,data.desc);
				}
			},
			error: function(xhr, str, e){
				tips(e,error.system);
			},
			complete:function(){
			hideLoading();
			}
		});
	}else{
        tips(null,error.addaddress);
        hideLoading();
	}
});

//加的效果
$(".myadd").bind('click',function(){
var n=$(this).prev().val();
var num=parseInt(n)+1;
if(num==0){ return;}
$(this).prev().val(num);
});
//减的效果
$(".mycut").click(function(){
var n=$(this).next().val();
var num=parseInt(n)-1;
if(num==0){ return;}
$(this).next().val(num);
});
//解决ios click 300ms延迟
window.addEventListener('load', function() {
FastClick.attach(document.body);
}, false);
