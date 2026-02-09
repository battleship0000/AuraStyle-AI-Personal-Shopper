
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'Electronics' | 'Home' | 'Fashion' | 'Lifestyle';
  image: string;
  rating: number;
  stock: number;
  tags: string[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestedProducts?: string[];
}

export interface AppState {
  cart: CartItem[];
  favorites: string[]; // IDs of favorite products
  isCartOpen: boolean;
  isChatOpen: boolean;
  chatHistory: ChatMessage[];
  searchQuery: string;
}
