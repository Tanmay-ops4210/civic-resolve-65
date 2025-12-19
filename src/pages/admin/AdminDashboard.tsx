import { useGrievances } from '@/contexts/GrievanceContext';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { StatCard } from '@/components/ui/stat-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  Users,
  MapPin,
  BarChart3
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const COLORS = ['hsl(210, 70%, 50%)', 'hsl(185, 60%, 45%)', 'hsl(145, 65%, 42%)', 'hsl(38, 92%, 50%)', 'hsl(0, 72%, 50%)'];

export default function AdminDashboard() {
  const { grievances, getStats, categories } = useGrievances();
  const stats = getStats();

  // Prepare chart data
  const wardData = Object.entries(stats.byWard)
    .map(([name, value]) => ({ name: name.length > 10 ? name.substring(0, 10) + '...' : name, value, fullName: name }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  const categoryData = Object.entries(stats.byCategory).map(([key, value]) => ({
    name: categories.find(c => c.value === key)?.label || key,
    value
  }));

  // Mock trend data
  const trendData = [
    { month: 'Jul', complaints: 120, resolved: 95 },
    { month: 'Aug', complaints: 145, resolved: 110 },
    { month: 'Sep', complaints: 132, resolved: 125 },
    { month: 'Oct', complaints: 168, resolved: 140 },
    { month: 'Nov', complaints: 155, resolved: 148 },
    { month: 'Dec', complaints: 180, resolved: 165 },
  ];

  const recentGrievances = grievances.slice(0, 5);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard Overview</h1>
          <p className="text-muted-foreground">Monitor grievance statistics and performance metrics</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Complaints"
            value={stats.total}
            icon={FileText}
            variant="primary"
            trend={{ value: 12, isPositive: false }}
          />
          <StatCard
            title="Pending"
            value={stats.pending}
            icon={Clock}
            variant="warning"
          />
          <StatCard
            title="In Progress"
            value={stats.inProgress}
            icon={AlertTriangle}
            variant="info"
          />
          <StatCard
            title="Resolved"
            value={stats.resolved}
            icon={CheckCircle2}
            variant="success"
            trend={{ value: 8, isPositive: true }}
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Resolution</p>
                  <p className="text-xl font-bold">{stats.avgResolutionDays.toFixed(1)} days</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-100">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Resolution Rate</p>
                  <p className="text-xl font-bold">{((stats.resolved / stats.total) * 100).toFixed(1)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-100">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Escalated</p>
                  <p className="text-xl font-bold">{stats.escalated}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-sky-100">
                  <Users className="h-5 w-5 text-sky-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Wards</p>
                  <p className="text-xl font-bold">{Object.keys(stats.byWard).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Ward-wise Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Ward-wise Distribution
              </CardTitle>
              <CardDescription>Complaints by ward (Top 8)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={wardData} layout="vertical" margin={{ left: 20, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12 }} />
                    <Tooltip 
                      formatter={(value, name, props) => [value, props.payload.fullName]}
                      contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                    />
                    <Bar dataKey="value" fill="hsl(210, 70%, 50%)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Category Distribution
              </CardTitle>
              <CardDescription>Complaints by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      labelLine={false}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Monthly Trends
            </CardTitle>
            <CardDescription>Complaints submitted vs resolved over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ left: 0, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))' }} />
                  <Line 
                    type="monotone" 
                    dataKey="complaints" 
                    stroke="hsl(210, 70%, 50%)" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(210, 70%, 50%)' }}
                    name="Submitted"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="resolved" 
                    stroke="hsl(145, 65%, 42%)" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(145, 65%, 42%)' }}
                    name="Resolved"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Complaints */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Complaints</CardTitle>
            <CardDescription>Latest grievances requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentGrievances.map((grievance) => (
                <div
                  key={grievance.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-medium text-primary">
                        {grievance.trackingId}
                      </span>
                      <StatusBadge status={grievance.status} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {grievance.ward} • {categories.find(c => c.value === grievance.category)?.label}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {grievance.createdAt.toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
