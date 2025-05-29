import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("access");
        const response = await axios.get("http://localhost:8002/api/profile/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(response.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, []);

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleImageUpload = async () => {
    if (!profileImage) return;
    const formData = new FormData();
    formData.append("profile_image", profileImage);

    try {
      const token = localStorage.getItem("access");
      await axios.post("http://localhost:8002/api/profile/upload-image/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Image uploaded!");
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Failed to upload image.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardContent className="space-y-6 p-6">
          <h2 className="text-xl font-semibold">Your Profile</h2>

          {profile && (
            <div>
              <p><strong>Username:</strong> {profile.username}</p>
              {/* Future: Show profile image */}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="profileImage">Upload Profile Image</Label>
            <Input type="file" id="profileImage" onChange={handleImageChange} />
            <Button onClick={handleImageUpload}>Upload</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
