
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Trash2, Edit, Plus, Share2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BlogPost {
  id: number;
  title: string;
  subtitle: string;
  content: string;
  image?: string;
  createdAt: string;
  slug: string;
}

const BlogAdmin = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  // Form states
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    // Load posts from localStorage
    const savedPosts = localStorage.getItem('blogPosts');
    if (savedPosts) {
      try {
        const parsed = JSON.parse(savedPosts);
        if (Array.isArray(parsed)) {
          setPosts(parsed);
        }
      } catch (error) {
        console.error("Failed to parse blog posts", error);
      }
    }
  }, []);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleSavePost = () => {
    if (!title || !subtitle || !content) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const newPost: BlogPost = {
      id: editingPost ? editingPost.id : Date.now(),
      title,
      subtitle,
      content,
      image: imageFile ? URL.createObjectURL(imageFile) : editingPost?.image,
      createdAt: editingPost ? editingPost.createdAt : new Date().toISOString(),
      slug: generateSlug(title),
    };

    let updatedPosts;
    if (editingPost) {
      updatedPosts = posts.map(p => p.id === editingPost.id ? newPost : p);
    } else {
      updatedPosts = [newPost, ...posts];
    }

    setPosts(updatedPosts);
    localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));

    // Reset form
    setTitle('');
    setSubtitle('');
    setContent('');
    setImageFile(null);
    setEditingPost(null);
    setIsDialogOpen(false);

    toast({
      title: "Success",
      description: editingPost ? "Post updated successfully!" : "Post created successfully!",
    });
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setTitle(post.title);
    setSubtitle(post.subtitle);
    setContent(post.content);
    setIsDialogOpen(true);
  };

  const handleDeletePost = (id: number) => {
    const updatedPosts = posts.filter(p => p.id !== id);
    setPosts(updatedPosts);
    localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));
    
    toast({
      title: "Post Deleted",
      description: "The blog post has been removed.",
    });
  };

  const handleShare = (post: BlogPost) => {
    const url = `${window.location.origin}/blog/${post.slug}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url)
        .then(() => {
          toast({
            title: "Link Copied",
            description: "Blog post link copied to clipboard!",
          });
        })
        .catch(err => console.error("Failed to copy link", err));
    } else {
      toast({
        title: "Link Ready",
        description: "Clipboard access not available. URL: " + url,
      });
    }
  };

  const resetForm = () => {
    setEditingPost(null);
    setTitle('');
    setSubtitle('');
    setContent('');
    setImageFile(null);
  };

  return (
    <div className="w-full">
      <div className="w-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Blog Admin Panel</h1>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="bg-[rgb(var(--brand-primary,37,99,235))] hover:bg-[rgb(var(--brand-primary-dark,29,78,216))] text-white shadow-md shadow-[rgba(var(--brand-primary,37,99,235),0.2)] border-0 transition-all duration-300">
                <Plus className="w-4 h-4 mr-2" />
                New Post
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingPost ? 'Edit Post' : 'Create New Post'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter post title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subtitle">Subtitle *</Label>
                  <Input
                    id="subtitle"
                    placeholder="Enter post subtitle"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image">Featured Image</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Content *</Label>
                  <Textarea
                    id="content"
                    placeholder="Write your blog content here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={10}
                  />
                </div>
                <Button onClick={handleSavePost} className="w-full bg-[rgb(var(--brand-primary,37,99,235))] hover:bg-[rgb(var(--brand-primary-dark,29,78,216))] text-white shadow-md shadow-[rgba(var(--brand-primary,37,99,235),0.2)] border-0 transition-all duration-300">
                  {editingPost ? 'Update Post' : 'Create Post'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                {post.image && (
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                )}
                <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
                <p className="text-sm text-gray-600 line-clamp-2">{post.subtitle}</p>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-500 mb-4">
                  Created: {new Date(post.createdAt).toLocaleDateString()}
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditPost(post)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleShare(post)}
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeletePost(post.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No blog posts yet. Create your first post!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogAdmin;
