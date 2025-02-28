"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3Icon, 
  BriefcaseIcon, 
  BuildingIcon, 
  PlusIcon, 
  UsersIcon, 
  EyeIcon, 
  EditIcon, 
  TrashIcon,
  LogOutIcon
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Mock data for dashboard
const jobPostings = [
  {
    id: 1,
    title: "Frontend Developer",
    postedDate: "2023-05-15",
    applications: 24,
    status: "active",
  },
  {
    id: 2,
    title: "UX Designer",
    postedDate: "2023-05-20",
    applications: 18,
    status: "active",
  },
  {
    id: 3,
    title: "Backend Developer",
    postedDate: "2023-05-24",
    applications: 12,
    status: "active",
  },
  {
    id: 4,
    title: "Product Manager",
    postedDate: "2023-04-10",
    applications: 32,
    status: "closed",
  },
  {
    id: 5,
    title: "Data Analyst",
    postedDate: "2023-04-05",
    applications: 15,
    status: "closed",
  },
];

const chartData = [
  { name: "Jan", applications: 65 },
  { name: "Feb", applications: 80 },
  { name: "Mar", applications: 95 },
  { name: "Apr", applications: 75 },
  { name: "May", applications: 110 },
  { name: "Jun", applications: 145 },
  { name: "Jul", applications: 130 },
];

// Format date to readable format
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your job postings and applications</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <Link href="/admin/jobs/new">
            <Button className="flex items-center gap-2">
              <PlusIcon className="h-4 w-4" />
              Post New Job
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="flex items-center gap-2">
              <LogOutIcon className="h-4 w-4" />
              Logout
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-3 md:w-[400px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Job Postings</CardTitle>
                <BriefcaseIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{jobPostings.length}</div>
                <p className="text-xs text-muted-foreground">
                  {jobPostings.filter(job => job.status === "active").length} active
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                <UsersIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {jobPostings.reduce((total, job) => total + job.applications, 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  +12% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Company Profile</CardTitle>
                <BuildingIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">TechCorp</div>
                <p className="text-xs text-muted-foreground">
                  Profile 85% complete
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Application Trends</CardTitle>
              <CardDescription>
                Number of applications received over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="applications" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.2)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recent Job Postings */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Job Postings</CardTitle>
              <CardDescription>
                Your most recent job listings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {jobPostings.slice(0, 3).map((job) => (
                  <div key={job.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{job.title}</p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span>Posted on {formatDate(job.postedDate)}</span>
                        <span className="mx-2">•</span>
                        <span>{job.applications} applications</span>
                      </div>
                    </div>
                    <Badge variant={job.status === "active" ? "default" : "secondary"}>
                      {job.status === "active" ? "Active" : "Closed"}
                    </Badge>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Button variant="link" onClick={() => setActiveTab("jobs")}>
                  View All Jobs
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="jobs" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Job Postings</CardTitle>
                <CardDescription>
                  Manage all your job listings
                </CardDescription>
              </div>
              <Link href="/admin/jobs/new">
                <Button size="sm" className="flex items-center gap-2">
                  <PlusIcon className="h-4 w-4" />
                  New Job
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {jobPostings.map((job) => (
                  <div key={job.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg">
                    <div className="mb-4 md:mb-0">
                      <div className="flex items-center">
                        <h3 className="font-medium">{job.title}</h3>
                        <Badge variant={job.status === "active" ? "default" : "secondary"} className="ml-2">
                          {job.status === "active" ? "Active" : "Closed"}
                        </Badge>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <span>Posted on {formatDate(job.postedDate)}</span>
                        <span className="mx-2">•</span>
                        <span>{job.applications} applications</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <EyeIcon className="h-3.5 w-3.5" />
                        <span className="hidden md:inline">View</span>
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <EditIcon className="h-3.5 w-3.5" />
                        <span className="hidden md:inline">Edit</span>
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center gap-1 text-destructive">
                        <TrashIcon className="h-3.5 w-3.5" />
                        <span className="hidden md:inline">Delete</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Applications</CardTitle>
              <CardDescription>
                Review and manage applications for your job postings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {jobPostings.slice(0, 3).map((job) => (
                  <div key={job.id}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{job.title}</h3>
                      <Badge variant={job.status === "active" ? "default" : "secondary"}>
                        {job.status === "active" ? "Active" : "Closed"}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-4">
                      {job.applications} applications • Posted on {formatDate(job.postedDate)}
                    </div>
                    <div className="space-y-3">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center justify-between p-3 border rounded-md">
                          <div>
                            <p className="font-medium">Applicant #{i + 1}</p>
                            <p className="text-sm text-muted-foreground">Applied on {formatDate(new Date(new Date(job.postedDate).getTime() + (i + 1) * 86400000).toISOString().split('T')[0])}</p>
                          </div>
                          <Button variant="outline" size="sm">
                            Review
                          </Button>
                        </div>
                      ))}
                    </div>
                    {job.applications > 3 && (
                      <div className="mt-2 text-center">
                        <Button variant="link" size="sm">
                          View all {job.applications} applications
                        </Button>
                      </div>
                    )}
                    {job !== jobPostings.slice(0, 3)[jobPostings.slice(0, 3).length - 1] && (
                      <Separator className="my-4" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}