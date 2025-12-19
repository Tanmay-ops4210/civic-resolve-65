import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, FileText, Search, BarChart3, Shield, Users, CheckCircle2, ArrowRight } from 'lucide-react';

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-lg font-bold text-foreground">Municipal Grievance Portal</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Thane Municipal Corporation</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/login"><Button variant="outline">Sign In</Button></Link>
            <Link to="/register"><Button>Register</Button></Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Your Voice, Our Priority
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Submit civic grievances, track resolution status, and help improve our city. 
            A transparent platform for citizen-government collaboration.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register"><Button size="lg" className="gap-2"><FileText className="h-5 w-5" />Submit Grievance</Button></Link>
            <Link to="/login"><Button size="lg" variant="outline" className="gap-2"><Search className="h-5 w-5" />Track Complaint</Button></Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: FileText, title: 'Submit', desc: 'Register your complaint with details and optional images' },
            { icon: Search, title: 'Track', desc: 'Monitor status with your unique tracking ID' },
            { icon: CheckCircle2, title: 'Resolved', desc: 'Get timely resolution and updates' }
          ].map((f, i) => (
            <Card key={i} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-8 pb-6">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <f.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: '5,000+', label: 'Complaints Resolved' },
            { value: '15', label: 'Wards Covered' },
            { value: '92%', label: 'Resolution Rate' },
            { value: '3 Days', label: 'Avg. Resolution' }
          ].map((s, i) => (
            <div key={i}><p className="text-3xl font-bold">{s.value}</p><p className="text-sm opacity-80">{s.label}</p></div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 bg-card">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p className="mb-2">© {new Date().getFullYear()} Municipal Grievance Analytics Portal</p>
          <p>TYCS Semester 6 Project • Mumbai University</p>
        </div>
      </footer>
    </div>
  );
}
