
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Navigation from "@/components/Navigation";
import { User, Settings, Link as LinkIcon, Target, Calendar, UserCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    age: "",
    weight: "",
    height: "",
    goals: "",
    stravaConnected: false,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      setProfile({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        age: user.age?.toString() || "",
        weight: user.weight?.toString() || "",
        height: user.height?.toString() || "",
        goals: user.goals || "",
        stravaConnected: false,
      });
    }
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const updates = {
        firstName: profile.firstName,
        lastName: profile.lastName,
        name: `${profile.firstName} ${profile.lastName}`.trim(),
        age: profile.age ? parseInt(profile.age) : undefined,
        weight: profile.weight ? parseFloat(profile.weight) : undefined,
        height: profile.height ? parseInt(profile.height) : undefined,
        goals: profile.goals,
      };

      await updateProfile(updates);
      setIsEditing(false);
    } catch (error) {
      // Error handling is done in updateProfile
    } finally {
      setLoading(false);
    }
  };

  const handleStravaConnect = () => {
    setProfile(prev => ({ ...prev, stravaConnected: !prev.stravaConnected }));
    toast({
      title: profile.stravaConnected ? "Strava disconnected" : "Strava connected",
      description: profile.stravaConnected 
        ? "Your Strava account has been disconnected." 
        : "Ready to sync with Strava! (Integration coming soon)",
    });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
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
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Personal Information
                </CardTitle>
                {!isEditing ? (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                ) : (
                  <div className="space-x-2">
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleSave} disabled={loading}>
                      {loading ? "Saving..." : "Save"}
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={profile.firstName}
                    onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profile.lastName}
                    onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="bg-gray-50"
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={profile.age}
                    onChange={(e) => setProfile(prev => ({ ...prev, age: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    value={profile.weight}
                    onChange={(e) => setProfile(prev => ({ ...prev, weight: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={profile.height}
                    onChange={(e) => setProfile(prev => ({ ...prev, height: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="registrationDate">Registration Date</Label>
                  <Input
                    id="registrationDate"
                    value={formatDate(user?.registrationDate)}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
                <div>
                  <Label htmlFor="assignedCoach">Assigned Coach</Label>
                  <Input
                    id="assignedCoach"
                    value={user?.assignedCoach || "Not assigned"}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Training Goals & Integrations */}
          <div className="space-y-8">
            {/* Training Goals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Training Goals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="goals">Your Training Goal</Label>
                  <Textarea
                    id="goals"
                    placeholder="e.g., Run 10km under 50 minutes, Complete first half marathon..."
                    value={profile.goals}
                    onChange={(e) => setProfile(prev => ({ ...prev, goals: e.target.value }))}
                    disabled={!isEditing}
                    rows={3}
                    className={!isEditing ? "bg-gray-50" : ""}
                  />
                  {!profile.goals && !isEditing && (
                    <p className="text-sm text-gray-500 mt-2">No training goals set yet.</p>
                  )}
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
        </div>
      </main>
    </div>
  );
};

export default Profile;
