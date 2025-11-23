const supabaseUrl = 'https://puqitqdcrcrezwkonjkro.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1cWl0cWRyY3Jlendrb25qa3JvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5MDYzNzcsImV4cCI6MjA3OTQ4MjM3N30.Z2NuUy9svkfbaSuCuQYO-Enh8pkjOErfC5ud_Y1Ups4'; 

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

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

let referenceProducts = [];

async function fetchProducts() {
  try {
    const { data, error } = await supabase
      .from('products') 
      .select('*');

    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }

    if (Array.isArray(data)) {
      referenceProducts = data.map(item => ({
        ...item,
        price: parseFloat(item.price) 
      }));
    } else {
      referenceProducts = [];
    }

    renderShopView();
    
    console.log("Products loaded from Supabase:", referenceProducts);
  } catch (error) {
    console.error('Error fetching products from Supabase:', error);
    showToast('Error connecting to Supabase. Check RLS policies or keys.');
  }
}

let cart = [];
let currentCategory = "All";
let currentView = "shop";

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
      mapToCapabilities: (config) => new Map([
        // ... (Code for mapToCapabilities remains the same)
      ]),
      mapToEditPanelValues: (config) => new Map([
        // ... (Code for mapToEditPanelValues remains the same)
      ])
    });
  }

  renderApp();
  
  await fetchProducts();
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
  renderShopView();
}

function renderShopView() {
  const config = window.elementSdk?.config || defaultConfig;
  const shopView = document.getElementById('shop-view');
  
  if (!shopView) return;

  const categories = ['All', ...new Set(referenceProducts.map(p => p.category))];

  const filterHtml = `
    <div class="flex flex-wrap gap-4 mb-8">
      ${categories.map(category => `
        <button class="filter-btn px-4 py-2 rounded-full font-medium shadow-md hover:opacity-90 transition-all ${currentCategory === category ? 'active text-white' : 'text-gray-700'}" 
          style="background-color: ${currentCategory === category ? config.primary_action_color || defaultConfig.primary_action_color : config.surface_color || defaultConfig.surface_color}; font-size: ${(config.font_size || defaultConfig.font_size) * 1.125}px;"
          onclick="filterProducts('${category}')">
          ${category}
        </button>
      `).join('')}
    </div>
  `;

  const productsToDisplay = currentCategory === 'All'
    ? referenceProducts
    : referenceProducts.filter(p => p.category === currentCategory);

  const productsHtml = productsToDisplay.length > 0
    ? `<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      ${productsToDisplay.map(renderProductCard).join('')}
      </div>`
    : `<p class="text-center text-gray-500" style="font-size: ${config.font_size || defaultConfig.font_size}px;">No products found in this category.</p>`;
  
  shopView.innerHTML = filterHtml + productsHtml;
  updateCartBadge();
}

function renderProductCard(product) {
  const config = window.elementSdk?.config || defaultConfig;
  const baseSize = config.font_size || defaultConfig.font_size;
  const customFont = config.font_family || defaultConfig.font_family;
  const baseFontStack = 'system-ui, -apple-system, sans-serif';

  return `
    <div class="product-card rounded-xl shadow-xl overflow-hidden flex flex-col p-6" style="background-color: ${config.surface_color || defaultConfig.surface_color};">
      ${product.image ? `<img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover rounded-lg mb-4"/>` : ''}
      <div class="flex-1">
        <h3 class="product-title font-bold mb-2" style="color: ${config.text_color || defaultConfig.text_color}; font-size: ${baseSize * 1.125}px; font-family: ${customFont}, ${baseFontStack};">${product.name}</h3>
        <p class="product-desc text-sm mb-4 opacity-80" style="color: ${config.text_color || defaultConfig.text_color}; font-size: ${baseSize * 0.875}px; font-family: ${customFont}, ${baseFontStack};">${product.description}</p>
      </div>
      <div class="flex justify-between items-center mt-4">
        <span class="product-price font-bold" style="color: ${config.primary_action_color || defaultConfig.primary_action_color}; font-size: ${baseSize * 1.25}px; font-family: ${customFont}, ${baseFontStack};">$${product.price.toFixed(2)}</span>
        <button class="add-to-cart-btn px-4 py-2 text-white rounded-lg font-medium hover:opacity-90 transition-all" 
          style="background-color: ${config.primary_action_color || defaultConfig.primary_action_color}; font-size: ${baseSize}px; font-family: ${customFont}, ${baseFontStack};"
          onclick="addToCart(${product.id})">
          Add to Cart
        </button>
      </div>
    </div>
  `;
}

function filterProducts(category) {
  currentCategory = category;
  renderShopView();
}

function addToCart(productId) {
  const product = referenceProducts.find(p => p.id === productId);
  if (product) {
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    updateCartBadge();
    showToast(`${product.name} added to cart!`);
  }
}

function removeFromCart(productId) {
  const initialLength = cart.length;
  cart = cart.filter(item => item.id !== productId);
  
  if (cart.length < initialLength) {
    renderCartView();
    updateCartBadge();
    showToast('Item removed from cart.');
  }
}

function updateCartItemQuantity(productId, change) {
  const item = cart.find(item => item.id === productId);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      removeFromCart(productId);
    } else {
      renderCartView();
      updateCartBadge();
    }
  }
}

function updateCartBadge() {
  const cartBadge = document.getElementById('cart-badge');
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (cartBadge) {
    cartBadge.textContent = totalItems;
    cartBadge.style.display = totalItems > 0 ? 'block' : 'none';
  }
}

function toggleView() {
  currentView = currentView === 'shop' ? 'cart' : 'shop';
  const shopView = document.getElementById('shop-view');
  const cartView = document.getElementById('cart-view');

  if (currentView === 'cart') {
    shopView.style.display = 'none';
    cartView.style.display = 'block';
    renderCartView();
    document.querySelector('.cart-btn-text').textContent = 'Back to Shop';
  } else {
    shopView.style.display = 'block';
    cartView.style.display = 'none';
    document.querySelector('.cart-btn-text').textContent = (window.elementSdk?.config || defaultConfig).view_cart_text || defaultConfig.view_cart_text;
  }
}

function renderCartView() {
  const config = window.elementSdk?.config || defaultConfig;
  const cartView = document.getElementById('cart-view');
  const baseSize = config.font_size || defaultConfig.font_size;
  const customFont = config.font_family || defaultConfig.font_family;
  const baseFontStack = 'system-ui, -apple-system, sans-serif';

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalDisplay = total.toFixed(2);

  if (cart.length === 0) {
    cartView.innerHTML = `<h2 class="text-2xl font-bold mb-4" style="color: ${config.text_color || defaultConfig.text_color}; font-size: ${baseSize * 1.5}px;">Your Cart is Empty 🛒</h2>`;
    return;
  }

  const cartItemsHtml = cart.map(item => `
    <div class="cart-item flex justify-between items-center p-4 border-b last:border-b-0" style="border-bottom-color: ${config.secondary_action_color || defaultConfig.secondary_action_color}50;">
      <div class="flex-1">
        <h4 class="cart-item-name font-medium" style="color: ${config.text_color || defaultConfig.text_color}; font-size: ${baseSize * 1.125}px; font-family: ${customFont}, ${baseFontStack};">${item.name}</h4>
        <span class="cart-item-price text-sm" style="color: ${config.primary_action_color || defaultConfig.primary_action_color}; font-size: ${baseSize}px; font-family: ${customFont}, ${baseFontStack};">$${item.price.toFixed(2)} each</span>
      </div>
      <div class="flex items-center gap-4">
        <div class="flex items-center border rounded-lg" style="border-color: ${config.secondary_action_color || defaultConfig.secondary_action_color};">
          <button class="px-3 py-1 text-lg font-bold" onclick="updateCartItemQuantity(${item.id}, -1)">-</button>
          <span class="px-3" style="font-size: ${baseSize * 1.125}px;">${item.quantity}</span>
          <button class="px-3 py-1 text-lg font-bold" onclick="updateCartItemQuantity(${item.id}, 1)">+</button>
        </div>
        <span class="font-bold w-20 text-right" style="color: ${config.primary_action_color || defaultConfig.primary_action_color}; font-size: ${baseSize * 1.25}px;">$${(item.price * item.quantity).toFixed(2)}</span>
        <button class="remove-item-btn text-sm opacity-70 hover:opacity-100 transition-all" 
          style="color: ${config.secondary_action_color || defaultConfig.secondary_action_color}; font-size: ${baseSize * 0.875}px; font-family: ${customFont}, ${baseFontStack};"
          onclick="removeFromCart(${item.id})">
          (Remove)
        </button>
      </div>
    </div>
  `).join('');

  cartView.innerHTML = `
    <h2 class="text-3xl font-bold mb-6" style="color: ${config.text_color || defaultConfig.text_color}; font-size: ${baseSize * 1.75}px;">Shopping Cart</h2>
    <div class="bg-white rounded-xl shadow-2xl p-6">
      <div class="divide-y divide-gray-200">
        ${cartItemsHtml}
      </div>
      <div class="mt-6 flex justify-end items-center">
        <span class="text-2xl font-bold mr-4" style="color: ${config.text_color || defaultConfig.text_color}; font-size: ${baseSize * 1.5}px;">Total:</span>
        <span class="text-3xl font-extrabold" style="color: ${config.primary_action_color || defaultConfig.primary_action_color}; font-size: ${baseSize * 2}px;">$${totalDisplay}</span>
      </div>
      <div class="mt-6 flex justify-end">
        <button id="checkout-btn" class="px-8 py-3 text-white rounded-full font-bold shadow-lg hover:opacity-90 transition-all" 
          style="background-color: ${config.primary_action_color || defaultConfig.primary_action_color}; font-size: ${baseSize * 1.125}px; font-family: ${customFont}, ${baseFontStack};"
          onclick="showCheckoutConfirmation()">
          ${config.checkout_text || defaultConfig.checkout_text}
        </button>
      </div>
    </div>
  `;
}

function showCheckoutConfirmation() {
  if (window.dataSdk) {
    window.dataSdk.postData({
      type: 'checkout_request',
      cart: cart,
      total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    });
    showToast('Checkout requested. Check your data handler for the order.');
  } else {
    showToast('Checkout functionality requires the Data SDK.', 'error');
  }
}

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  const config = window.elementSdk?.config || defaultConfig;
  
  const bgColor = type === 'success' ? config.primary_action_color || defaultConfig.primary_action_color : '#ef4444';
  
  toast.className = 'fixed bottom-5 right-5 px-6 py-3 text-white rounded-lg shadow-xl transition-opacity duration-300 z-50';
  toast.style.backgroundColor = bgColor;
  toast.style.opacity = '0';
  toast.textContent = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '1';
  }, 10);

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 3000);
}

// Initialize
initApp();