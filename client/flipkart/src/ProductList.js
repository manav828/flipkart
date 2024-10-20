import React from "react";
import { Link } from "react-router-dom";

function ProductList({ products }) {
    if (!products.length) {
        return <p>No products available.</p>;
    }

    return (
        <div style={{ marginTop: "20px" }}>
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
                    {products.map((product, index) => (
                        <tr key={index}>
                            <td style={{ border: "1px solid black", padding: "10px" }}>
                                <Link to={`/product/${product._id}`}>{product.Title}</Link>
                            </td>
                            <td style={{ border: "1px solid black", padding: "10px" }}>{product.Price}</td>
                            <td style={{ border: "1px solid black", padding: "10px" }}>{product.Reviews}</td>
                            <td style={{ border: "1px solid black", padding: "10px" }}>{product.Description}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ProductList;
