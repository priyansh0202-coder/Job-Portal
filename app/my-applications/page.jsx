"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2Icon, BuildingIcon, MapPinIcon, CalendarIcon, BriefcaseIcon, UserIcon, FileTextIcon, SettingsIcon } from "lucide-react";
import { getUserApplications } from "@/services/jobApplicationService";
import { useAuth } from "@/context/AuthContext";

export default function MyApplicationsPage() {
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // If not authenticated, redirect to login (or wait for auth check)
        // using AuthContext might be async on initial load, so we check loading there too if provided, 
        // but here we just wait for mount.
        if (!isAuthenticated && typeof window !== "undefined") {
            // router.push("/admin/login"); // handled by AuthGuard logic usually, but here manual check
        }

        const fetchApplications = async () => {
            try {
                const data = await getUserApplications();
                setApplications(data.applications || []);
            } catch (err) {
                console.error("Failed to fetch applications:", err);
                setError("Failed to load your applications.");
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchApplications();
        } else {
            // give it a moment to check auth state fully if needed, or if definitely not logged in:
            // setLoading(false);
        }
    }, [isAuthenticated, router]);

    // If we are sure not logged in, we can show a message or redirect
    // But usually Middleware handles protection. 

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-16 flex justify-center">
                <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    const formatDate = (dateString) => {
        if (!dateString) return "Unknown";
        return new Date(dateString).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const statusColors = {
        pending: "secondary",
        reviewed: "info",
        interviewing: "default",
        rejected: "destructive",
        accepted: "success", // if you have this variant
        hired: "success"
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Sidebar */}
                <aside className="md:col-span-1">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle>My Profile</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-1 p-2">
                            <Button variant="ghost" className="justify-start font-normal" disabled>
                                <UserIcon className="mr-2 h-4 w-4" />
                                Profile Settings
                            </Button>
                            <Button variant="secondary" className="justify-start font-medium">
                                <FileTextIcon className="mr-2 h-4 w-4" />
                                My Applications
                            </Button>
                            <Button variant="ghost" className="justify-start font-normal" disabled>
                                <SettingsIcon className="mr-2 h-4 w-4" />
                                Account Settings
                            </Button>
                        </CardContent>
                    </Card>
                </aside>

                {/* Main Content */}
                <main className="md:col-span-3">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">My Applications</CardTitle>
                            <CardDescription>
                                Track the status of your job applications
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {error && <div className="text-destructive mb-4">{error}</div>}

                            {applications.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground">
                                    <BriefcaseIcon className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                    <p>You haven't applied to any jobs yet.</p>
                                    <Link href="/jobs" className="mt-4 inline-block">
                                        <Button>Browse Jobs</Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {applications.map((app) => (
                                        <div key={app.application_id} className="border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                                            <div className="flex flex-col md:flex-row justify-between gap-4">
                                                <div className="space-y-1">
                                                    <h3 className="font-semibold text-lg hover:underline">
                                                        <Link href={`/jobs/${app.job_id}`}>
                                                            {app.title || "Unknown Job"}
                                                        </Link>
                                                    </h3>
                                                    <div className="flex items-center text-sm text-muted-foreground gap-3">
                                                        <span className="flex items-center">
                                                            <BuildingIcon className="h-3.5 w-3.5 mr-1" />
                                                            {app.company_name}
                                                        </span>
                                                        <span className="flex items-center">
                                                            <MapPinIcon className="h-3.5 w-3.5 mr-1" />
                                                            {app.location}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center text-sm text-muted-foreground pt-1">
                                                        <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                                                        Applied on {formatDate(app.applied_at)}
                                                    </div>
                                                </div>

                                                <div className="flex flex-col items-end gap-2 text-right">
                                                    <Badge variant={statusColors[app.application_status] || "outline"}>
                                                        {app.application_status ? app.application_status.charAt(0).toUpperCase() + app.application_status.slice(1) : "Applied"}
                                                    </Badge>
                                                    <Link href={`/jobs/${app.job_id}`}>
                                                        <Button size="sm" variant="outline">
                                                            View Job
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </main>
            </div>
        </div>
    );
}
