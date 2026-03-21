

"use client";
import { Button } from '@/components/ui/button';
import { Briefcase, Building, Users, Search, MapPin, ArrowRight, TrendingUp, ShieldCheck, Clock, SearchCheck, SearchIcon, X, BanknoteIcon, CalendarIcon } from 'lucide-react';
import FeaturedJobs from '@/components/featured-jobs';
import { useAuth } from '../context/AuthContext';
import { getJobs } from '../services/jobService';
import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [activeLocation, setActiveLocation] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const fetchJobs = async () => {
    const data = await getJobs();
    setJobs(data);
  }

  useEffect(() => {
    fetchJobs();
  }, []);

  const { user } = useAuth();

  const handleSearch = () => {
    const trimmedSearch = searchQuery.trim();
    const trimmedLocation = location.trim();
    if (!trimmedSearch && !trimmedLocation) return;
    setActiveSearch(trimmedSearch.toLowerCase());
    setActiveLocation(trimmedLocation.toLowerCase());
    setIsSearching(true);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setLocation('');
    setActiveSearch('');
    setActiveLocation('');
    setIsSearching(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  // Filter jobs based on active search criteria
  const searchResults = useMemo(() => {
    if (!isSearching) return [];
    const jobsArray = Array.isArray(jobs?.jobs) ? jobs.jobs : (Array.isArray(jobs) ? jobs : []);
    return jobsArray.filter((job) => {
      const title = (job.title ?? job.job_title ?? '').toLowerCase();
      const company = (job.company_name ?? job.company ?? '').toLowerCase();
      const description = (job.description ?? '').toLowerCase();
      const jobLocation = (job.location ?? job.city ?? '').toLowerCase();

      const matchesSearch = !activeSearch || 
        title.includes(activeSearch) || 
        company.includes(activeSearch) || 
        description.includes(activeSearch);

      const matchesLocation = !activeLocation || 
        jobLocation.includes(activeLocation);

      return matchesSearch && matchesLocation;
    });
  }, [jobs, isSearching, activeSearch, activeLocation]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const diffDays = Math.ceil((Date.now() - date) / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Search */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10 dark:from-primary/10 dark:via-background dark:to-primary/5">
        {/* Search Bar */}
        <div className="w-full max-w-2xl  mx-auto bg-background border-2 border-border rounded-2xl p-2 shadow-lg flex flex-col md:flex-row gap-2 mt-4">
          <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/50">
            <Search className="h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Job title, keyword, or company"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/50 ">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="City or remote"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
            />
          </div>
          {isSearching && (
            <Button onClick={clearSearch} size="lg" variant="ghost" className="px-2 rounded-xl text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </Button>
          )}
          <Button onClick={handleSearch} size="lg" className="px-2 rounded-xl">
            <SearchIcon className=" h-4 w-4" />
          </Button>
        </div>
        <div className="w-full max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-[2fr,320px] gap-6 items-start">
            {/* Featured Jobs / Search Results Section - Left Side */}
            <div className="space-y-4">
              {isSearching ? (
                <>
                  {/* Search Results Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">Search Results</h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        {searchResults.length} job{searchResults.length !== 1 ? 's' : ''} found
                        {activeSearch && <> for <span className="font-medium text-foreground">"{activeSearch}"</span></>}
                        {activeLocation && <> in <span className="font-medium text-foreground">"{activeLocation}"</span></>}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" onClick={clearSearch} className="rounded-lg">
                      <X className="h-3.5 w-3.5 mr-1.5" />
                      Clear Search
                    </Button>
                  </div>

                  {/* Search Results List */}
                  {searchResults.length === 0 ? (
                    <div className="bg-muted/30 border border-border rounded-2xl p-12 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
                        <SearchIcon className="h-7 w-7 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">No jobs found</h3>
                      <p className="text-muted-foreground text-sm max-w-md mx-auto">
                        We couldn't find any jobs matching your search. Try adjusting your keywords or location.
                      </p>
                      <Button variant="outline" className="mt-4 rounded-lg" onClick={clearSearch}>
                        Browse All Jobs
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {searchResults.map((job) => (
                        <div key={job.id} className="bg-background border border-border rounded-xl p-5 hover:shadow-lg hover:border-primary/50 transition-all duration-200">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                            <Link href={`/jobs/${job.id}`} className="flex-1 min-w-0 space-y-3">
                              <div>
                                <h3 className="text-xl font-bold text-foreground hover:text-primary transition-colors line-clamp-2 cursor-pointer mb-2">
                                  {job.title}
                                </h3>
                                <p className="text-base text-muted-foreground flex items-center gap-2">
                                  <Building className="h-4 w-4 flex-shrink-0" />
                                  <span className="font-medium">{job.company_name}</span>
                                </p>
                              </div>
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1.5">
                                  <MapPin className="h-4 w-4 flex-shrink-0" />
                                  <span>{job.location}</span>
                                </span>
                                {job.salary_text && (
                                  <span className="flex items-center gap-1.5">
                                    <BanknoteIcon className="h-4 w-4 flex-shrink-0" />
                                    <span className="font-medium">{job.salary_text}</span>
                                  </span>
                                )}
                                {job.posted_at && (
                                  <span className="flex items-center gap-1.5">
                                    <CalendarIcon className="h-4 w-4 flex-shrink-0" />
                                    <span>Posted {formatDate(job.posted_at)}</span>
                                  </span>
                                )}
                              </div>
                              {job.description && (
                                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                  {job.description}
                                </p>
                              )}
                              <div className="flex items-center gap-2 pt-1">
                                {job.job_type && (
                                  <Badge variant={job.job_type === 'Full-time' ? 'default' : 'outline'} className="text-xs px-3 py-1">
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
                            <div className="flex-shrink-0 sm:self-start">
                              <Link href={`/jobs/${job.id}`}>
                                <Button
                                  size="default"
                                  className="w-full sm:w-auto rounded-lg font-semibold px-6 py-2 shadow-sm hover:shadow-md transition-shadow"
                                >
                                  View Details
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-foreground">Featured Jobs</h2>
                  </div>
                  <FeaturedJobs />
                </>
              )}
            </div>

            {/* Profile Sidebar */}
            <div className="hidden lg:block">
              <div className="bg-background border border-border rounded-2xl p-4 shadow-lg space-y-4 sticky top-24 w-[320px]">
                {user ? (
                  <>
                    {/* Profile Header */}
                    <div className="text-center space-y-3 pb-4 border-b border-border">
                      <div className="relative w-20 h-20 mx-auto">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center border-4 border-background shadow-lg">
                          <Users className="h-8 w-8 text-primary" />
                        </div>
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                          100%
                        </div>
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-foreground">{user.name}</h3>
                        {/* <p className="text-xs text-muted-foreground">{user.role}</p>
                        <p className="text-xs text-muted-foreground">@ {user.company}</p> */}
                        <p className="text-xs text-muted-foreground/70 mt-1">Last updated yesterday</p>
                      </div>
                      <Button className="w-full rounded-lg" size="sm">
                        View profile
                      </Button>
                    </div>

                    {/* Profile Performance */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                        <span>Profile performance</span>
                        <div className="h-3 w-3 rounded-full bg-muted flex items-center justify-center">
                          <span className="text-[10px]">?</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <p className="text-[10px] text-muted-foreground">Search appearances</p>
                          <div className="flex items-baseline gap-1">
                            <span className="text-xl font-bold text-primary">103</span>
                            <ArrowRight className="h-3 w-3 text-primary rotate-[-45deg]" />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] text-muted-foreground">Recruiter actions</p>
                          <div className="flex items-baseline gap-1">
                            <span className="text-xl font-bold text-primary">14</span>
                            <ArrowRight className="h-3 w-3 text-primary rotate-[-45deg]" />
                          </div>
                        </div>
                      </div>

                      <div className="bg-muted/50 rounded-lg p-2.5 flex items-center justify-between hover:bg-muted transition-colors cursor-pointer">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-foreground flex-shrink-0" />
                          <span className="text-xs font-medium text-foreground">Get 3X boost to your profile</span>
                        </div>
                        <ArrowRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-1 pt-3 border-t border-border">
                      <Link href="/" className="flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                          <Users className="h-4 w-4 text-foreground" />
                        </div>
                        <span className="text-sm font-medium text-foreground">My home</span>
                      </Link>

                      <Link href="/jobs" className="flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                          <Briefcase className="h-4 w-4 text-foreground" />
                        </div>
                        <span className="text-sm font-medium text-foreground">Jobs</span>
                      </Link>

                      <Link href="/companies" className="flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                          <Building className="h-4 w-4 text-foreground" />
                        </div>
                        <span className="text-sm font-medium text-foreground">Companies</span>
                      </Link>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Guest Profile */}
                    <div className="text-center space-y-3 pb-4 border-b border-border">
                      <div className="relative w-20 h-20 mx-auto">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center border-4 border-background shadow-lg">
                          <Users className="h-8 w-8 text-primary" />
                        </div>
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                          0%
                        </div>
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-foreground">Welcome to JobHub!</h3>
                        <p className="text-xs text-muted-foreground">Complete your profile</p>
                        <p className="text-xs text-muted-foreground/70 mt-1">Profile not created</p>
                      </div>
                      <Link href="/admin/login" className="block">
                        <Button className="w-full rounded-lg" size="sm">
                          Create Profile
                        </Button>
                      </Link>
                    </div>

                    {/* Getting Started Steps */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                        <span>Getting Started</span>
                      </div>

                      <div className="space-y-2">
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-2.5 flex items-start gap-2">
                          <div className="mt-0.5 h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-[10px] font-bold">1</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-foreground">Create your profile</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">Add your details</p>
                          </div>
                        </div>

                        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-2.5 flex items-start gap-2">
                          <div className="mt-0.5 h-5 w-5 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-[10px] font-bold">2</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-foreground">Search for jobs</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">Explore 1000+ opportunities</p>
                          </div>
                        </div>

                        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-2.5 flex items-start gap-2">
                          <div className="mt-0.5 h-5 w-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-[10px] font-bold">3</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-foreground">Apply & get hired</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">Land your dream job</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Browse */}
                    <div className="space-y-1 pt-3 border-t border-border">
                      <Link href="/" className="flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                          <Users className="h-4 w-4 text-foreground" />
                        </div>
                        <span className="text-sm font-medium text-foreground">My home</span>
                      </Link>

                      <Link href="/jobs" className="flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                          <Briefcase className="h-4 w-4 text-foreground" />
                        </div>
                        <span className="text-sm font-medium text-foreground">Jobs</span>
                      </Link>

                      <Link href="/companies" className="flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                          <Building className="h-4 w-4 text-foreground" />
                        </div>
                        <span className="text-sm font-medium text-foreground">Companies</span>
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="border-y border-border bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center justify-center gap-3 p-4">
              <ShieldCheck className="h-8 w-8 text-primary" />
              <div>
                <p className="font-semibold text-foreground">Verified</p>
                <p className="text-xs text-muted-foreground">Companies</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 p-4">
              <Clock className="h-8 w-8 text-primary" />
              <div>
                <p className="font-semibold text-foreground">24/7</p>
                <p className="text-xs text-muted-foreground">Support</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 p-4">
              <TrendingUp className="h-8 w-8 text-primary" />
              <div>
                <p className="font-semibold text-foreground">95%</p>
                <p className="text-xs text-muted-foreground">Success Rate</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 p-4">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="font-semibold text-foreground">10K+</p>
                <p className="text-xs text-muted-foreground">Job Seekers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Redesigned */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Why Choose JobHub?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join thousands of job seekers who found their dream careers through our platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group relative bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-2xl p-8 hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all"></div>
              <div className="relative">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-blue-500/10 mb-6 group-hover:scale-110 transition-transform">
                  <Briefcase className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="text-4xl font-bold mb-2 text-foreground">1000+</h3>
                <p className="text-muted-foreground font-medium mb-2">Active Job Listings</p>
                <p className="text-sm text-muted-foreground">New opportunities added every day from top companies</p>
              </div>
            </div>

            <div className="group relative bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-2xl p-8 hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all"></div>
              <div className="relative">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-purple-500/10 mb-6 group-hover:scale-110 transition-transform">
                  <Building className="h-8 w-8 text-purple-500" />
                </div>
                <h3 className="text-4xl font-bold mb-2 text-foreground">500+</h3>
                <p className="text-muted-foreground font-medium mb-2">Trusted Companies</p>
                <p className="text-sm text-muted-foreground">From startups to Fortune 500 companies</p>
              </div>
            </div>

            <div className="group relative bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-2xl p-8 hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl group-hover:bg-green-500/20 transition-all"></div>
              <div className="relative">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-green-500/10 mb-6 group-hover:scale-110 transition-transform">
                  <Users className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-4xl font-bold mb-2 text-foreground">10,000+</h3>
                <p className="text-muted-foreground font-medium mb-2">Happy Job Seekers</p>
                <p className="text-sm text-muted-foreground">Successfully placed in their dream roles</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-12 md:p-16">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/15 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>

            <div className="relative z-10 max-w-3xl mx-auto text-center text-white">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Ready to Find Your Dream Job?
              </h2>
              <p className="text-lg md:text-xl mb-8 text-white/80">
                Join thousands of professionals who've already found their perfect role through JobHub
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/jobs">
                  <Button size="lg" className="w-full sm:w-auto rounded-xl px-8 bg-white text-slate-900 hover:bg-white/90 font-semibold">
                    Browse Jobs
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                {!user && (
                  <Link href="/admin/login">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-xl px-8 bg-transparent text-white border-white/30 hover:bg-white/10 hover:text-white">
                      Post a Job
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}