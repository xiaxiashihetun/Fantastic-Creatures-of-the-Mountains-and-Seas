const express = require('express');
const { Client } = require('pg');    //引入express和pg框架
const connectionString = 'postgres://postgres:123456@172.20.10.2:5432/ShanHaiJing';
const path = require('path');
const client = new Client({
    connectionString: connectionString
});

client.on('error', (err) => {
    console.error('Database connection error:', err.stack);
});

client.connect((err) => {
    if (err) {
        console.error('Failed to connect to database:', err.stack);
        return;
    }
    console.log('Connected to database');
});

var app = express();
const port =9936;
app.set('port', process.env.PORT || port);



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
        console.log("search_mountinfo");
        // 以 JSON 格式返回数据给前端
        res.status(200).json(mountData);
    });
});

app.get('/search_countryinfo', function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin','*');
    var type=req.query.type;
    client.query('SELECT * FROM 全部国 where id  = $1;', [type], function (err, result) {      
        if (err) {
            console.log(err);
            return res.status(400).send(err);
        }
        // res.status(200).send(result.rows); 
        // 将查询结果存储在变量中
        const mountData = result.rows;
        console.log("search_countryinfo");
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
        console.log("search_mount");
        // 以 JSON 格式返回数据给前端
        res.status(200).json(mountData);
    });
});

app.get('/get_mountains', function (req, res,next) {
    res.setHeader('Access-Control-Allow-Origin','*');
    var name = req.query.name || '%'; // 如果没有提供 name，则默认为 % 以匹配所有  
    name = '%' + name + '%'; // 简单转义 % 和 _  
  
    client.query('SELECT * FROM 全部山 WHERE 名字 LIKE $1;', [name], function (err, result) {  
        if (err) {  
            log(err);
            return res.status(400).send(err);
        }
        const item_Data = result.rows;
        
        res.status(200).json(item_Data);
    });
});


app.get('/load_country', function (req, res,next) {
    res.setHeader('Access-Control-Allow-Origin','*');
    var type=req.query.type;
    client.query('SELECT * FROM 全部国 where 顺序 = $1;', [type],function (err, result) {      
        if (err) {
            console.log(err);
            return res.status(400).send(err);
        }
        
        const item_Data = result.rows;
        console.log("load_country");
        res.status(200).json(item_Data);
    });
});


app.use(express.static(path.join(__dirname, 'public')));
app.use('../img', express.static(path.join(__dirname, 'img')));

// 路由，处理前端请求
// app.get('/get_routes', async (req, res) => {
//     const city = req.query.city;
//     try {
//         const result = await pool.query('SELECT * FROM 旅游路线 WHERE 所属地级市 = $1 ORDER BY 路线序号, 顺序', [city]);
//         res.json(result.rows);
//         console.log("旅游");
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Database query failed' });
//     }
// });

app.get('/get_routes', function (req, res,next) {
    res.setHeader('Access-Control-Allow-Origin','*');
    var type=req.query.city;
    client.query('SELECT * FROM 旅游路线 where 所属地级市 = $1;', [type],function (err, result) {      
        if (err) {
            console.log(err);
            return res.status(400).send(err);
        }
        const item_Data = result.rows;
        console.log("旅游");
        res.status(200).json(item_Data);
    });
});

// //查询语句 单个商品信息查询
// app.get('/search_id', function (req, res, next) {
//     res.setHeader('Access-Control-Allow-Origin','*');
//     var object_id=req.query.object_id;
    
//     client.query('SELECT * FROM xiupin1 where objectid  = $1;', [object_id],function (err, result) {      
//         if (err) {
//             console.log(err);
//             return res.status(400).send(err);
//         }
//         // res.status(200).send(result.rows); 
//         // 将查询结果存储在变量中
//         const item_Data = result.rows;
//         console.log("yes1");
//         // 以 JSON 格式返回数据给前端
//         res.status(200).json(item_Data);
//     });
// });

// //查询语句，查询任意3个同类商品
// app.get('/find_the_same', function (req, res, next) {
//     res.setHeader('Access-Control-Allow-Origin','*');
//     var type=req.query.type;
    
//     client.query('SELECT * FROM xiupin1 where 类别  = $1 ORDER BY RANDOM() LIMIT 3;', [type],function (err, result) {      
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
// //查询语句，查询8个课程
// app.get('/classes', function (req, res, next) {
//     res.setHeader('Access-Control-Allow-Origin','*');
//     var start=req.query.start;
//     var num=req.query.num;
//     client.query('SELECT * FROM classes OFFSET $1 LIMIT $2;', [start,num],function (err, result) {      
//         if (err) {
//             console.log(err);
//             return res.status(400).send(err);
//         }
//         // res.status(200).send(result.rows); 
//         // 将查询结果存储在变量中
//         const item_Data = result.rows;
//         // 以 JSON 格式返回数据给前端
//         res.status(200).json(item_Data);
//         console.log("已请求");
        
//     });
// });


// //查询语句，查询1个课程
// app.get('/get_class', function (req, res, next) {
//     res.setHeader('Access-Control-Allow-Origin','*');
//     var class_id=req.query.class_id;
    
//     client.query('SELECT * FROM classes where 课程id = $1;', [class_id],function (err, result) {      
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

// //查询语句，查询3个同类课程
// app.get('/get_same_classes', function (req, res, next) {
//     res.setHeader('Access-Control-Allow-Origin','*');
    
    
//     client.query('SELECT * FROM classes ORDER BY RANDOM() LIMIT 3;', function (err, result) {      
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





// //增加语句
// app.get('/list3', function(req, res) {
// 	const id3 = req.query.id3;
//     const name3 = req.query.name3;
//     const code3 = req.query.code3;
//     const depart3 = req.query.depart3;
//     const city3 = req.query.city3;
//     const level3 = req.query.level3;
//     const type3 = req.query.type3;
//     const less3 = req.query.less3;
//     const remark  = "111";
//           const query = 'INSERT INTO edu_school_edu_school (id, school_name, school_code, admin_depart, localtion, school_level, edu_type, type, remark) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)';
//           const values = [id3, name3, code3, depart3, city3, level3, type3, less3, remark];
      
//           client.query(query, values, function(error, results)  {
      
//             if (error) {
//               return console.error('Error executing query', error.stack);
//             }
      
//             res.send(results.rows);
//             // Your callback logic here
//           });
// });




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



app.listen(port,'0.0.0.0',function () {
    console.log('Server is running.. on Port 9936');
});

