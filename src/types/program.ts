export type Program = {
  id: string;
  tab: string;
  title: string;
  description: string;
  level: string;
  duration: string;
  semesters: string;
  tuition: string;
  qualification: string;
  cta: string;
  terms: { label: string; courses?: string[]; note?: string }[];
};
