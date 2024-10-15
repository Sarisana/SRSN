document.addEventListener('DOMContentLoaded', function() {
    // Mengatur loading
    function hideLoading() {
      document.body.classList.add('loaded');
    }
    setTimeout(hideLoading, 1500);
  
    // Menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const navbar = document.getElementById('navbar');
    
    menuToggle.addEventListener('click', () => {
      navbar.classList.toggle('active');
    });
  
    // Inisialisasi keranjang
    const cartButton = document.querySelector('.cart-button');
    const cartPopup = document.querySelector('.cart-popup');
    const closeButton = document.querySelector('.cart-popup .close-popup');
    const cartItems = document.querySelector('#cart-items');
    const totalPriceElement = document.querySelector('#total-price');
    const checkoutButton = document.querySelector('#checkout-btn');
    const cartStatusElement = document.querySelector('#cart-status');
  
    let cart = [];
  
    function updateCart() {
      cartItems.innerHTML = '';
      let total = 0;
      let totalItems = 0;
      cart.forEach((item, index) => {
        const li = document.createElement('li');
        li.classList.add('cart-item');
        li.setAttribute('data-index', index); // Set data-index pada li
        li.innerHTML = `
          <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover;">
          <div class="cart-item-details">
            <div>${item.name}</div>
            <div>Rp. ${item.price.toLocaleString('id-ID')}  </div>
            <div class="cart-item-buttons">
              <button class="decrease" data-index="${index}">-</button>
              <span style="margin: 0 0.5rem;">Jumlah: ${item.quantity}</span>
              <button class="increase" data-index="${index}">+</button>
              <button class="cart-item-remove" data-index="${index}">Hapus</button>
            </div>
          </div>
        `;
        cartItems.appendChild(li);
        total += item.price * item.quantity;
        totalItems += item.quantity;
      });
      totalPriceElement.textContent = `Total: Rp. ${total.toLocaleString('id-ID')}`;
      cartStatusElement.innerHTML = `${totalItems} <i class="fas fa-shopping-cart"></i>`;
    }
  
    function openCartPopup() {
      cartPopup.classList.remove('hide');
      cartPopup.classList.add('show');
    }
  
    function closeCartPopup() {
      cartPopup.classList.remove('show');
      cartPopup.classList.add('hide');
    }
  
    function removeItem(index) {
      cart.splice(index, 1);
      updateCart();
    }
  
    cartButton.addEventListener('click', openCartPopup);
    closeButton.addEventListener('click', closeCartPopup);
  
    // Penanganan tombol add-to-cart
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
      button.addEventListener('click', () => {
        const name = button.getAttribute('data-name');
        const price = parseInt(button.getAttribute('data-price'));
        const image = button.getAttribute('data-image');
        const quantity = 1;
  
        // Validasi input
        if (isNaN(price) || price < 0 || quantity < 1) {
          console.error('Harga atau kuantitas tidak valid.');
          return;
        }
  
        const existingItem = cart.find(item => item.name === name);
        if (existingItem) {
          existingItem.quantity++;
        } else {
          cart.push({ name, price, quantity, image });
        }
        updateCart();
      });
    });
  
    // Penanganan klik di keranjang
    cartItems.addEventListener('click', (event) => {
      const target = event.target;
      const index = parseInt(target.getAttribute('data-index'));
      if (isNaN(index)) return;
  
      if (target.classList.contains('increase')) {
        cart[index].quantity++;
      } else if (target.classList.contains('decrease')) {
        if (cart[index].quantity > 1) {
          cart[index].quantity--;
        }
      } else if (target.classList.contains('cart-item-remove')) {
        removeItem(index);
      }
      updateCart();
    });
  
    // Penanganan checkout
    checkoutButton.addEventListener('click', () => {
      const cartMessage = cart.map(item => 
        `${item.name} - Rp. ${item.price.toLocaleString('id-ID')} x ${item.quantity}`
      ).join('\n');
      const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
      const message = encodeURIComponent(`Keranjang Saya:\n${cartMessage}\n\nTotal: Rp. ${totalPrice.toLocaleString('id-ID')}`);
      window.location.href = `https://wa.me/+6285179590346?text=${message}`;
    });
  
    // Penanganan form pemesanan
    document.getElementById('orderForm').addEventListener('submit', (event) => {
      event.preventDefault(); // Mencegah pengiriman form default
  
      const headSize = document.getElementById('head-size').value;
      const color = document.getElementById('color').value;
      const pattern = document.getElementById('pattern').value;
      const type = document.getElementById('type').value;
      const note = document.getElementById('note').value;
  
      const itemName = `Udeng Kostum || Ukuran: ${headSize}cm - Warna: ${color} - Motif: ${pattern} - Tipe: ${type} || Note: ${note}`;
      const itemPrice = 0
      const itemPriceNote = 'Harga ini adalah harga khusus untuk pelanggan setia.';
      const itemImage = 'asset/Produk/Contoh Udeng.jpg'; // Ganti dengan gambar sesuai kebutuhan
  
      // Tambahkan item ke keranjang
      cart.push({ name: itemName, price: itemPrice, quantity: 1, image: itemImage });
      updateCart();
  
      // Reset form setelah data ditambahkan ke keranjang
      document.getElementById('orderForm').reset();
    });
  });
  