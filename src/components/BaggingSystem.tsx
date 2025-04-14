
import React, { useState, useEffect } from "react";
import { Bag as BagComponent } from "./Bag";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Bag, BagSystem, Item } from "@/types";
import { ITEMS } from "@/data/items";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/components/ui/use-toast";

interface BaggingSystemProps {
  onReset: () => void;
}

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
        if (bag.items.some(i => i.category.includes("chemical")) || bag.items.length === 0) {
          return i;
        }
      }
      
      // Group cold items together
      if (item.category.includes("cold")) {
        if (bag.items.some(i => i.category.includes("cold"))) {
          return i;
        }
      }
      
      // Group produce together
      if (item.category.includes("produce") || item.category.includes("meat")) {
        if (bag.items.some(i => i.category.includes("produce") || i.category.includes("meat"))) {
          return i;
        }
      }
    }
    
    // If no specific rule applies, find the bag with the least items
    return bags.reduce((minIdx, bag, idx, arr) => 
      bag.items.length < arr[minIdx].items.length ? idx : minIdx, 0);
  };

  const placeNextItem = () => {
    if (system.currentItemIndex >= system.totalItems) {
      toast({
        title: "All items processed",
        description: "There are no more items to bag",
      });
      return;
    }

    const item = {...ITEMS[system.currentItemIndex], id: uuidv4()};
    const bagIndex = chooseOptimalBag(item, system.bags);
    
    // Create a new copy of the system to mutate
    const newSystem = {...system};
    newSystem.bags = [...system.bags];
    newSystem.bags[bagIndex] = {
      ...system.bags[bagIndex],
      items: [...system.bags[bagIndex].items, item]
    };
    newSystem.currentItemIndex += 1;
    
    setSystem(newSystem);
    
    // Show suggestion toast
    toast({
      title: `Bagged: ${item.name}`,
      description: `Placed in ${system.bags[bagIndex].name} at ${item.position} position`,
    });
  };

  useEffect(() => {
    // Place the first item automatically when the component mounts
    if (system.currentItemIndex === 0) {
      placeNextItem();
    }
  }, []);

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
                  {React.createElement(
                    (require('lucide-react') as any)[ITEMS[system.currentItemIndex].icon] || 
                    (require('lucide-react') as any).ShoppingBag, 
                    { size: 32 }
                  )}
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
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {system.bags.map((bag) => (
              <BagComponent key={bag.id} bag={bag} />
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onReset}>
            Reset
          </Button>
          <Button 
            onClick={placeNextItem} 
            className="bg-kroger-blue hover:bg-blue-800"
            disabled={system.currentItemIndex >= system.totalItems}
          >
            {system.currentItemIndex >= system.totalItems 
              ? "All Items Bagged" 
              : "Scan Next Item"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
