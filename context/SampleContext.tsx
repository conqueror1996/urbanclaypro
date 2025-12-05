'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Sample = {
    id: string;
    name: string;
    color: string;
    texture: string; // CSS gradient or image url
};

interface SampleContextType {
    box: Sample[];
    addToBox: (sample: Sample) => void;
    removeFromBox: (id: string) => void;
    isInBox: (id: string) => boolean;
    clearBox: () => void;
    isBoxOpen: boolean;
    setBoxOpen: (open: boolean) => void;
}

const SampleContext = createContext<SampleContextType | undefined>(undefined);

export function SampleProvider({ children }: { children: ReactNode }) {
    const [box, setBox] = useState<Sample[]>([]);
    const [isBoxOpen, setBoxOpen] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('urbanclay_sample_box');
        if (saved) {
            try {
                setBox(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to load sample box", e);
            }
        }
    }, []);

    // Save to localStorage on change
    useEffect(() => {
        localStorage.setItem('urbanclay_sample_box', JSON.stringify(box));
    }, [box]);

    const addToBox = (sample: Sample) => {
        if (box.length < 4 && !box.find(s => s.id === sample.id)) {
            setBox([...box, sample]);
        }
        setBoxOpen(true); // Always open box when clicking add
    };

    const removeFromBox = (id: string) => {
        setBox(box.filter(s => s.id !== id));
    };

    const clearBox = () => {
        setBox([]);
    };

    const isInBox = (id: string) => {
        return !!box.find(s => s.id === id);
    };

    return (
        <SampleContext.Provider value={{ box, addToBox, removeFromBox, isInBox, clearBox, isBoxOpen, setBoxOpen }}>
            {children}
        </SampleContext.Provider>
    );
}

export function useSampleBox() {
    const context = useContext(SampleContext);
    if (context === undefined) {
        throw new Error('useSampleBox must be used within a SampleProvider');
    }
    return context;
}
