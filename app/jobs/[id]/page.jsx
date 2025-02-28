import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  BuildingIcon,
  MapPinIcon,
  BriefcaseIcon,
  CalendarIcon,
  ClockIcon,
  BanknoteIcon,
  GlobeIcon,
  ArrowLeftIcon,
  ShareIcon,
  BookmarkIcon
} from "lucide-react";

// Mock data for job details
const jobs = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "TechCorp",
    location: "San Francisco, CA",
    type: "Full-time",
    category: "Engineering",
    experience: "3-5 years",
    salary: "$80,000 - $120,000",
    postedDate: "2023-05-15",
    applicationDeadline: "2023-06-15",
    applicationLink: "https://example.com/apply",
    logo: "https://images.unsplash.com/photo-1549923746-c502d488b3ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80",
    companyWebsite: "https://example.com",
    description: `
      <p>We are looking for a skilled Frontend Developer to join our team. You will be responsible for building user interfaces and implementing interactive features for our web applications.</p>
      
      <h3>Responsibilities:</h3>
      <ul>
        <li>Develop new user-facing features using React.js</li>
        <li>Build reusable components and libraries for future use</li>
        <li>Translate designs and wireframes into high-quality code</li>
        <li>Optimize components for maximum performance</li>
        <li>Collaborate with backend developers and designers</li>
      </ul>
      
      <h3>Requirements:</h3>
      <ul>
        <li>3-5 years of experience in frontend development</li>
        <li>Proficiency in JavaScript, HTML, CSS</li>
        <li>Experience with React.js and its ecosystem</li>
        <li>Familiarity with RESTful APIs</li>
        <li>Understanding of responsive design principles</li>
        <li>Knowledge of modern frontend build pipelines and tools</li>
      </ul>
      
      <h3>Benefits:</h3>
      <ul>
        <li>Competitive salary</li>
        <li>Health, dental, and vision insurance</li>
        <li>401(k) matching</li>
        <li>Flexible work hours</li>
        <li>Remote work options</li>
        <li>Professional development budget</li>
      </ul>
    `,
  },
  {
    id: 2,
    title: "Data Scientist",
    company: "DataWorks",
    location: "Remote",
    type: "Full-time",
    category: "Data Science",
    experience: "2-4 years",
    salary: "$90,000 - $140,000",
    postedDate: "2023-05-18",
    applicationDeadline: "2023-06-18",
    applicationLink: "https://example.com/apply",
    logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
    companyWebsite: "https://example.com",
    description: `
      <p>We are seeking a talented Data Scientist to help us discover insights from data and build machine learning models to solve business problems.</p>
      
      <h3>Responsibilities:</h3>
      <ul>
        <li>Analyze large datasets to extract actionable insights</li>
        <li>Build and deploy machine learning models</li>
        <li>Collaborate with cross-functional teams</li>
        <li>Present findings to stakeholders</li>
        <li>Stay up-to-date with the latest research and technologies</li>
      </ul>
      
      <h3>Requirements:</h3>
      <ul>
        <li>2-4 years of experience in data science or related field</li>
        <li>Strong programming skills in Python</li>
        <li>Experience with data analysis libraries (Pandas, NumPy)</li>
        <li>Knowledge of machine learning frameworks (Scikit-learn, TensorFlow)</li>
        <li>Familiarity with SQL and database systems</li>
        <li>Strong communication skills</li>
      </ul>
      
      <h3>Benefits:</h3>
      <ul>
        <li>Competitive salary</li>
        <li>Health, dental, and vision insurance</li>
        <li>401(k) matching</li>
        <li>Flexible work hours</li>
        <li>Remote work</li>
        <li>Professional development opportunities</li>
      </ul>
    `,
  },
  {
    id: 3,
    title: "UX Designer",
    company: "CreativeMinds",
    location: "New York, NY",
    type: "Contract",
    category: "Design",
    experience: "2-4 years",
    salary: "$90,000 - $140,000",
    postedDate: "2023-05-18",
    applicationDeadline: "2023-06-18",
    applicationLink: "https://example.com/apply",
    logo: "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    companyWebsite: "https://example.com",
    description: `
        <p>we are looking for a UX Designer to join our team. You will be responsible for designing user interfaces and implementing interactive features for our web applications.</p>
        
        <h3>Responsibilities:</h3>
        <ul>
          <li>Design user interfaces and interactive features</li>
          <li>Collaborate with cross-functional teams</li>
          <li>Present findings to stakeholders</li>
          <li>Stay up-to-date with the latest research and technologies</li>
        </ul>
        
        <h3>Requirements:</h3>
        <ul>
          <li>2-4 years of experience in data science or related field</li>
          <li>Strong programming skills in Figma</li>
          <li>Experience with user research and testing</li>
          <li>Understanding of responsive design principles</li>
          <li>Knowledge of modern frontend build pipelines and tools</li>
          <li>Strong communication skills</li>
        </ul>
        
        <h3>Benefits:</h3>
        <ul>
          <li>Competitive salary</li>
          <li>Health, dental, and vision insurance</li>
          <li>401(k) matching</li>
          <li>Flexible work hours</li>
          <li>Remote work</li>
          <li>Professional development opportunities</li>
        </ul>
      `,
  },
  {
    id: 4,
    title: "DevOps Engineer",
    company: "CloudSystems",
    location: "Remote",
    type: "Full-time",
    category: "Engineering",
    experience: "3-5 years",
    salary: "$90,000 - $140,000",
    postedDate: "2023-05-18",
    applicationDeadline: "2023-06-18",
    applicationLink: "https://example.com/apply",
    logo: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1172&q=80",
    companyWebsite: "https://example.com",
    description: `
        <p>we are looking for a UX Designer to join our team. You will be responsible for designing user interfaces and implementing interactive features for our web applications.</p>
        
        <h3>Responsibilities:</h3>
        <ul>
          <li>Implement and maintain CI/CD pipelines</li>
          <li>Collaborate with cross-functional teams</li>
          <li>Automate infrastructure provisioning</li>
          <li>Optimize deployment processes</li>
        </ul>
        
        <h3>Requirements:</h3>
        <ul>
          <li>2-4 years of experience in data science or related field</li>
          <li>Strong programming skills in Figma</li>
          <li>Experience with user research and testing</li>
          <li>Understanding of responsive design principles</li>
          <li>Knowledge of modern frontend build pipelines and tools</li>
          <li>Strong communication skills</li>
        </ul>
        
        <h3>Benefits:</h3>
        <ul>
          <li>Competitive salary</li>
          <li>Health, dental, and vision insurance</li>
          <li>401(k) matching</li>
          <li>Flexible work hours</li>
          <li>Remote work</li>
          <li>Professional development opportunities</li>
        </ul>
      `,
  },
  {
    id: 5,
    title: "Product Manager",
    company: "InnovateTech",
    location: "Chicago, IL",
    type: "Full-time",
    category: "Product",
    experience: "4-6 years",
    salary: "$90,000 - $140,000",
    postedDate: "2023-05-18",
    applicationDeadline: "2023-06-18",
    applicationLink: "https://example.com/apply",
    logo: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1172&q=80",
    companyWebsite: "https://example.com",
    description: `
        <p>we are looking for a UX Designer to join our team. You will be responsible for designing user interfaces and implementing interactive features for our web applications.</p>
        
        <h3>Responsibilities:</h3>
        <ul>
          <li>Define product vision, strategy and roadmap</li>
          <li>Gather and analyze customer feedback and market research</li>
          <li>Work closely with engineering, design and other teams</li>
          <li>Prioritize features and manage product backlog</li>
          <li>Drive product launches and go-to-market strategy</li>
          <li>Track and report on key product metrics</li>
        </ul>
        
        <h3>Requirements:</h3>
        <ul>
          <li>4-6 years of experience in product management</li>
          <li>Track record of successful product launches</li>
          <li>Experience with agile methodologies and product development lifecycle</li>
          <li>Strong analytical and data-driven decision making skills</li>
          <li>Excellent stakeholder management and leadership abilities</li>
          <li>Bachelor's degree in Business, Computer Science, or related field</li>
        </ul>
        
        <h3>Benefits:</h3>
        <ul>
          <li>Competitive salary</li>
          <li>Health, dental, and vision insurance</li>
          <li>401(k) matching</li>
          <li>Flexible work hours</li>
          <li>Remote work</li>
          <li>Professional development opportunities</li>
        </ul>
      `,
  },
  {
    id: 6,
    title: "Backend Developer",
    company: "ServerStack",
    location: "Seattle, WA", 
    type: "Full-time",
    category: "Engineering",
    experience: "3-5 years",
    salary: "$90,000 - $130,000",
    postedDate: "2023-05-24",
    applicationDeadline: "2023-06-24",
    applicationLink: "https://serverstack.com/careers",
    logo: "https://images.unsplash.com/photo-1549923746-c502d488b3ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80",
    companyWebsite: "https://serverstack.com",
    description: `
        <p>ServerStack is seeking an experienced Backend Developer to join our engineering team. You will be responsible for designing, building and maintaining server-side applications and APIs that power our cloud infrastructure platform.</p>
        
        <h3>Responsibilities:</h3>
        <ul>
          <li>Design and implement scalable backend services and REST APIs</li>
          <li>Write clean, maintainable and well-tested code</li>
          <li>Optimize application performance and improve system efficiency</li>
          <li>Integrate with databases and third-party services</li>
          <li>Participate in code reviews and technical discussions</li>
          <li>Troubleshoot production issues and implement fixes</li>
        </ul>
        
        <h3>Requirements:</h3>
        <ul>
          <li>3-5 years of backend development experience</li>
          <li>Strong proficiency in Python, Node.js, or Java</li>
          <li>Experience with SQL and NoSQL databases</li>
          <li>Knowledge of cloud platforms (AWS, GCP, Azure)</li>
          <li>Understanding of microservices architecture</li>
          <li>Bachelor's degree in Computer Science or related field</li>
        </ul>
        
        <h3>Benefits:</h3>
        <ul>
          <li>Competitive salary with equity options</li>
          <li>Comprehensive health insurance</li>
          <li>401(k) with company match</li>
          <li>Flexible work arrangements</li>
          <li>Learning and development budget</li>
          <li>Regular team events and activities</li>
        </ul>
      `,
  },
];

// Format date to readable format
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Add this function before the JobDetailPage component
export async function generateStaticParams() {
  return jobs.map((job) => ({
    id: job.id.toString(),
  }));
}

export default async function JobDetailPage({ params }) {
  const jobId = parseInt(params.id);
  const job = jobs.find(j => j.id === jobId);

  if (!job) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Job Not Found</h1>
        <p className="text-muted-foreground mb-8">The job you're looking for doesn't exist or has been removed.</p>
        <Link href="/jobs">
          <Button>Browse All Jobs</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/jobs" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Jobs
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Job Header */}
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="h-16 w-16 rounded-md overflow-hidden">
                  <img
                    src={job.logo}
                    alt={job.company}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold mb-1">{job.title}</h1>
                  <div className="flex items-center text-muted-foreground mb-4">
                    <BuildingIcon className="h-4 w-4 mr-1" />
                    <span className="mr-3">{job.company}</span>
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={job.type === "Full-time" ? "default" : "outline"}>
                      {job.type}
                    </Badge>
                    <Badge variant="secondary">{job.category}</Badge>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="ghost" size="icon">
                  <ShareIcon className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <BookmarkIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Job Description */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Job Description</h2>
              <div
                className="prose max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: job.description }}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Apply Button */}
          <Card>
            <CardContent className="p-6">
              <Button className="w-full mb-4" size="lg">
                Apply Now
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                Application deadline: {formatDate(job.applicationDeadline)}
              </p>
            </CardContent>
          </Card>

          {/* Job Details */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Job Details</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <BriefcaseIcon className="h-5 w-5 mr-3 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Job Type</p>
                    <p className="font-medium">{job.type}</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start">
                  <CalendarIcon className="h-5 w-5 mr-3 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Posted On</p>
                    <p className="font-medium">{formatDate(job.postedDate)}</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start">
                  <ClockIcon className="h-5 w-5 mr-3 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Experience</p>
                    <p className="font-medium">{job.experience}</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start">
                  <BanknoteIcon className="h-5 w-5 mr-3 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Salary</p>
                    <p className="font-medium">{job.salary}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Company Info */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">About the Company</h3>
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-md overflow-hidden mr-3">
                  <img
                    src={job.logo}
                    alt={job.company}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium">{job.company}</p>
                  <p className="text-sm text-muted-foreground">{job.location}</p>
                </div>
              </div>
              <div className="flex items-center text-sm mb-4">
                <GlobeIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                <a
                  href={job.companyWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Visit Website
                </a>
              </div>
              <Button variant="outline" className="w-full">
                View Company Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}