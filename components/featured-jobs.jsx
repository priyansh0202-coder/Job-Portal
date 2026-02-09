"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BuildingIcon, MapPinIcon, BanknoteIcon, CalendarIcon, CheckCircle2 } from "lucide-react";
import { getJobs } from "../services/jobService";
import { useAuth } from "../context/AuthContext";
import { getApplyStatus } from "../services/jobApplicationService";

export default function FeaturedJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [appliedJobs, setAppliedJobs] = useState({});

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
    fetchJobs();
  }, []);

  // Check application status for loaded jobs
  useEffect(() => {
    const checkAppliedStatus = async () => {
      // If no user, no jobs, or user is admin/recruiter, don't check status
      if (!user || jobs.length === 0 || user?.role === 'admin' || user?.role === 'recruiter') return;

      const newAppliedJobs = {};

      // We can fetch statuses in parallel
      await Promise.all(
        jobs.map(async (job) => {
          try {
            const status = await getApplyStatus(job.id);
            if (status.applied) {
              newAppliedJobs[job.id] = true;
            }
          } catch (error) {
            console.error(`Error checking status for job ${job.id}`, error);
          }
        })
      );

      setAppliedJobs(newAppliedJobs);
    };

    checkAppliedStatus();
  }, [jobs, user]);

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
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-background border border-border rounded-xl p-5">
            <div className="space-y-3">
              <Skeleton className="h-7 w-3/4" />
              <Skeleton className="h-5 w-1/2" />
              <div className="flex gap-4">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-28" />
              </div>
              <Skeleton className="h-12 w-full" />
              <div className="flex gap-2 pt-1">
                <Skeleton className="h-7 w-24" />
                <Skeleton className="h-7 w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 🔹 Render Jobs after loading
  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <div key={job.id} className="bg-background border border-border rounded-xl p-5 hover:shadow-lg hover:border-primary/50 transition-all duration-200">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            {/* Job Content - Left Side */}
            <Link href={`/jobs/${job.id}`} className="flex-1 min-w-0 space-y-3">
              <div>
                {/* Job Title */}
                <h3 className="text-xl font-bold text-foreground hover:text-primary transition-colors line-clamp-2 cursor-pointer mb-2">
                  {job.title}
                </h3>

                {/* Company Name */}
                <p className="text-base text-muted-foreground flex items-center gap-2">
                  <BuildingIcon className="h-4 w-4 flex-shrink-0" />
                  <span className="font-medium">{job.company_name}</span>
                </p>
              </div>

              {/* Job Details */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <MapPinIcon className="h-4 w-4 flex-shrink-0" />
                  <span>{job.location}</span>
                </span>
                {job.salary_text && (
                  <span className="flex items-center gap-1.5">
                    <BanknoteIcon className="h-4 w-4 flex-shrink-0" />
                    <span className="font-medium">{job.salary_text}</span>
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <CalendarIcon className="h-4 w-4 flex-shrink-0" />
                  <span>Posted {formatDate(job.posted_at)}</span>
                </span>
              </div>

              {/* Job Description Preview */}
              {job.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                  {job.description}
                </p>
              )}

              {/* Job Type & Experience Badges */}
              <div className="flex items-center gap-2 pt-1">
                {job.job_type && (
                  <Badge variant={job.job_type === "Full-time" ? "default" : "outline"} className="text-xs px-3 py-1">
                    {job.job_type}
                  </Badge>
                )}
                {job.experience_level && (
                  <Badge variant="outline" className="text-xs px-3 py-1">
                    {job.experience_level}
                  </Badge>
                )}
              </div>
            </Link>

            {/* Apply Now Button - Right Side */}
            <div className="flex-shrink-0 sm:self-start">
              {appliedJobs[job.id] ? (
                <Button
                  size="default"
                  variant="secondary"
                  className="w-full sm:w-auto rounded-lg font-semibold px-6 py-2 shadow-sm bg-green-100 text-green-700 hover:bg-green-200 border border-green-200 cursor-default"
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Applied
                </Button>
              ) : (
                <Link href={`/jobs/${job.id}`}>
                  <Button
                    size="default"
                    className="w-full sm:w-auto rounded-lg font-semibold px-6 py-2 shadow-sm hover:shadow-md transition-shadow"
                    variant={user?.role === 'admin' || user?.role === 'recruiter' ? "outline" : "default"}
                  >
                    {user?.role === 'admin' || user?.role === 'recruiter' ? "View Details" : "Apply Now"}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
