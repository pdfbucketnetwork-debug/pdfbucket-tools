"use client";
import { useState, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import { UploadCloud, FileAudio, FileVideo, Download, Loader2, Music } from "lucide-react";

export default function VideoToAudio() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [message, setMessage] = useState("Loading FFmpeg engine...");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const ffmpegRef = useRef(new FFmpeg());

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const ffmpeg = ffmpegRef.current;
      ffmpeg.on("progress", ({ progress }) => {
        setProgress(progress * 100);
      });
      ffmpeg.on("log", ({ message }) => {
        console.log(message);
      });
      
      // Use unpkg to load core since it's reliable for Next.js deployments
      await ffmpeg.load({
        coreURL: "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js",
        wasmURL: "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.wasm",
      });
      setIsLoaded(true);
      setMessage("");
    } catch (error) {
      console.error(error);
      setMessage("Failed to load FFmpeg engine. Please refresh.");
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "video/mp4": [".mp4"], "video/quicktime": [".mov"], "video/webm": [".webm"] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setFile(acceptedFiles[0]);
      setAudioUrl(null);
    },
  });

  const extractAudio = async () => {
    if (!file || !isLoaded) return;
    setIsProcessing(true);
    setProgress(0);
    setMessage("Extracting audio...");

    try {
      const ffmpeg = ffmpegRef.current;
      const inputName = "input" + file.name.substring(file.name.lastIndexOf("."));
      const outputName = "output.mp3";

      await ffmpeg.writeFile(inputName, await fetchFile(file));

      // Extract audio as 192kbps MP3
      await ffmpeg.exec(["-i", inputName, "-q:a", "0", "-map", "a", outputName]);

      const data = await ffmpeg.readFile(outputName);
      const url = URL.createObjectURL(new Blob([data as any], { type: "audio/mp3" }));
      
      setAudioUrl(url);
      setMessage("Extraction complete!");
    } catch (err) {
      console.error(err);
      setMessage("An error occurred during extraction.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isLoaded) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>
        <Loader2 className="animate-spin" style={{ margin: "0 auto 16px" }} size={32} />
        <p>{message}</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {!file ? (
        <div
          {...getRootProps()}
          style={{
            border: `2px dashed ${isDragActive ? "var(--accent)" : "var(--border)"}`,
            borderRadius: 16, padding: "64px 24px", textAlign: "center",
            background: isDragActive ? "var(--bg2)" : "var(--surface)",
            cursor: "pointer", transition: "all 0.2s"
          }}
        >
          <input {...getInputProps()} />
          <UploadCloud size={48} style={{ color: "var(--accent)", margin: "0 auto 16px" }} />
          <p style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>Drop a video file here</p>
          <p style={{ color: "var(--muted)", fontSize: 13 }}>Supports MP4, MOV, WEBM (Max 500MB)</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 16, border: "1px solid var(--border)", borderRadius: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ background: "var(--bg2)", padding: 10, borderRadius: 8 }}>
                <FileVideo size={24} color="var(--accent)" />
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: 14 }}>{file.name}</p>
                <p style={{ color: "var(--muted)", fontSize: 12 }}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            {!isProcessing && !audioUrl && (
              <button
                onClick={() => { setFile(null); setAudioUrl(null); }}
                style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 13 }}
              >
                Change
              </button>
            )}
          </div>

          {!audioUrl && (
            <button
              onClick={extractAudio}
              disabled={isProcessing}
              className="btn-primary"
              style={{ width: "100%", padding: 16, display: "flex", justifyContent: "center", alignItems: "center", gap: 8 }}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Processing ({progress.toFixed(0)}%)
                </>
              ) : (
                <>
                  <Music size={18} />
                  Extract MP3 Audio
                </>
              )}
            </button>
          )}

          {isProcessing && (
            <div style={{ background: "var(--bg2)", height: 8, borderRadius: 4, overflow: "hidden" }}>
              <div style={{ background: "var(--accent)", height: "100%", width: `${progress}%`, transition: "width 0.2s" }} />
            </div>
          )}

          {message && !isProcessing && <p style={{ textAlign: "center", color: "var(--muted)", fontSize: 14 }}>{message}</p>}

          {audioUrl && (
            <div style={{ padding: 24, border: "1px solid var(--accent)", borderRadius: 12, background: "rgba(108,99,255,0.05)", textAlign: "center" }}>
              <FileAudio size={48} color="var(--accent)" style={{ margin: "0 auto 16px" }} />
              <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Audio Extracted Successfully!</h3>
              <a
                href={audioUrl}
                download={file.name.replace(/\.[^/.]+$/, "") + ".mp3"}
                className="btn-primary"
                style={{ display: "inline-flex", textDecoration: "none", gap: 8, padding: "12px 24px" }}
              >
                <Download size={18} /> Download MP3
              </a>
              <button
                onClick={() => { setFile(null); setAudioUrl(null); }}
                style={{ display: "block", margin: "16px auto 0", background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 13, textDecoration: "underline" }}
              >
                Extract another file
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
