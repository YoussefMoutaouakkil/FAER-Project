const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const bodyParser = require('body-parser');
require('dotenv').config();

// Import database and services
const { testConnection, initDatabase } = require('./config/database');
const userService = require('./services/userService');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'faer-secret-key-2024';

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET || 'faer-session-secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Serve static files from views/assets
app.use('/assets', express.static(path.join(__dirname, 'views/assets')));
app.use('/logoFaer.png', express.static(path.join(__dirname, 'logoFaer.png')));

// Middleware to check if user is authenticated
const requireAuth = async (req, res, next) => {
    const token = req.session.token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.redirect('/login');
    }
    
    try {
        // Verify JWT token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Validate session in database
        const sessionData = await userService.validateSession(token);
        if (!sessionData) {
            req.session.destroy();
            return res.redirect('/login');
        }
        
        req.user = decoded;
        next();
    } catch (error) {
        req.session.destroy();
        return res.redirect('/login');
    }
};

// Initialize database on startup
async function initializeApp() {
    try {
        // Test database connection
        const isConnected = await testConnection();
        if (!isConnected) {
            console.error('❌ Failed to connect to database. Please check your configuration.');
            process.exit(1);
        }
        
        // Initialize database tables
        await initDatabase();
        
        // Start server
        app.listen(PORT, () => {
            console.log(`🚀 FAER Project server running on http://localhost:${PORT}`);
            console.log(`📁 Serving pages from: ${path.join(__dirname, 'views')}`);
            console.log(`🎨 Static assets from: ${path.join(__dirname, 'views/assets')}`);
            console.log(`🔐 Authentication enabled with JWT and MySQL database`);
            console.log(`📊 Dashboard available at /dashboard`);
            console.log(`🗄️  Database: MySQL connected successfully`);
        });
        
        // Clean expired sessions every hour
        setInterval(async () => {
            try {
                await userService.cleanExpiredSessions();
            } catch (error) {
                console.error('Error cleaning expired sessions:', error);
            }
        }, 60 * 60 * 1000);
        
    } catch (error) {
        console.error('❌ Application initialization failed:', error);
        process.exit(1);
    }
}

// Serve HTML pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/about.html'));
});

app.get('/course', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/course.html'));
});

app.get('/detail', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/detail.html'));
});

app.get('/feature', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/feature.html'));
});

app.get('/team', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/team.html'));
});

app.get('/testimonial', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/testimonial.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/contact.html'));
});

app.get('/login', (req, res) => {
    if (req.session.token) {
        return res.redirect('/dashboard');
    }
    res.sendFile(path.join(__dirname, 'views/login.html'));
});

app.get('/signup', (req, res) => {
    if (req.session.token) {
        return res.redirect('/dashboard');
    }
    res.sendFile(path.join(__dirname, 'views/signup.html'));
});

app.get('/dashboard', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'views/dashboard.html'));
});

// API Routes
app.post('/api/signup', async (req, res) => {
    try {
        const { firstName, lastName, email, phone, password } = req.body;
        
        // Validate required fields
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ error: 'All required fields must be provided' });
        }
        
        // Create user in database
        const user = await userService.createUser({
            firstName,
            lastName,
            email,
            phone,
            password
        });
        
        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        // Store session in database
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        await userService.storeSession(user.id, token, expiresAt);
        
        // Set session
        req.session.token = token;
        
        res.json({ 
            success: true, 
            message: 'User created successfully',
            token,
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }
        });
        
    } catch (error) {
        console.error('Signup error:', error);
        if (error.message === 'User with this email already exists') {
            return res.status(400).json({ error: 'User with this email already exists' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        
        // Find user in database
        const user = await userService.findByEmail(email);
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        
        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        
        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        // Store session in database
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        await userService.storeSession(user.id, token, expiresAt);
        
        // Set session
        req.session.token = token;
        
        res.json({ 
            success: true, 
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/logout', async (req, res) => {
    try {
        const token = req.session.token || req.headers.authorization?.split(' ')[1];
        
        if (token) {
            // Remove session from database
            await userService.removeSession(token);
        }
        
        // Destroy session
        req.session.destroy();
        
        res.json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        req.session.destroy();
        res.json({ success: true, message: 'Logged out successfully' });
    }
});

app.get('/api/user', requireAuth, async (req, res) => {
    try {
        const user = await userService.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json(user);
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update user profile
app.put('/api/user/profile', requireAuth, async (req, res) => {
    try {
        const { firstName, lastName, phone } = req.body;
        
        // Validate required fields
        if (!firstName || !lastName) {
            return res.status(400).json({ error: 'First name and last name are required' });
        }
        
        const updatedUser = await userService.updateUser(req.user.userId, {
            firstName,
            lastName,
            phone
        });
        
        res.json({ success: true, user: updatedUser });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Handle direct HTML file requests
app.get('/:page.html', (req, res) => {
    const page = req.params.page;
    res.sendFile(path.join(__dirname, `views/${page}.html`));
});

// Initialize the application
initializeApp();
