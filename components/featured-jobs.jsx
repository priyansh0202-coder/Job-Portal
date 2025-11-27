"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BuildingIcon, MapPinIcon, BanknoteIcon, CalendarIcon } from "lucide-react";
import { getJobs } from "../services/jobService";

export default function FeaturedJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    const data = await getJobs();
    const jobsArray = Array.isArray(data?.jobs) ? data.jobs : [];

    const latestJobs = jobsArray
      .sort((a, b) => new Date(b.posted_at) - new Date(a.posted_at))
      .slice(0, 4);

    setJobs(latestJobs);
    setLoading(false);
  };

  useEffect(() => {
   setTimeout(() => fetchJobs(), 1000);
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const diffDays = Math.ceil((Date.now() - date) / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    return `${diffDays} days ago`;
  };

  // 🔹 Show Skeleton while loading
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

  // 🔹 Render Jobs after loading
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {jobs.map((job) => (
        <Card key={job.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-4">
              <div>
                <CardTitle className="text-lg">{job.title}</CardTitle>
                <div className="flex items-center text-sm text-muted-foreground">
                  <BuildingIcon className="h-3 w-3 mr-1" />
                  {job.company_name}
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
                {job.salary_text || "Salary not specified"}
              </div>
              <div className="flex items-center text-muted-foreground">
                <CalendarIcon className="h-4 w-4 mr-2" />
                Posted {formatDate(job.posted_at)}
              </div>
            </div>
            <div className="mt-4">
              <Badge variant={job.job_type === "Full-time" ? "default" : "outline"}>
                {job.job_type}
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
