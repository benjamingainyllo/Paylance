"use client";

import { useEffect, useState, useRef } from "react";
import { TopFilters } from "@/components/dashboard/top-filters";
import { useAuth } from "@/components/auth/auth-provider";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Camera, Loader2, User } from "lucide-react";

export default function SettingsPage() {
  const { user, profile, refreshProfile } = useAuth();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");

  // Profile Form State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [handle, setHandle] = useState("");
  const [bio, setBio] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Security Form State
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || "");
      setLastName(profile.last_name || "");
      setHandle(profile.handle || "");
      setBio(profile.bio || "");
      setCategory(profile.category || "");
      setLocation(profile.location || "");
      setAvatarUrl(profile.avatar_url || null);
    }
  }, [profile]);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
    }
  };

  const handleUpdateProfile = async () => {
    if (!user) return;
    setIsSavingProfile(true);

    try {
      console.log("Starting save profile...");
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Request timed out after 10 seconds")), 10000));
      
      await Promise.race([
        (async () => {
          let finalAvatarUrl = profile?.avatar_url;

          if (photoFile) {
            console.log("Uploading photo...");
            const fileExt = photoFile.name.split(".").pop();
            const filePath = `${user.id}/avatar.${fileExt}`;

            const { error: uploadError } = await supabase.storage
              .from("avatars")
              .upload(filePath, photoFile, { upsert: true });

            if (uploadError) {
              throw new Error("Avatar upload failed: " + uploadError.message);
            }

            const { data: publicUrlData } = supabase.storage
              .from("avatars")
              .getPublicUrl(filePath);
            finalAvatarUrl = publicUrlData.publicUrl;
            console.log("Photo uploaded!");
          }

          const profileData = {
            id: user.id,
            first_name: firstName || null,
            last_name: lastName || null,
            handle: handle ? handle.toLowerCase() : null,
            bio: bio || null,
            category: category || null,
            location: location || null,
            avatar_url: finalAvatarUrl,
          };

          console.log("Saving profile to DB...", profileData);
          const { error: saveError } = await supabase
            .from("profiles")
            .upsert(profileData);

          if (saveError) {
            console.error("Save error:", saveError);
            if (saveError.code === "23505") {
              throw new Error("That handle is already taken. Try another one.");
            }
            throw new Error("Failed to save profile: " + saveError.message);
          }

          console.log("Refreshing profile context...");
          await refreshProfile();
          console.log("Save complete!");
        })(),
        timeoutPromise
      ]);

      toast.success("Profile updated successfully!");
    } catch (err: any) {
      console.error("Save profile error:", err);
      toast.error(err.message || "Failed to update profile");
    } finally {
      setIsSavingProfile(false);
    }
  };
  

  const handleUpdatePassword = async () => {
    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in both password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setIsSavingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw new Error(error.message);

      toast.success("Password updated successfully!");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err.message || "Failed to update password");
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <section className="space-y-4 pb-12">
      <TopFilters />
      
      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="mb-5 flex items-center gap-2 border-b border-border pb-4">
          <button 
            onClick={() => setActiveTab("profile")}
            className={`rounded-lg px-4 py-2 text-xs font-semibold transition-colors ${
              activeTab === "profile" 
                ? "bg-primary text-white" 
                : "bg-muted/50 text-subtle hover:bg-muted hover:text-text"
            }`}
          >
            Profile
          </button>
          <button 
            onClick={() => setActiveTab("security")}
            className={`rounded-lg px-4 py-2 text-xs font-semibold transition-colors ${
              activeTab === "security" 
                ? "bg-primary text-white" 
                : "bg-muted/50 text-subtle hover:bg-muted hover:text-text"
            }`}
          >
            Security
          </button>
        </div>

        {activeTab === "profile" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <section>
              <h2 className="text-sm font-semibold text-text mb-1">Public Profile</h2>
              <p className="text-xs text-subtle mb-6">Manage how you appear to your audience.</p>

              <div className="flex flex-col gap-6 sm:flex-row">
                <div className="flex flex-col items-center gap-3">
                  <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-border bg-muted">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-zinc-800 text-zinc-600">
                        <User className="h-10 w-10" />
                      </div>
                    )}
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity hover:opacity-100"
                    >
                      <Camera className="h-6 w-6 text-white" />
                    </button>
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handlePhotoSelect} 
                    accept="image/*" 
                    className="hidden" 
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs font-medium text-blue-500 hover:text-blue-400 transition-colors"
                  >
                    Change Avatar
                  </button>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-subtle">First Name</label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="e.g. Sarah"
                        className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm text-text outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-subtle">Last Name</label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="e.g. Jenkins"
                        className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm text-text outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-subtle">Creator Handle (URL)</label>
                    <div className="flex items-center">
                      <span className="rounded-l-lg border border-r-0 border-border bg-muted/50 px-3 py-2 text-sm text-subtle">
                        paylance.com/
                      </span>
                      <input
                        type="text"
                        value={handle}
                        onChange={(e) => setHandle(e.target.value)}
                        placeholder="your-handle"
                        className="w-full rounded-r-lg border border-border bg-muted px-3 py-2 text-sm text-text outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-subtle">Headline / Bio</label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="What do you do?"
                      rows={3}
                      className="w-full resize-none rounded-lg border border-border bg-muted px-3 py-2 text-sm text-text outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-subtle">Category</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm text-text outline-none focus:border-blue-500"
                      >
                        <option value="">Select category...</option>
                        <option value="design">Design</option>
                        <option value="development">Development</option>
                        <option value="writing">Writing</option>
                        <option value="video">Video</option>
                        <option value="music">Music</option>
                        <option value="business">Business</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-subtle">Location</label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. Lagos, Nigeria"
                        className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm text-text outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end border-t border-border pt-5">
                <button 
                  onClick={handleUpdateProfile}
                  disabled={isSavingProfile}
                  className="flex min-w-[120px] items-center justify-center rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-blue-500 active:scale-95 disabled:opacity-50"
                >
                  {isSavingProfile ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Profile"}
                </button>
              </div>
            </section>
          </div>
        )}

        {activeTab === "security" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <section>
              <h2 className="text-sm font-semibold text-text mb-1">Account Security</h2>
              <p className="text-xs text-subtle mb-6">Manage your password and account protection settings.</p>
              
              <div className="max-w-md space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-subtle">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm text-text outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-subtle">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm text-text outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-start border-t border-border pt-5">
                <button 
                  onClick={handleUpdatePassword}
                  disabled={isSavingPassword}
                  className="flex min-w-[120px] items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-primary/80 active:scale-95 disabled:opacity-50"
                >
                  {isSavingPassword ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update Password"}
                </button>
              </div>
            </section>
          </div>
        )}
      </div>
    </section>
  );
}
