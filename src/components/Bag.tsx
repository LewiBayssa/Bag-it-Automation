
import React from "react";
import { Bag as BagType, Item } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import * as Icons from "lucide-react";

interface BagProps {
  bag: BagType;
}

export function Bag({ bag }: BagProps) {
  // Group items by position for easier rendering
  const bottomItems = bag.items.filter(item => item.position === "bottom");
  const middleItems = bag.items.filter(item => item.position === "middle");
  const topItems = bag.items.filter(item => item.position === "top");

  return (
    <Card className="w-full bg-white border-2 border-kroger-blue">
      <CardHeader className="bg-kroger-blue text-white rounded-t-lg p-2">
        <CardTitle className="text-center text-sm">{bag.name}</CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <div className="bag-container h-64 bg-kroger-light flex flex-col justify-between p-2 rounded">
          {/* Top Items */}
          <div className="bag-section h-1/3 flex flex-wrap justify-center items-end gap-1 border-dashed border-b border-gray-300">
            {topItems.length > 0 ? (
              topItems.map(item => <BagItem key={item.id} item={item} />)
            ) : (
              <div className="text-xs text-gray-400">Top</div>
            )}
          </div>
          
          {/* Middle Items */}
          <div className="bag-section h-1/3 flex flex-wrap justify-center items-center gap-1 border-dashed border-b border-gray-300">
            {middleItems.length > 0 ? (
              middleItems.map(item => <BagItem key={item.id} item={item} />)
            ) : (
              <div className="text-xs text-gray-400">Middle</div>
            )}
          </div>
          
          {/* Bottom Items */}
          <div className="bag-section h-1/3 flex flex-wrap justify-center items-start gap-1">
            {bottomItems.length > 0 ? (
              bottomItems.map(item => <BagItem key={item.id} item={item} />)
            ) : (
              <div className="text-xs text-gray-400">Bottom</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface BagItemProps {
  item: Item;
}

function BagItem({ item }: BagItemProps) {
  const IconComponent = (Icons as any)[item.icon] || Icons.ShoppingBag;
  
  // Apply different background colors based on item category
  let bgColor = "bg-gray-100";
  if (item.category.includes("cold")) bgColor = "bg-blue-100";
  if (item.category.includes("chemical")) bgColor = "bg-red-100";
  if (item.category.includes("produce")) bgColor = "bg-green-100";
  if (item.category.includes("meat")) bgColor = "bg-red-50";
  
  return (
    <div 
      className={`${bgColor} p-1 rounded-md flex flex-col items-center animate-bounce-in`}
      title={`${item.name} (${item.category.join(", ")})`}
    >
      <IconComponent size={20} />
      <span className="text-xs mt-1">{item.name}</span>
    </div>
  );
}
