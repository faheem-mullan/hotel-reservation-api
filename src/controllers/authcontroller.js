const pool = require('../configs/db');

const bcrypt = require('bcrypt');

const register = async(req,res) => {
    const {first_name,last_name,email,password,role}=req.body;
    if(!first_name || !last_name || !email || !password){
        return res.status(400).json({error:'Missing required fields'});
    }
    try{
        const saltRounds=10;
        const hashedpassword=await bcrypt.hash(password,saltRounds);
        const query='insert into users (first_name,last_name,email,password_hash,role) values ($1,$2,$3,$4,$5) returning user_id,first_name,last_name,email,role,created_at;';
        const values=[first_name,last_name,email,hashedpassword,role||"guest"];
        const result=await pool.query(query,values);
        res.status(201).json(result.rows[0]);
    }catch(error){
       if(error.code==='23505'){
        return res.status(409).json({error:'Email already exists'});
         }
         console.error('Error registering user:',error);
         res.status(500).json({error:'Internal Server Error'});
    }   
};



module.exports={
    register,
};