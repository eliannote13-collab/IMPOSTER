import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Unlock, Sparkles, Camera, RotateCcw, AlertTriangle } from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";
import { GameLayout } from "../components/layout/GameLayout";
import type { Category } from "../data/categories";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { useGame } from "../hooks/useGame";
import { useAudio } from "../hooks/useAudio";
import { validateCategoryCode } from "../utils/game/wordSelector";

export const ThemeCodePage: React.FC = () => {
  const navigate = useNavigate();
  const { categoryCode, setCategoryCode, startMatch, players } = useGame();
  const { playClick } = useAudio();

  const [scanning, setScanning] = useState(false);
  const [unlockedCategory, setUnlockedCategory] = useState<Category | null>(null);
  const [error, setError] = useState("");
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const stopPromiseRef = useRef<Promise<void> | null>(null);
  const isStabilizedRef = useRef<boolean>(false);

  // Route protection
  useEffect(() => {
    if (players.length < 3) {
      navigate("/players");
    }
  }, [players, navigate]);

  // Unified Scanner Lifecycle Effect
  useEffect(() => {
    let html5QrCode: Html5Qrcode | null = null;
    let isMounted = true;

    const initScanner = async () => {
      if (!scanning) return;

      // Check if the user is on a mobile device
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        typeof navigator !== "undefined" ? navigator.userAgent : ""
      );

      // Check if context is secure (HTTPS or localhost)
      if (typeof window !== "undefined" && !window.isSecureContext) {
        console.error("[Scanner] Context is not secure (HTTP). Camera access will be blocked by the browser.");
        if (isMounted) {
          setError("Não foi possível acessar a câmera. O navegador bloqueia o acesso à câmera em conexões não seguras (HTTP). Certifique-se de que a URL no navegador começa com 'https://' (e não 'http://').");
          setScanning(false);
        }
        return;
      }

      // Check if mediaDevices are available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error("[Scanner] navigator.mediaDevices.getUserMedia is not supported or context is insecure.");
        if (isMounted) {
          setError("Seu navegador ou dispositivo não oferece suporte para acesso à câmera, ou a conexão atual não é segura (HTTPS).");
          setScanning(false);
        }
        return;
      }

      try {
        console.log("[Scanner] Initializing fresh Html5Qrcode instance...");
        html5QrCode = new Html5Qrcode("reader");
        html5QrCodeRef.current = html5QrCode;
        console.log("[Scanner] Instance bound to DOM element #reader successfully.");

        isStabilizedRef.current = false;
        console.log("[Scanner] Starting camera stream. Resolution: 1080p, FPS: 20, waiting for stabilization...");

        try {
          console.log("[Scanner] Attempting to start camera with ideal 1080p constraints...");
          await html5QrCode.start(
            {
              facingMode: { ideal: "environment" },
              width: { ideal: 1920 },
              height: { ideal: 1080 }
            },
            {
              fps: 20,
              qrbox: (viewfinderWidth: number, viewfinderHeight: number) => {
                const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
                const qrboxSize = Math.floor(minEdge * 0.8);
                console.log(`[Scanner] Calculating dynamic qrbox size (ideal 1080p): ${qrboxSize}x${qrboxSize}`);
                return {
                  width: qrboxSize,
                  height: qrboxSize,
                };
              }
            },
            (decodedText) => {
              if (isMounted) {
                if (isStabilizedRef.current) {
                  console.log("[Scanner] Decode success (ideal 1080p):", decodedText);
                  handleDecodedText(decodedText);
                } else {
                  console.log("[Scanner] Frame decoded but ignored (ideal 1080p camera stabilizing/focusing)");
                }
              }
            },
            () => {
              // ignore verbose errors
            }
          );
        } catch (fallbackErr) {
          console.warn("[Scanner] Ideal 1080p constraints rejected. Trying standard environment camera...", fallbackErr);
          try {
            // Clean up the failed 1080p instance to avoid transition conflicts
            try {
              html5QrCode.clear();
            } catch (e) {
              console.warn("[Scanner] Error clearing instance after 1080p rejection:", e);
            }
            const container = document.getElementById("reader");
            if (container) container.innerHTML = "";

            // Create a fresh instance for fallback 1
            html5QrCode = new Html5Qrcode("reader");
            html5QrCodeRef.current = html5QrCode;

            // On mobile, enforce "environment" strictly. On desktop, keep it soft ("ideal").
            const fallbackConstraints = isMobile 
              ? { facingMode: "environment" } 
              : { facingMode: { ideal: "environment" } };

            await html5QrCode.start(
              fallbackConstraints,
              {
                fps: 20,
                qrbox: (viewfinderWidth: number, viewfinderHeight: number) => {
                  const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
                  const qrboxSize = Math.floor(minEdge * 10);
                  console.log(`[Scanner] Calculating dynamic qrbox size (fallback 1): ${qrboxSize}x${qrboxSize}`);
                  return {
                    width: qrboxSize,
                    height: qrboxSize,
                  };
                }
              },
              (decodedText) => {
                if (isMounted) {
                  if (isStabilizedRef.current) {
                    console.log("[Scanner] Decode success (fallback 1):", decodedText);
                    handleDecodedText(decodedText);
                  } else {
                    console.log("[Scanner] Frame decoded but ignored (fallback 1 camera stabilizing/focusing)");
                  }
                }
              },
              () => {
                // ignore verbose errors
              }
            );
          } catch (secondFallbackErr) {
            if (isMobile) {
              // On mobile, do not fallback to front camera (user). Propagate error.
              console.warn("[Scanner] Environment camera failed on mobile. Strict environment rule applied.", secondFallbackErr);
              throw secondFallbackErr;
            }

            console.warn("[Scanner] Environment camera rejected on desktop. Trying webcam/front camera...", secondFallbackErr);
            try {
              // Clean up the failed fallback 1 instance
              try {
                html5QrCode.clear();
              } catch (e) {
                console.warn("[Scanner] Error clearing instance after environment rejection:", e);
              }
              const container = document.getElementById("reader");
              if (container) container.innerHTML = "";

              // Create a fresh instance for fallback 2 (desktop/laptop compatibility)
              html5QrCode = new Html5Qrcode("reader");
              html5QrCodeRef.current = html5QrCode;

              await html5QrCode.start(
                { facingMode: "user" }, // Fallback to front camera / default webcam (has exactly 1 key to satisfy html5-qrcode)
                {
                  fps: 20,
                  qrbox: (viewfinderWidth: number, viewfinderHeight: number) => {
                    const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
                    const qrboxSize = Math.floor(minEdge * 0.8);
                    console.log(`[Scanner] Calculating dynamic qrbox size (fallback 2): ${qrboxSize}x${qrboxSize}`);
                    return {
                      width: qrboxSize,
                      height: qrboxSize,
                    };
                  }
                },
                (decodedText) => {
                  if (isMounted) {
                    if (isStabilizedRef.current) {
                      console.log("[Scanner] Decode success (fallback 2):", decodedText);
                      handleDecodedText(decodedText);
                    } else {
                      console.log("[Scanner] Frame decoded but ignored (fallback 2 camera stabilizing/focusing)");
                    }
                  }
                },
                () => {
                  // ignore verbose errors
                }
              );
            } catch (thirdFallbackErr) {
              // Throw third fallback error so the outer try/catch blocks and sets the appropriate UI error state
              throw thirdFallbackErr;
            }
          }
        }

        console.log("[Scanner] Video element ready and streaming.");

        // Wait 700ms for camera focus stabilization before accepting scan results
        setTimeout(() => {
          if (isMounted) {
            isStabilizedRef.current = true;
            console.log("[Scanner] Camera stabilized and autofocus ready. Active scanning enabled.");
          }
        }, 700);

      } catch (err: any) {
        console.error("[Scanner] Start error:", err);
        if (isMounted) {
          const errStr = String(err).toLowerCase();
          const errMsg = String(err.message || err).toLowerCase();
          if (
            errStr.includes("permission") ||
            errStr.includes("notallowed") ||
            errStr.includes("deny") ||
            errMsg.includes("permission") ||
            errMsg.includes("notallowed")
          ) {
            setError("Acesso à câmera bloqueado. Por favor, ative a permissão de câmera clicando no ícone de cadeado/configurações na barra de endereços do seu navegador.");
          } else {
            setError("Não foi possível acessar a câmera. Certifique-se de estar usando HTTPS e que a câmera não está em uso por outro aplicativo.");
          }
          setScanning(false);
        }
      }
    };

    if (scanning) {
      initScanner();
    }

    return () => {
      isMounted = false;
      if (html5QrCode) {
        const scanner = html5QrCode;
        html5QrCodeRef.current = null;
        
        const stopAndClear = async () => {
          console.log("[Scanner] Stop triggered");
          if (scanner.isScanning) {
            try {
              await scanner.stop();
              console.log("[Scanner] Stop complete");
            } catch (e) {
              console.warn("[Scanner] Stop on cleanup error:", e);
            }
          }
          try {
            scanner.clear();
            console.log("[Scanner] Cleanup complete (clear)");
          } catch (e) {
            console.warn("[Scanner] Clear on cleanup error:", e);
          }
          const container = document.getElementById("reader");
          if (container) {
            container.innerHTML = "";
          }
        };
        
        stopPromiseRef.current = stopAndClear();
      }
    };
  }, [scanning]);

  const startScanner = async () => {
    playClick();
    setError("");
    setUnlockedCategory(null);
    setCategoryCode("random");

    if (stopPromiseRef.current) {
      try {
        console.log("[Scanner] Waiting for previous scanner stop/clear promise to complete...");
        await stopPromiseRef.current;
      } catch (e) {
        console.warn("[Scanner] Error waiting for scanner stop:", e);
      }
      stopPromiseRef.current = null;
    }

    setScanning(true);
  };

  const stopScanner = () => {
    console.log("[Scanner] Stop scanner requested.");
    setScanning(false);
  };

  const handleDecodedText = (decodedText: string) => {
    // Attempt to extract any 4-digit numeric code in case they encoded a URL (e.g. imposter.com/theme/1091)
    const match = decodedText.match(/\d{4}/);
    const code = match ? match[0] : decodedText.trim();

    const matched = validateCategoryCode(code);
    if (matched) {
      setUnlockedCategory(matched);
      setCategoryCode(code);
      setError("");
      
      // Delay stopping the scanner by 200ms to allow the decode lifecycle to finish cleanly
      setTimeout(() => {
        stopScanner();
      }, 200);
    } else {
      setError(`Código detectado "${code}" não pertence a nenhuma categoria.`);
      
      setTimeout(() => {
        stopScanner();
      }, 200);
    }
  };

  const handleRandomSelect = () => {
    playClick();
    stopScanner();
    setUnlockedCategory(null);
    setError("");
    setCategoryCode("random");
  };

  const handleStart = () => {
    stopScanner();
    startMatch();
    navigate("/reveal");
  };

  const isRandom = categoryCode === "random" && !unlockedCategory;

  return (
    <GameLayout showScanner={true} accentColor="red">
      <div className="flex flex-col justify-between min-h-[75vh]">
        {/* Header */}
        <div className="text-center md:text-left mt-2">
          <h2 className="text-2xl font-mono font-black text-white tracking-widest uppercase">
            CÓDIGO DO TEMA
          </h2>
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">
            Escaneie o QR Code ou selecione aleatório
          </p>
        </div>

        {/* Action Grid */}
        <div className="flex flex-col gap-4 my-4">
          
          {/* Random Option Card */}
          <button
            onClick={handleRandomSelect}
            className="text-left w-full focus:outline-none cursor-pointer"
          >
            <Card
              variant={isRandom ? "red" : "dark"}
              glow={isRandom}
              grid={false}
              className={`py-3.5 px-4 border transition-all duration-300 ${
                isRandom
                  ? "border-cyber-red bg-cyber-red/5"
                  : "border-zinc-900 bg-zinc-950/20 hover:border-zinc-800"
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex gap-3 items-center">
                  <Sparkles size={16} className={isRandom ? "text-cyber-red" : "text-zinc-500"} />
                  <div>
                    <h4 className="font-mono text-sm font-bold text-white tracking-wide">
                      Seleção Aleatória
                    </h4>
                    <p className="text-[10px] text-zinc-500 font-sans mt-0.5">O sistema escolherá 1 dos 15 temas às cegas</p>
                  </div>
                </div>
                {isRandom && (
                  <span className="w-2.5 h-2.5 rounded-full bg-cyber-red shadow-[0_0_8px_#EF4444]" />
                )}
              </div>
            </Card>
          </button>

          {/* QR Code Scanner Card */}
          <Card variant={!isRandom ? "red" : "dark"} glow={!isRandom} className="relative overflow-hidden mt-1">
            <div className="flex flex-col gap-3">
              
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
                  Escanear QR Code
                </span>
                
                {unlockedCategory && (
                  <button 
                    onClick={startScanner}
                    className="flex items-center gap-1 text-[9px] font-bold text-cyber-red hover:underline focus:outline-none uppercase tracking-wider cursor-pointer"
                  >
                    <RotateCcw size={10} /> Escanear de novo
                  </button>
                )}
              </div>

              {/* Viewport Scanner Container */}
              <div className="relative w-full h-[220px] bg-black/80 rounded-xl border border-zinc-900 overflow-hidden flex flex-col items-center justify-center">
                
                {/* 1. Live Reader Container */}
                <div 
                  id="reader" 
                  className={`w-full h-full absolute inset-0 z-10 transition-opacity duration-300 ${
                    scanning ? "opacity-100" : "opacity-0 pointer-events-none"
                  }`} 
                />

                {/* 2. Scanner Laser Line HUD overlay */}
                {scanning && (
                  <div className="absolute inset-0 pointer-events-none z-20">
                    {/* Glowing Red Laser Line */}
                    <div className="absolute left-0 right-0 h-[2px] bg-cyber-red/80 shadow-[0_0_8px_#EF4444] animate-scanline pointer-events-none" />
                    
                    {/* Targeting Box corners decoration - matched dynamically to 176px (80% of 220px) */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[176px] h-[176px] pointer-events-none border border-cyber-red/20 flex flex-col justify-between p-0.5">
                      <div className="flex justify-between w-full pointer-events-none">
                        <div className="w-3.5 h-3.5 border-t-2 border-l-2 border-cyber-red pointer-events-none" />
                        <div className="w-3.5 h-3.5 border-t-2 border-r-2 border-cyber-red pointer-events-none" />
                      </div>
                      <div className="flex justify-between w-full pointer-events-none">
                        <div className="w-3.5 h-3.5 border-b-2 border-l-2 border-cyber-red pointer-events-none" />
                        <div className="w-3.5 h-3.5 border-b-2 border-r-2 border-cyber-red pointer-events-none" />
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Idle Camera State */}
                {!scanning && !unlockedCategory && (
                  <div className="flex flex-col items-center gap-3 px-4 text-center z-20">
                    <div className="p-3 bg-zinc-900/60 rounded-full border border-zinc-800 text-zinc-500">
                      <Camera size={26} />
                    </div>
                    <Button 
                      variant="red" 
                      size="sm" 
                      onClick={startScanner}
                      className="px-4"
                    >
                      Ativar Câmera
                    </Button>
                    <span className="text-[9px] text-zinc-600 font-sans tracking-wide">
                      Aponte a câmera traseira do celular para o código QR do tema
                    </span>
                  </div>
                )}

                {/* 4. Success Unlocked State */}
                {!scanning && unlockedCategory && (
                  <div className="flex flex-col items-center gap-2.5 text-center z-20 w-full px-4">
                    <div className="w-11 h-11 bg-green-500/10 border border-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-0.5">
                      <Unlock size={20} className="animate-pulse" />
                    </div>
                    <div className="flex flex-col items-center gap-1.5 w-full">
                      <h3 className="text-base font-mono font-black text-green-400 uppercase tracking-widest glow-text-red leading-tight">
                        Tema: {unlockedCategory.name}
                      </h3>
                      <p className="text-[10px] font-sans text-zinc-400 leading-relaxed max-w-[220px]">
                        <span className="font-mono text-zinc-500 font-semibold block uppercase tracking-wider text-[8px] mb-0.5">Descrição:</span>
                        {unlockedCategory.description}
                      </p>
                    </div>
                  </div>
                )}

                {/* 5. Error Block Overlay */}
                {error && !scanning && (
                  <div className="absolute inset-0 bg-black/95 z-30 flex flex-col items-center justify-center p-4 text-center gap-3">
                    <AlertTriangle className="text-cyber-red animate-bounce" size={28} />
                    <p className="text-xs font-mono font-bold text-cyber-red max-w-[200px] leading-relaxed">
                      {error}
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={startScanner}
                      className="text-[10px]"
                    >
                      Tentar Novamente
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Footer controls */}
        <div className="flex gap-4 mt-6">
          <Button
            variant="graphite"
            size="md"
            fullWidth={true}
            onClick={() => navigate("/time")}
          >
            <span className="flex items-center gap-2">
              <ArrowLeft size={16} />
              Voltar
            </span>
          </Button>

          <Button
            variant="red"
            size="md"
            fullWidth={true}
            onClick={handleStart}
          >
            <span>
              Iniciar Jogo
            </span>
          </Button>
        </div>
      </div>
    </GameLayout>
  );
};
export default ThemeCodePage;
