// --- 1. PRODUCT DATA ---

var featuredProducts = [
    { id: 1, name: "Dior Sauvage", price: 59.99, image: "images/dior.jpg", category: "Men" },
    { id: 2, name: "Black Opium", price: 85.00, image: "images/opium.jpg", category: "Women" },
    { id: 3, name: "Tom Ford Ombre", price: 99.99, image: "images/tomford.jpg", category: "Men" }
];

var topSellerProducts = [
    { id: 4, name: "Bleu De Chanel", price: 89.99, image: "images/chanel.jpg", category: "Women" },
    { id: 5, name: "Nishane Hacivat", price: 119.99, image: "images/nishane.jpg", category: "Men" },
    { id: 6, name: "Gucci Bloom", price: 95.00, image: "images/gucci.jpg", category: "Women" }
];

var menProducts = [
    { id: 7, name: "Dior Sauvage", price: 59.99, image: "images/dior.jpg", category: "Men" },
    { id: 5, name: "Nishane Hacivat", price: 119.99, image: "images/nishane.jpg", category: "Men" },
    { id: 3, name: "Tom Ford Ombre", price: 99.99, image: "images/tomford.jpg", category: "Men" }
];

var womenProducts = [
    { id: 10, name: "Black Opium", price: 85.00, image: "images/opium.jpg", category: "Women" },
    { id: 11, name: "Gucci Bloom", price: 95.00, image: "images/gucci.jpg", category: "Women" },
    { id: 12, name: "Bleu De Chanel", price: 120.00, image: "images/chanel.jpg", category: "Women" }
];

var categories = [
    { name: "Men's Wear", img: "images/men.jpg", pageLink: "men.html" },
    { name: "Women's Wear", img: "images/women.jpg", pageLink: "women.html" }
];

var myCart = []; 

// --- 2. STARTUP ---
window.onload = function() {
    console.log("Page loaded."); // Requirement: Console Log 1
    
    var storedCart = localStorage.getItem('noiraCart');
    if (storedCart) {
        myCart = JSON.parse(storedCart);
    }
    updateCartBadge();

    // Check which page we are on and run the correct display function
    if(document.getElementById("home-product-list")) displayHomeProducts();
    if(document.getElementById("bestseller-product-list")) displayBestSellers();
    if(document.getElementById("men-product-list")) displayMenProducts();
    if(document.getElementById("women-product-list")) displayWomenProducts();
    if(document.getElementById("category-list")) displayCategories();
    if(document.getElementById("cart-items")) renderCartPage();
    if(document.getElementById("pay-display")) updatePaymentTotal();
};

/* --- STORAGE HELPER --- */
function saveCart() {
    localStorage.setItem('noiraCart', JSON.stringify(myCart));
    updateCartBadge();
}

function updateCartBadge() {
    var count = 0;
    for(var i=0; i<myCart.length; i++) {
        count += myCart[i].qty;
    }
    var badge = document.getElementById("cart-count");
    if(badge) badge.innerText = count;
}

/* --- DISPLAY FUNCTIONS --- */
function displayHomeProducts() {
    document.getElementById("home-product-list").innerHTML = renderList(featuredProducts);
}
function displayBestSellers() {
    document.getElementById("bestseller-product-list").innerHTML = renderList(topSellerProducts);
}
function displayMenProducts() {
    document.getElementById("men-product-list").innerHTML = renderList(menProducts);
}
function displayWomenProducts() {
    document.getElementById("women-product-list").innerHTML = renderList(womenProducts);
}

function renderList(list) {
    var html = "";
    for (var i = 0; i < list.length; i++) {
        html += `
            <div class="col-md-4">
                <div class="card card-custom h-100 p-3">
                    <img src="${list[i].image}" class="card-img-top">
                    <div class="card-body text-center">
                        <h5 class="card-title">${list[i].name}</h5>
                        <p class="text-secondary">${list[i].category}</p>
                        <p class="fw-bold">$${list[i].price}</p>
                        <button class="btn btn-purple w-100" onclick="addToCart(${list[i].id})">Add to Cart</button>
                    </div>
                </div>
            </div>
        `;
    }
    return html;
}

function displayCategories() {
    var html = "";
    for (var i = 0; i < categories.length; i++) {
        html += `
            <div class="col-md-5">
                <div class="card card-custom h-100 p-3">
                    <img src="${categories[i].img}" style="height: 250px; object-fit: cover;">
                    <div class="card-body text-center">
                        <h4>${categories[i].name}</h4>
                        <a href="${categories[i].pageLink}" class="btn btn-purple mt-2">View Products</a>
                    </div>
                </div>
            </div>
        `;
    }
    document.getElementById("category-list").innerHTML = html;
}

/* --- CART LOGIC --- */
function addToCart(id) {
    var all = featuredProducts.concat(topSellerProducts, menProducts, womenProducts);
    var product = null;
    for(var i=0; i<all.length; i++) {
        if(all[i].id === id) { product = all[i]; break; }
    }

    var found = false;
    for(var i=0; i<myCart.length; i++) {
        if(myCart[i].id === id) {
            myCart[i].qty++;
            found = true;
            break;
        }
    }
    if(!found) {
        myCart.push({
            id: product.id, name: product.name, price: product.price, image: product.image, qty: 1
        });
    }

    saveCart();
    alert("Item added to cart!"); // Requirement: Alert 1
    console.log("Cart items updated."); // Requirement: Console Log 2
}

function renderCartPage() {
    var container = document.getElementById("cart-items");
    var subtotal = 0;
    var html = "";

    if(myCart.length === 0) {
        html = "<p class='text-center mt-5'>Your cart is empty.</p>";
    } else {
        for(var i=0; i<myCart.length; i++) {
            var item = myCart[i];
            subtotal += item.price * item.qty;

            html += `
                <div class="card bg-dark border-secondary mb-3 p-2">
                    <div class="row align-items-center">
                        <div class="col-3">
                            <img src="${item.image}" class="img-fluid rounded">
                        </div>
                        <div class="col-5">
                            <h5 class="mb-1 text-white">${item.name}</h5>
                            <p class="mb-0 text-white-50">$${item.price}</p>
                        </div>
                        <div class="col-4 text-end">
                            <span class="d-block mb-2 text-white">Qty: ${item.qty}</span>
                            <button class="btn btn-sm btn-danger" onclick="removeItem(${item.id})">Remove</button>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    container.innerHTML = html;
    document.getElementById("subtotal-price").innerText = "$" + subtotal.toFixed(2);
    
    var total = subtotal > 0 ? subtotal + 10 : 0;
    document.getElementById("total-price").innerText = "$" + total.toFixed(2);

    // Save total for payment page
    localStorage.setItem('cartTotal', total.toFixed(2));
}

function removeItem(id) {
    var temp = [];
    for(var i=0; i<myCart.length; i++) {
        if(myCart[i].id !== id) temp.push(myCart[i]);
    }
    myCart = temp;
    saveCart();
    renderCartPage();
}

/* --- PAYMENT LOGIC --- */
function updatePaymentTotal() {
    var txt = localStorage.getItem('cartTotal') || "0.00";
    document.getElementById("pay-display").innerText = "$" + txt;
}

function toggleCardDetails() {
    var method = document.getElementById("payment-method").value;
    var cardBox = document.getElementById("card-details-box");
    if(method === "card") {
        cardBox.style.display = "block";
    } else {
        cardBox.style.display = "none";
    }
}

function handlePayment(e) {
    e.preventDefault();
    var name = document.getElementById("customer-name").value;
    if(!name) name = "Guest";
    
    alert("Thanks " + name + "! Order placed."); // Requirement: Alert 2
    myCart = [];
    saveCart();
    window.location.href = "index.html"; // Redirect to Home
}

/* --- AUTH LOGIC --- */
function showLoginForm() {
    document.getElementById('login-box').style.display = 'block';
    document.getElementById('signup-box').style.display = 'none';
}
function showSignupForm() {
    document.getElementById('login-box').style.display = 'none';
    document.getElementById('signup-box').style.display = 'block';
}
function handleLogin(e) {
    e.preventDefault();
    alert("Logged in!"); // Requirement: Alert 3
    console.log("User logged in"); // Requirement: Console Log 3
    window.location.href = "index.html";
}
function handleSignup(e) {
    e.preventDefault();
    alert("Account created!");
    window.location.href = "index.html";
}
