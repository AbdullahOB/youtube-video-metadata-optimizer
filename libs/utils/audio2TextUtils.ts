import fs from "fs";
import path from "path";
import { AssemblyAI } from "assemblyai";

export default async function transcribeAudio() {
  try {
    // Start audio transcription
    const client = new AssemblyAI({
      apiKey: "47c7202c6a8f4b88ae5bc982055e0260",
    });

    // get file from public folder
    const FILE_URL = path.join(process.cwd(), "public", "audio.mp3");

    // Request parameters
    const data = {
      audio_url: FILE_URL,
    };

    const transcript = await client.transcripts.create(data);

    // Save the transcript to a file text
    const transcriptFilePath = path.join(
      process.cwd(),
      "public",
      "transcript.txt"
    );
    fs.writeFileSync(transcriptFilePath, transcript.text!);
  } catch (error) {}
}
