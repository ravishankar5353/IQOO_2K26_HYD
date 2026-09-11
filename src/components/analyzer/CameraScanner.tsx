'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, RefreshCw, Upload, AlertTriangle, CheckCircle, Sparkles } from 'lucide-react';

interface CameraScannerProps {
  onCapture: (imageDataUrl: string) => void;
  onFallbackToUpload: () => void;
}

export default function CameraScanner({ onCapture, onFallbackToUpload }: CameraScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [isScanning, setIsScanning] = useState(false);
  const [capturedPreview, setCapturedPreview] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    setCameraError(null);
    try {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API is not supported on this device/browser.');
      }

      const newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
    } catch (err: any) {
      console.warn('Camera access denied or error:', err);
      setCameraError(
        err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError'
          ? 'Camera permission was denied. You can still upload a product screenshot or photo.'
          : 'Unable to start camera stream on this device. Using image upload fallback.'
      );
    }
  }, [facingMode]);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [startCamera]);

  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    setIsScanning(true);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setCapturedPreview(dataUrl);

      setTimeout(() => {
        setIsScanning(false);
        onCapture(dataUrl);
      }, 900);
    }
  };

  const handleRetake = () => {
    setCapturedPreview(null);
  };

  return (
    <div className="relative w-full max-w-lg mx-auto glass-panel rounded-3xl p-5 border border-white/10 overflow-hidden shadow-2xl">
      {/* Hidden canvas for snapshot */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Header bar */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Live AI Camera Scanner
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleFacingMode}
            className="p-1.5 rounded-xl bg-surface-200/80 hover:bg-surface-300 text-slate-300 transition-colors"
            title="Switch Camera"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={onFallbackToUpload}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-surface-200/80 hover:bg-surface-300 text-slate-300 text-xs font-semibold transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload</span>
          </button>
        </div>
      </div>

      {/* Viewfinder frame */}
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center border border-white/10">
        {cameraError ? (
          <div className="p-6 text-center space-y-3 max-w-sm">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-foreground">Camera Unavailable</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {cameraError}
            </p>
            <button
              onClick={onFallbackToUpload}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 mx-auto"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Product Photo Instead</span>
            </button>
          </div>
        ) : capturedPreview ? (
          <div className="relative w-full h-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={capturedPreview}
              alt="Captured Product"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center text-center p-4">
              <Sparkles className="w-8 h-8 text-emerald-400 animate-spin mb-2" />
              <p className="text-sm font-black text-white">AI Analyzing Frame...</p>
              <p className="text-xs text-emerald-300">Extracting product features & price tags</p>
            </div>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />

            {/* Target Reticle Overlay */}
            <div className="absolute inset-8 border-2 border-emerald-400/40 rounded-2xl pointer-events-none flex flex-col justify-between p-3">
              <div className="flex justify-between">
                <div className="w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
                <div className="w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
              </div>
              <div className="relative w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent scanner-laser" />
              <div className="flex justify-between">
                <div className="w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
                <div className="w-4 h-4 border-b-2 border-r-2 border-emerald-400" />
              </div>
            </div>

            <div className="absolute bottom-3 left-0 right-0 text-center pointer-events-none">
              <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-semibold text-white/90 border border-white/10">
                Align product or price tag inside the frame
              </span>
            </div>
          </>
        )}
      </div>

      {/* Bottom Controls */}
      {!cameraError && !capturedPreview && (
        <div className="mt-4 flex items-center justify-center">
          <button
            onClick={handleCapture}
            disabled={isScanning}
            className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 p-1 flex items-center justify-center shadow-lg shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all group"
            aria-label="Capture Product"
          >
            <div className="w-full h-full rounded-full border-2 border-slate-950 bg-white/20 flex items-center justify-center group-hover:bg-white/30">
              <Camera className="w-7 h-7 text-slate-950 stroke-[2.5]" />
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
