"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { ArrowLeftIcon, Loader2Icon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getJobs, updateJob } from "@/services/jobService";



function parseSalary(raw) {
  if (!raw || typeof raw !== "string") return { min: null, max: null, text: "" };

  const s = raw.trim().toLowerCase();

  function parseNumberToken(numStr, token) {
    if (!numStr) return null;
    let n = numStr.replace(/[^\d.]/g, "");
    if (!n) return null;
    let val = parseFloat(n.replace(/,/g, ""));
    if (isNaN(val)) return null;
    if (token) {
      token = token.toLowerCase();
      if (token === "k") val *= 1_000;
      else if (token === "m") val *= 1_000_000;
      else if (token === "l" || token === "lac" || token === "lakh" || token === "lakhs") val *= 100_000;
      else if (token === "cr" || token === "crore" || token === "crores") val *= 10_000_000;
    }
    return Math.round(val);
  }

  const numberRegex = /(\d[\d,\.]*)\\s*(k|m|lakh|lac|l|cr|crore|lpa)?/gi;
  const matches = [];
  let m;
  while ((m = numberRegex.exec(s)) !== null) {
    matches.push({ raw: m[0], num: m[1], token: m[2] || null, index: m.index });
  }

  const hasUpTo = /\b(up to|upto|maximum|max|<=|less than|<)\b/.test(s);
  const hasFrom = /\b(from|minimum|min|>=|greater than|>|\bstarting\b)\b/.test(s);
  const hasPlus = /(\d[\d,\.]*\s*(k|m|lakh|lac|l|cr|crore)?\s*\+)|\babove\b|\bplus\b/.test(s);

  let min = null;
  let max = null;

  if (matches.length >= 2) {
    const first = parseNumberToken(matches[0].num, matches[0].token);
    const second = parseNumberToken(matches[1].num, matches[1].token);
    if (first !== null && second !== null) {
      if (matches[1].index < matches[0].index) {
        [min, max] = [second, first];
      } else {
        [min, max] = [first, second];
      }
      if (min > max) [min, max] = [max, min]; // ensure min <= max
    }
  } else if (matches.length === 1) {
    const num = parseNumberToken(matches[0].num, matches[0].token);
    if (num !== null) {
      if (hasUpTo) {
        max = num;
      } else if (hasFrom || hasPlus) {
        min = num;
      } else {

        min = num;
      }
    }
  }

  const salary_text = raw.trim();

  return { min, max, text: salary_text };
}

export default function EditJobPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params?.id ? Number(params.id) : null;
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const [jobData, setJobData] = useState({
    title: "",
    company_name: "",
    location: "",
    is_remote: false,
    job_type: "Full-time",
    category: "",
    experience_level: "",
    // single salary string used in UI:
    salary: "",
    // the backend fields will be filled from parsed salary on submit:
    salary_min: "",
    salary_max: "",
    salary_text: "",
    application_deadline: "",
    application_link: "",
    contact_email: "",
    description: "",
    requirements: "",
    benefits: "",
    is_urgent: false,
    is_featured: false,
    visibility: {},
    status: "active"
  });

  // Load existing job data
  useEffect(() => {
    const fetchJob = async () => {
      if (!jobId) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }

      try {
        const data = await getJobs();
        const jobsArray = Array.isArray(data?.jobs) ? data.jobs : [];
        const found = jobsArray.find((j) => Number(j.id) === jobId);
        
        if (!found) {
          setNotFound(true);
          setIsLoading(false);
          return;
        }

        // Build salary display string from existing data
        let salaryDisplay = found.salary_text || "";
        if (!salaryDisplay && (found.salary_min || found.salary_max)) {
          if (found.salary_min && found.salary_max) {
            salaryDisplay = `${found.salary_min} - ${found.salary_max}`;
          } else if (found.salary_min) {
            salaryDisplay = `From ${found.salary_min}`;
          } else if (found.salary_max) {
            salaryDisplay = `Up to ${found.salary_max}`;
          }
        }

        // Format deadline for date input (YYYY-MM-DD)
        let deadlineFormatted = "";
        if (found.application_deadline) {
          const d = new Date(found.application_deadline);
          if (!isNaN(d.getTime())) {
            deadlineFormatted = d.toISOString().split("T")[0];
          }
        }

        setJobData({
          title: found.title || "",
          company_name: found.company_name || found.company || "",
          location: found.location || "",
          is_remote: found.is_remote === true || found.is_remote === "true",
          job_type: found.job_type || found.type || "Full-time",
          category: found.category || "",
          experience_level: found.experience_level || "",
          salary: salaryDisplay,
          salary_min: found.salary_min || "",
          salary_max: found.salary_max || "",
          salary_text: found.salary_text || "",
          application_deadline: deadlineFormatted,
          application_link: found.application_link || "",
          contact_email: found.contact_email || "",
          description: found.description || "",
          requirements: found.requirements || "",
          benefits: found.benefits || "",
          is_urgent: found.is_urgent === true || found.is_urgent === "true",
          is_featured: found.is_featured === true || found.is_featured === "true",
          visibility: found.visibility || {},
          status: found.status || "active"
        });
      } catch (err) {
        console.error("Failed to fetch job:", err);
        toast({
          title: "Error",
          description: "Failed to load job data",
          variant: "destructive"
        });
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJob();
  }, [jobId, toast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name, checked) => {
    setJobData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSelectChange = (name, value) => {
    setJobData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // basic validation: require core fields
    if (
      !jobData.title ||
      !jobData.company_name ||
      !jobData.location ||
      !jobData.job_type ||
      !jobData.category ||
      !jobData.experience_level ||
      !jobData.salary || // require the single salary input
      !jobData.description ||
      !jobData.requirements ||
      (!jobData.application_link && !jobData.contact_email) // require at least one contact method
    ) {
      toast({
        title: "Error",
        description: "Please fill all required fields and provide an application link or contact email.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // parse salary input into fields expected by backend
      const { min, max, text } = parseSalary(jobData.salary);

      // if both min and max are null, keep salary_text but warn user (still allow submission)
      if (min === null && max === null && text) {
        // optional: warn user but allow
        toast({
          title: "Note",
          description: "Couldn't extract numeric salary range from input. Sending salary text as-is.",
          variant: "default",
        });
      }

      const payload = {
        ...jobData,
        salary_min: min !== null ? Number(min) : null,
        salary_max: max !== null ? Number(max) : null,
        salary_text: text || null,
        application_deadline: jobData.application_deadline ? new Date(jobData.application_deadline).toISOString() : null,
      };

      // Remove the 'salary' field as it's just a UI helper
      delete payload.salary;

      // call update API
      const data = await updateJob(jobId, payload);

      if (data) {
        toast({
          title: "Success",
          description: "Job updated successfully!",
          variant: "default",
        });
        router.push("/jobs");
      } else {
        toast({
          title: "Error",
          description: "Failed to update job. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: error?.response?.data?.error || error?.message || "Unable to update job",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Loader2Icon className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">Loading job data...</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Job Not Found</h1>
        <p className="text-muted-foreground mb-8">The job you're trying to edit doesn't exist or has been removed.</p>
        <div className="flex justify-center gap-4">
          <Button onClick={() => router.push("/jobs")}>Browse All Jobs</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/jobs" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Jobs
        </Link>
      </div>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Edit Job</h1>

        <form onSubmit={handleSubmit}>
          <div className="space-y-8">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Update the essential details about the job position
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Job Title *</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="e.g. Frontend Developer"
                      value={jobData.title}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company Name *</Label>
                    <Input
                      id="company"
                      name="company_name"
                      value={jobData.company_name}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      name="location"
                      placeholder="e.g. San Francisco, CA"
                      value={jobData.location}
                      onChange={handleChange}
                      required
                    />
                    <div className="flex items-center space-x-2 pt-1">
                      <Switch
                        id="isRemote"
                        checked={jobData.is_remote}
                        onCheckedChange={(checked) => handleSwitchChange("is_remote", checked)}
                      />
                      <Label htmlFor="isRemote" className="text-sm cursor-pointer">
                        This is a remote position
                      </Label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Job Type *</Label>
                    <Select
                      value={jobData.job_type}
                      onValueChange={(value) => handleSelectChange("job_type", value)}
                    >
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select job type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Full-time">Full-time</SelectItem>
                        <SelectItem value="Part-time">Part-time</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                        <SelectItem value="Internship">Internship</SelectItem>
                        <SelectItem value="Temporary">Temporary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={jobData.category}
                      onValueChange={(value) => handleSelectChange("category", value)}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Engineering">Engineering</SelectItem>
                        <SelectItem value="Design">Design</SelectItem>
                        <SelectItem value="Product">Product</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Sales">Sales</SelectItem>
                        <SelectItem value="Customer Support">Customer Support</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="HR">HR</SelectItem>
                        <SelectItem value="Data Science">Data Science</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience">Experience Level *</Label>
                    <Select
                      value={jobData.experience_level}
                      onValueChange={(value) => handleSelectChange("experience_level", value)}
                    >
                      <SelectTrigger id="experience_level">
                        <SelectValue placeholder="Select experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Entry Level">Entry Level</SelectItem>
                        <SelectItem value="1-3 years">1-3 years</SelectItem>
                        <SelectItem value="3-5 years">3-5 years</SelectItem>
                        <SelectItem value="5-7 years">5-7 years</SelectItem>
                        <SelectItem value="7+ years">7+ years</SelectItem>
                        <SelectItem value="Senior">Senior</SelectItem>
                        <SelectItem value="Executive">Executive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Single salary input (UI) */}
                <div className="space-y-2">
                  <Label htmlFor="salary">Salary/Compensation *</Label>
                  <Input
                    id="salary"
                    name="salary"
                    placeholder="e.g. $80,000 - $120,000 or 80k-120k or Up to 120k or Competitive"
                    value={jobData.salary}
                    onChange={handleChange}
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    You can enter a range (80k - 120k), a single value (80k), or text (DOE, Competitive).
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="applicationDeadline">Application Deadline</Label>
                    <Input
                      id="applicationDeadline"
                      name="application_deadline"
                      type="date"
                      value={jobData.application_deadline}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="applicationLink">Application Link/Email *</Label>
                    <Input
                      id="applicationLink"
                      name="application_link"
                      placeholder="URL or email where candidates should apply (or provide contact email below)"
                      value={jobData.application_link}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email (optional)</Label>
                  <Input
                    id="contactEmail"
                    name="contact_email"
                    placeholder="contact@company.com"
                    value={jobData.contact_email}
                    onChange={handleChange}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Job Details */}
            <Card>
              <CardHeader>
                <CardTitle>Job Details</CardTitle>
                <CardDescription>
                  Update the detailed description of the job
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Job Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe the role, responsibilities, and what a typical day looks like"
                    className="min-h-[150px]"
                    value={jobData.description}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requirements">Requirements *</Label>
                  <Textarea
                    id="requirements"
                    name="requirements"
                    placeholder="List the skills, qualifications, and experience required for this position"
                    className="min-h-[150px]"
                    value={jobData.requirements}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="benefits">Benefits</Label>
                  <Textarea
                    id="benefits"
                    name="benefits"
                    placeholder="Describe the benefits, perks, and why someone should work at your company"
                    className="min-h-[150px]"
                    value={jobData.benefits}
                    onChange={handleChange}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Visibility Options */}
            <Card>
              <CardHeader>
                <CardTitle>Visibility Options</CardTitle>
                <CardDescription>
                  Control how your job posting appears on the platform
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="isUrgent">Mark as Urgent</Label>
                    <p className="text-sm text-muted-foreground">
                      Highlight this job as an urgent position to fill
                    </p>
                  </div>
                  <Switch
                    id="is_urgent"
                    checked={jobData.is_urgent}
                    onCheckedChange={(checked) => handleSwitchChange("is_urgent", checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="isFeatured">Feature this Job</Label>
                    <p className="text-sm text-muted-foreground">
                      Promote this job in the featured section on the homepage
                    </p>
                  </div>
                  <Switch
                    id="is_featured"
                    checked={jobData.is_featured}
                    onCheckedChange={(checked) => handleSwitchChange("is_featured", checked)}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" type="button" onClick={() => router.push("/jobs")}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Updating Job..." : "Update Job"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </form>
      </div>
    </div>
  );
}
