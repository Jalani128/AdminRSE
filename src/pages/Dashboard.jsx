import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/Client";
import { Users, BookOpen, FileText, Clock, PlusCircle, Pencil } from "lucide-react";
import StatCard from "../components/ui/StatCard";
import PageHeader from "../components/ui/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { data: team = [] } = useQuery({ queryKey: ["team"], queryFn: () => base44.entities.TeamMember.list("-created_date", 100) });
  const { data: blogs = [] } = useQuery({ queryKey: ["blogs"], queryFn: () => base44.entities.Blog.list("-created_date", 100) });

  const publishedBlogs = blogs.filter(b => b.status === "published").length;
  const draftBlogs = blogs.filter(b => b.status === "draft").length;
  const recentBlogs = blogs.slice(0, 5);

  return (
    <div className="max-w-7xl space-y-8">
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back! Here's your real estate admin overview."
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Team Members" value={team.length} icon={Users} color="navy" description="Active agents & staff" />
        <StatCard title="Total Blogs" value={blogs.length} icon={BookOpen} color="gold" description="All time posts" />
        <StatCard title="Published" value={publishedBlogs} icon={FileText} color="green" description="Live articles" />
        <StatCard title="Drafts" value={draftBlogs} icon={Clock} color="purple" description="Pending review" />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-border p-6">
        <h2 className="text-base font-semibold text-navy-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link to="/team?new=1">
            <Button className="bg-navy-900 hover:bg-navy-800 text-white gap-2">
              <PlusCircle className="h-4 w-4" /> Add Team Member
            </Button>
          </Link>
          <Link to="/blogs?new=1">
            <Button variant="outline" className="border-gold-400 text-gold-600 hover:bg-gold-50 gap-2">
              <Pencil className="h-4 w-4" /> New Blog Post
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Blogs */}
        <div className="bg-white rounded-xl border border-border">
          <div className="px-6 py-5 border-b border-border flex items-center justify-between">
            <h2 className="text-base font-semibold text-navy-900">Recent Blogs</h2>
            <Link to="/blogs" className="text-xs text-gold-600 hover:text-gold-700 font-medium">View all →</Link>
          </div>
          <div className="divide-y divide-border">
            {recentBlogs.length === 0 && (
              <div className="px-6 py-8 text-center text-sm text-muted-foreground">No blogs yet.</div>
            )}
            {recentBlogs.map(blog => (
              <div key={blog.id} className="px-6 py-3.5 flex items-center justify-between hover:bg-muted/30 transition-colors">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-navy-900 truncate">{blog.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{blog.created_date ? format(new Date(blog.created_date), "MMM d, yyyy") : "—"}</p>
                </div>
                <Badge className={blog.status === "published" ? "bg-emerald-50 text-emerald-700 border-emerald-200 ml-3" : "bg-amber-50 text-amber-700 border-amber-200 ml-3"} variant="outline">
                  {blog.status || "draft"}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Team */}
        <div className="bg-white rounded-xl border border-border">
          <div className="px-6 py-5 border-b border-border flex items-center justify-between">
            <h2 className="text-base font-semibold text-navy-900">Team Members</h2>
            <Link to="/team" className="text-xs text-gold-600 hover:text-gold-700 font-medium">Manage →</Link>
          </div>
          <div className="divide-y divide-border">
            {team.length === 0 && (
              <div className="px-6 py-8 text-center text-sm text-muted-foreground">No team members yet.</div>
            )}
            {team.slice(0, 5).map(member => (
              <div key={member.id} className="px-6 py-3.5 flex items-center gap-3 hover:bg-muted/30 transition-colors">
                {member.profile_image ? (
                  <img src={member.profile_image} alt={member.name} className="h-9 w-9 rounded-full object-cover border border-border shrink-0" />
                ) : (
                  <div className="h-9 w-9 rounded-full bg-navy-900 text-gold-400 flex items-center justify-center text-xs font-bold shrink-0">
                    {member.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-navy-900 truncate">{member.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}