window.onload = function() { hideLoading() };
var params = parseQueryString(location.href);
$("#return").bind("click", function() {
    if ($("#reason1").val() == "") {
        $("#tip span").html("请选择退货原因");
        $("#tip").fadeIn("slow");
        setTimeout(function() {
            $("#tip").fadeOut("slow");
        }, 2000);
    } else if ($("#reason2").val() == "") {
        $("#tip span").html("请选择物流公司");
        $("#tip").fadeIn("slow");
        setTimeout(function() {
            $("#tip").fadeOut("slow");
        }, 2000);
    } else if ($("#reason3").val() == "") {
        $("#tip span").html("请填写物流单号");
        $("#tip").fadeIn("slow");
        setTimeout(function() {
            $("#tip").fadeOut("slow");
        }, 2000);
        $("#reason3").focus();
    } else if ($("#reason4").val() == "") {
        $("#tip span").html("请填写联系电话");
        $("#tip").fadeIn("slow");
        setTimeout(function() {
            $("#tip").fadeOut("slow");
        }, 2000);
        $("#reason4").focus();
    } else {
        var reason = $("#reason1").val() + ' ' + $("#reason2").val() + ' ' + $("#reason3").val() + ' ' + $("#reason4").val() + ' ' + $("#reason5").val();
        $.ajax({
            url: myurl.returnurl.replace(myurl.token.oid, params.oid),
            type: 'post',
            dataType: 'json',
            data: {
                reason: reason
            },
        beforeSend: function(XMLHttpRequest){
            showLoading();
        },
            success: function(data, status) {
            	hideLoading();
                $("#tip span").html(data.desc);
                $("#tip").fadeIn("slow");
                setTimeout(function() {
                    $("#tip").fadeOut("slow");
                    window.location.href = myurl.durl.replace(myurl.token.openid, params.openid);
                }, 2000);
            },
            error: function(xhr, str, e) {
                tips(e,error.system);
            },
        complete:function(){
            hideLoading();
        }
        });
    }

});
