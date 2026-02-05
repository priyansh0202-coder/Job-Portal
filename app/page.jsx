

"use client";
import { Button } from '@/components/ui/button';
import { Briefcase, Building, Users, Search, MapPin, ArrowRight, TrendingUp, ShieldCheck, Clock, SearchCheck, SearchIcon } from 'lucide-react';
import FeaturedJobs from '@/components/featured-jobs';
import { useAuth } from '../context/AuthContext';
import { getJobs } from '../services/jobService';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');

  const fetchJobs = async () => {
    const data = await getJobs();
    setJobs(data);
  }

  useEffect(() => {
    fetchJobs();
  }, []);

  const { user } = useAuth();

  const handleSearch = () => {
    window.location.href = `/jobs?search=${searchQuery}&location=${location}`;
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
              className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <Button onClick={handleSearch} size="lg" className="px-2 rounded-xl">
            
            <SearchIcon className=" h-4 w-4" />
          </Button>
        </div>
        <div className="w-full max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-[2fr,320px] gap-6 items-start">
            {/* Featured Jobs Section - Left Side */}
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-foreground">Featured Jobs</h2>
              </div>
              <FeaturedJobs />
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
                        <h3 className="text-base font-bold text-foreground">PRIYANSH SONI</h3>
                        <p className="text-xs text-muted-foreground">Software Developer</p>
                        <p className="text-xs text-muted-foreground">@ Infusyx Services</p>
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
          <div className="relative overflow-hidden bg-gradient-to-r from-primary to-primary/80 rounded-3xl p-12 md:p-16">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

            <div className="relative z-10 max-w-3xl mx-auto text-center text-white">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Ready to Find Your Dream Job?
              </h2>
              <p className="text-lg md:text-xl mb-8 text-white/90">
                Join thousands of professionals who've already found their perfect role through JobHub
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/jobs">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto rounded-xl px-8">
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