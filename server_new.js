const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = 5500;
app.use(cors());
let mySwitch = true; // 默认值为false

// PostgreSQL 连接配置
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'shanhaizuopin',
    password: 'Xxsht123',
    port: 5858,
});

// 静态文件服务
app.use(express.static(path.join(__dirname, 'public')));
app.use('/img', express.static(path.join(__dirname, 'img')));

// 路由，处理前端请求
app.get('/get_routes', async (req, res) => {
    const city = req.query.city;
    try {
        const result = await pool.query('SELECT * FROM touristroutes WHERE 所属地级市 = $1 ORDER BY 路线序号, 顺序', [city]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database query failed' });
    }
});

// // 将第二个应用程序中的路由和数据库连接代码迁移过来
// const connectionString = 'postgres://postgres:Xxsht123@localhost:5858/shanhaizuopin'
// const client = new Client({
//     connectionString: connectionString
// });

// client.connect();

// // 查询语句
// app.get('/search_mounts', function (req, res, next) {
//     res.setHeader('Access-Control-Allow-Origin','*');
//     var type=req.query.type;
//     client.query('SELECT * FROM 全部山 where 所属山系  = $1;', [type], function (err, result) {      
//         if (err) {
//             console.log(err);
//             return res.status(400).send(err);
//         }
//         const mountData = result.rows;
//         res.status(200).json(mountData);
//     });
// });

//查询语句  翻页查询
app.get('/search_mounts', function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin','*');
    var type=req.query.type;
    pool.query('SELECT * FROM 东山一经 where 所属山系  = $1;', [type], function (err, result) {      
        if (err) {
            console.log(err);
            return res.status(400).send(err);
        }
        // res.status(200).send(result.rows); 
        // 将查询结果存储在变量中
        const xiupinData = result.rows;
        console.log("yes");
        // 以 JSON 格式返回数据给前端
        res.status(200).json(xiupinData);
    });
});



app.get('/search_mountinfo', function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin','*');
    var type=req.query.type;
    pool.query('SELECT * FROM 全部山 where id  = $1;', [type], function (err, result) {      
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

app.get('/search_animal', function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin','*');
    var type=req.query.type;
    console.log(type);
    pool.query('SELECT * FROM 全部兽 where id  = $1;', [type], function (err, result) {      
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
    pool.query('SELECT * FROM "全部山" WHERE "顺序" = $1 AND "所属山系" = $2;', [order, mountainRange], function (err, result) {      
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


// app.get('/get_mountains', function (req, res,next) {
//     res.setHeader('Access-Control-Allow-Origin','*');
//     var name=req.query.name;
//     console.log(name)

//     pool.query('SELECT * FROM 全部山 where 名字 = $1;', [name],function (err, result) {      
//         if (err) {
//             console.log(err);
//             return res.status(400).send(err);
//         }
//         // res.status(200).send(result.rows); 
//         // 将查询结果存储在变量中
//         const item_Data = result.rows;
//         // 以 JSON 格式返回数据给前端
//         res.status(200).json(item_Data);
//     });
// });


app.get('/get_mountains', function (req, res,next) {
    res.setHeader('Access-Control-Allow-Origin','*');
    var name=req.query.name;
    console.log(name)
    const namem = '%${name}%'
    client.query('SELECT * FROM 东山一经 where 名字 LIKE $1;', [namem],function (err, result) {      
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
    
    pool.query('SELECT * FROM xiupin1 where objectid  = $1;', [object_id],function (err, result) {      
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

// app.listen(5500, function () {
//     console.log('Server is running.. on Port 5500');
// });


app.get('/checkConnection', (req, res) => {
    // 在这个示例中，将 mySwitch 的值作为 JSON 对象发送回前端
    mySwitch=true;
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
          pool.query(query, values, function(error, results)  {
      
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


// 写入JSON文件的路由
app.post('/saveData', (req, res) => {
    const newData = req.body;

    fs.readFile('D:\\大三下资料\\GIS\\shanhaijing\\Fantastic-Creatures-of-the-Mountains-and-Seas\\xsy\\erchuangzuopin.json', 'utf-8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).json({ success: false, message: 'Failed to read existing data' });
        }

        let dataArray = [];
        try {
            dataArray = JSON.parse(data);
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            return res.status(500).json({ success: false, message: 'Failed to parse existing data' });
        }

        const maxId = Math.max(...dataArray.map(item => item.idmain));
        const newId = maxId + 1;

        const jsonData = {
            idmain: newId,
            id: newData.id,
            发布者ID: newData.author,
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

        dataArray.push(jsonData);

        fs.writeFile('D:\\大三下资料\\GIS\\shanhaijing\\Fantastic-Creatures-of-the-Mountains-and-Seas\\xsy\\erchuangzuopin.json', JSON.stringify(dataArray, null, 2), 'utf-8', (writeErr) => {
            if (writeErr) {
                console.error('Error writing file:', writeErr);
                return res.status(500).json({ success: false, message: 'Failed to write updated data' });
            }
            
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


// 监听端口
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
