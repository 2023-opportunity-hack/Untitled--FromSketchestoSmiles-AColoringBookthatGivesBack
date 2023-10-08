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
      curFileName = file.name + v4(); //might need to save this seperately to an atom or similar
      const imageRef = ref(storage, currentEvent + "/" + curFileName);
      uploadBytes(imageRef, file).then((snapshot) => {
        console.log("Uploaded the image file!");
      });
      //get the firebase download url of what was just uploaded
      getDownloadURL(imageRef).then((url) => {
        console.log("Download URL: " + url);
        // call the getColoringPage cloud function with the url
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
