export interface Document {
  name: string;
  path: string;
}

export interface Client {
  _id: string;
  name: string;
  avatar: string;
  ndas: Document[];
  lawsuits: Document[];
}
