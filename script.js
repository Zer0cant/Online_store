// --- SUPABASE INITIALIZATION SECTION (FIXED for CDN) ---

// 1. TANGGALIN ang "import { createClient } from '@supabase/supabase-js';"
//    Dahil ginamit mo ang <script src="...supabase-js@2"></script> sa HTML,
//    ang createClient ay available sa global variable na 'supabase'.

// Kukunin ang URL at Key. Kailangan itong i-hardcode sa ganitong setup.
// IYONG Supabase Project URL:
const supabaseUrl = 'https://puqitqdcrcrezwkonjkro.supabase.co'; // !!! PALITAN ITO !!! (Project URL)
// IYONG Supabase Anon/Publishable Key:
const supabaseKey = 'IYONG_PUBLISHABLE_KEY_DITO'; // !!! PALITAN ITO !!! (Anon/Publishable Key)

// I-initialize ang Supabase client gamit ang global object (depende sa CDN version, gagamitin natin ang 'window.supabase')
// Tiyakin na ang CDN script ay nauna sa HTML!
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
// ---------------------------------------------

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

// 1. Initialize referenceProducts as an empty array (changed from const to let)
let referenceProducts = [];

// --- MODIFIED SECTION START: SUPABASE FETCH ---
// 2. Add function to fetch data from Supabase
async function fetchProducts() {
  try {
    // Ang code na ito ang hahalili sa pagtawag sa 'get_products.php'
    const { data, error } = await supabase
      .from('products') // Dapat TAMA ang table name
      .select('*');

    if (error) {
      // Magpapakita ng error kung may problema sa RLS o koneksyon
      throw new Error(`Supabase error: ${error.message}`);
    }

    // Tiyakin na ang data ay isang array bago i-map
    if (Array.isArray(data)) {
      // I-map ang data para tiyakin na number ang price
      referenceProducts = data.map(item => ({
        ...item,
        price: parseFloat(item.price) 
      }));
    } else {
      referenceProducts = []; // Kung walang data, gawing empty array
    }

    // Re-render the shop view now that we have data
    renderShopView();
    
    console.log("Products loaded from Supabase:", referenceProducts);
  } catch (error) {
    console.error('Error fetching products from Supabase:', error);
    showToast('Error connecting to Supabase. Check RLS policies or keys.');
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
      mapToCapabilities: (config) => new Map([
        // ... (Code for mapToCapabilities remains the same)
      ]),
      mapToEditPanelValues: (config) => new Map([
        // ... (Code for mapToEditPanelValues remains the same)
      ])
    });
  }

  // 3. Render the app structure first
  renderApp();
  
  // 4. Then fetch the products from Supabase
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

// ... (The rest of the functions: renderShopView, renderProducts, addToCart, updateCartBadge, toggleView, renderCartView, showCheckoutConfirmation, showToast remain the same)

// Initialize
initApp();