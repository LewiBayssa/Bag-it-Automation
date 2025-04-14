
import React, { useState } from "react";
import { BarcodeScanner } from "@/components/BarcodeScanner";
import { BaggingSystem } from "@/components/BaggingSystem";
import { BaggingGuide } from "@/components/BaggingGuide";
import { Toaster } from "@/components/ui/toaster";

const Index = () => {
  const [showBaggingSystem, setShowBaggingSystem] = useState(false);

  const handleScanComplete = () => {
    setShowBaggingSystem(true);
  };

  const handleReset = () => {
    setShowBaggingSystem(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-kroger-blue text-white p-4 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">Kroger Smart Bagger</h1>
          <div className="text-sm">Employee Training Tool</div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <div className="max-w-5xl mx-auto">
          {!showBaggingSystem ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <BarcodeScanner onScanComplete={handleScanComplete} />
              <BaggingGuide />
            </div>
          ) : (
            <BaggingSystem onReset={handleReset} />
          )}
        </div>
      </main>

      <footer className="bg-kroger-blue text-white p-4 mt-auto">
        <div className="container mx-auto text-center text-sm">
          <p>© 2025 Kroger Smart Bagger Training Tool</p>
        </div>
      </footer>

      <Toaster />
    </div>
  );
};

export default Index;
