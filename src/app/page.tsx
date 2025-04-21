'use client'

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {useEffect, useState} from "react";
import {improveAppraisalText} from "@/ai/flows/improve-appraisal-text";
import {Toaster} from "@/components/ui/toaster";
import {useToast} from "@/hooks/use-toast";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useAuth} from "@/hooks/useAuth";
import {useRouter} from "next/navigation";

// Mock user data for demonstration
const mockUsers = [
  {id: '1', name: 'Alice Smith'},
  {id: '2', name: 'Bob Johnson'},
  {id: '3', name: 'Charlie Brown'},
];

export default function Home() {
  const [appraisals, setAppraisals] = useState<any[]>([]);
  const [newAppraisal, setNewAppraisal] = useState('');
  const [improvedAppraisal, setImprovedAppraisal] = useState<string>('');
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(mockUsers[0].id); // Default to the first user
  const {toast} = useToast();
  const { user, signOut } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push('/sign-in');
        }
    }, [user, router]);

    if (!user) {
        return null; // Or a loading indicator
    }


  const handleImproveAppraisal = async () => {
    if (!newAppraisal) {
      toast({
        title: "Error",
        description: "Please enter an appraisal text to improve.",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await improveAppraisalText({appraisalText: newAppraisal});
      setImprovedAppraisal(result.improvedAppraisalText);
      toast({
        title: "AI Improvement",
        description: "AI has suggested improvements for your appraisal.",
      });
    } catch (error: any) {
      console.error("Error improving appraisal:", error);
      toast({
        title: "Error",
        description: "Failed to improve appraisal text. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSubmitAppraisal = () => {
    if (!newAppraisal) {
      toast({
        title: "Error",
        description: "Please enter an appraisal text to submit.",
        variant: "destructive",
      });
      return;
    }

    const selectedUser = mockUsers.find(user => user.id === selectedUserId);

    setAppraisals([{
      id: Date.now(),
      text: newAppraisal,
      author: 'You',
      date: new Date().toLocaleDateString(),
      targetUser: selectedUser?.name || 'Unknown User',
    }, ...appraisals]);
    setNewAppraisal('');
    setImprovedAppraisal(''); // Clear improved appraisal after submission
    toast({
      title: "Success",
      description: "Appraisal submitted successfully!",
    });
  };

  return (
    
      <div className="flex flex-col items-center justify-start min-h-screen bg-secondary p-4">
        <Toaster/>
        <h1 className="text-3xl font-bold text-primary mb-4">PraiseWave</h1>

          <p>Welcome, {user.email}!</p>
          <Button onClick={() => signOut()}>Sign Out</Button>

        {/* Appraisal Submission Card */}
        <Card className="w-full max-w-2xl mb-6">
          <CardHeader>
            <CardTitle>Submit an Appraisal</CardTitle>
            <CardDescription>Write a positive appraisal for someone.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">

            {/* User Selection */}
            <div className="mb-4">
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a user"/>
                </SelectTrigger>
                <SelectContent>
                  {mockUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Textarea
              value={newAppraisal}
              onChange={(e) => setNewAppraisal(e.target.value)}
              placeholder="Enter your appraisal here..."
              className="mb-2"
            />
            <div className="flex justify-between">
              <Button variant="accent" onClick={handleImproveAppraisal}>
                Improve with AI
              </Button>
              <Button onClick={handleSubmitAppraisal}>Submit Appraisal</Button>
            </div>
            {improvedAppraisal && (
              <div className="mt-4 p-3 rounded-md bg-muted">
                <p className="text-sm italic">
                  Improved Appraisal: {improvedAppraisal}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Appraisal Display Card */}
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Received Appraisals</CardTitle>
            <CardDescription>View your recent appraisals.</CardDescription>
          </CardHeader>
          <CardContent>
            {appraisals.length > 0 ? (
              <div className="space-y-4">
                {appraisals.map((appraisal) => (
                  <div key={appraisal.id} className="flex items-start space-x-4 p-4 rounded-md shadow-sm bg-background">
                    <Avatar>
                      <AvatarImage src="https://picsum.photos/50/50" alt="Author Avatar"/>
                      <AvatarFallback>AA</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{appraisal.author} to {appraisal.targetUser}</p>
                      <p className="text-xs text-muted-foreground">{appraisal.date}</p>
                      <p className="text-sm mt-1">{appraisal.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No appraisals received yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    
  );
}
