//切换文本显示眼睛
$(".toggleEye > i").click(function () {
  if ($(this).prop("class") == "fa fa-eye-slash")
    $(".resetPwd-text").prop("type", "text");
  else $(".resetPwd-text").prop("type", "password");
  $(this).toggleClass("fa-eye-slash").toggleClass("fa-eye");
});

$(".hint-box-btn").click(function () {
  $(".gms-login-hint-box").toggle("fast");
  $(this).toggleClass("text-dark").toggleClass("text-success");
});

//这里声明一个变量作为学校名称查询数组，等学校名称加载后读取所有名称并放入数组
let schoolNameList = [];
//尝试从本次会话存储读取学校名称
if (sessionStorage.getItem("gms-UNameArray"))
  schoolNameList = sessionStorage.getItem("gms-UNameArray").split(",");

//弹出选择学校框时开始加载学校名称，只加载一次
$(".select-school-btn")
  .siblings("i")
  .one("click", function () {
    //判断本次会话是否有缓存
    if (!sessionStorage.getItem("gms-UNameList")) {
      $.ajax({
        url: "./universitiesNameList.json",
        type: "get",
        success: function (data) {
          const list = data;
          let tablelist = "";
          for (let i = 0; i < list.length; i++) {
            let listData = "";
            for (let j = 0; j < list[i].data.length; j++) {
              listData += "<tr><td>" + list[i].data[j][0] + "</td></tr>";
              //放入学校名称进入查询数组
              schoolNameList.push(list[i].data[j][0]);
            }
            tablelist += `<table class="table table-hover"><thead>
                                  <tr><th>${list[i].name}</th></tr></thead>
                                  <tbody>${listData}</tbody></table>`;
          }
          $(".schoolName-list-box").html(tablelist);
          //绑定选中事件
          $(".schoolName-list-box td").click(chooseSchool);
          //将学校名称表格和数组存入会话存储
          sessionStorage.setItem("gms-UNameList", tablelist);
          sessionStorage.setItem("gms-UNameArray", schoolNameList);
        },
        error: function () {
          alert("学校名称读取失败！");
        },
      });
    } else {
      $(".schoolName-list-box").html(sessionStorage.getItem("gms-UNameList"));
    }
    //加载完成后为表格行绑定事件
    $(".schoolName-list-box td").click(chooseSchool);
  });
//查找及选定学校
$(".search-schoolName").keyup(function () {
  if ($(".search-schoolName").val()) {
    let name = $(".search-schoolName").val();
    let listdata = "";
    for (let i = 0; i < schoolNameList.length; i++) {
      if (schoolNameList[i].match(name.trim())) {
        listdata += `<tr><td>${schoolNameList[i]}</td></tr>`;
      }
    }
    let list = `<table class="table table-hover">${listdata}</table>`;
    $(".schoolName-list-box").html(list);
    //加载完成后为表格行绑定事件
    $(".schoolName-list-box td").click(chooseSchool);
  } else {
    //搜索条件为空则还原，从本次会话存储直接获取
    $(".schoolName-list-box").html(sessionStorage.getItem("gms-UNameList"));
    $(".schoolName-list-box td").click(chooseSchool);
  }
});
//表格行绑定事件：选定学校
function chooseSchool() {
  $(".chooseSchool-name").text($(this).text());
  //$('.select-school-btn').$(this).text();
}
//改变登录框学校名称
$(".chooseSchool-btn").click(function () {
  $(".select-school-btn").val($(".chooseSchool-name").text());
});
//记住密码提示
$(".rememberPwd").click(function () {
  $(this).find("i").toggleClass("fa-circle-o").toggleClass("fa-check-circle-o");
});

//尝试还原上次登录信息
if (localStorage.getItem("schoolName")) {
  $(".select-school-btn").val(localStorage.getItem("schoolName"));
  $(".input-idCode").val(localStorage.getItem("idCode"));
  $(`[id="${localStorage.getItem("identiy")}"]`).prop("checked", "checked");
  //用户是否已勾选自动登录
  if(localStorage.getItem("autoLogin")==="true"){
    $.ajax({
        url: "/user.html/autoLogin",
        type: "post",
        contentType: "application/json",
        success: function (data) {
         alert("正在尝试自动登录...");
         location.href=`./${localStorage.identiy}.html`;
         return;
        },
        error: function (err) {
          console.log(err);
        },
        statusCode:{
            401:()=>{
                alert("自动登录失败！");
            }
        }
      });
  }
}
//确认登录
$(".login-submit").click(function () {
  //使用Formdata提交登录信息
  let formdata = new FormData(document.querySelector(".gms-login-form"));

  //确保用户非空输入和正确输入
  if (!formdata.get("idCode") || !isIdCode(formdata.get("idCode"))) {
    $(".alert")
      .css("display", "none")
      .eq(0)
      .text("请输入正确学号！")
      .show("fast");
    return;
  }
  if (!formdata.get("password") || !isPwd(formdata.get("password"))) {
    $(".alert")
      .css("display", "none")
      .eq(1)
      .text("请输入正确密码！")
      .show("fast");
    return;
  }
  if (!formdata.get("identiy")) {
    $(".alert").css("display", "none").eq(2).show("fast");
    return;
  }

  //获取用户选中的身份，加入formdata（需要修改原数据）
  const identiy = $('[name="identiy"]:checked').prop("id");
  formdata.set("identiy", identiy);
  //发送请求
  $.ajax({
    url: "./login",
    type: "post",
    //dataType: 'xml',
    data: formdata,
    processData: false,
    contentType: false,
    success: function (data) {
      //根据传回的错误信息进行判断
      switch (data.err) {
        //成功
        case 0: {
          //将本次用户非隐秘信息存在本地,以便用户下次登录
          localStorage.setItem("schoolName", formdata.get("SName"));
          localStorage.setItem("idCode", formdata.get("idCode"));
          localStorage.setItem("identiy", identiy);
              //用户确认勾选自动登录
          if($('.fa-check-circle-o').length===1) localStorage.setItem("autoLogin",true);
          else if($('.fa-check-circle-o').length===0) localStorage.setItem("autoLogin",false);
          //根据服务端返回的地址跳转页面
          window.location.href = data.link;
          break;
        }
        //学号不存在
        case "idCode":
          $(".alert")
            .css("display", "none")
            .eq(0)
            .text("学号/工号不存在！")
            .show();
          break;
        //密码错误
        case "pwd":
          $(".alert")
            .css("display", "none")
            .eq(1)
            .text("您的密码有误！")
            .show("fast");
          break;
        default:
          break;
      }
      console.log(data);
    },
    error: (err) => {
      console.log(err);
    },
  });
});

//找回密码
//获取验证码
$(".get-verifyCode-link").click(() => {
  const email = $("#gms-resetPwd-box .input-email").val();
  const idCode = $("#gms-resetPwd-box .input-idCode").val();
  if (!email) return alert("请输入邮箱！");

  $.ajax({
    headers: {
      idCode: idCode,
      email: email,
    },
    url: "/resetPwd/get_verifyCode",
    type: "post",
    contentType: "application/json",
    success: function (data) {
      $("#gms-resetPwd-box .alert")
        .css("display", "none")
        .eq(1)
        .css("display", "block")
        .text(data.msg);
      return;
    },
    error: function (err) {
      console.log(err);
    },
  });
});
//确认重置
$('#gms-resetPwd-box [type="submit"]').click(() => {
  let formdata = new FormData(document.querySelector("#gms-resetPwd-box form"));
  //确保用户正确和非空输入
  if (!formdata.get("idCode")) {
    $("#gms-resetPwd-box .alert")
      .css("display", "none")
      .eq(0)
      .css("display", "block")
      .text("请输入学号！");
    return;
  }
  if (!formdata.get("verifyCode")) {
    $("#gms-resetPwd-box .alert")
      .css("display", "none")
      .eq(1)
      .css("display", "block")
      .text("请输入验证码！");
    return;
  }
  if (!formdata.get("newPwd")) {
    $("#gms-resetPwd-box .alert")
      .css("display", "none")
      .eq(2)
      .css("display", "block")
      .text("请输入新密码！");
    return;
  }

  $.ajax({
    url: "/resetPwd",
    type: "post",
    contentType: "application/json",
    data: formdata,
    processData: false,
    contentType: false,
    success: function (data) {
      if (data.err === "verifyCode") {
        $("#gms-resetPwd-box .alert")
          .css("display", "none")
          .eq(1)
          .css("display", "block")
          .text(data.msg);
        return;
      }
      if (data.err === "idCode") {
        $("#gms-resetPwd-box .alert")
          .css("display", "none")
          .eq(0)
          .css("display", "block")
          .text(data.msg);
        return;
      }
      if (data.err === 0) {
        $("#gms-resetPwd-box .alert").css("display", "none");
        alert("密码重置成功！");
      }
    },
    error: function (err) {
      console.log(err);
    },
  });
});
