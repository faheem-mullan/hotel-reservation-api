const express = require('express');
const pool= require('./src/configs/db');
require('dotenv').config();
const  roomroutes = require('./src/routes/roomroutes');

const app= express();

app.use(express.json());

app.use((req,res,next)=>{
    console.log(`${req.method} ${req.url}`);
      next()
})
app.use('/api/rooms',roomroutes);

app.get('/health', async (req,res,next)=>{
    try{
        const result = await pool.query('select now()')
        res.json({ db_time: result.rows[0].now})
    }catch(err){
        console.error('DB Error:',err.message);
        res.status(500).json({error:'Database connection failed '});
    }

});


const PORT= process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});
