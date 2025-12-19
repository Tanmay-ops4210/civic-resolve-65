import { useState } from 'react';
import { useGrievances, Grievance, GrievanceStatus } from '@/contexts/GrievanceContext';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { StatusBadge, PriorityBadge } from '@/components/ui/status-badge';
import { 
  Search, 
  Filter,
  Eye,
  Edit,
  Calendar,
  MapPin,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Save,
  User
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ITEMS_PER_PAGE = 10;

export default function AdminComplaints() {
  const { grievances, updateGrievance, categories, wards } = useGrievances();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [wardFilter, setWardFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedGrievance, setSelectedGrievance] = useState<Grievance | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState({
    status: '' as GrievanceStatus,
    assignedTo: '',
    remarks: ''
  });

  const filteredGrievances = grievances.filter(g => {
    const matchesSearch = g.trackingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.citizenName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || g.status === statusFilter;
    const matchesWard = wardFilter === 'all' || g.ward === wardFilter;
    const matchesCategory = categoryFilter === 'all' || g.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesWard && matchesCategory;
  });

  const totalPages = Math.ceil(filteredGrievances.length / ITEMS_PER_PAGE);
  const paginatedGrievances = filteredGrievances.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getCategoryLabel = (value: string) => {
    return categories.find(c => c.value === value)?.label || value;
  };

  const handleView = (grievance: Grievance) => {
    setSelectedGrievance(grievance);
    setIsViewOpen(true);
  };

  const handleEdit = (grievance: Grievance) => {
    setSelectedGrievance(grievance);
    setEditData({
      status: grievance.status,
      assignedTo: grievance.assignedTo || '',
      remarks: ''
    });
    setIsEditOpen(true);
  };

  const handleSaveEdit = () => {
    if (!selectedGrievance) return;

    const newTimeline = [...selectedGrievance.timeline];
    if (editData.status !== selectedGrievance.status) {
      newTimeline.push({
        id: Date.now().toString(),
        status: editData.status,
        message: editData.remarks || `Status updated to ${editData.status}`,
        timestamp: new Date(),
        by: 'Admin'
      });
    }

    updateGrievance(selectedGrievance.id, {
      status: editData.status,
      assignedTo: editData.assignedTo || undefined,
      timeline: newTimeline,
      adminRemarks: editData.remarks 
        ? [...(selectedGrievance.adminRemarks || []), editData.remarks]
        : selectedGrievance.adminRemarks
    });

    toast({
      title: "Complaint Updated",
      description: `Complaint ${selectedGrievance.trackingId} has been updated successfully.`,
    });

    setIsEditOpen(false);
    setSelectedGrievance(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Complaint Management</h1>
          <p className="text-muted-foreground">View and manage all citizen grievances</p>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="py-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by ID, name, or description..."
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  className="pl-10 h-10"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
                  <SelectTrigger className="w-[130px] h-10">
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
                <Select value={wardFilter} onValueChange={(v) => { setWardFilter(v); setCurrentPage(1); }}>
                  <SelectTrigger className="w-[130px] h-10">
                    <SelectValue placeholder="Ward" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Wards</SelectItem>
                    {wards.map((ward) => (
                      <SelectItem key={ward} value={ward}>{ward}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={categoryFilter} onValueChange={(v) => { setCategoryFilter(v); setCurrentPage(1); }}>
                  <SelectTrigger className="w-[140px] h-10">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-medium text-sm">Tracking ID</th>
                    <th className="text-left p-4 font-medium text-sm hidden md:table-cell">Citizen</th>
                    <th className="text-left p-4 font-medium text-sm hidden lg:table-cell">Category</th>
                    <th className="text-left p-4 font-medium text-sm">Ward</th>
                    <th className="text-left p-4 font-medium text-sm">Status</th>
                    <th className="text-left p-4 font-medium text-sm hidden md:table-cell">Date</th>
                    <th className="text-center p-4 font-medium text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedGrievances.map((grievance) => (
                    <tr key={grievance.id} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <span className="font-mono text-sm font-medium text-primary">
                          {grievance.trackingId}
                        </span>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <span className="text-sm">{grievance.citizenName}</span>
                      </td>
                      <td className="p-4 hidden lg:table-cell">
                        <span className="text-sm text-muted-foreground">
                          {getCategoryLabel(grievance.category)}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm">{grievance.ward}</span>
                      </td>
                      <td className="p-4">
                        <StatusBadge status={grievance.status} />
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <span className="text-sm text-muted-foreground">
                          {grievance.createdAt.toLocaleDateString()}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-1">
                          <Button variant="ghost" size="icon" onClick={() => handleView(grievance)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(grievance)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredGrievances.length)} of {filteredGrievances.length}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm px-2">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* View Modal */}
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                Complaint Details
                <span className="font-mono text-primary">{selectedGrievance?.trackingId}</span>
              </DialogTitle>
            </DialogHeader>
            {selectedGrievance && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Citizen</Label>
                    <p className="font-medium">{selectedGrievance.citizenName}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Status</Label>
                    <div className="mt-1">
                      <StatusBadge status={selectedGrievance.status} />
                    </div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Category</Label>
                    <p className="font-medium">{getCategoryLabel(selectedGrievance.category)}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Ward</Label>
                    <p className="font-medium">{selectedGrievance.ward}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Submitted</Label>
                    <p className="font-medium">{selectedGrievance.createdAt.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Assigned To</Label>
                    <p className="font-medium">{selectedGrievance.assignedTo || 'Not assigned'}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Description</Label>
                  <p className="mt-1">{selectedGrievance.description}</p>
                </div>
                {selectedGrievance.imageUrl && (
                  <div>
                    <Label className="text-muted-foreground">Attached Image</Label>
                    <img src={selectedGrievance.imageUrl} alt="Attachment" className="mt-1 rounded-lg max-h-48 object-cover" />
                  </div>
                )}
                <div>
                  <Label className="text-muted-foreground">Timeline</Label>
                  <div className="mt-2 space-y-2">
                    {selectedGrievance.timeline.map((event) => (
                      <div key={event.id} className="flex items-start gap-3 text-sm">
                        <StatusBadge status={event.status} />
                        <div className="flex-1">
                          <p>{event.message}</p>
                          <p className="text-xs text-muted-foreground">
                            {event.timestamp.toLocaleString()} by {event.by}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Modal */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Complaint Status</DialogTitle>
              <DialogDescription>
                Update the status and assignment for {selectedGrievance?.trackingId}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={editData.status} onValueChange={(v) => setEditData(prev => ({ ...prev, status: v as GrievanceStatus }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="escalated">Escalated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Assign To</Label>
                <Input
                  placeholder="Enter handler name"
                  value={editData.assignedTo}
                  onChange={(e) => setEditData(prev => ({ ...prev, assignedTo: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Remarks</Label>
                <Textarea
                  placeholder="Add a note or remark..."
                  value={editData.remarks}
                  onChange={(e) => setEditData(prev => ({ ...prev, remarks: e.target.value }))}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveEdit}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
