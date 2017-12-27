
$(document).ready(function(){
//加的效果
$(".myadd").click(function(){
var n=$(this).prev().val();
var num=parseInt(n)+1;
if(num==0){ return;}
$(this).prev().val(num);
//确认购买页面实时更改结果
$(".myresult").html("x"+num);
});
//减的效果
$(".mycut").click(function(){
var n=$(this).next().val();
var num=parseInt(n)-1;
if(num==0){ return;}
$(this).next().val(num);
//确认购买页面实时更改结果
$(".myresult").html("x"+num);
});
});

// 生成提示框
var layer=document.createElement("div");
layer.id="layer";
function func()
{
	var style=
	{
		position:"absolute",
		zIndex:10,
		width:"200px",
		height:"50px",
		top:"200px",
	}
	for(var i in style)
		layer.style[i]=style[i];	
	if(document.getElementById("layer")==null)
	{
		document.body.appendChild(layer);
		setTimeout("document.body.removeChild(layer)",1200)	
	}
	document.getElementById("layer").innerHTML="已成功添加到购物车";

}
// 规格选择
$('.myguige font').bind('click', function() {
    $(this).addClass('myactive').siblings().removeClass('myactive');
 });

