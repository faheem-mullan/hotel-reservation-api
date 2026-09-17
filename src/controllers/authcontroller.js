const pool = require('../configs/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const register = async (req, res) => {
    const { first_name, last_name, email, password } = req.body;
    
    if (!first_name || !last_name || !email || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    
    try {
        const sanitizedEmail = email.trim().toLowerCase();
        const assignedRole = "guest";
        const saltRounds = 10;
        const hashedpassword = await bcrypt.hash(password, saltRounds);
        
        const query = 'INSERT INTO users (first_name, last_name, email, password_hash, role) VALUES ($1, $2, $3, $4, $5) RETURNING user_id, first_name, last_name, email, role, created_at;';
        const values = [first_name, last_name, sanitizedEmail, hashedpassword, assignedRole];
        
        const result = await pool.query(query, values);
        return res.status(201).json(result.rows[0]);
    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({ error: 'Email already exists' });
        }
        console.error('Error registering user:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }   
};

const login = async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    
    try {
        const sanitizedEmail = email.trim().toLowerCase();
        const query = 'SELECT * FROM users WHERE email = $1;';
        const result = await pool.query(query, [sanitizedEmail]);
        
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        
        const user = result.rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password_hash);
        
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        
        const payload = {
            user_id: user.user_id,
            email: user.email,
            role: user.role
        };

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        return res.status(200).json({
            message: 'Login successful',
            token: token,
            user: {
                user_id: user.user_id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Error logging in user:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    register,
    login,
};