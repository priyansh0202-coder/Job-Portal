"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BuildingIcon, MapPinIcon, BanknoteIcon, CalendarIcon } from "lucide-react";

// Mock data for featured jobs
const mockJobs = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "TechCorp",
    location: "San Francisco, CA",
    type: "Full-time",
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
    salary: "$100,000 - $130,000",
    postedDate: "2023-05-22",
    logo: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1172&q=80",
  },
];

export default function FeaturedJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call with a delay
    const timer = setTimeout(() => {
      setJobs(mockJobs);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

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

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-md" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[150px]" />
                  <Skeleton className="h-4 w-[100px]" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="py-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
            <div className="mt-4">
              <Badge variant={job.type === "Full-time" ? "default" : "outline"}>
                {job.type}
              </Badge>
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
  );
}