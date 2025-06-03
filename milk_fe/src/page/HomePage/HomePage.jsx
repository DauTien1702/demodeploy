import CarouselImage from "../../component/Carousel/Carousel";
import FeaturedBrands from "../../component/FeaturedBrands/FeaturedBrands";
import FeedbackSection from "../../component/FeedbackSection/FeedbackSection";
import HotProductSection from "../../component/HotProductSection/HotProductSection";
import NewsSection from "../../component/NewsSection/NewsSession";

export default function Homepage() {
  return (
    <div className="">
      {/* Carousel */}
      <CarouselImage></CarouselImage>

      {/* Sản phẩm hot */}
      <HotProductSection />
      <FeaturedBrands />
      <NewsSection />
      <FeedbackSection />
    </div>
  );
}
