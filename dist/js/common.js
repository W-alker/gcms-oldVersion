"use strict";function isPwd(t){return/^[a-zA-Z]\w{5,17}$/.test(t)}function isIdCode(t){return/\d{6}/.test(t)}function isTelNumber(t){return/^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/.test(t)}function isEmail(t){return/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(t)}$(".input-pwd").change(function(){$(this).val()&&(isPwd($(this).val())||alert("请输入正确密码！您的密码应该：以字母开头，长度在6~18之间，只能包含字母、数字和下划线"))}),$(".input-idCode").change(function(){$(this).val()&&(isIdCode($(this).val())||alert("您的学号/工号应该由至少六位的纯数字组成"))}),$(".input-tel").change(function(){$(this).val()&&(isTelNumber($(this).val())||alert("您的手机号可能输入有误"))}),$(".input-email").change(function(){$(this).val()&&(isEmail($(this).val())||alert("您的邮箱可能输入有误"))}),$('.nav-link[data-toggle="collapse"]').click(function(){$(this).find("i:last").toggleClass("chevronArrow-down")}),$("[data-navIndex]").click(function(){$(".gms-mainUI-box").css("display","none").eq($(this).attr("data-navIndex")).css("display","block"),$("[data-navIndex]").removeClass("nav-item-chose"),$('[data-navIndex="'+$(this).attr("data-navIndex")+'"]').addClass("nav-item-chose")}),$('[data-navIndex="0"]').click(function(){$(".gms-mainUI-box").css("display","none").eq(0).css("display","flex")}),$("button.display-nav").click(function(){$(this).hasClass("btn-light")?$(".navbar").css("transform","translateX(calc(-100% - 6px))"):$(".navbar").css("transform","translateX(0)"),$(this).toggleClass("btn-dark").toggleClass("btn-light")}),$(".logOut-btn").click(function(){confirm("确认退出登录？")&&$.ajax({url:"./logout",type:"put",success:function(t){localStorage.setItem("autoLogin",!1),window.location.href="./"}})});