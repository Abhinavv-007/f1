"use client";

import { useRef, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Download, Share2, Loader2, X } from "lucide-react";
import driversData from "@/data/drivers.json";

interface ShareCardProps {
  prediction: {
    winner: string;
    p2: string;
    p3: string;
    fastestLap?: string;
    safetyCar?: boolean;
    winningMargin?: string;
    season: number;
    raceRound: number;
  };
  onClose?: () => void;
}

function getDriverName(id: string) {
  const driver = driversData.find((d) => d.code === id);
  return driver ? `${driver.firstName} ${driver.lastName}` : id;
}

export function ShareCard({ prediction, onClose }: ShareCardProps) {
  const { user } = useAuth();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsCapturing(true);
    try {
      // Dynamic import to avoid SSR issues
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(cardRef.current, { quality: 0.95, pixelRatio: 2 });
      const link = document.createElement("a");
      link.download = `trgt-r${prediction.raceRound}-prediction.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error("Screenshot failed:", e);
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative flex flex-col items-center gap-4 max-w-sm w-full">
        {/* Close Button */}
        {onClose && (
          <button onClick={onClose} className="absolute -top-4 -right-4 z-10 w-8 h-8 rounded-full bg-surface-deep border border-border-strong flex items-center justify-center hover:border-white transition-colors">
            <X className="w-4 h-4 text-white" />
          </button>
        )}

        {/* Share Card Visual */}
        <div
          ref={cardRef}
          className="w-full rounded-2xl overflow-hidden border border-trgt-crimson/30"
          style={{
            background: "linear-gradient(135deg, #0A0A0A 0%, #1a0000 100%)",
            fontFamily: "'Rubik', sans-serif",
          }}
        >
          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b border-white/10 flex items-center justify-between">
            <div>
              <div className="text-trgt-crimson text-[10px] uppercase tracking-[0.2em] font-bold mb-1">
                Round {prediction.raceRound} · {prediction.season}
              </div>
              <div className="text-white font-black text-xl uppercase tracking-tighter">
                My Race Prediction
              </div>
            </div>
            <div className="text-white font-black text-2xl tracking-tight opacity-80">TRGT</div>
          </div>

          {/* Podium Block */}
          <div className="px-6 py-5">
            <div className="flex items-end gap-3">
              {/* P2 */}
              <div className="flex-1 bg-white/5 rounded-xl p-3 flex flex-col items-center gap-1 border border-white/10">
                <span className="text-white/30 font-black text-2xl leading-none">P2</span>
                <span className="font-mono text-white text-xs">{getDriverName(prediction.p2)}</span>
              </div>
              {/* P1 */}
              <div className="flex-[1.3] bg-trgt-crimson/20 rounded-xl p-4 flex flex-col items-center gap-1 border border-trgt-crimson/50 -mt-3">
                <span className="text-trgt-crimson font-black text-3xl leading-none">P1</span>
                <span className="font-mono text-white text-sm font-bold">{getDriverName(prediction.winner)}</span>
              </div>
              {/* P3 */}
              <div className="flex-1 bg-white/5 rounded-xl p-3 flex flex-col items-center gap-1 border border-white/10">
                <span className="text-white/20 font-black text-xl leading-none">P3</span>
                <span className="font-mono text-white text-xs">{getDriverName(prediction.p3)}</span>
              </div>
            </div>
          </div>

          {/* Extra Data */}
          <div className="px-6 pb-5 grid grid-cols-2 gap-3">
            {prediction.fastestLap && (
              <div className="bg-purple-900/30 rounded-lg border border-purple-500/20 px-3 py-2">
                <div className="text-purple-400 text-[9px] uppercase tracking-widest font-bold mb-0.5">Fastest Lap</div>
                <div className="text-white font-mono text-xs">{getDriverName(prediction.fastestLap)}</div>
              </div>
            )}
            {prediction.winningMargin && (
              <div className="bg-white/5 rounded-lg border border-white/10 px-3 py-2">
                <div className="text-white/50 text-[9px] uppercase tracking-widest font-bold mb-0.5">Win Margin</div>
                <div className="text-white font-mono text-xs">{prediction.winningMargin}</div>
              </div>
            )}
            <div className="bg-yellow-900/20 rounded-lg border border-yellow-500/20 px-3 py-2">
              <div className="text-yellow-400 text-[9px] uppercase tracking-widest font-bold mb-0.5">Safety Car</div>
              <div className="text-white font-mono text-xs">{prediction.safetyCar ? "Yes" : "No"}</div>
            </div>
            <div className="bg-white/5 rounded-lg border border-white/10 px-3 py-2">
              <div className="text-white/50 text-[9px] uppercase tracking-widest font-bold mb-0.5">Predicted by</div>
              <div className="text-white font-mono text-xs truncate">{user?.displayName || "F1 Fan"}</div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 pb-4 flex items-center justify-between opacity-40">
            <span className="text-white text-[9px] uppercase tracking-widest">trgt.in</span>
            <span className="text-white text-[9px] uppercase tracking-widest">Target Every Lap</span>
          </div>
        </div>

        {/* Download Buttons */}
        <div className="flex gap-3 w-full">
          <button
            onClick={handleDownload}
            disabled={isCapturing}
            className="flex-1 h-12 rounded bg-trgt-crimson text-white font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2 hover:bg-trgt-crimson/80 transition-colors disabled:opacity-50"
          >
            {isCapturing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {isCapturing ? "Capturing..." : "Save Image"}
          </button>
          <button
            onClick={() => {
              const text = `My #F1 prediction for Round ${prediction.raceRound}: P1 ${getDriverName(prediction.winner)}, P2 ${getDriverName(prediction.p2)}, P3 ${getDriverName(prediction.p3)}. Lock yours at trgt.in 🏁`;
              if (navigator.share) {
                navigator.share({ text });
              } else {
                navigator.clipboard.writeText(text);
              }
            }}
            className="h-12 px-6 rounded bg-surface-deep border border-border-strong text-white font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2 hover:border-white/50 transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
