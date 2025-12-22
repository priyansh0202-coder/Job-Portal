"use client";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { BuildingIcon, MapPinIcon, BanknoteIcon, CalendarIcon, SearchIcon, FilterIcon } from "lucide-react";
import Link from "next/link";

/* ----------------------- helpers ----------------------- */

const formatDate = (dateString) => {
  if (!dateString) return "Unknown";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Unknown";
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return `${diffDays} days ago`;
};

function readJobsFromLocalStorage() {
  try {
    const raw = localStorage.getItem("jobs");
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    if (parsed && Array.isArray(parsed.data)) return parsed.data;
    if (parsed && Array.isArray(parsed.jobs)) return parsed.jobs;
    return [];
  } catch (err) {
    console.error("Failed to parse jobs from localStorage", err);
    return [];
  }
}

function normalizeString(s) {
  return (s ?? "").toString().toLowerCase();
}

function toNumberSafe(v) {
  if (v === undefined || v === null || v === "") return null;
  const n = Number(String(v).replace(/,/g, ""));
  return Number.isFinite(n) ? n : null;
}

/* ----------------------- component ----------------------- */

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);

  // Filters / search state
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [jobType, setJobType] = useState("all");
  const [location, setLocation] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [experienceFilter, setExperienceFilter] = useState("all");

  // Advanced filters (applied globally)
  const [companyFilter, setCompanyFilter] = useState("all");
  const [minSalaryFilter, setMinSalaryFilter] = useState("");
  const [maxSalaryFilter, setMaxSalaryFilter] = useState("");
  const [urgentOnly, setUrgentOnly] = useState(false);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [postedWithin, setPostedWithin] = useState("any"); // options: any,1,7,30,90

  // Modal state and its local copy of advanced filters
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalFilters, setModalFilters] = useState({
    company: "all",
    minSalary: "",
    maxSalary: "",
    urgent: false,
    featured: false,
    remote: false,
    postedWithin: "any",
  });

  // load once
  useEffect(() => {
    const fromStorage = readJobsFromLocalStorage();
    setJobs(fromStorage);
  }, []);

  // debounce search (300ms)
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim().toLowerCase()), 300);
    return () => clearTimeout(t);
  }, [search]);

  // unique lists used in selects (memoized)
  const { jobTypes, locations, categories, experiences, companies } = useMemo(() => {
    const jt = new Set();
    const loc = new Set();
    const cat = new Set();
    const exp = new Set();
    const comp = new Set();

    jobs.forEach((j) => {
      if (j.job_type) jt.add(j.job_type);
      if (j.type) jt.add(j.type);
      if (j.location) loc.add(j.location);
      if (j.city) loc.add(j.city);
      if (j.category) cat.add(j.category);
      if (j.experience_level) exp.add(j.experience_level);
      const company = j.company_name ?? j.company ?? j.employer;
      if (company) comp.add(company);
    });

    return {
      jobTypes: ["all", ...Array.from(jt)],
      locations: ["all", ...Array.from(loc)],
      categories: ["all", ...Array.from(cat)],
      experiences: ["all", ...Array.from(exp)],
      companies: ["all", ...Array.from(comp)],
    };
  }, [jobs]);

  // compute date cutoff for postedWithin
  const getPostedCutoff = (option) => {
    if (!option || option === "any") return null;
    const days = Number(option);
    if (!Number.isFinite(days) || days <= 0) return null;
    const now = new Date();
    now.setDate(now.getDate() - days);
    return now;
  };

  // Core filtering logic (memoized)
  const filteredJobs = useMemo(() => {
    if (!Array.isArray(jobs)) return [];

    const minSalaryNum = toNumberSafe(minSalaryFilter);
    const maxSalaryNum = toNumberSafe(maxSalaryFilter);
    const postedCutoff = getPostedCutoff(postedWithin);

    return jobs.filter((job) => {
      // normalize fields
      const title = normalizeString(job.title ?? job.job_title);
      const company = normalizeString(job.company_name ?? job.company ?? job.employer);
      const category = normalizeString(job.category);
      const description = normalizeString(job.description ?? job.requirements ?? job.requirements_text);
      const allText = `${title} ${company} ${category} ${description}`;

      // search match
      if (debouncedSearch) {
        const tokens = debouncedSearch.split(/\s+/).filter(Boolean);
        const matchSearch = tokens.every((t) => allText.includes(t));
        if (!matchSearch) return false;
      }

      // jobType filter
      if (jobType && jobType !== "all") {
        const jt = (job.job_type ?? job.type ?? "").toString().toLowerCase();
        if (!jt.includes(jobType.toLowerCase())) return false;
      }

      // location filter
      if (location && location !== "all") {
        const loc = (job.location ?? job.city ?? "").toString().toLowerCase();
        if (!loc.includes(location.toLowerCase())) return false;
      }

      // category filter
      if (categoryFilter && categoryFilter !== "all") {
        const catVal = (job.category ?? "").toString().toLowerCase();
        if (!catVal.includes(categoryFilter.toLowerCase())) return false;
      }

      // experience filter
      if (experienceFilter && experienceFilter !== "all") {
        const exVal = (job.experience_level ?? "").toString().toLowerCase();
        if (!exVal.includes(experienceFilter.toLowerCase())) return false;
      }

      // company filter
      if (companyFilter && companyFilter !== "all") {
        const compVal = (job.company_name ?? job.company ?? job.employer ?? "").toString().toLowerCase();
        if (!compVal.includes(companyFilter.toLowerCase())) return false;
      }

      // urgentOnly / featuredOnly
      if (urgentOnly && !job.is_urgent) return false;
      if (featuredOnly && !job.is_featured) return false;

      // remoteOnly
      if (remoteOnly) {
        const isRemoteFlag = job.is_remote === true || String(job.is_remote) === "true";
        const locVal = (job.location ?? "").toString().toLowerCase();
        if (!(isRemoteFlag || locVal.includes("remote"))) return false;
      }

      // salary range filter
      if (minSalaryNum !== null || maxSalaryNum !== null) {
        const sMin = toNumberSafe(job.salary_min) ?? null;
        const sMax = toNumberSafe(job.salary_max) ?? null;

        const overlaps = () => {
          if (sMin !== null && sMax !== null) {
            if (minSalaryNum !== null && sMax < minSalaryNum) return false;
            if (maxSalaryNum !== null && sMin > maxSalaryNum) return false;
            return true;
          }
          if (sMin !== null && sMax === null) {
            if (minSalaryNum !== null && sMin < minSalaryNum) return false;
            if (maxSalaryNum !== null && sMin > maxSalaryNum) return false;
            return true;
          }
          if (sMax !== null && sMin === null) {
            if (minSalaryNum !== null && sMax < minSalaryNum) return false;
            return true;
          }

          const text = job.salary_text ?? job.salary ?? "";
          const numMatch = String(text).replace(/,/g, "").match(/\d+(\.\d+)?/);
          if (numMatch) {
            const num = Number(numMatch[0]);
            if (minSalaryNum !== null && num < minSalaryNum) return false;
            if (maxSalaryNum !== null && num > maxSalaryNum) return false;
            return true;
          }
          return false;
        };

        if (!overlaps()) return false;
      }

      // postedWithin filter
      if (postedCutoff) {
        const postedAt = job.posted_at ?? job.postedDate ?? job.created_at ?? job.createdAt ?? null;
        if (!postedAt) return false;
        const postedDate = new Date(postedAt);
        if (isNaN(postedDate.getTime())) return false;
        if (postedDate < postedCutoff) return false;
      }

      return true;
    });
  }, [
    jobs,
    debouncedSearch,
    jobType,
    location,
    categoryFilter,
    experienceFilter,
    companyFilter,
    minSalaryFilter,
    maxSalaryFilter,
    urgentOnly,
    featuredOnly,
    remoteOnly,
    postedWithin,
  ]);

  // helper to clear filters
  const clearFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setJobType("all");
    setLocation("all");
    setCategoryFilter("all");
    setExperienceFilter("all");
    setCompanyFilter("all");
    setMinSalaryFilter("");
    setMaxSalaryFilter("");
    setUrgentOnly(false);
    setFeaturedOnly(false);
    setRemoteOnly(false);
    setPostedWithin("any");
  };

  // open modal and copy current advanced filters into modal state
  const openModal = () => {
    setModalFilters({
      company: companyFilter,
      minSalary: minSalaryFilter,
      maxSalary: maxSalaryFilter,
      urgent: urgentOnly,
      featured: featuredOnly,
      remote: remoteOnly,
      postedWithin: postedWithin,
    });
    setIsModalOpen(true);
  };

  // apply modal filters to global filters and close
  const applyModal = () => {
    setCompanyFilter(modalFilters.company);
    setMinSalaryFilter(modalFilters.minSalary);
    setMaxSalaryFilter(modalFilters.maxSalary);
    setUrgentOnly(Boolean(modalFilters.urgent));
    setFeaturedOnly(Boolean(modalFilters.featured));
    setRemoteOnly(Boolean(modalFilters.remote));
    setPostedWithin(modalFilters.postedWithin || "any");
    setIsModalOpen(false);
  };

  // reset modal fields only
  const resetModal = () => {
    setModalFilters({
      company: "all",
      minSalary: "",
      maxSalary: "",
      urgent: false,
      featured: false,
      remote: false,
      postedWithin: "any",
    });
  };

  // toggle category by clicking badge
  const toggleCategoryBadge = (cat) => {
    if (categoryFilter === cat) setCategoryFilter("all");
    else setCategoryFilter(cat);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Browse Jobs</h1>
          <p className="text-muted-foreground">Find your next career opportunity</p>
        </div>

        <div className="flex items-center gap-4">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium">{filteredJobs.length}</span> of <span className="font-medium">{jobs.length}</span> jobs
          </p>
          <Button variant="ghost" size="sm" onClick={clearFilters}>Clear</Button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-card rounded-lg p-4 mb-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative md:col-span-2">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title, company, category or keywords"
              className="pl-10"
            />
          </div>

          <div>
            <Select value={jobType} onValueChange={(val) => setJobType(val)}>
              <SelectTrigger>
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                {jobTypes.map((jt) => <SelectItem key={jt} value={jt}>{jt === "all" ? "All Types" : jt}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select value={location} onValueChange={(val) => setLocation(val)}>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((loc) => <SelectItem key={loc} value={loc}>{loc === "all" ? "All Locations" : loc}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center mt-4 gap-3 flex-wrap">
          <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={openModal}>
            <FilterIcon className="h-4 w-4" />
            More Filters
          </Button>

          <Separator orientation="vertical" className="mx-2 h-6" />

          {/* category badges (clickable) */}
          <div className="flex gap-2 flex-wrap">
            {categories.map((c) => {
              if (c === "all") return null;
              const isActive = categoryFilter === c;
              return (
                <Badge
                  key={c}
                  variant={isActive ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleCategoryBadge(c)}
                >
                  {c}
                </Badge>
              );
            })}
          </div>

          {/* experience select */}
          <div className="ml-auto md:ml-4 ">
            <Select value={experienceFilter} onValueChange={(val) => setExperienceFilter(val)} >
              <SelectTrigger >
                <SelectValue placeholder="Experience" />
              </SelectTrigger>
              <SelectContent >
                {experiences.map((e) => <SelectItem key={e} value={e}>{e === "all" ? "All" : e}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Quick inline filters preview */}
        <div className="mt-3 text-sm text-muted-foreground">Active filters:
          <span className="ml-2">
            {jobType !== "all" && <Badge variant="outline" className="mr-2">{jobType}</Badge>}
            {location !== "all" && <Badge variant="outline" className="mr-2">{location}</Badge>}
            {categoryFilter !== "all" && <Badge variant="outline" className="mr-2">{categoryFilter}</Badge>}
            {companyFilter !== "all" && <Badge variant="outline" className="mr-2">{companyFilter}</Badge>}
            {urgentOnly && <Badge variant="destructive" className="mr-2">Urgent</Badge>}
            {featuredOnly && <Badge variant="outline" className="mr-2">Featured</Badge>}
            {remoteOnly && <Badge variant="outline" className="mr-2">Remote</Badge>}
          </span>
        </div>
      </div>

      {/* Modal (More Filters) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsModalOpen(false)} />
          <div className="relative z-10 w-full max-w-2xl bg-card rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">More Filters</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-sm block mb-1">Company</label>
                <Select value={modalFilters.company} onValueChange={(val) => setModalFilters((m) => ({ ...m, company: val }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select company" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((c) => <SelectItem key={c} value={c}>{c === "all" ? "All Companies" : c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm block mb-1">Posted within</label>
                <Select value={modalFilters.postedWithin} onValueChange={(val) => setModalFilters((m) => ({ ...m, postedWithin: val }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any time</SelectItem>
                    <SelectItem value="1">Last 1 day</SelectItem>
                    <SelectItem value="7">Last 7 days</SelectItem>
                    <SelectItem value="30">Last 30 days</SelectItem>
                    <SelectItem value="90">Last 90 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm block mb-1">Min salary</label>
                <Input
                  value={modalFilters.minSalary}
                  onChange={(e) => setModalFilters((m) => ({ ...m, minSalary: e.target.value }))}
                  placeholder="e.g. 500000"
                />
              </div>

              <div>
                <label className="text-sm block mb-1">Max salary</label>
                <Input
                  value={modalFilters.maxSalary}
                  onChange={(e) => setModalFilters((m) => ({ ...m, maxSalary: e.target.value }))}
                  placeholder="e.g. 1000000"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  id="urgent"
                  type="checkbox"
                  checked={modalFilters.urgent}
                  onChange={(e) => setModalFilters((m) => ({ ...m, urgent: e.target.checked }))}
                />
                <label htmlFor="urgent" className="text-sm">Urgent only</label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  id="featured"
                  type="checkbox"
                  checked={modalFilters.featured}
                  onChange={(e) => setModalFilters((m) => ({ ...m, featured: e.target.checked }))}
                />
                <label htmlFor="featured" className="text-sm">Featured only</label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  id="remote"
                  type="checkbox"
                  checked={modalFilters.remote}
                  onChange={(e) => setModalFilters((m) => ({ ...m, remote: e.target.checked }))}
                />
                <label htmlFor="remote" className="text-sm">Remote only</label>
              </div>

              <div className="flex items-center md:justify-end gap-3">
                <Button variant="outline" size="sm" onClick={resetModal}>Reset</Button>
                <Button size="sm" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button size="sm" onClick={applyModal}>Apply</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Job Listings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.length === 0 ? (
          <div className="col-span-full text-center text-muted-foreground">
            No jobs match your search & filters.
          </div>
        ) : (
          filteredJobs.map((job) => {
            const id = job.id ?? job._id ?? Math.random().toString(36).slice(2, 9);
            const title = job.title ?? job.job_title ?? "Untitled";
            const company = job.company_name ?? job.company ?? job.employer ?? "Unknown Company";
            const logo = job.logo ?? job.company_logo ?? "";
            const locationVal = job.location ?? job.city ?? "Remote";
            const typeVal = job.job_type ?? job.type ?? "N/A";
            const categoryVal = job.category ?? "General";

            const salaryText = job.salary_text
              || (job.salary_min || job.salary_max ? `${job.salary_min ?? ""}${job.salary_min && job.salary_max ? " - " : ""}${job.salary_max ?? ""}` : null)
              || job.salary
              || "Not specified";

            const postedDate = job.posted_at ?? job.postedDate ?? job.created_at ?? job.createdAt ?? null;

            return (
              <Card key={id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                      {logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={logo} alt={company} className="h-full w-full object-cover" />
                      ) : (
                        <div className="text-sm text-muted-foreground">{company.charAt(0)}</div>
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{title}</CardTitle>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <BuildingIcon className="h-3 w-3 mr-1" />
                        {company}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="py-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <MapPinIcon className="h-4 w-4 mr-2" />
                      {locationVal}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <BanknoteIcon className="h-4 w-4 mr-2" />
                      {salaryText}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      Posted {formatDate(postedDate)}
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2 items-center">
                    <Badge variant={typeVal.toLowerCase().includes("full") ? "default" : "outline"}>
                      {typeVal}
                    </Badge>
                    <Badge variant="secondary">{categoryVal}</Badge>
                    {job.is_urgent && <Badge variant="destructive">Urgent</Badge>}
                    {job.is_featured && <Badge variant="outline">Featured</Badge>}
                    {(job.is_remote === true || String(job.is_remote) === "true" || (locationVal ?? "").toLowerCase().includes("remote")) && (
                      <Badge variant="outline">Remote</Badge>
                    )}
                  </div>
                </CardContent>

                <CardFooter>
                  <Link href={`/jobs/${id}`} className="w-full">
                    <Button variant="outline" className="w-full">View Details</Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
