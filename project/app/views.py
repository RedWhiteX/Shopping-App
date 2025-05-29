from rest_framework import viewsets, permissions
from rest_framework.permissions import IsAuthenticated,AllowAny 
from .models import Category, Product, CartItem,Feedback
from .serializers import CategorySerializer, ProductSerializer, CartItemSerializer
from .serializers import RegisterSerializer,FeedbackSerializer
from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework import status


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        category = self.request.query_params.get("category")
        if category:
            return self.queryset.filter(category__iexact=category)
        return self.queryset

class CartItemViewSet(viewsets.ModelViewSet):
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CartItem.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

    

# views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    user = request.user
    return Response({
        "username": user.username,
        "password": user.password,
    })



# views.py
# from .permissions import IsAuthorOrReadOnly
# from rest_framework import permissions

# class FeedbackViewSet(viewsets.ModelViewSet):
#     serializer_class = FeedbackSerializer
#     permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsAuthorOrReadOnly]

#     def get_queryset(self):
#         return Feedback.objects.all()

#     def perform_create(self, serializer):
#         serializer.save(user=self.request.user)
from rest_framework import viewsets, permissions
from .models import Feedback
from .serializers import FeedbackSerializer

from .permissions import IsOwnerOrReadOnly

class FeedbackViewSet(viewsets.ModelViewSet):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]


    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        product_id = self.request.query_params.get('product')
        if product_id:
            return Feedback.objects.filter(product_id=product_id).order_by('-created_at')
        return Feedback.objects.all().order_by('-created_at')

    