"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { applyJob, getApplyStatus } from "@/services/jobApplicationService";
import { getJobs, deleteJob } from "@/services/jobService";
import { useAuth } from "@/context/AuthContext";
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
  BookmarkIcon,
  UploadIcon,
  XIcon,
  PencilIcon,
  Trash2Icon
} from "lucide-react";

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

/* ------------------- component ------------------- */
export default function JobDetailPageClient() {
  const params = useParams(); // { id: '...' }
  const router = useRouter();
  const idParam = params?.id;
  const jobId = idParam ? Number(idParam) : null;
  const { user } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);


  useEffect(() => {
    // load job from API
    const fetchJob = async () => {
      setLoading(true);
      try {
        const data = await getJobs();
        const jobsArray = Array.isArray(data?.jobs) ? data.jobs : [];
        const found = jobsArray.find((j) => Number(j.id) === Number(jobId));
        setJob(found || null);
      } catch (err) {
        console.error("Failed to fetch job", err);
        setJob(null);
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchJob();
    }
  }, [jobId]);

  useEffect(() => {
    if (!job?.id || !user || user.role === 'admin' || user.role === 'recruiter') return;

    const checkStatus = async () => {
      try {
        const res = await getApplyStatus(job.id);
        setApplied(res.applied);
      } catch (err) {
        console.error("Failed to check apply status");
      }
    };
    checkStatus();
  }, [job?.id, user]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
      if (!allowedTypes.includes(file.type)) {
        alert('Only PDF and DOCX files are allowed');
        return;
      }
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size cannot exceed 5MB');
        return;
      }
      setResumeFile(file);
    }
  };

  const handleApply = async () => {
    try {
      setIsApplying(true);

      const formData = new FormData();
      if (resumeFile) {
        formData.append('resume', resumeFile);
      }
      if (coverLetter.trim()) {
        formData.append('coverLetter', coverLetter);
      }

      await applyJob(job.id, formData);
      setApplied(true);
      setShowApplicationModal(false);
      setResumeFile(null);
      setCoverLetter("");
      alert("Application submitted successfully!");
    } catch (err) {
      alert(err?.response?.data?.message || "Already applied or error occurred");
    } finally {
      setIsApplying(false);
    }
  };

  // Handler to delete a job (admin only)
  const handleDeleteJob = async () => {
    if (!confirm("Are you sure you want to delete this job? This action cannot be undone.")) {
      return;
    }

    try {
      setIsDeleting(true);
      await deleteJob(job.id, false); // soft delete by default
      alert("Job deleted successfully!");
      router.push("/jobs");
    } catch (err) {
      console.error("Failed to delete job", err);
      alert(err?.response?.data?.error || "Failed to delete job");
    } finally {
      setIsDeleting(false);
    }
  };

  // Handler to navigate to edit page (admin only)
  const handleEditJob = () => {
    router.push(`/admin/jobs/${job.id}/edit`);
  };

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

  const isAdmin = user?.role === 'admin' || user?.role === 'recruiter';

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
              {isAdmin ? (
                <Button
                  className="w-full mb-4"
                  size="lg"
                  disabled
                  variant="outline"
                >
                  Admins cannot apply
                </Button>
              ) : (
                <Button
                  className="w-full mb-4"
                  size="lg"
                  onClick={() => setShowApplicationModal(true)}
                  disabled={applied || isApplying}
                >
                  {applied ? "Applied ✓" : "Apply Now"}
                </Button>
              )}

              <p className="text-sm text-muted-foreground text-center">
                Application deadline: {formatDateReadable(applicationDeadline)}
              </p>
            </CardContent>
          </Card>

          {/* Admin-only Edit and Delete buttons */}
          {isAdmin && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Admin Actions</h3>
                <div className="space-y-3">
                  <Button
                    variant="secondary"
                    className="w-full flex items-center justify-center gap-2"
                    onClick={handleEditJob}
                  >
                    <PencilIcon className="h-4 w-4" />
                    Edit Job
                  </Button>
                  <Button
                    variant="destructive"
                    className="w-full flex items-center justify-center gap-2"
                    onClick={handleDeleteJob}
                    disabled={isDeleting}
                  >
                    <Trash2Icon className="h-4 w-4" />
                    {isDeleting ? "Deleting..." : "Delete Job"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

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

      {/* Application Modal */}
      {showApplicationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative w-full max-w-2xl bg-card rounded-lg p-6 mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Apply for {job.title}</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowApplicationModal(false)}>
                <XIcon className="h-5 w-5" />
              </Button>
            </div>

            <Separator className="mb-4" />

            <div className="space-y-4">
              {/* Resume Upload */}
              <div className="space-y-2">
                <Label htmlFor="resume" className="text-sm font-medium">
                  Resume/CV (Optional)
                </Label>
                <div className="flex items-center gap-4">
                  <input
                    id="resume"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="resume"
                    className="flex items-center justify-center gap-2 px-4 py-2 border border-border rounded-md cursor-pointer hover:bg-muted transition-colors"
                  >
                    <UploadIcon className="h-4 w-4" />
                    <span className="text-sm">{resumeFile ? "Change File" : "Choose File"}</span>
                  </label>
                  {resumeFile && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{resumeFile.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setResumeFile(null)}
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Accepted formats: PDF, DOC, DOCX (Max 5MB)
                </p>
              </div>

              {/* Cover Letter */}
              <div className="space-y-2">
                <Label htmlFor="coverLetter" className="text-sm font-medium">
                  Cover Letter (Optional)
                </Label>
                <Textarea
                  id="coverLetter"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Tell us why you're a great fit for this position..."
                  className="min-h-[150px]"
                />
                <p className="text-xs text-muted-foreground">
                  {coverLetter.length} characters
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowApplicationModal(false)}
                  className="flex-1"
                  disabled={isApplying}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleApply}
                  className="flex-1"
                  disabled={isApplying}
                >
                  {isApplying ? "Submitting..." : "Submit Application"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
