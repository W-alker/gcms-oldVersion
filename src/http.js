//总逻辑调用
const express = require('express');
const resetPwd = require('./routes/resetPwd');
const admin = require('./routes/admin');
const home = require('./routes/home');
const login =require('./routes/login');

//开启服务器
const app = express();
app.listen(8100);
//express托管访问静态资源
app.use('/',express.static(__dirname));

//引入路由
app.use('/resetPwd',resetPwd)
app.use('/user.html', home);
app.use('/admin.html', admin);
app.use('/login', login);
app.use("/logout",(req,res)=>{
    res.clearCookie('curToken').send({err:0,msg:'退出登录'})
})




