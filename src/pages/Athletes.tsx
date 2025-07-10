import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import Navigation from "@/components/Navigation";
import { Users, UserCheck, Clock, Calendar, Target, CheckCircle, XCircle, Route, BarChart3, MessageSquare, Tag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { coachService, AthleteWithStats } from "@/services/coachService";
import { AuthUser } from "@/services/authService";
import { Link } from "react-router-dom";

const Athletes = () => {
  const [athletes, setAthletes] = useState<AthleteWithStats[]>([]);
  const [pendingAthletes, setPendingAthletes] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [athletesData, pendingData] = await Promise.all([
          coachService.getAthletes(),
          coachService.getPendingAthletes()
        ]);
        setAthletes(athletesData);
        setPendingAthletes(pendingData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load athletes data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const handleApprove = async (athleteId: string) => {
    try {
      await coachService.approveAthlete(athleteId);
      setPendingAthletes(prev => prev.filter(a => a.id !== athleteId));
      toast({
        title: "Athlete approved",
        description: "The athlete has been approved and can now access the app."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve athlete",
        variant: "destructive"
      });
    }
  };

  const handleReject = async (athleteId: string) => {
    try {
      await coachService.rejectAthlete(athleteId);
      setPendingAthletes(prev => prev.filter(a => a.id !== athleteId));
      toast({
        title: "Athlete rejected",
        description: "The athlete registration has been rejected."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject athlete",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'on-track': return 'bg-green-500';
      case 'partially-completed': return 'bg-yellow-500';
      case 'missed-majority': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center pt-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Athletes Management</h1>
          <p className="text-gray-600">Manage your athletes and review registrations</p>
        </div>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Active Athletes ({athletes.length})</span>
            </TabsTrigger>
            <TabsTrigger value="pending" className="flex items-center space-x-2">
              <UserCheck className="h-4 w-4" />
              <span>Pending Approval ({pendingAthletes.length})</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {athletes.map((athlete) => (
                <Card key={athlete.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{athlete.name || `${athlete.firstName} ${athlete.lastName}`}</CardTitle>
                      <Badge variant="secondary">Athlete</Badge>
                    </div>
                    <p className="text-sm text-gray-600">{athlete.email}</p>
                    
                    {/* Tags */}
                    {athlete.tags && athlete.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {athlete.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {athlete.goals && (
                      <div className="flex items-start space-x-2">
                        <Target className="h-4 w-4 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Training Goal</p>
                          <p className="text-sm text-gray-600">{athlete.goals}</p>
                        </div>
                      </div>
                    )}
                    
                    {/* This Week Stats */}
                    {athlete.weeklyTrainingStats && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">This Week</p>
                          {athlete.progressIndicator && (
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                athlete.progressIndicator.status === 'on-track' ? 'text-green-600 border-green-200' :
                                athlete.progressIndicator.status === 'partially-completed' ? 'text-yellow-600 border-yellow-200' :
                                'text-red-600 border-red-200'
                              }`}
                            >
                              {athlete.progressIndicator.percentage}%
                            </Badge>
                          )}
                        </div>
                        
                        {/* Progress Bar */}
                        {athlete.progressIndicator && (
                          <div className="space-y-1">
                            <Progress 
                              value={athlete.progressIndicator.percentage} 
                              className={`h-2 ${getProgressColor(athlete.progressIndicator.status)}`}
                            />
                            <p className="text-xs text-gray-500">
                              {athlete.weeklyTrainingStats.completedTrainings}/{athlete.weeklyTrainingStats.plannedTrainings} planned trainings
                            </p>
                          </div>
                        )}
                        
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3 text-green-600" />
                            <span>{athlete.weeklyTrainingStats.totalTrainings} sessions</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3 text-blue-600" />
                            <span>{athlete.weeklyTrainingStats.totalDuration}min</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Route className="h-3 w-3 text-purple-600" />
                            <span>{athlete.weeklyTrainingStats.totalDistance}km</span>
                          </div>
                          <div className="text-xs text-gray-500">
                            Last: {athlete.weeklyTrainingStats.lastTrainingDate && formatDate(athlete.weeklyTrainingStats.lastTrainingDate)}
                          </div>
                        </div>

                        {/* Training Type Breakdown */}
                        {athlete.weeklyTrainingStats.typeBreakdown && (
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-gray-700">Training Types</p>
                            <div className="grid grid-cols-3 gap-1 text-xs">
                              {Object.entries(athlete.weeklyTrainingStats.typeBreakdown).map(([type, count]) => (
                                <span key={type} className="text-gray-600">
                                  {type}: {count}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Last Week Comparison */}
                    {athlete.lastWeekStats && (
                      <div className="border-t pt-3 space-y-2">
                        <p className="text-sm font-medium text-gray-700">Last Week</p>
                        <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
                          <div>
                            <span className="font-medium">{athlete.lastWeekStats.totalTrainings}</span>
                            <br />
                            <span>sessions</span>
                          </div>
                          <div>
                            <span className="font-medium">{athlete.lastWeekStats.totalDuration}min</span>
                            <br />
                            <span>time</span>
                          </div>
                          <div>
                            <span className="font-medium">{athlete.lastWeekStats.totalDistance}km</span>
                            <br />
                            <span>distance</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Action Buttons */}
                    <div className="pt-2 space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <Link to={`/athlete/${athlete.id}/profile`}>
                          <Button size="sm" variant="outline" className="w-full">
                            View Profile
                          </Button>
                        </Link>
                        <Link to={`/weekly-plan?athlete=${athlete.id}`}>
                          <Button size="sm" className="w-full">
                            <BarChart3 className="h-3 w-3 mr-1" />
                            View Plan
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="pending" className="space-y-6">
            {pendingAthletes.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Registrations</h3>
                  <p className="text-gray-600">All athlete registrations have been reviewed.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {pendingAthletes.map((athlete) => (
                  <Card key={athlete.id}>
                    <CardContent className="flex items-center justify-between p-6">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {athlete.name || `${athlete.firstName} ${athlete.lastName}`}
                            </h3>
                            <p className="text-sm text-gray-600">{athlete.email}</p>
                            <p className="text-xs text-gray-500">
                              Registered: {athlete.registrationDate && formatDate(athlete.registrationDate)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReject(athlete.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleApprove(athlete.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Athletes;