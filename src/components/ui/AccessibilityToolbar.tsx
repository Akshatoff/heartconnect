"use client";

import { useState } from "react";
import { Type, Palette, Zap, Mic, X } from "lucide-react";
import { useAccessibility } from "../providers/AccessibilityProvider";

/**
 * AccessibilityToolbar Component
 * Provides quick access to accessibility features:
 * - Font size adjustment
 * - High contrast mode
 * - Reduced motion
 * - Speech-to-text (placeholder for future implementation)
 */
export default function AccessibilityToolbar() {
  const { settings, updateSettings } = useAccessibility();
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const handleVoiceInput = () => {
    // Speech-to-text functionality (requires Web Speech API)
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        (window as any).webkitSpeechRecognition ||
        (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        const activeElement = document.activeElement as
          | HTMLInputElement
          | HTMLTextAreaElement;

        if (
          activeElement &&
          (activeElement.tagName === "INPUT" ||
            activeElement.tagName === "TEXTAREA")
        ) {
          activeElement.value += transcript;
          activeElement.dispatchEvent(new Event("input", { bubbles: true }));
        }

        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
        alert(
          "Speech recognition error. Please check your microphone permissions.",
        );
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert("Speech recognition is not supported in your browser.");
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-primary-600 text-white p-4 rounded-full shadow-lg hover:bg-primary-700 focus:ring-4 focus:ring-primary-300 transition-all"
        aria-label="Open accessibility toolbar"
        title="Accessibility Options"
      >
        <Zap className="w-6 h-6" />
      </button>

      {/* Toolbar panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-80 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Accessibility Options</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
              aria-label="Close accessibility toolbar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Font Size Control */}
          <div className="mb-4">
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <Type className="w-4 h-4" />
              Font Size
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => updateSettings({ fontSize: "normal" })}
                className={`flex-1 px-3 py-2 rounded border ${
                  settings.fontSize === "normal"
                    ? "bg-primary-600 text-white border-primary-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                } focus:ring-2 focus:ring-primary-500`}
                aria-pressed={settings.fontSize === "normal"}
              >
                A
              </button>
              <button
                onClick={() => updateSettings({ fontSize: "large" })}
                className={`flex-1 px-3 py-2 rounded border text-lg ${
                  settings.fontSize === "large"
                    ? "bg-primary-600 text-white border-primary-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                } focus:ring-2 focus:ring-primary-500`}
                aria-pressed={settings.fontSize === "large"}
              >
                A
              </button>
              <button
                onClick={() => updateSettings({ fontSize: "xlarge" })}
                className={`flex-1 px-3 py-2 rounded border text-xl ${
                  settings.fontSize === "xlarge"
                    ? "bg-primary-600 text-white border-primary-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                } focus:ring-2 focus:ring-primary-500`}
                aria-pressed={settings.fontSize === "xlarge"}
              >
                A
              </button>
            </div>
          </div>

          {/* High Contrast Toggle */}
          <div className="mb-4">
            <label className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm font-medium">
                <Palette className="w-4 h-4" />
                High Contrast
              </span>
              <button
                onClick={() =>
                  updateSettings({ highContrast: !settings.highContrast })
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  settings.highContrast ? "bg-primary-600" : "bg-gray-300"
                }`}
                role="switch"
                aria-checked={settings.highContrast}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.highContrast ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </label>
          </div>

          {/* Reduced Motion Toggle */}
          <div className="mb-4">
            <label className="flex items-center justify-between">
              <span className="text-sm font-medium">Reduce Motion</span>
              <button
                onClick={() =>
                  updateSettings({ reducedMotion: !settings.reducedMotion })
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  settings.reducedMotion ? "bg-primary-600" : "bg-gray-300"
                }`}
                role="switch"
                aria-checked={settings.reducedMotion}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.reducedMotion ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </label>
          </div>

          {/* Voice Input */}
          <button
            onClick={handleVoiceInput}
            disabled={isListening}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg ${
              isListening
                ? "bg-red-600 text-white"
                : "bg-primary-600 text-white hover:bg-primary-700"
            } focus:ring-2 focus:ring-primary-500 disabled:opacity-50 transition-colors`}
            aria-label={isListening ? "Listening..." : "Start voice input"}
          >
            <Mic className="w-4 h-4" />
            {isListening ? "Listening..." : "Voice Input"}
          </button>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Click and speak into any text field
          </p>
        </div>
      )}
    </>
  );
}
