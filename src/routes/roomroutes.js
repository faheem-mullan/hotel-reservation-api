const express=require('express');
const router=express.Router();

router.get('/',(req,res)=>{
    res.json({message:'Room routes are working'});
});

module.exports=router;