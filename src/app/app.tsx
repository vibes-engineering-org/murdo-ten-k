"use client";

import { useState } from "react";
import { PROJECT_TITLE } from "~/lib/constants";
import { TenKCastList } from "~/components/ten-k-cast-list";
import { TenKCastReader } from "~/components/ten-k-cast-reader";
import { TenKCastPost } from "~/app/api/ten-k-cast/route";

export default function App() {
  const [selectedPost, setSelectedPost] = useState<TenKCastPost | null>(null);

  return (
    <div className="w-full max-w-4xl mx-auto min-h-screen">
      {selectedPost ? (
        <TenKCastReader 
          post={selectedPost} 
          onBack={() => setSelectedPost(null)} 
        />
      ) : (
        <div className="py-8 px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              {PROJECT_TITLE}
            </h1>
            <p className="text-muted-foreground">
              Latest and trending posts from the ten-k-cast channel
            </p>
          </div>
          
          <TenKCastList onPostClick={setSelectedPost} />
        </div>
      )}
    </div>
  );
}
