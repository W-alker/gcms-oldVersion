//发送邮件模块
const nodemailer = require("nodemailer"); //发送邮件

let transporter = nodemailer.createTransport({
  host: "smtp.qq.com",
  secureConnection: true, // use SSL
  port: 465,
  secure: true, // secure:true for port 465, secure:false for port 587
  auth: {
    user: "2578451916@qq.com",
    pass: "cnygqsvjtsbjechf", // QQ邮箱需要使用授权码
  },
});

function sendMail(mail, code) {
  // 设置邮件内容（谁发送什么给谁）
  let mailOptions = {
    from: '" 路修远 " <Lu_xiuyuan@qq.com>', // 发件人
    to: mail, // 收件人
    subject: "邮箱验证", // 主题
    text: `您正在尝试修改密码,您的验证码是 ${code},有效期5分钟。`, // plain text body
    //html: "<b></b>", // html body
    // 下面是发送附件，不需要就注释掉
    /*     attachments: [
      {
        filename: "test.md",
        path: "./test.md",
      },
      {
        filename: "content",
        content: "发送内容",
      },
    ], */
  };
  return new Promise((resolve, reject) => {
    // 使用先前创建的传输器的 sendMail 方法传递消息对象
    transporter.sendMail(mailOptions, (error, info) => {
      if(error) reject();
      else {
        console.log(`Message: ${info.messageId}`);
        console.log(`sent: ${info.response}`);
        resolve();
      }
    });
  });
}
module.exports = { sendMail };
