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

module.exports = {
    getRooms,
};