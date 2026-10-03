export interface GroupedModerationItem {
  postId: number | null;
  commentId: number | null;
  reportCount: string;
  topReason: string;
  latestTimestamp: string;
  latestId: number;
  reportType: "testimony" | "event" | "comment";
}

export interface ReportHistoryItem {
  reportId: number;
  reason: ReportReason;
  details: string | null;
  timestamp: string;
  status: string;
  reporterName: string;
}

export interface BlockedUserRecord {
  blockedId: number;
  blockedAt: string;
  blockedUsername: string;
  blockedFirebaseAuthId: string;
}

export interface UserReport {
  reportId: number;
  postId: number | null;
  commentId: number | null;
  reason: string;
  details: string;
  timestamp: string;
  status: ReportStatus;
}

export type ReportStatus = "pending" | "resolved";

export type Filter = "testimony" | "event" | "comment" | "all";

export type SortType = "recency" | "count";

export enum ReportReason {
  Spam = "spam",
  Harassment = "harassment",
  HateSpeech = "hate_speech",
  ViolenceOrHarm = "violence_or_harm",
  NudityOrSexual = "nudity_or_sexual",
  CopyrightInfraction = "copyright_infraction",
  ScamsOrFraud = "scams_or_fraud",
  SelfHarm = "self_harm",
  Other = "other",
}

// Reusable array layout list helper
export const REPORT_REASON_OPTIONS = [
  { value: ReportReason.Spam, label: "Spam or Misleading" },
  { value: ReportReason.Harassment, label: "Harassment or Bullying" },
  { value: ReportReason.HateSpeech, label: "Hate Speech or Discrimination" },
  {
    value: ReportReason.ViolenceOrHarm,
    label: "Violence or Dangerous Content",
  },
  { value: ReportReason.NudityOrSexual, label: "Nudity or Sexual Content" },
  {
    value: ReportReason.CopyrightInfraction,
    label: "Intellectual Property Violation",
  },
  { value: ReportReason.ScamsOrFraud, label: "Scam, Fraud, or Impersonation" },
  { value: ReportReason.SelfHarm, label: "Self-Harm or Suicide Incitement" },
  { value: ReportReason.Other, label: "Something Else" },
];

export const DETAILS_CHAR_LIMIT = 600;
