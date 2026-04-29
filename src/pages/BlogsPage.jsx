import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Search, Pencil, Trash2, Globe, FileText } from "lucide-react";
import { format } from "date-fns";
import PageHeader from "../components/ui/PageHeader";
import BlogForm from "../components/blog/BlogForm";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function BlogsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;
  const queryClient = useQueryClient();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("new") === "1") setFormOpen(true);
  }, []);

  const { data: blogs = [], isLoading } = useQuery({
    queryKey: ["blogs"],
    queryFn: () => base44.entities.Blog.list("-created_date", 500),
  });

  const filtered = blogs.filter(b => {
    const matchSearch = b.title?.toLowerCase().includes(search.toLowerCase()) || b.author?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleDelete = async () => {
    await base44.entities.Blog.delete(deleting.id);
    toast.success("Blog deleted");
    queryClient.invalidateQueries({ queryKey: ["blogs"] });
    setDeleting(null);
  };

  const toggleStatus = async (blog) => {
    const newStatus = blog.status === "published" ? "draft" : "published";
    await base44.entities.Blog.update(blog.id, { status: newStatus });
    toast.success(`Blog ${newStatus === "published" ? "published" : "moved to drafts"}`);
    queryClient.invalidateQueries({ queryKey: ["blogs"] });
  };

  const openEdit = (blog) => { setEditing(blog); setFormOpen(true); };
  const closeForm = (open) => { if (!open) setEditing(null); setFormOpen(open); };

  return (
    <div className="max-w-7xl">
      <PageHeader
        title="Blog Management"
        subtitle="Create and manage your real estate blog posts."
        action={
          <Button onClick={() => setFormOpen(true)} className="bg-navy-900 hover:bg-navy-800 gap-2">
            <PlusCircle className="h-4 w-4" /> New Post
          </Button>
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by title or author..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="pl-10" />
        </div>
        <Select value={statusFilter} onValueChange={v => { setStatusFilter(v); setPage(1); }}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        {/* Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-navy-900/5 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <div className="col-span-4">Title</div>
          <div className="col-span-2">Author</div>
          <div className="col-span-2">Tags</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-2">Date</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        {isLoading ? (
          <div className="divide-y divide-border">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex items-center gap-4 px-6 py-4 animate-pulse">
                <div className="h-10 w-10 rounded-lg bg-muted shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-48 bg-muted rounded" />
                  <div className="h-2.5 w-32 bg-muted rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : paginated.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm text-muted-foreground">
            {search || statusFilter !== "all" ? "No blogs match your filters." : "No blog posts yet. Create your first one!"}
          </div>
        ) : (
          <div className="divide-y divide-border">
            {paginated.map(blog => (
              <div key={blog.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center px-6 py-4 hover:bg-muted/20 transition-colors">
                {/* Title + Image */}
                <div className="col-span-4 flex items-center gap-3">
                  {blog.featured_image ? (
                    <img src={blog.featured_image} alt={blog.title} className="h-10 w-10 rounded-lg object-cover border border-border shrink-0" />
                  ) : (
                    <div className="h-10 w-10 rounded-lg bg-navy-900/10 flex items-center justify-center shrink-0">
                      <FileText className="h-4 w-4 text-navy-700" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-navy-900 truncate">{blog.title}</p>
                    <p className="text-xs text-muted-foreground truncate font-mono">/blog/{blog.slug || "..."}</p>
                  </div>
                </div>

                {/* Author */}
                <div className="col-span-2 text-sm text-muted-foreground pl-12 md:pl-0 truncate">{blog.author || "—"}</div>

                {/* Tags */}
                <div className="col-span-2 pl-12 md:pl-0 flex flex-wrap gap-1">
                  {(blog.tags || []).slice(0, 2).map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                  ))}
                  {(blog.tags || []).length > 2 && <Badge variant="secondary" className="text-xs">+{blog.tags.length - 2}</Badge>}
                </div>

                {/* Status */}
                <div className="col-span-1 pl-12 md:pl-0">
                  <button onClick={() => toggleStatus(blog)} title="Click to toggle status">
                    <Badge
                      variant="outline"
                      className={blog.status === "published"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 cursor-pointer"
                        : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 cursor-pointer"}
                    >
                      {blog.status === "published" ? <Globe className="h-2.5 w-2.5 mr-1" /> : <FileText className="h-2.5 w-2.5 mr-1" />}
                      {blog.status || "draft"}
                    </Badge>
                  </button>
                </div>

                {/* Date */}
                <div className="col-span-2 text-xs text-muted-foreground pl-12 md:pl-0">
                  {blog.created_date ? format(new Date(blog.created_date), "MMM d, yyyy") : "—"}
                </div>

                {/* Actions */}
                <div className="col-span-1 flex justify-end gap-1 pl-12 md:pl-0">
                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-navy-900" onClick={() => openEdit(blog)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-destructive" onClick={() => setDeleting(blog)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length} posts
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</Button>
              <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
            </div>
          </div>
        )}
      </div>

      {formOpen && <BlogForm open={formOpen} onOpenChange={closeForm} blog={editing} />}
      <ConfirmDialog
        open={!!deleting}
        onOpenChange={o => !o && setDeleting(null)}
        onConfirm={handleDelete}
        title="Delete Blog Post"
        description={`Delete "${deleting?.title}"? This action cannot be undone.`}
      />
    </div>
  );
}