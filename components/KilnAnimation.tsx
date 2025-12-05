'use client';

import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

export default function KilnAnimation() {
    const containerRef = useRef<HTMLDivElement>(null);
    const timelineGroupRef = useRef<SVGGElement>(null);
    const interactionGroupRef = useRef<SVGGElement>(null);

    const topFaceRef = useRef<SVGPathElement>(null);
    const leftFaceRef = useRef<SVGPathElement>(null);
    const rightFaceRef = useRef<SVGPathElement>(null);
    const edgeHighlightRef = useRef<SVGPathElement>(null);
    const sheenRef = useRef<SVGPathElement>(null);
    const shadowRef = useRef<SVGEllipseElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);
    const hazeRef = useRef<SVGFETurbulenceElement>(null);
    const textureRef = useRef<SVGFETurbulenceElement>(null);
    const sparksRef = useRef<SVGGElement>(null);
    const ashRef = useRef<SVGGElement>(null);
    const dustRef = useRef<SVGGElement>(null);
    const tempBarRef = useRef<HTMLDivElement>(null);
    const flameIconRef = useRef<HTMLDivElement>(null);
    const tempTextRef = useRef<HTMLDivElement>(null);
    const scrollHintRef = useRef<HTMLDivElement>(null);

    const [temp, setTemp] = useState(100);
    const [stageLabel, setStageLabel] = useState("RAW EARTH");
    const [scienceLabel, setScienceLabel] = useState<string | null>(null); // New Technical Label
    const [labelColor, setLabelColor] = useState("#78716c");
    const [isInteracting, setIsInteracting] = useState(false);

    // Hammer State
    const [showHammerTool, setShowHammerTool] = useState(false);
    const [hammerMode, setHammerMode] = useState(false);
    const [isCertified, setIsCertified] = useState(false); // New Certification State
    const [sparksData, setSparksData] = useState<Array<{ cx: number, delay: number, duration: number }>>([]);
    const [ashData, setAshData] = useState<Array<{ cx: number, r: number }>>([]);
    const [dustData, setDustData] = useState<Array<{ cx: number, cy: number, r: number, color: string }>>([]);

    useEffect(() => {
        setSparksData([...Array(12)].map(() => ({
            cx: 200 + Math.random() * 200,
            delay: Math.random() * 3,
            duration: 2 + Math.random() * 2
        })));
        setAshData([...Array(8)].map(() => ({
            cx: 150 + Math.random() * 300,
            r: Math.random() * 1.5 + 0.5
        })));
        setDustData([...Array(80)].map(() => ({
            cx: 0,
            cy: 0,
            r: Math.random() * 1.0 + 0.2, // Very small particles
            color: Math.random() > 0.5 ? '#a8a29e' : (Math.random() > 0.5 ? '#d6cbb8' : '#78716c')
        })));
    }, []);

    // --- REALISTIC CERAMIC AUDIO ENGINE ---
    const playClink = () => {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;

        const ctx = new AudioContext();
        const t = ctx.currentTime;

        const impactOsc = ctx.createOscillator();
        const impactGain = ctx.createGain();
        impactOsc.frequency.setValueAtTime(150, t);
        impactOsc.frequency.exponentialRampToValueAtTime(40, t + 0.1);
        impactGain.gain.setValueAtTime(0.8, t);
        impactGain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);
        impactOsc.connect(impactGain);
        impactGain.connect(ctx.destination);
        impactOsc.start(t);
        impactOsc.stop(t + 0.05);

        const frequencies = [2200, 4500, 6800];
        frequencies.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, t);
            const detune = (Math.random() - 0.5) * 50;
            osc.detune.setValueAtTime(detune, t);
            gain.gain.setValueAtTime(0.15 / (i + 1), t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4 - (i * 0.1));
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(t);
            osc.stop(t + 0.5);
        });

        const bufferSize = ctx.sampleRate * 0.05;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.2, t);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);

        const filter = ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 3000;

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        noise.start(t);
    };

    // --- INTERACTION LOGIC ---
    const isDragging = useRef(false);
    const startPos = useRef({ x: 0, y: 0 });
    const clickStartTime = useRef(0);

    const handlePointerDown = (e: React.PointerEvent) => {
        isDragging.current = true;
        setIsInteracting(true);
        startPos.current = { x: e.clientX, y: e.clientY };
        clickStartTime.current = Date.now();
        (e.target as Element).setPointerCapture(e.pointerId);

        if (!hammerMode) {
            gsap.to(interactionGroupRef.current, { scale: 1.05, duration: 0.3, ease: "back.out(1.7)" });
            gsap.to(shadowRef.current, { scale: 0.9, opacity: 0.2, duration: 0.3 });
        } else {
            gsap.to(interactionGroupRef.current, { scale: 0.98, duration: 0.1, ease: "power1.out" });
        }
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDragging.current || !interactionGroupRef.current) return;

        if (!hammerMode) {
            const deltaX = e.clientX - startPos.current.x;
            const deltaY = e.clientY - startPos.current.y;

            const rotY = deltaX * 0.3;
            const rotX = -deltaY * 0.3;

            const clampedRotY = Math.max(-30, Math.min(30, rotY));
            const clampedRotX = Math.max(-30, Math.min(30, rotX));

            gsap.to(interactionGroupRef.current, {
                rotationY: clampedRotY,
                rotationX: clampedRotX,
                duration: 0.1,
                overwrite: 'auto'
            });
        }
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        const clickDuration = Date.now() - clickStartTime.current;
        const wasClick = clickDuration < 200;

        if (wasClick && hammerMode) {
            playClink();
            setIsCertified(true); // Award Certification on Hit

            gsap.to(interactionGroupRef.current, {
                x: () => Math.random() * 10 - 5,
                y: () => Math.random() * 10 - 5,
                duration: 0.05,
                repeat: 5,
                yoyo: true,
                onComplete: () => {
                    gsap.to(interactionGroupRef.current, { x: 0, y: 0, duration: 0.1 });
                }
            });

            if (sparksRef.current) {
                gsap.fromTo(sparksRef.current.children,
                    { opacity: 1, scale: 2 },
                    { opacity: 0, scale: 0, duration: 0.5, stagger: 0.02 }
                );
            }

            if (dustRef.current) {
                const dustParticles = Array.from(dustRef.current.children) as SVGElement[];

                // Reset positions to click center
                gsap.set(dustParticles, {
                    x: e.nativeEvent.offsetX,
                    y: e.nativeEvent.offsetY,
                    scale: 0,
                    opacity: 0
                });

                dustParticles.forEach((particle) => {
                    const angle = Math.random() * Math.PI * 2;
                    // Cloud-like spread
                    const velocity = Math.random() * 30 + 5;
                    const dx = Math.cos(angle) * velocity;
                    const dy = Math.sin(angle) * velocity - (Math.random() * 15); // Slight upward drift

                    // Burst phase
                    gsap.to(particle, {
                        x: `+=${dx}`,
                        y: `+=${dy}`,
                        scale: Math.random() * 1 + 0.5,
                        opacity: Math.random() * 0.6 + 0.2,
                        duration: 0.2,
                        ease: "power2.out"
                    });

                    // Drift & Fade phase
                    gsap.to(particle, {
                        x: `+=${dx * 0.5}`, // Continue drifting
                        y: `-=${Math.random() * 20 + 10}`, // Float up
                        opacity: 0,
                        duration: Math.random() * 1.5 + 1,
                        delay: 0.1,
                        ease: "power1.out"
                    });
                });
            }
        }

        isDragging.current = false;
        setIsInteracting(false);
        (e.target as Element).releasePointerCapture(e.pointerId);

        gsap.to(interactionGroupRef.current, {
            rotationY: 0,
            rotationX: 0,
            scale: 1,
            duration: 1.2,
            ease: "elastic.out(1, 0.3)"
        });

        gsap.to(shadowRef.current, { scale: 1, opacity: 1, duration: 1.2, ease: "elastic.out(1, 0.3)" });
    };

    useEffect(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "+=300%",
                    scrub: 1,
                    pin: true,
                    anticipatePin: 1,
                    onUpdate: (self) => {
                        const p = self.progress;
                        let t = 100;

                        if (p < 0.2) t = 100 + (p / 0.2) * 300;
                        else if (p < 0.4) t = 400 + ((p - 0.2) / 0.2) * 300;
                        else if (p < 0.6) t = 700 + ((p - 0.4) / 0.2) * 200;
                        else if (p < 0.8) t = 900 + ((p - 0.6) / 0.2) * 200;
                        else t = 1100 + ((p - 0.8) / 0.2) * 100;
                        setTemp(Math.round(t));

                        // --- SCIENCE LABELS LOGIC ---
                        if (t < 200) setScienceLabel("H₂O Evaporation");
                        else if (t > 550 && t < 600) setScienceLabel("Quartz Inversion");
                        else if (t > 850 && t < 950) setScienceLabel("Carbon Burnout");
                        else if (t > 1050) setScienceLabel("Vitrification");
                        else setScienceLabel(null);

                        if (p < 0.2) {
                            setStageLabel("RAW EARTH");
                            setLabelColor("#78716c");
                            setShowHammerTool(false);
                            setIsCertified(false);
                            setHammerMode(false);
                        } else if (p < 0.45) {
                            setStageLabel("DEHYDRATION");
                            setLabelColor("#d97706");
                            setShowHammerTool(false);
                            setIsCertified(false);
                            setHammerMode(false);
                        } else if (p < 0.75) {
                            setStageLabel("OXIDATION");
                            setLabelColor("#ea580c");
                            setShowHammerTool(false);
                            setIsCertified(false);
                            setHammerMode(false);
                        } else {
                            setStageLabel("VITRIFICATION");
                            setLabelColor("#9a3412");
                            setShowHammerTool(true);
                        }
                    }
                }
            });

            const stages = {
                raw: { top: '#e5e7eb', left: '#9ca3af', right: '#4b5563' },
                beige: { top: '#fef3c7', left: '#fde68a', right: '#b45309' },
                salmon: { top: '#ffedd5', left: '#fb923c', right: '#c2410c' },
                terracotta: { top: '#fdba74', left: '#ea580c', right: '#7c2d12' },
                burnt: { top: '#c2410c', left: '#9a3412', right: '#451a03' }
            };

            gsap.set(topFaceRef.current, { fill: stages.raw.top });
            gsap.set(leftFaceRef.current, { fill: stages.raw.left });
            gsap.set(rightFaceRef.current, { fill: stages.raw.right });
            gsap.set(edgeHighlightRef.current, { strokeOpacity: 0 });
            gsap.set(sheenRef.current, { opacity: 0 });

            tl.to(topFaceRef.current, { fill: stages.beige.top, duration: 1 }, 0);
            tl.to(leftFaceRef.current, { fill: stages.beige.left, duration: 1 }, 0);
            tl.to(rightFaceRef.current, { fill: stages.beige.right, duration: 1 }, 0);

            tl.to(topFaceRef.current, { fill: stages.salmon.top, duration: 1 }, 1);
            tl.to(leftFaceRef.current, { fill: stages.salmon.left, duration: 1 }, 1);
            tl.to(rightFaceRef.current, { fill: stages.salmon.right, duration: 1 }, 1);

            tl.to(topFaceRef.current, { fill: stages.terracotta.top, duration: 1 }, 2);
            tl.to(leftFaceRef.current, { fill: stages.terracotta.left, duration: 1 }, 2);
            tl.to(rightFaceRef.current, { fill: stages.terracotta.right, duration: 1 }, 2);

            tl.to(topFaceRef.current, { fill: stages.burnt.top, duration: 1 }, 3);
            tl.to(leftFaceRef.current, { fill: stages.burnt.left, duration: 1 }, 3);
            tl.to(rightFaceRef.current, { fill: stages.burnt.right, duration: 1 }, 3);

            tl.to(edgeHighlightRef.current, { strokeOpacity: 1, stroke: '#ea580c', duration: 1 }, 3);

            tl.to(timelineGroupRef.current, { scale: 1.05, duration: 4, ease: "power1.inOut" }, 0);

            tl.to(sheenRef.current, { opacity: 0.4, duration: 1.5, ease: "power2.in" }, 2.5);
            tl.to(shadowRef.current, { rx: 280, ry: 60, fillOpacity: 0.4, duration: 4 }, 0);
            tl.to(hazeRef.current, { attr: { baseFrequency: 0.015 }, duration: 4, ease: "power1.inOut" }, 0);
            tl.to(glowRef.current, { opacity: 0.8, scale: 1.6, backgroundColor: '#fb923c', duration: 4 }, 0);

            tl.to(textureRef.current, { attr: { baseFrequency: 3.0 }, duration: 4, ease: "power1.inOut" }, 0);

            tl.to(tempBarRef.current, { height: '100%', backgroundColor: '#ef4444', duration: 4, ease: "none" }, 0);
            gsap.to(flameIconRef.current, { opacity: 1, scale: 1.1, duration: 1, repeat: -1, yoyo: true, ease: "sine.inOut" });

            tl.to(scrollHintRef.current, { opacity: 0, duration: 0.5 }, 0);

        }, containerRef);

        return () => ctx.revert();
    }, []);

    // Separate effect for dynamic particles (Sparks & Ash)
    useEffect(() => {
        if (!containerRef.current || sparksData.length === 0) return;

        const ctx = gsap.context(() => {
            if (sparksRef.current && sparksRef.current.children.length > 0) {
                const sparks = Array.from(sparksRef.current.children) as SVGElement[];
                sparks.forEach((spark, i) => {
                    const isForeground = i % 3 === 0;
                    const size = isForeground ? 1.5 : 0.8;

                    gsap.set(spark, { opacity: 0, y: 0, x: 0, scale: 0, fill: '#f97316' });

                    const duration = 2 + Math.random() * 2;

                    gsap.to(spark, {
                        y: -150 - Math.random() * 100,
                        x: `+=${Math.random() * 40 - 20}`,
                        duration: duration,
                        repeat: -1,
                        delay: Math.random() * 3,
                        ease: "power1.out",
                        onRepeat: () => {
                            gsap.set(spark, { x: 0, y: 0, opacity: 0, scale: 0, fill: '#f97316' });
                        }
                    });

                    gsap.to(spark, {
                        keyframes: [
                            { opacity: 1, scale: size, duration: duration * 0.1 },
                            { opacity: 0.8, scale: size * 0.8, duration: duration * 0.5 },
                            { opacity: 0, scale: 0, duration: duration * 0.4 }
                        ],
                        repeat: -1,
                        delay: Math.random() * 3,
                    });

                    gsap.to(spark, {
                        keyframes: [
                            { fill: '#f97316', duration: duration * 0.1 },
                            { fill: '#ef4444', duration: duration * 0.3 },
                            { fill: '#78716c', duration: duration * 0.3 },
                            { fill: '#44403c', duration: duration * 0.3 }
                        ],
                        repeat: -1,
                        delay: Math.random() * 3,
                    });
                });
            }

            if (ashRef.current && ashRef.current.children.length > 0) {
                gsap.to(ashRef.current.children, {
                    y: -200,
                    x: () => Math.random() * 60 - 30,
                    opacity: 0,
                    rotation: () => Math.random() * 360,
                    stagger: { each: 0.4, repeat: -1 },
                    duration: 6,
                    ease: "linear"
                });
            }
        }, containerRef);

        return () => ctx.revert();
    }, [sparksData, ashData, dustData]);

    useEffect(() => {
        if (temp % 100 === 0 && tempTextRef.current) {
            gsap.fromTo(tempTextRef.current, { scale: 1.2, color: '#ef4444' }, { scale: 1, color: '#4b5563', duration: 0.5 });
        }
    }, [temp]);

    const hammerCursorBase64 = `url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNlYTU4MGMiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMTUgMTJsLTguNSA4LjVjLS44My44My0yLjE3LjgzLTMgMCAwIDAgMCAwIDAgMGEyLjEyIDIuMTIgMCAwIDEgMC0zTDEyIDkiLz48cGF0aCBkPSJNMTcuNjQgMTVMMjIgMTAuNjQiLz48cGF0aCBkPSJNMjAuOTEgMTEuN2wtMS4yNS0xLjI1Yy0uNi0uNi0uOTMtMS40LS45My0yLjI1VjNoLTZ2NS4yYzAgLjg1LS4zMyAxLjY1LS45MyAyLjI1TDEwLjY0IDExLjcuLz48L3N2Zz4=') 2 22, crosshair`;

    return (
        <section
            ref={containerRef}
            className="relative h-screen w-full overflow-hidden bg-[#f5f0eb] flex items-center justify-center perspective-1000"
            style={{ cursor: hammerMode ? hammerCursorBase64 : 'default' }}
        >
            <svg className="absolute w-0 h-0">
                <defs>
                    <filter id="heatDistortion" x="-20%" y="-20%" width="140%" height="140%">
                        <feTurbulence ref={hazeRef} type="fractalNoise" baseFrequency="0.005" numOctaves="2" result="noise" />
                        <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" />
                    </filter>

                    <filter id="noiseTexture">
                        <feTurbulence ref={textureRef} type="fractalNoise" baseFrequency="2.0" numOctaves="4" />
                        <feColorMatrix type="saturate" values="0" />
                        <feComponentTransfer>
                            <feFuncA type="linear" slope="0.4" />
                        </feComponentTransfer>
                    </filter>

                    <filter id="dofBlur">
                        <feGaussianBlur stdDeviation="0.8" />
                    </filter>

                    <mask id="brickMask">
                        <path d="M100 120 L450 80 L500 100 L500 160 L150 200 L100 180 Z" fill="white" />
                    </mask>

                    <linearGradient id="sheenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="white" stopOpacity="0.8" />
                        <stop offset="50%" stopColor="white" stopOpacity="0" />
                        <stop offset="100%" stopColor="white" stopOpacity="0" />
                    </linearGradient>
                </defs>
            </svg>

            <div ref={glowRef} className="absolute w-[600px] h-[300px] rounded-full bg-orange-300/30 blur-[80px] opacity-0 pointer-events-none" />

            <div className="w-full max-w-3xl px-4 md:px-0 aspect-[3/2] relative z-10" style={{ perspective: '1000px' }}>
                <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 600 400"
                    className={`drop-shadow-2xl overflow-visible transition-all duration-200 ${isInteracting ? (hammerMode ? 'scale-95' : 'scale-105') : ''} ${!hammerMode ? 'cursor-grab active:cursor-grabbing' : ''}`}
                    preserveAspectRatio="xMidYMid meet"
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerLeave={handlePointerUp}
                    style={{
                        touchAction: 'pan-y',
                        cursor: hammerMode ? hammerCursorBase64 : undefined
                    }}
                >
                    <ellipse ref={shadowRef} cx="300" cy="280" rx="250" ry="50" fill="#000" fillOpacity="0.1" filter="url(#dofBlur)" />

                    <g ref={timelineGroupRef} className="will-change-transform" style={{ transformOrigin: 'center center' }}>
                        <g ref={interactionGroupRef} className="will-change-transform" style={{ transformOrigin: 'center center' }}>
                            <g filter="url(#heatDistortion)">
                                <path ref={topFaceRef} d="M100 120 L450 80 L500 100 L150 140 Z" fill="#d1d5db" />
                                <path ref={rightFaceRef} d="M500 100 L500 160 L150 200 L150 140 Z" fill="#6b7280" />
                                <path ref={leftFaceRef} d="M100 120 L150 140 L150 200 L100 180 Z" fill="#9ca3af" />

                                <g mask="url(#brickMask)" style={{ mixBlendMode: 'multiply', opacity: 0.5 }}>
                                    <rect x="0" y="0" width="600" height="300" filter="url(#noiseTexture)" />
                                </g>

                                <path ref={sheenRef} d="M100 120 L450 80 L500 100 L150 140 Z" fill="url(#sheenGradient)" style={{ mixBlendMode: 'screen' }} />
                                <path ref={edgeHighlightRef} d="M100 120 L450 80 L500 100 L150 140 M150 140 L150 200 M500 100 L500 160" fill="none" stroke="white" strokeWidth="1" strokeOpacity="0" />
                            </g>
                        </g>
                    </g>

                    <g ref={sparksRef}>
                        {sparksData.map((spark, i) => (
                            <circle
                                key={`spark-${i}`}
                                cx={spark.cx}
                                cy={160}
                                r={i % 3 === 0 ? 1.5 : 0.8}
                                fill="#f97316"
                                opacity="0"
                                filter={i % 3 === 0 ? "url(#dofBlur)" : "none"}
                                className="pointer-events-none"
                            />
                        ))}
                    </g>

                    <g ref={ashRef}>
                        {ashData.map((ash, i) => (
                            <circle key={`ash-${i}`} cx={ash.cx} cy={220} r={ash.r} fill="#44403c" opacity="0.4" className="pointer-events-none" />
                        ))}
                    </g>

                    <g ref={dustRef}>
                        {dustData.map((dust, i) => (
                            <circle
                                key={`dust-${i}`}
                                cx={0}
                                cy={0}
                                r={dust.r}
                                fill={dust.color}
                                opacity="0"
                                className="pointer-events-none"
                            />
                        ))}
                    </g>
                </svg>
            </div>

            {/* CERTIFIED STAMP */}
            <AnimatePresence>
                {isCertified && (
                    <motion.div
                        initial={{ opacity: 0, scale: 2, rotate: -20 }}
                        animate={{ opacity: 1, scale: 1, rotate: -10 }}
                        className="absolute top-1/4 left-1/2 -translate-x-1/2 z-40 pointer-events-none"
                    >
                        <div className="border-4 border-orange-600 text-orange-600 px-6 py-2 font-black text-4xl uppercase tracking-widest opacity-80 mix-blend-multiply" style={{ fontFamily: 'stencil, sans-serif' }}>
                            Certified
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* SCIENCE LABELS */}
            <div className="absolute top-32 left-0 w-full flex justify-center pointer-events-none">
                <AnimatePresence>
                    {scienceLabel && (
                        <motion.div
                            key={scienceLabel}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-black/5 backdrop-blur-sm px-4 py-1 rounded-full border border-black/10"
                        >
                            <span className="font-mono text-xs text-gray-600 font-medium tracking-tight">
                                ▲ {scienceLabel}
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* HAMMER TOOL TOGGLE */}
            <AnimatePresence>
                {showHammerTool && !isCertified && (
                    <div className="absolute bottom-32 z-30 flex flex-col items-center gap-3">

                        <motion.button
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                boxShadow: "0 0 0 0 rgba(234, 88, 12, 0.7)"
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            onClick={() => setHammerMode(!hammerMode)}
                            className={`px-8 py-3 rounded-full font-serif tracking-widest uppercase text-sm font-bold transition-all flex items-center gap-2 ${hammerMode
                                ? 'bg-orange-600 text-white shadow-lg ring-4 ring-orange-200'
                                : 'bg-white text-gray-800 shadow-md hover:shadow-xl border border-orange-100'
                                }`}
                            style={{
                                cursor: 'pointer',
                                animation: !hammerMode ? 'pulse-orange 2s infinite' : 'none'
                            }}
                        >
                            <span className="text-lg">🔨</span>
                            {hammerMode ? 'Tap Brick to Test' : 'Test Strength'}
                        </motion.button>
                        <style jsx>{`
                            @keyframes pulse-orange {
                                0% { box-shadow: 0 0 0 0 rgba(234, 88, 12, 0.4); }
                                70% { box-shadow: 0 0 0 10px rgba(234, 88, 12, 0); }
                                100% { box-shadow: 0 0 0 0 rgba(234, 88, 12, 0); }
                            }
                        `}</style>
                    </div>
                )}
            </AnimatePresence>

            {/* SHOP CTA (Replaces Hammer Tool after Certification) */}
            <AnimatePresence>
                {isCertified && (
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute bottom-32 z-30 px-8 py-3 rounded-full bg-gray-900 text-white font-serif tracking-widest uppercase text-sm font-bold shadow-xl hover:bg-black transition-all"
                        style={{ cursor: 'pointer' }}
                        onClick={() => window.location.href = '/products'}
                    >
                        View Collection
                    </motion.button>
                )}
            </AnimatePresence>

            {/* SCROLL HINT */}
            <AnimatePresence>
                {!showHammerTool && !isCertified && (
                    <motion.div
                        ref={scrollHintRef}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.6 }}
                        exit={{ opacity: 0 }}
                        className="absolute bottom-32 flex flex-col items-center gap-2 animate-bounce pointer-events-none"
                    >
                        <span className="text-xs tracking-widest uppercase text-gray-500">Scroll to Fire</span>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
                            <path d="M7 13L12 18L17 13M7 6L12 11L17 6" />
                        </svg>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4 z-20 scale-75 md:scale-100 origin-right pointer-events-none">
                <div ref={flameIconRef} className="text-orange-500 opacity-50">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C12 2 6 8 6 13C6 16.3137 8.68629 19 12 19C15.3137 19 18 16.3137 18 13C18 8 12 2 12 2ZM12 22C7.02944 22 3 17.9706 3 13C3 7 12 0.5 12 0.5C12 0.5 21 7 21 13C21 17.9706 16.9706 22 12 22Z" />
                    </svg>
                </div>
                <div className="relative w-1.5 h-64 bg-gray-300 rounded-full overflow-hidden">
                    <div ref={tempBarRef} className="absolute bottom-0 left-0 w-full bg-gray-400 rounded-full" style={{ height: '0%' }} />
                </div>
                <div ref={tempTextRef} className="font-mono text-sm font-bold text-gray-600 w-16 text-center transition-colors">
                    {temp}°C
                </div>
            </div>

            <div className="absolute bottom-12 text-center z-20 h-10 overflow-hidden pointer-events-none">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={stageLabel}
                        initial={{ opacity: 0, y: 20, color: labelColor }}
                        animate={{ opacity: 1, y: 0, color: labelColor }}
                        exit={{ opacity: 0, y: -20, color: labelColor }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="font-serif tracking-[0.2em] text-lg uppercase font-bold"
                    >
                        {stageLabel}
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
}
