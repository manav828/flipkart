# from flask import Flask, request, jsonify
# import requests
# from bs4 import BeautifulSoup
# import time
# from pymongo import MongoClient

# # MongoDB connection
# client = MongoClient(
#     "mongodb+srv://manav:manav@cluster0.562ra.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
# db = client['flipkart_tracker']  # Database name
# collection = db['products']      # Collection name

# # Initialize Flask app
# app = Flask(__name__)


# def scrape_flipkart_product(url, retries=3, delay=5):
#     headers = {
#         "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
#         "Accept-Language": "en-US,en;q=0.9",
#         "Accept-Encoding": "gzip, deflate, br",
#         "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
#         "Connection": "keep-alive",
#     }

#     for attempt in range(retries):
#         try:
#             # Send a GET request to the Flipkart product page
#             response = requests.get(url, headers=headers, timeout=10)

#             if response.status_code == 200:
#                 # Parse the page content using BeautifulSoup
#                 soup = BeautifulSoup(response.content, 'html.parser')

#                 # Extract the product title
#                 title_tag = soup.find("span", class_="VU-ZEz")
#                 title = title_tag.text if title_tag else "Title not found"

#                 # Extract the price
#                 price_tag = soup.find("div", class_="Nx9bqj CxhGGd")
#                 price = price_tag.text if price_tag else "Price not found"

#                 # Extract the number of reviews
#                 review_tag = soup.find("div", class_="XQDdHH")
#                 reviews = review_tag.text if review_tag else "Reviews not found"

#                 # Extract the description
#                 description_tag = soup.find("div", class_="yN+eNk")
#                 description = description_tag.text if description_tag else "Description not found"

#                 # Prepare the scraped data
#                 product_data = {
#                     "Title": title.strip(),
#                     "Price": price.strip(),
#                     "Reviews": reviews.strip(),
#                     "Description": description.strip(),
#                 }

#                 # Save the data to MongoDB
#                 collection.insert_one(product_data)
#                 print("Product data saved to MongoDB:", product_data)
#                 return product_data

#             else:
#                 print(
#                     f"Failed to retrieve the page. Status code: {response.status_code}")

#         except requests.exceptions.RequestException as e:
#             print(f"Attempt {attempt + 1} failed: {e}")
#             time.sleep(delay)

#     return {"Error": f"Failed to retrieve the page after {retries} attempts"}


# @app.route('/scrape', methods=['GET'])
# def scrape_product():
#     url = request.args.get('url')
#     if not url:
#         return jsonify({"error": "URL is required"}), 400

#     product_data = scrape_flipkart_product(url)
#     if 'Error' in product_data:
#         return jsonify(product_data), 500

#     return jsonify(product_data), 200


# if __name__ == '__main__':
#     app.run(debug=True, port=5000)


from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
import requests
from bs4 import BeautifulSoup
import time
from pymongo import MongoClient
from datetime import datetime

# MongoDB connection
client = MongoClient(
    "mongodb+srv://manav:manav@cluster0.562ra.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client['flipkart_tracker']  # Database name
collection = db['products']      # Collection name

# Initialize Flask app
app = Flask(__name__)
# Enable CORS for all routes and allow requests from any origin
CORS(app, origins=["http://localhost:3000"])



def scrape_flipkart_product(url, retries=3, delay=5):
    print(url)
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Connection": "keep-alive",
    }

    for attempt in range(retries):
        try:
            # Send a GET request to the Flipkart product page
        
            response = requests.get(url, headers=headers, timeout=10)
      
            if response.status_code == 200:
                # Parse the page content using BeautifulSoup
                soup = BeautifulSoup(response.content, 'html.parser')

                # Extract the product title
                title_tag = soup.find("span", class_="VU-ZEz")
                title = title_tag.text if title_tag else "Title not found"
                
                # Extract the price
                price_tag = soup.find("div", class_="Nx9bqj CxhGGd")
                price = price_tag.text if price_tag else "Price not found"

                # Extract the number of reviews
                review_tag = soup.find("div", class_="XQDdHH")
                reviews = review_tag.text if review_tag else "Reviews not found"
                
                # Extract the description
                description_tag = soup.find("div", class_="yN+eNk")
                description = description_tag.text if description_tag else "Description not found"
                time = datetime.now()
                # Prepare the scraped data
                product_data = {
                    "Title": title.strip(),
                    "Price": price.strip(),
                    "Reviews": reviews.strip(),
                    "Description": description.strip(),
                    "Time" : time,
                }
                print(product_data)

                # # Save the data to MongoDB
                # collection.insert_one(product_data)
                # print("Product data saved to MongoDB:", product_data)
                # return product_data

                # Insert product data into MongoDB
                result = collection.insert_one(product_data)

                # Convert MongoDB ObjectId to a string
                product_data['_id'] = str(result.inserted_id)

                # Return the product data as a JSON response
                return product_data

            else:
                print(
                    f"Failed to retrieve the page. Status code: {response.status_code}")

        except requests.exceptions.RequestException as e:
            print(f"Attempt {attempt + 1} failed: {e}")
            time.sleep(delay)

    return {"Error": f"Failed to retrieve the page after {retries} attempts"}


@app.route('/scrape', methods=['GET'])
def scrape_product():
    url = request.args.get('url')
    if not url:
        return jsonify({"error": "URL is required"}), 400

    product_data = scrape_flipkart_product(url)
    if 'Error' in product_data:
        return jsonify(product_data), 500

    return jsonify(product_data), 200

# New endpoint to fetch all products from the MongoDB database


@app.route('/products', methods=['GET'])
def get_products():
    # Fetch all products and exclude the MongoDB _id field
    products = list(collection.find({}, {"_id": 0}))
    return jsonify(products), 200
    
if __name__ == '__main__':
    app.run(debug=True, port=5000)
