import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface QRCodeDisplayProps {
  value: string;
  size?: number;
  className?: string;
  colorDark?: string;
  colorLight?: string;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  value,
  size = 140,
  className = '',
  colorDark = '#064e3b', // Deep green matching Algerian sports seal
  colorLight = '#ffffff'
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current && value) {
      QRCode.toCanvas(
        canvasRef.current,
        value,
        {
          width: size,
          margin: 1,
          color: {
            dark: colorDark,
            light: colorLight
          },
          errorCorrectionLevel: 'M'
        },
        (error) => {
          if (error) {
            console.error('Failed to generate QR Code:', error);
          }
        }
      );
    }
  }, [value, size, colorDark, colorLight]);

  return (
    <div className={`inline-flex flex-col items-center justify-center ${className}`}>
      <canvas ref={canvasRef} className="rounded-lg shadow-xs" />
    </div>
  );
};
