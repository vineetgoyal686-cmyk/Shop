"use client";

import { track } from "@/lib/track";
import ItemImageSlider from "@/components/ItemImageSlider";

interface Props {
  id: string;
  name: string;
  images: string[];
}

export default function ItemCard({ id, name, images }: Props) {
  return (
    <div
      className="bg-white rounded-2xl overflow-hidden shadow-md border border-rose-50 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => track("item_view", id, name)}
    >
      <div className="relative h-48 md:h-60 bg-rose-50">
        <ItemImageSlider images={images} />
      </div>
      <div className="p-3 text-center">
        <h3 className="font-semibold text-gray-800 text-sm">{name}</h3>
      </div>
    </div>
  );
}
