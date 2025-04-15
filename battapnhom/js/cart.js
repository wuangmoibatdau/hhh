class ShoppingCart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.updateCartDisplay();
        this.setupEventListeners();
        this.setupCartIndicator();
    }

    setupCartIndicator() {
        const cartCount = document.createElement('span');
        cartCount.className = 'cart-count';
        const cartButton = document.querySelector('.dangnhap a[href="cart.html"] button');
        if (cartButton) {
            cartButton.appendChild(cartCount);
            this.updateCartCount();
        }
    }

    updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const totalItems = this.items.length;
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'block' : 'none';
        }
    }

    addItem(productElement) {
        const productData = productElement.querySelector('[data-product]');
        const product = {
            id: productData.dataset.id,
            name: productData.dataset.name,
            price: parseFloat(productData.dataset.price),
            image: productElement.querySelector('img').src,
            quantity: 1
        };

        const existingItem = this.items.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push(product);
        }

        this.saveCart();
        this.updateCartDisplay();
        this.showNotification(`${product.name} đã được thêm vào giỏ hàng`);
    }

    addBuild(buildConfig) {
        this.items.push(buildConfig);
        this.saveCart();
        this.updateCartDisplay();
        this.showNotification('Cấu hình PC đã được thêm vào giỏ hàng');
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartDisplay();
    }

    removeBuild(buildIndex) {
        this.items.splice(buildIndex, 1);
        this.saveCart();
        this.updateCartDisplay();
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(1, Math.min(10, quantity));
            this.saveCart();
            this.updateCartDisplay();
        }
    }

    calculateTotal() {
        return this.items.reduce((total, item) => {
            if (item.quantity) {
                // Regular product with quantity
                return total + (item.price * item.quantity);
            } else if (item.totalPrice) {
                // PC build with totalPrice
                return total + item.totalPrice;
            } else {
                return total;
            }
        }, 0);
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
        this.updateCartCount();
    }

    updateCartDisplay() {
        const cartContainer = document.querySelector('.cart-items');
        const cartCount = document.querySelector('.cart-count');
        const checkoutBtn = document.querySelector('.checkout-btn');

        if (!cartContainer) return;

        if (this.items.length === 0) {
            cartContainer.innerHTML = `
                <div class="cart-empty">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Giỏ hàng của bạn đang trống</p>
                    <a href="baitapnhom.html" class="continue-shopping">Tiếp tục mua sắm</a>
                </div>
            `;
            if (checkoutBtn) checkoutBtn.disabled = true;
            this.updateSummary(0);
            if (cartCount) cartCount.textContent = '0';
            return;
        }

        let cartHTML = '';
        
        this.items.forEach((item, index) => {
            if (item.quantity) {
                // Regular product
                cartHTML += `
                    <div class="cart-item" data-id="${item.id}">
                        <img src="${item.image}" alt="${item.name}" class="item-image">
                        <div class="item-details">
                            <h3>${item.name}</h3>
                            <p class="item-price">$${(item.price * item.quantity).toFixed(2)}</p>
                            <div class="item-quantity">
                                <button class="quantity-btn minus">-</button>
                                <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="10">
                                <button class="quantity-btn plus">+</button>
                            </div>
                        </div>
                        <button class="remove-item"><i class="fas fa-trash"></i></button>
                    </div>
                `;
            } else if (item.components) {
                // PC build
                let componentsList = '';
                let totalPrice = 0;
                
                Object.entries(item.components).forEach(([component, details]) => {
                    if (details) {
                        componentsList += `
                            <div class="component-detail">
                                <span class="component-name">${component.toUpperCase()}:</span>
                                <span class="component-value">${details.name}</span>
                                <span class="component-price">$${details.price.toFixed(2)}</span>
                            </div>
                        `;
                        totalPrice += details.price;
                    }
                });

                cartHTML += `
                    <div class="build-item" data-index="${index}">
                        <div class="build-header">
                            <h3>Cấu hình PC #${index + 1}</h3>
                            <div class="build-total">Tổng: $${totalPrice.toFixed(2)}</div>
                        </div>
                        <div class="build-components">
                            ${componentsList}
                        </div>
                        <div class="build-actions">
                            <button class="remove-build" data-index="${index}">Xóa</button>
                            <button class="checkout-build" data-index="${index}">Thanh Toán</button>
                        </div>
                    </div>
                `;
            }
        });

        cartContainer.innerHTML = cartHTML;

        if (checkoutBtn) checkoutBtn.disabled = false;
        const subtotal = this.calculateTotal();
        this.updateSummary(subtotal);

        if (cartCount) {
            cartCount.textContent = this.items.length.toString();
        }
    }

    updateSummary(subtotal) {
        const subtotalElement = document.querySelector('.summary-item:first-child span:last-child');
        const taxElement = document.querySelector('.summary-item:nth-child(3) span:last-child');
        const totalElement = document.querySelector('.total span:last-child');

        const tax = subtotal * 0.10;
        const total = subtotal + tax;

        if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        if (taxElement) taxElement.textContent = `$${tax.toFixed(2)}`;
        if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            const addToCartBtn = e.target.closest('[data-add-to-cart]');
            if (addToCartBtn) {
                const productElement = addToCartBtn.closest('[data-product]');
                if (productElement) {
                    this.addItem(productElement);
                }
            }
        });

        const cartContainer = document.querySelector('.cart-items');
        if (cartContainer) {
            cartContainer.addEventListener('click', (e) => {
                const cartItem = e.target.closest('.cart-item');
                if (cartItem) {
                    const productId = cartItem.dataset.id;
                    const quantityInput = cartItem.querySelector('input');

                    if (e.target.classList.contains('minus')) {
                        this.updateQuantity(productId, parseInt(quantityInput.value) - 1);
                    } else if (e.target.classList.contains('plus')) {
                        this.updateQuantity(productId, parseInt(quantityInput.value) + 1);
                    } else if (e.target.closest('.remove-item')) {
                        this.removeItem(productId);
                    }
                }

                const removeBuildBtn = e.target.closest('.remove-build');
                if (removeBuildBtn) {
                    const buildIndex = parseInt(removeBuildBtn.dataset.index);
                    this.removeBuild(buildIndex);
                }

                const checkoutBuildBtn = e.target.closest('.checkout-build');
                if (checkoutBuildBtn) {
                    const buildIndex = parseInt(checkoutBuildBtn.dataset.index);
                    const selectedBuild = this.items[buildIndex];
                    localStorage.setItem('currentCheckout', JSON.stringify(selectedBuild));
                    window.location.href = 'checkout.html';
                }
            });

            cartContainer.addEventListener('change', (e) => {
                if (e.target.type === 'number') {
                    const cartItem = e.target.closest('.cart-item');
                    if (cartItem) {
                        const productId = cartItem.dataset.id;
                        this.updateQuantity(productId, parseInt(e.target.value));
                    }
                }
            });
        }
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => notification.remove(), 3000);
    }

    static init() {
        window.cart = new ShoppingCart();
    }
}

document.addEventListener('DOMContentLoaded', ShoppingCart.init);