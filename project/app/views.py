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



from rest_framework import viewsets, permissions
from .models import Order, User # Make sure you have an Order model
from .serializers import OrderSerializer, UserSerializer # Create these serializers

# You will need to create an Order model and serializer if you don't have one.
# This is just a placeholder example.
class OrderViewSet(viewsets.ModelViewSet):
    """
    API endpoint for admins to view all orders.
    """
    queryset = Order.objects.all().order_by('-created_at')
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAdminUser] # IMPORTANT: Only admins can access

class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint for admins to view all users.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer # You will need to create this
    permission_classes = [permissions.IsAdminUser] # IMPORTANT: Only admins can access




# In app/views.py

from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import MyTokenObtainPairSerializer # <-- Import the new serializer

# ... keep all your other views ...

# ADD THIS NEW VIEW
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer




# data base store the oders
# In app/views.py
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Order, OrderItem, Product
from .serializers import OrderSerializer



from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Order, OrderItem
# ... other imports



class OrderCreateView(APIView):
    permission_classes = []  # This is correct, allows anyone to create an order

    def post(self, request, *args, **kwargs):
        data = request.data
        customer_info = data.get('customerInfo')
        items = data.get('items')

        if not customer_info or not items:
            return Response({'error': 'Missing customer info or items'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # --- THIS IS THE FIX (PART 1) ---
            # Handle both logged-in users and guest users gracefully.
            current_user = None
            if request.user.is_authenticated:
                current_user = request.user

            # Create the main Order object
            order = Order.objects.create(
                user=current_user,  # Assigns the user if they exist, otherwise it's NULL
                total_price=data.get('total'),
                status='Processing',
                shipping_address=customer_info
            )

            # --- THIS IS THE FIX (PART 2) ---
            # Loop through items and ensure each one is valid before creating it.
            for item in items:
                product_id = item.get('id')
                if not product_id:
                    # Skip items that don't have an ID
                    continue
                
                # Check if the product actually exists in the database
                try:
                    product = Product.objects.get(id=product_id)
                    OrderItem.objects.create(
                        order=order,
                        product=product,  # Use the actual product instance
                        quantity=item.get('quantity'),
                        price=item.get('price')
                    )
                except Product.DoesNotExist:
                    # If a product in the cart doesn't exist, we can't create an order item for it.
                    # We will log this and continue, but in a real app you might want to cancel the whole order.
                    print(f"Warning: Product with ID {product_id} not found. Skipping item.")

            return Response({'success': 'Order created successfully', 'order_id': order.id}, status=status.HTTP_201_CREATED)

        except Exception as e:
            # This will catch any other unexpected errors and prevent a server crash.
            # It will also tell you in the terminal exactly what went wrong.
            print(f"--- SERVER CRASHED --- \nError creating order: {e}")
            return Response({'error': 'An internal server error occurred.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


from rest_framework.generics import ListAPIView, RetrieveAPIView , DestroyAPIView , UpdateAPIView # 👈 Add RetrieveAPIView
from rest_framework.permissions import IsAdminUser
class OrderListView(ListAPIView):
    queryset = Order.objects.all().order_by('-created_at')
    serializer_class = OrderSerializer
    permission_classes = [IsAdminUser] # This is correct now that you are a superuser

    # This method ensures the data is sent in the correct format
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        
        unread_count = queryset.filter(is_read=False).count()
        
        # This creates the {'orders': ..., 'unread_count': ...} structure
        data = {
            'orders': serializer.data,
            'unread_count': unread_count
        }
        return Response(data)


# 👇 ADD THIS ENTIRE CLASS
class OrderDetailView(RetrieveAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAdminUser] 


class OrderDeleteView(DestroyAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer # Not strictly needed for delete, but good practice
    permission_classes = [IsAdminUser]    



class OrderStatusUpdateView(UpdateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer # You can reuse the main serializer
    permission_classes = [IsAdminUser]

    # This method is called when a PATCH request is made
    def partial_update(self, request, *args, **kwargs):
        order = self.get_object() # Get the specific order by its ID
        new_status = request.data.get('status') # Get the new status from the request

        if new_status:
            order.status = new_status
            order.save()
            return Response({'success': 'Status updated'}, status=status.HTTP_200_OK)
        
        return Response({'error': 'Status not provided'}, status=status.HTTP_400_BAD_REQUEST)






# In your app's views.py
from django.utils import timezone
from datetime import timedelta
from django.db.models import Sum, Count
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from .models import Order

User = get_user_model()

class DashboardStatsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, *args, **kwargs):
        period = request.query_params.get('period', 'month') # Default to month

        # Determine the start date based on the period
        now = timezone.now()
        if period == 'day':
            start_date = now - timedelta(days=1)
        elif period == 'week':
            start_date = now - timedelta(weeks=1)
        elif period == 'year':
            start_date = now - timedelta(days=365)
        else: # Default to month
            start_date = now - timedelta(days=30)
        
        # Filter orders within the date range
        orders_in_period = Order.objects.filter(created_at__gte=start_date)

        # Calculate total revenue
        total_revenue_data = orders_in_period.aggregate(total=Sum('total_price'))
        total_revenue = total_revenue_data['total'] or 0

        # Count total orders
        total_orders = orders_in_period.count()

        # Count active users (example: users who logged in recently)
        active_users = User.objects.filter(last_login__gte=start_date).count()

        # Prepare the data to send to the frontend
        stats = {
            'total_revenue': f"${total_revenue:,.2f}",
            'total_orders': f"+{total_orders}",
            'active_users': f"+{active_users}",
            # You can add change percentages here if needed
            'revenue_change': "+20.1% from last month", 
            'orders_change': "+180.1% from last month",
            'users_change': "+19% from last month"
        }

        return Response(stats)


# In your app's views.py
# In your app's views.py
# In your app's views.py
# ... other imports

# You can keep the get_start_date_from_period helper function

# REMOVE the old OrdersExportView and UsersExportView classes

# 👇 ADD THIS NEW, SINGLE VIEW
# In your app's views.py
# In your app's views.py

# ... other imports ...


# 👇 ADD THIS ENTIRE HELPER FUNCTION 👇
def get_start_date_from_period(period):
    now = timezone.now()
    if period == 'day':
        return now - timedelta(days=1)
    elif period == 'week':
        return now - timedelta(weeks=1)
    elif period == 'year':
        return now - timedelta(days=365)
    else: # Default to month
        return now - timedelta(days=30)





import pandas as pd
import io
import json
from django.http import HttpResponse
from django.utils import timezone
from datetime import timedelta
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.permissions import IsAdminUser
from .models import Order

User = get_user_model()
# ... (keep your get_start_date_from_period helper function)

class AllReportsExportView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, *args, **kwargs):
        period = request.query_params.get('period', 'year')
        start_date = get_start_date_from_period(period)

        orders = Order.objects.filter(created_at__gte=start_date).order_by('-created_at')
        users = User.objects.filter(date_joined__gte=start_date).order_by('-date_joined')

        orders_data = []
        for o in orders:
            # --- THIS IS THE FIX ---
            # Safely parse the shipping_address, whether it's a string, dict, or None
            customer_info = {}
            if isinstance(o.shipping_address, dict):
                customer_info = o.shipping_address
            elif isinstance(o.shipping_address, str) and o.shipping_address:
                try:
                    # Try to parse the string into a dictionary
                    customer_info = json.loads(o.shipping_address)
                except json.JSONDecodeError:
                    # If it's a bad string, keep it as an empty dictionary
                    customer_info = {}
            # ---------------------

            orders_data.append({
                'Order ID': o.id,
                'Customer Name': f"{customer_info.get('firstName', 'N/A')} {customer_info.get('lastName', '')}",
                'Email': customer_info.get('email', 'N/A'),
                'Total Price': o.total_price,
                'Status': o.status,
                'Date': o.created_at.strftime('%Y-%m-%d')
            })
        
        users_data = [{
            'User ID': u.id,
            'Username': u.username,
            'Email': u.email,
            'Date Joined': u.date_joined.strftime('%Y-%m-%d'),
            'Is Staff': u.is_staff
        } for u in users]

        orders_df = pd.DataFrame(orders_data)
        users_df = pd.DataFrame(users_data)

        if not orders_df.empty:
            sales_df = orders_df[['Date', 'Total Price', 'Status']]
        else:
            sales_df = pd.DataFrame(columns=['Date', 'Total Price', 'Status'])
        
        output = io.BytesIO()
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            orders_df.to_excel(writer, sheet_name='Orders', index=False)
            sales_df.to_excel(writer, sheet_name='Sales', index=False)
            users_df.to_excel(writer, sheet_name='Users', index=False)
        
        output.seek(0)

        filename = f"all_reports_{period}.xlsx"
        response = HttpResponse(
            output,
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        response['Content-Disposition'] = f'attachment; filename="{filename}"'

        return response



from django.db.models.functions import TruncDay


class DashboardChartView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, *args, **kwargs):
        period = request.query_params.get('period', 'month')
        start_date = get_start_date_from_period(period)

        # Group orders by day and calculate total sales for each day
        sales_data = Order.objects.filter(created_at__gte=start_date) \
            .annotate(day=TruncDay('created_at')) \
            .values('day') \
            .annotate(total_sales=Sum('total_price')) \
            .order_by('day')

        # Format data for the chart
        chart_data = [
            {
                'name': data['day'].strftime('%b %d'),
                'total': float(data['total_sales'])
            } for data in sales_data
        ]
        return Response(chart_data)

class RecentOrdersView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, *args, **kwargs):
        # Get the 5 most recent orders
        recent_orders = Order.objects.all().order_by('-created_at')[:5]
        # Use your existing serializer to format the data
        serializer = OrderSerializer(recent_orders, many=True)
        return Response(serializer.data)


 