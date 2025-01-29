from django.db import models
from django.contrib.auth.models import User

# Product model (if not already defined)
class Product(models.Model):
    # Categories (hierarchical)
    category_1 = models.CharField(max_length=100, blank=True, null=True)
    category_2 = models.CharField(max_length=100, blank=True, null=True)
    category_3 = models.CharField(max_length=100, blank=True, null=True)

    # Product details
    title = models.CharField(max_length=255)  # Product name
    product_rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.0)  # Rating out of 5
    selling_price = models.DecimalField(max_digits=10, decimal_places=2)  # Selling price
    mrp = models.DecimalField(max_digits=10, decimal_places=2)  # Maximum retail price

    # Seller details
    seller_name = models.CharField(max_length=255)  # Seller's name
    seller_rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.0)  # Seller rating out of 5

    # Additional details
    description = models.TextField(blank=True, null=True)  # Detailed description
    highlights = models.TextField(blank=True, null=True)  # Key features

    # Image links
    image_links = models.URLField(max_length=500, blank=True, null=True)  # URL or path to product image

    def __str__(self):
        return self.title

# Cart model
class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='carts')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Cart {self.id} for {self.user.username}"

    @property
    def total_price(self):
        return sum(item.total_price for item in self.items.all())

# CartItem model
class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"

    @property
    def total_price(self):
        return self.quantity * self.product.price

# Order model
class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    created_at = models.DateTimeField(auto_now_add=True)
    status_choices = [
        ('PENDING', 'Pending'),
        ('PROCESSING', 'Processing'),
        ('COMPLETED', 'Completed'),
        ('CANCELED', 'Canceled'),
    ]
    status = models.CharField(max_length=20, choices=status_choices, default='PENDING')
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)

    def __str__(self):
        return f"Order {self.id} by {self.user.username}"

# OrderItem model
class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.quantity} x {self.product.name} (Order {self.order.id})"
