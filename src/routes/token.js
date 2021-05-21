const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');
const express = require('express');
const app = express();

//私钥
const scrict = 'cw923hr998chwh22sdfbhj';

//cookie签名

//express-jwt挂载
/* app.use(expressJwt({
    secret: scrict,
    algorithms: ['HS256']
}).unless({
    path: ['/login']  //白名单，不作解析
})); */

let token={};
token.scrict=scrict;
//生成token
token.createToken = palyload => {
    //生成token，以Bearer开头
    //给palyload添加一个时间戳参数
    palyload.curtime = Date.now();
    const token = 'Bearer ' +　jwt.sign(
        palyload,
        scrict, { 
            expiresIn: 3600 * 24 * 3   //过期时间
        })
    return token;
};
//检验是否为token
/* token.verifyToken = token => {
    return new Promise((resovle,reject)=>{
        jwt.verify(token,scrict,(err,data)=>{
            if(err){ reject('token验证失败') }
            resovle(data);
        })
    })
} */
module.exports = token;