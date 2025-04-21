
import React, { useState, useEffect } from "react";
import { Bag as BagComponent } from "./Bag";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Bag, BagSystem, Item } from "@/types";
import { ITEMS } from "@/data/items";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/components/ui/use-toast";
import * as LucideIcons from "lucide-react";
import { ScanBarcode, Upload } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface BaggingSystemProps {
  onReset: () => void;
}

// Set the maximum items per bag
const ITEMS_PER_BAG = 5;

export function BaggingSystem({ onReset }: BaggingSystemProps) {
  const [system, setSystem] = useState<BagSystem>({
    bags: [
      { id: uuidv4(), name: "Bag 1", items: [] },
      { id: uuidv4(), name: "Bag 2", items: [] },
      { id: uuidv4(), name: "Bag 3", items: [] }
    ],
    currentItemIndex: 0,
    totalItems: ITEMS.length
  });
  
  const { toast } = useToast();
  const currentItem = ITEMS[system.currentItemIndex];

  // Determine which bag to place the item in
  const chooseOptimalBag = (item: Item, bags: Bag[]): number => {
    // This is a simplified algorithm for demonstration
    // A real implementation would be more sophisticated
    
    // Try to group similar categories together
    for (let i = 0; i < bags.length; i++) {
      const bag = bags[i];
      
      // Don't put chemicals with food
      if (item.category.includes("chemical")) {
        // Check if the bag already has chemicals or is empty
        if (
          (bag.items.some(i => i.category.includes("chemical")) || bag.items.length === 0) &&
          bag.items.length < ITEMS_PER_BAG
        ) {
          return i;
        }
      }
      
      // Group cold items together
      if (item.category.includes("cold")) {
        if (
          bag.items.some(i => i.category.includes("cold")) &&
          bag.items.length < ITEMS_PER_BAG
        ) {
          return i;
        }
      }
      
      // Group produce or meat together
      if (item.category.includes("produce") || item.category.includes("meat")) {
        if (
          bag.items.some(i => i.category.includes("produce") || i.category.includes("meat")) &&
          bag.items.length < ITEMS_PER_BAG
        ) {
          return i;
        }
      }
    }
    
    // If no specific rule applies, find the bag with least items and room
    let idx = bags.reduce(
      (minIdx, bag, idx, arr) =>
        bag.items.length < arr[minIdx].items.length && bag.items.length < ITEMS_PER_BAG ? idx : minIdx,
      0
    );
    // If found bag has space, use it
    if (bags[idx].items.length < ITEMS_PER_BAG) {
      return idx;
    }
    // All bags are full - will add new bag
    return -1;
  };

  const placeNextItem = () => {
    if (system.currentItemIndex >= system.totalItems) {
      toast({
        title: "All items processed",
        description: "There are no more items to bag",
      });
      return;
    }

    const item = { ...ITEMS[system.currentItemIndex], id: uuidv4() };
    let bagIndex = chooseOptimalBag(item, system.bags);
    let newBags = [...system.bags];

    if (bagIndex === -1) {
      // All bags are full, add a new bag!
      const newBagNumber = system.bags.length + 1;
      const newBag = {
        id: uuidv4(),
        name: `Bag ${newBagNumber}`,
        items: [],
      };
      newBags.push(newBag);
      bagIndex = newBags.length - 1;
    }

    newBags[bagIndex] = {
      ...newBags[bagIndex],
      items: [...newBags[bagIndex].items, item]
    };

    setSystem({
      ...system,
      bags: newBags,
      currentItemIndex: system.currentItemIndex + 1,
    });

    // Show suggestion toast
    toast({
      title: `Bagged: ${item.name}`,
      description: `Placed in ${newBags[bagIndex].name} at ${item.position} position`,
    });
  };

  useEffect(() => {
    // Place the first item automatically when the component mounts
    if (system.currentItemIndex === 0) {
      placeNextItem();
    }
    // eslint-disable-next-line
  }, []); // Only run on mount
  
  // Helper function to get the appropriate icon component
  const getIconComponent = (iconName: string) => {
    // Default to ShoppingBag if the icon doesn't exist
    const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.ShoppingBag;
    return <IconComponent size={32} />;
  };

  return (
    <div className="space-y-6">
      <Card className="w-full bg-white">
        <CardHeader className="bg-kroger-blue text-white rounded-t-lg">
          <CardTitle className="text-center">Smart Bagging System</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="mb-4">
            <h3 className="text-lg font-medium">Item Progress</h3>
            <div className="text-sm text-gray-500 mb-2">
              {system.currentItemIndex} of {system.totalItems} items bagged
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-kroger-blue h-2.5 rounded-full" 
                style={{ width: `${(system.currentItemIndex / system.totalItems) * 100}%` }}
              ></div>
            </div>
          </div>
          
          {system.currentItemIndex < system.totalItems && (
            <div className="p-4 border rounded-md bg-kroger-light mb-4">
              <h3 className="font-medium mb-2">Next Item:</h3>
              <div className="flex items-center">
                <div className="bg-white p-2 rounded-md mr-4">
                  {getIconComponent(ITEMS[system.currentItemIndex].icon)}
                </div>
                <div>
                  <p className="font-medium">{ITEMS[system.currentItemIndex].name}</p>
                  <p className="text-sm text-gray-500">
                    Categories: {ITEMS[system.currentItemIndex].category.join(", ")}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <ScrollArea className="w-full" style={{ maxHeight: "350px" }}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 min-w-[600px]">
              {system.bags.map((bag) => (
                <BagComponent key={bag.id} bag={bag} />
              ))}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onReset}>
            Reset
          </Button>
          <div className="flex gap-2">
            <Button 
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = (e) => {
                  const target = e.target as HTMLInputElement;
                  if (target.files && target.files.length > 0) {
                    toast({
                      title: "New image uploaded",
                      description: `Image added: ${target.files[0].name}`,
                    });
                    placeNextItem();
                  }
                };
                input.click();
              }}
              variant="outline"
              className="border-kroger-blue text-kroger-blue hover:bg-kroger-light"
            >
              <div className="flex items-center gap-2">
                <Upload size={16} />
                <span>Upload Image</span>
              </div>
            </Button>
            <Button 
              onClick={placeNextItem} 
              className="bg-kroger-blue hover:bg-blue-800"
              disabled={system.currentItemIndex >= system.totalItems}
            >
              {system.currentItemIndex >= system.totalItems 
                ? "All Items Bagged" 
                : (
                  <div className="flex items-center gap-2">
                    <ScanBarcode size={16} />
                    <span>Scan Next Item (Fast)</span>
                  </div>
                )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
