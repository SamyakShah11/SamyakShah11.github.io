document.addEventListener('DOMContentLoaded', () => {
    // --- THEME SWITCHER LOGIC ---
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        const htmlElement = document.documentElement;
        const setTheme = (theme) => {
            htmlElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            themeToggle.checked = theme === 'dark';
        };

        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme) {
            setTheme(savedTheme);
        } else {
            setTheme(prefersDark ? 'dark' : 'light');
        }

        themeToggle.addEventListener('change', () => {
            setTheme(themeToggle.checked ? 'dark' : 'light');
        });
    }

    // --- E-COMMERCE LOGIC ---

    // Placeholder product data
    const products = [
        // Consumer Goods (NPR 499 - 5000)
        { id: 1, name: 'Bamboo Cutlery Set', price: 899, image: 'https://images.unsplash.com/photo-1615326556243-2c9a7b5a9a41?w=600&q=80', description: 'Ditch single-use plastics with this stylish and durable bamboo cutlery set. Includes fork, knife, spoon, chopsticks, and a cleaning brush in a convenient travel pouch.' },
        { id: 2, name: 'Reusable Beeswax Wraps (3-Pack)', price: 1250, image: 'https://images.unsplash.com/photo-1598624422981-3421a3a9d706?w=600&q=80', description: 'A natural and reusable alternative to plastic wrap. Perfect for covering bowls, wrapping sandwiches, and storing food. Made from organic cotton and beeswax.' },
        { id: 3, name: 'Solar-Powered Phone Charger', price: 2499, image: 'https://images.unsplash.com/photo-1593592415546-9a315a3b048b?w=600&q=80', description: 'Harness the power of the sun to charge your devices on the go. Compact, lightweight, and perfect for hiking, camping, or emergencies.' },
        { id: 4, name: 'LED Smart Bulbs (4-Pack)', price: 3500, image: 'https://images.unsplash.com/photo-1620425198463-d33055a2a75b?w=600&q=80', description: 'Upgrade your home with these energy-efficient smart bulbs. Control brightness and color from your phone, and save up to 80% on lighting costs.' },
        { id: 5, name: 'Water-Saving Showerhead', price: 1999, image: 'https://images.unsplash.com/photo-1600242262374-551a0248525b?w=600&q=80', description: 'Reduce your water consumption without sacrificing pressure. This showerhead uses atomization technology to save up to 70% of water.' },
        { id: 6, name: 'Kitchen Compost Bin (5L)', price: 2999, image: 'https://images.unsplash.com/photo-1599858386028-35a40e491183?w=600&q=80', description: 'A sleek and odorless solution for your kitchen scraps. This countertop compost bin makes it easy to turn food waste into nutrient-rich soil for your garden.' },
        { id: 7, name: 'Recycled Paper Notebook Set', price: 750, image: 'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=600&q=80', description: 'Jot down your ideas on paper that’s kind to the planet. This set of three notebooks is made from 100% post-consumer recycled paper.' },
        { id: 8, name: 'Plant-Based Cleaning Kit', price: 2200, image: 'https://images.unsplash.com/photo-1583947215251-b534f14a505b?w=600&q=80', description: 'A complete set of non-toxic, plant-based cleaning supplies for your entire home. Powerful on grime, gentle on the environment.' },
        { id: 9, name: 'Wool Dryer Balls (6-Pack)', price: 1100, image: 'https://images.unsplash.com/photo-1621610232233-0998aa513998?w=600&q=80', description: 'A natural fabric softener that reduces drying time, static, and wrinkles. Reusable for over 1,000 loads, replacing disposable dryer sheets.' },
        { id: 10, 'name': 'Stainless Steel Reusable Straws', 'price': 499, 'image': 'https://images.unsplash.com/photo-1559675522-7a5d31d7244a?w=600&q=80', 'description': 'Set of 4 stainless steel straws with a cleaning brush and travel pouch. A simple switch to reduce plastic waste.'},

        // Mid-Range Tech (NPR 5001 - 20000)
        { id: 11, name: 'Smart Thermostat', price: 14500, image: 'https://images.unsplash.com/photo-1617103996223-372b3648a21a?w=600&q=80', description: 'Learns your schedule and preferences to automatically adjust your home’s temperature, saving energy and money without sacrificing comfort.' },
        { id: 12, name: 'Electric Kitchen Composter', price: 19999, image: 'https://placehold.co/600x400/4CAF50/FFFFFF?text=Electric+Composter', description: 'Turn your food scraps into ready-to-use compost in a matter of hours, not weeks. This electric composter dries, grinds, and cools waste with the push of a button.' },
        { id: 13, name: 'Portable Solar Panel (100W)', price: 18500, image: 'https://images.unsplash.com/photo-1558260573-39a0f0176a63?w=600&q=80', description: 'A foldable and powerful 100W solar panel for charging power stations and electronics during camping, RV trips, or power outages.' },
        { id: 14, name: 'Indoor Air Quality Monitor', price: 8500, image: 'https://images.unsplash.com/photo-1612189459338-a8d9c749a4e9?w=600&q=80', description: 'Track key air quality metrics like PM2.5, CO2, humidity, and temperature in your home to ensure you’re breathing clean, healthy air.' },
        { id: 15, name: 'High-Efficiency Air Purifier', price: 16000, image: 'https://images.unsplash.com/photo-1624385399881-b52737a89264?w=600&q=80', description: 'Captures 99.97% of airborne pollutants like dust, pollen, smoke, and pet dander. Features a washable pre-filter and a true HEPA filter.' },
        { id: 16, 'name': 'Organic Cotton Mesh Produce Bags', 'price': 699, 'image': 'https://images.unsplash.com/photo-1582692196848-a2374a4d7b34?w=600&q=80', 'description': 'Set of 5 reusable mesh bags for fruits and vegetables. Lightweight, durable, and machine washable.'},
        { id: 17, 'name': 'Solid Shampoo & Conditioner Bars', 'price': 1450, 'image': 'https://images.unsplash.com/photo-1625357125943-3a789a5207e3?w=600&q=80', 'description': 'Ditch the plastic bottles with these concentrated shampoo and conditioner bars. Lasts for up to 80 washes.'},
        { id: 18, 'name': 'Bamboo Toothbrush (4-Pack)', 'price': 550, 'image': 'https://images.unsplash.com/photo-1606884486937-a17d3c00b244?w=600&q=80', 'description': 'A biodegradable alternative to plastic toothbrushes. Made from sustainably sourced bamboo with charcoal-infused bristles.'},
        { id: 19, 'name': 'Reusable Coffee Cup', 'price': 1500, 'image': 'https://images.unsplash.com/photo-1579781430135-d8df8a645a45?w=600&q=80', 'description': 'A stylish, insulated coffee cup made from recycled materials. Keep your drink hot and reduce waste from disposable cups.'},
        { id: 20, 'name': 'Energy Monitoring Smart Plugs (2-Pack)', 'price': 6000, 'image': 'https://images.unsplash.com/photo-1633509310763-3939b8a8a4a4?w=600&q=80', 'description': 'Monitor and control your home appliances from your phone. Set schedules and track energy usage to reduce your electricity bill.'},

        // Eco Machines (NPR 20001 - 89999)
        { id: 21, 'name': 'Home Biogas System', 'price': 75000, 'image': 'https://placehold.co/600x400/2E7D32/FFFFFF?text=Biogas+System', 'description': 'Convert your organic waste into clean cooking gas and liquid fertilizer. A revolutionary system for sustainable, off-grid living.'},
        { id: 22, 'name': 'Rainwater Harvesting System (500L)', 'price': 45000, 'image': 'https://placehold.co/600x400/2E7D32/FFFFFF?text=Rainwater+System', 'description': 'Collect and store rainwater for gardening, cleaning, and non-potable uses. Includes a 500L tank, filter, and pump.'},
        { id: 23, 'name': 'Solar Water Heater (150L)', 'price': 65000, 'image': 'https://placehold.co/600x400/2E7D32/FFFFFF?text=Solar+Heater', 'description': 'Harness solar energy to heat your water. This 150L system can significantly reduce your electricity or gas bills.'},
        { id: 24, 'name': 'High-Capacity Power Station (1000Wh)', 'price': 89999, 'image': 'https://images.unsplash.com/photo-1616577632997-8a1c7a3b3e6a?w=600&q=80', 'description': 'A powerful, portable 1000Wh battery to power your essential devices during outages or off-grid adventures. Can be recharged via solar.'},
        { id: 25, 'name': 'Automated Hydroponics System', 'price': 55000, 'image': 'https://images.unsplash.com/photo-1631018113933-a8234a4ba11a?w=600&q=80', 'description': 'Grow fresh produce indoors with this soil-free automated hydroponics system. Uses 90% less water than traditional farming.'},
        { id: 26, 'name': 'Air-to-Water Generator', 'price': 82000, 'image': 'https://placehold.co/600x400/2E7D32/FFFFFF?text=Water+Generator', 'description': 'Generates up to 20 liters of pure drinking water from the humidity in the air. An incredible solution for clean water access.'},
        { id: 27, 'name': 'Advanced Robotic Composter', 'price': 35000, 'image': 'https://placehold.co/600x400/2E7D32/FFFFFF?text=Robo+Composter', 'description': 'A fully automated composter that manages temperature, aeration, and moisture for perfect compost in just 2 weeks.'},
        { id: 28, 'name': 'Smart Garden System', 'price': 21000, 'image': 'https://images.unsplash.com/photo-1530836243917-951766b85a32?w=600&q=80', 'description': 'An indoor garden that automates watering and lighting for growing herbs, salads, and flowers year-round.'},
        { id: 29, 'name': 'Geothermal Heat Pump', 'price': 78000, 'image': 'https://placehold.co/600x400/2E7D32/FFFFFF?text=Geothermal+Pump', 'description': 'The most efficient way to heat and cool your home. Uses the stable temperature of the earth to provide year-round comfort.'},
        { id: 30, 'name': 'Electric Bicycle', 'price': 85000, 'image': 'https://images.unsplash.com/photo-1576425995630-6998b9a4a78f?w=600&q=80', 'description': 'A sleek and powerful electric bike for a green and efficient commute. Travel up to 80km on a single charge.'}
    ];

    let cart = JSON.parse(localStorage.getItem('peasCart')) || [];

    const saveCart = () => {
        localStorage.setItem('peasCart', JSON.stringify(cart));
    };

    const renderProducts = () => {
        const productGrid = document.getElementById('product-grid');
        if (!productGrid) return;

        productGrid.innerHTML = products.map((product, index) => `
            <div class="product-card" style="animation-delay: ${index * 0.05}s;">
                <a href="product-detail.html?id=${product.id}">
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                    <div class="product-card-content">
                        <h3>${product.name}</h3>
                        <p class="product-price">NPR. ${product.price.toFixed(2)}</p>
                    </div>
                </a>
            </div>
        `).join('');
    };

    const renderProductDetail = () => {
        const container = document.querySelector('.product-detail-container');
        if (!container) return;

        const productId = new URLSearchParams(window.location.search).get('id');
        const product = products.find(p => p.id == productId);

        if (product) {
            container.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="product-detail-image">
                <div class="product-detail-info">
                    <h1>${product.name}</h1>
                    <p class="product-detail-price">NPR. ${product.price.toFixed(2)}</p>
                    <p>${product.description}</p>
                    <button class="cta-button add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
                </div>
            `;
            container.querySelector('.add-to-cart-btn').addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                addToCart(id);
            });
        } else {
            container.innerHTML = '<h2>Product not found.</h2>';
        }
    };

    const addToCart = (productId) => {
        const product = products.find(p => p.id == productId);
        const cartItem = cart.find(item => item.id == productId);

        if (cartItem) {
            cartItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        saveCart();
        updateCartUI();
        openCart();
    };

    const updateCartUI = () => {
        renderCartSidebar();
        updateCartCount();
    };

    const updateCartCount = () => {
        const cartCountElements = document.querySelectorAll('.cart-count');
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElements.forEach(el => el.textContent = totalItems);
    };

    const renderCartSidebar = () => {
        const cartSidebar = document.querySelector('.cart-sidebar');
        if (!cartSidebar) return;

        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        cartSidebar.innerHTML = `
            <div class="cart-header">
                <h2>Your Cart</h2>
                <button class="close-cart-btn">&times;</button>
            </div>
            <div class="cart-items">
                ${cart.length === 0 ? '<p>Your cart is empty.</p>' : cart.map(item => `
                    <div class="cart-item" data-id="${item.id}">
                        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                        <div class="cart-item-details">
                            <h4>${item.name}</h4>
                            <p>NPR. ${item.price.toFixed(2)}</p>
                            <div class="cart-item-actions">
                                <button class="quantity-btn decrease-btn">-</button>
                                <input type="number" value="${item.quantity}" min="1" class="quantity-input">
                                <button class="quantity-btn increase-btn">+</button>
                                <button class="remove-btn">Remove</button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            ${cart.length > 0 ? `
            <div class="cart-footer">
                <div class="cart-total">
                    <span>Total:</span>
                    <span>NPR. ${total.toFixed(2)}</span>
                </div>
                <a href="checkout.html" class="cta-button" style="width: 100%; text-align: center;">Checkout</a>
            </div>
            ` : ''}
        `;

        addCartEventListeners();
    };

    const addCartEventListeners = () => {
        document.querySelector('.close-cart-btn')?.addEventListener('click', closeCart);
        document.querySelectorAll('.cart-item').forEach(itemEl => {
            const id = itemEl.dataset.id;
            itemEl.querySelector('.increase-btn').addEventListener('click', () => updateQuantity(id, 1));
            itemEl.querySelector('.decrease-btn').addEventListener('click', () => updateQuantity(id, -1));
            itemEl.querySelector('.quantity-input').addEventListener('change', (e) => {
                const newQuantity = parseInt(e.target.value);
                const item = cart.find(i => i.id == id);
                if (item && newQuantity > 0) {
                    item.quantity = newQuantity;
                    saveCart();
                    updateCartUI();
                } else {
                    // Reset if invalid
                    e.target.value = item.quantity;
                }
            });
            itemEl.querySelector('.remove-btn').addEventListener('click', () => removeFromCart(id));
        });
    };

    const updateQuantity = (productId, change) => {
        const cartItem = cart.find(item => item.id == productId);
        if (cartItem) {
            cartItem.quantity += change;
            if (cartItem.quantity <= 0) {
                removeFromCart(productId);
            } else {
                saveCart();
                updateCartUI();
            }
        }
    };

    const removeFromCart = (productId) => {
        cart = cart.filter(item => item.id != productId);
        saveCart();
        updateCartUI();
    };

    const cartSidebar = document.querySelector('.cart-sidebar');
    const cartOverlay = document.querySelector('.cart-overlay');

    const openCart = () => {
        cartSidebar?.classList.add('open');
        cartOverlay?.classList.add('visible');
    };

    const closeCart = () => {
        cartSidebar?.classList.remove('open');
        cartOverlay?.classList.remove('visible');
    };

    const renderCheckoutPage = () => {
        const itemsContainer = document.querySelector('.checkout-summary-items');
        const totalContainer = document.querySelector('.checkout-summary-total');
        if (!itemsContainer || !totalContainer) return;

        if (cart.length === 0) {
            itemsContainer.innerHTML = '<p>Your cart is empty. Add items from the marketplace to proceed.</p>';
            return;
        }

        itemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-details">
                    <h4>${item.name} (x${item.quantity})</h4>
                    <p>NPR. ${(item.price * item.quantity).toFixed(2)}</p>
                </div>
            </div>
        `).join('');

        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        totalContainer.innerHTML = `
            <div class="cart-total">
                <span>Total:</span>
                <span>NPR. ${total.toFixed(2)}</span>
            </div>
        `;
    };

    const addCheckoutEventListeners = () => {
        const checkoutForm = document.querySelector('.checkout-container .contact-form');
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', (e) => {
                e.preventDefault(); 

                if (cart.length === 0) {
                    alert('Your cart is empty! Please add products before placing an order.');
                    return;
                }

                alert('Thank you for your order! Your purchase has been confirmed and a summary will be sent to your email.');
                
                // Clear the cart
                cart = [];
                saveCart();
                
                // Redirect to homepage after a short delay
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 500);
            });
        }
    };

    // --- INITIALIZATION ---
    const init = () => {
        // Page-specific renders
        renderProducts();
        renderProductDetail();
        renderCheckoutPage();

        // Global UI updates
        updateCartUI();

        // Global event listeners
        document.querySelectorAll('.cart-icon-wrapper').forEach(icon => {
            icon.addEventListener('click', openCart);
        });
        cartOverlay?.addEventListener('click', closeCart);

        // Add checkout form listener
        addCheckoutEventListeners();
    };

    init();
});
