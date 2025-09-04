import Navigation from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Solutions = () => {
  const solutions = [
    {
      title: "Smart Irrigation Systems",
      description: "AI-powered irrigation that delivers precise water amounts based on real-time soil and weather data.",
      features: ["Soil moisture sensors", "Weather integration", "Mobile app control", "Water usage analytics"],
      savings: "Save up to 50% water",
      price: "Starting at $2,999",
      category: "Water Management"
    },
    {
      title: "Drone Monitoring Fleet",
      description: "Autonomous drone systems for comprehensive field monitoring, crop health analysis, and precision spraying.",
      features: ["4K imaging sensors", "Multispectral analysis", "GPS precision mapping", "Automated flight plans"],
      savings: "Increase yields by 35%",
      price: "Starting at $15,999",
      category: "Aerial Monitoring"
    },
    {
      title: "IoT Sensor Network",
      description: "Comprehensive field monitoring with wireless sensors for soil, weather, and crop conditions.",
      features: ["Real-time data collection", "Long-range connectivity", "Battery life 2+ years", "Cloud dashboard"],
      savings: "Reduce costs by 25%",
      price: "Starting at $899",
      category: "Data Collection"
    },
    {
      title: "AI Analytics Platform",
      description: "Machine learning platform that predicts optimal planting times, harvest schedules, and crop diseases.",
      features: ["Predictive analytics", "Disease detection", "Yield forecasting", "Market price integration"],
      savings: "Optimize planning",
      price: "Starting at $299/month",
      category: "Analytics"
    },
    {
      title: "Precision Farming Kit",
      description: "Complete variable rate application system for seeds, fertilizers, and pesticides with GPS guidance.",
      features: ["GPS-guided application", "Variable rate control", "Application mapping", "Input cost tracking"],
      savings: "Reduce inputs by 30%",
      price: "Starting at $8,999",
      category: "Precision Agriculture"
    },
    {
      title: "Greenhouse Automation",
      description: "Complete climate control and automation system for greenhouse operations.",
      features: ["Climate control", "Automated ventilation", "Nutrient delivery", "Growth optimization"],
      savings: "Boost productivity 40%",
      price: "Starting at $5,999",
      category: "Controlled Environment"
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-6">
          {/* Hero Section */}
          <div className="text-center mb-16 animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Our <span className="text-primary">Solutions</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Comprehensive agricultural technology solutions designed to transform your farming operations 
              and maximize both efficiency and sustainability.
            </p>
          </div>

          {/* Solutions Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {solutions.map((solution, index) => (
              <Card key={index} className="hover-lift animate-fade-in-scale group h-full flex flex-col">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-xs">{solution.category}</Badge>
                    <Badge className="hero-gradient text-white text-xs">{solution.savings}</Badge>
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {solution.title}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {solution.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="flex-1 flex flex-col">
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3 text-sm">Key Features:</h4>
                    <ul className="space-y-1">
                      {solution.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="text-sm text-muted-foreground flex items-center">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mt-auto">
                    <div className="text-2xl font-bold text-primary mb-4">{solution.price}</div>
                    <Button className="w-full">Learn More</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-12">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Farm?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of farmers who have already revolutionized their operations with our smart farming solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                Schedule a Demo
              </Button>
              <Button variant="outline" size="lg">
                Download Brochure
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Solutions;