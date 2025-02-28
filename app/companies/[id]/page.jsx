import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MapPinIcon, 
  GlobeIcon, 
  UsersIcon, 
  CalendarIcon, 
  BuildingIcon,
  BriefcaseIcon,
  ArrowLeftIcon
} from "lucide-react";

// Mock data for companies
const companies = [
  {
    id: 1,
    name: "TechCorp",
    logo: "https://images.unsplash.com/photo-1549923746-c502d488b3ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80",
    coverImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    location: "San Francisco, CA",
    industry: "Technology",
    size: "500-1000 employees",
    founded: "2010",
    website: "https://example.com",
    description: `
      <p>TechCorp is a leading technology company specializing in innovative software solutions for businesses of all sizes. We are dedicated to creating cutting-edge products that help our clients succeed in the digital age.</p>
      
      <p>Our team of talented engineers, designers, and product managers work together to build tools that solve real-world problems. We believe in a collaborative approach to software development, where ideas are shared freely and the best solutions rise to the top.</p>
      
      <h3>Our Mission</h3>
      <p>To empower businesses with technology that drives growth and innovation.</p>
      
      <h3>Our Values</h3>
      <ul>
        <li>Innovation: We constantly push the boundaries of what's possible</li>
        <li>Quality: We take pride in our craftsmanship</li>
        <li>Collaboration: We believe the best work happens together</li>
        <li>Customer Focus: We put our customers at the center of everything we do</li>
        <li>Integrity: We operate with honesty and transparency</li>
      </ul>
    `,
    benefits: [
      "Competitive salary and equity",
      "Health, dental, and vision insurance",
      "401(k) matching",
      "Flexible work hours",
      "Remote work options",
      "Professional development budget",
      "Generous vacation policy",
      "Parental leave",
      "Wellness programs",
      "Company events and retreats"
    ],
    jobs: [
      {
        id: 1,
        title: "Frontend Developer",
        location: "San Francisco, CA",
        type: "Full-time",
        postedDate: "2023-05-15",
      },
      {
        id: 2,
        title: "Backend Developer",
        location: "San Francisco, CA",
        type: "Full-time",
        postedDate: "2023-05-24",
      },
      {
        id: 3,
        title: "Product Manager",
        location: "Remote",
        type: "Full-time",
        postedDate: "2023-05-10",
      },
    ]
  }
]