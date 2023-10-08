import { useState, useEffect } from "react";
import Slider from "react-slick";
import { Image } from "@nextui-org/react";
import { storage } from "@/firebase/config";
import { ref, listAll, getDownloadURL } from "firebase/storage";

// Import css files for slick carousel
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

type slickCarouseProps = {
  currentEvent: string;
};

function SlickCarousel({ currentEvent }: slickCarouseProps) {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  //get the filenames of the images in the currentEvent folder
  //for each filename, create an image component with the src being the url of the image in firebase storage
  //these images will be the slides in the carousel

  //the folderpath
  const folderRef = ref(storage, currentEvent);

  let settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
  };
  return (
    <Slider {...settings}>
      <div>
        <h3>1</h3>
      </div>
      <div>
        <h3>2</h3>
      </div>
      <div>
        <h3>3</h3>
      </div>
      <div>
        <h3>4</h3>
      </div>
      <div>
        <h3>5</h3>
      </div>
      <div>
        <h3>6</h3>
      </div>
    </Slider>
  );
}
