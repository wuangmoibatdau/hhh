document.addEventListener('DOMContentLoaded', function() {
    let cartItems = [];
    try {
        const storedItems = localStorage.getItem('cartItems');
        if (storedItems) {
            cartItems = JSON.parse(storedItems);
            if (!Array.isArray(cartItems)) {
                cartItems = [];
                console.error('Invalid cart data format');
            }
        }
    } catch (error) {
        console.error('Error loading cart data:', error);
    }
    const shippingFee = 30000;

    function updateOrderSummary() {
        const orderItemsContainer = document.querySelector('.order-items');
        const subtotalElement = document.querySelector('.subtotal span:last-child');
        const shippingElement = document.querySelector('.shipping span:last-child');
        const taxElement = document.querySelector('.tax span:last-child');
        const totalElement = document.querySelector('.total span:last-child');
        const discountElement = document.querySelector('.discount span:last-child');
        const couponInput = document.getElementById('coupon-code');
        const applyCouponBtn = document.getElementById('apply-coupon');

        orderItemsContainer.innerHTML = cartItems.map(item => {
            const name = item.name || item.productName || 'PC Build Configuration';
            const quantity = parseInt(item.quantity) || 1;
            const price = parseFloat(item.price) || parseFloat(item.totalPrice) || 0;
            
            return `
                <div class="order-item">
                    <div class="item-info">
                        <h4>${name}</h4>
                        <p>Số lượng: ${quantity}</p>
                    </div>
                    <div class="item-price">$${price.toFixed(2)}</div>
                </div>
            `;
        }).join('');

        const subtotal = cartItems.reduce((total, item) => {
            const itemPrice = parseFloat(item.price) || parseFloat(item.totalPrice) || 0;
            const quantity = parseInt(item.quantity) || 1;
            return total + (itemPrice * quantity);
        }, 0);

        const tax = subtotal * 0.08;
        const total = subtotal + tax + shippingFee;
        discountElement.textContent = `$${0.00.toFixed(2)}`;

        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        shippingElement.textContent = `$${shippingFee.toFixed(2)}`;
        taxElement.textContent = `$${tax.toFixed(2)}`;
        totalElement.textContent = `$${total.toFixed(2)}`;
    }

    const paymentOptions = document.querySelectorAll('input[name="payment"]');
    const creditCardDetails = document.getElementById('credit-card-details');

    paymentOptions.forEach(option => {
        option.addEventListener('change', function() {
            if (this.value === 'credit-card') {
                creditCardDetails.style.display = 'block';
                document.getElementById('place-order').disabled = true;
            } else {
                creditCardDetails.style.display = 'none';
                document.getElementById('place-order').disabled = false;
            }
        });
    });

    billingForm.addEventListener('input', function() {
        const formElements = billingForm.elements;
        let isValid = true;

        for (let element of formElements) {
            if (element.hasAttribute('required') && !element.value) {
                isValid = false;
                break;
            }
        }
        document.getElementById('place-order').disabled = !isValid;
    });

    const billingForm = document.getElementById('billing-form');
    const placeOrderBtn = document.getElementById('place-order');

    placeOrderBtn.addEventListener('click', function(e) {
        e.preventDefault();

        const formElements = billingForm.elements;
        let isValid = true;

        for (let element of formElements) {
            if (element.hasAttribute('required') && !element.value) {
                isValid = false;
                element.classList.add('error');
            } else {
                element.classList.remove('error');
            }
        }

        if (isValid) {
            const orderData = {
                customerInfo: {
                    fullname: document.getElementById('fullname').value,
                    email: document.getElementById('email').value,
                    phone: document.getElementById('phone').value,
                    address: document.getElementById('address').value,
                    note: document.getElementById('note').value
                },
                paymentMethod: document.querySelector('input[name="payment"]:checked').value,
                items: cartItems,
                couponCode: document.getElementById('coupon-code').value,
                discount: parseFloat(document.querySelector('.discount span:last-child').textContent.replace('$', '')),
                total: parseFloat(document.querySelector('.total span:last-child').textContent.replace('$', ''))
            };
            console.log('Order placed:', orderData);
        }
    });

    const cardNumberInput = document.getElementById('card-number');
    const expiryInput = document.getElementById('expiry');
    const cvvInput = document.getElementById('cvv');

    cardNumberInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/(.{4})/g, '$1 ').trim();
        e.target.value = value.substring(0, 19);
    });

    expiryInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2);
        }
        e.target.value = value.substring(0, 5);
    });

    cvvInput.addEventListener('input', function(e) {
        e.target.value = e.target.value.replace(/\D/g, '').substring(0, 3);
    });

    updateOrderSummary();
}));