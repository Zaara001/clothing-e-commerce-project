import Header from "../component/common/Header";
import HeroSection from "../component/home/HeroSection";
import CategorySection from "../component/home/CategorySection";
import LatestArrivals from "../component/home/LatestArrivals.jsx";
import Services from "../component/home/Services";
import Footer from "../component/common/Footer";

const Home = () => {
  console.log("Home is rendering...");
  return (
    <div>
      <Header />
      <HeroSection />
      <CategorySection />
      <LatestArrivals />
      <Services />
      <Footer />
    </div>
  )
}

export default Home
