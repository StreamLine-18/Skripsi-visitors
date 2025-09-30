import { useEffect, useRef } from "react";

interface QRCodeProps {
  value: string;
  size?: number;
  className?: string;
}

export default function QRCode({ value, size = 128, className = "" }: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Simple QR code pattern generator (for demo purposes)
    // In production, use a proper QR code library like 'qrcode'
    const gridSize = 21; // Standard QR code is 21x21 for version 1
    const cellSize = size / gridSize;
    
    canvas.width = size;
    canvas.height = size;

    // Clear canvas
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, size, size);

    // Generate a simple pattern based on the value
    ctx.fillStyle = "black";
    const pattern = generatePattern(value, gridSize);
    
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        if (pattern[y] && pattern[y][x]) {
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
      }
    }

  }, [value, size]);

  // Simple pattern generator (replace with actual QR code library)
  const generatePattern = (text: string, gridSize: number) => {
    const pattern: boolean[][] = Array(gridSize).fill(null).map(() => Array(gridSize).fill(false));
    
    // Add finder patterns (corner squares)
    addFinderPattern(pattern, 0, 0);
    addFinderPattern(pattern, gridSize - 7, 0);
    addFinderPattern(pattern, 0, gridSize - 7);
    
    // Add some data pattern based on text
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = ((hash << 5) - hash + text.charCodeAt(i)) & 0xffffffff;
    }
    
    // Fill some cells based on hash
    for (let i = 0; i < 50; i++) {
      const x = (hash + i * 7) % gridSize;
      const y = (hash + i * 11) % gridSize;
      if (x >= 8 && x < gridSize - 8 && y >= 8 && y < gridSize - 8) {
        pattern[y][x] = (hash + i) % 2 === 0;
      }
    }
    
    return pattern;
  };

  const addFinderPattern = (pattern: boolean[][], startX: number, startY: number) => {
    for (let y = 0; y < 7; y++) {
      for (let x = 0; x < 7; x++) {
        const shouldFill = (x === 0 || x === 6 || y === 0 || y === 6) || 
                          (x >= 2 && x <= 4 && y >= 2 && y <= 4);
        pattern[startY + y][startX + x] = shouldFill;
      }
    }
  };

  return (
    <div className={`inline-block ${className}`}>
      <canvas 
        ref={canvasRef}
        className="border border-gray-200 rounded-lg"
        style={{ width: size, height: size }}
      />
    </div>
  );
}
