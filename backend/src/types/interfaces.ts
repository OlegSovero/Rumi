export interface ArasaacPictogram {
  _id: number;
  keywords: Array<{
    keyword: string;
    type?: number;
  }>;
}

export interface VertexAIConfig {
  projectId: string;
  location: string;
  model: string;
}
