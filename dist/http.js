"use strict";var express=require("express"),resetPwd=require("./routes/resetPwd"),admin=require("./routes/admin"),home=require("./routes/home"),login=require("./routes/login"),app=express();app.listen(8100),app.use("/",express.static(__dirname)),app.use("/resetPwd",resetPwd),app.use("/user.html",home),app.use("/admin.html",admin),app.use("/login",login),app.use("/logout",function(e,r){r.clearCookie("curToken").send({err:0,msg:"退出登录"})});