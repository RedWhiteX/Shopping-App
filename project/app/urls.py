
from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
    CategoryViewSet, ProductViewSet, CartItemViewSet, OrderStatusUpdateView,
    DashboardStatsView, AllReportsExportView, RegisterView, user_profile,
    FeedbackViewSet, OrderCreateView, UserViewSet, OrderListView,
    OrderDetailView, OrderDeleteView, DashboardChartView, RecentOrdersView
)

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'products', ProductViewSet)
router.register(r'cart', CartItemViewSet, basename='cart')
router.register(r'feedbacks', FeedbackViewSet, basename='feedback')
router.register(r'admin/users', UserViewSet, basename='admin-users')

# The router handles its own URLs. We add the specific paths below it.
urlpatterns = router.urls + [
    # User and Public Routes
    path('user/register/', RegisterView.as_view(), name='register'),
    path('user/profile/', user_profile),
    path('orders/create/', OrderCreateView.as_view(), name='create-order'),

    # Admin Order Management Routes
    path('admin/orders/', OrderListView.as_view(), name='order-list'),
    path('admin/orders/<int:pk>/', OrderDetailView.as_view(), name='order-detail'),
    path("admin/orders/<int:pk>/delete/", OrderDeleteView.as_view()),
    path("admin/orders/<int:pk>/update-status/", OrderStatusUpdateView.as_view()),


    # Admin Dashboard Routes
    path('admin/dashboard-stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
    path('admin/reports/all/', AllReportsExportView.as_view(), name='export-all-reports'),
    path('admin/dashboard-chart/', DashboardChartView.as_view(), name='dashboard-chart'),
    path('admin/recent-orders/', RecentOrdersView.as_view(), name='recent-orders'),
]