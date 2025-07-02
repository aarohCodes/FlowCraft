import React, { useEffect, useRef, useCallback } from 'react';

interface Circle {
  x: number;
  y: number;
  dx: number;
  dy: number;
  radius: number;
  color: string;
  opacity: number;
  baseRadius: number; // Store original radius for scaling
}

export const BouncingCircles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const circlesRef = useRef<Circle[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced resize handler to prevent excessive recalculations
  const resizeTimeoutRef = useRef<NodeJS.Timeout>();

  const initializeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Get container dimensions
    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    // Set canvas size with device pixel ratio for crisp rendering
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    // Scale the canvas back down using CSS
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    
    // Scale the drawing context so everything draws at the correct size
    ctx.scale(dpr, dpr);

    return { width: rect.width, height: rect.height, ctx };
  }, []);

  const initializeCircles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Calculate base size relative to container dimensions
    const baseSize = Math.min(width, height);
    const scaleFactor = baseSize / 400; // Base scale factor

    const circles: Circle[] = [];
    const numCircles = Math.max(6, Math.min(12, Math.floor((width * height) / 15000))); // Responsive circle count
    
    // Vibrant colors that contrast well with gradient backgrounds
    const colors = [
      'rgba(255, 255, 255, 0.25)',     // white - high contrast
      'rgba(255, 215, 0, 0.3)',        // gold - warm and visible
      'rgba(255, 105, 180, 0.25)',     // hot pink - vibrant
      'rgba(0, 255, 255, 0.25)',       // cyan - bright and cool
      'rgba(255, 69, 0, 0.3)',         // red-orange - warm contrast
      'rgba(50, 205, 50, 0.25)',       // lime green - bright
      'rgba(255, 20, 147, 0.25)',      // deep pink - vibrant
      'rgba(255, 255, 255, 0.2)',      // semi-transparent white
      'rgba(255, 165, 0, 0.3)',        // orange - warm
      'rgba(173, 216, 230, 0.3)',      // light blue - soft contrast
      'rgba(255, 192, 203, 0.25)',     // pink - soft but visible
      'rgba(144, 238, 144, 0.25)',     // light green - fresh
    ];

    for (let i = 0; i < numCircles; i++) {
      const baseRadius = (Math.random() * 20 + 15) * scaleFactor; // Scale radius with container
      const maxSpeed = 0.5 * scaleFactor; // Scale speed with container
      
      circles.push({
        x: Math.random() * (width - baseRadius * 2) + baseRadius,
        y: Math.random() * (height - baseRadius * 2) + baseRadius,
        dx: (Math.random() - 0.5) * maxSpeed,
        dy: (Math.random() - 0.5) * maxSpeed,
        radius: baseRadius,
        baseRadius: baseRadius, // Store original for scaling
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.2 + 0.15, // Slightly higher opacity for better visibility
      });
    }
    
    circlesRef.current = circles;
  }, []);

  const updateCirclePositions = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    circlesRef.current.forEach((circle) => {
      // Update position
      circle.x += circle.dx;
      circle.y += circle.dy;

      // Bounce off edges with proper boundary checking
      if (circle.x + circle.radius >= width || circle.x - circle.radius <= 0) {
        circle.dx = -circle.dx;
        // Ensure circle stays within bounds
        circle.x = Math.max(circle.radius, Math.min(width - circle.radius, circle.x));
      }
      if (circle.y + circle.radius >= height || circle.y - circle.radius <= 0) {
        circle.dy = -circle.dy;
        // Ensure circle stays within bounds
        circle.y = Math.max(circle.radius, Math.min(height - circle.radius, circle.y));
      }
    });
  }, []);

  const drawCircles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    
    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);

    circlesRef.current.forEach((circle) => {
      // Draw main circle with enhanced visibility
      ctx.beginPath();
      ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
      ctx.fillStyle = circle.color;
      ctx.fill();

      // Draw enhanced glow effect for better visibility
      ctx.beginPath();
      ctx.arc(circle.x, circle.y, circle.radius * 1.3, 0, Math.PI * 2);
      const gradient = ctx.createRadialGradient(
        circle.x, circle.y, 0,
        circle.x, circle.y, circle.radius * 1.3
      );
      
      // Create a more pronounced glow with the same color
      const glowColor = circle.color.replace(/[\d.]+\)$/g, '0.1)'); // Reduce opacity for glow
      gradient.addColorStop(0, circle.color);
      gradient.addColorStop(0.7, glowColor);
      gradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = gradient;
      ctx.fill();

      // Add a subtle inner highlight for depth
      ctx.beginPath();
      ctx.arc(circle.x - circle.radius * 0.3, circle.y - circle.radius * 0.3, circle.radius * 0.4, 0, Math.PI * 2);
      const highlightColor = circle.color.replace(/[\d.]+\)$/g, '0.4)'); // Higher opacity for highlight
      ctx.fillStyle = highlightColor;
      ctx.fill();
    });
  }, []);

  const animate = useCallback(() => {
    updateCirclePositions();
    drawCircles();
    animationRef.current = requestAnimationFrame(animate);
  }, [updateCirclePositions, drawCircles]);

  const handleResize = useCallback(() => {
    // Clear existing timeout
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current);
    }

    // Debounce resize to prevent excessive recalculations
    resizeTimeoutRef.current = setTimeout(() => {
      const result = initializeCanvas();
      if (!result) return;

      const { width, height } = result;
      const baseSize = Math.min(width, height);
      const scaleFactor = baseSize / 400;

      // Update existing circles with new proportions
      circlesRef.current.forEach((circle) => {
        // Scale radius proportionally
        circle.radius = circle.baseRadius * scaleFactor;
        
        // Scale speed proportionally
        const currentSpeed = Math.sqrt(circle.dx * circle.dx + circle.dy * circle.dy);
        const newSpeed = Math.max(0.2, currentSpeed * scaleFactor);
        const angle = Math.atan2(circle.dy, circle.dx);
        circle.dx = Math.cos(angle) * newSpeed;
        circle.dy = Math.sin(angle) * newSpeed;

        // Ensure circles stay within new bounds
        circle.x = Math.max(circle.radius, Math.min(width - circle.radius, circle.x));
        circle.y = Math.max(circle.radius, Math.min(height - circle.radius, circle.y));
      });
    }, 100); // 100ms debounce
  }, [initializeCanvas]);

  useEffect(() => {
    const result = initializeCanvas();
    if (!result) return;

    initializeCircles();
    animate();

    // Set up resize observer for more efficient resize handling
    const resizeObserver = new ResizeObserver(handleResize);
    const container = containerRef.current;
    
    if (container) {
      resizeObserver.observe(container);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      if (container) {
        resizeObserver.unobserve(container);
      }
      resizeObserver.disconnect();
    };
  }, [initializeCanvas, initializeCircles, animate, handleResize]);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ 
          zIndex: 0,
          imageRendering: 'auto',
          // Ensure canvas maintains aspect ratio
          objectFit: 'cover'
        }}
      />
    </div>
  );
};