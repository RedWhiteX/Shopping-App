import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, ShoppingCart, DollarSign, Download } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import api from '../../api';

// --- Reusable Components for a Clean Layout ---

const StatCard = ({ title, value, icon: Icon, change, loading }) => (
  <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-shadow duration-300">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</CardTitle>
      <Icon className="h-5 w-5 text-gray-400" />
    </CardHeader>
    <CardContent>
      {loading ? (
        <div className="space-y-2">
          <div className="h-8 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
      ) : (
        <>
          <div className="text-3xl font-bold text-black dark:text-white">{value}</div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{change}</p>
        </>
      )}
    </CardContent>
  </Card>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-black p-2 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        <p className="label text-sm text-black dark:text-white">{`${label}`}</p>
        <p className="intro text-sm text-blue-500">{`Sales : $${payload[0].value.toFixed(2)}`}</p>
      </div>
    );
  }
  return null;
};

// --- Main Dashboard Component ---

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [chartData, setChartData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month');

  useEffect(() => {
    const fetchAllDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch all data in parallel for better performance
        const [statsRes, chartRes, ordersRes] = await Promise.all([
          api.get(`/admin/dashboard-stats/?period=${period}`),
          api.get(`/admin/dashboard-chart/?period=${period}`),
          api.get('/admin/recent-orders/')
        ]);
        setStats(statsRes.data);
        setChartData(chartRes.data);
        setRecentOrders(ordersRes.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllDashboardData();
  }, [period]);

  const handleDownload = async () => {
    try {
      const response = await api.get(`/admin/reports/all/?period=${period}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `all_reports_${period}.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(`Failed to download report:`, error);
      alert('Failed to download report. Please try again.');
    }
  };

  const statCards = [
    { title: "Total Revenue", value: stats.total_revenue, icon: DollarSign, change: stats.revenue_change },
    { title: "Total Orders", value: stats.total_orders, icon: ShoppingCart, change: stats.orders_change },
    { title: "Active Users", value: stats.active_users, icon: Users, change: stats.users_change },
  ];

  const timePeriods = [
    { label: 'Today', value: 'day' }, { label: 'This Week', value: 'week' },
    { label: 'This Month', value: 'month' }, { label: 'This Year', value: 'year' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-black dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">An overview of your store's performance.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1 p-1 bg-gray-100 border border-gray-200 dark:bg-black rounded-lg">
            {timePeriods.map(p => (
              <button key={p.value} onClick={() => setPeriod(p.value)}
                className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${
                  period === p.value ? 'bg-white text-black dark:bg-black dark:text-white shadow' : 'text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white'
                }`}>
                {p.label}
              </button>
            ))}
          </div>
          <button onClick={handleDownload}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-blue-600 dark:bg-blue-500 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors shadow">
            <Download size={16} />
            Download Report
          </button>
        </div>
      </div>
      
      {/* Stat Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat, index) => <StatCard key={index} {...stat} loading={loading} />)}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Sales Chart */}
        <Card className="lg:col-span-3 bg-white dark:bg-black border-gray-200 dark:border-gray-700 shadow-sm">
          <CardHeader>
            <CardTitle className="text-black dark:text-white">Sales Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} className="stroke-gray-300 dark:stroke-gray-700"/>
                  <XAxis dataKey="name" tick={{ fill: 'currentColor' }} className="text-xs text-gray-500 dark:text-gray-400" />
                  <YAxis tick={{ fill: 'currentColor' }} className="text-xs text-gray-500 dark:text-gray-400" tickFormatter={(value) => `$${value}`} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(100, 100, 100, 0.1)' }}/>
                  <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Sales */}
        <Card className="lg:col-span-2 bg-white dark:bg-black border-gray-200 dark:border-gray-700 shadow-sm">
          <CardHeader>
            <CardTitle className="text-black dark:text-white">Recent Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map(order => (
                <div key={order.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-black dark:text-white">#{order.id} - {order.shipping_address?.firstName || 'Customer'}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <p className="font-bold text-black dark:text-white">${order.total_price}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;