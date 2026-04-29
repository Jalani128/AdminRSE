import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search, Pencil, Trash2, Mail, Phone, Linkedin } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import TeamMemberForm from "../components/team/TeamMemberForm";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { toast } from "sonner";

export default function TeamPage() {
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const queryClient = useQueryClient();

  // Auto-open form if ?new=1
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("new") === "1") setFormOpen(true);
  }, []);

  const { data: team = [], isLoading } = useQuery({
    queryKey: ["team"],
    queryFn: () => base44.entities.TeamMember.list("-created_date", 200),
  });

  const filtered = team.filter(m =>
    m.name?.toLowerCase().includes(search.toLowerCase()) ||
    m.role?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async () => {
    await base44.entities.TeamMember.delete(deleting.id);
    toast.success("Team member removed");
    queryClient.invalidateQueries({ queryKey: ["team"] });
    setDeleting(null);
  };

  const openEdit = (member) => { setEditing(member); setFormOpen(true); };
  const closeForm = (open) => { if (!open) { setEditing(null); } setFormOpen(open); };

  return (
    <div className="max-w-7xl">
      <PageHeader
        title="Team Management"
        subtitle="Manage your real estate agents and staff."
        action={
          <Button onClick={() => setFormOpen(true)} className="bg-navy-900 hover:bg-navy-800 gap-2">
            <PlusCircle className="h-4 w-4" /> Add Member
          </Button>
        }
      />

      {/* Search */}
      <div className="relative max-w-sm mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search by name or role..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-xl border border-border p-6 animate-pulse">
              <div className="h-20 w-20 rounded-full bg-muted mx-auto mb-4" />
              <div className="h-4 w-24 bg-muted rounded mx-auto mb-2" />
              <div className="h-3 w-16 bg-muted rounded mx-auto" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="h-16 w-16 rounded-full bg-muted mx-auto flex items-center justify-center mb-4">
            <Search className="h-7 w-7 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground font-medium">{search ? "No members match your search." : "No team members yet."}</p>
          {!search && <Button onClick={() => setFormOpen(true)} className="mt-4 bg-navy-900 hover:bg-navy-800">Add First Member</Button>}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map(member => (
            <div key={member.id} className="bg-white rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300 group">
              <div className="bg-navy-900 h-2 w-full" />
              <div className="p-6">
                <div className="flex flex-col items-center text-center mb-4">
                  {member.profile_image ? (
                    <img src={member.profile_image} alt={member.name} className="h-20 w-20 rounded-full object-cover border-4 border-gold-300 mb-3" />
                  ) : (
                    <div className="h-20 w-20 rounded-full bg-navy-900 flex items-center justify-center text-xl font-bold text-gold-400 mb-3">
                      {member.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <h3 className="font-semibold text-navy-900 text-sm">{member.name}</h3>
                  <p className="text-xs text-gold-600 font-medium mt-0.5">{member.role}</p>
                </div>
                {member.bio && <p className="text-xs text-muted-foreground text-center line-clamp-2 mb-4">{member.bio}</p>}
                <div className="flex flex-col gap-1.5 mb-4">
                  {member.email && (
                    <a href={`mailto:${member.email}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-navy-900 transition-colors">
                      <Mail className="h-3 w-3" /> {member.email}
                    </a>
                  )}
                  {member.phone && (
                    <a href={`tel:${member.phone}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-navy-900 transition-colors">
                      <Phone className="h-3 w-3" /> {member.phone}
                    </a>
                  )}
                  {member.linkedin && (
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-blue-500 hover:text-blue-700 transition-colors">
                      <Linkedin className="h-3 w-3" /> LinkedIn
                    </a>
                  )}
                </div>
                <div className="flex gap-2 border-t border-border pt-4">
                  <Button size="sm" variant="outline" className="flex-1 gap-1.5 text-xs" onClick={() => openEdit(member)}>
                    <Pencil className="h-3 w-3" /> Edit
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 gap-1.5 text-xs text-destructive hover:text-destructive hover:border-destructive/50" onClick={() => setDeleting(member)}>
                    <Trash2 className="h-3 w-3" /> Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {formOpen && <TeamMemberForm open={formOpen} onOpenChange={closeForm} member={editing} />}
      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(o) => !o && setDeleting(null)}
        onConfirm={handleDelete}
        title="Delete Team Member"
        description={`Are you sure you want to remove ${deleting?.name}? This cannot be undone.`}
      />
    </div>
  );
}