window.onload = function(){hideLoading()};
var params = parseQueryString(location.href);
$("#refund").bind("click",function(){
    if($("#reason1").val() == ""){
        $("#tip span").html("请选择退款原因");
        $("#tip").fadeIn("slow");
        setTimeout(function(){
            $("#tip").fadeOut("slow");
        },2000);
    }else{
    	var reason = $("#reason1").val()+$("#reason2").val();
        $.ajax({
        url:myurl.refundurl.replace(myurl.token.oid, params.oid),
        type:'post',
        dataType: 'json',
        data:{
            reason:reason
        },
        beforeSend: function(XMLHttpRequest){
            showLoading();
        },
        success:function(data, status){
        	hideLoading();
            $("#tip span").html(data.desc);
            $("#tip").fadeIn("slow");
            setTimeout(function(){
                $("#tip").fadeOut("slow");
                window.location.href = myurl.curl.replace(myurl.token.openid, params.openid);
            },2000);
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