import fieldsImage from '../../assets/images/home-fields.png';
import AboutHero from './components/AboutHero';
import GoalsGrid from './components/GoalsGrid';
import ImpactSection from './components/ImpactSection';
import MissionCard from './components/MissionCard';
import VisionCard from './components/VisionCard';
import './AboutPage.css';
const AboutPage = () => {
  const pageStyle = {
    '--about-fields-image': `url(${fieldsImage})`
  };
  return <div className="about-page" id="about" style={pageStyle}>
      <AboutHero />
      <div className="about-page__content">
        <MissionCard />
        <div className="about-page__grid">
          <VisionCard />
          <GoalsGrid />
        </div>
        <ImpactSection />
      </div>
    </div>;
};
export default AboutPage;