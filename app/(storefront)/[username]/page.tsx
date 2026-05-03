"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { 
  Share2, 
  MoreHorizontal, 
  ExternalLink, 
  Zap, 
  Heart,
  MessageCircle,
  ShoppingBag,
  Calendar,
  Globe,
  Instagram,
  Twitter,
  Youtube,
  ChevronRight,
  MapPin,
  User
} from "lucide-react";

export default function StorefrontPage() {
  const params = useParams();
  const username = params?.username as string;
  const [userName, setUserName] = useState("Creator");
  const [userBio, setUserBio] = useState("");
  const [userCategory, setUserCategory] = useState("");
  const [userLocation, setUserLocation] = useState("");
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!username) return;
    
    // For prototype: If the URL handle matches the local one, show local data and set owner
    const localHandle = localStorage.getItem("userHandle");
    if (localHandle === username) {
      setIsOwner(true);
      const name = localStorage.getItem("userName");
      const bio = localStorage.getItem("userBio");
      const category = localStorage.getItem("userCategory");
      const location = localStorage.getItem("userLocation");
      const photo = localStorage.getItem("userPhoto");
      
      if (name) setUserName(name);
      if (bio) setUserBio(bio);
      if (category) setUserCategory(category.charAt(0).toUpperCase() + category.slice(1));
      if (location) setUserLocation(location);
      if (photo) setUserPhoto(photo);
    }
  }, [username]);

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30">
      {/* Dashboard Link for Owner */}
      {isOwner && (
        <div className="sticky top-0 z-50 flex justify-center pt-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <button 
            onClick={() => window.location.href = "/overview"}
            className="flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-600/20 px-6 py-2.5 text-xs font-bold text-blue-400 backdrop-blur-xl transition-all hover:bg-blue-600/30 active:scale-95 shadow-lg shadow-blue-600/20"
          >
            <Zap className="h-3.5 w-3.5 fill-current" />
            Manage Dashboard
          </button>
        </div>
      )}

      {/* Dynamic Background */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute -top-[10%] left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-[120px]"></div>
        <div className="absolute top-[20%] -left-[10%] h-[400px] w-[400px] rounded-full bg-indigo-600/10 blur-[100px]"></div>
      </div>

      <div className="relative mx-auto max-w-md px-4 pb-20 pt-12">
        {/* Header Actions */}
        <div className="mb-8 flex items-center justify-between">
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900/50 border border-zinc-800 backdrop-blur-md transition-all hover:bg-zinc-800">
            <Share2 className="h-4 w-4 text-zinc-300" />
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900/50 border border-zinc-800 backdrop-blur-md transition-all hover:bg-zinc-800">
            <MoreHorizontal className="h-4 w-4 text-zinc-300" />
          </button>
        </div>

        {/* Profile Info */}
        <div className="text-center">
          <div className="relative mx-auto mb-6 h-28 w-28">
            <div className="absolute inset-0 animate-pulse rounded-full bg-blue-600/20 blur-xl"></div>
            <div className="relative h-full w-full rounded-full border-2 border-zinc-800 bg-zinc-900 p-1 overflow-hidden">
              {userPhoto ? (
                <img src={userPhoto} alt={userName} className="h-full w-full rounded-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-full bg-zinc-800 text-zinc-600">
                  <User className="h-12 w-12" />
                </div>
              )}
            </div>
            <div className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-black bg-blue-600">
              <Zap className="h-4 w-4 fill-current text-white" />
            </div>
          </div>

          <h1 className="text-2xl font-bold tracking-tight">{userName}</h1>
          <div className="mt-2 flex items-center justify-center gap-2 text-sm font-medium text-blue-500">
            <span>@{username}</span>
            {userCategory && <span>• {userCategory}</span>}
          </div>
          
          {userLocation && (
            <div className="mt-2 flex items-center justify-center gap-1 text-xs text-zinc-500">
              <MapPin className="h-3 w-3" />
              {userLocation}
            </div>
          )}

          <p className="mt-4 px-4 text-sm leading-relaxed text-zinc-400">
            {userBio || "No bio yet. This creator is still setting up their space."}
          </p>

          {/* Social Links Placeholder */}
          <div className="mt-6 flex items-center justify-center gap-4 text-zinc-600">
            <Globe className="h-5 w-5 transition-colors hover:text-white cursor-pointer" />
            <Instagram className="h-5 w-5 transition-colors hover:text-white cursor-pointer" />
            <Twitter className="h-5 w-5 transition-colors hover:text-white cursor-pointer" />
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex gap-3">
            <button className="flex-1 rounded-2xl bg-white h-12 text-sm font-bold text-black shadow-lg transition-all hover:bg-zinc-200 active:scale-[0.98]">
              Follow
            </button>
            <button className="flex-1 rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-md h-12 text-sm font-bold text-white transition-all hover:bg-zinc-800 active:scale-[0.98]">
              Tip Creator
            </button>
          </div>
        </div>

        {/* Content Tabs Placeholder */}
        <div className="mt-12 space-y-4">
          <div className="flex items-center justify-around border-b border-zinc-800/50 pb-4">
            <button className="text-sm font-semibold text-white border-b-2 border-blue-500 pb-4 px-4 -mb-[18px]">Offers</button>
            <button className="text-sm font-medium text-zinc-500 hover:text-zinc-300 transition-colors">Events</button>
            <button className="text-sm font-medium text-zinc-500 hover:text-zinc-300 transition-colors">Links</button>
          </div>

          {/* Dummy State: If no content, show placeholder */}
          <div className="pt-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-900/50 border border-zinc-800 text-zinc-700">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-300">No active offers</h3>
            <p className="mt-1 text-xs text-zinc-600">This creator hasn&apos;t published any offers yet.</p>
          </div>
        </div>

        {/* Footer Brand */}
        <div className="mt-16 flex flex-col items-center gap-2 opacity-30 transition-opacity hover:opacity-100">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 fill-current text-blue-500" />
            <span className="text-xs font-bold tracking-widest text-white">PAYLANCE</span>
          </div>
          <p className="text-[10px] uppercase tracking-tighter text-zinc-500">Built with Creator OS</p>
        </div>
      </div>
    </main>
  );
}
