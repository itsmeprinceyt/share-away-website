"use client";
import { useEffect, useRef, useState } from "react";

export default function AudioPlayer() {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(20);
    const [showVolume, setShowVolume] = useState(false);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume / 100;
        }
    }, [volume]);

    const togglePlay = async () => {
        const audio = audioRef.current;
        if (!audio) return;

        try {
            if (isPlaying) {
                audio.pause();
            } else {
                await audio.play();
            }
            setIsPlaying(!isPlaying);
        } catch (err) {
            console.error("Playback failed:", err);
        }
    };

    const toggleVolume = () => {
        setShowVolume(!showVolume);
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <div className="flex items-center gap-2 bg-white shadow-lg rounded-xl px-2 py-2 relative">
                <button
                    onClick={togglePlay}
                >
                    {isPlaying ? "🔇" : "🔊"}
                </button>

                <button
                    onClick={toggleVolume}
                >
                    {showVolume ? "🎵" : "🎶"}
                </button>

                <div
                    className={`-rotate-90 absolute bottom-12 -right-36 flex py-2  
                      ${showVolume ? "opacity-100 scale-100" : "opacity-0 scale-75 "}
                      transition-all duration-300 origin-bottom-left bg-white rounded-lg shadow px-2 py-1`}
                >
                    <input
                        type="range"
                        min={10}
                        max={100}
                        step={10}
                        value={volume}
                        onChange={(e) => setVolume(Number(e.target.value))}
                        className="h-2 cursor-pointer bg-gray-300 rounded-md appearance-auto accent-pink-500"
                    />
                </div>
                <audio ref={audioRef} src="/music/bg-music.mp3" loop preload="auto" />
            </div>
        </div>
    );
}
