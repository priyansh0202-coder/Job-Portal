"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Loader2Icon,
    ArrowLeftIcon,
    UserIcon,
    MailIcon,
    BriefcaseIcon,
    BuildingIcon,
    MapPinIcon,
    CalendarIcon,
    CalendarCheckIcon,
    ClockIcon,
    FileTextIcon,
    ExternalLinkIcon,
    DollarSignIcon,
    StarIcon,
    ZapIcon,
    GlobeIcon,
    CheckCircleIcon,
    XCircleIcon,
    EyeIcon,
    DownloadIcon,
    BookOpenIcon,
    AwardIcon,
    HeartIcon,
    AlertCircleIcon,
    MessageSquareIcon,
    UserCheckIcon,
    SaveIcon,
} from "lucide-react";
import { getAdminApplicationDetail, updateApplicationStatus } from "@/services/adminApplicationService";
import { useToast } from "@/hooks/use-toast";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const statusConfig = {
    pending: {
        label: "Pending",
        color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
        icon: ClockIcon,
    },
    reviewed: {
        label: "Reviewed",
        color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
        icon: EyeIcon,
    },
    shortlisted: {
        label: "Shortlisted",
        color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
        icon: CheckCircleIcon,
    },
    interview_scheduled: {
        label: "Interview Scheduled",
        color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
        icon: CalendarCheckIcon,
    },
    hired: {
        label: "Hired",
        color: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
        icon: UserCheckIcon,
    },
    rejected: {
        label: "Rejected",
        color: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
        icon: XCircleIcon,
    },
};

const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

export default function AdminApplicationDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const applicationId = params.id;

    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updatingStatus, setUpdatingStatus] = useState(null);
    const [activeTab, setActiveTab] = useState("overview");

    // Admin notes & interview scheduling
    const [adminNotes, setAdminNotes] = useState("");
    const [interviewDate, setInterviewDate] = useState("");
    const [interviewTime, setInterviewTime] = useState("10:00");
    const [savingNotes, setSavingNotes] = useState(false);
    const [showInterviewPicker, setShowInterviewPicker] = useState(false);

    useEffect(() => {
        if (!applicationId) return;
        const fetchDetail = async () => {
            setLoading(true);
            try {
                const data = await getAdminApplicationDetail(applicationId);
                setApplication(data.application);
                setAdminNotes(data.application?.admin_notes || "");
                if (data.application?.interview_date) {
                    const d = new Date(data.application.interview_date);
                    if (!isNaN(d.getTime())) {
                        setInterviewDate(d.toISOString().slice(0, 10));
                        setInterviewTime(d.toTimeString().slice(0, 5));
                    }
                }
            } catch (err) {
                console.error("Failed to fetch application:", err);
                setError(
                    err?.response?.data?.error || "Failed to load application details."
                );
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [applicationId]);

    const handleStatusUpdate = async (newStatus, notes = null, intDate = null) => {
        setUpdatingStatus(newStatus);
        try {
            await updateApplicationStatus(applicationId, newStatus, notes, intDate);
            setApplication((prev) => ({
                ...prev,
                application_status: newStatus,
                ...(notes !== null && { admin_notes: notes }),
                ...(intDate !== null && { interview_date: intDate }),
            }));
            const statusLabel = statusConfig[newStatus]?.label || newStatus;
            toast({
                title: "Status Updated",
                description: `Application marked as "${statusLabel}".`,
            });
            if (newStatus === "interview_scheduled") {
                setShowInterviewPicker(false);
            }
        } catch (err) {
            toast({
                title: "Error",
                description: err?.response?.data?.error || "Failed to update status.",
                variant: "destructive",
            });
        } finally {
            setUpdatingStatus(null);
        }
    };

    const handleSaveNotes = async () => {
        setSavingNotes(true);
        try {
            await updateApplicationStatus(
                applicationId,
                application.application_status,
                adminNotes
            );
            setApplication((prev) => ({ ...prev, admin_notes: adminNotes }));
            toast({
                title: "Notes Saved",
                description: "Admin notes have been updated.",
            });
        } catch (err) {
            toast({
                title: "Error",
                description: err?.response?.data?.error || "Failed to save notes.",
                variant: "destructive",
            });
        } finally {
            setSavingNotes(false);
        }
    };

    const handleScheduleInterview = async () => {
        if (!interviewDate) {
            toast({
                title: "Missing Date",
                description: "Please select an interview date.",
                variant: "destructive",
            });
            return;
        }
        const dateTimeStr = `${interviewDate}T${interviewTime || "10:00"}:00`;
        const parsed = new Date(dateTimeStr);
        if (isNaN(parsed.getTime())) {
            toast({
                title: "Invalid Date",
                description: "The selected date/time is not valid. Please try again.",
                variant: "destructive",
            });
            return;
        }
        await handleStatusUpdate(
            "interview_scheduled",
            adminNotes || null,
            parsed.toISOString()
        );
    };

    const getMinDate = () => {
        const now = new Date();
        return now.toISOString().slice(0, 10);
    };

    const openInterviewPicker = () => {
        if (!interviewDate) {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            setInterviewDate(tomorrow.toISOString().slice(0, 10));
            setInterviewTime("10:00");
        }
        setShowInterviewPicker(true);
    };

    const resumeUrl = application?.resume_url
        ? `${BASE_URL}${application.resume_url}`
        : null;

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-24">
                <Loader2Icon className="h-10 w-10 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Loading application details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-16 max-w-4xl text-center">
                <AlertCircleIcon className="h-16 w-16 mx-auto mb-4 text-destructive/50" />
                <h2 className="text-xl font-semibold mb-2">Error Loading Application</h2>
                <p className="text-muted-foreground mb-6">{error}</p>
                <div className="flex gap-3 justify-center">
                    <Button variant="outline" onClick={() => router.back()}>
                        Go Back
                    </Button>
                    <Button onClick={() => window.location.reload()}>Try Again</Button>
                </div>
            </div>
        );
    }

    if (!application) return null;

    const statusInfo = statusConfig[application.application_status] || statusConfig.pending;
    const StatusIcon = statusInfo.icon;

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            {/* Breadcrumb */}
            <Link
                href="/admin/applications"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
                <ArrowLeftIcon className="h-4 w-4 mr-1" />
                Back to Applications
            </Link>

            {/* Top header */}
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-8">
                <div className="flex items-start gap-4">
                    <div className="hidden sm:flex h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 items-center justify-center flex-shrink-0 ring-2 ring-primary/10">
                        <UserIcon className="h-7 w-7 text-primary" />
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-2xl font-bold tracking-tight">
                                {application.applicant_name || "Unknown Applicant"}
                            </h1>
                            <span
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${statusInfo.color}`}
                            >
                                <StatusIcon className="h-3.5 w-3.5" />
                                {statusInfo.label}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground mb-2">
                            <MailIcon className="h-4 w-4" />
                            <span>{application.applicant_email}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                            <span className="flex items-center">
                                <BriefcaseIcon className="h-3.5 w-3.5 mr-1.5" />
                                {application.title}
                            </span>
                            <span className="flex items-center">
                                <BuildingIcon className="h-3.5 w-3.5 mr-1.5" />
                                {application.company_name}
                            </span>
                            <span className="flex items-center">
                                <CalendarIcon className="h-3.5 w-3.5 mr-1.5" />
                                Applied {formatDate(application.applied_at)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Status actions */}
                <div className="flex flex-wrap gap-2">
                    {application.application_status !== "reviewed" && (
                        <Button
                            size="sm"
                            variant="outline"
                            className="border-blue-500/30 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10"
                            disabled={!!updatingStatus}
                            onClick={() => handleStatusUpdate("reviewed")}
                        >
                            {updatingStatus === "reviewed" ? (
                                <Loader2Icon className="h-3.5 w-3.5 mr-1 animate-spin" />
                            ) : (
                                <EyeIcon className="h-3.5 w-3.5 mr-1" />
                            )}
                            Mark Reviewed
                        </Button>
                    )}
                    {application.application_status !== "shortlisted" && (
                        <Button
                            size="sm"
                            variant="outline"
                            className="border-emerald-500/30 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10"
                            disabled={!!updatingStatus}
                            onClick={() => handleStatusUpdate("shortlisted")}
                        >
                            {updatingStatus === "shortlisted" ? (
                                <Loader2Icon className="h-3.5 w-3.5 mr-1 animate-spin" />
                            ) : (
                                <CheckCircleIcon className="h-3.5 w-3.5 mr-1" />
                            )}
                            Shortlist
                        </Button>
                    )}
                    {application.application_status !== "interview_scheduled" && (
                        <Button
                            size="sm"
                            variant="outline"
                            className="border-purple-500/30 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-500/10"
                            disabled={!!updatingStatus}
                            onClick={openInterviewPicker}
                        >
                            <CalendarCheckIcon className="h-3.5 w-3.5 mr-1" />
                            Schedule Interview
                        </Button>
                    )}
                    {application.application_status !== "hired" && (
                        <Button
                            size="sm"
                            variant="outline"
                            className="border-green-500/30 text-green-700 hover:bg-green-50 dark:hover:bg-green-500/10"
                            disabled={!!updatingStatus}
                            onClick={() => handleStatusUpdate("hired")}
                        >
                            {updatingStatus === "hired" ? (
                                <Loader2Icon className="h-3.5 w-3.5 mr-1 animate-spin" />
                            ) : (
                                <UserCheckIcon className="h-3.5 w-3.5 mr-1" />
                            )}
                            Hire
                        </Button>
                    )}
                    {application.application_status !== "rejected" && (
                        <Button
                            size="sm"
                            variant="outline"
                            className="border-red-500/30 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                            disabled={!!updatingStatus}
                            onClick={() => handleStatusUpdate("rejected")}
                        >
                            {updatingStatus === "rejected" ? (
                                <Loader2Icon className="h-3.5 w-3.5 mr-1 animate-spin" />
                            ) : (
                                <XCircleIcon className="h-3.5 w-3.5 mr-1" />
                            )}
                            Reject
                        </Button>
                    )}
                </div>

                {/* Interview Scheduler */}
                {showInterviewPicker && (
                    <Card className="border-purple-500/30 bg-purple-500/5">
                        <CardContent className="pt-6">
                            <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
                                <CalendarCheckIcon className="h-4 w-4 text-purple-600" />
                                Schedule Interview
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="interview-date">Date</Label>
                                    <input
                                        id="interview-date"
                                        type="date"
                                        min={getMinDate()}
                                        value={interviewDate}
                                        onChange={(e) => setInterviewDate(e.target.value)}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="interview-time">Time</Label>
                                    <input
                                        id="interview-time"
                                        type="time"
                                        value={interviewTime}
                                        onChange={(e) => setInterviewTime(e.target.value)}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="interview-notes">Notes (optional)</Label>
                                    <input
                                        id="interview-notes"
                                        type="text"
                                        placeholder="e.g. Technical round via Zoom"
                                        value={adminNotes}
                                        onChange={(e) => setAdminNotes(e.target.value)}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    />
                                </div>
                            </div>
                            {interviewDate && interviewTime && (
                                <p className="text-xs text-muted-foreground mt-3">
                                    Scheduled for: {new Date(`${interviewDate}T${interviewTime}:00`).toLocaleString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                                </p>
                            )}
                            <div className="flex gap-2 mt-4">
                                <Button
                                    size="sm"
                                    className="bg-purple-600 hover:bg-purple-700 text-white"
                                    disabled={!!updatingStatus || !interviewDate}
                                    onClick={handleScheduleInterview}
                                >
                                    {updatingStatus === "interview_scheduled" ? (
                                        <Loader2Icon className="h-3.5 w-3.5 mr-1 animate-spin" />
                                    ) : (
                                        <CalendarCheckIcon className="h-3.5 w-3.5 mr-1" />
                                    )}
                                    Confirm Schedule
                                </Button>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setShowInterviewPicker(false)}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid grid-cols-3 md:w-[450px]">
                    <TabsTrigger value="overview" className="flex items-center gap-1.5">
                        <UserIcon className="h-3.5 w-3.5" />
                        Overview
                    </TabsTrigger>
                    <TabsTrigger value="resume" className="flex items-center gap-1.5">
                        <FileTextIcon className="h-3.5 w-3.5" />
                        Resume
                    </TabsTrigger>
                    <TabsTrigger value="job" className="flex items-center gap-1.5">
                        <BriefcaseIcon className="h-3.5 w-3.5" />
                        Job Details
                    </TabsTrigger>
                </TabsList>

                {/* ─── Overview Tab ─── */}
                <TabsContent value="overview" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Cover Letter */}
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BookOpenIcon className="h-5 w-5 text-primary" />
                                    Cover Letter
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {application.cover_letter ? (
                                    <div className="prose prose-sm dark:prose-invert max-w-none">
                                        <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/80">
                                            {application.cover_letter}
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground italic">
                                        No cover letter provided.
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Quick Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Quick Info</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                                        Application ID
                                    </p>
                                    <p className="font-mono text-sm">#{application.application_id}</p>
                                </div>
                                <Separator />
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                                        Applied At
                                    </p>
                                    <p className="text-sm">{formatDateTime(application.applied_at)}</p>
                                </div>
                                <Separator />
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                                        Job Type
                                    </p>
                                    <p className="text-sm capitalize">{application.job_type || "N/A"}</p>
                                </div>
                                <Separator />
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                                        Location
                                    </p>
                                    <div className="flex items-center gap-2 text-sm">
                                        <MapPinIcon className="h-3.5 w-3.5 text-muted-foreground" />
                                        {application.location}
                                        {application.is_remote && (
                                            <Badge variant="secondary" className="text-xs">
                                                <GlobeIcon className="h-3 w-3 mr-1" />
                                                Remote
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                <Separator />
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                                        Category
                                    </p>
                                    <p className="text-sm">{application.category || "N/A"}</p>
                                </div>
                                {application.interview_date && (
                                    <>
                                        <Separator />
                                        <div>
                                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                                                Interview Date
                                            </p>
                                            <div className="flex items-center gap-1.5 text-sm">
                                                <CalendarCheckIcon className="h-3.5 w-3.5 text-purple-600" />
                                                {formatDateTime(application.interview_date)}
                                            </div>
                                        </div>
                                    </>
                                )}
                                {resumeUrl && (
                                    <>
                                        <Separator />
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full"
                                            onClick={() => window.open(resumeUrl, "_blank")}
                                        >
                                            <DownloadIcon className="h-4 w-4 mr-2" />
                                            Download Resume
                                        </Button>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Admin Notes */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <MessageSquareIcon className="h-5 w-5 text-primary" />
                                Admin Notes
                            </CardTitle>
                            <CardDescription>
                                Internal notes about this application (not visible to the applicant)
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                id="admin-notes"
                                placeholder="Add notes about this applicant — e.g. interview feedback, skills assessment, follow-up needed..."
                                value={adminNotes}
                                onChange={(e) => setAdminNotes(e.target.value)}
                                className="min-h-[120px] mb-3"
                            />
                            <div className="flex items-center justify-between">
                                <p className="text-xs text-muted-foreground">
                                    {application.admin_notes !== adminNotes ? "Unsaved changes" : ""}
                                </p>
                                <Button
                                    size="sm"
                                    disabled={savingNotes || application.admin_notes === adminNotes}
                                    onClick={handleSaveNotes}
                                >
                                    {savingNotes ? (
                                        <Loader2Icon className="h-3.5 w-3.5 mr-1 animate-spin" />
                                    ) : (
                                        <SaveIcon className="h-3.5 w-3.5 mr-1" />
                                    )}
                                    Save Notes
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ─── Resume Tab ─── */}
                <TabsContent value="resume" className="space-y-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <FileTextIcon className="h-5 w-5 text-primary" />
                                    Resume
                                </CardTitle>
                                <CardDescription>
                                    {application.applicant_name}&apos;s resume document
                                </CardDescription>
                            </div>
                            {resumeUrl && (
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => window.open(resumeUrl, "_blank")}
                                    >
                                        <ExternalLinkIcon className="h-4 w-4 mr-1" />
                                        Open in New Tab
                                    </Button>
                                    <Button
                                        size="sm"
                                        asChild
                                    >
                                        <a href={resumeUrl} download>
                                            <DownloadIcon className="h-4 w-4 mr-1" />
                                            Download
                                        </a>
                                    </Button>
                                </div>
                            )}
                        </CardHeader>
                        <CardContent>
                            {resumeUrl ? (
                                <div className="rounded-lg overflow-hidden border bg-muted/30">
                                    {/* PDF embed with multiple fallback approaches */}
                                    <iframe
                                        src={resumeUrl}
                                        className="w-full border-0"
                                        style={{ height: "80vh", minHeight: "600px" }}
                                        title={`Resume - ${application.applicant_name}`}
                                    />
                                    {/* Fallback if iframe fails (e.g. browser blocks inline PDF) */}
                                    <noscript>
                                        <div className="p-8 text-center">
                                            <FileTextIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
                                            <p>Unable to display resume inline.</p>
                                            <a
                                                href={resumeUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary underline"
                                            >
                                                Click here to view the resume
                                            </a>
                                        </div>
                                    </noscript>
                                </div>
                            ) : (
                                <div className="py-16 text-center">
                                    <FileTextIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
                                    <h3 className="text-lg font-semibold mb-2">
                                        No Resume Uploaded
                                    </h3>
                                    <p className="text-muted-foreground">
                                        This applicant did not upload a resume.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ─── Job Details Tab ─── */}
                <TabsContent value="job" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Job Overview */}
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BriefcaseIcon className="h-5 w-5 text-primary" />
                                    {application.title}
                                </CardTitle>
                                <CardDescription>
                                    {application.company_name} • {application.location}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Description */}
                                {application.description && (
                                    <div>
                                        <h4 className="font-semibold text-sm mb-2 flex items-center gap-1.5">
                                            <BookOpenIcon className="h-4 w-4 text-muted-foreground" />
                                            Description
                                        </h4>
                                        <p className="text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed">
                                            {application.description}
                                        </p>
                                    </div>
                                )}

                                {application.description && application.requirements && <Separator />}

                                {/* Requirements */}
                                {application.requirements && (
                                    <div>
                                        <h4 className="font-semibold text-sm mb-2 flex items-center gap-1.5">
                                            <AwardIcon className="h-4 w-4 text-muted-foreground" />
                                            Requirements
                                        </h4>
                                        <p className="text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed">
                                            {application.requirements}
                                        </p>
                                    </div>
                                )}

                                {application.requirements && application.benefits && <Separator />}

                                {/* Benefits */}
                                {application.benefits && (
                                    <div>
                                        <h4 className="font-semibold text-sm mb-2 flex items-center gap-1.5">
                                            <HeartIcon className="h-4 w-4 text-muted-foreground" />
                                            Benefits
                                        </h4>
                                        <p className="text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed">
                                            {application.benefits}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Job Sidebar */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Job Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                                        Job Status
                                    </p>
                                    <Badge
                                        variant={
                                            application.job_status === "active"
                                                ? "default"
                                                : "secondary"
                                        }
                                    >
                                        {application.job_status || "N/A"}
                                    </Badge>
                                </div>
                                <Separator />
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                                        Experience Level
                                    </p>
                                    <p className="text-sm capitalize">
                                        {application.experience_level || "N/A"}
                                    </p>
                                </div>
                                <Separator />
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                                        Salary Range
                                    </p>
                                    <div className="flex items-center gap-1.5 text-sm">
                                        <DollarSignIcon className="h-3.5 w-3.5 text-muted-foreground" />
                                        {application.salary_text ||
                                            (application.salary_min && application.salary_max
                                                ? `${application.salary_min.toLocaleString()} - ${application.salary_max.toLocaleString()}`
                                                : "Not specified")}
                                    </div>
                                </div>
                                <Separator />
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                                        Application Deadline
                                    </p>
                                    <p className="text-sm">
                                        {formatDate(application.application_deadline)}
                                    </p>
                                </div>
                                <Separator />
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                                        Posted On
                                    </p>
                                    <p className="text-sm">{formatDate(application.posted_at)}</p>
                                </div>
                                {(application.is_urgent || application.is_featured) && (
                                    <>
                                        <Separator />
                                        <div className="flex flex-wrap gap-2">
                                            {application.is_urgent && (
                                                <Badge
                                                    variant="outline"
                                                    className="border-amber-500/30 text-amber-600"
                                                >
                                                    <ZapIcon className="h-3 w-3 mr-1" />
                                                    Urgent
                                                </Badge>
                                            )}
                                            {application.is_featured && (
                                                <Badge
                                                    variant="outline"
                                                    className="border-purple-500/30 text-purple-600"
                                                >
                                                    <StarIcon className="h-3 w-3 mr-1" />
                                                    Featured
                                                </Badge>
                                            )}
                                        </div>
                                    </>
                                )}
                                {application.contact_email && (
                                    <>
                                        <Separator />
                                        <div>
                                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                                                Contact Email
                                            </p>
                                            <a
                                                href={`mailto:${application.contact_email}`}
                                                className="text-sm text-primary hover:underline"
                                            >
                                                {application.contact_email}
                                            </a>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
