import { Button } from "@/components/ui/button";

export default function Home() {
 return (
  <div className="space-y-6">
   <div className="bg-muted/50 mx-auto h-24 w-full max-w-3xl rounded-xl flex items-center justify-center">
    <h2 className="text-2xl font-semibold text-muted-foreground">Welcome to Dashboard</h2>
    <Button className="ml-4">Get Started</Button>
   </div>

   <div className="bg-muted/50 mx-auto min-h-[60vh] w-full max-w-3xl rounded-xl p-6">
    <div className="space-y-4">
     <h3 className="text-xl font-medium">Recent Projects</h3>
     <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
       <div key={i} className="bg-background p-4 rounded-lg border">
        <h4 className="font-medium">Project {i}</h4>
        <p className="text-sm text-muted-foreground mt-2">Project description goes here...</p>
       </div>
      ))}
     </div>
    </div>
   </div>
  </div>
 );
}
