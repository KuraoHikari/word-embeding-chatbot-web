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
import { useLoginMutation } from "@/api/queries/auth";
import { loginSchema, type LoginFormData } from "@/lib/validations";

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
 const navigate = useNavigate();
 const loginMutation = useLoginMutation();

 const form = useForm<LoginFormData>({
  resolver: zodResolver(loginSchema),
  defaultValues: {
   email: "",
   password: "",
  },
 });

 const onSubmit = async (data: LoginFormData) => {
  try {
   await loginMutation.mutateAsync(data);
   navigate("/", { replace: true });
  } catch {
   // Error is handled by the mutation
  }
 };

 return (
  <div className={cn("flex flex-col gap-6", className)} {...props}>
   <Card>
    <CardHeader className="text-center">
     <CardTitle className="text-xl">Welcome back</CardTitle>
     <CardDescription>Login with your email and password</CardDescription>
    </CardHeader>
    <CardContent>
     <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid gap-6">
       {loginMutation.error && (
        <Alert variant="destructive">
         <AlertDescription>Invalid email or password. Please try again.</AlertDescription>
        </Alert>
       )}

       <div className="grid gap-6">
        <div className="grid gap-3">
         <Label htmlFor="email">Email</Label>
         <Input id="email" type="email" placeholder="m@example.com" {...form.register("email")} disabled={loginMutation.isPending} required />
         {form.formState.errors.email && <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>}
        </div>

        <div className="grid gap-3">
         <div className="flex items-center">
          <Label htmlFor="password">Password</Label>
         </div>
         <Input id="password" type="password" placeholder="Your password" {...form.register("password")} disabled={loginMutation.isPending} required />
         {form.formState.errors.password && <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>}
        </div>

        <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
         {loginMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
         Login
        </Button>
       </div>

       <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link to="/register" className="underline underline-offset-4">
         Sign up
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
