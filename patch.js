const fs = require('fs');
const file = './app/(dashboard)/settings/page.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace('const handleUpdateProfile = async () => {', `const handleUpdateProfile = async () => {
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
            const filePath = \`\${user.id}/avatar.\${fileExt}\`;

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
            first_name: firstName || null,
            last_name: lastName || null,
            handle: handle ? handle.toLowerCase() : null,
            bio: bio || null,
            category: category || null,
            location: location || null,
            avatar_url: finalAvatarUrl,
          };

          console.log("Updating profile in DB...", profileData);
          const { error: updateError } = await supabase
            .from("profiles")
            .update(profileData)
            .eq("id", user.id);

          if (updateError) {
            console.error("Update error:", updateError);
            if (updateError.code === "23505") {
              throw new Error("That handle is already taken. Try another one.");
            }
            
            console.log("Update failed, trying insert...");
            const { error: insertError } = await supabase
              .from("profiles")
              .insert({ id: user.id, ...profileData });
              
            if (insertError) {
              console.error("Insert error:", insertError);
              throw new Error("Failed to save profile: " + insertError.message);
            }
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
  
  const handleUpdateProfile_old = async () => {`);
fs.writeFileSync(file, content);
