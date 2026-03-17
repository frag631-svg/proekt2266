// Products management
class ProductsManager {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.currentFilter = 'all';
        this.init();
    }

    async init() {
        await this.loadProducts();
        this.renderProducts();
        this.setupFiltering();
    }

    async loadProducts() {
        // Sample products data
        this.products = [
            {
                id: 1,
                name: "Базовая футболка",
                category: "tshirt",
                price: 990,
                image: "whiteshirt.jpg",
                colors: ["#ffffff", "#000000", "#2F4F4F"]
            },
            {
                id: 2,
                name: "Классическое худи",
                category: "hoodie",
                price: 1990,
                image: "Худи с капюшоном.jpg",
                colors: ["#000000", "#2F4F4F", "#8B4513"]
            },
            {
                id: 3,
                name: "Спортивные штаны",
                category: "pants",
                price: 1490,
                image: "Спортивные штаны.jpg",
                colors: ["#000000", "#2F4F4F", "#1E3A8A"]
            },
            {
                id: 4,
                name: "Хлопковые трусы",
                category: "underwear",
                price: 490,
                image: "Хлопковые трусы.jpg",
                colors: ["#ffffff", "#000000"]
            }
        ];
        this.filteredProducts = [...this.products];
    }

    setupFiltering() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Filter products
                this.currentFilter = button.dataset.filter;
                this.filterProducts();
                this.renderProducts();
            });
        });
    }

    filterProducts() {
        if (this.currentFilter === 'all') {
            this.filteredProducts = [...this.products];
        } else {
            this.filteredProducts = this.products.filter(
                product => product.category === this.currentFilter
            );
        }
    }

    renderProducts() {
        const grid = document.getElementById('productsGrid');
        
        if (this.filteredProducts.length === 0) {
            grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--gray);">Товары не найдены</p>';
            return;
        }

        grid.innerHTML = this.filteredProducts.map(product => `
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-content">
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-price">${product.price} ₽</div>
                    <div class="product-actions">
                        <button class="btn btn--primary btn--full" onclick="productsManager.addToCart(${product.id})">
                            <i class="fas fa-shopping-cart"></i>
                            Добавить в корзину
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (product) {
            const cartItem = {
                id: product.id,
                type: product.category,
                name: product.name,
                price: product.price,
                size: 'M',
                color: product.colors[0]
            };
            
            app.addToCart(cartItem);
        }
    }
}

// Initialize products manager
document.addEventListener('DOMContentLoaded', () => {
    window.productsManager = new ProductsManager();
});