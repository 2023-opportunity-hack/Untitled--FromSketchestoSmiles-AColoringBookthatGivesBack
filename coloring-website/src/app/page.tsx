"use client";

import { Textarea, Button, Image } from "@nextui-org/react";
import { useState } from "react";

export default function Home() {
  const [imageUrl, setImageUrl] = useState("Unset");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center pt-24 px-24 dark text-foreground bg-background">
      <p className="text-5xl font-semibold py-6">
        Coloring Bookerize Any Image
      </p>
      {imageUrl === "Unset" ? (
        <Textarea
          isReadOnly
          variant="bordered"
          labelPlacement="outside"
          placeholder="Enter your description"
          defaultValue="Upload your image here"
          className="max-w-xs"
        />
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
