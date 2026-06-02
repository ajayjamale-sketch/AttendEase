import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, LineChart, Users, Lock, Zap, Bell } from "lucide-react";

const Features = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const featureList = [
    {
      icon: Users,
      title: "Employee Management",
      description: "Centralized employee database with detailed profiles, contact information, and employment history.",
      highlights: ["Add/Edit employees", "Department management", "Role-based access"]
    },
    {
      icon: Bell,
      title: "Real-time Alerts",
      description: "Get instant notifications for attendance issues, late check-ins, and important events.",
      highlights: ["Instant notifications", "Custom alerts", "Multi-channel support"]
    },
    {
      icon: Lock,
      title: "Security",
      description: "Enterprise-grade security with role-based access control and data encryption.",
      highlights: ["End-to-end encryption", "Role-based access", "Audit logs"]
    },
    {
      icon: LineChart,
      title: "Advanced Analytics",
      description: "Comprehensive analytics and reporting tools to gain insights into attendance patterns.",
      highlights: ["Custom reports", "Data visualization", "Export capabilities"]
    },
    {
      icon: Zap,
      title: "Performance",
      description: "Lightning-fast performance with optimized database queries and caching.",
      highlights: ["Sub-second response", "Scalable architecture", "Real-time sync"]
    },
    {
      icon: CheckCircle2,
      title: "Compliance",
      description: "Stay compliant with labor laws and regulations with built-in compliance features.",
      highlights: ["Legal compliance", "Audit trail", "Policy enforcement"]
    },
  ];

  return (
    <div className="py-20 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">Powerful Features</h1>
          <p className="text-xl text-muted-foreground">Everything you need to manage attendance effectively</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {featureList.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Icon className="h-5 w-5 text-primary" />
                        {feature.title}
                      </CardTitle>
                    </div>
                  </div>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-16 p-8 bg-primary/10 rounded-lg border border-primary/20">
          <h2 className="text-2xl font-bold mb-4">Why Choose AttendEase?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-2">User-Friendly</h3>
              <p className="text-muted-foreground">Intuitive interface that requires minimal training</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Cost-Effective</h3>
              <p className="text-muted-foreground">Affordable pricing with flexible plans</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">24/7 Support</h3>
              <p className="text-muted-foreground">Round-the-clock customer support available</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
