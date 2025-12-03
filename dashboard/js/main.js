const API_BASE = "http://localhost:5000/api";

// Fetch dashboard stats
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const [productRes, orderRes, userRes, couponRes] = await Promise.all([
      fetch(`${API_BASE}/products`),
      fetch(`${API_BASE}/orders`),
      fetch(`${API_BASE}/users`),
      fetch(`${API_BASE}/coupons`)
    ]);

    const products = await productRes.json();
    const orders = await orderRes.json();
    const users = await userRes.json();
    const coupons = await couponRes.json();

    document.getElementById("productCount").innerText = products?.data?.length || 0;
    document.getElementById("orderCount").innerText = orders?.data?.length || 0;
    document.getElementById("userCount").innerText = users?.data?.length || 0;
    document.getElementById("couponCount").innerText = coupons?.data?.length || 0;

    // Recent Orders Table
    const recentOrders = orders?.data?.slice(0, 5) || [];
    const tbody = document.getElementById("recentOrders");
    tbody.innerHTML = recentOrders.map((o, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>${o.order_id}</td>
        <td>${o.user?.name || 'Guest'}</td>
        <td>$${o.total_amount}</td>
        <td><span class="badge bg-info">${o.order_status}</span></td>
        <td>${new Date(o.createdAt).toLocaleDateString()}</td>
      </tr>
    `).join('');
  } catch (err) {
    console.error("Dashboard load failed:", err);
  }
});
