export interface AnalyticsData {
  day: Date;
  age: number;
  gender: string;
  A: number;
  B: number;
  C: number;
  D: number;
  E: number;
  F: number;
}

export interface QueryParameters {
  startDate?: string;
  endDate?: string;
  ageGroup?: string;
  gender?: string;
}

export interface TotalTimePerFeature {
  A: number;
  B: number;
  C: number;
  D: number;
  E: number;
  F: number;
}
