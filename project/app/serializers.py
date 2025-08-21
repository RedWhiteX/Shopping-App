from rest_framework import serializers
from .models import Category, Product, CartItem,Feedback
from django.contrib.auth.models import User
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

class ProductSerializer(serializers.ModelSerializer):
    category = serializers.StringRelatedField()  # returns category name
    category_name = serializers.ReadOnlyField(source='category.name')

    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'category', 'category_name','image']

class CartItemSerializer(serializers.ModelSerializer):
    product_detail = ProductSerializer(source='product', read_only=True)

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_detail', 'quantity', 'user']
        read_only_fields = ['user']



from rest_framework import serializers
from django.contrib.auth.models import User



class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password = serializers.CharField(
        write_only=True,
        min_length=5,  # Add minimum length
        style={'input_type': 'password'}
    )
    username = serializers.CharField(
        min_length=4,  # Add minimum length
        max_length=30
    )

    class Meta:
        model = User
        fields = ['username', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )
        user.is_active = True
        user.save()
        return user

# serializers.py
# class FeedbackSerializer(serializers.ModelSerializer):
#     user = serializers.CharField(source='user.username',read_only=True)

#     rating = serializers.FloatField(
#         min_value=1,
#         max_value=5,
#         error_messages={
#             'invalid': 'Please provide a number between 1-5',
#             'min_value': 'Rating cannot be less than 1',
#             'max_value': 'Rating cannot be more than 5'
#         }
#     )
    
#     class Meta:
#         model = Feedback
#         fields = ['id', 'product', 'user', 'content', 'rating', 'created_at']

#     def validate_rating(self, value):
#         """Ensure rating is in 0.5 increments"""
#         if not (isinstance(value, float) or isinstance(value, int)):
#             raise serializers.ValidationError("Rating must be a number")
        
#         # Round to nearest 0.5
#         rounded = round(value * 2) / 2
#         if rounded != value:
#             raise serializers.ValidationError("Rating must be in 0.5 increments (e.g., 1, 1.5, 2)")
        
#         return value.
class FeedbackSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)  # or serializers.SerializerMethodField()
    class Meta:
        model = Feedback
        fields = ['id', 'product', 'user', 'content', 'rating', 'created_at']
    def get_user(self, obj):
        return obj.user.username








# In your_app/serializers.py

from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Order, OrderItem, Product # Import your new models

# Serializer for the built-in User model
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # Fields to expose in the API for admins
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_staff', 'date_joined']


# A simple serializer just for showing product info inside an order
class OrderProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'image']


# Serializer for the OrderItem model
class OrderItemSerializer(serializers.ModelSerializer):
    product = OrderProductSerializer(read_only=True) # Nested product details

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'quantity', 'price']


# Main serializer for the Order model
class OrderSerializer(serializers.ModelSerializer):
    # 'items' is the related_name we set on the OrderItem model's ForeignKey
    items = OrderItemSerializer(many=True, read_only=True) 
    # Show username instead of just user ID
    user = serializers.StringRelatedField() 

    class Meta:
        model = Order
        fields = [
            'id', 
            'user', 
            'customer_name', 
            'customer_email', 
            'shipping_address',
            'total_price', 
            'status', 
            'created_at', 
            'items', # This will be a list of items in the order
            'shipping_address'
        ]



# In app/serializers.py

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

# ... keep all your other serializers ...

# ADD THIS NEW CLASS
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims to the token
        token['username'] = user.username
        token['is_staff'] = user.is_staff  # <-- This is the crucial line

        return token