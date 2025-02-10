export interface Spot {
  id: string;
  name: string;
  location: string;
  image: string;
}

export const sampleSpots: Spot[] = [
  {
    id: "1",
    name: "東京スカイツリー",
    location: "東京都墨田区押上1-1-2",
    image:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "2",
    name: "浅草寺",
    location: "東京都台東区浅草2-3-1",
    image:
      "https://images.unsplash.com/photo-1570459027562-4a916cc6113f?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "3",
    name: "上野動物園",
    location: "東京都台東区上野公園9-83",
    image:
      "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "4",
    name: "明治神宮",
    location: "東京都渋谷区代々木神園町1-1",
    image:
      "https://images.unsplash.com/photo-1583134993393-9c9450bf8eac?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "5",
    name: "渋谷スクランブル交差点",
    location: "東京都渋谷区道玄坂2-2-1",
    image:
      "https://images.unsplash.com/photo-1542931287-023b922fa89b?w=800&auto=format&fit=crop&q=80",
  },
];
