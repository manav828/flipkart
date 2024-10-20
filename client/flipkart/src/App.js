import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function App() {
  const [url, setUrl] = useState("");
  const [productData, setProductData] = useState(null);
  const [error, setError] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // New state to hold chart data
  const [chartData, setChartData] = useState(null);

  // Fetch all products from MongoDB
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/products");
        const data = await response.json();
        if (response.ok) {
          setAllProducts(data);
          setFilteredProducts(data); // Set initial filtered products
        } else {
          setError(data.error || "Failed to fetch all products.");
        }
      } catch (err) {
        setError("Error connecting to the server.");
      }
    };

    fetchAllProducts();
  }, []);

  // Function to handle the chart data for the same title items sorted by date
  const createChartData = (title) => {
    const productHistory = allProducts
      .filter((product) => product.Title === title)
      .sort((a, b) => new Date(a.Date) - new Date(b.Date)); // Sort by date

    const labels = productHistory.map((product) => {
      console.log(product)

      const date = new Date(product.Date);  // Convert string date to Date object
      console.log(date)
      // return date.toLocaleDateString("en-GB"); // Format date to "DD/MM/YYYY"
      return product.Time
    });

    const prices = productHistory.map((product) => product.Price);

    setChartData({
      labels,
      datasets: [
        {
          label: `Price history of ${title}`,
          data: prices,
          borderColor: "rgba(75,192,192,1)",
          backgroundColor: "rgba(75,192,192,0.2)",
          borderWidth: 2,
        },
      ],
    });
  };

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
        createChartData(data.Title); // Create chart data when we get product data
      } else {
        setError(data.error || "Failed to fetch product data.");
      }
    } catch (err) {
      setError("Error connecting to the server.");
    }
  };

  // Filter products based on search and price range
  const filterProducts = () => {
    let filtered = allProducts;

    // Filter by title
    if (searchTitle) {
      filtered = filtered.filter((product) =>
        product.Title.toLowerCase().includes(searchTitle.toLowerCase())
      );
    }

    // Filter by price range
    if (minPrice) {
      filtered = filtered.filter((product) => parseFloat(product.Price) >= parseFloat(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter((product) => parseFloat(product.Price) <= parseFloat(maxPrice));
    }

    setFilteredProducts(filtered);
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
                <td style={{ border: "1px solid black", padding: "10px" }}>
                  <strong>Title</strong>
                </td>
                <td style={{ border: "1px solid black", padding: "10px" }}>{productData.Title}</td>
              </tr>
              <tr>
                <td style={{ border: "1px solid black", padding: "10px" }}>
                  <strong>Price</strong>
                </td>
                <td style={{ border: "1px solid black", padding: "10px" }}>{productData.Price}</td>
              </tr>
              <tr>
                <td style={{ border: "1px solid black", padding: "10px" }}>
                  <strong>Reviews</strong>
                </td>
                <td style={{ border: "1px solid black", padding: "10px" }}>{productData.Reviews}</td>
              </tr>
              <tr>
                <td style={{ border: "1px solid black", padding: "10px" }}>
                  <strong>Description</strong>
                </td>
                <td style={{ border: "1px solid black", padding: "10px" }}>
                  {productData.Description}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
{/* Search and filter products */}
      <div style={{ marginTop: "20px" }}>
        <h2>Filter Products</h2>
        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            placeholder="Search by title"
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
            style={{ padding: "10px", width: "200px" }}
          />
          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            style={{ padding: "10px", width: "100px", marginLeft: "10px" }}
          />
          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            style={{ padding: "10px", width: "100px", marginLeft: "10px" }}
          />
          <button onClick={filterProducts} style={{ padding: "10px", marginLeft: "10px" }}>
            Filter
          </button>
          {/* Reset Button */}
          <button
            onClick={() => {
              setSearchTitle("");
              setMinPrice("");
              setMaxPrice("");
              setFilteredProducts(allProducts); // Reset filtered products to all products
            }}
            style={{
              padding: "10px",
              marginLeft: "10px",
              backgroundColor: "lightgray",
              border: "1px solid gray",
            }}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Table displaying all products with a chart button */}
      <h2>All Products:</h2>
      <table style={{ border: "1px solid black", borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid black", padding: "10px" }}>Title</th>
            <th style={{ border: "1px solid black", padding: "10px" }}>Price</th>
            <th style={{ border: "1px solid black", padding: "10px" }}>Reviews</th>
            {/* <th style={{ border: "1px solid black", padding: "10px" }}>Date</th> */}
            <th style={{ border: "1px solid black", padding: "10px" }}>Description</th>
            <th style={{ border: "1px solid black", padding: "10px" }}>Chart</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product, index) => (
            <tr key={index}>
              <td style={{ border: "1px solid black", padding: "10px" }}>{product.Title}</td>
              <td style={{ border: "1px solid black", padding: "10px" }}>{product.Price}</td>
              <td style={{ border: "1px solid black", padding: "10px" }}>{product.Reviews}</td>
              <td style={{ border: "1px solid black", padding: "10px" }}>
                {product.Description.length > 100
                  ? product.Description.substring(0, 150) + "..."
                  : product.Description}
              </td>

              {/* <td style={{ border: "1px solid black", padding: "10px" }}>{product.Date}</td> */}
              <td style={{ border: "1px solid black", padding: "10px" }}>
                <button onClick={() => createChartData(product.Title)}>Show Chart</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Chart showing price vs date */}
      {chartData && (
        <div style={{ marginTop: "50px" }}>
          <h2 style={{ width: "300px", display: "block", margin: "auto" }}>Price vs Date Chart</h2>
          <div style={{ width: "60%", height: "300px", display: "block", margin: "auto" }}>
            <Line data={chartData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      )}

      
    </div>
  );
}

export default App;
