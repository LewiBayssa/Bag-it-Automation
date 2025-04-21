import React, { useState, useEffect, useRef } from "react";
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
// Set the total number of items to process
const TOTAL_ITEMS = 20;

export function BaggingSystem({ onReset }: BaggingSystemProps) {
  // Create a function to generate repeated items if needed
  const generateItemsToProcess = () => {
    // If we have enough items, just take the first TOTAL_ITEMS
    if (ITEMS.length >= TOTAL_ITEMS) {
      return ITEMS.slice(0, TOTAL_ITEMS);
    }
    
    // Otherwise, repeat items to reach TOTAL_ITEMS
    const repeatedItems = [...ITEMS];
    while (repeatedItems.length < TOTAL_ITEMS) {
      // Add items with modified names to reach TOTAL_ITEMS
      const itemsToAdd = ITEMS.slice(0, Math.min(ITEMS.length, TOTAL_ITEMS - repeatedItems.length));
      repeatedItems.push(...itemsToAdd.map(item => ({
        ...item,
        name: `${item.name} (${Math.floor(repeatedItems.length / ITEMS.length) + 1})`,
      })));
    }
    return repeatedItems.slice(0, TOTAL_ITEMS);
  };
  
  // Get the items we'll be processing
  const itemsToProcess = generateItemsToProcess();
  
  const [system, setSystem] = useState<BagSystem>({
    bags: [
      { id: uuidv4(), name: "Bag 1", items: [] },
      { id: uuidv4(), name: "Bag 2", items: [] },
      { id: uuidv4(), name: "Bag 3", items: [] }
    ],
    currentItemIndex: 0,
    totalItems: TOTAL_ITEMS
  });
  
  // Reference to the scroll area container
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  // Reference to the last bag
  const lastBagRef = useRef<HTMLDivElement | null>(null);

  // Helper function to extract canonical base name for item (ignores any "(n)" at end)
  const getBaseName = (name: string) => name.replace(/\s*\(\d+\)$/, "").trim();

  const { toast } = useToast();
  // Get current item, ensuring we don't go out of bounds
  const currentItem = system.currentItemIndex < system.totalItems ? itemsToProcess[system.currentItemIndex] : null;

  // Determine which bag to place the item in
  const chooseOptimalBag = (item: Item, bags: Bag[]): number => {
    // Only allow max 2 of the "base" item in a bag
    const targetBaseName = getBaseName(item.name);

    for (let i = 0; i < bags.length; i++) {
      const bag = bags[i];
      // Skip bags that are already full
      if (bag.items.length >= ITEMS_PER_BAG) continue;

      // Check for max 2 of the same item (by base name)
      const sameBaseCount = bag.items.filter(
        i => getBaseName(i.name) === targetBaseName
      ).length;
      if (sameBaseCount >= 2) continue;

      // Don't put chemicals with food
      if (item.category.includes("chemical")) {
        // Check if the bag already has chemicals or is empty
        if (
          (bag.items.some(i => i.category.includes("chemical")) || bag.items.length === 0)
        ) {
          return i;
        }
      }
      
      // Group cold items together
      if (item.category.includes("cold")) {
        if (bag.items.some(i => i.category.includes("cold"))) {
          return i;
        }
      }
      
      // Group produce or meat together
      if (item.category.includes("produce") || item.category.includes("meat")) {
        if (bag.items.some(i => i.category.includes("produce") || i.category.includes("meat"))) {
          return i;
        }
      }
    }
    
    // If no specific rule applies, find the first bag with room
    for (let i = 0; i < bags.length; i++) {
      if (bags[i].items.length < ITEMS_PER_BAG) {
        return i;
      }
    }
    
    // All bags are full or no suitable bag found - add new bag
    return -1;
  };

  // Smooth auto-scroll to last bag when bags/content change
  useEffect(() => {
    if (lastBagRef.current) {
      lastBagRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [system.bags.length, system.bags[system.bags.length - 1]?.items.length]);

  const placeNextItem = () => {
    if (system.currentItemIndex >= system.totalItems) {
      toast({
        title: "All items processed",
        description: "There are no more items to bag",
      });
      return;
    }

    const itemToBag = itemsToProcess[system.currentItemIndex];
    const item = { ...itemToBag, id: uuidv4() };
    let bagIndex = chooseOptimalBag(item, system.bags);
    let newBags = [...system.bags];

    if (bagIndex === -1) {
      // All bags are full or hit max for this item, add a new bag!
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
          
          {currentItem && (
            <div className="p-4 border rounded-md bg-kroger-light mb-4">
              <h3 className="font-medium mb-2">Next Item:</h3>
              <div className="flex items-center">
                <div className="bg-white p-2 rounded-md mr-4">
                  {getIconComponent(currentItem.icon)}
                </div>
                <div>
                  <p className="font-medium">{currentItem.name}</p>
                  <p className="text-sm text-gray-500">
                    Categories: {currentItem.category.join(", ")}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div ref={scrollContainerRef} className="overflow-auto max-h-[350px] pr-2">
            <ScrollArea className="w-full h-full">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 min-w-[600px] pb-4">
                {system.bags.map((bag, idx) => (
                  <div
                    key={bag.id}
                    ref={idx === system.bags.length - 1 ? lastBagRef : null}
                  >
                    <BagComponent bag={bag} />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
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
