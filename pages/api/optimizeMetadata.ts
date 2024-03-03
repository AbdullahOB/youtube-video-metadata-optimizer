// pages/api/extractAudio.ts

import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from "fs";
import { getYtInfo } from "@/libs/utils/videoUtils";
import { optimizeMetadata } from "@/libs/utils/optimizeMetadata";
export default async function OptimizeMetaData(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { videoUrl } = req.body;

  try {
    //  get the youtube metadata
    getYtInfo(videoUrl).then(async (info) => {
      const metadata = {
        title: info.videoDetails.title,
        description: info.videoDetails.description,
      };
      const optimizedMetadata = await optimizeMetadata(metadata);
      const parsed = JSON.parse(optimizedMetadata as string);
      res.status(200).json({ metadata: parsed, oldMetadata: metadata });
    });
  } catch (error) {
    console.error("Error extracting audio:", error);
    res.status(500).json({ error: "Internal server error", message: error });
  }
}
