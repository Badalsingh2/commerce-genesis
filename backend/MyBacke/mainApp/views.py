from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
import json
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import get_object_or_404, redirect
from .models import Product, Cart, CartItem, OrderItem, Order, User
from django.core.files.storage import FileSystemStorage
from inference_sdk import InferenceHTTPClient
from transformers import pipeline
from huggingface_hub import login
from rest_framework import status
from .models import Product, Review
from .serializers import ReviewSerializer,ProductSerializer
import requests
import numpy as np
import pickle
from django.conf import settings
from sklearn.preprocessing import LabelEncoder
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import os
# Create your views here.


  # Remove any leading/trailing spaces


@api_view(['GET'])
def sample_data(request):
    data = {"message": "Hello from Django"}
    return Response(data)



@csrf_exempt
def register_user(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        confirm_password = data.get('confirm_password')

        if password != confirm_password:
            return JsonResponse({'error': 'Passwords do not match'}, status=400)

        if User.objects.filter(username=username).exists():
            return JsonResponse({'error': 'Username already exists'}, status=400)

        if User.objects.filter(email=email).exists():
            return JsonResponse({'error': 'Email already exists'}, status=400)

        user = User.objects.create(
            username=username,
            email=email,
            password=make_password(password)
        )
        return JsonResponse({'message': 'User registered successfully'})
    return JsonResponse({'error': 'Invalid request method'}, status=405)


@csrf_exempt
def login_user(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')

        user = authenticate(username=username, password=password)
        if user:
            login(request, user)
            # Fetch the user_id after successful login
            user_id = user.id
            return JsonResponse({'message': 'Login successful', 'user_id': user_id})
        else:
            return JsonResponse({'error': 'Invalid credentials'}, status=401)
    return JsonResponse({'error': 'Invalid request method'}, status=405)


def logout_user(request):
    logout(request)
    return JsonResponse({'message': 'Logout successful'})


def get_user_by_id(request, user_id):
    try:
        # Retrieve user by user_id
        user = User.objects.get(id=user_id)
        return JsonResponse({
            'username': user.username,
            'email': user.email,
            'user_id': user.id
        })
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)
    
@csrf_exempt   
def get_all_products(request):
    products = Product.objects.all()

    # Serialize the products data
    products_data = []
    for product in products:
        products_data.append({
            "id": product.id,
            "title": product.title,
            "product_rating": product.product_rating,
            "selling_price": str(product.selling_price),  # Convert to string to avoid Decimal issues in JSON
            "mrp": str(product.mrp),
            "seller_name": product.seller_name,
            "seller_rating": product.seller_rating,
            "description": product.description,
            "highlights": product.highlights,
            "image_links": product.image_links,
            "category_1": product.category_1,
            "category_2": product.category_2,
            "category_3": product.category_3,
        })

    # Return the products as a JSON response
    return JsonResponse({"products": products_data}, safe=False)

@csrf_exempt  # Disable CSRF for testing (Use proper authentication in production)
def add_to_cart(request):
    if request.method == "POST":
        data = json.loads(request.body)  # Parse JSON data from frontend
        user_id = data.get("userId")  # Get user ID from frontend
        product_id = data.get("productId")

        user = get_object_or_404(User, id=user_id)
        product = get_object_or_404(Product, id=product_id)

        # Get or create a cart for the user
        cart, _ = Cart.objects.get_or_create(user=user)

        # Get or create a cart item
        cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)
        cart_item.quantity += 1  # Increment quantity
        cart_item.save()

        return JsonResponse({"message": "Product added to cart", "cartItem": cart_item.quantity}, status=201)

    return JsonResponse({"error": "Invalid request"}, status=400)


def cart_detail(request, user_id):
    user = get_object_or_404(User, id=user_id)
    cart = Cart.objects.filter(user=user).first()  # Get the user's cart
    items = cart.items.all() if cart else []
    print(items)
    cart_data = [
        {
            "productId": item.product.id,
            "productName": item.product.title,
            "quantity": item.quantity,
            "totalPrice": item.total_price
        }
        for item in items
    ]

    return JsonResponse({"cartItems": cart_data, "totalPrice": cart.total_price if cart else 0})


@csrf_exempt
def place_order(request):
    if request.method == "POST":
        data = json.loads(request.body)
        user_id = data.get("userId")

        user = get_object_or_404(User, id=user_id)
        cart = Cart.objects.filter(user=user).first()

        if not cart or not cart.items.exists():
            return JsonResponse({"error": "Cart is empty"}, status=400)

        # Create an order
        order = Order.objects.create(user=user, total_price=cart.total_price)

        # Add cart items to the order
        for item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                product=item.product,
                quantity=item.quantity,
                price=item.total_price,
            )

        # Clear the cart
        cart.items.all().delete()

        return JsonResponse({"message": "Order placed successfully", "orderId": order.id}, status=201)

    return JsonResponse({"error": "Invalid request"}, status=400)


@csrf_exempt
def add_product(request):
    if request.method == "POST":
        data = json.loads(request.body)

        # Extract the fields from the JSON data
        category_1 = data.get("category_1", "")
        category_2 = data.get("category_2", "")
        category_3 = data.get("category_3", "")
        title = data.get("title", "")
        product_rating = data.get("product_rating", 0)
        selling_price = data.get("selling_price", 0.0)
        mrp = data.get("mrp", 0.0)
        seller_name = data.get("seller_name", "")
        seller_rating = data.get("seller_rating", 0)
        description = data.get("description", "")
        highlights = data.get("highlights", "")
        image_links = data.get("image_links", "")

        # Validate required fields
        if not title or not selling_price or not product_rating:
            return JsonResponse({"error": "Title, selling price, and product rating are required"}, status=400)

        # Create the product object
        product = Product.objects.create(
            category_1=category_1,
            category_2=category_2,
            category_3=category_3,
            title=title,
            product_rating=product_rating,
            selling_price=selling_price,
            mrp=mrp,
            seller_name=seller_name,
            seller_rating=seller_rating,
            description=description,
            highlights=highlights,
            image_links=image_links
        )

        # Return a success response with the product ID and image URL (if image exists)
        return JsonResponse(
            {
                "message": "Product added successfully",
                "productId": product.id,
                "image_links": product.image_links,
            },
            status=201,
        )

    # If the request method is not POST, return an error
    return JsonResponse({"error": "Invalid request"}, status=400)


from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from .models import User, Order

def view_orders(request, user_id):
    user = get_object_or_404(User, id=user_id)  # Get the user by their ID
    orders = Order.objects.filter(user=user)  # Get all orders placed by the user

    if not orders:
        return JsonResponse({"error": "No orders found for this user"}, status=404)

    # Prepare the order data to send in the response
    order_data = [
        {
            "orderId": order.id,
            "totalPrice": order.total_price,
            "date": order.created_at.strftime("%Y-%m-%d %H:%M:%S"),  # Format the date
            "items": [
                {
                    "productId": item.product.id,
                    "productName": item.product.title,
                    "quantity": item.quantity,
                    "price": item.price
                }
                for item in order.items.all()  # Get order items
            ]
        }
        for order in orders
    ]

    return JsonResponse({"orders": order_data})

CLIENT = InferenceHTTPClient(
    api_url="https://detect.roboflow.com",
    api_key="KwfMOM2p4jMzJWxR5dxC"  # Replace with your API key
)

from django.core.files.storage import FileSystemStorage
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import ValidationError
import os

from django.core.files.storage import FileSystemStorage
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import ValidationError
import os

@csrf_exempt
def image_upload(request):
    if request.method == "POST":
        if "file" not in request.FILES:
            return JsonResponse({"error": "No image file uploaded"}, status=400)

        uploaded_file = request.FILES["file"]
        
        # Validate the file is an image
        if not uploaded_file.content_type.startswith('image'):
            return JsonResponse({"error": "Uploaded file is not an image"}, status=400)

        fs = FileSystemStorage()
        filename = fs.save(uploaded_file.name, uploaded_file)
        uploaded_file_path = os.path.join(fs.location, filename)  # Full path to the uploaded file
        uploaded_file_url = fs.url(filename)

        try:
            # Perform inference on the uploaded image
            result = CLIENT.infer(uploaded_file_path, model_id="originality-product/3")  # Use your model ID

            # Initialize the label to "Unknown"
            label = "Unknown"
            
            # Loop through predictions to determine if the class is Fake or Original
            for prediction in result.get("predictions", []):
                if prediction.get("class") == "Fake":
                    label = "Fake"
                    break
                elif prediction.get("class") == "Original":
                    label = "Original"

            # Return the result with the image URL and prediction label
            response_data = {"image_url": uploaded_file_url, "label": label}

        except Exception as e:
            # Handle any errors that occur during inference
            response_data = {"error": str(e)}
            return JsonResponse(response_data, status=500)

        finally:
            # Delete the file after processing, whether inference succeeds or fails
            if os.path.exists(uploaded_file_path):
                os.remove(uploaded_file_path)

        return JsonResponse(response_data)

    return JsonResponse({"error": "Invalid request method"}, status=400)


login(token="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")

# Load the pre-trained DistilBERT summarization model
summarizer = pipeline("summarization", model="mabrouk/amazon-review-summarizer-bart")

@csrf_exempt
def summarize_review(request):
    if request.method == "POST":
        data = request.POST.get('review')  # Get the review from POST data
        if not data:
            return JsonResponse({"error": "No review provided"}, status=400)
        
        # Summarize the review
        summary = summarizer(data, min_length=60)
        
        # Extract the summary text from the result
        summarized_text = summary[0]["summary_text"]
        
        return JsonResponse({"summary": summarized_text})

    return JsonResponse({"error": "Invalid request"}, status=400)


# add_reivew
# +++++REVIEW SECTION++++++
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Product, Review

@csrf_exempt  # Add this decorator to exempt CSRF for testing
def add_review(request):
    if request.method == "POST":
        try:
            # Parse the incoming JSON data
            data = json.loads(request.body)

            # Get product ID and other review details
            product = Product.objects.get(id=data['product'])
            user_name = data['user_name']
            user_email = data['user_email']
            rating = data['rating']
            comment = data.get('comment', '')

            # Create a new review
            review = Review.objects.create(
                product=product,
                user_name=user_name,
                user_email=user_email,
                rating=rating,
                comment=comment
            )

            return JsonResponse({"message": "Review added successfully!"}, status=201)

        except Product.DoesNotExist:
            return JsonResponse({"error": "Product not found!"}, status=404)
        except KeyError as e:
            return JsonResponse({"error": f"Missing key: {e}"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid method"}, status=405)

# get reviews by id
@csrf_exempt
def get_reviews_by_product(request, product_id):
    try:
        # Get the product by ID
        product = Product.objects.get(id=product_id)

        # Get all reviews for the product
        reviews = Review.objects.filter(product=product)

        # Prepare a list of review data
        reviews_data = [
            {
                "user_name": review.user_name,
                "user_email": review.user_email,
                "rating": review.rating,
                "comment": review.comment,
                "created_at": review.created_at,
            }
            for review in reviews
        ]

        return JsonResponse({"product": product.title, "reviews": reviews_data}, status=200)

    except Product.DoesNotExist:
        return JsonResponse({"error": "Product not found!"}, status=404)

@csrf_exempt  
def get_reviews_and_summarize(request, product_id):
    try:
        # Get the product by ID
        product = Product.objects.get(id=product_id)

        # Get all reviews for the product
        reviews = Review.objects.filter(product=product)

        # Concatenate all review comments
        all_comments = " ".join([review.comment for review in reviews if review.comment])
        if len(all_comments) <100:
            return JsonResponse({"error":"For Summarization length should be getter then 150"},status=404)

        # Summarize the concatenated comments
        summarized_comment = summarizer(all_comments, min_length=50, max_length=120)[0]['summary_text']

        # Prepare a list of review data
        reviews_data = [
            {
                "user_name": review.user_name,
                "user_email": review.user_email,
                "rating": review.rating,
                "comment": review.comment,
                "created_at": review.created_at,
            }
            for review in reviews
        ]

        # Return the summarized comment and the reviews data
        return JsonResponse({
            "product": product.title,
            "summarized_comments": summarized_comment,
            "reviews": reviews_data
        }, status=200)

    except Product.DoesNotExist:
        return JsonResponse({"error": "Product not found!"}, status=404)
    


# direction
OPENWEATHERMAP_API_KEY ='73f3e54f12f068fb0aff346d9c299e21'
OSRM_BASE_URL = "http://router.project-osrm.org"


@csrf_exempt  # Disable CSRF token validation for testing, but should be handled securely in production
def get_directions(request):
    try:
        # Get query parameters from the request
        origin_lat = float(request.GET.get("origin_lat"))
        origin_lon = float(request.GET.get("origin_lon"))
        destination_lat = float(request.GET.get("destination_lat"))
        destination_lon = float(request.GET.get("destination_lon"))
        
        print(f"Origin: ({origin_lat}, {origin_lon}), Destination: ({destination_lat}, {destination_lon})")
    except Exception as e:
        return JsonResponse({"error": f"Invalid query parameters: {e}"})

    # Step 1: Get the route from OSRM
    osrm_route_url = (
        f"{OSRM_BASE_URL}/route/v1/driving/{origin_lon},{origin_lat};{destination_lon},{destination_lat}"
        f"?overview=full&geometries=geojson"
    )
    osrm_response = requests.get(osrm_route_url)
    osrm_data = osrm_response.json()
    
    if osrm_response.status_code != 200 or "routes" not in osrm_data or not osrm_data["routes"]:
        return JsonResponse({"error": "Unable to fetch directions from OSRM."})

    # Extract route information
    route = osrm_data["routes"][0]
    distance = route["distance"] / 1000  # Convert to kilometers
    duration = route["duration"] / 60  # Convert to minutes
    waypoints = route["geometry"]["coordinates"]

    # Step 2: Fetch weather data for waypoints from OpenWeatherMap
    weather_data = []
    for i, waypoint in enumerate(waypoints[::len(waypoints)//10 + 1]):  # Sample waypoints (10 points max)
        lon, lat = waypoint
        weather_url = (
            f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={OPENWEATHERMAP_API_KEY}&units=metric"
        )
        weather_response = requests.get(weather_url)
        if weather_response.status_code == 200:
            weather_info = weather_response.json()
            weather_data.append({
                "waypoint": f"Point {i + 1} ({lat}, {lon})",
                "temperature": weather_info["main"]["temp"],
                "weather": weather_info["weather"][0]["description"]
            })
        else:
            weather_data.append({"waypoint": f"Point {i + 1} ({lat}, {lon})", "error": "Unable to fetch weather data."})

    # Step 3: Combine directions and weather data
    return JsonResponse({
        "total_distance_km": f"{distance:.2f} km",
        "total_duration_min": f"{duration:.2f} minutes",
        "weather_conditions": weather_data,
    })

import joblib

# Define BASE_DIR (already defined in your settings.py)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Load the pickled model and encoder
model_path = os.path.join(BASE_DIR, 'mainApp', 'trained_model', 'dynamic_price.joblib')

encoder_path = os.path.join(BASE_DIR, 'mainApp', 'trained_model', 'encoder_category_1.joblib')
encoder_path2 = os.path.join(BASE_DIR, 'mainApp', 'trained_model', 'encoder_category_2.joblib')
encoder_path3 = os.path.join(BASE_DIR, 'mainApp', 'trained_model', 'encoder_category_3.joblib')
try:
    with open(model_path, 'rb') as model_file:
        model = joblib.load(model_file)
    with open(encoder_path, 'rb') as encoder_file:
        encode1 = joblib.load(encoder_file)
    with open(encoder_path2, 'rb') as encoder_file:
        encode2 = joblib.load(encoder_file)
    with open(encoder_path3, 'rb') as encoder_file:
        encode3 = joblib.load(encoder_file)
except Exception as e:
    raise RuntimeError(f"Error loading model or encoder: {str(e)}")

print(type(model))
@csrf_exempt
def predict(request):
    if request.method == "POST":
        try:
            # Parse JSON data from the request body
            data = json.loads(request.body)
            product_id = data.get('product_id')
            user_id = data.get('user_id')

            if not product_id or not user_id:
                return JsonResponse({"error": "product_id and user_id are required"}, status=400)

            # Fetch product and user details
            try:
                product = Product.objects.get(id=product_id)
                user = User.objects.get(id=user_id)
            except ObjectDoesNotExist:
                return JsonResponse({"error": "Product or User not found"}, status=404)

            # Get product details
            product_rating = product.product_rating
            seller_rating = product.seller_rating
            mrp = product.mrp
            print(data)
            # Encode the categories
            try:
                category_1_encoded = encode1.transform([product.category_1])[0]
                category_2_encoded = encode2.transform([product.category_2])[0]
                category_3_encoded = encode3.transform([product.category_3])[0]
            except Exception as e:
                return JsonResponse({"error": f"Error encoding categories: {str(e)}"}, status=500)

            # Prepare the feature vector for prediction
            features = np.array([
                mrp,
                product_rating,
                seller_rating,
                category_1_encoded,
                category_2_encoded,
                category_3_encoded
            ]).reshape(1, -1)  # Reshape to fit the model input format

            # Make prediction
            prediction = model.predict(features)

            # Return the prediction as a JSON response
            return JsonResponse({
                "prediction": prediction.tolist()  # Convert numpy array to list
            })

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
file_path = os.path.join(BASE_DIR, "dataset.csv")

df = pd.read_csv(file_path)
df.fillna("", inplace=True)
df["combined_features"] = df["category_3"] + " " + df["title"] + " " + df["highlights"]
df.columns = df.columns.str.strip()
# Compute TF-IDF vectors and similarity matrix
tfidf = TfidfVectorizer(stop_words="english")
tfidf_matrix = tfidf.fit_transform(df["combined_features"])
cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)
print(cosine_sim)

# Function to get recommendations
def recommend_products(product_id, top_n=5):
    print(product_id)
    if product_id not in df["product_id"].values:
        return {"error": "Product ID not found"}

    idx = df[df["product_id"] == product_id].index[0]
    sim_scores = list(enumerate(cosine_sim[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    top_indices = [i[0] for i in sim_scores[1:top_n+1]]

    recommendations = df.iloc[top_indices][["product_id", "title", "selling_price", "image_links"]].to_dict(orient="records")
    return {"recommended_products": recommendations}

# API View for Recommendations
@csrf_exempt
def recommend_view(request, product_id):
    
    try:
        product_id = int(product_id)
        print(product_id)
        recommendations = recommend_products(product_id)
        return JsonResponse(recommendations, safe=False)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


@csrf_exempt
def get_all_categories(request):
    # Get all unique categories for category_1, category_2, and category_3
    categories = {
        "category_1": Product.objects.values_list('category_1', flat=True).distinct(),

    }
    
    # Convert the querysets to lists
    categories = {key: list(value) for key, value in categories.items()}
    
    # Return as a JSON response
    return JsonResponse(categories)

class ProductByCategoryView(APIView):
    def get(self, request, *args, **kwargs):
        # Get the category from the query parameters
        category = request.query_params.get("category_1", None)
        
        if category:
            # Filter products based on category_1
            products = Product.objects.filter(category_1=category)
        else:
            # If no category is provided, return all products
            products = Product.objects.all()

        # Serialize the products
        serializer = ProductSerializer(products, many=True)

        # Return the products in the response
        return Response({"products": serializer.data}, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        # Create a new product from the POST data
        serializer = ProductSerializer(data=request.data)

        if serializer.is_valid():
            # Save the new product
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)