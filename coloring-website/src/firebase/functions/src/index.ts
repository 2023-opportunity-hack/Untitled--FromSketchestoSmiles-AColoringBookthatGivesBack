import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import Replicate from "replicate";

const rep = new Replicate({
  auth: process.env.REPLICATE_API_KEY,
});

export const getColoringPage = onRequest(
  { cors: true }, //change on deploy to match the domain
  async (request, response) => {
    const inputUrl = request.query.url as string;
    logger.info(`Calling Replicate for: ${inputUrl}`, { structuredData: true });
    const outputUrl = await callControlnet(inputUrl);
    response.send(outputUrl);
  }
);

async function callControlnet(url: string) {
  const output = await rep.run(
    "rossjillian/controlnet:795433b19458d0f4fa172a7ccf93178d2adb1cb8ab2ad6c8fdc33fdbcd49f477",
    {
      input: {
        image: url,
        prompt: "turn this image to a coloring page for kids",
        structure: "scribble",
      },
    }
  );
  return output;
}
