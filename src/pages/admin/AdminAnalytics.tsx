import { useGrievances } from '@/contexts/GrievanceContext';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp,
  MapPin,
  BarChart3,
  PieChart as PieChartIcon,
  Calendar,
  Info
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { Tooltip as UITooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useState } from 'react';

const COLORS = ['hsl(210, 70%, 50%)', 'hsl(185, 60%, 45%)', 'hsl(145, 65%, 42%)', 'hsl(38, 92%, 50%)', 'hsl(0, 72%, 50%)', 'hsl(280, 60%, 50%)'];

export default function AdminAnalytics() {
  const { grievances, getStats, categories, wards } = useGrievances();
  const [timeRange, setTimeRange] = useState('6months');
  const stats = getStats();

  // Ward data
  const wardData = Object.entries(stats.byWard)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // Category data
  const categoryData = Object.entries(stats.byCategory).map(([key, value]) => ({
    name: categories.find(c => c.value === key)?.label || key,
    value
  }));

  // Status distribution
  const statusData = [
    { name: 'Pending', value: stats.pending, color: 'hsl(38, 92%, 50%)' },
    { name: 'In Progress', value: stats.inProgress, color: 'hsl(200, 85%, 50%)' },
    { name: 'Resolved', value: stats.resolved, color: 'hsl(145, 65%, 42%)' },
    { name: 'Escalated', value: stats.escalated, color: 'hsl(0, 72%, 50%)' },
  ];

  // Monthly trend data
  const monthlyTrend = [
    { month: 'Jul', submitted: 120, resolved: 95, pending: 25 },
    { month: 'Aug', submitted: 145, resolved: 110, pending: 35 },
    { month: 'Sep', submitted: 132, resolved: 125, pending: 42 },
    { month: 'Oct', submitted: 168, resolved: 140, pending: 70 },
    { month: 'Nov', submitted: 155, resolved: 148, pending: 77 },
    { month: 'Dec', submitted: 180, resolved: 165, pending: 92 },
  ];

  // Resolution time by category
  const resolutionByCategory = categories.map(cat => ({
    name: cat.label,
    avgDays: Math.floor(Math.random() * 5) + 2
  }));

  // Performance metrics
  const performanceMetrics = [
    { label: 'Average Resolution Time', value: `${stats.avgResolutionDays.toFixed(1)} days`, trend: -12 },
    { label: 'Resolution Rate', value: `${((stats.resolved / stats.total) * 100).toFixed(1)}%`, trend: 8 },
    { label: 'Complaints This Month', value: '180', trend: 15 },
    { label: 'Citizen Satisfaction', value: '87%', trend: 3 },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Analytics Dashboard</h1>
            <p className="text-muted-foreground">Comprehensive grievance analytics and insights</p>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {performanceMetrics.map((metric, index) => (
            <Card key={index}>
              <CardContent className="pt-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{metric.label}</p>
                    <p className="text-2xl font-bold mt-1">{metric.value}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                    metric.trend > 0 
                      ? metric.label.includes('Time') ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                      : metric.label.includes('Time') ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {metric.trend > 0 ? '+' : ''}{metric.trend}%
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Status Distribution Pie */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5" />
                    Status Distribution
                  </CardTitle>
                  <CardDescription>Current complaint status breakdown</CardDescription>
                </div>
                <UITooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Shows the distribution of all complaints by their current status</p>
                  </TooltipContent>
                </UITooltip>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))' }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Category Analysis
                  </CardTitle>
                  <CardDescription>Complaints by category type</CardDescription>
                </div>
                <UITooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Breakdown of complaints by category</p>
                  </TooltipContent>
                </UITooltip>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-20} textAnchor="end" height={60} />
                    <YAxis />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))' }} />
                    <Bar dataKey="value" fill="hsl(210, 70%, 50%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trend Line Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Monthly Complaint Trends
                </CardTitle>
                <CardDescription>Submitted vs resolved complaints over time</CardDescription>
              </div>
              <UITooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Track complaint volume and resolution trends</p>
                </TooltipContent>
              </UITooltip>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))' }} />
                  <Legend />
                  <Area type="monotone" dataKey="submitted" stroke="hsl(210, 70%, 50%)" fill="hsl(210, 70%, 50%)" fillOpacity={0.2} name="Submitted" />
                  <Area type="monotone" dataKey="resolved" stroke="hsl(145, 65%, 42%)" fill="hsl(145, 65%, 42%)" fillOpacity={0.2} name="Resolved" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Ward-wise Heatmap Style Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Ward-wise Complaint Distribution
                </CardTitle>
                <CardDescription>Heatmap showing complaint density across Thane wards</CardDescription>
              </div>
              <UITooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Darker colors indicate higher complaint volume</p>
                </TooltipContent>
              </UITooltip>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {wardData.map((ward, index) => {
                const intensity = Math.min((ward.value / Math.max(...wardData.map(w => w.value))) * 100, 100);
                return (
                  <div
                    key={ward.name}
                    className="p-3 rounded-lg text-center transition-transform hover:scale-105 cursor-default"
                    style={{
                      backgroundColor: `hsl(210, 70%, ${100 - intensity * 0.5}%)`,
                      color: intensity > 50 ? 'white' : 'hsl(215, 25%, 15%)'
                    }}
                  >
                    <p className="text-xs font-medium truncate">{ward.name}</p>
                    <p className="text-lg font-bold">{ward.value}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Resolution Time by Category */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Average Resolution Time by Category</CardTitle>
            <CardDescription>How quickly different types of complaints are resolved</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={resolutionByCategory} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" unit=" days" />
                  <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                  <Tooltip 
                    formatter={(value) => [`${value} days`, 'Avg. Resolution']}
                    contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                  />
                  <Bar dataKey="avgDays" fill="hsl(185, 60%, 45%)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
