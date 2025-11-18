// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

mobileMenuBtn.addEventListener('click', function() {
  mobileMenu.classList.toggle('active');
});

// Close mobile menu when a link is clicked
const navLinks = document.querySelectorAll('.nav-menu.mobile .nav-link');
navLinks.forEach(link => {
  link.addEventListener('click', function() {
    mobileMenu.classList.remove('active');
  });
});

// Smooth scroll for all navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Add scroll event for sticky header styling
window.addEventListener('scroll', function() {
  const header = document.querySelector('.header');
  if (window.scrollY > 50) {
    header.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
  } else {
    header.style.boxShadow = 'none';
  }
});

// Scroll animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate');
    }
  });
}, observerOptions);

// Load menu functionality
// Dynamic menu display with search and filter functionality

// Fallback product data in case JSON file cannot be loaded
const fallbackProducts = [
  {
    "id": 1,
    "name": "Cireng Isi Ayam Pedas Keju",
    "description": "Kombinasi sempurna ayam pedas dengan keju mozza yang gurih. Cocok untuk pencinta pedas!",
    "price": 15000,
    "category": "pedas",
    "image": "pictures/crispy-cireng-isi-ayam-pedas-keju.jpg"
  },
  {
    "id": 2,
    "name": "Cireng Crispy Original",
    "description": "Renyah di luar, kenyal di dalam. Cita rasa klasik yang disukai semua kalangan usia.",
    "price": 12000,
    "category": "original",
    "image": "pictures/golden-crispy-original-cireng.jpg"
  },
  {
    "id": 3,
    "name": "Cireng Salju",
    "description": "Dibalut dengan kulit jagung berwarna putih, memberikan tekstur yang unik dan menarik.",
    "price": 13000,
    "category": "manis",
    "image": "pictures/white-powdered-salju-cireng-snack.jpg"
  },
  {
    "id": 4,
    "name": "Paket Mix Hemat",
    "description": "Rasakan semua varian kami dalam satu paket hemat. Sempurna untuk acara atau berbagi!",
    "price": 40000,
    "category": "paket",
    "image": "pictures/assorted-crispy-snacks-combo-pack.jpg"
  },
  {
    "id": 5,
    "name": "Cireng Jagung Keju",
    "description": "Cireng dengan isian jagung manis dan keju yang leleh. Gurih dan nikmat!",
    "price": 14000,
    "category": "keju",
    "image": "pictures/cheesy-corn-cireng.jpg"
  },
  {
    "id": 6,
    "name": "Cireng Isi Sosis",
    "description": "Cireng gurih dengan isian sosis lembut. Cocok untuk camilan anak-anak.",
    "price": 13500,
    "category": "anak",
    "image": "pictures/sosis-cireng.jpg"
  },
  {
    "id": 7,
    "name": "Cireng Rasa Udang",
    "description": "Cireng dengan perisa udang yang gurih dan nikmat. Alternatif rasa yang unik.",
    "price": 14500,
    "category": "seafood",
    "image": "pictures/shrimp-flavored-cireng.jpg"
  },
  {
    "id": 8,
    "name": "Cireng Isi Telur",
    "description": "Cireng lembut dengan isian telur yang gurih. Penuh protein!",
    "price": 15500,
    "category": "protein",
    "image": "pictures/egg-filled-cireng.jpg"
  }
];

// Load products data
async function loadProducts() {
  try {
    const response = await fetch('products.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const products = await response.json();
    console.log('Products loaded successfully from JSON:', products); // Debug log
    return products;
  } catch (error) {
    console.warn('Error loading products from JSON, using fallback data:', error);
    console.log('Using fallback products:', fallbackProducts); // Debug log
    return fallbackProducts;
  }
}

// Render products to HTML
function renderProducts(products) {
  const menuGrid = document.querySelector('.menu-grid');
  if (!menuGrid) {
    console.error('Menu grid not found');
    return;
  }

  // Remove loading placeholder
  const loadingPlaceholder = menuGrid.querySelector('.loading-placeholder');
  if (loadingPlaceholder) {
    loadingPlaceholder.remove();
  }

  // Clear existing product cards and no-products message
  const existingCards = menuGrid.querySelectorAll('.menu-card, .no-products');
  existingCards.forEach(card => card.remove());

  if (products.length === 0) {
    const noProductsMsg = document.createElement('p');
    noProductsMsg.className = 'no-products';
    noProductsMsg.textContent = 'Tidak ada produk ditemukan';
    menuGrid.appendChild(noProductsMsg);
    return;
  }

  products.forEach(product => {
    const productCard = document.createElement('div');
    productCard.className = 'menu-card slide-in-up';

    // Format price to IDR
    const formattedPrice = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(product.price);

    productCard.innerHTML = `
      <div class="menu-image">
        <img src="${product.image}" alt="${product.name}" onerror="this.onerror=null;this.src='pictures/sampul.jpg';this.classList.add('error');">
      </div>
      <div class="menu-content">
        <h4>${product.name}</h4>
        <p>${product.description}</p>
        <div class="menu-footer">
          <span class="price">${formattedPrice}</span>
          <button class="arrow-btn" onclick="addToCart(${product.id})">→</button>
        </div>
      </div>
    `;

    menuGrid.appendChild(productCard);
  });
  
  // Add newly created menu cards to the observer
  const newCards = menuGrid.querySelectorAll('.menu-card.slide-in-up');
  newCards.forEach(card => {
    observer.observe(card);
  });

  // Log to confirm products were added
  console.log('Products added to DOM, total:', menuGrid.querySelectorAll('.menu-card').length);
  
  // Additional debug: check if products are in the right place
  console.log('Menu grid contents:', menuGrid.innerHTML.substring(0, 500) + '...');
}

// Filter products by search query and category
function filterProducts(products, searchTerm = '', category = 'all') {
  return products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = category === 'all' || product.category === category;

    return matchesSearch && matchesCategory;
  });
}

// Initialize search and filter functionality
async function initMenu() {
  console.log('Initializing menu...'); // Debug log
  const products = await loadProducts();

  // Get existing search and filter elements
  const searchInput = document.getElementById('searchInput');
  const categoryFilter = document.getElementById('categoryFilter');

  if (!searchInput || !categoryFilter) {
    console.error('Search input or category filter not found');
    return;
  }

  function applyFilters() {
    const searchTerm = searchInput.value.trim();
    const selectedCategory = categoryFilter.value;
    console.log('Applying filters:', { searchTerm, selectedCategory }); // Debug log
    const filteredProducts = filterProducts(products, searchTerm, selectedCategory);
    console.log('Filtered products:', filteredProducts); // Debug log
    renderProducts(filteredProducts);
  }

  searchInput.addEventListener('input', applyFilters);
  categoryFilter.addEventListener('change', applyFilters);

  // Initial render
  console.log('Rendering initial products:', products); // Debug log
  renderProducts(products);
}

// Add to cart function (placeholder)
function addToCart(productId) {
  // In a real implementation, you would add to cart
  // For now, just show an alert
  alert(`Produk ID ${productId} ditambahkan ke keranjang!`);
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize scroll animations
  const animatedElements = document.querySelectorAll(
    '.fade-in, .slide-in-left, .slide-in-right, .slide-in-up'
  );

  animatedElements.forEach(el => {
    observer.observe(el);
  });

  // Initialize menu functionality
  console.log('DOM loaded, initializing menu...'); // Debug log
  // Use setTimeout to ensure all elements are ready
  setTimeout(() => {
    initMenu();
  }, 100);
});