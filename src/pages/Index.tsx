import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import ChallengesSection from '@/components/ChallengesSection';
import SolutionsSection from '@/components/SolutionsSection';
import StatsSection from '@/components/StatsSection';
import RealTimeDataDashboard from '@/components/RealTimeDataDashboard';
import LiveFieldMonitor from '@/components/LiveFieldMonitor';
import FarmerSpotlight from '@/components/FarmerSpotlight';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <StatsSection />
      <RealTimeDataDashboard />
      <LiveFieldMonitor />
      <ChallengesSection />
      <SolutionsSection />
      <FarmerSpotlight />
    </div>
  );
};

export default Index;
