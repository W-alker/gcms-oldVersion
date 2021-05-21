//展示页面逻辑模块
/* const url=require('url');
const path = require('path'); */
const express = require("express");
const fs = require("fs");
const expressJwt = require("express-jwt"); //解析token
const jwt = require("jsonwebtoken"); //生成token
const cookieParser = require("cookie-parser"); //解析cookie
const bodyParser = require("body-parser"); //解析post请求
const Token = require("./token"); //token方法
const mysql = require("mysql"); //mysql
const formidable = require("express-formidable"); //解析FormData
const multiparty = require("multiparty"); //处理文件模块


let home = express.Router();

//body-parser挂载
home.use(bodyParser.urlencoded({ extended: false }));
//cookie-parser挂载
home.use(cookieParser());
//formdata解析挂载中间件
home.use(formidable());

//express-jwt挂载，验证token
home.use(
  expressJwt({
    secret: Token.scrict,
    algorithms: ["HS256"],
    getToken: function fromCookie(req) {
      //更改默认尝试从cookie读取token进行验证
      if (req.cookies.curToken) return req.cookies.curToken.split(" ")[1];
      return null;
    },
  }).unless({
    path: ["/login"], //白名单，不作解析
  })
);
home.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(401).send({ msg: "invalid token..." });
    console.log("token校验失败");
  }
});

//进入页面
home.use("/home", (req, res) => {
  console.log("用户进入user界面");
  //身份验证登录
  res.send({ err: 0, msg: "登录成功，欢迎使用垃圾分类管理系统！" });
});
//处理自动登录
home.use("/autoLogin",(req,res)=>{
  console.log("用户正在尝试自动登录");
  res.send({err:0 , msg:"登录成功！"});
})

//加载个人信息
home.use("/upload_info", (req, res) => {
  //console.log(req.user)
  const idCode = req.user.idCode;
  let connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "gcms-db",
  });
  connection.connect(function (err) {
    err ? console.log("数据库链接失败") : console.log("链接成功！");
  });
  connection.query(
    `select name,profile,email,phone from user_info where idCode=${idCode}`,
    (err, row) => {
      if (err) console.log(err);
      else {
        res.send({
          name: row[0]["name"],
          profile: row[0]["profile"],
          email: row[0]["email"],
          phone: row[0]["phone"],
        });
      }
    }
  );
});
//更改个人信息
home.use("/update_info", (req, res) => {
  const { email, tel, profile_base64URL, idCode } = req.fields;
  console.log("用户" + idCode + "尝试修改信息中");

  // 链接数据库
  let connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "gcms-db",
  });
  connection.connect(function (err) {
    err ? console.log("数据库链接失败") : console.log("链接成功！");
  });
  //如果更新了头像链接则修改
  if (profile_base64URL !== "undefined") {
    connection.query(
      `update user_info set profile="${profile_base64URL}" where idCode=${idCode}`,
      (err, row) => {
        if (err) console.log(err);
        else {
          console.log("头像修改成功");
        }
      }
    );
  }
  //修改昵称和手机号
  connection.query(
    `update user_info set phone="${tel}",email="${email}" where idCode=${idCode}`,
    (err, row) => {
      if (err) console.log(err);
      else {
        console.log("信息修改成功");
        res.send({ err: 0, msg: "信息修改成功" });
      }
    }
  );
});

/* 修改密码验证 */
//用户提交修改密码需求
home.post("/update_pwd", (req, res) => {
  console.log(req.fields);
  const { oldPwd, newPwd, confirmPwd,idCode } = req.fields;
  console.log("用户" + idCode + "正在尝试修改密码");
  let connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "gcms-db",
  });
  connection.connect(function (err) {
    err ? console.log("数据库链接失败") : console.log("链接成功！");
  });
  connection.query(
    `select pwd from user_account where idCode=${idCode}`,
    (err, row) => {
      if (err) console.log(err);
      else {
        if (oldPwd !== row[0]["pwd"])
          return res.send({ err: "oldPwd", msg: "旧密码验证错误" });
        else {
          connection.query(
            `update user_account set pwd='${newPwd}' where idCode=${idCode} and school="${SName}"`
          );
          res.clearCookie("curToken").send({ err: 0, msg: "修改成功" });
        }
      }
    }
  );
});

module.exports = home;
