document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIG & STATE ---
    const API_URL = ''; // Use relative paths for API calls
    let allProducts = []; // Cache for all products fetched from the server
    let cart = JSON.parse(localStorage.getItem('peasCart')) || [];


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

    // --- UTILITY & API FUNCTIONS ---
    const saveCart = () => {
        localStorage.setItem('peasCart', JSON.stringify(cart));
    };

    const formatPrice = (price) => {
        return `NPR. ${Number(price).toFixed(2)}`;
    };

    const fetchProducts = async () => {
        try {
            const response = await fetch(`${API_URL}/api/products`);
            if (!response.ok) throw new Error('Network response was not ok.');
            allProducts = await response.json();
            return allProducts;
        } catch (error) {
            console.error('Failed to fetch products:', error);
            const productGrid = document.getElementById('product-grid');
            if (productGrid) productGrid.innerHTML = '<p>Error: Could not load products. Please ensure the backend server is running.</p>';
            return [];
        }
    };

    const fetchProductById = async (id) => {
        if (allProducts.length > 0) {
            const product = allProducts.find(p => p.id == id);
            if (product) return product;
        }
        try {
            const response = await fetch(`${API_URL}/api/products/${id}`);
            if (!response.ok) throw new Error('Product not found.');
            return await response.json();
        } catch (error) {
            console.error(`Failed to fetch product ${id}:`, error);
            return null;
        }
    };

    // --- UI RENDERING ---
    const renderProducts = (products) => {
        const productGrid = document.getElementById('product-grid');
        if (!productGrid) return;

        productGrid.innerHTML = products.map((product, index) => `
            <div class="product-card" style="animation-delay: ${index * 0.05}s;">
                <a href="product-detail.html?id=${product.id}">
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                    <div class="product-card-content">
                        <h3>${product.name}</h3>
                        <p class="product-price">${formatPrice(product.price)}</p>
                    </div>
                </a>
            </div>
        `).join('');
    };

    const renderProductDetail = async () => {
        const container = document.querySelector('.product-detail-container');
        if (!container) return;

        const productId = new URLSearchParams(window.location.search).get('id');
        if (!productId) return;

        container.innerHTML = '<p>Loading product...</p>';
        const product = await fetchProductById(productId);

        if (product) {
            document.title = `${product.name} | PEAS`;
            container.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="product-detail-image">
                <div class="product-detail-info">
                    <h1>${product.name}</h1>
                    <p class="product-detail-price">${formatPrice(product.price)}</p>
                    <p>${product.description}</p>
                    <button class="cta-button add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
                </div>
            `;
            container.querySelector('.add-to-cart-btn').addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                handleAddToCart(id);
            });
        } else {
            container.innerHTML = '<h2>Product not found.</h2><p>The product you are looking for does not exist. <a href="marketplace.html">Return to Marketplace</a>.</p>';
        }
    };

    const handleAddToCart = async (productId) => {
        const product = await fetchProductById(productId);
        if (!product) {
            alert('Error: Could not find product details.');
            return;
        }

        const cartItem = cart.find(item => item.id == productId);

        if (cartItem) {
            cartItem.quantity++;
        } else {
            cart.push({ ...product,
                quantity: 1
            });
        }

        saveCart();
        updateCartUI();
        openCart();
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
                            <p>${formatPrice(item.price)}</p>
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
                    <span>${formatPrice(total)}</span>
                </div>
                <a href="checkout.html" class="cta-button" style="width: 100%; text-align: center;">Checkout</a>
            </div>
            ` : ''}
        `;

        addCartEventListeners();
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
                    <p>${formatPrice(item.price * item.quantity)}</p>
                </div>
            </div>
        `).join('');

        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        totalContainer.innerHTML = `
            <div class="cart-total">
                <span>Total:</span>
                <span>${formatPrice(total)}</span>
            </div>
        `;
    };

    // --- EVENT HANDLERS & FORM SUBMISSIONS ---

    const handleContactForm = async (form) => {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;

        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';

        try {
            const response = await fetch(`${API_URL}/api/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Failed to send message.');

            alert(result.message);
            form.reset();
        } catch (error) {
            console.error('Contact form error:', error);
            alert(`Error: ${error.message}`);
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    };

    const handleCheckoutForm = async (form) => {
        if (cart.length === 0) {
            alert('Your cart is empty! Please add products before placing an order.');
            return;
        }

        const formData = new FormData(form);
        const shippingDetails = Object.fromEntries(formData.entries());
        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;

        submitButton.disabled = true;
        submitButton.textContent = 'Placing Order...';

        try {
            const response = await fetch(`${API_URL}/api/checkout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ shippingDetails, cart }),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Failed to place order.');

            alert(`${result.message}\nOrder ID: ${result.orderId}`);

            cart = [];
            saveCart();

            window.location.href = 'index.html';
        } catch (error) {
            console.error('Checkout error:', error);
            alert(`Error: ${error.message}`);
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    };

    // --- INITIALIZATION ---
    const init = async () => {
        // Global UI updates
        updateCartUI();

        // Global event listeners
        document.querySelectorAll('.cart-icon-wrapper').forEach(icon => icon.addEventListener('click', openCart));
        cartOverlay?.addEventListener('click', closeCart);

        const contactForm = document.querySelector('.contact-form-container .contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                handleContactForm(e.target);
            });
        }

        const checkoutForm = document.querySelector('.checkout-container .contact-form');
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', (e) => {
                e.preventDefault();
                handleCheckoutForm(e.target);
            });
        }

        // Page-specific initializations that require fetching data
        if (document.getElementById('product-grid')) {
            const products = await fetchProducts();
            renderProducts(products);
        }
        if (document.querySelector('.product-detail-container')) {
            await renderProductDetail();
        }
        if (document.querySelector('.checkout-container')) {
            renderCheckoutPage();
        }
    };

    init();
});
