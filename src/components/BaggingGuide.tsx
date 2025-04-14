
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Beef, Apple, Egg, Milk, Citrus, Banana } from "lucide-react";

export function BaggingGuide() {
  return (
    <Card className="w-full max-w-md mx-auto bg-white">
      <CardHeader className="bg-kroger-blue text-white rounded-t-lg">
        <CardTitle className="text-center">Bagging Best Practices</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <ul className="space-y-4">
          <li className="flex items-start gap-3">
            <div className="bg-kroger-light p-2 rounded-md">
              <Milk size={24} />
            </div>
            <div>
              <p className="font-medium">Heavy Items on Bottom</p>
              <p className="text-sm text-gray-600">Place heavier items like milk, canned goods, and bottles at the bottom of the bag.</p>
            </div>
          </li>
          
          <li className="flex items-start gap-3">
            <div className="bg-kroger-light p-2 rounded-md">
              <Egg size={24} />
            </div>
            <div>
              <p className="font-medium">Fragile Items on Top</p>
              <p className="text-sm text-gray-600">Place eggs, bread, chips, and other easily crushed items at the top of the bag.</p>
            </div>
          </li>
          
          <li className="flex items-start gap-3">
            <div className="bg-kroger-light p-2 rounded-md">
              <Milk size={24} />
            </div>
            <div>
              <p className="font-medium">Cold Items Together</p>
              <p className="text-sm text-gray-600">Group frozen and refrigerated items together to maintain temperature.</p>
            </div>
          </li>
          
          <li className="flex items-start gap-3">
            <div className="bg-kroger-light p-2 rounded-md">
              <Citrus size={24} />
            </div>
            <div>
              <p className="font-medium">Separate Chemicals</p>
              <p className="text-sm text-gray-600">Keep cleaning products and chemicals separate from food items.</p>
            </div>
          </li>
          
          <li className="flex items-start gap-3">
            <div className="bg-kroger-light p-2 rounded-md">
              <Beef size={24} />
            </div>
            <div>
              <p className="font-medium">Meat Separately</p>
              <p className="text-sm text-gray-600">Bag raw meat separately or with other meat products to prevent cross-contamination.</p>
            </div>
          </li>
          
          <li className="flex items-start gap-3">
            <div className="bg-kroger-light p-2 rounded-md">
              <Banana size={24} />
            </div>
            <div>
              <p className="font-medium">Protect Produce</p>
              <p className="text-sm text-gray-600">Keep produce away from items that could damage or contaminate them.</p>
            </div>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}
