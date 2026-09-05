export interface Level {
  tileSize: number;
  size: number;
  fallbackOnly?: boolean;
}

export interface InitialViewParameters {
  yaw: number;
  pitch: number;
  fov: number;
}

export interface LinkHotspot {
  yaw: number;
  pitch: number;
  rotation: number;
  target: string;
}

export interface InfoHotspot {
  yaw: number;
  pitch: number;
  title: string;
  text: string;
}

export interface SceneData {
  id: string;
  name: string;
  levels: Level[];
  faceSize: number;
  initialViewParameters: InitialViewParameters;
  linkHotspots: LinkHotspot[];
  infoHotspots?: InfoHotspot[];
}

export interface LocationMeta {
  sceneId: string;
  displayName: string;
  shortDescription: string;
  category: 'academics' | 'labs' | 'landmarks' | 'hostels' | 'facilities';
  captureNote?: string;
  thumbnail: string;
}

export interface LocationCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  sceneIds: string[];
}
