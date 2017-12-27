var params = parseQueryString(location.href);
var buyer;
var receiverName;
var comment;
var score = 5;
$(function(){
    $.ajax({
        url: myurl.oidurl,
        type: 'get',
        dataType: 'json',
        data:{
            oid:params.oid
        },
        success: function(data, status) {
            if (data.code == 0) {
                $(".item").prepend('<div class="itemtop clearfix"><span class="showoid">订单号：'+data.data.records[0].oid+'</span></div><div class="itemcenter clearfix"><div class="centerleft"><img src="'+myurl.imgurl.replace(myurl.token.imgfile, data.data.records[0].productIndex).replace(myurl.token.imgname, data.data.records[0].productIndex)+'"></div><div class="centerright"><div class="inf">'+data.data.records[0].productName+'</div><div class="infcount"><span>&times;'+data.data.records[0].quantity+'</span><span class="heji"><em>合计：</em>&yen;'+(data.data.records[0].price/100).toFixed(2)+'</span></div></div></div>');
                receiverName = data.data.records[0].receiverName;
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
$(document).ready(function(){
    $('input').iCheck({
    checkboxClass: 'iradio_square-red',
    radioClass: 'iradio_square-red',
    increaseArea: '20%' // optional
    });
    $(".haoping").bind("click", function(){
        $(this).children().addClass("ccolor");
        $(this).siblings().children().removeClass("ccolor");
        score = 5;
    });
    $(".mywarning").bind("click", function(){
        $(this).children().addClass("ccolor");
        $(this).siblings().children().removeClass("ccolor");
        score = 4;
    });
    $(".mydefault").bind("click", function(){
        $(this).children().addClass("ccolor");
        $(this).siblings().children().removeClass("ccolor");
        score = 3;
    });
    $(".fabiao").bind("click", function(){
        showLoading(); 
        if($(".tick").children("div").hasClass('checked')){
            buyer = "匿名用户";
        }else{
            buyer = receiverName.substr(0,1) + "**";
        }
        comment = $(".comment").val();
        $.ajax({
            url:myurl.evaluateurl,
            type:'post',
            dataType:'json',
            data:{
                oid:params.oid,
                buyer:buyer,
                comment:comment,
                rating:score
            },
            success: function(data, status){
                if (data.code == 0) {
                    window.location.href = myurl.eurl.replace(myurl.token.openid, params.openid);
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
});