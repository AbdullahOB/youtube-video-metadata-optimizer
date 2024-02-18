// pages/api/extractAudio.ts

import { NextApiRequest, NextApiResponse } from "next";
import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs";
import { downloadVideo } from "@/libs/utils/videoUtils";
import transcribeAudio from "@/libs/utils/audio2TextUtils";
import { optimizeMetadata } from "@/libs/utils/optimizeMetadata";
export default async function extractAudio(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { videoUrl } = req.body;

  try {
    // Download the video file
    const videoFilePath = await downloadVideo(videoUrl);

    // Delete existing audio file if it exists
    const audioFilePath = path.join(process.cwd(), "public", "audio.mp3");
    if (fs.existsSync(audioFilePath)) {
      fs.unlinkSync(audioFilePath);
    }

    // Set the output file path for the audio
    const outputFilePath = path.join(process.cwd(), "public", "audio.mp3");

    // Extract audio from the video
    ffmpeg(videoFilePath)
      .output(outputFilePath)
      .on("end", async () => {
        // transcribeAudio
        await transcribeAudio();
        // Audio extraction completed
        // delete audio and video
        fs.unlinkSync(videoFilePath);
        fs.unlinkSync(outputFilePath);

        //public folder metadata.json
        const metadata = fs.readFileSync(
          path.join(process.cwd(), "public", "metadata.json"),
          "utf-8"
        ) as any;

        const transcript = fs.readFileSync(
          path.join(process.cwd(), "public", "transcript.txt"),
          "utf-8"
        );

        const optimized = await optimizeMetadata(metadata, transcript);

        res.status(200).json({ metadata: optimized });
      })
      .on("error", (err) => {
        console.error("Error extracting audio:", err);
        res
          .status(500)
          .json({ error: "Failed to extract audio", message: err.message });
      })
      .run();
  } catch (error) {
    console.error("Error extracting audio:", error);
    res.status(500).json({ error: "Internal server error", message: error });
  }
}
