import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  GitBranch, 
  Database, 
  Server, 
  Shield,
  Code,
  TestTube,
  Rocket,
  Users,
  BookOpen,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

export default function AdminDocumentation() {
  const sdlcPhases = [
    {
      title: 'Requirements Analysis',
      icon: BookOpen,
      description: 'Gathering and analyzing system requirements from stakeholders',
      status: 'Completed',
      details: [
        'Identified key stakeholders: Citizens, Municipal Officers, Administrators',
        'Documented functional requirements for grievance submission and tracking',
        'Defined non-functional requirements: Performance, Security, Usability',
        'Created use case diagrams and user stories'
      ]
    },
    {
      title: 'System Design',
      icon: Code,
      description: 'Architectural and detailed design of the system',
      status: 'Completed',
      details: [
        'Designed database schema with ER diagrams',
        'Created system architecture diagrams',
        'Developed Data Flow Diagrams (DFD Level 0, 1, 2)',
        'Designed responsive UI mockups and wireframes'
      ]
    },
    {
      title: 'Implementation',
      icon: Rocket,
      description: 'Development and coding of the system',
      status: 'Completed',
      details: [
        'Frontend: React.js with TypeScript, Tailwind CSS',
        'State Management: React Context API',
        'Charts: Recharts for analytics visualization',
        'Authentication: JWT-based secure login system'
      ]
    },
    {
      title: 'Testing',
      icon: TestTube,
      description: 'Verification and validation of the system',
      status: 'Completed',
      details: [
        'Unit testing of individual components',
        'Integration testing of modules',
        'User acceptance testing (UAT)',
        'Security testing for authentication flows'
      ]
    },
    {
      title: 'Deployment',
      icon: Server,
      description: 'System deployment and maintenance',
      status: 'In Progress',
      details: [
        'Deployed on cloud hosting platform',
        'Configured CI/CD pipeline',
        'Set up monitoring and logging',
        'Documentation for maintenance'
      ]
    }
  ];

  const testCases = [
    { id: 'TC001', scenario: 'Citizen Registration', input: 'Valid user details', expected: 'Account created successfully', status: 'Pass' },
    { id: 'TC002', scenario: 'Citizen Login', input: 'Valid credentials', expected: 'Login successful, redirect to dashboard', status: 'Pass' },
    { id: 'TC003', scenario: 'Submit Grievance', input: 'Complete form data', expected: 'Grievance submitted, tracking ID generated', status: 'Pass' },
    { id: 'TC004', scenario: 'Track Grievance', input: 'Valid tracking ID', expected: 'Display grievance status and timeline', status: 'Pass' },
    { id: 'TC005', scenario: 'Admin Login', input: 'Admin credentials', expected: 'Login successful, access admin dashboard', status: 'Pass' },
    { id: 'TC006', scenario: 'Update Status', input: 'New status selection', expected: 'Status updated, timeline updated', status: 'Pass' },
    { id: 'TC007', scenario: 'Invalid Login', input: 'Wrong password', expected: 'Error message displayed', status: 'Pass' },
    { id: 'TC008', scenario: 'Empty Form Submission', input: 'Empty required fields', expected: 'Validation error shown', status: 'Pass' },
  ];

  const commitHistory = [
    { hash: 'a3f2c1d', message: 'feat: Add admin analytics dashboard with charts', date: '2024-12-15', author: 'Student' },
    { hash: 'b8e4f2a', message: 'feat: Implement citizen grievance submission form', date: '2024-12-14', author: 'Student' },
    { hash: 'c5d3e1b', message: 'feat: Add complaint tracking with timeline', date: '2024-12-13', author: 'Student' },
    { hash: 'd2f1a3c', message: 'feat: Implement JWT authentication flow', date: '2024-12-12', author: 'Student' },
    { hash: 'e9c8b7a', message: 'feat: Setup project structure and routing', date: '2024-12-11', author: 'Student' },
    { hash: 'f6a5d4c', message: 'chore: Initial project setup with Vite + React', date: '2024-12-10', author: 'Student' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Project Documentation</h1>
          <p className="text-muted-foreground">TYCS Semester 6 Project - SDLC Documentation</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sdlc">SDLC</TabsTrigger>
            <TabsTrigger value="diagrams">Diagrams</TabsTrigger>
            <TabsTrigger value="testing">Testing</TabsTrigger>
            <TabsTrigger value="deployment">Deployment</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Project Synopsis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Title</h4>
                  <p className="text-muted-foreground">Municipal Grievance Analytics Portal</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Abstract</h4>
                  <p className="text-muted-foreground">
                    A comprehensive web-based platform designed to streamline the process of citizen grievance 
                    submission, tracking, and resolution for municipal corporations. The system provides role-based 
                    dashboards for citizens and administrators, with real-time analytics and reporting capabilities 
                    to improve civic governance transparency and efficiency.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Objectives</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Enable citizens to easily submit and track grievances online</li>
                    <li>Provide administrators with tools to manage and resolve complaints efficiently</li>
                    <li>Generate analytics and reports for data-driven decision making</li>
                    <li>Ensure transparency in the grievance resolution process</li>
                    <li>Reduce response time for civic issues</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Technology Stack</h4>
                  <div className="flex flex-wrap gap-2">
                    {['React.js', 'TypeScript', 'Tailwind CSS', 'Recharts', 'React Router', 'Shadcn/UI'].map(tech => (
                      <span key={tech} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Student Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">[Student Name]</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Roll Number</p>
                    <p className="font-medium">[Roll Number]</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Course</p>
                    <p className="font-medium">TYCS - Semester 6</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">College</p>
                    <p className="font-medium">[College Name]</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Guide Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Guide Name</p>
                    <p className="font-medium">[Guide Name]</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Designation</p>
                    <p className="font-medium">Assistant Professor</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Department</p>
                    <p className="font-medium">Computer Science</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">University</p>
                    <p className="font-medium">Mumbai University</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* SDLC Tab */}
          <TabsContent value="sdlc" className="space-y-4">
            {sdlcPhases.map((phase, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <phase.icon className="h-5 w-5 text-primary" />
                      Phase {index + 1}: {phase.title}
                    </CardTitle>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      phase.status === 'Completed' 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {phase.status}
                    </span>
                  </div>
                  <CardDescription>{phase.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {phase.details.map((detail, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Diagrams Tab */}
          <TabsContent value="diagrams" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { title: 'Data Flow Diagram (DFD)', description: 'Level 0, 1, and 2 diagrams showing data flow' },
                { title: 'Entity Relationship Diagram', description: 'Database schema and relationships' },
                { title: 'System Flowchart', description: 'Overall system process flow' },
                { title: 'Use Case Diagram', description: 'Actor interactions with the system' },
              ].map((diagram, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{diagram.title}</CardTitle>
                    <CardDescription>{diagram.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-40 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed">
                      <p className="text-muted-foreground text-sm">Diagram Placeholder</p>
                    </div>
                    <Button variant="outline" className="w-full mt-4">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Full Diagram
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Testing Tab */}
          <TabsContent value="testing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TestTube className="h-5 w-5" />
                  White-Box Testing Cases
                </CardTitle>
                <CardDescription>Functional test cases for the system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b bg-muted/50">
                      <tr>
                        <th className="text-left p-3 font-medium text-sm">Test ID</th>
                        <th className="text-left p-3 font-medium text-sm">Scenario</th>
                        <th className="text-left p-3 font-medium text-sm hidden md:table-cell">Input</th>
                        <th className="text-left p-3 font-medium text-sm hidden lg:table-cell">Expected Result</th>
                        <th className="text-center p-3 font-medium text-sm">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {testCases.map((tc) => (
                        <tr key={tc.id} className="border-b">
                          <td className="p-3 font-mono text-sm">{tc.id}</td>
                          <td className="p-3 text-sm">{tc.scenario}</td>
                          <td className="p-3 text-sm text-muted-foreground hidden md:table-cell">{tc.input}</td>
                          <td className="p-3 text-sm text-muted-foreground hidden lg:table-cell">{tc.expected}</td>
                          <td className="p-3 text-center">
                            <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-medium">
                              {tc.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitBranch className="h-5 w-5" />
                  Git Commit History
                </CardTitle>
                <CardDescription>Version control history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {commitHistory.map((commit) => (
                    <div key={commit.hash} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <code className="text-xs bg-primary/10 text-primary px-2 py-1 rounded font-mono">
                        {commit.hash}
                      </code>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{commit.message}</p>
                        <p className="text-xs text-muted-foreground">{commit.date} by {commit.author}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Deployment Tab */}
          <TabsContent value="deployment" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold mb-1">Live Demo</h3>
                  <p className="text-sm text-muted-foreground mb-3">Application is deployed and accessible</p>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                    Online
                  </span>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Database className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-1">PostgreSQL</h3>
                  <p className="text-sm text-muted-foreground mb-3">Scalable relational database</p>
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                    Scalable
                  </span>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-1">JWT Security</h3>
                  <p className="text-sm text-muted-foreground mb-3">Secure authentication system</p>
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                    Secure
                  </span>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Future Scope</CardTitle>
                <CardDescription>Potential enhancements and improvements</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {[
                    'Integration with real municipal databases',
                    'SMS and email notifications for status updates',
                    'Mobile application development',
                    'AI-powered complaint categorization',
                    'Multi-language support for regional accessibility',
                    'Integration with payment gateway for fee-based services'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Limitations</CardTitle>
                <CardDescription>Current constraints of the system</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {[
                    'Demo data used for demonstration purposes',
                    'Limited to single municipal corporation',
                    'No real-time GPS tracking (using ward-based system)',
                    'Email verification not implemented in demo',
                    'File upload limited to images only'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
