export interface Bill {
    name: string;
    status: 'paid' | 'pending';
  }
  
  export interface Account {
    type: string;
    number: string;
    status: 'active' | 'blocked';
  }
  
  export interface UserProfile {
    name: string;
    phone: string;
    email: string;
  }