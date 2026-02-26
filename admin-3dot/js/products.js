import { endpoints } from "./api.js";
const productTable = document.getElementById("productTable");
const modal = new bootstrap.Modal(document.getElementById("productModal"));
const form = document.getElementById("productForm");

document.addEventListener("DOMContentLoaded", loadProducts);

async function loadProducts() {
  const res = await fetch(endpoints.products);
  const json = await res.json();
  productTable.innerHTML = json.data.map((p, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${p.name}</td>
      <td>${p.brand}</td>
      <td>$${p.price}</td>
      <td>${p.category?.name || '—'}</td>
      <td>${p.stock}</td>
      <td>
        <button class="btn btn-sm btn-info" onclick='editProduct("${p._id}")'>✏️</button>
        <button class="btn btn-sm btn-danger" onclick='deleteProduct("${p._id}")'>🗑️</button>
      </td>
    </tr>
  `).join('');
}

document.getElementById("addProductBtn").addEventListener("click", () => {
  form.reset();
  document.getElementById("productId").value = "";
  modal.show();
});

document.getElementById("saveProductBtn").addEventListener("click", async () => {
  const id = document.getElementById("productId").value;
  const data = {
    name: form.name.value,
    brand: form.brand.value,
    description: form.description.value,
    price: parseFloat(form.price.value),
    stock: parseInt(form.stock.value),
    category: form.category.value
  };
  const method = id ? "PUT" : "POST";
  const url = id ? `${endpoints.products}/${id}` : endpoints.products;
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  await res.json();
  modal.hide();
  loadProducts();
});

async function editProduct(id) {
  const res = await fetch(`${endpoints.products}/${id}`);
  const json = await res.json();
  const p = json.data;
  document.getElementById("productId").value = p._id;
  form.name.value = p.name;
  form.brand.value = p.brand;
  form.price.value = p.price;
  form.stock.value = p.stock;
  form.description.value = p.description;
  form.category.value = p.category?._id || "";
  modal.show();
}

async function deleteProduct(id) {
  if (!confirm("Delete this product?")) return;
  await fetch(`${endpoints.products}/${id}`, { method: "DELETE" });
  loadProducts();
}
