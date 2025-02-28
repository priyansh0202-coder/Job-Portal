import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { BuildingIcon, MapPinIcon, BanknoteIcon, CalendarIcon, SearchIcon, FilterIcon } from "lucide-react";
import Link from "next/link";

// Mock data for jobs
const jobs = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "TechCorp",
    location: "San Francisco, CA",
    type: "Full-time",
    category: "Engineering",
    salary: "$80,000 - $120,000",
    postedDate: "2023-05-15",
    logo: "https://images.unsplash.com/photo-1549923746-c502d488b3ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80",
  },
  {
    id: 2,
    title: "Data Scientist",
    company: "DataWorks",
    location: "Remote",
    type: "Full-time",
    category: "Data Science",
    salary: "$90,000 - $140,000",
    postedDate: "2023-05-18",
    logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
  },
  {
    id: 3,
    title: "UX Designer",
    company: "CreativeMinds",
    location: "New York, NY",
    type: "Contract",
    category: "Design",
    salary: "$70 - $90 per hour",
    postedDate: "2023-05-20",
    logo: "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
  },
  {
    id: 4,
    title: "DevOps Engineer",
    company: "CloudSystems",
    location: "Austin, TX",
    type: "Full-time",
    category: "Engineering",
    salary: "$100,000 - $130,000",
    postedDate: "2023-05-22",
    logo: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1172&q=80",
  },
  {
    id: 5,
    title: "Product Manager",
    company: "InnovateTech",
    location: "Chicago, IL",
    type: "Full-time",
    category: "Product",
    salary: "$110,000 - $150,000",
    postedDate: "2023-05-23",
    logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
  },
  {
    id: 6,
    title: "Backend Developer",
    company: "ServerStack",
    location: "Seattle, WA",
    type: "Full-time",
    category: "Engineering",
    salary: "$90,000 - $130,000",
    postedDate: "2023-05-24",
    logo: "https://images.unsplash.com/photo-1549923746-c502d488b3ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80",
  },
];

// Format date to relative time (e.g., "2 days ago")
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return "Today";
  } else if (diffDays === 1) {
    return "Yesterday";
  } else {
    return `${diffDays} days ago`;
  }
};

export default function JobsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Browse Jobs</h1>
          <p className="text-muted-foreground">Find your next career opportunity</p>
        </div>
        <p className="text-sm text-muted-foreground mt-2 md:mt-0">
          Showing <span className="font-medium">{jobs.length}</span> jobs
        </p>
      </div>

      {/* Search and Filter */}
      <div className="bg-card rounded-lg p-4 mb-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative md:col-span-2">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search jobs, companies, or keywords" 
              className="pl-10"
            />
          </div>
          <div>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="san-francisco">San Francisco</SelectItem>
                <SelectItem value="new-york">New York</SelectItem>
                <SelectItem value="austin">Austin</SelectItem>
                <SelectItem value="chicago">Chicago</SelectItem>
                <SelectItem value="seattle">Seattle</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center mt-4">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <FilterIcon className="h-4 w-4" />
            More Filters
          </Button>
          <Separator orientation="vertical" className="mx-4 h-6" />
          <div className="flex gap-2">
            <Badge variant="outline" className="cursor-pointer">
              Engineering
            </Badge>
            <Badge variant="outline" className="cursor-pointer">
              Design
            </Badge>
            <Badge variant="outline" className="cursor-pointer">
              Product
            </Badge>
            <Badge variant="outline" className="cursor-pointer">
              Data Science
            </Badge>
          </div>
        </div>
      </div>

      {/* Job Listings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <Card key={job.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-md overflow-hidden">
                  <img 
                    src={job.logo} 
                    alt={job.company} 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <CardTitle className="text-lg">{job.title}</CardTitle>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <BuildingIcon className="h-3 w-3 mr-1" />
                    {job.company}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="py-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-muted-foreground">
                  <MapPinIcon className="h-4 w-4 mr-2" />
                  {job.location}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <BanknoteIcon className="h-4 w-4 mr-2" />
                  {job.salary}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Posted {formatDate(job.postedDate)}
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Badge variant={job.type === "Full-time" ? "default" : "outline"}>
                  {job.type}
                </Badge>
                <Badge variant="secondary">{job.category}</Badge>
              </div>
            </CardContent>
            <CardFooter>
              <Link href={`/jobs/${job.id}`} className="w-full">
                <Button variant="outline" className="w-full">
                  View Details
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}