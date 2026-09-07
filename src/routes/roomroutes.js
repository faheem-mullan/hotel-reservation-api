const express=require('express');
const router=express.Router();
const {getRooms}=require('../controllers/roomcontroller');
router.get('/',getRooms);
module.exports=router;