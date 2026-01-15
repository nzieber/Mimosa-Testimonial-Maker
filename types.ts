
export enum Tone {
  PROFESSIONAL = 'professional',
  CASUAL = 'casual',
  BOLD = 'bold'
}

export enum Length {
  SHORT = 'short',
  MEDIUM = 'medium',
  LONG = 'long'
}

export enum CTAStyle {
  SOFT = 'soft',
  DIRECT = 'direct',
  NONE = 'none'
}

export interface TestimonialOutputs {
  blogPost: {
    title: string;
    content: string;
  };
  linkedIn: {
    content: string;
  };
  twitterThread: {
    tweets: string[];
  };
  email: {
    subjects: string[];
    content: string;
  };
}

export interface TestimonialEntry {
  id: string;
  createdAt: string;
  participantName: string;
  roleTitle: string;
  company?: string;
  location?: string;
  backgroundBio: string;
  goalsBeforeWorkshop: string;
  whatTheyBuilt: string;
  howItWorks: string;
  favoriteMoment: string;
  biggestBreakthrough: string;
  resultsMetrics: string;
  whoShouldAttend: string;
  quotePull: string;
  consentToUse: boolean;
  allowNameUse: boolean;
  anonymize: boolean;
  tone: Tone;
  length: Length;
  ctaStyle: CTAStyle;
  brandVoice: string;
  generatedOutputs?: TestimonialOutputs;
  prdFileUrl?: string;
  screenshots: string[]; // Base64 or URLs
}
