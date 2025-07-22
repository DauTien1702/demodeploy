import "./Carousel.css";
import { Carousel } from "antd";

function CarouselImage() {
  const contentStyle = {
    height: "500px",
    width: "100%",
    objectFit: "cover",
  };

  const images = [1, 2, 3, 4].map(
    (i) => `src/assets/img/banner/banner${i}.jpg`
  );

  return (
    <Carousel autoplay arrows infinite={true}>
      {images.map((images, index) => (
        <div className="carousel">
          <img key={index} style={contentStyle} src={images} />
        </div>
      ))}
    </Carousel>
  );
}

export default CarouselImage;
