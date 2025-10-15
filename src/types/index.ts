export interface VideoDocument {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  categories: string[];
}

export interface YouTubeLink {
  id: string;
  url: string;
  title: string;
  addedAt: string;
  watched: boolean;
  category?: string;
}

export interface VideoDocumentWithLinks extends VideoDocument {
  links: YouTubeLink[];
}

export type CreateYouTubeLinkInput = Omit<YouTubeLink, 'id' | 'addedAt' | 'watched'>;

// Training Types
export interface DayChecklistItem {
  text: string;
  completed: boolean;
}

export interface DayTraining {
  dayNumber: number;
  dayName: string; // "Monday", "Tuesday", etc.
  focus: string;
  checklist: DayChecklistItem[];
  note?: string;
  completedAt?: string;
}

export interface TrainingMonth {
  month: number;
  phase: string;
  goals: string[];
  bonus_skills_to_work: string[];
  days: { [key: string]: DayTraining }; // day1, day2, ... day28
  milestone_check: string[];
}

export interface TrainingProgram {
  program_info: {
    title: string;
    start_age: number;
    target_skill: string;
    training_frequency: string;
    rest_days: string;
    important_notes: string[];
  };
  months: TrainingMonth[];
  nutrition_guidelines: Record<string, string>;
  recovery_protocols: Record<string, string>;
  progress_tracking: Record<string, string>;
  mental_preparation: Record<string, string>;
  safety_notes: {
    warning_signs: string[];
    injury_protocol: string;
    form_priorities: string[];
  };
  bonus_skills_learned_in_journey: string[];
  final_message: string;
}
