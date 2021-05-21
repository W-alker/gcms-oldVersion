//处理高校名称表格
const fs=require('fs');
const xlsx=require('node-xlsx');

//获取到表格数据，是一个数组
let list = xlsx.parse("./" + 'UNameList.xlsx');


//转成json写入新文件
let list_json=JSON.stringify(list);
fs.writeFile('./universitiesNameList.json',list_json,(err,doc)=>{
    if(err)
    console.log(err);
    else
    console.log('write finshed');
})