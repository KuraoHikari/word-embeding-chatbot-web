import { Button } from "@/components/ui/button";

export default function Dashboard() {
 return (
  <div className="space-y-6">
   <div className="bg-muted/50 mx-auto h-24 w-full max-w-3xl rounded-xl flex items-center justify-center">
    <h2 className="text-2xl font-semibold text-muted-foreground">Project Management & Task Tracking</h2>
    <Button className="ml-4">Create New Project</Button>
   </div>

   <div className="bg-muted/50 mx-auto min-h-[70vh] w-full max-w-3xl rounded-xl p-6">
    <div className="space-y-6">
     <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div className="bg-background p-4 rounded-lg border">
       <h4 className="font-medium">Total Tasks</h4>
       <p className="text-2xl font-bold text-primary mt-2">24</p>
      </div>
      <div className="bg-background p-4 rounded-lg border">
       <h4 className="font-medium">In Progress</h4>
       <p className="text-2xl font-bold text-orange-500 mt-2">8</p>
      </div>
      <div className="bg-background p-4 rounded-lg border">
       <h4 className="font-medium">Completed</h4>
       <p className="text-2xl font-bold text-green-500 mt-2">12</p>
      </div>
      <div className="bg-background p-4 rounded-lg border">
       <h4 className="font-medium">Overdue</h4>
       <p className="text-2xl font-bold text-red-500 mt-2">4</p>
      </div>
     </div>

     <div className="bg-background p-6 rounded-lg border">
      <h4 className="font-medium mb-4">Recent Tasks</h4>
      <div className="space-y-3">
       {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
         <div>
          <h5 className="font-medium">Task {i}</h5>
          <p className="text-sm text-muted-foreground">Description of task {i}</p>
         </div>
         <div className="text-right">
          <span className="text-sm font-medium text-primary">In Progress</span>
          <p className="text-xs text-muted-foreground">Due: Dec 25</p>
         </div>
        </div>
       ))}
      </div>
     </div>
    </div>
   </div>
  </div>
 );
}
