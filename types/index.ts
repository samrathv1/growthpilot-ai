export type ToolId =
  | 'business-audit'
  | 'landing-page-generator'
  | 'content-generator'
  | 'lead-follow-up'
  | 'growth-agent';

export interface ResultSection {
  title: string;
  content: string;
}

export interface GenerateRequest {
  tool: ToolId;
  data: Record<string, string>;
}

export interface GenerateResponse {
  sections: ResultSection[];
  error?: string;
}

export interface ToolMeta {
  id: ToolId;
  name: string;
  description: string;
  href: string;
  icon: string;
  gradient: string;
  badge?: string;
}
