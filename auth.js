// Authentication system
class AuthManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupAuthForms();
    }

    setupAuthForms() {
        // Login form
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Register form
        document.getElementById('registerForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister();
        });

        // Checkout form
        document.getElementById('checkoutForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleCheckout();
        });
    }

    async handleLogin() {
        const formData = new FormData(document.getElementById('loginForm'));
        const data = {
            email: formData.get('email'),
            password: formData.get('password')
        };

        try {
            // For demo, accept any credentials
            const user = {
                id: 1,
                name: data.email.split('@')[0],
                email: data.email,
                phone: '+7 (999) 999-99-99',
                verified: true
            };

            this.loginUser(user);
            closeModal('loginModal');
            alert('Вход выполнен успешно!');

        } catch (error) {
            alert('Ошибка входа. Проверьте данные.');
        }
    }

    async handleRegister() {
        const formData = new FormData(document.getElementById('registerForm'));
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            password: formData.get('password')
        };

        try {
            const user = {
                id: Date.now(),
                name: data.name,
                email: data.email,
                phone: data.phone,
                verified: false
            };

            // Show verification modal
            closeModal('registerModal');
            app.showModal('verificationModal');

            // Store user data temporarily
            sessionStorage.setItem('pending_user', JSON.stringify(user));

        } catch (error) {
            alert('Ошибка регистрации.');
        }
    }

    async handleCheckout() {
        const formData = new FormData(document.getElementById('checkoutForm'));
        const orderData = {
            first_name: formData.get('first_name'),
            last_name: formData.get('last_name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            address: formData.get('address'),
            payment_method: formData.get('payment_method'),
            items: app.cart,
            total: app.cart.reduce((sum, item) => sum + item.price, 0)
        };

        try {
            // Generate order number
            const orderNumber = 'CW' + Date.now().toString().slice(-6);
            
            // Clear cart
            app.cart = [];
            app.saveCart();
            app.updateCartCount();
            
            closeModal('checkoutModal');
            
            // Show success modal
            document.getElementById('orderNumber').textContent = orderNumber;
            app.showModal('successModal');

        } catch (error) {
            alert('Ошибка оформления заказа.');
        }
    }

    loginUser(user) {
        app.currentUser = user;
        localStorage.setItem('customwear_user', JSON.stringify(user));
        app.showUserMenu();
    }

    logout() {
        app.currentUser = null;
        localStorage.removeItem('customwear_user');
        location.reload();
    }
}

// Initialize auth manager
document.addEventListener('DOMContentLoaded', () => {
    new AuthManager();
});

// Add to existing AuthManager class
class AuthManager {
    // ... existing code ...

    setupCheckoutForm() {
        const checkoutForm = document.getElementById('checkoutForm');
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleCheckout();
            });

            // Initialize checkout manager
            window.checkoutManager = new CheckoutManager();
        }
    }

    async handleCheckout() {
        // Use the new checkout manager
        if (window.checkoutManager) {
            await window.checkoutManager.submitOrder();
        }
    }
}

// Update initialization
document.addEventListener('DOMContentLoaded', () => {
    const authManager = new AuthManager();
    authManager.setupCheckoutForm(); // Add this line
});