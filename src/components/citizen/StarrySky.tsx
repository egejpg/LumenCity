import { useEffect, useRef } from "react";

interface StarrySkyProps {
  imageUrl: string;
  skyBox: { ymin: number; xmin: number; ymax: number; xmax: number } | null;
  visibleStars: { name: string; description: string }[];
}

export default function StarrySky({ imageUrl, skyBox, visibleStars }: StarrySkyProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const drawStars = () => {
      const width = containerRef.current?.clientWidth || 0;
      const height = containerRef.current?.clientHeight || 0;
      if (width === 0 || height === 0) return; // Modal animasyonu bitene kadar bekle

      canvas.width = width;
      canvas.height = height;

      ctx.clearRect(0, 0, width, height);

      const effectiveSkyBox = skyBox || { ymin: 0, xmin: 0, ymax: 50, xmax: 100 };

      // Yüzdelik skyBox'ı piksellere çevir
      const ymin = (effectiveSkyBox.ymin / 100) * height;
      const xmin = (effectiveSkyBox.xmin / 100) * width;
      const ymax = (effectiveSkyBox.ymax / 100) * height;
      const xmax = (effectiveSkyBox.xmax / 100) * width;
      
      const skyWidth = Math.max(xmax - xmin, 10);
      const skyHeight = Math.max(ymax - ymin, 10);

      // Gökyüzü alanına ufak bir karartma (ışık kirliliği filtresini kaldırma efekti)
      ctx.fillStyle = "rgba(10, 15, 30, 0.4)";
      ctx.fillRect(xmin, ymin, skyWidth, skyHeight);

      // Rastgele arka plan yıldızları serpiştir (Samanyolu efekti)
      const numRandomStars = 150;
      for (let i = 0; i < numRandomStars; i++) {
        const x = xmin + Math.random() * skyWidth;
        const y = ymin + Math.random() * skyHeight;
        const radius = Math.random() * 1.2;
        const alpha = Math.random() * 0.7 + 0.3;
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();
      }

      // Claude'dan dönen ana yıldızları/gezegenleri büyük ve parlayan şekilde çiz
      if (visibleStars && visibleStars.length > 0) {
        visibleStars.forEach((star) => {
          // Rastgele ama gökyüzü sınırları içinde bir yer seç
          const x = xmin + Math.random() * (skyWidth * 0.8) + (skyWidth * 0.1);
          const y = ymin + Math.random() * (skyHeight * 0.8) + (skyHeight * 0.1);
          
          // Parlama (Glow) efekti
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, 15);
          gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
          gradient.addColorStop(0.1, "rgba(251, 191, 36, 0.8)"); // amber-400
          gradient.addColorStop(1, "rgba(251, 191, 36, 0)");
          
          ctx.beginPath();
          ctx.arc(x, y, 15, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();

          // Yıldızın katı merkezi
          ctx.beginPath();
          ctx.arc(x, y, 2, 0, Math.PI * 2);
          ctx.fillStyle = "#fff";
          ctx.fill();

          // İsim etiketi
          ctx.font = "bold 11px sans-serif";
          ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
          ctx.shadowColor = "rgba(0, 0, 0, 1)";
          ctx.shadowBlur = 6;
          ctx.fillText(star.name, x + 10, y + 4);
          ctx.shadowBlur = 0; // diğer çizimleri etkilemesin
        });
      }
    };

    // İlk çizimi gecikmeli yap (Modal açılış animasyonunun bitmesini bekle)
    const timeout = setTimeout(drawStars, 150);

    // Veya boyut değiştiğinde tekrar çiz
    const resizeObserver = new ResizeObserver(() => {
      drawStars();
    });
    
    resizeObserver.observe(containerRef.current);

    return () => {
      clearTimeout(timeout);
      resizeObserver.disconnect();
    };
  }, [skyBox, visibleStars]);

  return (
    <div className="space-y-3 animate-slide-up">
      <div 
        ref={containerRef} 
        className="relative w-full h-44 rounded-2xl overflow-hidden border-2 border-indigo-500/50 shadow-lg shadow-indigo-500/20"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageUrl} alt="Sky" className="absolute inset-0 w-full h-full object-cover" />
        <canvas ref={canvasRef} className="absolute inset-0 z-10 pointer-events-none" />
        <div className="absolute top-2 left-2 z-20 bg-indigo-950/80 text-indigo-300 text-[10px] px-2.5 py-1 rounded-full border border-indigo-500/50 backdrop-blur-md flex items-center gap-1.5 font-medium">
          <span className="animate-pulse">✨</span> Işık Kirliliği Olmasaydı
        </div>
      </div>
    </div>
  );
}
