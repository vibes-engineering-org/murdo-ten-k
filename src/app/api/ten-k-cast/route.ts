import { NextRequest, NextResponse } from "next/server";

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;
const TEN_K_CAST_CHANNEL = "ten-k-cast";

export interface TenKCastPost {
  hash: string;
  text: string;
  author: {
    username: string;
    displayName: string;
    pfpUrl: string;
    fid: number;
  };
  timestamp: string;
  reactions: {
    likes: number;
    recasts: number;
    replies: number;
  };
  embedImages?: string[];
  embedUrls?: string[];
}

async function fetchChannelCasts(channelId: string, limit: number = 25): Promise<TenKCastPost[]> {
  if (!NEYNAR_API_KEY) {
    throw new Error("NEYNAR_API_KEY is not configured");
  }

  const response = await fetch(
    `https://api.neynar.com/v2/farcaster/feed/channels?channel_ids=${channelId}&limit=${limit}&with_recasts=false`,
    {
      headers: {
        "Accept": "application/json",
        "api_key": NEYNAR_API_KEY,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch channel casts: ${response.statusText}`);
  }

  const data = await response.json();
  
  return data.casts?.map((cast: any) => ({
    hash: cast.hash,
    text: cast.text,
    author: {
      username: cast.author.username,
      displayName: cast.author.display_name,
      pfpUrl: cast.author.pfp_url,
      fid: cast.author.fid,
    },
    timestamp: cast.timestamp,
    reactions: {
      likes: cast.reactions?.likes_count || 0,
      recasts: cast.reactions?.recasts_count || 0,
      replies: cast.replies?.count || 0,
    },
    embedImages: cast.embeds?.filter((embed: any) => embed.url && 
      (embed.url.includes('.jpg') || embed.url.includes('.jpeg') || 
       embed.url.includes('.png') || embed.url.includes('.gif') || 
       embed.url.includes('.webp')))?.map((embed: any) => embed.url) || [],
    embedUrls: cast.embeds?.filter((embed: any) => embed.url && 
      !embed.url.includes('.jpg') && !embed.url.includes('.jpeg') && 
      !embed.url.includes('.png') && !embed.url.includes('.gif') && 
      !embed.url.includes('.webp'))?.map((embed: any) => embed.url) || [],
  })) || [];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "25");
    const sortBy = searchParams.get("sort") || "latest";

    const posts = await fetchChannelCasts(TEN_K_CAST_CHANNEL, limit);
    
    let sortedPosts = [...posts];
    if (sortBy === "trending") {
      sortedPosts.sort((a, b) => {
        const aScore = a.reactions.likes + (a.reactions.recasts * 2) + a.reactions.replies;
        const bScore = b.reactions.likes + (b.reactions.recasts * 2) + b.reactions.replies;
        return bScore - aScore;
      });
    }

    return NextResponse.json({
      success: true,
      posts: sortedPosts,
      count: sortedPosts.length,
    });
  } catch (error) {
    console.error("Error fetching ten_k_cast posts:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch ten_k_cast posts",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}