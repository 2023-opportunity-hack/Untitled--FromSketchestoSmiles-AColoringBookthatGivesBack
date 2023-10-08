import React, { useState, useRef, useEffect } from "react";
import { Button } from "@nextui-org/react";
import { storage } from "@/firebase/config";
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { v4 } from "uuid";
import { Image } from "@nextui-org/react";

// Import css files for slick carousel
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

type FileUploadProps = {
  currentEvent: string;
};

function FileUpload({ currentEvent }: FileUploadProps) {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  let curFileName = "";

  const folderRef = ref(storage, currentEvent);
  //for each file within the folder, get the download url and add it to the imageUrls array
  useEffect(() => {
    const getImages = async () => {
      const images = await listAll(folderRef);
      let curImageUrls: string[] = [];
      for (const image of images.items) {
        const url = await getDownloadURL(image);
        curImageUrls.push(url);
      }
      //if the imageUrls  has generated_ in it, then it is a generated image and should be added to the carousel
      //otherwise it is the original image and should not be added to the carousel
      const generatedImages = curImageUrls.filter((url) =>
        url.includes("generated_")
      );

      setImageUrls(generatedImages);
    };
    getImages();
  }, []);
  console.log(imageUrls);

  // Function to handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      //check that file is an image (check that it is a png, jpg as file extension)
      if (
        file.type !== "image/png" &&
        file.type !== "image/jpg" &&
        file.type !== "image/jpeg"
      ) {
        alert("Please upload an image file (png, jpg, jpeg)");
        return;
      }
      setSelectedFile(file);
      console.log(file);
      //swap any spaces in the file name with underscores
      const processedFileName = file.name.replace(/\s/g, "_");
      curFileName = v4() + "-" + processedFileName; //might need to save this seperately to an atom or similar
      const imageRef = ref(storage, currentEvent + "/" + curFileName);
      uploadBytes(imageRef, file).then((snapshot) => {
        console.log("Uploaded the image file!");
        getDownloadURL(imageRef).then((url) => {
          console.log("Download URL: " + encodeURIComponent(url));
          // call the getColoringPage cloud function with the url
          const cloudFunctionURL =
            "https://getcoloringpage-qh5ng7mv3q-uc.a.run.app?url=" +
            encodeURIComponent(url);
          console.log("Cloud function URL: " + cloudFunctionURL);
          fetch(cloudFunctionURL)
            .then((response) => response.json())
            .then((responseJson) => {
              const responseURL = responseJson[0];
              console.log("Cloud function response URL: " + responseURL);

              // Setup the ref to place the response image in Firebase Storage
              const responseImageRef = ref(
                storage,
                currentEvent + "/generated_" + curFileName
              );

              // Use fetch to download the image from the response URL
              fetch(responseURL)
                .then((response) => response.blob())
                .then((blob) => {
                  // Upload the blob to Firebase Storage
                  uploadBytes(responseImageRef, blob).then(
                    (responseSnapshot) => {
                      console.log("Uploaded generated image file!");

                      //add the url of the generated image to the imageUrls array
                      setImageUrls((prevImageUrls) => [
                        ...prevImageUrls,
                        responseURL,
                      ]);
                    }
                  );
                });
            })
            .catch((error) => {
              console.error("Error calling cloud function: " + error);
            });
        });
      });
    }
  };

  // Function to trigger file input click
  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Ref to the file input element
  const fileInputRef = useRef<HTMLInputElement>(null);

  //code for the slider carousel
  let settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
  };
  return (
    <>
      <div className="flex-row flex pb-4">
        {imageUrls.map((url, index) => (
          <div key={index}>
            <Image height="512" width="512" src={url} alt={`Slide ${index}`} />
          </div>
        ))}
      </div>
      <div>
        <input
          type="file"
          style={{ display: "none" }}
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <Button onClick={handleBrowseClick}>Upload Scribble</Button>
      </div>
    </>
  );
}

export default FileUpload;
