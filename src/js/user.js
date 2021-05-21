//进入页面发送请求，验证登录
$.ajax({
  //携带token。但这里设置的是httpOnly无法获取，交给服务端处理
  /*     headers:{
        Accept: "application/json; charset=utf-8",
        Authorization:$.cookie('curToken')
    }, */
  url: "/user.html/home",
  type: "put",
  async: false, //禁止异步
  contentType: "application/json",
  statusCode: {
    401: function () {
      //token验证失败 异常处理
      alert("登录已过期，请重新登录！");
      window.location.href = "/";
    },
  },
  success: function (data) {
    alert(data.msg);
    return;
  },
  error: function (err) {
    console.log(err);
  }
});
//向服务器端请求，加载初始化个人信息
$.ajax({
  url: "/user.html/upload_info",
  type: "put",
  contentType: 'application/json',
  success: function(data){
    //接收数据
    const {name,profile,email,phone}=data;
    //显示对应信息
    $('a.profile > img').prop("src",profile);
    $('.preview_profile').prop('src',profile);
    $('[data-index="2"] [name="email"]').val(email);
    $('[data-index="2"] [name="tel"]').val(phone);
  },
  error:function(err){
    console.log(err)
  }
})

/* 首页 */
$(document).ready(function () {
  //初始化弹出框事件
  $('[data-toggle="popover"]').popover();
});
/*首页时钟插件*/
const Flipper = /** @class */ (function () {
  function Flipper(node, currentTime, nextTime) {
    this.isFlipping = false;
    this.duration = 600;
    this.flipNode = node;
    this.frontNode = node.querySelector(".front");
    this.backNode = node.querySelector(".back");
    this.setFrontTime(currentTime);
    this.setBackTime(nextTime);
  }
  Flipper.prototype.setFrontTime = function (time) {
    this.frontNode.dataset.number = time;
  };
  Flipper.prototype.setBackTime = function (time) {
    this.backNode.dataset.number = time;
  };
  Flipper.prototype.flipDown = function (currentTime, nextTime) {
    var _this = this;
    if (this.isFlipping) {
      return false;
    }
    this.isFlipping = true;
    this.setFrontTime(currentTime);
    this.setBackTime(nextTime);
    this.flipNode.classList.add("running");
    setTimeout(function () {
      _this.flipNode.classList.remove("running");
      _this.isFlipping = false;
      _this.setFrontTime(nextTime);
    }, this.duration);
  };
  return Flipper;
})();
var getTimeFromDate = function (date) {
  return date.toTimeString().slice(0, 8).split(":").join("");
};
const flips = document.querySelectorAll(".flip");
const now = new Date();
let nowTimeStr = getTimeFromDate(new Date(now.getTime() - 1000));
let nextTimeStr = getTimeFromDate(now);
let flippers = Array.from(flips).map(function (flip, i) {
  return new Flipper(flip, nowTimeStr[i], nextTimeStr[i]);
});
setInterval(function () {
  var now = new Date();
  var nowTimeStr = getTimeFromDate(new Date(now.getTime() - 1000));
  var nextTimeStr = getTimeFromDate(now);
  for (var i = 0; i < flippers.length; i++) {
    if (nowTimeStr[i] === nextTimeStr[i]) {
      continue;
    }
    flippers[i].flipDown(nowTimeStr[i], nextTimeStr[i]);
  }
}, 1000);
//日期显示
$(".date-day")
  .text(
    "今天是：" +
      now.getFullYear() +
      "年" +
      now.getMonth() +
      "月" +
      now.getDate() +
      "日"
  )
  .addClass(".date-day-ani");
//显示对应界面
function display_index3() {
  $(".gms-mainUI-box").css("display", "none").eq(3).css("display", "block");
}
function display_index6() {
  $(".gms-mainUI-box").css("display", "none").eq(6).css("display", "block");
}

/* 修改密码 */
//确认修改密码请求
$('[data-index="1"] button').click(function(){
  let formdata=new FormData(document.querySelector('[data-index="1"] form'));
  formdata.set('idCode',localStorage.getItem('idCode'));
  //确保用户正确和非空输入
  if(!formdata.get('oldPwd')){
    $('[data-index="1"] .alert').css('display','none').eq(0).css('display','block').text('请输入旧密码！')
    return;
  }
  if(!formdata.get('newPwd')){
    $('[data-index="1"] .alert').css('display','none').eq(1).css('display','block').text('请输入新密码！')
    return;
  }
  if(!formdata.get('confirmPwd')){
    $('[data-index="1"] .alert').css('display','none').eq(2).css('display','block').text('请确认新密码！')
    return;
  }
  //确认密码不一致
  if(formdata.get('newPwd') !== formdata.get('confirmPwd')){
    $('[data-index="1"] .alert').css('display','none').eq(2).css('display','block').text('两次密码不一致！')
    return;
  }

  $.ajax({
    url: "/user.html/update_pwd",
    type: "post",
    contentType: "application/json",
    data: formdata,
    processData: false,
    contentType: false,
    success: function (data) {
      if(data.err==='verify_code'){
        $('[data-index="1"] .alert').css('display','none').eq(3).css('display','block').text(data.msg);
        return;
      }
      if(data.err==='oldPwd'){
        $('[data-index="1"] .alert').css('display','none').eq(0).css('display','block').text(data.msg);
        return;
      }
      if(data.err===0){
        $('[data-index="1"] .alert').css('display','none');
        alert('密码修改成功！');
        location.reload();
      }
    },
    error: function (err) {
      console.log(err);
    },
  });
})

/* 修改个人信息 */
//头像实时预览
//保存base64格式图片的变量
let profile_base64URL;
$(".update_profile").change(function () {
  if (this.files.length) {
    let file = this.files[0];
    //新建 FileReader 对象
    let reader = new FileReader();
    // 设置以什么方式读取文件，这里以base64方式
    reader.readAsDataURL(file);
    reader.onload = function () {
      // 当 FileReader 读取文件时候，读取的结果会放在 FileReader.result 属性中
      document.querySelector(".preview_profile").src = this.result;
      profile_base64URL = this.result;
    };
  }
});
//上传修改信息
$('[data-index="2"] [type="submit"]').click(function () {
  let formdata = new FormData(document.querySelector("[data-index='2'] form"));
  formdata.set('profile_base64URL',profile_base64URL);
  formdata.set('idCode',localStorage.getItem('idCode'));

  $.ajax({
    url: "/user.html/update_info",
    type: "put",
    data: formdata,
    //contentType: "application/json",
    processData: false,
    contentType: false,
    success: function (data) {
      alert(data.msg);
      location.reload();
    },
    error: function (err) {
      console.log(err);
    },
  });
});

//开始加载嵌入网页,只执行一次
$('[data-navIndex="4"]').one("click", function () {
  $('.gms-mainUI-box[data-index="4"] > iframe').prop(
    "src",
    "https://lajifenleiapp.com/"
  );
  
});
//开始加载地图,同样只执行一次
$('[data-navIndex="5"]').one("click", function () {
  let map = new BMapGL.Map("gms-map-box"); // 创建Map实例
  map.centerAndZoom(new BMapGL.Point(117.204384, 31.760012), 20); // 初始化地图,设置中心点坐标和地图级别
  //3d视角
  map.setHeading(64.5);
  map.setTilt(60);
  //创建几个垃圾分类回收点标记作为示例
  // 创建点标记
  var marker1 = new BMapGL.Marker(new BMapGL.Point(117.202439, 31.758872));
  var marker2 = new BMapGL.Marker(new BMapGL.Point(117.202807, 31.75911));
  var marker3 = new BMapGL.Marker(new BMapGL.Point(117.203122, 31.759394));
  var marker4 = new BMapGL.Marker(new BMapGL.Point(117.203405, 31.59659));
  var marker5 = new BMapGL.Marker(new BMapGL.Point(117.203724, 31.759916));
  var marker6 = new BMapGL.Marker(new BMapGL.Point(117.203122, 31.758542));
  var marker7 = new BMapGL.Marker(new BMapGL.Point(117.203459, 31.758542));
  var marker8 = new BMapGL.Marker(new BMapGL.Point(117.203773, 31.758795));
  var marker9 = new BMapGL.Marker(new BMapGL.Point(117.204097, 31.759072));
  var marker10 = new BMapGL.Marker(new BMapGL.Point(117.204254, 31.759624));
  var marker11 = new BMapGL.Marker(new BMapGL.Point(117.203445, 31.75969));
  var marker12 = new BMapGL.Marker(new BMapGL.Point(117.20332, 31.76038));
  var marker13 = new BMapGL.Marker(new BMapGL.Point(117.2641, 31.759851));
  var marker14 = new BMapGL.Marker(new BMapGL.Point(117.205273, 31.761064));
  var marker15 = new BMapGL.Marker(new BMapGL.Point(117.206333, 31.760722));
  var marker16 = new BMapGL.Marker(new BMapGL.Point(117.205269, 31.761701));
  var marker17 = new BMapGL.Marker(new BMapGL.Point(117.206571, 31.762226));
  var marker18 = new BMapGL.Marker(new BMapGL.Point(117.208319, 31.761716));
  var marker19 = new BMapGL.Marker(new BMapGL.Point(117.207398, 31.761731));
  var marker20 = new BMapGL.Marker(new BMapGL.Point(117.208211, 31.76106));
  var marker21 = new BMapGL.Marker(new BMapGL.Point(117.20265, 31.75987));
  var marker22 = new BMapGL.Marker(new BMapGL.Point(117.20195, 31.759667));
  // 在地图上添加点标记
  map.addOverlay(marker1);
  map.addOverlay(marker2);
  map.addOverlay(marker3);
  map.addOverlay(marker4);
  map.addOverlay(marker5);
  map.addOverlay(marker6);
  map.addOverlay(marker7);
  map.addOverlay(marker8);
  map.addOverlay(marker9);
  map.addOverlay(marker10);
  map.addOverlay(marker11);
  map.addOverlay(marker12);
  map.addOverlay(marker13);
  map.addOverlay(marker14);
  map.addOverlay(marker15);
  map.addOverlay(marker16);
  map.addOverlay(marker17);
  map.addOverlay(marker18);
  map.addOverlay(marker19);
  map.addOverlay(marker20);
  map.addOverlay(marker21);
  map.addOverlay(marker22);

  // 创建定位控件
  var locationControl = new BMapGL.LocationControl({
    // 控件的停靠位置（可选，默认左上角）
    anchor: BMAP_ANCHOR_TOP_RIGHT,
    // 控件基于停靠位置的偏移量（可选）
    offset: new BMapGL.Size(20, 20),
  });
  // 将控件添加到地图上
  map.addControl(locationControl);
  // 添加定位事件
  locationControl.addEventListener("locationSuccess", function (e) {
    var address = "";
    address += e.addressComponent.province;
    address += e.addressComponent.city;
    address += e.addressComponent.district;
    address += e.addressComponent.street;
    address += e.addressComponent.streetNumber;
    alert("当前定位地址为：" + address);
  });
  locationControl.addEventListener("locationError", function (e) {
    alert(e.message);
  });

  //缩放和比例尺控件
  map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
  var scaleCtrl = new BMapGL.ScaleControl(); // 添加比例尺控件
  map.addControl(scaleCtrl);
  var zoomCtrl = new BMapGL.ZoomControl(); // 添加比例尺控件
  map.addControl(zoomCtrl);
});
