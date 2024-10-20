import React, { useState, useEffect } from "react";

function App() {
  const [url, setUrl] = useState("");
  const [productData, setProductData] = useState(null);
  const [error, setError] = useState(null);
  const [allProducts, setAllProducts] = useState([]);

  // Fetch all products from MongoDB when the component mounts
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/products");
        const data = await response.json();
        if (response.ok) {
          setAllProducts(data);
        } else {
          setError(data.error || "Failed to fetch all products.");
        }
      } catch (err) {
        setError("Error connecting to the server.");
      }
    };

    fetchAllProducts();
  }, []);

  // Handle user submitting the URL
  const handleSubmit = async () => {
    if (!url) {
      setError("URL is required");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/scrape?url=${encodeURIComponent(url)}`);
      const data = await response.json();

      if (response.ok) {
        setProductData(data);
        setError(null); // Clear any previous errors
      } else {
        setError(data.error || "Failed to fetch product data.");
      }
    } catch (err) {
      setError("Error connecting to the server.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Flipkart Product Scraper</h1>

      {/* Input to enter the product URL */}
      <input
        type="text"
        placeholder="Enter Flipkart product URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{ width: "400px", padding: "10px" }}
      />
      <button onClick={handleSubmit} style={{ padding: "10px", marginLeft: "10px" }}>
        Scrape Product
      </button>

      {/* Error message display */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Display the response as the current item (scraped data from URL) */}
      {productData && (
        <div style={{ marginTop: "20px" }}>
          <h2>Current Product:</h2>
          <table style={{ border: "1px solid black", borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid black", padding: "10px" }}>Field</th>
                <th style={{ border: "1px solid black", padding: "10px" }}>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ border: "1px solid black", padding: "10px" }}><strong>Title</strong></td>
                <td style={{ border: "1px solid black", padding: "10px" }}>{productData.Title}</td>
              </tr>
              <tr>
                <td style={{ border: "1px solid black", padding: "10px" }}><strong>Price</strong></td>
                <td style={{ border: "1px solid black", padding: "10px" }}>{productData.Price}</td>
              </tr>
              <tr>
                <td style={{ border: "1px solid black", padding: "10px" }}><strong>Reviews</strong></td>
                <td style={{ border: "1px solid black", padding: "10px" }}>{productData.Reviews}</td>
              </tr>
              <tr>
                <td style={{ border: "1px solid black", padding: "10px" }}><strong>Description</strong></td>
                <td style={{ border: "1px solid black", padding: "10px" }}>{productData.Description}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Display list of all products from MongoDB */}
      {allProducts.length > 0 && (
        <div style={{ marginTop: "40px" }}>
          <h2>All Products</h2>
          <table style={{ border: "1px solid black", borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid black", padding: "10px" }}>Title</th>
                <th style={{ border: "1px solid black", padding: "10px" }}>Price</th>
                <th style={{ border: "1px solid black", padding: "10px" }}>Reviews</th>
                <th style={{ border: "1px solid black", padding: "10px" }}>Description</th>
              </tr>
            </thead>
            <tbody>
              {allProducts.map((product, index) => (
                <tr key={index}>
                  <td style={{ border: "1px solid black", padding: "10px" }}>{product.Title}</td>
                  <td style={{ border: "1px solid black", padding: "10px" }}>{product.Price}</td>
                  <td style={{ border: "1px solid black", padding: "10px" }}>{product.Reviews}</td>
                  <td style={{ border: "1px solid black", padding: "10px" }}>{product.Description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;


