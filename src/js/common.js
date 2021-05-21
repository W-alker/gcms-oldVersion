//密码验证
//以字母开头，长度在6~18之间，只能包含字母、数字和下划线
function isPwd(text) {
    let pat = /^[a-zA-Z]\w{5,17}$/;
    return pat.test(text);
}
//学号验证
//至少六位的纯数字
function isIdCode(text) {
    let pat = /\d{6}/;
    return pat.test(text);
}
//手机号验证
function isTelNumber(text) {
    let pat = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
    return pat.test(text);
}
function isEmail(text){
    let pat = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    return pat.test(text);
}
//密码验证
$('.input-pwd').change(function () { 
    if($(this).val()){
        if (!isPwd($(this).val()))
        alert('请输入正确密码！您的密码应该：以字母开头，长度在6~18之间，只能包含字母、数字和下划线');
    }
})
//学号/工号验证
$('.input-idCode').change(function () {
    if($(this).val()){
    if (!isIdCode($(this).val()))
        alert('您的学号/工号应该由至少六位的纯数字组成');}
})
//手机号验证
$('.input-tel').change(function () {
    if($(this).val()){
    if (!isTelNumber($(this).val()))
        alert('您的手机号可能输入有误');}
})
//邮箱验证
$('.input-email').change(function () {
    if($(this).val()){
    if (!isEmail($(this).val()))
        alert('您的邮箱可能输入有误');}
})

//折叠菜单收起和展开标志箭头
$('.nav-link[data-toggle="collapse"]').click(function(){
    $(this).find('i:last').toggleClass('chevronArrow-down');
})

//点击导航调出对应界面
$('[data-navIndex]').click(function(){
    //排他显示
    $('.gms-mainUI-box').css('display','none').eq($(this).attr('data-navIndex')).css('display','block');
    //更改当前选中导航按钮样式
    $('[data-navIndex]').removeClass('nav-item-chose');
    $('[data-navIndex="'+$(this).attr('data-navIndex')+'"]').addClass('nav-item-chose');
})
$('[data-navIndex="0"]').click(function(){
    $('.gms-mainUI-box').css('display','none').eq(0).css('display','flex');
})


//导航栏显示/隐藏按钮
$('button.display-nav').click(function(){
    if($(this).hasClass('btn-light')){
        $('.navbar').css('transform','translateX(calc(-100% - 6px))')
        $(this).toggleClass('btn-dark').toggleClass('btn-light');
    }
    else{
        $('.navbar').css('transform','translateX(0)')
        $(this).toggleClass('btn-dark').toggleClass('btn-light');
    }
})

//退出登录
$('.logOut-btn').click(function(){
    let chose = confirm("确认退出登录？");
    if(chose){
        $.ajax({
            url:"./logout",
            type:'put',
            success:(data)=>{
                //取消自动登录
                localStorage.setItem("autoLogin",false);
                window.location.href="./"
            }
        })
    }
})

