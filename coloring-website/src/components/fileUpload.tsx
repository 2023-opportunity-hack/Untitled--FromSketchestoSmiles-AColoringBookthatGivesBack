import React, { useState, useRef } from "react";
import { Button } from "@nextui-org/react";
import { storage } from "@/firebase/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";

type FileUploadProps = {
  currentEvent: string;
};

function FileUpload({ currentEvent }: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  let curFileName = "";

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

  return (
    <div>
      <input
        type="file"
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <Button onClick={handleBrowseClick}>Upload Scribble</Button>
    </div>
  );
}

export default FileUpload;
