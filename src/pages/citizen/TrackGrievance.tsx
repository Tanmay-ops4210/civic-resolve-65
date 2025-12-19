import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGrievances, Grievance } from '@/contexts/GrievanceContext';
import { CitizenLayout } from '@/components/layout/CitizenLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Tag,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  User
} from 'lucide-react';

export default function TrackGrievance() {
  const [searchParams] = useSearchParams();
  const [trackingId, setTrackingId] = useState(searchParams.get('id') || '');
  const [grievance, setGrievance] = useState<Grievance | null>(null);
  const [searched, setSearched] = useState(false);
  const { getGrievanceByTrackingId, categories } = useGrievances();

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      setTrackingId(id);
      handleSearch(id);
    }
  }, [searchParams]);

  const handleSearch = (id?: string) => {
    const searchId = id || trackingId;
    if (!searchId.trim()) return;
    
    const found = getGrievanceByTrackingId(searchId.trim());
    setGrievance(found || null);
    setSearched(true);
  };

  const getCategoryLabel = (value: string) => {
    return categories.find(c => c.value === value)?.label || value;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'in-progress': return <AlertCircle className="h-4 w-4" />;
      case 'resolved': return <CheckCircle2 className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <CitizenLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Search Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Search className="h-5 w-5" />
              Track Your Grievance
            </CardTitle>
            <CardDescription>
              Enter your tracking ID to check the current status of your complaint
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Label htmlFor="trackingId" className="sr-only">Tracking ID</Label>
                <Input
                  id="trackingId"
                  placeholder="Enter Tracking ID (e.g., TMC2024001)"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="h-12 font-mono"
                />
              </div>
              <Button onClick={() => handleSearch()} className="h-12 px-8">
                <Search className="h-4 w-4 mr-2" />
                Track
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {searched && (
          grievance ? (
            <div className="space-y-6">
              {/* Grievance Details */}
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Tracking ID</p>
                      <CardTitle className="text-2xl font-mono text-primary">
                        {grievance.trackingId}
                      </CardTitle>
                    </div>
                    <StatusBadge status={grievance.status} className="text-sm px-4 py-1" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <Tag className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Category</p>
                        <p className="font-medium">{getCategoryLabel(grievance.category)}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Ward</p>
                        <p className="font-medium">{grievance.ward}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Submitted On</p>
                        <p className="font-medium">{grievance.createdAt.toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <User className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Assigned To</p>
                        <p className="font-medium">{grievance.assignedTo || 'Not assigned yet'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-sm text-muted-foreground mb-2">Description</p>
                    <p className="text-foreground">{grievance.description}</p>
                  </div>

                  {grievance.imageUrl && (
                    <div className="border-t pt-4">
                      <p className="text-sm text-muted-foreground mb-2">Attached Image</p>
                      <img 
                        src={grievance.imageUrl} 
                        alt="Grievance attachment" 
                        className="rounded-lg max-h-64 object-cover"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Status Timeline</CardTitle>
                  <CardDescription>Track the progress of your complaint</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
                    <div className="space-y-6">
                      {grievance.timeline.map((event, index) => (
                        <div key={event.id} className="relative flex gap-4">
                          <div className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                            event.status === 'resolved' 
                              ? 'border-emerald-500 bg-emerald-100 text-emerald-600'
                              : event.status === 'in-progress'
                              ? 'border-sky-500 bg-sky-100 text-sky-600'
                              : 'border-amber-500 bg-amber-100 text-amber-600'
                          }`}>
                            {getStatusIcon(event.status)}
                          </div>
                          <div className="flex-1 pb-2">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                              <p className="font-medium text-foreground">{event.message}</p>
                              <p className="text-xs text-muted-foreground">
                                {event.timestamp.toLocaleDateString()} at {event.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                            <p className="text-sm text-muted-foreground">By: {event.by}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No Grievance Found
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  We couldn't find any grievance with tracking ID "{trackingId}". 
                  Please check the ID and try again.
                </p>
              </CardContent>
            </Card>
          )
        )}

        {/* Help Section */}
        <Card className="bg-muted/50">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-foreground">Can't find your Tracking ID?</p>
                <p className="text-muted-foreground">
                  Check your email or SMS for the confirmation message sent after submission. 
                  If you still can't find it, contact the helpdesk at 1800-XXX-XXXX.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </CitizenLayout>
  );
}
