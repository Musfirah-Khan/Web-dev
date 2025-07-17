// script.js

document.addEventListener("DOMContentLoaded", () => {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let likedItems = JSON.parse(localStorage.getItem("likedItems")) || {};

  const cartDisplay = document.querySelector(".floating-cart span");
  updateCartDisplay();

  const cartButtons = document.querySelectorAll(".cart-btn");
  const heartIcons = document.querySelectorAll(".fa-heart");

  // ========== Add to Cart ==========
  cartButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      const product = getProductDetails(button);
      cart.push(product);
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartDisplay();
    });
  });

  function getProductDetails(button) {
    const card = button.closest(".card");
    return {
      title: card.querySelector("h3").textContent,
      price: card.querySelector(".price").textContent,
      image: card.querySelector("img").src
    };
  }

  function updateCartDisplay() {
    const count = cart.length;
    cartDisplay.textContent = count === 0
      ? "Your cart is empty"
      : `${count} item${count > 1 ? "s" : ""} in cart`;
  }

  // ========== Like/Favorite Products ==========
  heartIcons.forEach((icon, index) => {
    const productId = `product-${index}`;
    const isLiked = likedItems[productId];

    if (isLiked) {
      icon.classList.remove("fa-regular");
      icon.classList.add("fa-solid");
      icon.style.color = "#e11d48";
    }

    icon.addEventListener("click", () => {
      const liked = icon.classList.toggle("fa-solid");
      icon.classList.toggle("fa-regular");
      icon.style.color = liked ? "#e11d48" : "#6b7280";

      likedItems[productId] = liked;
      localStorage.setItem("likedItems", JSON.stringify(likedItems));
    });
  });

  // ========== Cart Popup ==========
  const floatingCart = document.querySelector(".floating-cart");
  floatingCart.style.cursor = "pointer";
  floatingCart.addEventListener("click", () => {
    showCartModal();
  });

  function showCartModal() {
    const modal = document.createElement("div");
    modal.className = "cart-modal";
    modal.innerHTML = `
      <div class="cart-content">
        <h3>Your Cart</h3>
        <button class="close-btn">×</button>
        <ul class="cart-items">
          ${cart.map(item => `
            <li>
              <img src="${item.image}" alt="${item.title}" />
              <div>
                <p><strong>${item.title}</strong></p>
                <p>${item.price}</p>
              </div>
            </li>
          `).join('')}
        </ul>
        <button class="clear-cart">Clear Cart</button>
      </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector(".close-btn").onclick = () => modal.remove();

    modal.querySelector(".clear-cart").onclick = () => {
      cart = [];
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartDisplay();
      modal.remove();
    };
  }

  // Optional: Escape modal with ESC key
  window.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      const modal = document.querySelector(".cart-modal");
      if (modal) modal.remove();
    }
  });
});
