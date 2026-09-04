import { LocationMeta, LocationCategory } from '@/types';

export const LOCATION_CATEGORIES: LocationCategory[] = [
  {
    "id": "academics",
    "name": "Academic Blocks",
    "description": "Where learning happens",
    "icon": "academics",
    "sceneIds": [
      "5-ab01",
      "6-ab02",
      "7-ab03"
    ]
  },
  {
    "id": "labs",
    "name": "Lab Complex",
    "description": "Engineering & science labs",
    "icon": "labs",
    "sceneIds": [
      "8-lc01",
      "9-lc02",
      "10-lc03"
    ]
  },
  {
    "id": "landmarks",
    "name": "Landmarks",
    "description": "Iconic campus spots",
    "icon": "landmarks",
    "sceneIds": [
      "0-main",
      "1-vit",
      "2-lion",
      "14-bridge"
    ]
  },
  {
    "id": "hostels",
    "name": "Hostels",
    "description": "Student life beyond class",
    "icon": "hostels",
    "sceneIds": [
      "12-ground",
      "13-hostel",
      "15-block"
    ]
  },
  {
    "id": "facilities",
    "name": "Facilities",
    "description": "Campus amenities",
    "icon": "facilities",
    "sceneIds": [
      "3-cr",
      "4-mph",
      "11-audi"
    ]
  }
];

export const LOCATION_META: Record<string, LocationMeta> = {
  "0-main": {
    "sceneId": "0-main",
    "displayName": "Main Entrance",
    "shortDescription": "Where every journey begins.",
    "category": "landmarks",
    "captureNote": "Captured at golden hour.",
    "thumbnail": "/tiles/0-main/preview.jpg"
  },
  "1-vit": {
    "sceneId": "1-vit",
    "displayName": "VIT Campus",
    "shortDescription": "The heart of the university.",
    "category": "landmarks",
    "thumbnail": "/tiles/1-vit/preview.jpg"
  },
  "2-lion": {
    "sceneId": "2-lion",
    "displayName": "Lion Statue",
    "shortDescription": "Strength. Pride. VIT.",
    "category": "landmarks",
    "captureNote": "One of my favourite spots.",
    "thumbnail": "/tiles/2-lion/preview.jpg"
  },
  "3-cr": {
    "sceneId": "3-cr",
    "displayName": "Chancellor's Residence",
    "shortDescription": "Where campus meets grandeur.",
    "category": "facilities",
    "thumbnail": "/tiles/3-cr/preview.jpg"
  },
  "4-mph": {
    "sceneId": "4-mph",
    "displayName": "Multi-Purpose Hall",
    "shortDescription": "Events, culture, community.",
    "category": "facilities",
    "captureNote": "This place has seen everything.",
    "thumbnail": "/tiles/4-mph/preview.jpg"
  },
  "5-ab01": {
    "sceneId": "5-ab01",
    "displayName": "AB1 : View 1",
    "shortDescription": "First year memories.",
    "category": "academics",
    "thumbnail": "/tiles/5-ab01/preview.jpg"
  },
  "6-ab02": {
    "sceneId": "6-ab02",
    "displayName": "AB1 : View 2",
    "shortDescription": "Where lectures become stories.",
    "category": "academics",
    "thumbnail": "/tiles/6-ab02/preview.jpg"
  },
  "7-ab03": {
    "sceneId": "7-ab03",
    "displayName": "AB1 : View 3",
    "shortDescription": "Between classes and canteen runs.",
    "category": "academics",
    "captureNote": "Best spot for a break.",
    "thumbnail": "/tiles/7-ab03/preview.jpg"
  },
  "8-lc01": {
    "sceneId": "8-lc01",
    "displayName": "Lab Complex I",
    "shortDescription": "Where theory meets practice.",
    "category": "labs",
    "thumbnail": "/tiles/8-lc01/preview.jpg"
  },
  "9-lc02": {
    "sceneId": "9-lc02",
    "displayName": "Lab Complex II",
    "shortDescription": "Engineering in action.",
    "category": "labs",
    "thumbnail": "/tiles/9-lc02/preview.jpg"
  },
  "10-lc03": {
    "sceneId": "10-lc03",
    "displayName": "Lab Complex III",
    "shortDescription": "The quieter side of labs.",
    "category": "labs",
    "thumbnail": "/tiles/10-lc03/preview.jpg"
  },
  "11-audi": {
    "sceneId": "11-audi",
    "displayName": "Auditorium",
    "shortDescription": "Where creativity takes the stage.",
    "category": "facilities",
    "captureNote": "Captured during a quiet afternoon.",
    "thumbnail": "/tiles/11-audi/preview.jpg"
  },
  "12-ground": {
    "sceneId": "12-ground",
    "displayName": "Sports Ground",
    "shortDescription": "After-hours energy.",
    "category": "hostels",
    "thumbnail": "/tiles/12-ground/preview.jpg"
  },
  "13-hostel": {
    "sceneId": "13-hostel",
    "displayName": "Hostel Area",
    "shortDescription": "Home away from home.",
    "category": "hostels",
    "captureNote": "Where most of the real stories happen.",
    "thumbnail": "/tiles/13-hostel/preview.jpg"
  },
  "14-bridge": {
    "sceneId": "14-bridge",
    "displayName": "Bridge",
    "shortDescription": "Connecting two worlds.",
    "category": "landmarks",
    "thumbnail": "/tiles/14-bridge/preview.jpg"
  },
  "15-block": {
    "sceneId": "15-block",
    "displayName": "Hostel Block",
    "shortDescription": "Late nights and early mornings.",
    "category": "hostels",
    "thumbnail": "/tiles/15-block/preview.jpg"
  }
};

export function getAllLocations(): LocationMeta[] {
  return Object.values(LOCATION_META);
}

export function getLocationById(id: string): LocationMeta | undefined {
  return LOCATION_META[id];
}

export function getLocationsByCategory(categoryId: string): LocationMeta[] {
  const category = LOCATION_CATEGORIES.find((c) => c.id === categoryId);
  if (!category) return [];
  return category.sceneIds.map((id) => LOCATION_META[id]).filter(Boolean);
}
