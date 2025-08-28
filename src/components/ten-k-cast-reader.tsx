"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Slider } from "~/components/ui/slider";
import { TenKCastPost } from "~/app/api/ten-k-cast/route";

interface TenKCastReaderProps {
  post: TenKCastPost;
  onBack: () => void;
}

const FONT_FAMILIES = [
  { value: "system", label: "System", className: "font-sans" },
  { value: "serif", label: "Serif", className: "font-serif" },
  { value: "mono", label: "Monospace", className: "font-mono" },
];

const BACKGROUND_THEMES = [
  { value: "default", label: "Default", className: "bg-background text-foreground" },
  { value: "sepia", label: "Sepia", className: "bg-amber-50 text-amber-900" },
  { value: "dark", label: "Dark", className: "bg-gray-900 text-gray-100" },
  { value: "high-contrast", label: "High Contrast", className: "bg-white text-black" },
];

export function TenKCastReader({ post, onBack }: TenKCastReaderProps) {
  const [fontSize, setFontSize] = useState([16]);
  const [fontFamily, setFontFamily] = useState("system");
  const [backgroundTheme, setBackgroundTheme] = useState("default");

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const selectedFont = FONT_FAMILIES.find(font => font.value === fontFamily);
  const selectedTheme = BACKGROUND_THEMES.find(theme => theme.value === backgroundTheme);

  return (
    <div className={`min-h-screen transition-colors ${selectedTheme?.className}`}>
      <div className="max-w-4xl mx-auto p-4">
        {/* Reader Controls */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <Button variant="outline" onClick={onBack}>
                  ← Back to Feed
                </Button>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    Share
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              {/* Reading Preferences */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Font Size</label>
                  <div className="flex items-center gap-3">
                    <span className="text-xs">A</span>
                    <Slider
                      value={fontSize}
                      onValueChange={setFontSize}
                      max={24}
                      min={12}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-lg">A</span>
                    <span className="text-xs w-8 text-center">{fontSize[0]}px</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Font Family</label>
                  <Select value={fontFamily} onValueChange={setFontFamily}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FONT_FAMILIES.map((font) => (
                        <SelectItem key={font.value} value={font.value}>
                          <span className={font.className}>{font.label}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Theme</label>
                  <Select value={backgroundTheme} onValueChange={setBackgroundTheme}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {BACKGROUND_THEMES.map((theme) => (
                        <SelectItem key={theme.value} value={theme.value}>
                          {theme.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Post Content */}
        <Card>
          <CardContent className="p-6">
            {/* Author Info */}
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="h-12 w-12">
                <AvatarImage src={post.author.pfpUrl} />
                <AvatarFallback>
                  {post.author.displayName?.charAt(0) || post.author.username?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">
                  {post.author.displayName || post.author.username}
                </h3>
                <p className="text-muted-foreground text-sm">
                  @{post.author.username} • {formatTimestamp(post.timestamp)}
                </p>
              </div>
            </div>

            <Separator className="mb-6" />

            {/* Post Text */}
            <div 
              className={`leading-relaxed ${selectedFont?.className}`}
              style={{ fontSize: `${fontSize[0]}px` }}
            >
              <p className="whitespace-pre-wrap">{post.text}</p>
            </div>

            {/* Images */}
            {post.embedImages && post.embedImages.length > 0 && (
              <div className="mt-6 space-y-4">
                {post.embedImages.map((imageUrl, index) => (
                  <div key={index} className="overflow-hidden rounded-lg">
                    <img
                      src={imageUrl}
                      alt={`Embedded image ${index + 1}`}
                      className="w-full h-auto max-w-full"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* URLs */}
            {post.embedUrls && post.embedUrls.length > 0 && (
              <div className="mt-6 space-y-2">
                <h4 className="font-medium text-sm">Links:</h4>
                {post.embedUrls.map((url, index) => (
                  <a
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-blue-600 hover:text-blue-800 text-sm break-all underline"
                  >
                    {url}
                  </a>
                ))}
              </div>
            )}

            <Separator className="my-6" />

            {/* Engagement Stats */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-red-500">♡</span>
                  <span className="text-sm">{post.reactions.likes} likes</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">↻</span>
                  <span className="text-sm">{post.reactions.recasts} recasts</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-500">💬</span>
                  <span className="text-sm">{post.reactions.replies} replies</span>
                </div>
              </div>
              
              <Badge variant="outline">
                Ten K Cast
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}