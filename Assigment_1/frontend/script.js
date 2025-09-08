const apiUrl = "http://localhost:8080/api/items";

// Load items with filters
function loadItems() {
  const category = document.getElementById("categoryFilter").value;
  const price = document.getElementById("priceFilter").value;

  let url = apiUrl;
  let params = [];
  if (category) params.push("category=" + category);
  if (price) params.push("price=" + price);
  if (params.length > 0) url += "?" + params.join("&");

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      let html = "";
      if (data.length === 0) {
        html = "<p>No items found</p>";
      } else {
        data.forEach((item) => {
          html += `
            <div class="item-card">
              <img src="${item.image}" alt="${item.name}">
              <h3>${item.name}</h3>
              <p>₹${item.price}</p>
              <p><strong>${item.category}</strong></p>
              <button onclick="addToCart(${item.id}, '${item.name}', ${item.price}, '${item.category}', '${item.image}')">
                <i class="fas fa-cart-plus"></i> Add to Cart
              </button>
            </div>`;
        });
      }
      document.getElementById("items").innerHTML = html;
    });
}

// Add item to cart
function addToCart(id, name, price, category, image) {
  fetch(apiUrl + "/cart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, name, price, category, image }),
  })
    .then((res) => res.json())
    .then(() => viewCart());
}

// View cart
function viewCart() {
  fetch(apiUrl + "/cart")
    .then((res) => res.json())
    .then((data) => {
      let html = "";
      let total = 0;
      if (data.length === 0) {
        html = "<p>Cart is empty</p>";
      } else {
        data.forEach((item) => {
          total += item.price;
          html += `
            <p>
              ${item.name} - ₹${item.price}
              <button onclick="removeFromCart(${item.id})"><i class="fas fa-trash"></i></button>
            </p>`;
        });
      }
      document.getElementById("cart-items").innerHTML = html;
      document.getElementById("cart-total").innerHTML =
        data.length > 0 ? `Total: ₹${total}` : "";
    });
}

// Remove from cart
function removeFromCart(id) {
  fetch(apiUrl + "/cart/" + id, { method: "DELETE" }).then(() => viewCart());
}

// Load items & cart on page start
window.onload = function () {
  loadItems();
  viewCart();
};
