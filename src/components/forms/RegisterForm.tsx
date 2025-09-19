import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { useRegisterMutation } from "@/api/queries/auth";
import { registerSchema, type RegisterFormData } from "@/lib/validations";

export function RegisterForm({ className, ...props }: React.ComponentProps<"div">) {
 const navigate = useNavigate();
 const registerMutation = useRegisterMutation();

 const form = useForm<RegisterFormData>({
  resolver: zodResolver(registerSchema),
  defaultValues: {
   name: "",
   email: "",
   password: "",
   confirmPassword: "",
  },
 });

 const onSubmit = async (data: RegisterFormData) => {
  try {
   await registerMutation.mutateAsync(data);
   navigate("/login", {
    replace: true,
    state: { message: "Account created successfully! Please log in." },
   });
  } catch (error) {
   console.log("🚀 ~ onSubmit ~ error:", error);
   // Error is handled by the mutation
  }
 };

 return (
  <div className={cn("flex flex-col gap-6", className)} {...props}>
   <Card>
    <CardHeader className="text-center">
     <CardTitle className="text-xl">Create an account</CardTitle>
     <CardDescription>Sign up with your email</CardDescription>
    </CardHeader>
    <CardContent>
     <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid gap-6">
       {registerMutation.error && (
        <Alert variant="destructive">
         <AlertDescription>{registerMutation.error.message || "Failed to create account. Please try again."}</AlertDescription>
        </Alert>
       )}

       <div className="grid gap-6">
        <div className="grid gap-3">
         <Label htmlFor="name">Full Name</Label>
         <Input id="name" type="text" placeholder="John Doe" {...form.register("name")} disabled={registerMutation.isPending} required />
         {form.formState.errors.name && <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>}
        </div>

        <div className="grid gap-3">
         <Label htmlFor="email">Email</Label>
         <Input id="email" type="email" placeholder="m@example.com" {...form.register("email")} disabled={registerMutation.isPending} required />
         {form.formState.errors.email && <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>}
        </div>

        <div className="grid gap-3">
         <Label htmlFor="password">Password</Label>
         <Input id="password" type="password" placeholder="Create a strong password" {...form.register("password")} disabled={registerMutation.isPending} required />
         {form.formState.errors.password && <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>}
        </div>

        <div className="grid gap-3">
         <Label htmlFor="confirmPassword">Confirm Password</Label>
         <Input id="confirmPassword" type="password" placeholder="Confirm your password" {...form.register("confirmPassword")} disabled={registerMutation.isPending} required />
         {form.formState.errors.confirmPassword && <p className="text-sm text-destructive">{form.formState.errors.confirmPassword.message}</p>}
        </div>

        <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
         {registerMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
         Create account
        </Button>
       </div>

       <div className="text-center text-sm">
        Already have an account?{" "}
        <Link to="/login" className="underline underline-offset-4">
         Sign in
        </Link>
       </div>
      </div>
     </form>
    </CardContent>
   </Card>

   <div className="text-muted-foreground text-center text-xs text-balance">
    By clicking continue, you agree to our{" "}
    <Link to="/terms" className="underline underline-offset-4 hover:text-primary">
     Terms of Service
    </Link>{" "}
    and{" "}
    <Link to="/privacy" className="underline underline-offset-4 hover:text-primary">
     Privacy Policy
    </Link>
    .
   </div>
  </div>
 );
}
