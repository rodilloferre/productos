// Configuración
const REPO_URL = 'https://raw.githubusercontent.com/tuusuario/ferreteria-el-rodillo/main/data';
let products = [];
let cart = [];

// Elementos del DOM
const productGrid = document.getElementById('product-grid');
const cartItemsContainer = document.getElementById('cart-items');
const cartCountElement = document.getElementById('cart-count');
const cartTotalElement = document.getElementById('cart-total');

// Cargar productos desde JSON
async function loadProducts() {
    try {
        const response = await fetch(`${REPO_URL}/productos.json`);
        if (!response.ok) throw new Error("Error al cargar productos");
        
        products = await response.json();
        renderProducts(products);
    } catch (error) {
        console.error("Error:", error);
        // Cargar datos de ejemplo si hay error
        loadSampleProducts();
    }
}

// Renderizar productos
function renderProducts(productsToRender) {
    productGrid.innerHTML = '';
    
    productsToRender.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.imageUrl}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <div class="product-stock">Disponibles: ${product.stock}</div>
                <button class="add-to-cart" data-id="${product.id}">Agregar al carrito</button>
            </div>
        `;
        productGrid.appendChild(productCard);
    });

    // Agregar event listeners
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', addToCart);
    });
}

// Función para agregar al carrito
function addToCart(e) {
    const productId = parseInt(e.target.dataset.id);
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        if (existingItem.quantity < product.stock) {
            existingItem.quantity++;
        } else {
            alert('No hay suficiente stock');
            return;
        }
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCart();
}

// Actualizar carrito
function updateCart() {
    // Guardar en localStorage
    localStorage.setItem('elrodillo_cart', JSON.stringify(cart));
    
    // Actualizar UI
    renderCart();
}

// Renderizar carrito
function renderCart() {
    cartCountElement.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalElement.textContent = total.toFixed(2);
    
    cartItemsContainer.innerHTML = '';
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.imageUrl}" class="cart-item-image">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <div>$${(item.price * item.quantity).toFixed(2)}</div>
                <div>
                    <button class="quantity-btn" data-id="${item.id}" data-action="decrease">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" data-id="${item.id}" data-action="increase">+</button>
                </div>
                <button class="remove-btn" data-id="${item.id}">Eliminar</button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });
    
    // Agregar event listeners
    document.querySelectorAll('.quantity-btn').forEach(btn => {
        btn.addEventListener('click', handleQuantityChange);
    });
    
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', removeFromCart);
    });
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    // Cargar carrito desde localStorage
    const savedCart = localStorage.getItem('elrodillo_cart');
    if (savedCart) cart = JSON.parse(savedCart);
    
    loadProducts();
    renderCart();
    
    // Configurar otros event listeners...
fetch('https://raw.githubusercontent.com/rodilloferre/productos/main/data/productos.json')
  .then(response => response.json())
  .then(data => console.log(data));
});
