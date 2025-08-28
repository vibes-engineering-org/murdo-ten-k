"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Skeleton } from "~/components/ui/skeleton";
import { TenKCastPost } from "~/app/api/ten-k-cast/route";

interface TenKCastListProps {
  onPostClick: (post: TenKCastPost) => void;
}

export function TenKCastList({ onPostClick }: TenKCastListProps) {
  const [posts, setPosts] = useState<TenKCastPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"latest" | "trending">("latest");
  const [refreshCount, setRefreshCount] = useState(0);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/ten-k-cast?sort=${sortBy}&limit=25`);
      const data = await response.json();
      
      if (data.success) {
        setPosts(data.posts);
        setError(null);
      } else {
        setError(data.message || "Failed to fetch posts");
      }
    } catch (err) {
      setError("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  }, [sortBy]);

  useEffect(() => {
    fetchPosts();
  }, [sortBy, refreshCount, fetchPosts]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshCount(prev => prev + 1);
    }, 60 * 60 * 1000); // Refresh every hour

    return () => clearInterval(interval);
  }, []);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays}d ago`;
    } else if (diffHours > 0) {
      return `${diffHours}h ago`;
    } else {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return `${diffMinutes}m ago`;
    }
  };

  const trimText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  if (loading && posts.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex gap-2 mb-4">
          <Skeleton className="h-9 w-16" />
          <Skeleton className="h-9 w-20" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="p-4">
            <div className="flex items-start gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex gap-4">
                  <Skeleton className="h-6 w-12" />
                  <Skeleton className="h-6 w-12" />
                  <Skeleton className="h-6 w-12" />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={fetchPosts}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-4">
        <Button
          variant={sortBy === "latest" ? "default" : "outline"}
          size="sm"
          onClick={() => setSortBy("latest")}
        >
          Latest
        </Button>
        <Button
          variant={sortBy === "trending" ? "default" : "outline"}
          size="sm"
          onClick={() => setSortBy("trending")}
        >
          Trending
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setRefreshCount(prev => prev + 1)}
          className="ml-auto"
        >
          Refresh
        </Button>
      </div>

      {posts.length === 0 && !loading ? (
        <div className="text-center py-8 text-muted-foreground">
          No posts found
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <Card 
              key={post.hash}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onPostClick(post)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={post.author.pfpUrl} />
                    <AvatarFallback>
                      {post.author.displayName?.charAt(0) || post.author.username?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">
                        {post.author.displayName || post.author.username}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        @{post.author.username}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {formatTimestamp(post.timestamp)}
                      </span>
                    </div>
                    
                    <p className="text-sm mb-3 leading-relaxed">
                      {trimText(post.text)}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <span>♡</span>
                        <span>{post.reactions.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>↻</span>
                        <span>{post.reactions.recasts}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>💬</span>
                        <span>{post.reactions.replies}</span>
                      </div>
                      {(post.reactions.likes + post.reactions.recasts + post.reactions.replies > 10) && (
                        <Badge variant="secondary" className="text-xs">
                          Popular
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}