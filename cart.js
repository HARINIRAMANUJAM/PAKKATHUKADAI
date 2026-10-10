
/*
 * Pakkathu Kadai — Shopping Cart
 * Save as cart.js beside index.html.
 *
 * Integration note:
 * This script expects product cards to expose:
 *   data-product-id, data-product-name,
 *   data-product-price, data-product-stock
 * and buttons with data-add-to-cart.
 *
 * Connect these attributes to your existing product cards
 * before enabling the cart.
 */

(() => {
  "use strict";

  const cart = new Map();

  function money(value) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR"
    }).format(value);
  }

  function getProductFromButton(button) {
    const card = button.closest("[data-product-id]");

    if (!card) return null;

    const id = card.dataset.productId;
    const name = card.dataset.productName;
    const price = Number(card.dataset.productPrice);
    const stock = Number(card.dataset.productStock ?? Infinity);

    if (
      !id ||
      !name ||
      !Number.isFinite(price) ||
      price < 0 ||
      Number.isNaN(stock) ||
      stock < 0
    ) {
      console.error("Missing or invalid product data:", card);
      return null;
    }

    return { id, name, price, stock };
  }

  function renderCart() {
    const countElement = document.getElementById("cart-count");
    const totalElement = document.getElementById("cart-total");
    const itemsElement = document.getElementById("cart-items");

    let count = 0;
    let total = 0;

    cart.forEach(item => {
      count += item.quantity;
      total += item.price * item.quantity;
    });

    if (countElement) countElement.textContent = String(count);
    if (totalElement) totalElement.textContent = money(total);

    if (!itemsElement) return;

    itemsElement.replaceChildren();

    if (cart.size === 0) {
      const empty = document.createElement("p");
      empty.textContent = "Your cart is empty.";
      itemsElement.appendChild(empty);
      return;
    }

    cart.forEach(item => {
      const row = document.createElement("div");
      row.className = "cart-item";

      const details = document.createElement("div");

      const name = document.createElement("strong");
      name.textContent = item.name;

      const subtotal = document.createElement("p");
      subtotal.textContent =
        `${money(item.price)} × ${item.quantity} = ` +
        money(item.price * item.quantity);

      details.append(name, subtotal);

      const controls = document.createElement("div");

      const minus = document.createElement("button");
      minus.type = "button";
      minus.textContent = "−";
      minus.setAttribute("aria-label", `Remove one ${item.name}`);
      minus.addEventListener("click", () => {
        updateQuantity(item.id, -1);
      });

      const quantity = document.createElement("span");
      quantity.textContent = ` ${item.quantity} `;

      const plus = document.createElement("button");
      plus.type = "button";
      plus.textContent = "+";
      plus.disabled = item.quantity >= item.stock;
      plus.setAttribute("aria-label", `Add one ${item.name}`);
      plus.addEventListener("click", () => {
        updateQuantity(item.id, 1);
      });

      controls.append(minus, quantity, plus);
      row.append(details, controls);
      itemsElement.appendChild(row);
    });
  }

  function updateQuantity(id, change) {
    const item = cart.get(id);
    if (!item) return;

    const next = item.quantity + change;

    if (next <= 0) {
      cart.delete(id);
    } else if (next <= item.stock) {
      item.quantity = next;
    }

    renderCart();
  }

  document.addEventListener("click", event => {
    const button = event.target.closest("[data-add-to-cart]");
    if (!button) return;

    const product = getProductFromButton(button);
    if (!product) {
      alert("This product needs its details connected to the cart.");
      return;
    }

    const existing = cart.get(product.id);
    const nextQuantity = (existing?.quantity || 0) + 1;

    if (nextQuantity > product.stock) {
      alert("Sorry, this is the available stock limit.");
      return;
    }

    cart.set(product.id, {
      ...product,
      quantity: nextQuantity
    });

    renderCart();
  });

  document.addEventListener("DOMContentLoaded", renderCart);
  renderCart();
})();
