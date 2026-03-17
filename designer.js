// Clothing designer
class Designer {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.currentDesign = {
            type: 'tshirt',
            color: '#ffffff',
            size: 'S',
            text: '',
            textColor: '#000000',
            textFont: 'Arial',
            image: null
        };
        this.basePrices = {
            tshirt: 990,
            hoodie: 1990,
            pants: 1490,
            underwear: 490
        };
        this.init();
    }

    init() {
        this.setupCanvas();
        this.setupEventListeners();
        this.updateDesign();
        this.updatePrice();
    }

    setupCanvas() {
        this.canvas = document.getElementById('designCanvas');
        this.ctx = this.canvas.getContext('2d');
    }

    setupEventListeners() {
        // Clothing type
        document.querySelectorAll('.clothing-type').forEach(type => {
            type.addEventListener('click', () => {
                document.querySelectorAll('.clothing-type').forEach(t => t.classList.remove('active'));
                type.classList.add('active');
                this.currentDesign.type = type.dataset.type;
                this.updateDesign();
                this.updatePrice();
            });
        });

        // Size selection
        document.querySelectorAll('input[name="size"]').forEach(radio => {
            radio.addEventListener('change', () => {
                this.currentDesign.size = radio.value;
            });
        });

        // Color selection
        document.querySelectorAll('.color-option').forEach(option => {
            option.addEventListener('click', () => {
                document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                this.currentDesign.color = option.dataset.color;
                document.getElementById('customColor').value = option.dataset.color;
                this.updateDesign();
            });
        });

        // Custom color
        document.getElementById('customColor').addEventListener('input', (e) => {
            this.currentDesign.color = e.target.value;
            this.updateDesign();
        });

        // Text
        document.getElementById('customText').addEventListener('input', (e) => {
            this.currentDesign.text = e.target.value;
            this.updateDesign();
            this.updatePrice();
        });

        // Text color
        document.getElementById('textColor').addEventListener('input', (e) => {
            this.currentDesign.textColor = e.target.value;
            this.updateDesign();
        });

        // Text font
        document.getElementById('textFont').addEventListener('change', (e) => {
            this.currentDesign.textFont = e.target.value;
            this.updateDesign();
        });

        // Image upload
        document.getElementById('uploadArea').addEventListener('click', () => {
            document.getElementById('imageUpload').click();
        });

        document.getElementById('imageUpload').addEventListener('change', (e) => {
            this.handleImageUpload(e.target.files[0]);
        });
    }

    handleImageUpload(file) {
        if (!file || !file.type.startsWith('image/')) {
            alert('Пожалуйста, выберите изображение');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                this.currentDesign.image = img;
                this.updateDesign();
                this.updatePrice();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    updateDesign() {
        if (!this.ctx) return;

        const width = this.canvas.width;
        const height = this.canvas.height;

        // Clear canvas
        this.ctx.clearRect(0, 0, width, height);

        // Draw clothing base
        this.drawClothingBase();

        // Draw custom image
        if (this.currentDesign.image) {
            this.drawImage();
        }

        // Draw text
        if (this.currentDesign.text) {
            this.drawText();
        }
    }

    drawClothingBase() {
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;

        ctx.fillStyle = this.currentDesign.color;

        switch (this.currentDesign.type) {
            case 'tshirt':
                this.drawTShirt(ctx, width, height);
                break;
            case 'hoodie':
                this.drawHoodie(ctx, width, height);
                break;
            case 'pants':
                this.drawPants(ctx, width, height);
                break;
            case 'underwear':
                this.drawUnderwear(ctx, width, height);
                break;
        }
    }

    drawTShirt(ctx, width, height) {
        const centerX = width / 2;
        const bodyWidth = width * 0.6;
        const bodyHeight = height * 0.5;

        // Body
        ctx.fillRect(centerX - bodyWidth/2, height * 0.2, bodyWidth, bodyHeight);

        // Sleeves
        const sleeveWidth = bodyWidth * 0.25;
        const sleeveHeight = bodyHeight * 0.4;
        ctx.fillRect(centerX - bodyWidth/2 - sleeveWidth, height * 0.2, sleeveWidth, sleeveHeight);
        ctx.fillRect(centerX + bodyWidth/2, height * 0.2, sleeveWidth, sleeveHeight);
    }

    drawHoodie(ctx, width, height) {
        const centerX = width / 2;
        const bodyWidth = width * 0.6;
        const bodyHeight = height * 0.5;

        // Body
        ctx.fillRect(centerX - bodyWidth/2, height * 0.25, bodyWidth, bodyHeight);

        // Sleeves
        const sleeveWidth = bodyWidth * 0.25;
        const sleeveHeight = bodyHeight * 0.4;
        ctx.fillRect(centerX - bodyWidth/2 - sleeveWidth, height * 0.25, sleeveWidth, sleeveHeight);
        ctx.fillRect(centerX + bodyWidth/2, height * 0.25, sleeveWidth, sleeveHeight);

        // Hood
        ctx.beginPath();
        ctx.moveTo(centerX - bodyWidth/2, height * 0.25);
        ctx.lineTo(centerX - bodyWidth/2 - sleeveWidth/2, height * 0.15);
        ctx.lineTo(centerX + bodyWidth/2 + sleeveWidth/2, height * 0.15);
        ctx.lineTo(centerX + bodyWidth/2, height * 0.25);
        ctx.fill();
    }

    drawPants(ctx, width, height) {
        const centerX = width / 2;
        const bodyWidth = width * 0.6;
        const bodyHeight = height * 0.4;

        // Body
        ctx.fillRect(centerX - bodyWidth/2, height * 0.2, bodyWidth, bodyHeight);

        // Legs
        const legWidth = bodyWidth * 0.3;
        const legHeight = height * 0.4;
        ctx.fillRect(centerX - bodyWidth/2, height * 0.2 + bodyHeight, legWidth, legHeight);
        ctx.fillRect(centerX + bodyWidth/2 - legWidth, height * 0.2 + bodyHeight, legWidth, legHeight);
    }

    drawUnderwear(ctx, width, height) {
        const centerX = width / 2;
        const bodyWidth = width * 0.4;
        const bodyHeight = height * 0.3;

        // Main part
        ctx.fillRect(centerX - bodyWidth/2, height * 0.3, bodyWidth, bodyHeight);

        // Sides
        const sideWidth = bodyWidth * 0.2;
        const sideHeight = bodyHeight * 0.8;
        ctx.fillRect(centerX - bodyWidth/2 - sideWidth, height * 0.3, sideWidth, sideHeight);
        ctx.fillRect(centerX + bodyWidth/2, height * 0.3, sideWidth, sideHeight);
    }

    drawImage() {
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;

        const imgWidth = width * 0.4;
        const imgHeight = imgWidth;
        const x = (width - imgWidth) / 2;
        const y = (height - imgHeight) / 2;

        ctx.drawImage(this.currentDesign.image, x, y, imgWidth, imgHeight);
    }

    drawText() {
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;

        ctx.fillStyle = this.currentDesign.textColor;
        ctx.font = `24px ${this.currentDesign.textFont}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const x = width / 2;
        const y = height / 2;

        ctx.fillText(this.currentDesign.text, x, y);
    }

    updatePrice() {
        const basePrice = this.basePrices[this.currentDesign.type] || 990;
        let customPrice = 0;

        // Add price for text
        if (this.currentDesign.text) {
            customPrice += 200;
        }

        // Add price for image
        if (this.currentDesign.image) {
            customPrice += 300;
        }

        const totalPrice = basePrice + customPrice;

        document.getElementById('basePrice').textContent = `${basePrice} ₽`;
        document.getElementById('customPrice').textContent = `${customPrice} ₽`;
        document.getElementById('totalPrice').textContent = `${totalPrice} ₽`;

        this.currentDesign.price = totalPrice;
    }

    addToCart() {
        if (!app.currentUser) {
            alert('Пожалуйста, войдите в систему чтобы добавить товар в корзину');
            app.showLoginModal();
            return;
        }

        const designData = {
            ...this.currentDesign,
            id: Date.now(),
            imageData: this.canvas.toDataURL()
        };

        app.addToCart(designData);
    }
}

// Initialize designer
document.addEventListener('DOMContentLoaded', () => {
    window.designer = new Designer();
});

// Global function for add to cart button
function addToCart() {
    if (window.designer) {
        window.designer.addToCart();
    }
}