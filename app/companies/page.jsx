"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon, MapPinIcon, BriefcaseIcon, UsersIcon, BuildingIcon } from "lucide-react";
import { getAdminCompanies } from "@/services/companyService";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const data = await getAdminCompanies();
        if (data && data.companies) {
          setCompanies(data.companies);
        }
      } catch (err) {
        console.error("Failed to fetch companies:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  const filteredCompanies = companies.filter(c => 
    c.company_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Browse Companies</h1>
          <p className="text-muted-foreground">Discover great places to work</p>
        </div>
        <p className="text-sm text-muted-foreground mt-2 md:mt-0">
          Showing <span className="font-medium">{filteredCompanies.length}</span> companies
        </p>
      </div>

      {/* Search */}
      <div className="bg-card rounded-lg p-4 mb-8 shadow-sm">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search companies by name..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : filteredCompanies.length === 0 ? (
        <div className="text-center py-12">
          <BuildingIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-20" />
          <h3 className="text-xl font-medium text-muted-foreground">No Companies Found</h3>
          <p className="text-sm text-muted-foreground mt-2">Try adjusting your search criteria.</p>
        </div>
      ) : (
        /* Companies Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-md overflow-hidden bg-primary/10 flex items-center justify-center text-primary">
                    <BuildingIcon className="h-8 w-8" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{company.company_name}</CardTitle>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPinIcon className="h-3 w-3 mr-1" />
                      Various Locations
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="py-4">
                <Badge className="mb-3">Multiple Industries</Badge>
                <CardDescription className="line-clamp-3">
                  {company.company_name} is actively hiring. Check out their latest job openings on our platform to find your next career opportunity.
                </CardDescription>
                <div className="flex items-center mt-4 text-sm text-muted-foreground">
                  <div className="flex items-center mr-4">
                    <UsersIcon className="h-4 w-4 mr-1" />
                    Various Sizes
                  </div>
                  <div className="flex items-center text-primary font-medium">
                    <BriefcaseIcon className="h-4 w-4 mr-1" />
                    {company.job_count} active {company.job_count === 1 ? 'job' : 'jobs'}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link href={`/jobs?search=${encodeURIComponent(company.company_name)}`} className="w-full">
                  <Button variant="outline" className="w-full">
                    View Jobs
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}