/* Pakkathu Kadai — Cart Helpers */
"use strict";

window.PakkathuCart = (() => {
  function getStock(product) {
    const stock = Number(product?.quantity);
    return Number.isFinite(stock) ? Math.max(0, stock) : 0;
  }

  function getQuantity(cart, productId) {
    return Math.max(0, Number(cart[String(productId)]) || 0);
  }

  function canIncrease(cart, product) {
    if (!product || product.id == null) return false;

    const price = Number(product.price);
    if (!Number.isFinite(price) || price < 0) return false;

    return getQuantity(cart, product.id) < getStock(product);
  }

  function getTotal(cart, products) {
    return Object.entries(cart).reduce((total, [id, quantity]) => {
      const product = products.find(
        item => String(item.id) === String(id)
      );

      if (!product) return total;

      const qty = Number(quantity);
      const price = Number(product.price);

      if (
        Number.isInteger(qty) &&
        qty > 0 &&
        Number.isFinite(price) &&
        price >= 0
      ) {
        return total + price * qty;
      }

      return total;
    }, 0);
  }

  return {
    getStock,
    getQuantity,
    canIncrease,
    getTotal
  };
})();
