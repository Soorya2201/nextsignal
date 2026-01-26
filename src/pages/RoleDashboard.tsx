import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Radio, Upload, Users, AlertTriangle, CheckCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo.png";

interface StatusCounts {
  inPremises: number;
  evacuating: number;
  needHelp: number;
}

export default function RoleDashboard() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { role } = useUserRole();
  const [statusCounts, setStatusCounts] = useState<StatusCounts>({
    inPremises: 0,
    evacuating: 0,
    needHelp: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatusCounts = async () => {
      if (!user) return;

      try {
        // Fetch all profiles and count by status
        const { data, error } = await supabase
          .from("profiles")
          .select("crisis_status");

        if (error) throw error;

        const counts = {
          inPremises: 0,
          evacuating: 0,
          needHelp: 0,
        };

        data?.forEach((profile) => {
          if (profile.crisis_status === "safe") counts.inPremises++;
          else if (profile.crisis_status === "evacuating") counts.evacuating++;
          else if (profile.crisis_status === "danger") counts.needHelp++;
        });

        setStatusCounts(counts);
      } catch (error) {
        console.error("Error fetching status counts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatusCounts();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  const dashboardTitle = role === "rescuer" ? "Rescuer Dashboard" : "Management Dashboard";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <img src={logo} alt="Next Signal" className="w-10 h-10" />
            <div>
              <h1 className="font-display font-bold text-lg text-foreground">{dashboardTitle}</h1>
              <p className="text-xs text-muted-foreground capitalize">{role} Portal</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleSignOut}>
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Status Overview */}
        <section>
          <h2 className="text-lg font-display font-semibold text-foreground mb-4">Status Overview</h2>
          <div className="grid grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-status-safe/20 to-status-safe/5 border-status-safe/30">
              <CardContent className="pt-6 text-center">
                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-status-safe" />
                <div className="text-3xl font-bold text-status-safe">
                  {loading ? "..." : statusCounts.inPremises}
                </div>
                <div className="text-sm text-muted-foreground">In Premises</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-status-evacuating/20 to-status-evacuating/5 border-status-evacuating/30">
              <CardContent className="pt-6 text-center">
                <Users className="w-8 h-8 mx-auto mb-2 text-status-evacuating" />
                <div className="text-3xl font-bold text-status-evacuating">
                  {loading ? "..." : statusCounts.evacuating}
                </div>
                <div className="text-sm text-muted-foreground">Evacuating</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-status-danger/20 to-status-danger/5 border-status-danger/30">
              <CardContent className="pt-6 text-center">
                <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-status-danger" />
                <div className="text-3xl font-bold text-status-danger">
                  {loading ? "..." : statusCounts.needHelp}
                </div>
                <div className="text-sm text-muted-foreground">Need Help</div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Broadcast Section */}
        <section>
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary to-accent pb-6">
              <CardTitle className="text-primary-foreground flex items-center gap-2">
                <Radio className="w-5 h-5" />
                Emergency Broadcast
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-muted-foreground mb-4">
                Send critical updates to all residents via the Next Signal chatbot. Messages will be delivered as high-priority notifications.
              </p>
              <Button
                onClick={() => navigate("/broadcast")}
                className="w-full h-14 text-lg font-semibold gradient-primary border-0"
              >
                <Radio className="w-5 h-5 mr-2" />
                Create Broadcast
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Blueprint Upload (Management only) */}
        {role === "management" && (
          <section>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Floor Plans & Blueprints
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Upload building blueprints to help mark fire exits and evacuation routes for residents.
                </p>
                <Button variant="outline" className="w-full h-12">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Blueprint
                </Button>
              </CardContent>
            </Card>
          </section>
        )}
      </main>
    </div>
  );
}
