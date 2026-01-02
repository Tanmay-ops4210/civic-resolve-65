import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useGrievances, GrievanceCategory } from '@/contexts/GrievanceContext';
import { CitizenLayout } from '@/components/layout/CitizenLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Upload, 
  X, 
  Loader2, 
  CheckCircle2,
  FileImage,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import GrievanceMap from '@/components/ui/GrievanceMap';

export default function SubmitGrievance() {
  const { user } = useAuth();
  const { addGrievance, wards, categories } = useGrievances();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    category: '' as GrievanceCategory | '',
    ward: '',
    description: '',
  });
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const handleLocationSelect = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.category || !formData.ward || !formData.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedLocation) {
      toast({
        title: "Location Required",
        description: "Please pinpoint the location on the map.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('category', formData.category);
      formDataToSend.append('ward', formData.ward);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('latitude', selectedLocation.lat.toString());
      formDataToSend.append('longitude', selectedLocation.lng.toString());
      formDataToSend.append('priority', 'medium');
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      const token = localStorage.getItem('auth_token');
      const response = await fetch('http://localhost:5001/api/grievances', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formDataToSend,
      });

      const result = await response.json();
      
      if (response.ok) {
        setSubmittedId(result.data.tracking_id);
        toast({
          title: "Success",
          description: "Grievance submitted successfully!",
        });
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to submit grievance",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while submitting",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submittedId) {
    return (
      <CitizenLayout>
        <div className="max-w-lg mx-auto">
          <Card className="text-center">
            <CardContent className="pt-8 pb-8">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Grievance Submitted Successfully!
              </h2>
              <p className="text-muted-foreground mb-6">
                Your complaint has been registered with the Municipal Corporation.
              </p>
              
              <div className="bg-muted rounded-lg p-4 mb-6">
                <p className="text-sm text-muted-foreground mb-1">Your Tracking ID</p>
                <p className="text-2xl font-mono font-bold text-primary">{submittedId}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Save this ID to track your complaint status
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button onClick={() => navigate(`/citizen/track?id=${submittedId}`)}>
                  Track Status
                </Button>
                <Button variant="outline" onClick={() => {
                  setSubmittedId(null);
                  setFormData({ category: '', ward: '', description: '' });
                  setImageFile(null);
                  setImagePreview(null);
                }}>
                  Submit Another
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </CitizenLayout>
    );
  }

  return (
    <CitizenLayout>
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Submit New Grievance</CardTitle>
            <CardDescription>
              Fill in the details below to register your complaint with Thane Municipal Corporation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Category of Complaint *</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(v) => setFormData(prev => ({ ...prev, category: v as GrievanceCategory }))}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select complaint category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Ward */}
              <div className="space-y-2">
                <Label htmlFor="ward">Ward *</Label>
                <Select 
                  value={formData.ward} 
                  onValueChange={(v) => setFormData(prev => ({ ...prev, ward: v }))}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select your ward" />
                  </SelectTrigger>
                  <SelectContent>
                    {wards.map((ward) => (
                      <SelectItem key={ward} value={ward}>{ward}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Exact Location Map */}
              <div className="space-y-2">
                <Label>Pinpoint Exact Location *</Label>
                <GrievanceMap 
                  onLocationSelect={handleLocationSelect} 
                  selectedLocation={selectedLocation} 
                />
                {selectedLocation && (
                  <p className="text-xs text-muted-foreground">
                    Selected: {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Complaint Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your issue in detail. Include location, time of occurrence, and any other relevant information..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={5}
                  className="resize-none"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Minimum 20 characters. Be specific about the issue and location.
                </p>
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Attach Image (Optional)</Label>
                {!imagePreview ? (
                  <div className="border-2 border-dashed border-input rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm font-medium text-foreground">
                        Click to upload an image
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PNG, JPG up to 5MB
                      </p>
                    </label>
                  </div>
                ) : (
                  <div className="relative rounded-lg overflow-hidden border">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-48 object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-1 bg-foreground/80 text-background rounded-full hover:bg-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/60 to-transparent p-3">
                      <div className="flex items-center gap-2 text-background">
                        <FileImage className="h-4 w-4" />
                        <span className="text-sm">{imageFile?.name}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  type="submit" 
                  className="flex-1 h-12"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Submit Grievance
                    </>
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => navigate('/citizen')}
                  className="h-12"
                >
                  Cancel
                </Button>
              </div>

              {/* Info */}
              <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">Important</p>
                  <p>After submission, you will receive a unique Tracking ID. Use this ID to track the status of your complaint.</p>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </CitizenLayout>
  );
}
