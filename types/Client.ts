export interface Document {
  name: string;
  path: string;
}

export interface Nda extends Document {
  slug: string;
  id: number;
  date: string;
}

export interface Lawsuit extends Document {
  [x: string]: any;
  id: number;
  date: string;
  status: string;
}

export interface Client {
  _id: string;
  name: string;
  avatar: string;
  ndas: Nda[];
  lawsuits: Lawsuit[];
}
