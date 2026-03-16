export type Category = 'Culture' | 'Workflow' | 'Technical' | 'Other';

export interface Feedback {
  id: string;
  created_at: string;
  content: string;
  category: Category;
  upvotes: number;
  downvotes: number;
}

export interface Comment {
  id: string;
  feedback_id: string;
  created_at: string;
  content: string;
  anonymous_name: string;
}

export interface Database {
  public: {
    Tables: {
      feedback: {
        Row: Feedback;
        Insert: Omit<Feedback, 'id' | 'created_at'>;
        Update: Partial<Omit<Feedback, 'id' | 'created_at'>>;
      };
      comments: {
        Row: Comment;
        Insert: Omit<Comment, 'id' | 'created_at'>;
        Update: Partial<Omit<Comment, 'id' | 'created_at'>>;
      };
    };
  };
}
