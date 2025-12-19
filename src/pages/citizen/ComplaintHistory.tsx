import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGrievances, GrievanceStatus } from '@/contexts/GrievanceContext';
import { CitizenLayout } from '@/components/layout/CitizenLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatusBadge } from '@/components/ui/status-badge';
import { 
  Search, 
  Filter,
  FileText,
  ArrowRight,
  Calendar,
  MapPin
} from 'lucide-react';

export default function ComplaintHistory() {
  const { grievances, categories, wards } = useGrievances();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [wardFilter, setWardFilter] = useState<string>('all');

  // Demo: show first 20 grievances as user's complaints
  const userGrievances = grievances.slice(0, 20);

  const filteredGrievances = userGrievances.filter(g => {
    const matchesSearch = g.trackingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || g.status === statusFilter;
    const matchesWard = wardFilter === 'all' || g.ward === wardFilter;
    return matchesSearch && matchesStatus && matchesWard;
  });

  const getCategoryLabel = (value: string) => {
    return categories.find(c => c.value === value)?.label || value;
  };

  return (
    <CitizenLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Complaints</h1>
          <p className="text-muted-foreground">View and track all your submitted grievances</p>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="py-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by Tracking ID or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10"
                />
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px] h-10">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="escalated">Escalated</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={wardFilter} onValueChange={setWardFilter}>
                  <SelectTrigger className="w-[140px] h-10">
                    <MapPin className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Ward" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Wards</SelectItem>
                    {wards.map((ward) => (
                      <SelectItem key={ward} value={ward}>{ward}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {filteredGrievances.length > 0 ? (
          <div className="space-y-3">
            {filteredGrievances.map((grievance) => (
              <Card key={grievance.id} className="hover:shadow-md transition-shadow">
                <CardContent className="py-4">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-sm font-bold text-primary">
                          {grievance.trackingId}
                        </span>
                        <StatusBadge status={grievance.status} />
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                          {getCategoryLabel(grievance.category)}
                        </span>
                      </div>
                      <p className="text-sm text-foreground line-clamp-2">
                        {grievance.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {grievance.ward}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {grievance.createdAt.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Link to={`/citizen/track?id=${grievance.trackingId}`}>
                      <Button variant="outline" size="sm" className="whitespace-nowrap">
                        View Details
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {searchTerm || statusFilter !== 'all' || wardFilter !== 'all' 
                  ? 'No matching complaints found'
                  : 'No complaints yet'}
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-4">
                {searchTerm || statusFilter !== 'all' || wardFilter !== 'all'
                  ? 'Try adjusting your filters or search term.'
                  : 'You haven\'t submitted any grievances yet. Submit your first complaint to get started.'}
              </p>
              {!(searchTerm || statusFilter !== 'all' || wardFilter !== 'all') && (
                <Link to="/citizen/submit">
                  <Button>Submit Grievance</Button>
                </Link>
              )}
            </CardContent>
          </Card>
        )}

        {/* Summary */}
        {filteredGrievances.length > 0 && (
          <p className="text-sm text-muted-foreground text-center">
            Showing {filteredGrievances.length} of {userGrievances.length} complaints
          </p>
        )}
      </div>
    </CitizenLayout>
  );
}
