"use client";

import { Button, Image } from "@nextui-org/react";
import { useState } from "react";
import FileUpload from "@/components/fileUpload";

export default function Home() {
  const [imageUrl, setImageUrl] = useState("Unset");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center pt-24 px-24 light text-foreground bg-background">
      <p className="text-5xl font-semibold py-6">
        Coloring Bookerize Any Image
      </p>
      {imageUrl === "Unset" ? (
        <FileUpload currentEvent="Test" />
      ) : (
        <div className="py-4">
          <Image
            src={imageUrl}
            width={512}
            height={512}
            radius="md"
            alt="Incorrect URL from API"
          />
          <Button color="secondary" onClick={() => setImageUrl("Unset")}>
            Reset Image URL
          </Button>
        </div>
      )}
    </main>
  );
}
