import { Card, CardContent } from "@/components/ui/card";
import { UserCheck, Clock } from "lucide-react";

const PendingApprovalScreen = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardContent className="text-center py-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-yellow-100 rounded-full">
              <UserCheck className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Account Pending Approval
          </h2>
          
          <p className="text-gray-600 mb-6">
            Your account has been created and is awaiting coach approval. 
            You'll receive an email once it's activated.
          </p>
          
          <div className="flex items-center justify-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-2" />
            <span>This usually takes 24-48 hours</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PendingApprovalScreen;