"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
    Loader2Icon,
    SearchIcon,
    ArrowLeftIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    FileTextIcon,
    UserIcon,
    BriefcaseIcon,
    BuildingIcon,
    MapPinIcon,
    CalendarIcon,
    FilterIcon,
    XIcon,
    InboxIcon,
    ExternalLinkIcon,
} from "lucide-react";
import { getAdminApplications } from "@/services/adminApplicationService";

const ITEMS_PER_PAGE = 10;

const STATUS_OPTIONS = [
    { value: "all", label: "All Statuses" },
    { value: "pending", label: "Pending" },
    { value: "reviewed", label: "Reviewed" },
    { value: "shortlisted", label: "Shortlisted" },
    { value: "rejected", label: "Rejected" },
];

const statusConfig = {
    pending: {
        variant: "secondary",
        label: "Pending",
        color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    },
    reviewed: {
        variant: "default",
        label: "Reviewed",
        color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    },
    shortlisted: {
        variant: "default",
        label: "Shortlisted",
        color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    },
    rejected: {
        variant: "destructive",
        label: "Rejected",
        color: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
    },
};

const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

export default function AdminApplicationsPage() {
    const router = useRouter();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    // Filters
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setPage(0); // Reset to first page on new search
        }, 400);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Reset page on filter change
    useEffect(() => {
        setPage(0);
    }, [statusFilter]);

    const fetchApplications = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const filters = {
                limit: ITEMS_PER_PAGE,
                offset: page * ITEMS_PER_PAGE,
            };
            if (statusFilter && statusFilter !== "all") {
                filters.status = statusFilter;
            }
            if (debouncedSearch.trim()) {
                filters.search = debouncedSearch.trim();
            }
            const data = await getAdminApplications(filters);
            const apps = data.applications || [];
            setApplications(apps);
            setHasMore(apps.length === ITEMS_PER_PAGE);
        } catch (err) {
            console.error("Failed to fetch applications:", err);
            setError(
                err?.response?.data?.error || "Failed to load applications. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }, [page, statusFilter, debouncedSearch]);

    useEffect(() => {
        fetchApplications();
    }, [fetchApplications]);

    const clearFilters = () => {
        setSearchQuery("");
        setDebouncedSearch("");
        setStatusFilter("all");
        setPage(0);
    };

    const hasActiveFilters = statusFilter !== "all" || debouncedSearch.length > 0;

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            {/* Header */}
            <div className="mb-8">
                <Link
                    href="/admin/dashboard"
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
                >
                    <ArrowLeftIcon className="h-4 w-4 mr-1" />
                    Back to Dashboard
                </Link>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
                        <p className="text-muted-foreground mt-1">
                            Review and manage all job applications
                        </p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <Card className="mb-6">
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1 relative">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="search-applications"
                                placeholder="Search by job title, company, or applicant name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <div className="w-full md:w-[200px]">
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger id="status-filter">
                                    <FilterIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {STATUS_OPTIONS.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        {hasActiveFilters && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearFilters}
                                className="text-muted-foreground hover:text-foreground"
                            >
                                <XIcon className="h-4 w-4 mr-1" />
                                Clear
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Applications List */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-24">
                    <Loader2Icon className="h-8 w-8 animate-spin text-primary mb-4" />
                    <p className="text-muted-foreground">Loading applications...</p>
                </div>
            ) : error ? (
                <Card>
                    <CardContent className="py-16 text-center">
                        <div className="text-destructive mb-4 text-lg">{error}</div>
                        <Button onClick={fetchApplications} variant="outline">
                            Try Again
                        </Button>
                    </CardContent>
                </Card>
            ) : applications.length === 0 ? (
                <Card>
                    <CardContent className="py-16 text-center">
                        <InboxIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
                        <h3 className="text-lg font-semibold mb-2">No applications found</h3>
                        <p className="text-muted-foreground">
                            {hasActiveFilters
                                ? "Try adjusting your search or filters."
                                : "Applications will appear here once candidates apply to your jobs."}
                        </p>
                        {hasActiveFilters && (
                            <Button variant="outline" onClick={clearFilters} className="mt-4">
                                Clear Filters
                            </Button>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-3">
                    {applications.map((app) => {
                        const statusInfo = statusConfig[app.application_status] || statusConfig.pending;
                        return (
                            <Card
                                key={app.application_id}
                                className="group hover:shadow-md transition-all duration-200 hover:border-primary/20 cursor-pointer"
                                onClick={() => router.push(`/admin/applications/${app.application_id}`)}
                            >
                                <CardContent className="py-5">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        {/* Left: Applicant and job info */}
                                        <div className="flex items-start gap-4 flex-1 min-w-0">
                                            {/* Avatar */}
                                            <div className="hidden sm:flex h-12 w-12 rounded-full bg-primary/10 items-center justify-center flex-shrink-0">
                                                <UserIcon className="h-5 w-5 text-primary" />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-semibold text-base truncate group-hover:text-primary transition-colors">
                                                        {app.applicant_name || "Unknown Applicant"}
                                                    </h3>
                                                    <span
                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusInfo.color}`}
                                                    >
                                                        {statusInfo.label}
                                                    </span>
                                                </div>

                                                <p className="text-sm text-muted-foreground truncate mb-2">
                                                    {app.applicant_email}
                                                </p>

                                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                                                    <span className="flex items-center">
                                                        <BriefcaseIcon className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                                                        <span className="truncate max-w-[200px]">
                                                            {app.title || "Untitled Position"}
                                                        </span>
                                                    </span>
                                                    <span className="flex items-center">
                                                        <BuildingIcon className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                                                        {app.company_name}
                                                    </span>
                                                    <span className="flex items-center">
                                                        <MapPinIcon className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                                                        {app.location}
                                                    </span>
                                                    <span className="flex items-center">
                                                        <CalendarIcon className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                                                        {formatDate(app.applied_at)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right: Actions */}
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            {app.resume_url && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-xs"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        window.open(
                                                            `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}${app.resume_url}`,
                                                            "_blank"
                                                        );
                                                    }}
                                                >
                                                    <FileTextIcon className="h-3.5 w-3.5 mr-1" />
                                                    Resume
                                                </Button>
                                            )}
                                            <Button
                                                size="sm"
                                                variant="default"
                                                className="text-xs"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    router.push(`/admin/applications/${app.application_id}`);
                                                }}
                                            >
                                                <ExternalLinkIcon className="h-3.5 w-3.5 mr-1" />
                                                View Details
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Pagination */}
            {!loading && applications.length > 0 && (
                <div className="flex items-center justify-between mt-6">
                    <p className="text-sm text-muted-foreground">
                        Showing {page * ITEMS_PER_PAGE + 1} –{" "}
                        {page * ITEMS_PER_PAGE + applications.length} results
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page === 0}
                            onClick={() => setPage((p) => Math.max(0, p - 1))}
                        >
                            <ChevronLeftIcon className="h-4 w-4 mr-1" />
                            Previous
                        </Button>
                        <span className="text-sm font-medium px-3 py-1 rounded bg-muted">
                            Page {page + 1}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={!hasMore}
                            onClick={() => setPage((p) => p + 1)}
                        >
                            Next
                            <ChevronRightIcon className="h-4 w-4 ml-1" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
