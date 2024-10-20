import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function ProductDetails() {
    const { id } = useParams();
    const [productData, setProductData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/products/${id}`);
                const data = await response.json();
                if (response.ok) {
                    setProductData(data);
                } else {
                    setError(data.error || "Failed to fetch product details.");
                }
            } catch (err) {
                setError("Error connecting to the server.");
            }
        };

        fetchProductData();
    }, [id]);

    if (error) {
        return <p style={{ color: "red" }}>{error}</p>;
    }

    if (!productData) {
        return <p>Loading product details...</p>;
    }

    return (
        <div style={{ marginTop: "20px" }}>
            <h2>Product Details</h2>
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
    );
}

export default ProductDetails;
