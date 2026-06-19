import DealsBanner from "../components/DealsBanner";
import FeaturedProucts from "../components/FeaturedProucts";
import OurCategories from "../components/OurCategories";
import PeomeBanner from "../components/PeomeBanner";
import Slider from "../components/Slider";

export default function HomeScreen() {
  return (
    <>
    <Slider/>
    <PeomeBanner/>
    <OurCategories/>
    <DealsBanner/>
    <FeaturedProucts/>
    </>
  )
}
