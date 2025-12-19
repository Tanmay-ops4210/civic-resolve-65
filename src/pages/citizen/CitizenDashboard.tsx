import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useGrievances } from '@/contexts/GrievanceContext';
import { CitizenLayout } from '@/components/layout/CitizenLayout';
import { StatCard } from '@/components/ui/stat-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  PlusCircle,
  Search,
  ArrowRight
} from 'lucide-react';

export default function CitizenDashboard() {
  const { user } = useAuth();
  const { grievances } = useGrievances();
  
  // Filter grievances for current user (demo: show first 5)
  const userGrievances = grievances.slice(0, 5);
  const stats = {
    total: userGrievances.length,
    resolved: userGrievances.filter(g => g.status === 'resolved').length,
    pending: userGrievances.filter(g => g.status === 'pending').length,
    inProgress: userGrievances.filter(g => g.status === 'in-progress').length,
  };

  return (
    <CitizenLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Welcome, {user?.name?.split(' ')[0]}!
            </h1>
            <p className="text-muted-foreground">
              Track your grievances and submit new complaints
            </p>
          </div>
          <div className="flex gap-2">
            <Link to="/citizen/track">
              <Button variant="outline" className="gap-2">
                <Search className="h-4 w-4" />
                Track Grievance
              </Button>
            </Link>
            <Link to="/citizen/submit">
              <Button className="gap-2">
                <PlusCircle className="h-4 w-4" />
                Submit Grievance
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            title="Total Complaints"
            value={stats.total}
            icon={FileText}
            variant="primary"
          />
          <StatCard
            title="Resolved"
            value={stats.resolved}
            icon={CheckCircle2}
            variant="success"
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
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <PlusCircle className="h-5 w-5 text-primary" />
                Submit New Grievance
              </CardTitle>
              <CardDescription>
                Report issues related to water supply, roads, garbage, or other civic problems
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/citizen/submit">
                <Button className="w-full">
                  Submit Grievance
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Search className="h-5 w-5 text-primary" />
                Track Your Complaint
              </CardTitle>
              <CardDescription>
                Enter your tracking ID to check the current status of your grievance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/citizen/track">
                <Button variant="outline" className="w-full">
                  Track Status
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Complaints */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Complaints</CardTitle>
              <CardDescription>Your recently submitted grievances</CardDescription>
            </div>
            <Link to="/citizen/history">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {userGrievances.length > 0 ? (
              <div className="space-y-3">
                {userGrievances.slice(0, 3).map((grievance) => (
                  <div
                    key={grievance.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-medium text-primary">
                          {grievance.trackingId}
                        </span>
                        <StatusBadge status={grievance.status} />
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {grievance.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {grievance.ward} • {grievance.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                    <Link to={`/citizen/track?id=${grievance.trackingId}`}>
                      <Button variant="ghost" size="sm">
                        View Details
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No complaints submitted yet</p>
                <Link to="/citizen/submit">
                  <Button className="mt-4">Submit Your First Grievance</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Banner */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="flex flex-col md:flex-row items-center gap-4 py-4">
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">Need Help?</h3>
              <p className="text-sm text-muted-foreground">
                Contact the helpdesk at 1800-XXX-XXXX or email support@thane.gov.in
              </p>
            </div>
            <Button variant="outline">Contact Support</Button>
          </CardContent>
        </Card>
      </div>
    </CitizenLayout>
  );
}
