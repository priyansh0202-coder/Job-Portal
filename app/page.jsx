import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BriefcaseIcon, BuildingIcon, UsersIcon } from 'lucide-react';
import FeaturedJobs from '@/components/featured-jobs';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Find Your Dream Job <span className="text-primary">Today</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Connect with top employers and discover opportunities that match your skills and career goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/jobs">
                <Button size="lg" className="w-full sm:w-auto">
                  Browse Jobs
                </Button>
              </Link>
              <Link href="/admin/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Employer Login
                </Button>
              </Link>
            </div>
          </div>
          <div className="hidden md:block">
            <img 
              src="https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
              alt="Job Search" 
              className="rounded-lg shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted/50 rounded-lg my-12">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="flex justify-center">
                <BriefcaseIcon className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-3xl font-bold">1000+</h3>
              <p className="text-muted-foreground">Active Job Listings</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-center">
                <BuildingIcon className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-3xl font-bold">500+</h3>
              <p className="text-muted-foreground">Companies</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-center">
                <UsersIcon className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-3xl font-bold">10,000+</h3>
              <p className="text-muted-foreground">Job Seekers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Featured Job Opportunities</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our handpicked selection of top job opportunities from leading companies
          </p>
        </div>
        <FeaturedJobs />
        <div className="text-center mt-8">
          <Link href="/jobs">
            <Button variant="outline" size="lg">
              View All Jobs
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}