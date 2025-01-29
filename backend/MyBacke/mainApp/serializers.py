# serializers.py
from rest_framework import serializers
from .models import Review,Product

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['product', 'user_name', 'user_email', 'rating', 'comment']


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            'id', 'title', 'selling_price', 'category_1', 'category_2', 'category_3', 
            'product_rating', 'mrp', 'seller_name', 'seller_rating', 'description', 
            'highlights', 'image_links'
        ]