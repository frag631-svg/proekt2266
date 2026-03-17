// Main application
class CustomWearApp {
    constructor() {
        this.currentUser = null;
        this.cart = [];
        this.init();
    }

    init() {
        this.loadUser();
        this.loadCart();
        this.setupEventListeners();
        this.setupNavigation();
    }

    loadUser() {
        const userData = localStorage.getItem('customwear_user');
        if (userData) {
            this.currentUser = JSON.parse(userData);
            this.showUserMenu();
        }
    }

    loadCart() {
        const cartData = localStorage.getItem('customwear_cart');
        if (cartData) {
            this.cart = JSON.parse(cartData);
            this.updateCartCount();
        }
    }

    setupEventListeners() {
        // Auth buttons
        document.getElementById('login-btn').addEventListener('click', () => this.showLoginModal());
        document.getElementById('register-btn').addEventListener('click', () => this.showRegisterModal());

        // Cart button
        document.getElementById('cart-btn').addEventListener('click', () => this.showCart());
    }

    setupNavigation() {
        // Smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    showUserMenu() {
        const userSection = document.querySelector('.user-section');
        const authButtons = userSection.querySelector('.btn--outline, .btn--primary');
        
        authButtons.style.display = 'none';
        
        const userMenu = userSection.querySelector('.user-menu');
        userMenu.classList.remove('hidden');
        userMenu.querySelector('.user-name').textContent = this.currentUser.name;
    }

    updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            cartCount.textContent = this.cart.length;
        }
    }

    showLoginModal() {
        this.showModal('loginModal');
    }

    showRegisterModal() {
        this.showModal('registerModal');
    }

    showModal(modalId) {
        document.getElementById(modalId).classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = '';
    }

    showCart() {
        document.getElementById('cartSidebar').classList.add('active');
        this.renderCart();
    }

    closeCart() {
        document.getElementById('cartSidebar').classList.remove('active');
    }

    renderCart() {
        const cartContent = document.getElementById('cartContent');
        
        if (this.cart.length === 0) {
            cartContent.innerHTML = `
                <div style="padding: 2rem; text-align: center; color: var(--gray);">
                    <i class="fas fa-shopping-bag" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                    <p>Ваша корзина пуста</p>
                </div>
            `;
            return;
        }

        cartContent.innerHTML = this.cart.map((item, index) => `
            <div class="cart-item">
                <div class="cart-item-image">
                    ${item.imageData ? `<img src="${item.imageData}" alt="${item.type}" style="width: 100%; height: 100%; object-fit: cover; border-radius: var(--radius);">` : ''}
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-title">${this.getProductTypeName(item.type)}</div>
                    <div class="cart-item-meta">Размер: ${item.size} | Цвет: <div style="width: 15px; height: 15px; background: ${item.color}; border-radius: 50%; display: inline-block; vertical-align: middle; margin-left: 0.25rem;"></div></div>
                    <div class="cart-item-price">${item.price} ₽</div>
                </div>
                <button class="cart-item-remove" onclick="app.removeFromCart(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');

        this.updateCartTotal();
    }

    updateCartTotal() {
        const total = this.cart.reduce((sum, item) => sum + item.price, 0);
        document.querySelector('.total-price').textContent = `${total} ₽`;
    }

    addToCart(item) {
        this.cart.push(item);
        this.saveCart();
        this.updateCartCount();
        this.showNotification('Товар добавлен в корзину!', 'success');
    }

    removeFromCart(index) {
        this.cart.splice(index, 1);
        this.saveCart();
        this.updateCartCount();
        this.renderCart();
        this.showNotification('Товар удален из корзины', 'info');
    }

    saveCart() {
        localStorage.setItem('customwear_cart', JSON.stringify(this.cart));
    }

    getProductTypeName(type) {
        const names = {
            'tshirt': 'Футболка',
            'hoodie': 'Худи',
            'pants': 'Штаны',
            'underwear': 'Трусы'
        };
        return names[type] || 'Товар';
    }

    showNotification(message, type = 'info') {
        // Simple notification implementation
        console.log(`${type}: ${message}`);
    }
}

// Global functions
function startDesigning() {
    document.getElementById('designer').scrollIntoView({ behavior: 'smooth' });
}

function scrollToSection(sectionId) {
    const element = document.querySelector(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    document.body.style.overflow = '';
}

function showLoginModal() {
    app.showLoginModal();
}

function showRegisterModal() {
    app.showRegisterModal();
}

function closeCart() {
    app.closeCart();
}

function checkout() {
    if (app.cart.length === 0) {
        alert('Корзина пуста!');
        return;
    }

    if (!app.currentUser) {
        app.showLoginModal();
        return;
    }

    app.closeCart();
    app.showModal('checkoutModal');
}

function verifyEmail() {
    // Simulate email verification
    const codeInputs = document.querySelectorAll('.code-input');
    let code = '';
    codeInputs.forEach(input => code += input.value);
    
    if (code === '123456') { // Demo code
        closeModal('verificationModal');
        app.showNotification('Email успешно подтвержден!', 'success');
    } else {
        alert('Неверный код подтверждения');
    }
}

function resendCode() {
    alert('Новый код отправлен на ваш email');
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    window.app = new CustomWearApp();
});