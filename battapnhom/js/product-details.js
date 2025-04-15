const mainImage = document.querySelector('.main-image img');
const thumbnails = document.querySelectorAll('.thumbnail-gallery img');

thumbnails.forEach(thumbnail => {
    thumbnail.addEventListener('click', () => {
        mainImage.src = thumbnail.src;
        mainImage.alt = thumbnail.alt;
        
    
        thumbnails.forEach(t => t.classList.remove('active'));
        thumbnail.classList.add('active');
    });
});

const quantityInput = document.querySelector('.quantity-selector input');
const minusBtn = document.querySelector('.quantity-btn.minus');
const plusBtn = document.querySelector('.quantity-btn.plus');

minusBtn.addEventListener('click', () => {
    const currentValue = parseInt(quantityInput.value);
    if (currentValue > 1) {
        quantityInput.value = currentValue - 1;
    }
});

plusBtn.addEventListener('click', () => {
    const currentValue = parseInt(quantityInput.value);
    if (currentValue < 10) {
        quantityInput.value = currentValue + 1;
    }
});

const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        button.classList.add('active');
        const tabId = button.dataset.tab;
        document.getElementById(tabId).classList.add('active');
    });
});

const addToCartBtn = document.querySelector('.add-to-cart-large');

addToCartBtn.addEventListener('click', () => {
    const productName = document.querySelector('.product-name').textContent;
    const productPrice = parseFloat(document.querySelector('.product-price').textContent.replace(/[^0-9.]/g, ''));
    const productImage = document.querySelector('.main-image img').src;

    const product = {
        id: Date.now(),
        name: productName,
        price: productPrice,
        image: productImage
    };

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));

    addToCartBtn.classList.add('added');
    addToCartBtn.innerHTML = '<i class="fas fa-check"></i> Đã thêm';
    
    setTimeout(() => {
        addToCartBtn.classList.remove('added');
        addToCartBtn.innerHTML = '<i class="fas fa-shopping-cart"></i> Thêm vào giỏ';
    }, 2000);
});

const loadRelatedProducts = () => {
    const relatedProductsGrid = document.querySelector('.product-grid');
    const relatedProducts = [
        {
            name: 'NVIDIA GeForce RTX 4070',
            price: '$599.99',
            image: 'path/to/rtx4070.jpg'
        },
        {
            name: 'NVIDIA GeForce RTX 4090',
            price: '$1499.99',
            image: 'path/to/rtx4090.jpg'
        },
    ];
    
    relatedProductsGrid.innerHTML = relatedProducts
        .map(product => `
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-price">${product.price}</div>
                    <button class="add-to-cart"><i class="fas fa-shopping-cart"></i> Add to Cart</button>
                </div>
            </div>
        `)
        .join('');
};
window.addEventListener('load', loadRelatedProducts);