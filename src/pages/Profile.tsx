
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Navigation from "@/components/Navigation";
import { User, Settings, Link as LinkIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "Radek",
    email: "radek@example.com",
    age: "30",
    weight: "72",
    height: "180",
    bio: "Passionate runner and fitness enthusiast",
    stravaConnected: false,
  });
  const { toast } = useToast();

  const handleSave = () => {
    // TODO: Save to database
    localStorage.setItem("userProfile", JSON.stringify(profile));
    toast({
      title: "Profile updated",
      description: "Your profile has been saved successfully.",
    });
  };

  const handleStravaConnect = () => {
    // TODO: Implement Strava OAuth
    setProfile(prev => ({ ...prev, stravaConnected: !prev.stravaConnected }));
    toast({
      title: profile.stravaConnected ? "Strava disconnected" : "Strava connected",
      description: profile.stravaConnected 
        ? "Your Strava account has been disconnected." 
        : "Ready to sync with Strava! (Integration coming soon)",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
          <p className="text-gray-600">Manage your account and training preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={profile.age}
                    onChange={(e) => setProfile(prev => ({ ...prev, age: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={profile.weight}
                    onChange={(e) => setProfile(prev => ({ ...prev, weight: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={profile.height}
                    onChange={(e) => setProfile(prev => ({ ...prev, height: e.target.value }))}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Integrations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Integrations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-orange-100 rounded-full">
                      <LinkIcon className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Strava</h3>
                      <p className="text-sm text-gray-500">
                        {profile.stravaConnected ? "Connected" : "Connect your Strava account"}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant={profile.stravaConnected ? "outline" : "default"}
                    onClick={handleStravaConnect}
                  >
                    {profile.stravaConnected ? "Disconnect" : "Connect"}
                  </Button>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>Coming soon:</strong> Auto-sync your activities from Strava, 
                    import training data, and share your achievements.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 flex justify-end">
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </main>
    </div>
  );
};

export default Profile;
