import { useEffect } from "react";
import { ArrowRight, CheckCircle, Users, BarChart3, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const navigate = useNavigate();

  const features = [
    {
      icon: Users,
      title: "Employee Management",
      description: "Efficiently manage your employee database and information",
    },
    {
      icon: Clock,
      title: "Attendance Tracking",
      description: "Real-time attendance monitoring and tracking system",
    },
    {
      icon: BarChart3,
      title: "Advanced Reports",
      description: "Generate detailed reports and analytics",
    },
  ];

  return (
    <div className="bg-gradient-to-b from-background to-secondary">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
            Welcome to AttendEase
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Streamline your attendance management with our powerful, easy-to-use platform
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" onClick={() => navigate("/login")}>
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/features")}>
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="p-6 rounded-lg border border-border hover:border-primary transition-all hover:shadow-lg">
                  <Icon className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 text-center bg-primary text-primary-foreground">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-lg mb-8 opacity-90">
            Join thousands of organizations using AttendEase to manage attendance
          </p>
          <Button size="lg" variant="secondary" onClick={() => navigate("/login")}>
            Sign Up Now
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
