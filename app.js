const express = require('express');
const { Client } = require('pg');    //引入express和pg框架
const connectionString = 'postgres://postgres:Xxsht123@localhost:5858/shanhaizuopin'
const client = new Client({
    connectionString: connectionString
});

client.connect();

var app = express();

app.set('port', process.env.PORT || 5500);
const cors = require('cors');
const fs = require('fs');

let mySwitch = true; // 默认值为false

app.use(cors());


//查询语句  翻页查询
app.get('/search_mounts', function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin','*');
    var type=req.query.type;
    client.query('SELECT * FROM 全部山 where 所属山系  = $1;', [type], function (err, result) {      
        if (err) {
            console.log(err);
            return res.status(400).send(err);
        }
        // res.status(200).send(result.rows); 
        // 将查询结果存储在变量中
        const mountData = result.rows;
        //console.log("yes");
        // 以 JSON 格式返回数据给前端
        res.status(200).json(mountData);
    });
});

app.get('/search_mountinfo', function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin','*');
    var type=req.query.type;
    client.query('SELECT * FROM 全部山 where id  = $1;', [type], function (err, result) {      
        if (err) {
            console.log(err);
            return res.status(400).send(err);
        }
        // res.status(200).send(result.rows); 
        // 将查询结果存储在变量中
        const mountData = result.rows;
        console.log("yes");
        // 以 JSON 格式返回数据给前端
        res.status(200).json(mountData);
    });
});

app.get('/search_YS', function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin','*');
    var type=req.query.type;
    client.query('SELECT * FROM 全部兽 where mountid  = $1;', [type], function (err, result) {      
        if (err) {
            console.log(err);
            return res.status(400).send(err);
        }
        // res.status(200).send(result.rows); 
        // 将查询结果存储在变量中
        const mountData = result.rows;
        
        // 以 JSON 格式返回数据给前端
        res.status(200).json(mountData);
    });
});

app.get('/search_animal', function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin','*');
    var type=req.query.type;
    console.log(type);
    client.query('SELECT * FROM 全部兽 where id  = $1;', [type], function (err, result) {      
        if (err) {
            console.log(err);
            return res.status(400).send(err);
        }
        // res.status(200).send(result.rows); 
        // 将查询结果存储在变量中
        const mountData = result.rows;
        
        // 以 JSON 格式返回数据给前端
        res.status(200).json(mountData);
    });
});

//查询某个顺序的山
app.get('/search_mount', function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    var order = req.query.shunxu; 
    var mountainRange = req.query.shanxi; // 所属山系为东山一经
    client.query('SELECT * FROM "全部山" WHERE "顺序" = $1 AND "所属山系" = $2;', [order, mountainRange], function (err, result) {      
        if (err) {
            console.log(err);
            return res.status(400).send(err);
        }
        // 将查询结果存储在变量中
        const mountData = result.rows;
        console.log("yes");
        // 以 JSON 格式返回数据给前端
        res.status(200).json(mountData);
    });
});

app.get('/get_mountains', function (req, res,next) {
    res.setHeader('Access-Control-Allow-Origin','*');
    var name=req.query.name;
    console.log(name)

    client.query('SELECT * FROM 全部山 where 名字 = $1;', [name],function (err, result) {      
        if (err) {
            console.log(err);
            return res.status(400).send(err);
        }
        // res.status(200).send(result.rows); 
        // 将查询结果存储在变量中
        const item_Data = result.rows;
        // 以 JSON 格式返回数据给前端
        res.status(200).json(item_Data);
    });
});

//查询语句 单个商品信息查询
app.get('/search_id', function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin','*');
    var object_id=req.query.object_id;
    
    client.query('SELECT * FROM xiupin1 where objectid  = $1;', [object_id],function (err, result) {      
        if (err) {
            console.log(err);
            return res.status(400).send(err);
        }
        // res.status(200).send(result.rows); 
        // 将查询结果存储在变量中
        const item_Data = result.rows;
        console.log("yes1");
        // 以 JSON 格式返回数据给前端
        res.status(200).json(item_Data);
    });
});

//查询语句，查询任意3个同类商品
app.get('/find_the_same', function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin','*');
    var type=req.query.type;
    
    client.query('SELECT * FROM xiupin1 where 类别  = $1 ORDER BY RANDOM() LIMIT 3;', [type],function (err, result) {      
        if (err) {
            console.log(err);
            return res.status(400).send(err);
        }
        // res.status(200).send(result.rows); 
        // 将查询结果存储在变量中
        const item_Data = result.rows;
        // 以 JSON 格式返回数据给前端
        res.status(200).json(item_Data);
    });
});
//查询语句，查询8个课程
app.get('/classes', function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin','*');
    var start=req.query.start;
    var num=req.query.num;
    client.query('SELECT * FROM classes OFFSET $1 LIMIT $2;', [start,num],function (err, result) {      
        if (err) {
            console.log(err);
            return res.status(400).send(err);
        }
        // res.status(200).send(result.rows); 
        // 将查询结果存储在变量中
        const item_Data = result.rows;
        // 以 JSON 格式返回数据给前端
        res.status(200).json(item_Data);
        console.log("已请求");
        
    });
});


//查询语句，查询1个课程
app.get('/get_class', function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin','*');
    var class_id=req.query.class_id;
    
    client.query('SELECT * FROM classes where 课程id = $1;', [class_id],function (err, result) {      
        if (err) {
            console.log(err);
            return res.status(400).send(err);
        }
        // res.status(200).send(result.rows); 
        // 将查询结果存储在变量中
        const item_Data = result.rows;
        // 以 JSON 格式返回数据给前端
        res.status(200).json(item_Data);
    });
});

//查询语句，查询3个同类课程
app.get('/get_same_classes', function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin','*');
    
    
    client.query('SELECT * FROM classes ORDER BY RANDOM() LIMIT 3;', function (err, result) {      
        if (err) {
            console.log(err);
            return res.status(400).send(err);
        }
        // res.status(200).send(result.rows); 
        // 将查询结果存储在变量中
        const item_Data = result.rows;
        // 以 JSON 格式返回数据给前端
        res.status(200).json(item_Data);
    });
});





//增加语句
app.get('/list3', function(req, res) {
	const id3 = req.query.id3;
    const name3 = req.query.name3;
    const code3 = req.query.code3;
    const depart3 = req.query.depart3;
    const city3 = req.query.city3;
    const level3 = req.query.level3;
    const type3 = req.query.type3;
    const less3 = req.query.less3;
    const remark  = "111";
          const query = 'INSERT INTO edu_school_edu_school (id, school_name, school_code, admin_depart, localtion, school_level, edu_type, type, remark) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)';
          const values = [id3, name3, code3, depart3, city3, level3, type3, less3, remark];
      
          client.query(query, values, function(error, results)  {
      
            if (error) {
              return console.error('Error executing query', error.stack);
            }
      
            res.send(results.rows);
            // Your callback logic here
          });
});




// //删除语句

// app.delete('/', function (req, res, next) {
//     const schoolIdToDelete = 1; // 指定要删除的学校的ID

//     client.query('DELETE FROM edu_school_edu_school WHERE id = $1', [schoolIdToDelete], function (err, result) {      
//         if (err) {
//             console.log(err);
//             res.status(400).send(err);
//         }

//         // 检查是否成功删除了数据
//         if (result.rowCount > 0) {
//             // 成功删除
//             res.status(200).send('School with ID ' + schoolIdToDelete + ' deleted successfully.');
//         } else {
//             // 没有找到要删除的数据
//             res.status(404).send('School with ID ' + schoolIdToDelete + ' not found.');
//         }
//     });
// });


// app.get('/', function (req, res, next) {
//     const newSchool = {
//         id:2957,
//         school_name:"野鸡大学",  // 从请求体中获取学校名称
//         school_code: "13567",  // 从请求体中获取学校位置
//         admin_depart: "江湖市",
//         localtion: "江湖市",
//         school_level: "大专",
//         edu_type:"普通高等学校",
//         type:"综合",
//         remark:"不好"
//     };

//     client.query(
//         'INSERT INTO edu_school_edu_school (id, school_name,school_code,admin_depart,localtion,school_level,edu_type,type,remark) VALUES ($1, $2,$3,$4,$5,$6,$7,$8,$9) RETURNING *',
//         [newSchool.id, newSchool.school_name,newSchool.school_code,newSchool.admin_depart,newSchool.localtion,newSchool.school_level,newSchool.edu_type,newSchool.type,newSchool.remark],
//         function (err, result) {
//             if (err) {
//                 console.log(err);
//                 res.status(400).send(err);
//             }

//             // 检查是否成功插入了数据
//             if (result.rows.length > 0) {
//                 // 成功插入，返回新插入的学校数据
//                 res.status(200).send(result.rows[0]);
//             } else {
//                 // 插入失败
//                 res.status(500).send('Failed to insert school.');
//             }
//         }
//     );
// });



app.listen(5500, function () {
    console.log('Server is running.. on Port 5500');
});




			// //单击查询按钮后，根据用户在文本框中输入的姓名查询数据库中的特定记录								
            // $("#list").click(function(){
            //     var name1 = $("#name1").val();
            //     $.get(
            //     "http://127.0.0.1:8000/list",
            //     {
            //         name1:name1
            //     },
            //     function(data){
            //         for(var i=0;i<data.length;i++){
            //             console.log(data[i]);
            //             show(data[i]);
            //         }
            //     });
            // });	


// // 检查数据库和表是否存在的函数
// async function doesDatabaseAndTableExist() {
//     const checkClient = new Client({
      
//       connectionString: 'postgres://postgres:Xxsht123@localhost:5858/shanhaizuopin', 
//     });
  
//     try {
//         await checkClient.connect();
  
//         // 检查数据库是否存在
//         const databaseResult = await checkClient.query('SELECT 1 FROM pg_database WHERE datname = $1', ['shanhaizuopin']);
//         if (databaseResult.rows.length === 0) {
//             console.log('数据库 "shanhaizuopin" 不存在。跳过数据库连接。');
//             return false;
//         }
  
//         // 检查表是否存在
//         const tableResult = await checkClient.query('SELECT 1 FROM information_schema.tables WHERE table_name = $1', ['erchuangzuopin']);
//         if (tableResult.rows.length === 0) {
//             console.log('表 "erchuangzuopin" 不存在。跳过数据库连接。');
//             return false;
//         }
  
//         // 数据库和表都存在
//         return true;
//     } catch (error) {
//         console.error('连接数据库时出错:', error.message);
//         return false; // 返回 false 表示数据库或表不存在
//     } finally {
//         await checkClient.end();
//     }
//   }


// // 在检查数据库存在性后启动应用程序
// doesDatabaseAndTableExist().then((databaseExists) => {
//     if (databaseExists) {
//         mySwitch = true; // 设置 mySwitch 为 true
//         client = new Client({
//             connectionString: connectionString
//         });
//         client.connect();
//         console.log('已连接到数据库');
//     } else {
//         console.log('跳过数据库连接，数据直接加入到json文件中');
//     }

//     // 在这里定义你的路由和其他配置
//     // ...

//     // 启动 Express 服务器
//     app.listen(app.get('port'), () => {
//         console.log(`服务器正在运行在端口 ${app.get('port')}`);
//         console.log(`mySwitch 的值为: ${mySwitch}`);
//     });
// }).catch((error) => {
//     console.error('检查数据库存在性时出错:', error);
// });

// 在这里定义你的路由和其他配置
app.get('/checkConnection', (req, res) => {
    // 在这个示例中，将 mySwitch 的值作为 JSON 对象发送回前端
    res.json({ mySwitch: mySwitch });
  });

  //增加到数据库的路由
app.get('/addtodb', function(req, res) {
    res.setHeader('Access-Control-Allow-Origin','*');
    const id=req.query.id;
    const author = req.query.author;
    const name = req.query.name;
    const picture = req.query.picture;
    const topic = req.query.topic;
    const description = req.query.description;
    const meaning=req.query.meaning;
    const longtitude=req.query.longtitude;
    const latitude=req.query.latitude;
    const adcode=req.query.adcode;
    const ename=req.query.ename;
    const price=req.query.price;
    const ups=req.query.ups;
    const soldnum=req.query.soldnum;
    const query = `
    INSERT INTO erchuangzuopin (
        id,发布者id, 作品名称, 作品图片的存储路径, 主题, 作品简单描述,寓意,经度, 纬度,地理编码,地区,价格,点赞数,销量
    ) VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14 )RETURNING MAINID`;
     const values = [id,author, name, picture, topic,description,meaning,longtitude,latitude, adcode,ename,price,ups,soldnum];
          client.query(query, values, function(error, results)  {
      
            if (error) {
              return console.error('Error executing query', error.stack);
            }
      
            res.send(results.rows);
            // Your callback logic here
          });
});


const bodyParser = require('body-parser');

// 使用 body-parser 中间件来解析请求体数据
app.use(bodyParser.json());

// POST 请求实现写入json文件的路由
app.post('/saveData', (req, res) => {
    const newData = req.body;

    // 读取已有数据文件
    fs.readFile('D:\\大三下资料\\GIS\\shanhaijing\\Fantastic-Creatures-of-the-Mountains-and-Seas\\xsy\\erchuangzuopin.json', 'utf-8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).json({ success: false, message: 'Failed to read existing data' });
        }

        let dataArray = [];
        // 解析已有数据文件中的 JSON 数据
        try {
            dataArray = JSON.parse(data);
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            return res.status(500).json({ success: false, message: 'Failed to parse existing data' });
        }

        // 计算新数据的ID为已有数据中最大ID值加1
        const maxId = Math.max(...dataArray.map(item => item.idmain));
        const newId = maxId + 1;

        // 构造要写入 JSON 文件的数据对象
        const jsonData = {
            idmain: newId,
            id: newData.id,
            发布者ID: newData.author, // 请根据实际情况替换为真实的发布者ID
            作品名称: newData.name,
            作品图片的存储路径: newData.picture,
            主题: newData.category,
            作品简单描述: newData.description,
            寓意: newData.meaning,
            经度: newData.longtitude,
            纬度: newData.latitude,
            地理编码: newData.adcode,
            地区: newData.ename,
            价格: newData.price,
            点赞数: newData.ups,
            销量: newData.soldnum
        };

        // 将新数据追加到数组中
        dataArray.push(jsonData);

        // 将更新后的数据写回文件
        fs.writeFile('D:\\大三下资料\\GIS\\shanhaijing\\Fantastic-Creatures-of-the-Mountains-and-Seas\\xsy\\erchuangzuopin.json', JSON.stringify(dataArray, null, 2), 'utf-8', (writeErr) => {
            if (writeErr) {
                console.error('Error writing file:', writeErr);
                return res.status(500).json({ success: false, message: 'Failed to write updated data' });
            }
            
            // 如果一切顺利，返回成功响应
            res.json({ success: true, message: 'Data saved successfully' });
        });
    });
});


// POST 请求实现写入json文件的路由
app.post('/savetiezi', (req, res) => {
    const newData = req.body;

    // 读取已有数据文件
    fs.readFile('D:\\大三下资料\\GIS\\shanhaijing\\Fantastic-Creatures-of-the-Mountains-and-Seas\\xsy\\huati.json', 'utf-8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).json({ success: false, message: 'Failed to read existing data' });
        }

        let dataArray = [];
        // 解析已有数据文件中的 JSON 数据
        try {
            dataArray = JSON.parse(data);
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            return res.status(500).json({ success: false, message: 'Failed to parse existing data' });
        }

        // 计算新数据的ID为已有数据中最大ID值加1
        const maxId = Math.max(...dataArray.map(item => item.id));
        const newId = maxId + 1;

        // 构造要写入 JSON 文件的数据对象
        const jsonData = {
            id: newId,
            author: newData.author,
            image: newData.image, // 请根据实际情况替换为真实的发布者ID
            summary: newData.summary,
            topic_overview: newData.topic_overview,
            description: newData.description,
            likes: newData.likes,
            publish_time: newData.publish_time,
            answers: newData.answers,
            views: newData.views
        };

        // 将新数据追加到数组中
        dataArray.push(jsonData);

        // 将更新后的数据写回文件
        fs.writeFile('D:\\大三下资料\\GIS\\shanhaijing\\Fantastic-Creatures-of-the-Mountains-and-Seas\\xsy\\huati.json', JSON.stringify(dataArray, null, 2), 'utf-8', (writeErr) => {
            if (writeErr) {
                console.error('Error writing file:', writeErr);
                return res.status(500).json({ success: false, message: 'Failed to write updated data' });
            }
            
            // 如果一切顺利，返回成功响应
            res.json({ success: true, message: 'Data saved successfully' });
        });
    });
});
