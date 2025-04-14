
import { Item } from "@/types";
import { v4 as uuidv4 } from "uuid";

// Simulated items that would be scanned
export const ITEMS: Item[] = [
  {
    id: uuidv4(),
    name: "Milk",
    icon: "milk",
    category: ["cold", "heavy"],
    position: "bottom"
  },
  {
    id: uuidv4(),
    name: "Eggs",
    icon: "egg",
    category: ["cold", "fragile"],
    position: "top"
  },
  {
    id: uuidv4(),
    name: "Bread",
    icon: "croissant",
    category: ["fragile"],
    position: "top"
  },
  {
    id: uuidv4(),
    name: "Cereal",
    icon: "wheat",
    category: ["regular"],
    position: "middle"
  },
  {
    id: uuidv4(),
    name: "Bananas",
    icon: "banana",
    category: ["produce", "fragile"],
    position: "top"
  },
  {
    id: uuidv4(),
    name: "Ground Beef",
    icon: "beef",
    category: ["meat", "cold"],
    position: "bottom"
  },
  {
    id: uuidv4(),
    name: "Bleach",
    icon: "citrus",
    category: ["chemical"],
    position: "bottom"
  }
];
