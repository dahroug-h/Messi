import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import JoinForm from "@/components/join-form";
import { useState } from "react";
import { type Project, type TeamMember } from "@shared/schema";
import { Users2, MessageCircle, ArrowLeft, RefreshCw, MoreVertical } from "lucide-react";
import { SiLinkedin } from "react-icons/si";

export default function ProjectPage() {
  const [_, params] = useRoute("/project/:id");
  const projectId = parseInt(params?.id || "0");
  const [showJoinForm, setShowJoinForm] = useState(false);

  const { data: project } = useQuery<Project>({
    queryKey: [`/api/projects/${projectId}`],
  });

  const { data: members = [] } = useQuery<TeamMember[]>({
    queryKey: [`/api/projects/${projectId}/members`],
    enabled: !!projectId,
  });

  if (!project) return <div>Project not found</div>;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button 
                variant="outline" 
                size="lg"
                className="hover:bg-primary/10 transition-colors"
              >
                <ArrowLeft className="h-6 w-6" />
              </Button>
            </Link>
            <span className="text-xl font-semibold">By EECE 27</span>
          </div>
          <Button
            variant="outline"
            size="lg"
            onClick={() => window.location.reload()}
            className="hover:bg-primary/10 transition-colors"
          >
            <RefreshCw className="h-6 w-6" />
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            {project.name}
          </h1>
          <Button onClick={() => setShowJoinForm(true)}>
            <Users2 className="mr-2 h-5 w-5" />
            Join Team
          </Button>
        </div>

        <div className="grid gap-4">
          {members.map((member) => (
            <Card key={member.id} className="w-full">
              <CardContent className="flex items-center justify-between p-6">
                <div className="flex items-center space-x-4">
                  {member.photoUrl ? (
                    <img 
                      src={member.photoUrl} 
                      alt={member.name} 
                      className="h-16 w-16 rounded-full object-cover bg-primary/10"
                    />
                  ) : (
                    <div className="bg-primary/10 p-4 rounded-full">
                      <Users2 className="h-10 w-10 text-primary" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-semibold">{member.name}</h3>
                    {member.sectionNumber && (
                      <p className="text-sm text-muted-foreground">
                        Section {member.sectionNumber}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <a
                    href={`https://wa.me/${member.whatsappNumber.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-transform hover:scale-110"
                  >
                    <Button variant="outline" size="lg" className="rounded-full p-3">
                      <MessageCircle className="h-6 w-6 text-green-600" />
                    </Button>
                  </a>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => {
                          const response = fetch(`/api/members/${member.id}`, {
                            method: 'DELETE',
                            credentials: 'include'
                          });
                        }}
                      >
                        Remove me from team
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={showJoinForm} onOpenChange={setShowJoinForm}>
          <DialogContent>
            <JoinForm project={project} onClose={() => setShowJoinForm(false)} />
          </DialogContent>
        </Dialog>
      </main>

      <footer className="border-t py-4 text-center text-sm text-muted-foreground">
        <div className="container mx-auto px-4 flex items-center justify-center space-x-4">
          <p>© Hassan Dahroug March 2025</p>
          <a
            href="https://www.linkedin.com/in/hassan-dahroug-736ab7285/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80"
          >
            <SiLinkedin className="h-5 w-5" />
          </a>
        </div>
      </footer>
    </div>
  );
}