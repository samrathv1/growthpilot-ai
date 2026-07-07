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

export interface LeadFollowupData {
  businessName: string;
  businessType: string;
  leadName: string;
  leadInterest: string;
  leadStage: string;
  mainGoal: string;
  leadObjection: string;
  preferredChannel: string;
  tone: string;
  extraNotes: string;
}

export interface LeadFollowupResult {
  isDemoMode?: boolean;
  lead_summary: {
    lead_stage: string;
    intent_level: string;
    recommended_approach: string;
    lead_score: number;
  };
  whatsapp_messages: { type: string; message: string }[];
  email_followups: { subject: string; body: string }[];
  call_script: {
    opening: string;
    questions_to_ask: string[];
    pitch: string;
    closing_line: string;
  };
  objection_handling: { objection: string; response: string }[];
  closing_messages: { message: string }[];
  followup_schedule: { day: string; action: string; message_type: string }[];
  final_recommendation: string;
}

export interface SavedLeadFollowup {
  id: string;
  businessName: string;
  leadName: string;
  leadStage: string;
  result: LeadFollowupResult;
  createdAt: string;
}

export interface GrowthAgentData {
  businessName: string;
  businessType: string;
  currentSituation: string;
  mainGoal: string;
  onlinePresence: string;
  biggestProblem: string;
  targetAudience: string;
  offer: string;
  budgetLevel: string;
  timeframe: string;
  extraNotes: string;
}

export interface GrowthAgentResult {
  isDemoMode?: boolean;
  business_diagnosis: {
    summary: string;
    main_problem: string;
    growth_stage: string;
    priority_level: string;
  };
  next_best_action: {
    title: string;
    reason: string;
    expected_impact: string;
  };
  website_actions: {
    action: string;
    why_it_matters: string;
    difficulty: string;
  }[];
  content_actions: {
    action: string;
    platform: string;
    content_idea: string;
    cta: string;
  }[];
  lead_followup_actions: {
    action: string;
    message_angle: string;
    when_to_send: string;
  }[];
  automation_actions: {
    automation: string;
    tool_suggestion: string;
    benefit: string;
  }[];
  seven_day_growth_plan: {
    day: string;
    task: string;
    goal: string;
  }[];
  thirty_day_growth_plan: {
    week: string;
    focus: string;
    actions: string[];
  }[];
  quick_wins: string[];
  mistakes_to_avoid: string[];
  recommended_growth_stack: {
    website: string;
    content: string;
    lead_capture: string;
    followup: string;
    automation: string;
  };
  final_recommendation: string;
}

export interface SavedGrowthAgent {
  id: string;
  businessName: string;
  mainGoal: string;
  biggestProblem: string;
  result: GrowthAgentResult;
  createdAt: string;
}
