const searchInput = document.getElementById('thanhtimkiem');
const searchResults = document.createElement('div');
searchResults.className = 'search-results';
searchInput.parentNode.appendChild(searchResults);

const style = document.createElement('style');
style.textContent = `
    .search-results {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        margin-top: 4px;
        max-height: 300px;
        overflow-y: auto;
        display: none;
        z-index: 1000;
    }

    .search-result-item {
        padding: 12px;
        border-bottom: 1px solid #eee;
        cursor: pointer;
        transition: background-color 0.2s;
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .search-result-item:last-child {
        border-bottom: none;
    }

    .search-result-item:hover {
        background-color: #f5f5f5;
    }

    .search-result-image {
        width: 40px;
        height: 40px;
        object-fit: cover;
        border-radius: 4px;
    }

    .search-result-info {
        flex: 1;
    }

    .search-result-name {
        font-weight: 500;
        color: #333;
        margin-bottom: 4px;
    }

    .search-result-category {
        font-size: 0.8rem;
        color: #666;
    }

    .search-result-price {
        font-weight: 600;
        color: #0066cc;
    }
`;
document.head.appendChild(style);

const sampleProducts = [
    {
        name: 'Intel Core i9-13900K',
        category: 'Bộ Vi Xử Lý',
        price: '$599.99',
        image: 'images/cpu1.jpg',
        url: 'processors.html'
    },
    {
        name: 'AMD Ryzen 9 7950X',
        category: 'Bộ Vi Xử Lý',
        price: '$699.99',
        image: 'cpu2.jpg',
        url: 'products/ryzen9-7950x.html'
    },
    {
        name: 'Intel Core i7-13700K',
        category: 'Bộ Vi Xử Lý',
        price: '$419.99',
        image: 'cpu3.jpg',
        url: 'processors.html'
    },
    {
        name: 'Intel Core i5-13600K',
        category: 'Bộ Vi Xử Lý',
        price: '$319.99',
        image: 'cpu4.jpg',
        url: 'processors.html'
    },
    {
        name: 'AMD Ryzen 7 7800X3D',
        category: 'Bộ Vi Xử Lý',
        price: '$449.99',
        image: 'cpu5.jpg',
        url: 'processors.html'
    },
    {
        name: 'NVIDIA GeForce RTX 4090',
        category: 'Card Đồ Họa',
        price: '$1599.99',
        image: 'gpu1.jpg',
        url: 'products/rtx4090.html'
    },
    {
        name: 'NVIDIA GeForce RTX 4080',
        category: 'Card Đồ Họa',
        price: '$1199.99',
        image: 'gpu2.jpg',
        url: 'products/rtx4080.html'
    },
    {
        name: 'NVIDIA GeForce RTX 4070',
        category: 'Card Đồ Họa',
        price: '$599.99',
        image: 'gpu3.jpg',
        url: 'graphics.html'
    },
    {
        name: 'AMD RX 7900 XTX',
        category: 'Card Đồ Họa',
        price: '$999.99',
        image: 'gpu4.jpg',
        url: 'graphics.html'
    },
    {
        name: 'AMD RX 7800 XT',
        category: 'Card Đồ Họa',
        price: '$499.99',
        image: 'gpu5.jpg',
        url: 'graphics.html'
    },
    {
        name: 'Corsair Vengeance LPX 32GB',
        category: 'Bộ Nhớ RAM',
        price: '$129.99',
        image: 'ram1.jpg',
        url: 'memory.html'
    },
    {
        name: 'G.Skill Trident Z5 RGB 32GB',
        category: 'Bộ Nhớ RAM',
        price: '$199.99',
        image: 'ram2.jpg',
        url: 'products/gskill-tridentz5-rgb.html'
    },
    {
        name: 'Corsair Dominator 64GB',
        category: 'Bộ Nhớ RAM',
        price: '$299.99',
        image: 'ram3.jpg',
        url: 'memory.html'
    },
    {
        name: 'Crucial Ballistix 32GB',
        category: 'Bộ Nhớ RAM',
        price: '$149.99',
        image: 'ram4.jpg',
        url: 'memory.html'
    },
    {
        name: 'TeamGroup T-Force 32GB',
        category: 'Bộ Nhớ RAM',
        price: '$159.99',
        image: 'ram5.jpg',
        url: 'memory.html'
    },
    {
        name: 'Samsung 980 Pro 1TB',
        category: 'Ổ Cứng',
        price: '$129.99',
        image: 'ssd1.jpg',
        url: 'storage.html'
    },
    {
        name: 'WD Black SN850 2TB',
        category: 'Ổ Cứng',
        price: '$229.99',
        image: 'ssd2.jpg',
        url: 'storage.html'
    },
    {
        name: 'Crucial P5 Plus 1TB',
        category: 'Ổ Cứng',
        price: '$109.99',
        image: 'ssd3.jpg',
        url: 'storage.html'
    },
    {
        name: 'Seagate FireCuda 530 2TB',
        category: 'Ổ Cứng',
        price: '$259.99',
        image: 'ssd4.jpg',
        url: 'storage.html'
    },
    {
        name: 'Corsair Force MP600 1TB',
        category: 'Ổ Cứng',
        price: '$139.99',
        image: 'ssd5.jpg',
        url: 'storage.html'
    }
];

const categoryFilter = document.getElementById('category-filter');
const priceFilter = document.getElementById('price-filter');
const sortBy = document.getElementById('sort-by');

function filterProducts(products, query, category, priceRange) {
    if (!query && !category && !priceRange) return [];
    
    return products.filter(product => {
        const normalizedQuery = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const normalizedName = product.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const normalizedCategory = product.category.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        
        const matchesQuery = !query || 
            normalizedName.includes(normalizedQuery) ||
            normalizedCategory.includes(normalizedQuery);
            
        const matchesCategory = !category || product.category === category;
        
        const price = parseFloat(product.price.replace('$', ''));
        let matchesPrice = true;
        if (priceRange) {
            const [minStr, maxStr] = priceRange.split('-');
            const min = maxStr === '+' ? Number(minStr) : Number(minStr);
            const max = maxStr === '+' ? Infinity : Number(maxStr);
            matchesPrice = price >= min && price <= max;
        }
        
        return matchesQuery && matchesCategory && matchesPrice;
    });
}

function sortProducts(products, sortCriteria) {
    const sortedProducts = [...products];
    switch (sortCriteria) {
        case 'price-low':
            sortedProducts.sort((a, b) => 
                parseFloat(a.price.replace('$', '')) - parseFloat(b.price.replace('$', '')));
            break;
        case 'price-high':
            sortedProducts.sort((a, b) => 
                parseFloat(b.price.replace('$', '')) - parseFloat(a.price.replace('$', '')));
            break;
        case 'newest':
            break;
    }
    return sortedProducts;
}

searchInput.addEventListener('input', (e) => {
    const query = e.target.value;
    const category = categoryFilter?.value;
    const priceRange = priceFilter?.value;
    const sortCriteria = sortBy?.value;
    
    if (!query.trim()) {
        searchResults.style.display = 'none';
        return;
    }

    let filteredProducts = filterProducts(sampleProducts, query, category, priceRange);
    filteredProducts = sortProducts(filteredProducts, sortCriteria);

    if (filteredProducts.length > 0) {
        searchResults.style.display = 'block';
        searchResults.innerHTML = filteredProducts
            .map(product => `
                <div class="search-result-item" onclick="window.location.href='${product.url}'">
                    <img class="search-result-image" src="${product.image}" alt="${product.name}">
                    <div class="search-result-info">
                        <div class="search-result-name">${product.name}</div>
                        <div class="search-result-category">${product.category}</div>
                    </div>
                    <div class="search-result-price">${product.price}</div>
                </div>
            `)
            .join('');
    } else {
        searchResults.style.display = 'block';
        searchResults.innerHTML = '<div class="search-result-item">No results found</div>';
    }
});
document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
        searchResults.style.display = 'none';
    }
});

window.addEventListener('beforeunload', () => {
    searchInput.value = '';
    searchResults.style.display = 'none';
});