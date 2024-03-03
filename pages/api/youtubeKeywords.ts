// pages/api/extractAudio.ts
import { NextApiRequest, NextApiResponse } from "next";
import { google } from "googleapis";
import { optimizeTags } from "@/libs/utils/optimizeMetadata";
export default async function YoutubeKeywordsChange(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { videoUrl } = req.body;

  const CLIENT_ID = process.env.YOUTUBE_CLIENT_ID;
  const CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET;
  const REFRESH_TOKEN = process.env.YOUTUBE_REFRESH_TOKEN;
  try {
    const oauth2Client = new google.auth.OAuth2(
      CLIENT_ID,
      CLIENT_SECRET,
      "http://localhost:3000/api/youtubeKeywords"
    );
    oauth2Client.setCredentials({
      refresh_token: REFRESH_TOKEN,
    });

    const youtube = google.youtube({
      version: "v3",
      auth: oauth2Client,
    });

    // get the video id from the url before &
    const videoId = videoUrl.split("v=")[1].split("&")[0];

    // get the existing title
    const videoResponse = await youtube.videos.list({
      part: ["snippet"],
      id: videoId,
    });

    const tags = videoResponse.data.items[0].snippet.tags;

    // Opimize Tags
    const chatCompletion = await optimizeTags(
      tags,
      videoResponse.data.items[0].snippet.title
    );

    await youtube.videos.update({
      part: ["snippet"],
      requestBody: {
        id: videoId,
        snippet: {
          title: videoResponse.data.items[0].snippet.title,
          categoryId: "22",
          tags: JSON.parse(chatCompletion).tags,
        },
      },
    });

    return res.status(200).json({
      newTags: JSON.parse(chatCompletion).tags.join(", "),
      oldTags: tags.join(", "),
    });
  } catch (error) {
    console.error("Error changing metadata:", error);
    res.status(500).json({ error: "Internal server error", message: error });
  }
}

// const checkMyLatest5Videos = async () => {
//   const CLIENT_ID = process.env.YOUTUBE_CLIENT_ID;
//   const CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET;
//   const REFRESH_TOKEN = process.env.YOUTUBE_REFRESH_TOKEN;
//   const oauth2Client = new google.auth.OAuth2(
//     CLIENT_ID,
//     CLIENT_SECRET,
//     "http://localhost:3000/api/youtubeKeywords"
//   );
//   oauth2Client.setCredentials({
//     refresh_token: REFRESH_TOKEN,
//   });

//   const youtube = google.youtube({
//     version: "v3",
//     auth: oauth2Client,
//   });

//   const response = await youtube.channels.list({
//     part: ["snippet"],
//     mine: true,
//   });

//   const playlistId = response.data.items[0].id;

//   const playlistItems = await youtube.playlistItems.list({
//     part: ["snippet"],
//     playlistId: "UU" + playlistId.slice(2),
//     maxResults: 5,
//   });

//   return playlistItems;
// };
// export { checkMyLatest5Videos };
