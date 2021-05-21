/* 处理登录请求 */
const express = require('express');
const Token = require('./token');    //token方法
const expressJwt = require('express-jwt');  //解析token
const jwt = require('jsonwebtoken');   //生成token
const formidable = require('express-formidable');  //解析FormData
const mysql = require('mysql');  //数据库
//const cookieParser=require('cookie-parser');   //解析cookie

let router = express.Router();   //二级路由

//formdata解析挂载中间件
router.use(formidable());
//cookie-parser挂载
//router.use(cookieParser());

router.post('/', (req, res) => {
    console.log('尝试登录中...');
    console.log(req.fields); //接收的参数
    //console.log(req.files);  //上传的文件
    //转化对应参数
    let { SName, idCode, password, identiy } = req.fields;

    // 链接数据库
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'gcms-db'
    });
    connection.connect(function (err) {
        err ? console.log('数据库链接失败') : console.log('链接成功！')
    });

    //根据身份信息查找对应表
    console.log('查找' + identiy + '表中...');
    //根据选择的学校名查找是否存在该账号
    connection.query(`select count(*) from ${identiy}_account where school="${SName}" and idCode=${idCode}`, (err, row) => {
        if (err) {
            console.log('query error!');
            console.log(err);
        } else {
            console.log(row)
            //如果不存在学号
            if (row[0]['count(*)'] === 0) {
                console.log('学号/工号不存在，返回错误信息')
                res.send({ err: 'idCode', msg: '学号/工号不存在' })
            }
            //学号存在
            else {
                connection.query(`select * from ${identiy}_account where idCode=${idCode}`, function (err, row) {
                    console.log('学号/工号存在，正在校验信息');
                    if (err) {
                        console.log(err);
                    } else {
                        //学校名称和密码全部正确
                        if (password === row[0]['pwd'] && SName === row[0]['school']) {
                            //res.send('<script>location.href="localhost:8100/home.html"</script>')
                            //生成token
                            let curToken = Token.createToken({ login: true, address: SName, idCode: idCode, identiy: identiy })
                            //将token存入cookie，最大失效时间7天，httpOnly防御XSS攻击
                            res.cookie('curToken', curToken, { maxAge: 1000 * 60 * 60 * 24 * 7, path: '/', httpOnly: true })
                            //传回信息
                            res.send({ err: 0, msg: '登录成功', link: `./${identiy}.html` });
                            console.log(identiy + '用户' + idCode + '登录成功');
                        }
                        //密码有误
                        else if (password !== row[0]['pwd']) {
                            res.send({ err: 'pwd', msg: '密码错误' })
                        }
                    }
                    connection.end(); //关闭连接
                })
            }
        }
    })

})

module.exports = router;
