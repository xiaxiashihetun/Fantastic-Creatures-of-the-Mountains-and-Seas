const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const app = express();
const port = 3000;

// PostgreSQL 连接配置
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'Touristroutes',
    password: '20030509',
    port: 5432,
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

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});


