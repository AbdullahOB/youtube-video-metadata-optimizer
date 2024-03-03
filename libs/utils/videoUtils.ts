import fs from "fs";
import path from "path";
import ytdl from "ytdl-core";
export const downloadVideo = async (videoUrl: string): Promise<string> => {
  try {
    // ytdl core download and save to public folder
    const response = ytdl(videoUrl).pipe(
      fs.createWriteStream(path.join(process.cwd(), "public", "video.mp4"))
    );

    ytdl.getInfo(videoUrl).then((info) => {
      // get video title & video description and save it to metadata.json
      const metadata = {
        title: info.videoDetails.title,
        description: info.videoDetails.description,
      };
      fs.writeFileSync(
        path.join(process.cwd(), "public", "metadata.json"),
        JSON.stringify(metadata)
      );
    });

    return new Promise((resolve, reject) => {
      response.on("finish", () => {
        resolve(path.join(process.cwd(), "public", "video.mp4"));
      });

      response.on("error", (error) => {
        reject(error);
      });
    });
  } catch (error) {
    console.error("Error downloading video:", error);
    throw new Error("Failed to download video");
  }
};

export const getYtInfo = async (videoUrl: string) => {
  try {
    const info = await ytdl.getInfo(videoUrl);
    return info;
  } catch (error) {
    console.error("Error getting video info:", error);
    throw new Error("Failed to get video info");
  }
};
