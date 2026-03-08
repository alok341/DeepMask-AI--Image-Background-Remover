// pages/home.jsx
import BgRemovalSteps from "../components/BgRemovalSteps";
import BgSlider from "../components/BgSlider";
import Header from "../components/Header";
import Pricing from "../components/Pricing";
import Testimonials from "../components/Testimonials";

const Home = () => {
    return (
        <div className="font-['Outfit']">
            {/* Hero Section */}
            <Header />
            
            {/* Background removal steps section */}
            <BgRemovalSteps />
            
            {/* Background removal slide section */}
            <BgSlider />
            
            {/* Buy credits section */}
            <Pricing />
            
            {/* User testimonials section */}
            <Testimonials />
        </div>
    );
};

export default Home;