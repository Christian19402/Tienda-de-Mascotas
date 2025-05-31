document.addEventListener('DOMContentLoaded', function() {
    // Variables
    const cartIcon = document.querySelector('.cart-icon');
    const cartCount = document.querySelector('.cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const totalAmount = document.getElementById('total-amount');
    const checkoutBtn = document.getElementById('checkout-btn');
    const cartModal = document.getElementById('cart-modal');
    const closeCart = document.getElementById('close-cart');
    const modalCartItems = document.getElementById('modal-cart-items');
    const modalCartTotal = document.getElementById('modal-cart-total');
    const modalTotalAmount = document.getElementById('modal-total-amount');
    const modalCheckoutBtn = document.getElementById('modal-checkout-btn');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Actualizar carrito al cargar la página
    updateCart();

    // Event listeners
    cartIcon.addEventListener('click', openCartModal);
    closeCart.addEventListener('click', closeCartModal);
    checkoutBtn.addEventListener('click', checkout);
    modalCheckoutBtn.addEventListener('click', checkout);

    // Añadir productos al carrito
    addToCartButtons.forEach(button => {
        button.addEventListener('click', addToCart);
    });

    // Funciones
    function addToCart(event) {
        const button = event.target;
        const id = button.getAttribute('data-id');
        const name = button.getAttribute('data-name');
        const price = parseFloat(button.getAttribute('data-price'));
        const image = button.getAttribute('data-image');

        // Verificar si el producto ya está en el carrito
        const existingItem = cart.find(item => item.id === id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id,
                name,
                price,
                image,
                quantity: 1
            });
        }

        // Guardar en localStorage y actualizar
        saveCart();
        updateCart();

        // Efecto visual
        button.textContent = '✓ Añadido';
        button.style.backgroundColor = '#4ECDC4';
        setTimeout(() => {
            button.textContent = 'Añadir al carrito';
            button.style.backgroundColor = '';
        }, 1000);

        // Animación del icono del carrito
        cartIcon.style.transform = 'scale(1.2)';
        setTimeout(() => {
            cartIcon.style.transform = '';
        }, 300);
    }

    function updateCart() {

        
        // Actualizar contador
        const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = itemCount;

        // Actualizar aside y modal del carrito
        renderCartItems(cartItems, false);
        renderCartItems(modalCartItems, true);

        // Actualizar totales
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        totalAmount.textContent = `$${total.toFixed(2)}`;
        modalTotalAmount.textContent = `$${total.toFixed(2)}`;

        // Mostrar/ocultar elementos según haya items
        if (cart.length > 0) {
            cartTotal.style.display = 'flex';
            checkoutBtn.style.display = 'block';
            modalCartTotal.style.display = 'flex';
            modalCheckoutBtn.style.display = 'block';
        } else {
            cartTotal.style.display = 'none';
            checkoutBtn.style.display = 'none';
            modalCartTotal.style.display = 'none';
            modalCheckoutBtn.style.display = 'none';
        }
    }

    function renderCartItems(container, isModal) {
        // Limpiar contenedor
        container.innerHTML = '';

        if (cart.length === 0) {
            container.innerHTML = '<p class="empty-cart">Tu carrito está vacío</p>';
            return;
        }

        cart.forEach(item => {
            const cartItemElement = document.createElement('div');
            cartItemElement.className = 'cart-item';
            cartItemElement.innerHTML = `
                <div class="cart-item-info">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p>$${item.price.toFixed(2)}</p>
                    </div>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-control">
                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    </div>
                    <button class="remove-item" data-id="${item.id}">🗑️</button>
                </div>
            `;
            container.appendChild(cartItemElement);
        });

        // Agregar event listeners a los nuevos botones
        container.querySelectorAll('.quantity-btn.minus').forEach(button => {
            button.addEventListener('click', decreaseQuantity);
        });

        container.querySelectorAll('.quantity-btn.plus').forEach(button => {
            button.addEventListener('click', increaseQuantity);
        });

        container.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', removeItem);
        });
    }

    function decreaseQuantity(event) {
        const id = event.target.getAttribute('data-id');
        const item = cart.find(item => item.id === id);

        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            cart = cart.filter(item => item.id !== id);
        }

        saveCart();
        updateCart();
    }

    function increaseQuantity(event) {
        const id = event.target.getAttribute('data-id');
        const item = cart.find(item => item.id === id);
        item.quantity += 1;

        saveCart();
        updateCart();
    }

    function removeItem(event) {
        const id = event.target.getAttribute('data-id');
        cart = cart.filter(item => item.id !== id);

        saveCart();
        updateCart();
    }

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function openCartModal() {
        cartModal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeCartModal() {
        cartModal.classList.remove('open');
        document.body.style.overflow = '';
    }

    // Función para disparar confeti desde los costados
    function launchConfetti() {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { x: 0, y: 0.6 }, // Desde el lado izquierdo
            colors: ['#FF6B6B', '#4ECDC4', '#FFE66D'],
            angle: 45
        });

        confetti({
            particleCount: 100,
            spread: 70,
            origin: { x: 1, y: 0.6 }, // Desde el lado derecho
            colors: ['#FF6B6B', '#4ECDC4', '#FFE66D'],
            angle: 135
        });
    }

    function checkout() {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
        
        // Mostrar el modal de confirmación
        const confirmationModal = document.getElementById('confirmation-modal');
        const confirmationTotal = document.getElementById('confirmation-total');
        confirmationTotal.textContent = `$${total}`;
        confirmationModal.classList.add('open');
        document.body.style.overflow = 'hidden';

        // Lanzar confeti
        launchConfetti();
        setTimeout(launchConfetti, 500); // Repetir para más impacto

        // Limpiar carrito
        cart = [];
        saveCart();
        updateCart();
        closeCartModal();
    }

    // Abrir y cerrar modal de confirmación
    document.getElementById('close-confirmation').addEventListener('click', closeConfirmationModal);
    document.getElementById('continue-shopping').addEventListener('click', closeConfirmationModal);
    document.getElementById('confirmation-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeConfirmationModal();
        }
    });

    function closeConfirmationModal() {
        const confirmationModal = document.getElementById('confirmation-modal');
        confirmationModal.classList.remove('open');
        document.body.style.overflow = '';
    }

    // Cerrar modal al hacer clic fuera
    cartModal.addEventListener('click', function(e) {
        if (e.target === cartModal) {
            closeCartModal();
        }
    });

});