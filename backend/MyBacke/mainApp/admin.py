from django.contrib import admin
from .models import Product, Cart, CartItem, Order, OrderItem,Review

# Register the Product model
from django.utils.html import format_html

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'category_1', 'selling_price', 'mrp', 'product_rating', 'seller_name', 'image_preview')
    search_fields = ('title', 'category_1', 'category_2', 'category_3', 'seller_name')
    list_filter = ('selling_price', 'category_1', 'category_2', 'seller_rating')

    def image_preview(self, obj):
        if obj.image_links:
            return format_html('<img src="{}" width="50" height="50" style="border-radius: 5px;" />', obj.image_links)
        return "No Image"

    image_preview.short_description = "Image Preview"

# Register the Cart model
@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'created_at')
    search_fields = ('user__username',)

# Register the CartItem model
@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'cart', 'product', 'quantity', 'total_price')
    list_filter = ('product',)

# Register the Order model
@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'status', 'total_price', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('user__username',)

# Register the OrderItem model
@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'order', 'product', 'quantity', 'price')
    search_fields = ('order__user__username', 'product__name')


admin.site.register(Review) 