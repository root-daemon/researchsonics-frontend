export interface AnalysisItem {
  type: string;
  content: string;
}

export interface AnalysisData {
  [key: string]: AnalysisItem[];
}
