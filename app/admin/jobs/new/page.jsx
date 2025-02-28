"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { ArrowLeftIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function NewJobPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [jobData, setJobData] = useState({
    title: "",
    company: "TechCorp", // Pre-filled with the company name
    location: "",
    type: "",
    category: "",
    experience: "",
    salary: "",
    applicationDeadline: "",
    applicationLink: "",
    description: "",
    requirements: "",
    benefits: "",
    isRemote: false,
    isUrgent: false,
    isFeatured: false,
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call to create job
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Job posted successfully",
        description: "Your job listing has been published.",
      });
      router.push("/admin/dashboard");
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/admin/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Link>
      </div>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Post a New Job</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-8">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Provide the essential details about the job position
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
                      name="company" 
                      value={jobData.company}
                      onChange={handleChange}
                      disabled
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
                        checked={jobData.isRemote}
                        onCheckedChange={(checked) => handleSwitchChange("isRemote", checked)}
                      />
                      <Label htmlFor="isRemote" className="text-sm cursor-pointer">
                        This is a remote position
                      </Label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Job Type *</Label>
                    <Select 
                      value={jobData.type} 
                      onValueChange={(value) => handleSelectChange("type", value)}
                      required
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
                      required
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
                      value={jobData.experience} 
                      onValueChange={(value) => handleSelectChange("experience", value)}
                      required
                    >
                      <SelectTrigger id="experience">
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="salary">Salary/Compensation *</Label>
                    <Input 
                      id="salary" 
                      name="salary" 
                      placeholder="e.g. $80,000 - $120,000"
                      value={jobData.salary}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="applicationDeadline">Application Deadline</Label>
                    <Input 
                      id="applicationDeadline" 
                      name="applicationDeadline" 
                      type="date"
                      value={jobData.applicationDeadline}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="applicationLink">Application Link/Email *</Label>
                  <Input 
                    id="applicationLink" 
                    name="applicationLink" 
                    placeholder="URL or email where candidates should apply"
                    value={jobData.applicationLink}
                    onChange={handleChange}
                    required
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* Job Details */}
            <Card>
              <CardHeader>
                <CardTitle>Job Details</CardTitle>
                <CardDescription>
                  Provide a detailed description of the job
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
                    id="isUrgent" 
                    checked={jobData.isUrgent}
                    onCheckedChange={(checked) => handleSwitchChange("isUrgent", checked)}
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
                    id="isFeatured" 
                    checked={jobData.isFeatured}
                    onCheckedChange={(checked) => handleSwitchChange("isFeatured", checked)}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" type="button" onClick={() => router.push("/admin/dashboard")}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Posting Job..." : "Post Job"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </form>
      </div>
    </div>
  );
}