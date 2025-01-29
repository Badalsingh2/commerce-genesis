"""
URL configuration for MyBacke project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from mainApp import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/sample/',views.sample_data,name='sample_data'),
    path('api/register/', views.register_user, name='register_user'),
    path('api/login/', views.login_user, name='login_user'),
    path('api/logout/', views.logout_user, name='logout_user'),
    path('api/user/<int:user_id>/', views.get_user_by_id, name='get_user_by_id'),
    path('add-to-cart/', views.add_to_cart, name='add_to_cart'),
    path('cart/<int:user_id>/', views.cart_detail, name='cart_detail'),
    path('place-order/', views.place_order, name='place_order'),
    path('add-product/', views.add_product, name='add_product'),
    path('orders/<int:user_id>/', views.view_orders, name='view_orders'),
    path('upload/', views.image_upload, name='image_upload'),
    path('summarize/', views.summarize_review, name='summarize_review'),
    path('add-review/', views.add_review, name='add_review'),
    path('reviews/<int:product_id>/', views.get_reviews_by_product, name='get_reviews_by_product'),
    path('reviews-and-summary/<int:product_id>/', views.get_reviews_and_summarize, name='get_reviews_and_summarize'),
    path('directions/', views.get_directions, name='get_directions'),
    path('predict/', views.predict, name='predict'),
    path("recommend/<int:product_id>/", views.recommend_view, name="recommend_products"),
    path('products/', views.get_all_products, name='get_all_products'),
    path('categories/', views.get_all_categories, name='all_categories'),
    path('getproducts/', views.ProductByCategoryView.as_view(), name='product_by_category'),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
