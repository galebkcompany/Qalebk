/* eslint-disable @typescript-eslint/no-explicit-any */

export {}; // 👈 مهم جداً لجعل الملف Module

declare global {
  // إعدادات الـ Checkout
  interface PaddleCheckoutSettings {
    displayMode?: "inline" | "overlay";
    frameTarget?: string;
    frameInitialHeight?: number;
    frameStyle?: string;
  }

  // أحداث Paddle
  interface PaddleCheckoutEvent {
    name: string;
    data?: any;
  }

  // خيارات Checkout
  interface PaddleCheckoutOptions {
    transactionId?: string;
    items?: Array<{
      priceId: string;
      quantity: number;
    }>;
    customer?: {
      email?: string;
    };
    customData?: Record<string, any>;
    settings?: PaddleCheckoutSettings;
    eventCallback?: (event: PaddleCheckoutEvent) => void;
  }

  // Checkout API
  interface PaddleCheckout {
    open: (options: PaddleCheckoutOptions) => void;
    close: () => void;
  }

  // Environment API
  interface PaddleEnvironment {
    set: (env: "sandbox" | "production") => void;
  }

  // Initialize options
  interface PaddleInitializeOptions {
    token: string;
    environment?: "sandbox" | "production";
    checkout?: {
      settings?: PaddleCheckoutSettings;
    };
  }

  // Paddle SDK
  interface Paddle {
    Initialize: (options: PaddleInitializeOptions) => void;
    Checkout: PaddleCheckout;
    Environment: PaddleEnvironment;
  }

  // Window binding
  interface Window {
    Paddle?: Paddle;
  }
}
