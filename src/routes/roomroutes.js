const express= require('express');
const router=express.Router();
const {getRooms,createRoom,getRoombyId}=require('../controllers/roomcontroller');
router.get('/',getRooms);
router.get('/:id',getRoombyId);
router.post('/', createRoom);
module.exports=router;