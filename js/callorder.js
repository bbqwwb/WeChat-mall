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
				params.openid = data.openid;
			},
			error:function(xhr, str, e){
				tips(e,error.system);
			}
		});
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
					debug:config.debug,
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
				if(data.data.status == 3){
					var priceView = (data.data.models[0].price/100).toFixed(2);
					$(".mycontainer").prepend('<img class="fullwidth" src="'+myurl.mip+'products/'+data.data.id+'.jpg" alt="">');
					$("#pro-name").html(data.data.name);
					$("#desc").html(data.data.desc);
					$("#price").html(priceView);
					for(var i=0; i<data.data.models.length; i++){
						if(data.data.models[i].stock !== 0){
							$("#properties").append('<font data-id="'+data.data.models[i].id+'" data-price="'+data.data.models[i].price+'">'+data.data.models[i].name+'<i></i></font>');
							$(".myguige font:first-child").addClass("myactive");
						}
					}
					// 规格选择
					$('.myguige font').bind('click', function() {
						$(this).addClass('myactive').siblings().removeClass('myactive');
						var pricechange = ($(this).data("price")/100).toFixed(2);
						$(".price em").html(pricechange);
					 });
				}else{
					document.location.href = myurl.soldurl;
				}
			} else {
				tips(null,data.desc);
			}
		},
		error:function(xhr, str, e){
			tips(e,error.system);
		},
		complete:function(){
			hideLoading();
		}
	});
});

$("#beforeadd").bind('click', function() {
	wx.openAddress({
	  success: function (res) {
	  alert("success1");
	  $("#userName").text(res.userName);
	  $("#telNumber").text(res.telNumber);
	  $("#detailAddress").text(res.provinceName+res.cityName+res.countryName+res.detailInfo);
	  $("#beforeadd").hide();
	  $("#afteradd").show();
	  alert("success2");
	  },
	  cancel: function (res) {
	  alert("scancel");
	  },
	  fail: function (res) {
	  alert("fail");
	  }
	});
});
$("#afteradd").bind('click', function() {
	wx.openAddress({
	  success: function (res) {
	  alert("success1");
	  $("#userName").text(res.userName);
	  $("#telNumber").text(res.telNumber);
	  $("#detailAddress").text(res.provinceName+res.cityName+res.countryName+res.detailInfo);
	  alert("success2");
	  },
	  cancel: function (res) {
	  	alert("scancel");
	  },
	  fail: function (res) {
	  	alert("fail");
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
				price:price,
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
