from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import get_object_or_404, redirect
from .models import Product, Cart, CartItem, OrderItem, Order
from django.core.files.storage import FileSystemStorage
from inference_sdk import InferenceHTTPClient
# Create your views here.

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
        if "image" not in request.FILES:
            return JsonResponse({"error": "No image file uploaded"}, status=400)

        uploaded_file = request.FILES["image"]
        
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


