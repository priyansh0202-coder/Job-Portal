"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BriefcaseIcon, LockIcon, MailIcon, UserIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

import { login, register } from "@/services/authService";

export default function AdminLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const {setUser} = useAuth();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    isAdmin: false,
    adminCode: "",
  });

  // Handle input changes
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRegisterData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!loginData.email || !loginData.password) {
        toast({
          variant: "destructive",
          title: "Missing fields",
          description: "Please enter both email and password.",
        });
        setIsLoading(false);
        return;
      }

      const data = await login({
        email: loginData.email,
        password: loginData.password,
      });
      // <---- ADD THIS: update AuthContext immediately so Navbar updates without refresh
      if (typeof setUser === "function" && data?.user) {
        setUser(data.user);
      }


      toast({
        title: "Login successful",
        description: `Welcome back${data.user?.name ? `, ${data.user.name}` : ""}!`,
      });

      if (data.user?.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/");
      }
    } catch (err) {
      const msg =
        err?.response?.data?.error || err?.message || "Unable to login";
      toast({
        variant: "destructive",
        title: "Login failed",
        description: msg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Register handler
  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { email, password, isAdmin, adminCode } = registerData;

      if (!email || !password || !registerData.name) {
        toast({
          variant: "destructive",
          title: "Missing fields",
          position: "top",
          description: "Please enter both email, password, and name.",
        });
        setIsLoading(false);
        return;
      }

      if (isAdmin && !adminCode) {
        toast({
          variant: "warning",
          title: "Admin code required",
          position: "top",
          description: "Please enter the admin invite code to register as admin.",
        });
        setIsLoading(false);
        return;
      }

      const payload = { name: registerData.name, email, password };
      if (isAdmin) {
        payload.role = "admin";
        payload.adminCode = adminCode;
      }

      const data = await register(payload);
      if (typeof setUser === "function" && data?.user) {
        setUser(data.user);
      }

      toast({
        title: "Registration successful",
        position: "top",
        variant: "success",
        description: `Registered as ${data.user?.role || "user"}.`,
      });

      setRegisterData({
        name: "",
        email: "",
        password: "",
        isAdmin: false,
        adminCode: "",
      });

      if (data.user?.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/");
      }
    } catch (err) {
      const msg =
        err?.response?.data?.error || err?.message || "Unable to register";
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: msg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 flex justify-center">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="bg-primary/10 p-3 rounded-full">
            <BriefcaseIcon className="h-8 w-8 text-primary" />
          </div>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          {/* LOGIN TAB */}
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle> Login</CardTitle>
                <CardDescription>
                  Sign in to your employer account to manage job postings
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="name@example.com"
                        className="pl-10"
                        value={loginData.email}
                        onChange={handleLoginChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link
                        href="/admin/forgot-password"
                        className="text-xs text-primary hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        className="pl-10"
                        value={loginData.password}
                        onChange={handleLoginChange}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          {/* REGISTER TAB */}
          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle> Registration</CardTitle>
                <CardDescription>
                  Create an account to post job opportunities
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleRegister}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="registerEmail">Name</Label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="registerName"
                        name="name"
                        type="text"
                        placeholder="Enter your name"
                        className="pl-10"
                        value={registerData.name}
                        onChange={handleRegisterChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="registerEmail">Email</Label>
                    <div className="relative">
                      <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="registerEmail"
                        name="email"
                        type="email"
                        placeholder="name@example.com"
                        className="pl-10"
                        value={registerData.email}
                        onChange={handleRegisterChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="registerPassword">Password</Label>
                    <div className="relative">
                      <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="registerPassword"
                        name="password"
                        type="password"
                        className="pl-10"
                        value={registerData.password}
                        onChange={handleRegisterChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Admin toggle */}
                  <div className="flex items-center gap-2">
                    <input
                      id="isAdmin"
                      name="isAdmin"
                      type="checkbox"
                      checked={registerData.isAdmin}
                      onChange={handleRegisterChange}
                      className="h-4 w-4"
                    />
                    <label htmlFor="isAdmin" className="text-sm">
                      Register as admin
                    </label>
                  </div>

                  {/* Admin code input */}
                  {registerData.isAdmin && (
                    <div className="space-y-2">
                      <Label htmlFor="adminCode">Admin Invite Code</Label>
                      <Input
                        id="adminCode"
                        name="adminCode"
                        placeholder="Enter admin invite code"
                        value={registerData.adminCode}
                        onChange={handleRegisterChange}
                      />
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>

        <p className="text-center text-sm text-muted-foreground mt-6">
          By continuing, you agree to our{" "}
          <Link href="/terms" className="text-primary hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
