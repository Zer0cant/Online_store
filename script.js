const defaultConfig = {
  background_color: "#f0f9ff",
  surface_color: "#ffffff",
  text_color: "#0c4a6e",
  primary_action_color: "#0ea5e9",
  secondary_action_color: "#64748b",
  font_family: "system-ui",
  font_size: 16,
  store_name: "My Shop",
  welcome_message: "Welcome to our store!",
  view_cart_text: "View Cart",
  checkout_text: "Checkout"
};

// --- MODIFIED SECTION START ---
// 1. Initialize referenceProducts as an empty array (changed from const to let)
let referenceProducts = [];

// 2. Add function to fetch data from your PHP/XAMPP backend
async function fetchProducts() {
  try {
    // This calls the PHP file you created
    const response = await fetch('get_products.php'); 
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Map the data to ensure price is a number (SQL sometimes sends strings)
    referenceProducts = data.map(item => ({
      ...item,
      price: parseFloat(item.price) 
    }));

    // Re-render the shop view now that we have data
    renderShopView();
    
    console.log("Products loaded from database:", referenceProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    showToast('Error connecting to database. Is XAMPP running?');
  }
}
// --- MODIFIED SECTION END ---

let cart = [];
let currentCategory = "All";
let currentView = "shop"; // shop or cart

const dataHandler = {
  onDataChanged(data) {
    // This stores customer orders/purchases
  }
};

async function initApp() {
  if (window.dataSdk) {
    const result = await window.dataSdk.init(dataHandler);
  }

  if (window.elementSdk) {
    window.elementSdk.init({
      defaultConfig,
      onConfigChange: async (config) => {
        const customFont = config.font_family || defaultConfig.font_family;
        const baseFontStack = 'system-ui, -apple-system, sans-serif';
        const baseSize = config.font_size || defaultConfig.font_size;

        document.body.style.backgroundColor = config.background_color || defaultConfig.background_color;
        document.body.style.fontFamily = `${customFont}, ${baseFontStack}`;

        const header = document.getElementById('header');
        if (header) {
          header.style.backgroundColor = config.surface_color || defaultConfig.surface_color;
          header.style.borderBottomColor = config.primary_action_color || defaultConfig.primary_action_color;
        }

        const storeName = document.getElementById('store-name');
        if (storeName) {
          storeName.textContent = config.store_name || defaultConfig.store_name;
          storeName.style.color = config.text_color || defaultConfig.text_color;
          storeName.style.fontSize = `${baseSize * 1.5}px`;
          storeName.style.fontFamily = `${customFont}, ${baseFontStack}`;
        }

        const welcomeMsg = document.getElementById('welcome-message');
        if (welcomeMsg) {
          welcomeMsg.textContent = config.welcome_message || defaultConfig.welcome_message;
          welcomeMsg.style.color = config.text_color || defaultConfig.text_color;
          welcomeMsg.style.fontSize = `${baseSize}px`;
          welcomeMsg.style.fontFamily = `${customFont}, ${baseFontStack}`;
        }

        const cartBtn = document.getElementById('cart-btn');
        if (cartBtn) {
          const btnText = cartBtn.querySelector('.cart-btn-text');
          if (btnText) {
            btnText.textContent = config.view_cart_text || defaultConfig.view_cart_text;
            btnText.style.fontSize = `${baseSize}px`;
          }
          cartBtn.style.backgroundColor = config.primary_action_color || defaultConfig.primary_action_color;
        }

        const cartBadge = document.getElementById('cart-badge');
        if (cartBadge) {
          cartBadge.style.backgroundColor = config.secondary_action_color || defaultConfig.secondary_action_color;
          cartBadge.style.fontSize = `${baseSize * 0.75}px`;
        }

        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
          btn.style.fontSize = `${baseSize * 1.125}px`;
          if (btn.classList.contains('active')) {
            btn.style.backgroundColor = config.primary_action_color || defaultConfig.primary_action_color;
          } else {
            btn.style.backgroundColor = config.surface_color || defaultConfig.surface_color;
          }
        });

        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
          card.style.backgroundColor = config.surface_color || defaultConfig.surface_color;
          const title = card.querySelector('.product-title');
          const desc = card.querySelector('.product-desc');
          const price = card.querySelector('.product-price');
          const addBtn = card.querySelector('.add-to-cart-btn');

          if (title) {
            title.style.color = config.text_color || defaultConfig.text_color;
            title.style.fontSize = `${baseSize * 1.125}px`;
            title.style.fontFamily = `${customFont}, ${baseFontStack}`;
          }
          if (desc) {
            desc.style.color = config.text_color || defaultConfig.text_color;
            desc.style.fontSize = `${baseSize * 0.875}px`;
            desc.style.fontFamily = `${customFont}, ${baseFontStack}`;
          }
          if (price) {
            price.style.color = config.primary_action_color || defaultConfig.primary_action_color;
            price.style.fontSize = `${baseSize * 1.25}px`;
            price.style.fontFamily = `${customFont}, ${baseFontStack}`;
          }
          if (addBtn) {
            addBtn.style.backgroundColor = config.primary_action_color || defaultConfig.primary_action_color;
            addBtn.style.fontSize = `${baseSize}px`;
            addBtn.style.fontFamily = `${customFont}, ${baseFontStack}`;
          }
        });

        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
          checkoutBtn.textContent = config.checkout_text || defaultConfig.checkout_text;
          checkoutBtn.style.backgroundColor = config.primary_action_color || defaultConfig.primary_action_color;
          checkoutBtn.style.fontSize = `${baseSize * 1.125}px`;
          checkoutBtn.style.fontFamily = `${customFont}, ${baseFontStack}`;
        }

        const cartItems = document.querySelectorAll('.cart-item');
        cartItems.forEach(item => {
          const itemName = item.querySelector('.cart-item-name');
          const itemPrice = item.querySelector('.cart-item-price');
          const removeBtn = item.querySelector('.remove-item-btn');

          if (itemName) {
            itemName.style.color = config.text_color || defaultConfig.text_color;
            itemName.style.fontSize = `${baseSize * 1.125}px`;
            itemName.style.fontFamily = `${customFont}, ${baseFontStack}`;
          }
          if (itemPrice) {
            itemPrice.style.color = config.primary_action_color || defaultConfig.primary_action_color;
            itemPrice.style.fontSize = `${baseSize}px`;
            itemPrice.style.fontFamily = `${customFont}, ${baseFontStack}`;
          }
          if (removeBtn) {
            removeBtn.style.color = config.secondary_action_color || defaultConfig.secondary_action_color;
            removeBtn.style.fontSize = `${baseSize * 0.875}px`;
            removeBtn.style.fontFamily = `${customFont}, ${baseFontStack}`;
          }
        });
      },
      mapToCapabilities: (config) => ({
        recolorables: [
          {
            get: () => config.background_color || defaultConfig.background_color,
            set: (value) => {
              const currentConfig = window.elementSdk.config;
              currentConfig.background_color = value;
              window.elementSdk.setConfig({ background_color: value });
            }
          },
          {
            get: () => config.surface_color || defaultConfig.surface_color,
            set: (value) => {
              const currentConfig = window.elementSdk.config;
              currentConfig.surface_color = value;
              window.elementSdk.setConfig({ surface_color: value });
            }
          },
          {
            get: () => config.text_color || defaultConfig.text_color,
            set: (value) => {
              const currentConfig = window.elementSdk.config;
              currentConfig.text_color = value;
              window.elementSdk.setConfig({ text_color: value });
            }
          },
          {
            get: () => config.primary_action_color || defaultConfig.primary_action_color,
            set: (value) => {
              const currentConfig = window.elementSdk.config;
              currentConfig.primary_action_color = value;
              window.elementSdk.setConfig({ primary_action_color: value });
            }
          },
          {
            get: () => config.secondary_action_color || defaultConfig.secondary_action_color,
            set: (value) => {
              const currentConfig = window.elementSdk.config;
              currentConfig.secondary_action_color = value;
              window.elementSdk.setConfig({ secondary_action_color: value });
            }
          }
        ],
        borderables: [],
        fontEditable: {
          get: () => config.font_family || defaultConfig.font_family,
          set: (value) => {
            const currentConfig = window.elementSdk.config;
            currentConfig.font_family = value;
            window.elementSdk.setConfig({ font_family: value });
          }
        },
        fontSizeable: {
          get: () => config.font_size || defaultConfig.font_size,
          set: (value) => {
            const currentConfig = window.elementSdk.config;
            currentConfig.font_size = value;
            window.elementSdk.setConfig({ font_size: value });
          }
        }
      }),
      mapToEditPanelValues: (config) => new Map([
        ["store_name", config.store_name || defaultConfig.store_name],
        ["welcome_message", config.welcome_message || defaultConfig.welcome_message],
        ["view_cart_text", config.view_cart_text || defaultConfig.view_cart_text],
        ["checkout_text", config.checkout_text || defaultConfig.checkout_text]
      ])
    });
  }

  // --- MODIFIED SECTION START ---
  // 3. Render the app structure first
  renderApp();
  
  // 4. Then fetch the products from XAMPP to populate the grid
  await fetchProducts();
  // --- MODIFIED SECTION END ---
}

function renderApp() {
  const config = window.elementSdk?.config || defaultConfig;
  const app = document.getElementById('app');
  
  app.innerHTML = `
    <header id="header" class="shadow-md" style="background-color: ${config.surface_color || defaultConfig.surface_color}; border-bottom: 4px solid ${config.primary_action_color || defaultConfig.primary_action_color}; padding: 24px;">
      <div class="max-w-7xl mx-auto flex justify-between items-center">
        <div>
          <h1 id="store-name" class="font-bold mb-1" style="color: ${config.text_color || defaultConfig.text_color}; font-size: ${(config.font_size || defaultConfig.font_size) * 1.5}px;">${config.store_name || defaultConfig.store_name}</h1>
          <p id="welcome-message" class="opacity-75" style="color: ${config.text_color || defaultConfig.text_color}; font-size: ${config.font_size || defaultConfig.font_size}px;">${config.welcome_message || defaultConfig.welcome_message}</p>
        </div>
        <button id="cart-btn" class="relative px-6 py-3 text-white rounded-full font-medium shadow-lg hover:opacity-90 transition-all flex items-center gap-2" style="background-color: ${config.primary_action_color || defaultConfig.primary_action_color};">
          <span style="font-size: 24px;">🛒</span>
          <span class="cart-btn-text" style="font-size: ${config.font_size || defaultConfig.font_size}px;">${config.view_cart_text || defaultConfig.view_cart_text}</span>
          <span id="cart-badge" class="cart-badge text-white" style="background-color: ${config.secondary_action_color || defaultConfig.secondary_action_color}; font-size: ${(config.font_size || defaultConfig.font_size) * 0.75}px; display: none;">0</span>
        </button>
      </div>
    </header>
    
    <main id="main-content" class="flex-1" style="padding: 32px 24px;">
      <div class="max-w-7xl mx-auto">
        <div id="shop-view"></div>
        <div id="cart-view" style="display: none;"></div>
      </div>
    </main>
  `;

  document.getElementById('cart-btn').addEventListener('click', toggleView);
  // Note: We don't need to call renderShopView here anymore because fetchProducts will call it
  // But keeping it here renders the "Browse by Category" buttons immediately before data loads
  renderShopView();
}

function renderShopView() {
  const config = window.elementSdk?.config || defaultConfig;
  const shopView = document.getElementById('shop-view');
  
  const categories = ["All", "Electronics", "Sports", "Home", "Accessories"];
  
  shopView.innerHTML = `
    <div class="mb-8">
      <h2 class="font-semibold mb-4" style="color: ${config.text_color || defaultConfig.text_color}; font-size: ${(config.font_size || defaultConfig.font_size) * 1.25}px;">Browse by Category</h2>
      <div class="flex flex-wrap gap-3">
        ${categories.map(cat => `
          <button class="filter-btn px-6 py-3 rounded-full font-medium shadow-md transition-all ${currentCategory === cat ? 'active' : ''}" 
                  data-category="${cat}"
                  style="background-color: ${currentCategory === cat ? config.primary_action_color || defaultConfig.primary_action_color : config.surface_color || defaultConfig.surface_color}; 
                         color: ${currentCategory === cat ? '#ffffff' : config.text_color || defaultConfig.text_color}; 
                         font-size: ${(config.font_size || defaultConfig.font_size) * 1.125}px;">
            ${cat === "All" ? "🏪" : cat === "Electronics" ? "💻" : cat === "Sports" ? "⚽" : cat === "Home" ? "🏡" : "👜"} ${cat}
          </button>
        `).join('')}
      </div>
    </div>
    
    <div id="products-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"></div>
  `;

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      currentCategory = e.target.dataset.category;
      renderShopView();
    });
  });

  renderProducts();
}

function renderProducts() {
  const config = window.elementSdk?.config || defaultConfig;
  const grid = document.getElementById('products-grid');
  
  // If data hasn't loaded from XAMPP yet, show a loading message
  if (referenceProducts.length === 0) {
    grid.innerHTML = `<p style="grid-column: 1/-1; text-align:center; padding: 20px;">Loading products from database...</p>`;
    return;
  }

  const filteredProducts = currentCategory === "All" 
    ? referenceProducts 
    : referenceProducts.filter(p => p.category === currentCategory);

  grid.innerHTML = filteredProducts.map(product => `
    <div class="product-card rounded-xl shadow-lg overflow-hidden" style="background-color: ${config.surface_color || defaultConfig.surface_color};">
      <div class="p-6 text-center" style="background: linear-gradient(135deg, ${config.primary_action_color || defaultConfig.primary_action_color}22, ${config.primary_action_color || defaultConfig.primary_action_color}44);">
        <div style="font-size: 80px;">${product.image}</div>
      </div>
      <div class="p-6">
        <h3 class="product-title font-bold mb-2" style="color: ${config.text_color || defaultConfig.text_color}; font-size: ${(config.font_size || defaultConfig.font_size) * 1.125}px;">${product.name}</h3>
        <p class="product-desc opacity-75 mb-4" style="color: ${config.text_color || defaultConfig.text_color}; font-size: ${(config.font_size || defaultConfig.font_size) * 0.875}px;">${product.description}</p>
        <div class="flex items-center justify-between mb-4">
          <span class="product-price font-bold" style="color: ${config.primary_action_color || defaultConfig.primary_action_color}; font-size: ${(config.font_size || defaultConfig.font_size) * 1.25}px;">$${product.price.toFixed(2)}</span>
        </div>
        <button class="add-to-cart-btn w-full py-3 text-white rounded-lg font-medium hover:opacity-90 transition-opacity" 
                data-product='${JSON.stringify(product)}'
                style="background-color: ${config.primary_action_color || defaultConfig.primary_action_color}; font-size: ${config.font_size || defaultConfig.font_size}px;">
          Add to Cart 🛒
        </button>
      </div>
    </div>
  `).join('');

  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Data attribute string might behave oddly with JSON, careful parsing
      try {
          const product = JSON.parse(e.target.dataset.product);
          addToCart(product);
      } catch (err) {
          console.error("Error adding to cart", err);
      }
    });
  });
}

function addToCart(product) {
  const existingItem = cart.find(item => item.id === product.id);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  updateCartBadge();
  showToast(`${product.name} added to cart!`);
}

function updateCartBadge() {
  const badge = document.getElementById('cart-badge');
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  if (totalItems > 0) {
    badge.textContent = totalItems;
    badge.style.display = 'flex';
  } else {
    badge.style.display = 'none';
  }
}

function toggleView() {
  currentView = currentView === 'shop' ? 'cart' : 'shop';
  
  const shopView = document.getElementById('shop-view');
  const cartView = document.getElementById('cart-view');
  const cartBtn = document.getElementById('cart-btn');
  const cartBtnText = cartBtn.querySelector('.cart-btn-text');
  const config = window.elementSdk?.config || defaultConfig;

  if (currentView === 'cart') {
    shopView.style.display = 'none';
    cartView.style.display = 'block';
    cartBtnText.textContent = 'Continue Shopping';
    renderCartView();
  } else {
    shopView.style.display = 'block';
    cartView.style.display = 'none';
    cartBtnText.textContent = config.view_cart_text || defaultConfig.view_cart_text;
  }
}

function renderCartView() {
  const config = window.elementSdk?.config || defaultConfig;
  const cartView = document.getElementById('cart-view');
  
  if (cart.length === 0) {
    cartView.innerHTML = `
      <div class="text-center py-16">
        <div style="font-size: 80px; margin-bottom: 16px;">🛒</div>
        <h2 class="font-bold mb-2" style="color: ${config.text_color || defaultConfig.text_color}; font-size: ${(config.font_size || defaultConfig.font_size) * 1.5}px;">Your cart is empty</h2>
        <p class="opacity-75 mb-6" style="color: ${config.text_color || defaultConfig.text_color}; font-size: ${config.font_size || defaultConfig.font_size}px;">Add some products to get started!</p>
      </div>
    `;
    return;
  }

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  cartView.innerHTML = `
    <h2 class="font-bold mb-6" style="color: ${config.text_color || defaultConfig.text_color}; font-size: ${(config.font_size || defaultConfig.font_size) * 1.5}px;">Shopping Cart (${cart.reduce((sum, item) => sum + item.quantity, 0)} items)</h2>
    
    <div class="space-y-4 mb-8">
      ${cart.map(item => `
        <div class="cart-item flex items-center gap-4 p-6 rounded-xl shadow-md" style="background-color: ${config.surface_color || defaultConfig.surface_color};">
          <div style="font-size: 48px;">${item.image}</div>
          <div class="flex-1">
            <h3 class="cart-item-name font-semibold mb-1" style="color: ${config.text_color || defaultConfig.text_color}; font-size: ${(config.font_size || defaultConfig.font_size) * 1.125}px;">${item.name}</h3>
            <p class="cart-item-price font-bold" style="color: ${config.primary_action_color || defaultConfig.primary_action_color}; font-size: ${config.font_size || defaultConfig.font_size}px;">$${item.price.toFixed(2)} × ${item.quantity}</p>
          </div>
          <div class="flex items-center gap-3">
            <button class="decrease-qty-btn px-4 py-2 rounded-lg font-bold hover:opacity-75 transition-opacity" 
                    data-id="${item.id}"
                    style="background-color: ${config.surface_color || defaultConfig.surface_color}; color: ${config.text_color || defaultConfig.text_color}; border: 2px solid ${config.primary_action_color || defaultConfig.primary_action_color}; font-size: ${(config.font_size || defaultConfig.font_size) * 1.25}px;">−</button>
            <span class="font-bold" style="color: ${config.text_color || defaultConfig.text_color}; font-size: ${(config.font_size || defaultConfig.font_size) * 1.125}px; min-width: 32px; text-align: center;">${item.quantity}</span>
            <button class="increase-qty-btn px-4 py-2 rounded-lg font-bold text-white hover:opacity-90 transition-opacity" 
                    data-id="${item.id}"
                    style="background-color: ${config.primary_action_color || defaultConfig.primary_action_color}; font-size: ${(config.font_size || defaultConfig.font_size) * 1.25}px;">+</button>
            <button class="remove-item-btn px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors ml-2" 
                    data-id="${item.id}"
                    style="color: ${config.secondary_action_color || defaultConfig.secondary_action_color}; font-size: ${(config.font_size || defaultConfig.font_size) * 0.875}px;">Remove</button>
          </div>
        </div>
      `).join('')}
    </div>

    <div class="rounded-xl shadow-lg p-8" style="background-color: ${config.surface_color || defaultConfig.surface_color};">
      <div class="flex justify-between items-center mb-6">
        <span class="font-semibold" style="color: ${config.text_color || defaultConfig.text_color}; font-size: ${(config.font_size || defaultConfig.font_size) * 1.25}px;">Total:</span>
        <span class="font-bold" style="color: ${config.primary_action_color || defaultConfig.primary_action_color}; font-size: ${(config.font_size || defaultConfig.font_size) * 2}px;">$${total.toFixed(2)}</span>
      </div>
      <button id="checkout-btn" class="w-full py-4 text-white rounded-lg font-bold hover:opacity-90 transition-opacity shadow-lg" style="background-color: ${config.primary_action_color || defaultConfig.primary_action_color}; font-size: ${(config.font_size || defaultConfig.font_size) * 1.125}px;">
        ${config.checkout_text || defaultConfig.checkout_text} 💳
      </button>
    </div>
  `;

  document.querySelectorAll('.increase-qty-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const item = cart.find(i => i.id == e.target.dataset.id);
      if (item) {
        item.quantity += 1;
        updateCartBadge();
        renderCartView();
      }
    });
  });

  document.querySelectorAll('.decrease-qty-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const item = cart.find(i => i.id == e.target.dataset.id);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
        updateCartBadge();
        renderCartView();
      }
    });
  });

  document.querySelectorAll('.remove-item-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      cart = cart.filter(item => item.id != e.target.dataset.id);
      updateCartBadge();
      renderCartView();
      showToast('Item removed from cart');
    });
  });

  document.getElementById('checkout-btn').addEventListener('click', showCheckoutConfirmation);
}

function showCheckoutConfirmation() {
  const config = window.elementSdk?.config || defaultConfig;
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-content rounded-2xl shadow-2xl p-8 max-w-md mx-4" style="background-color: ${config.surface_color || defaultConfig.surface_color};">
      <div class="text-center mb-6">
        <div style="font-size: 64px; margin-bottom: 16px;">✅</div>
        <h3 class="font-bold mb-2" style="color: ${config.text_color || defaultConfig.text_color}; font-size: ${(config.font_size || defaultConfig.font_size) * 1.5}px;">Order Confirmed!</h3>
        <p class="opacity-75 mb-4" style="color: ${config.text_color || defaultConfig.text_color}; font-size: ${config.font_size || defaultConfig.font_size}px;">Thank you for your purchase</p>
        <p class="font-bold" style="color: ${config.primary_action_color || defaultConfig.primary_action_color}; font-size: ${(config.font_size || defaultConfig.font_size) * 1.5}px;">Total: $${total.toFixed(2)}</p>
      </div>
      <button id="close-modal-btn" class="w-full py-3 text-white rounded-lg font-medium hover:opacity-90 transition-opacity" style="background-color: ${config.primary_action_color || defaultConfig.primary_action_color}; font-size: ${config.font_size || defaultConfig.font_size}px;">
        Continue Shopping
      </button>
    </div>
  `;

  document.body.appendChild(modal);

  document.getElementById('close-modal-btn').addEventListener('click', () => {
    cart = [];
    updateCartBadge();
    modal.remove();
    toggleView();
  });
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast toast-success';
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 2000);
}

// Initialize
initApp();