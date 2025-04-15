document.addEventListener('DOMContentLoaded', function() {
    const selectedComponents = {
        cpu: null,
        gpu: null,
        motherboard: null,
        ram: null,
        storage: null,
        psu: null,
        case: null
    };

    let totalPower = 0;

    function updateBuildSummary() {
        let totalPrice = 0;
        totalPower = 0;

        Object.entries(selectedComponents).forEach(([component, details]) => {
            const summaryItem = document.querySelector(`#selected-components .summary-item:nth-child(${Object.keys(selectedComponents).indexOf(component) + 1}) span:last-child`);
            if (details) {
                summaryItem.textContent = details.name;
                totalPrice += details.price;
                totalPower += details.power || 0;
            } else {
                summaryItem.textContent = 'Chưa chọn';
            }
        });

        document.querySelector('.total-price span:last-child').textContent = `$${totalPrice.toFixed(2)}`;
        document.querySelector('.add-to-cart-btn').disabled = Object.values(selectedComponents).some(comp => comp === null);
        
        checkCompatibility();
        return { totalPrice, totalPower };
    }

    function checkCompatibility() {
        const compatCheck = document.querySelector('.compatibility-check');
        let isCompatible = true;
        let messages = [];

        if (selectedComponents.cpu && selectedComponents.motherboard) {
            const cpuSocket = selectedComponents.cpu.socket;
            const mbSocket = selectedComponents.motherboard.socket;
            if (cpuSocket !== mbSocket) {
                isCompatible = false;
                messages.push(`CPU socket ${cpuSocket} không tương thích với bo mạch chủ ${mbSocket}`);
            }
        }

        if (selectedComponents.psu) {
            const requiredPower = totalPower * 1.2; 
            if (requiredPower > selectedComponents.psu.wattage) {
                isCompatible = false;
                messages.push(`Nguồn điện ${selectedComponents.psu.wattage}W không đủ cho các linh kiện (cần ${Math.ceil(requiredPower)}W)`);
            }
        }

        const message = messages.length > 0 ? messages.join('. ') : 'Các linh kiện tương thích với nhau';
        compatCheck.innerHTML = `<i class="fas fa-${isCompatible ? 'check' : 'exclamation'}-circle"></i> ${message}`;
        compatCheck.className = `compatibility-check${isCompatible ? '' : ' compatibility-warning'}`;

        document.querySelector('.add-to-cart-btn').disabled = !isCompatible || Object.values(selectedComponents).some(comp => comp === null);

        return isCompatible;
    }

    function selectComponent(card) {
        const component = card.dataset.component;
        const price = parseFloat(card.dataset.price);
        const power = parseInt(card.dataset.power) || 0;
        const name = card.querySelector('h4').textContent;
        const socket = card.dataset.socket;
        const image = card.querySelector('img').src;

        document.querySelectorAll(`.component-card[data-component="${component}"]`).forEach(c => {
            c.classList.remove('selected');
            c.querySelector('button').textContent = 'Chọn';
        });

        if (selectedComponents[component]?.name === name) {
            selectedComponents[component] = null;
            card.classList.remove('selected');
            card.querySelector('button').textContent = 'Chọn';
        } else {
            selectedComponents[component] = { name, price, power, socket, image };
            card.classList.add('selected');
            card.querySelector('button').textContent = 'Đã chọn';
        }

        updateBuildSummary();
        checkCompatibility();
    }

    document.querySelectorAll('.component-card').forEach(card => {
        const selectButton = card.querySelector('.select-component');
        selectButton.addEventListener('click', (e) => {
            e.stopPropagation();
            selectComponent(card);
        });

        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.transition = 'transform 0.3s ease';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });

    document.querySelector('.add-to-cart-btn').addEventListener('click', () => {
        if (!Object.values(selectedComponents).some(comp => comp === null)) {
            const buildConfig = {
                id: 'build_' + Date.now(),
                type: 'build',
                components: selectedComponents,
                totalPrice: updateBuildSummary().totalPrice,
                totalPower: totalPower,
                date: new Date().toISOString()
            };
            
            if (window.cart) {
                window.cart.addBuild(buildConfig);
                alert('Cấu hình PC đã được thêm vào giỏ hàng!');
                window.location.href = 'cart.html';
            } else {
                let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
                cartItems.push(buildConfig);
                localStorage.setItem('cart', JSON.stringify(cartItems));
                
                alert('thêm vào giỏ hàng thành công');
                window.location.href = 'cart.html';
            }
        }
    });

    const titleToComponent = {
        'cpu': 'cpu',
        'gpu': 'gpu',
        'card đồ họa': 'gpu',
        'bo mạch chủ': 'motherboard',
        'ram': 'ram',
        'ổ cứng': 'storage',
        'nguồn': 'psu',
        'case': 'case'
    };

    document.querySelectorAll('.build-step').forEach((step, index) => {
        step.style.cursor = 'pointer';
        step.addEventListener('click', function() {
            const stepText = this.querySelector('p').textContent.toLowerCase();
            const componentType = titleToComponent[stepText];
            
            document.querySelectorAll('.build-step').forEach(s => s.classList.remove('active'));
            this.classList.add('active');

            document.querySelectorAll('.component-section').forEach(section => {
                const sectionTitle = section.querySelector('h2').textContent.toLowerCase();
                const sectionComponent = section.querySelector('.component-card').dataset.component;
                
                if (sectionComponent === componentType) {
                    section.style.display = 'block';
                    section.querySelectorAll('.component-card').forEach(card => {
                        const component = card.dataset.component;
                        const name = card.querySelector('h4').textContent;
                        if (selectedComponents[component]?.name === name) {
                            card.classList.add('selected');
                            card.querySelector('button').textContent = 'Đã chọn';
                        } else {
                            card.classList.remove('selected');
                            card.querySelector('button').textContent = 'Chọn';
                        }
                    });
                } else {
                    section.style.display = 'none';
                }
            });
        });
    });

    document.querySelectorAll('.component-section').forEach((section, index) => {
        section.style.display = index === 0 ? 'block' : 'none';
    });
});