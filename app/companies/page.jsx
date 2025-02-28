import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon, MapPinIcon, BriefcaseIcon, UsersIcon } from "lucide-react";

// Mock data for companies
const companies = [
  {
    id: 1,
    name: "TechCorp",
    logo: "https://images.unsplash.com/photo-1549923746-c502d488b3ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80",
    location: "San Francisco, CA",
    industry: "Technology",
    size: "500-1000 employees",
    description: "TechCorp is a leading technology company specializing in innovative software solutions for businesses of all sizes.",
    activeJobs: 3,
  },
  {
    id: 2,
    name: "DataWorks",
    logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
    location: "Remote",
    industry: "Data Science",
    size: "100-500 employees",
    description: "DataWorks specializes in data analytics and machine learning solutions for enterprise clients.",
    activeJobs: 2,
  },
  {
    id: 3,
    name: "CreativeMinds",
    logo: "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    location: "New York, NY",
    industry: "Design",
    size: "50-100 employees",
    description: "CreativeMinds is a design agency focused on creating beautiful and functional user experiences for digital products.",
    activeJobs: 1,
  },
  {
    id: 4,
    name: "CloudSystems",
    logo: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1172&q=80",
    location: "Austin, TX",
    industry: "Cloud Computing",
    size: "100-500 employees",
    description: "CloudSystems provides cloud infrastructure and DevOps solutions for modern businesses.",
    activeJobs: 2,
  },
  {
    id: 5,
    name: "InnovateTech",
    logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
    location: "Chicago, IL",
    industry: "Technology",
    size: "100-500 employees",
    description: "InnovateTech develops cutting-edge software products that help businesses streamline their operations.",
    activeJobs: 1,
  },
  {
    id: 6,
    name: "ServerStack",
    logo: "https://images.unsplash.com/photo-1549923746-c502d488b3ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80",
    location: "Seattle, WA",
    industry: "Technology",
    size: "50-100 employees",
    description: "ServerStack specializes in backend infrastructure and API development for web and mobile applications.",
    activeJobs: 1,
  },
];

export default function CompaniesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Browse Companies</h1>
          <p className="text-muted-foreground">Discover great places to work</p>
        </div>
        <p className="text-sm text-muted-foreground mt-2 md:mt-0">
          Showing <span className="font-medium">{companies.length}</span> companies
        </p>
      </div>

      {/* Search */}
      <div className="bg-card rounded-lg p-4 mb-8 shadow-sm">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search companies by name, industry, or location" 
            className="pl-10"
          />
        </div>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company) => (
          <Card key={company.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-md overflow-hidden">
                  <img 
                    src={company.logo} 
                    alt={company.name} 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <CardTitle className="text-xl">{company.name}</CardTitle>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPinIcon className="h-3 w-3 mr-1" />
                    {company.location}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="py-4">
              <Badge className="mb-3">{company.industry}</Badge>
              <CardDescription className="line-clamp-3">
                {company.description}
              </CardDescription>
              <div className="flex items-center mt-4 text-sm text-muted-foreground">
                <div className="flex items-center mr-4">
                  <UsersIcon className="h-4 w-4 mr-1" />
                  {company.size}
                </div>
                <div className="flex items-center">
                  <BriefcaseIcon className="h-4 w-4 mr-1" />
                  {company.activeJobs} active jobs
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link href={`/companies/${company.id}`} className="w-full">
                <Button variant="outline" className="w-full">
                  View Company
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}