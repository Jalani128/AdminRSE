import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { base44 } from "@/api/Client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Upload } from "lucide-react";

const EMPTY = { name: "", role: "", bio: "", email: "", phone: "", linkedin: "", order: "" };

export default function TeamMemberForm({ open, onOpenChange, member = null }) {
  const [form, setForm] = useState(member ? { ...member } : EMPTY);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const queryClient = useQueryClient();

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      set("profile_image", file_url);
      toast.success("Image uploaded!");
    } catch {
      toast.error("Image upload failed");
    }
    setUploading(false);
  };

  const validate = () => {
    if (!form.name.trim()) { toast.error("Name is required"); return false; }
    if (!form.role.trim()) { toast.error("Role is required"); return false; }
    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const data = { ...form, order: form.order ? Number(form.order) : undefined };
      if (member?.id) {
        await base44.entities.TeamMember.update(member.id, data);
        toast.success("Team member updated!");
      } else {
        await base44.entities.TeamMember.create(data);
        toast.success("Team member added!");
      }
      queryClient.invalidateQueries({ queryKey: ["team"] });
      onOpenChange(false);
    } catch {
      toast.error("Failed to save. Please try again.");
    }
    setSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-navy-900">{member ? "Edit Team Member" : "Add Team Member"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {/* Image upload */}
          <div className="flex flex-col items-center gap-3">
            {form.profile_image ? (
              <img src={form.profile_image} alt="Profile" className="h-24 w-24 rounded-full object-cover border-2 border-gold-300" />
            ) : (
              <div className="h-24 w-24 rounded-full bg-navy-900 flex items-center justify-center text-2xl font-bold text-gold-400">
                {form.name ? form.name.slice(0, 2).toUpperCase() : "?"}
              </div>
            )}
            <label className="cursor-pointer">
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
              <span className="flex items-center gap-2 text-xs font-medium text-gold-600 border border-gold-300 rounded-lg px-3 py-1.5 hover:bg-gold-50 transition-colors">
                {uploading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
                Upload Photo
              </span>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Name <span className="text-destructive">*</span></Label>
              <Input value={form.name} onChange={e => set("name", e.target.value)} placeholder="John Smith" />
            </div>
            <div className="space-y-1.5">
              <Label>Role <span className="text-destructive">*</span></Label>
              <Input value={form.role} onChange={e => set("role", e.target.value)} placeholder="Senior Agent" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Bio</Label>
            <Textarea value={form.bio} onChange={e => set("bio", e.target.value)} placeholder="Short biography..." rows={3} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="john@estate.com" />
            </div>
            <div className="space-y-1.5">
              <Label>Phone</Label>
              <Input value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+1 234 567 8900" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>LinkedIn URL</Label>
              <Input value={form.linkedin} onChange={e => set("linkedin", e.target.value)} placeholder="https://linkedin.com/in/..." />
            </div>
            <div className="space-y-1.5">
              <Label>Display Order</Label>
              <Input type="number" value={form.order} onChange={e => set("order", e.target.value)} placeholder="1" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving} className="bg-navy-900 hover:bg-navy-800">
            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {member ? "Update" : "Add Member"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}