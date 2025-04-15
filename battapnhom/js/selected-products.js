document.addEventListener('DOMContentLoaded', () => {
  const productsList = document.getElementById('selected-products-list');
  
  let selectedProducts = [];
  try {
    selectedProducts = JSON.parse(localStorage.getItem('cart')) || [];
  } catch (error) {
    console.error('Lỗi đọc giỏ hàng:', error);
    productsList.innerHTML = '<p class="error-message">thử lại.</p>';
    return;
  }

  if (!Array.isArray(selectedProducts)) {
    selectedProducts = [];
  }

  if (selectedProducts.length > 0) {
    selectedProducts.forEach((build, index) => {
      const buildItem = document.createElement('div');
      buildItem.className = 'build-item';
      
      let componentsList = '';
      let totalPrice = 0;
      
      if (build.components) {
        Object.entries(build.components).forEach(([component, details]) => {
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
      }

      buildItem.innerHTML = `
        <div class="build-header">
          <h3>Build Configuration #${index + 1}</h3>
          <div class="build-total">Total: $${totalPrice.toFixed(2)}</div>
        </div>
        <div class="build-components">
          ${componentsList}
        </div>
        <div class="build-actions">
          <button class="remove-build" data-index="${index}">Xóa Build</button>
          <button class="checkout-build" data-index="${index}">Thanh Toán</button>
        </div>
      `;
      
      productsList.appendChild(buildItem);
    });
  } else {
    productsList.innerHTML = '<p class="empty-message">Chưa có cấu hình PC nào được chọn.</p>';
  }

  // Xử lý sự kiện xóa build
  productsList.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-build')) {
      const buildIndex = parseInt(e.target.dataset.index);
      selectedProducts.splice(buildIndex, 1);
      localStorage.setItem('cart', JSON.stringify(selectedProducts));
      
      const buildToRemove = e.target.closest('.build-item');
      buildToRemove.style.transition = 'opacity 0.3s';
      buildToRemove.style.opacity = '0';
      setTimeout(() => buildToRemove.remove(), 300);

      if (selectedProducts.length === 0) {
        productsList.innerHTML = '<p class="empty-message">Chưa có cấu hình PC nào được chọn.</p>';
      }
    }
    
    if (e.target.classList.contains('checkout-build')) {
      const buildIndex = parseInt(e.target.dataset.index);
      const selectedBuild = selectedProducts[buildIndex];
      localStorage.setItem('currentCheckout', JSON.stringify(selectedBuild));
      window.location.href = 'checkout.html';
    }
  });
});