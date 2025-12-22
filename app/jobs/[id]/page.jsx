"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  BuildingIcon,
  MapPinIcon,
  BriefcaseIcon,
  CalendarIcon,
  ClockIcon,
  BanknoteIcon,
  GlobeIcon,
  ArrowLeftIcon,
  ShareIcon,
  BookmarkIcon
} from "lucide-react";

/* ------------------- mock jobs (fallback) ------------------- */
const FALLBACK_JOBS = [
  /* paste your mock jobs array here (or keep a small subset) */
  {
    id: 1,
    title: "Frontend Developer",
    company: "TechCorp",
    location: "San Francisco, CA",
    type: "Full-time",
    category: "Engineering",
    experience: "3-5 years",
    salary: "$80,000 - $120,000",
    postedDate: "2023-05-15",
    applicationDeadline: "2023-06-15",
    applicationLink: "https://example.com/apply",
    logo: "https://images.unsplash.com/photo-1549923746-c502d488b3ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1171&q=80",
    companyWebsite: "https://example.com",
    description: `<p>We are looking for a skilled Frontend Developer to join our team. You will be responsible for building user interfaces and implementing interactive features for our web applications.</p>`,
  },
  // ... add other mock items or paste the full array you already have
];

/* ------------------- helpers ------------------- */
const formatDateReadable = (dateString) => {
  if (!dateString) return "N/A";
  const options = { year: "numeric", month: "long", day: "numeric" };
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;
  return d.toLocaleDateString(undefined, options);
};

const formatDateRelative = (dateString) => {
  if (!dateString) return "Unknown";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Unknown";
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return `${diffDays} days ago`;
};

function readJobsFromLocalStorage() {
  try {
    const raw = localStorage.getItem("jobs");
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    if (parsed && Array.isArray(parsed.data)) return parsed.data;
    if (parsed && Array.isArray(parsed.jobs)) return parsed.jobs;
    return [];
  } catch (err) {
    console.error("Failed to parse jobs from localStorage", err);
    return [];
  }
}

/* ------------------- component ------------------- */
export default function JobDetailPageClient() {
  const params = useParams(); // { id: '...' }
  const router = useRouter();
  const idParam = params?.id;
  const jobId = idParam ? Number(idParam) : null;

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // load job from localStorage (preferred) or fallback to mock
    setLoading(true);
    try {
      const stored = readJobsFromLocalStorage();
      let found = null;

      if (Array.isArray(stored) && stored.length > 0) {
        // job id in stored list may be number or string
        found = stored.find((j) => {
          const jid = j?.id ?? j?._id ?? j?.job_id;
          if (jid === undefined || jid === null) return false;
          return String(jid) === String(jobId);
        });
      }

      if (!found) {
        // fallback to mock list
        found = FALLBACK_JOBS.find((j) => Number(j.id) === Number(jobId));
      }

      setJob(found ?? null);
    } catch (err) {
      console.error(err);
      setJob(null);
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">Loading job details…</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Job Not Found</h1>
        <p className="text-muted-foreground mb-8">The job you're looking for doesn't exist or has been removed.</p>
        <div className="flex justify-center gap-4">
          <Button onClick={() => router.push("/jobs")}>Browse All Jobs</Button>
        </div>
      </div>
    );
  }

  const postedDate = job.posted_at ?? job.postedDate ?? job.created_at ?? job.createdAt ?? null;
  const applicationDeadline =
    job.application_deadline ?? job.applicationDeadline ?? job.application_deadline;

  // salary display fallback
  const salary = job.salary_text || job.salary || (job.salary_min && job.salary_max ? `${job.salary_min} - ${job.salary_max}` : "Not specified");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="h-16 w-16 rounded-md overflow-hidden bg-muted">
                  {job.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={job.logo} alt={job.company_name ?? job.company} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                      {(job.company_name ?? job.company ?? "C").charAt(0)}
                    </div>
                  )}
                </div>

                <div>
                  <h1 className="text-2xl font-bold mb-1">{job.title ?? job.name}</h1>
                  <div className="flex items-center text-muted-foreground mb-4 gap-3">
                    <span className="flex items-center">
                      <BuildingIcon className="h-4 w-4 mr-1" />
                      <span>{job.company_name ?? job.company}</span>
                    </span>
                    <span className="flex items-center">
                      <MapPinIcon className="h-4 w-4 mr-1" />
                      <span>{job.location ?? "Remote"}</span>
                    </span>
                    <span className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      <span>{formatDateRelative(postedDate)}</span>
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant={(job.job_type ?? job.type) === "Full-time" ? "default" : "outline"}>
                      {job.job_type ?? job.type}
                    </Badge>
                    <Badge variant="secondary">{job.category}</Badge>
                    {(job.is_urgent || job.isUrgent) && <Badge variant="destructive">Urgent</Badge>}
                    {job.is_featured && <Badge variant="outline">Featured</Badge>}
                    {(job.is_remote === true || String(job.is_remote) === "true" || String(job.location ?? "").toLowerCase().includes("remote")) && (
                      <Badge variant="outline">Remote</Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button variant="ghost" size="icon" onClick={() => navigator.share?.({ title: job.title, url: window.location.href }).catch(() => { })}>
                  <ShareIcon className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <BookmarkIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Description */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Job Description</h2>
              <div className="prose max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: job.description ?? "<p>No description provided.</p>" }} />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <Button className="w-full mb-4" size="lg" asChild>
                <a href={job.application_link ?? job.applicationLink} rel="noopener noreferrer">Apply Now</a>
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                Application deadline: {formatDateReadable(applicationDeadline)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Job Details</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <BriefcaseIcon className="h-5 w-5 mr-3 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Job Type</p>
                    <p className="font-medium">{job.job_type ?? job.type}</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start">
                  <CalendarIcon className="h-5 w-5 mr-3 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Posted On</p>
                    <p className="font-medium">{formatDateReadable(postedDate)}</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start">
                  <ClockIcon className="h-5 w-5 mr-3 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Experience</p>
                    <p className="font-medium">{job.experience ?? job.experience_level}</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start">
                  <BanknoteIcon className="h-5 w-5 mr-3 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Salary</p>
                    <p className="font-medium">{salary}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">About the Company</h3>
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-md overflow-hidden mr-3 bg-muted">
                  {job.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={job.logo} alt={job.company_name ?? job.company} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-muted-foreground">{(job.company_name ?? job.company ?? "C").charAt(0)}</div>
                  )}
                </div>
                <div>
                  <p className="font-medium">{job.company_name ?? job.company}</p>
                  <p className="text-sm text-muted-foreground">{job.location}</p>
                </div>
              </div>
              {job.companyWebsite && (
                <div className="flex items-center text-sm mb-4">
                  <GlobeIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                  <a href={job.companyWebsite} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    Visit Website
                  </a>
                </div>
              )}
              <Button variant="outline" className="w-full" onClick={() => router.push(`/companies/${encodeURIComponent(job.company_name ?? job.company ?? "")}`)}>
                View Company Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
