export interface DocumentDetails {
  title: string;
  created_by: string;
  created_at: Date;
  updated_by: string;
  updated_at: Date;
}
export interface IMarking {
  type: "heading";
  level: number;
  text: string;
  sequence: number;
}
