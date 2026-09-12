const pool = require('../configs/db');

const getRooms = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM rooms');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching rooms:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const createRoom = async (req, res) => {
    const{room_number, room_type, price_per_night} = req.body;

    if (!room_number || !room_type || !price_per_night) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    try {
        const query='INSERT INTO rooms (room_number, room_type, price_per_night) VALUES ($1, $2, $3) RETURNING *;';

        const values=[room_number, room_type, price_per_night];
        const result= await pool.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating room:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }   
};
const getRoombyId = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM rooms WHERE room_id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Room not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching room by ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


module.exports = {
    getRooms,
    createRoom,
    getRoombyId,
};