// Navbar Authentication Logic
class NavbarAuth {
    constructor() {
        this.init();
    }

    init() {
        this.updateNavbar();
        this.setupEventListeners();
    }

    // Check if user is authenticated
    isAuthenticated() {
        const token = localStorage.getItem('token');
        return token !== null;
    }

    // Get user data from localStorage
    getUserData() {
        const userData = localStorage.getItem('user');
        return userData ? JSON.parse(userData) : null;
    }

    // Update navbar based on authentication status
    updateNavbar() {
        const authButtons = document.getElementById('auth-buttons');
        const userMenu = document.getElementById('user-menu');
        const userName = document.getElementById('user-name');

        if (this.isAuthenticated()) {
            // User is logged in - show user menu
            if (authButtons) authButtons.style.display = 'none';
            if (userMenu) {
                userMenu.style.display = 'block';
                const user = this.getUserData();
                if (user && userName) {
                    userName.textContent = `${user.firstName} ${user.lastName}`;
                }
            }
        } else {
            // User is not logged in - show auth buttons
            if (authButtons) authButtons.style.display = 'block';
            if (userMenu) userMenu.style.display = 'none';
        }
    }

    // Setup event listeners
    setupEventListeners() {
        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }

        // Profile button
        const profileBtn = document.getElementById('profile-btn');
        if (profileBtn) {
            profileBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showProfile();
            });
        }

        // Dashboard button
        const dashboardBtn = document.getElementById('dashboard-btn');
        if (dashboardBtn) {
            dashboardBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = '/dashboard';
            });
        }
    }

    // Logout function
    async logout() {
        try {
            const token = localStorage.getItem('token');
            
            // Call logout API
            const response = await fetch('/api/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            // Clear localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // Redirect to home page
            window.location.href = '/';
            
        } catch (error) {
            console.error('Logout error:', error);
            // Clear localStorage anyway and redirect
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/';
        }
    }

    // Show profile (placeholder for future implementation)
    showProfile() {
        // For now, redirect to dashboard
        window.location.href = '/dashboard';
    }

    // Refresh navbar (called after login/signup)
    refresh() {
        this.updateNavbar();
    }
}

// Initialize navbar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.navbarAuth = new NavbarAuth();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NavbarAuth;
} 