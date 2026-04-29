import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { base44 } from "@/api/Client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Upload, X, Plus } from "lucide-react";
import ReactQuill from "react-quill";

const EMPTY = { title: "", slug: "", content: "", excerpt: "", featured_image: "", tags: [], status: "draft", author: "" };

function generateSlug(title) {
  return title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
}

export default function BlogForm({ open, onOpenChange, blog = null }) {
  const [form, setForm] = useState(blog ? { ...blog, tags: blog.tags || [] } : EMPTY);
  const [tagInput, setTagInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (blog) setForm({ ...blog, tags: blog.tags || [] });
    else setForm(EMPTY);
  }, [blog, open]);

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleTitleChange = (value) => {
    set("title", value);
    if (!blog) set("slug", generateSlug(value));
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !form.tags.includes(tag)) {
      set("tags", [...form.tags, tag]);
    }
    setTagInput("");
  };
  const removeTag = (tag) => set("tags", form.tags.filter(t => t !== tag));

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      set("featured_image", file_url);
      toast.success("Image uploaded!");
    } catch {
      toast.error("Image upload failed");
    }
    setUploading(false);
  };

  const validate = () => {
    if (!form.title.trim()) { toast.error("Title is required"); return false; }
    if (!form.content.trim()) { toast.error("Content is required"); return false; }
    return true;
  };

  const handleSave = async (status = form.status) => {
    if (!validate()) return;
    setSaving(true);
    try {
      const data = { ...form, status, slug: form.slug || generateSlug(form.title) };
      if (blog?.id) {
        await base44.entities.Blog.update(blog.id, data);
        toast.success("Blog updated!");
      } else {
        await base44.entities.Blog.create(data);
        toast.success(status === "published" ? "Blog published!" : "Blog saved as draft!");
      }
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      onOpenChange(false);
    } catch {
      toast.error("Failed to save blog.");
    }
    setSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-navy-900">{blog ? "Edit Blog Post" : "New Blog Post"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-5 py-2">
          {/* Title */}
          <div className="space-y-1.5">
            <Label>Title <span className="text-destructive">*</span></Label>
            <Input value={form.title} onChange={e => handleTitleChange(e.target.value)} placeholder="Enter blog title..." className="text-base" />
          </div>

          {/* Slug */}
          <div className="space-y-1.5">
            <Label>Slug (URL)</Label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground bg-muted px-2 py-2 rounded-l-lg border border-r-0 border-border">/blog/</span>
              <Input value={form.slug} onChange={e => set("slug", e.target.value)} placeholder="auto-generated-from-title" className="rounded-l-none" />
            </div>
          </div>

          {/* Featured Image */}
          <div className="space-y-1.5">
            <Label>Featured Image</Label>
            {form.featured_image ? (
              <div className="relative">
                <img src={form.featured_image} alt="Featured" className="w-full h-48 object-cover rounded-lg border border-border" />
                <Button size="icon" variant="destructive" className="absolute top-2 right-2 h-7 w-7" onClick={() => set("featured_image", "")}>
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <label className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg h-36 hover:border-gold-400 hover:bg-gold-50/30 transition-colors">
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                {uploading ? <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /> : <Upload className="h-6 w-6 text-muted-foreground mb-2" />}
                <span className="text-sm text-muted-foreground">{uploading ? "Uploading..." : "Click to upload featured image"}</span>
              </label>
            )}
          </div>

          {/* Excerpt */}
          <div className="space-y-1.5">
            <Label>Excerpt</Label>
            <Textarea value={form.excerpt} onChange={e => set("excerpt", e.target.value)} placeholder="Short description shown in listings..." rows={2} />
          </div>

          {/* Content */}
          <div className="space-y-1.5">
            <Label>Content <span className="text-destructive">*</span></Label>
            <ReactQuill
              theme="snow"
              value={form.content}
              onChange={val => set("content", val)}
              placeholder="Write your blog post content here..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Author */}
            <div className="space-y-1.5">
              <Label>Author</Label>
              <Input value={form.author} onChange={e => set("author", e.target.value)} placeholder="Author name" />
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={val => set("status", val)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTag())}
                placeholder="Add tag and press Enter"
              />
              <Button type="button" variant="outline" size="icon" onClick={addTag}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {form.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="gap-1 cursor-pointer hover:bg-destructive/10" onClick={() => removeTag(tag)}>
                    {tag} <X className="h-2.5 w-2.5" />
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          {!blog && (
            <Button variant="outline" onClick={() => handleSave("draft")} disabled={saving} className="border-amber-300 text-amber-700 hover:bg-amber-50">
              Save as Draft
            </Button>
          )}
          <Button onClick={() => handleSave("published")} disabled={saving} className="bg-navy-900 hover:bg-navy-800">
            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {blog ? "Update" : "Publish"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}