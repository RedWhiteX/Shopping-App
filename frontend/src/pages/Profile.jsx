import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from 'react-hot-toast'; // Import toast for notifications

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("access");
        if (!token) {
          toast.error("Please log in to view your profile.");
          return;
        }
        const response = await axios.get("http://localhost:8002/api/profile/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(response.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        toast.error("Failed to fetch profile data.");
      }
    };

    fetchProfile();
  }, []);

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleImageUpload = async () => {
    if (!profileImage) {
        toast.error("Please select an image to upload.");
        return;
    }
    const formData = new FormData();
    formData.append("profile_image", profileImage);

    try {
      const token = localStorage.getItem("access");
      if (!token) {
        toast.error("You must be logged in to upload an image.");
        return;
      }
      await axios.post("http://localhost:8002/api/profile/upload-image/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Profile image uploaded successfully!");
      // Optionally re-fetch profile to display new image if your API returns it
    } catch (err) {
      console.error("Upload failed:", err);
      toast.error("Failed to upload image. Please try again.");
    }
  };

  return (
    // Main container uses background and foreground colors
    <div className="max-w-2xl mx-auto p-6 bg-background text-foreground">
      {/* Card uses card background and foreground text, with border */}
      <Card className="bg-card text-card-foreground rounded-lg shadow-md border border-border">
        <CardContent className="space-y-6 p-6">
          {/* H2 uses foreground */}
          <h2 className="text-xl font-semibold text-foreground">Your Profile</h2>

          {profile && (
            <div>
              {/* Profile text uses foreground */}
              <p className="text-foreground"><strong>Username:</strong> {profile.username}</p>
              {/* Future: Show profile image */}
            </div>
          )}

          <div className="space-y-2">
            {/* Label uses foreground */}
            <Label htmlFor="profileImage" className="text-foreground">Upload Profile Image</Label>
            {/* Input file uses input semantic colors */}
            <Input type="file" id="profileImage" onChange={handleImageChange} className="border border-input bg-background text-foreground"/>
            {/* Button uses primary colors */}
            <Button onClick={handleImageUpload} className="bg-primary text-primary-foreground hover:bg-primary/90">Upload</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
