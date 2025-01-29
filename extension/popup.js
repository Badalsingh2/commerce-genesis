document.addEventListener("DOMContentLoaded", () => {
  const productNameEl = document.getElementById("productName");
  const resultsContainer = document.getElementById("resultsContainer");

  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    try {
      // Get product title
      const [scriptResult] = await chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: () => document.getElementById("productTitle")?.innerText.trim(),
      });

      const productTitle = scriptResult?.result || "No product found";
      productNameEl.textContent = `Product: ${productTitle}`;

      // Fetch recommendations
      const response = await fetch(
        `http://localhost:8080?product=${encodeURIComponent(productTitle)}`,
      );

      if (!response.ok) throw new Error("Server error");
      const products = await response.json();

      // Clear loading message
      resultsContainer.innerHTML = "";

      // Render products
      products.forEach((product) => {
        const productEl = document.createElement("div");
        productEl.className = "product-item";
        productEl.innerHTML = `
          <img src="${product.image}" class="product-image" alt="${product.title}">
          <div class="product-info">
            <div><strong>${product.title}</strong></div>
            <div>Product ID: ${product.id}</div>
          </div>
        `;
        resultsContainer.appendChild(productEl);
      });
    } catch (error) {
      console.error("Error:", error);
      resultsContainer.innerHTML = `
        <div class="loading">
          Failed to load recommendations. Ensure the server is running on port 9000.
        </div>
      `;
    }
  });
});
