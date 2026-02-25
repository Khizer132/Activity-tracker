import { Card, CardContent, CardHeader, CardTitle    } from "@/components/ui/card";
import { auth } from "@/lib/auth";


export default async  function  ProjectsPage() {
    await auth(); 
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-green-800">Projects</h1>
      <Card className="border-green-200 bg-white">
        <CardHeader>
          <CardTitle>Your projects</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
        </CardContent>
      </Card>
    </div>
  );
}