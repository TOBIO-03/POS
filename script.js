/* PRODUCT DATABASE — PRICES IN PESO */
const products = [
    // SHOES
    { name: "Nike Air Max", price: 5995, category: "shoes" },
    { name: "Nike Air Force 1", price: 4995, category: "shoes" },
    { name: "Nike Dunk Low", price: 5495, category: "shoes" },
    { name: "Nike Pegasus 40", price: 6295, category: "shoes" },
    { name: "Nike ZoomX Vaporfly", price: 12995, category: "shoes" },

    // APPAREL
    { name: "Nike Hoodie", price: 2495, category: "apparel" },
    { name: "Nike Joggers", price: 2295, category: "apparel" },
    { name: "Nike Sports Tee", price: 995, category: "apparel" },
    { name: "Nike Track Jacket", price: 3295, category: "apparel" },
    { name: "Nike Shorts", price: 1195, category: "apparel" },

    // ACCESSORIES
    { name: "Nike Cap", price: 895, category: "accessories" },
    { name: "Nike Socks (3 Pack)", price: 495, category: "accessories" },
    { name: "Nike Backpack", price: 1895, category: "accessories" },
    { name: "Nike Gym Bag", price: 1495, category: "accessories" },
];

/* DISPLAY PRODUCTS */
function displayProducts(filter = "all") {
    const grid = document.getElementById("product-grid");
    grid.innerHTML = "";

    products
        .filter(p => filter === "all" || p.category === filter)
        .forEach(p => {
            grid.innerHTML += `
                <div class="product-card">
                    <h3>${p.name}</h3>
                    <p>₱${p.price}</p>
                    <button onclick="addToCart('${p.name}', ${p.price})">Add</button>
                </div>
            `;
        });
}

displayProducts();

/* FILTER CATEGORY */
function filterCategory(category) {
    displayProducts(category);
}

/* CART SYSTEM */
let cart = [];

function addToCart(name, price) {
    let item = cart.find(p => p.name === name);

    if (item) {
        item.qty++;
    } else {
        cart.push({ name, price, qty: 1 });
    }

    updateCart();
}

function updateCart() {
    const cartBody = document.getElementById("cart-body");
    cartBody.innerHTML = "";

    let grandTotal = 0;

    cart.forEach((item, index) => {
        let total = item.price * item.qty;
        grandTotal += total;

        cartBody.innerHTML += `
            <tr>
                <td>${item.name}</td>
                <td><input type="number" value="${item.qty}" min="1" onchange="changeQty(${index}, this.value)"></td>
                <td>₱${item.price}</td>
                <td>₱${total.toFixed(2)}</td>
                <td><button onclick="removeItem(${index})">X</button></td>
            </tr>
        `;
    });

    document.getElementById("grand-total").innerText = grandTotal.toFixed(2);
}

function changeQty(index, qty) {
    cart[index].qty = Number(qty);
    updateCart();
}

function removeItem(index) {
    cart.splice(index, 1);
    updateCart();
}

/* PAYMENT SYSTEM */
function openPayment() {
    document.getElementById("payment-modal").style.display = "flex";
    document.getElementById("pay-total").innerText = document.getElementById("grand-total").innerText;
}

function closePayment() {
    document.getElementById("payment-modal").style.display = "none";
}

function calculateChange() {
    let total = parseFloat(document.getElementById("pay-total").innerText);
    let cash = parseFloat(document.getElementById("cash").value || 0);

    let change = cash - total;
    document.getElementById("change").innerText = change.toFixed(2);
}

function confirmPayment() {
    alert("Payment Successful!\nReceipt Printing...");
    cart = [];
    updateCart();
    closePayment();
}

/* =========================
   PAYMENT WITH RECEIPT
========================= */

function confirmPayment() {
    let total = parseFloat(document.getElementById("pay-total").innerText);
    let cash = parseFloat(document.getElementById("cash").value || 0);

    if (cash < total) {
        alert("Cash is not enough!");
        return;
    }

    // Fill receipt
    generateReceipt(total, cash);

    // Reset POS cart
    cart = [];
    updateCart();
    closePayment();

    // Show receipt
    document.getElementById("receipt-modal").style.display = "flex";
}

function generateReceipt(total, cash) {
    let change = cash - total;

    // date
    const now = new Date();
    document.getElementById("receipt-date").innerText =
        now.toLocaleDateString() + " " + now.toLocaleTimeString();

    // items list
    let itemListHTML = `<div class='receipt-items-list'>`;
    cart.forEach(item => {
        itemListHTML += `
            <p>${item.name} (x${item.qty}) — ₱${(item.qty * item.price).toFixed(2)}</p>
        `;
    });
    itemListHTML += `</div>`;

    document.getElementById("receipt-items").innerHTML = itemListHTML;

    // totals
    document.getElementById("receipt-total").innerText = total.toFixed(2);
    document.getElementById("receipt-cash").innerText = cash.toFixed(2);
    document.getElementById("receipt-change").innerText = change.toFixed(2);
}

function closeReceipt() {
    document.getElementById("receipt-modal").style.display = "none";
}

function printReceipt() {
    let printContent = document.getElementById("receipt-box").innerHTML;
    let win = window.open("", "", "width=400,height=600");
    win.document.write(`
        <html>
            <head>
                <title>Nike Receipt</title>
            </head>
            <body>${printContent}</body>
        </html>
    `);
    win.document.close();
    win.print();
}

