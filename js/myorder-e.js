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
            window.location.href=myurl.eurl.replace(myurl.token.openid, params.openid)
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
function loadData(){
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
                    } else if (data.data.records[i].status == 1) {
                        mall.hint.unship++;
                    } else if (data.data.records[i].status == 2 || data.data.records[i].status == 9) {
                        mall.hint.shipped++;
                    } else if (data.data.records[i].status == 3 || data.data.records[i].status == 4 || data.data.records[i].status == 8) {
                        mall.hint.service++;
                    }else if (data.data.records[i].status == 10) {
                        mall.hint.unevaluate++;
                        $('.con').prepend('<div class="item"><div class="itemtop clearfix"><span class="showoid">订单号：' + data.data.records[i].oid + '</span><span class="status">待评价</span></div><div class="itemcenter clearfix"><div class="centerleft"><img src="'+myurl.imgurl.replace(myurl.token.imgfile, data.data.records[i].productIndex).replace(myurl.token.imgname, data.data.records[i].productIndex)+'"></div><div class="centerright"><div class="inf">' + data.data.records[i].productName + '</div><div class="infcount"><span>&times;' + data.data.records[i].quantity + '</span><span class="heji"><em>合计：</em>&yen;' + (data.data.records[i].price/100).toFixed(2) + '</span></div></div></div><div class="itembottom clearfix"><input value="评价" class="btn btn-sm mywarning evaluate" data-oid="' + data.data.records[i].oid + '"  type="button" /></div></div>');
                    } else if (data.data.records[i].status == 7) {
                        $('.con').prepend('<div class="item"><div class="itemtop clearfix"><span class="showoid">订单号：' + data.data.records[i].oid + '</span><span class="status">交易成功</span></div><div class="itemcenter clearfix"><div class="centerleft"><img src="'+myurl.imgurl.replace(myurl.token.imgfile, data.data.records[i].productIndex).replace(myurl.token.imgname, data.data.records[i].productIndex)+'"></div><div class="centerright"><div class="inf">' + data.data.records[i].productName + '</div><div class="infcount"><span>&times;' + data.data.records[i].quantity + '</span><span class="heji"><em>合计：</em>&yen;' + (data.data.records[i].price/100).toFixed(2) + '</span></div></div></div></div>');
                    }
                }
                setHint();
                $(".evaluate").bind("click", function(){
                    var oid = $(this).data('oid');
                    window.location.href = myurl.jumpevaluate.replace(myurl.token.oid, oid).replace(myurl.token.openid, params.openid);
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
