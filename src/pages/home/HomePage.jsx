import fieldsImage from '../../assets/images/home-fields.png';
import heroImage from '../../assets/images/home-hero.png';
import HeroSection from './components/HeroSection';
import QuickSearchBar from './components/QuickSearchBar';
import FeaturesSection from './components/FeaturesSection';
import HowItWorksSection from './components/HowItWorksSection';
import CallToAction from './components/CallToAction';
import './HomePage.css';
const HomePage = () => {
  const homeStyle = {
    '--home-fields-image': `url(${fieldsImage})`,
    '--home-hero-image': `url(${heroImage})`
  };
  return <div className="home-page" style={homeStyle}>
      <HeroSection />
      <QuickSearchBar />
      <FeaturesSection />
      <HowItWorksSection />
      <CallToAction />
    </div>;
};
export default HomePage;