const express= require('express');
const router=express.Router();
const {getRooms,createRoom,getRoombyId,updateRoom}=require('../controllers/roomcontroller');
router.get('/',getRooms);
router.get('/:id',getRoombyId);
router.post('/', createRoom);
router.put('/:id',updateRoom);
module.exports=router;