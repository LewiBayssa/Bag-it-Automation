
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface BarcodeScannerProps {
  onScanComplete: () => void;
}

export function BarcodeScanner({ onScanComplete }: BarcodeScannerProps) {
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast({
        title: "Error",
        description: "Please upload a barcode image first",
        variant: "destructive",
      });
      return;
    }

    // In a real app, we would process the barcode image here
    // For now, we'll just simulate a successful scan
    toast({
      title: "Barcode scanned successfully",
      description: `Scanned barcode from file: ${file.name}`,
    });
    
    onScanComplete();
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white">
      <CardHeader className="bg-kroger-blue text-white rounded-t-lg">
        <CardTitle className="text-center">Scan Product Barcode</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="barcode">Upload Barcode Image</Label>
            <Input
              id="barcode"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="border-kroger-blue"
            />
          </div>
          {file && (
            <div className="text-sm text-green-600">
              File selected: {file.name}
            </div>
          )}
        </form>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSubmit}
          className="w-full bg-kroger-blue hover:bg-blue-800"
        >
          Submit Barcode
        </Button>
      </CardFooter>
    </Card>
  );
}
