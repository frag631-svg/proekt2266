// Enhanced Checkout Manager for Compact Form
class CompactCheckoutManager {
    constructor() {
        this.currentStep = 1;
        this.formData = {};
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupValidation();
        this.updateOrderSummary();
        this.adjustModalHeight();
    }

    setupEventListeners() {
        // Delivery option selection
        document.querySelectorAll('.delivery-option').forEach(option => {
            option.addEventListener('click', (e) => {
                if (!e.target.matches('input')) {
                    const input = option.querySelector('input');
                    input.checked = true;
                    this.updateDeliveryOptions();
                }
            });
        });

        // Payment method change
        document.querySelectorAll('input[name="payment_method"]').forEach(radio => {
            radio.addEventListener('change', () => {
                this.toggleCardDetails();
            });
        });

        // Form input validation
        document.querySelectorAll('#checkoutForm input, #checkoutForm select, #checkoutForm textarea').forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });

            input.addEventListener('input', () => {
                this.clearFieldError(input);
                
                // Format inputs
                if (input.name === 'phone') {
                    this.formatPhone(input);
                } else if (input.name === 'card_number') {
                    this.formatCardNumber(input);
                } else if (input.name === 'card_expiry') {
                    this.formatCardExpiry(input);
                }
            });
        });

        // Auto-scroll to top when changing steps
        const form = document.querySelector('.checkout-form');
        form.addEventListener('scroll', this.throttle(this.saveScrollPosition.bind(this), 100));
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    saveScrollPosition() {
        this.scrollPosition = document.querySelector('.checkout-form').scrollTop;
    }

    adjustModalHeight() {
        const modal = document.querySelector('.checkout-modal .modal__content');
        if (modal) {
            modal.style.maxHeight = 'calc(90vh - 2rem)';
        }
    }

    goToStep(step) {
        // Validate current step before proceeding
        if (step > this.currentStep && !this.validateStep(this.currentStep)) {
            this.scrollToFirstError(this.currentStep);
            return;
        }

        // Update steps
        document.querySelectorAll('.checkout-step').forEach(stepEl => {
            stepEl.classList.remove('active');
        });
        document.querySelector(`.checkout-step[data-step="${step}"]`).classList.add('active');

        // Update progress
        document.querySelectorAll('.progress-step').forEach(progressStep => {
            const stepNumber = parseInt(progressStep.dataset.step);
            progressStep.classList.remove('active', 'completed');
            
            if (stepNumber === step) {
                progressStep.classList.add('active');
            } else if (stepNumber < step) {
                progressStep.classList.add('completed');
            }
        });

        this.currentStep = step;

        // Scroll to top of form
        this.scrollToTop();

        // Special handling for steps
        if (step === 4) {
            this.updateConfirmationSummary();
        }

        // Update order summary with delivery cost
        this.updateOrderSummary();
    }

    scrollToTop() {
        const form = document.querySelector('.checkout-form');
        if (form) {
            form.scrollTop = 0;
        }
    }

    scrollToFirstError(step) {
        const stepEl = document.querySelector(`.checkout-step[data-step="${step}"]`);
        const firstError = stepEl.querySelector('.error');
        if (firstError) {
            firstError.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }
    }

    validateStep(step) {
        let isValid = true;
        const stepEl = document.querySelector(`.checkout-step[data-step="${step}"]`);
        
        // Validate all required fields in current step
        const inputs = stepEl.querySelectorAll('input[required], select[required], textarea[required]');
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(input) {
        const value = input.value.trim();
        const validator = input.dataset.validate;
        let isValid = true;
        let errorMessage = '';

        // Clear previous state
        input.parentElement.classList.remove('error', 'success');
        const errorEl = input.parentElement.querySelector('.error-message');
        if (errorEl) errorEl.classList.add('hidden');

        // Required validation
        if (input.required && !value) {
            isValid = false;
            errorMessage = 'Обязательное поле';
        }

        // Specific validators
        if (isValid && value && validator) {
            switch (validator) {
                case 'email':
                    if (!this.isValidEmail(value)) {
                        isValid = false;
                        errorMessage = 'Неверный email';
                    }
                    break;
                case 'phone':
                    if (!this.isValidPhone(value)) {
                        isValid = false;
                        errorMessage = 'Неверный номер';
                    }
                    break;
                case 'name':
                    if (!this.isValidName(value)) {
                        isValid = false;
                        errorMessage = 'Только буквы и дефисы';
                    }
                    break;
                case 'card_number':
                    if (!this.isValidCardNumber(value)) {
                        isValid = false;
                        errorMessage = 'Неверный номер карты';
                    }
                    break;
                case 'card_expiry':
                    if (!this.isValidCardExpiry(value)) {
                        isValid = false;
                        errorMessage = 'Неверная дата';
                    }
                    break;
                case 'card_cvv':
                    if (!this.isValidCVV(value)) {
                        isValid = false;
                        errorMessage = 'Неверный CVV';
                    }
                    break;
            }
        }

        // Update UI
        if (!isValid && input.required) {
            input.parentElement.classList.add('error');
            if (errorEl) {
                errorEl.querySelector('span').textContent = errorMessage;
                errorEl.classList.remove('hidden');
            }
        } else if (value) {
            input.parentElement.classList.add('success');
        }

        return isValid;
    }

    clearFieldError(input) {
        input.parentElement.classList.remove('error');
        const errorEl = input.parentElement.querySelector('.error-message');
        if (errorEl) errorEl.classList.add('hidden');
    }

    // ... (остальные методы валидации остаются такими же) ...

    updateDeliveryOptions() {
        document.querySelectorAll('.delivery-option').forEach(option => {
            option.classList.remove('selected');
            if (option.querySelector('input').checked) {
                option.classList.add('selected');
            }
        });
        this.updateOrderSummary();
    }

    toggleCardDetails() {
        const cardDetails = document.getElementById('cardDetails');
        const isCardPayment = document.querySelector('input[name="payment_method"]:checked').value === 'card';
        cardDetails.style.display = isCardPayment ? 'block' : 'none';
        
        // Adjust scroll if needed
        if (isCardPayment) {
            setTimeout(() => this.scrollToTop(), 100);
        }
    }

    updateOrderSummary() {
        const itemsContainer = document.getElementById('orderSummaryItems');
        const totalContainer = document.getElementById('orderSummaryTotal');
        
        if (app.cart.length === 0) {
            itemsContainer.innerHTML = '<div class="summary-item"><div class="summary-item-name">Корзина пуста</div></div>';
            totalContainer.textContent = '0 ₽';
            return;
        }

        let itemsHTML = '';
        let total = 0;

        app.cart.forEach(item => {
            itemsHTML += `
                <div class="summary-item">
                    <div class="summary-item-name">${app.getProductTypeName(item.type)}</div>
                    <div class="summary-item-price">${item.price} ₽</div>
                </div>
            `;
            total += item.price;
        });

        // Add delivery cost
        const deliveryMethod = document.querySelector('input[name="delivery_method"]:checked');
        if (deliveryMethod) {
            const deliveryPrice = this.getDeliveryPrice(deliveryMethod.value);
            if (deliveryPrice > 0) {
                itemsHTML += `
                    <div class="summary-item">
                        <div class="summary-item-name">Доставка</div>
                        <div class="summary-item-price">${deliveryPrice} ₽</div>
                    </div>
                `;
                total += deliveryPrice;
            }
        }

        itemsContainer.innerHTML = itemsHTML;
        totalContainer.textContent = `${total} ₽`;
    }

    getDeliveryPrice(method) {
        const prices = {
            'courier': 300,
            'pickup': 0,
            'post': 200
        };
        return prices[method] || 0;
    }

    updateConfirmationSummary() {
        const container = document.getElementById('orderConfirmationDetails');
        
        // Collect form data
        const formData = new FormData(document.getElementById('checkoutForm'));
        const data = {
            personal: {
                name: `${formData.get('first_name')} ${formData.get('last_name')}`,
                email: formData.get('email'),
                phone: formData.get('phone')
            },
            delivery: {
                address: formData.get('address'),
                city: formData.get('city'),
                method: formData.get('delivery_method')
            },
            payment: {
                method: formData.get('payment_method')
            }
        };

        let html = `
            <div class="confirmation-section">
                <strong>Контактные данные:</strong><br>
                ${data.personal.name}<br>
                ${data.personal.email}<br>
                ${data.personal.phone}
            </div>
            <div class="confirmation-section">
                <strong>Доставка:</strong><br>
                ${this.getDeliveryMethodName(data.delivery.method)}<br>
                ${data.delivery.city}, ${data.delivery.address}
            </div>
            <div class="confirmation-section">
                <strong>Оплата:</strong><br>
                ${this.getPaymentMethodName(data.payment.method)}
            </div>
        `;

        container.innerHTML = html;
    }

    getDeliveryMethodName(method) {
        const names = {
            'courier': 'Курьерская доставка',
            'pickup': 'Самовывоз',
            'post': 'Почта России'
        };
        return names[method] || method;
    }

    getPaymentMethodName(method) {
        const names = {
            'card': 'Банковская карта',
            'cash': 'Наличные при получении',
            'online': 'Онлайн-кошелек'
        };
        return names[method] || method;
    }

    async submitOrder() {
        const submitBtn = document.getElementById('submitOrder');
        
        try {
            // Show loading state
            submitBtn.classList.add('btn--loading');
            submitBtn.disabled = true;

            // Validate all steps
            for (let step = 1; step <= 4; step++) {
                if (!this.validateStep(step)) {
                    this.goToStep(step);
                    throw new Error('Исправьте ошибки в форме');
                }
            }

            // Collect form data
            const formData = new FormData(document.getElementById('checkoutForm'));
            const orderData = {
                personal: {
                    firstName: formData.get('first_name'),
                    lastName: formData.get('last_name'),
                    email: formData.get('email'),
                    phone: formData.get('phone')
                },
                delivery: {
                    city: formData.get('city'),
                    address: formData.get('address'),
                    method: formData.get('delivery_method')
                },
                payment: {
                    method: formData.get('payment_method')
                },
                items: app.cart,
                total: this.calculateTotal()
            };

            // Simulate API call
            await this.processOrder(orderData);

            // Success
            closeModal('checkoutModal');
            document.getElementById('orderNumber').textContent = 'CW' + Date.now().toString().slice(-6);
            app.showModal('successModal');

            // Clear cart
            app.cart = [];
            app.saveCart();
            app.updateCartCount();

        } catch (error) {
            alert(error.message);
        } finally {
            submitBtn.classList.remove('btn--loading');
            submitBtn.disabled = false;
        }
    }

    calculateTotal() {
        let total = app.cart.reduce((sum, item) => sum + item.price, 0);
        const deliveryMethod = document.querySelector('input[name="delivery_method"]:checked');
        if (deliveryMethod) {
            total += this.getDeliveryPrice(deliveryMethod.value);
        }
        return total;
    }

    async processOrder(orderData) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (Math.random() < 0.1) {
                    reject(new Error('Ошибка оплаты. Попробуйте снова.'));
                } else {
                    resolve({ success: true, orderId: Date.now() });
                }
            }, 1500);
        });
    }
}

// Global functions
function goToStep(step) {
    if (window.checkoutManager) {
        window.checkoutManager.goToStep(step);
    }
}

function submitOrder() {
    if (window.checkoutManager) {
        window.checkoutManager.submitOrder();
    }
}

// Initialize compact checkout manager
document.addEventListener('DOMContentLoaded', () => {
    const checkoutModal = document.getElementById('checkoutModal');
    checkoutModal.addEventListener('click', function(e) {
        if (e.target === this) {
            setTimeout(() => {
                if (!window.checkoutManager) {
                    window.checkoutManager = new CompactCheckoutManager();
                } else {
                    window.checkoutManager.updateOrderSummary();
                }
            }, 300);
        }
    });
});

// Update form submission
document.getElementById('checkoutForm').addEventListener('submit', function(e) {
    e.preventDefault();
    submitOrder();
});