/*
 * Dragon Menu — Firebase / Firestore Configuration
 * -------------------------------------------------
 * Set the following variables in your .env.local file:
 *
 *   NEXT_PUBLIC_FIREBASE_API_KEY=
 *   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
 *   NEXT_PUBLIC_FIREBASE_PROJECT_ID=
 *   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
 *   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
 *   NEXT_PUBLIC_FIREBASE_APP_ID=
 *
 * ═══════════════════════════════════════════════════════════════
 *  FIRESTORE SCHEMA — Dragon Menu SaaS
 * ═══════════════════════════════════════════════════════════════
 *
 * Collection: restaurants/{restaurantId}
 *   - name: string                  — "Dragon Menu Miraflores"
 *   - slug: string                  — URL-friendly identifier
 *   - logoUrl: string
 *   - themeColor: string            — hex primary color
 *   - plan: "free" | "pro" | "enterprise"
 *   - ownerId: string               — Firebase Auth UID
 *   - active: boolean
 *   - createdAt: Timestamp
 *   - updatedAt: Timestamp
 *
 * Collection: restaurants/{restaurantId}/tables/{tableId}
 *   - number: number                — physical table number shown on QR
 *   - alias: string                 — "Terraza 5", "Barra", etc.
 *   - qrCodeUrl: string             — generated QR image URL
 *   - status: "available" | "occupied" | "reserved"
 *   - currentOrderId: string | null
 *   - capacity: number
 *   - active: boolean
 *
 * Collection: restaurants/{restaurantId}/categories/{categoryId}
 *   - name: string                  — "Entradas", "Chaufas", "Bebidas"
 *   - imageUrl: string
 *   - order: number                 — display sort order
 *   - active: boolean
 *
 * Collection: restaurants/{restaurantId}/products/{productId}
 *   - name: string
 *   - description: string
 *   - price: number                 — in local currency cents
 *   - imageUrl: string
 *   - categoryId: string            — ref to categories/{categoryId}
 *   - tags: string[]                — ["spicy", "vegetarian", "popular"]
 *   - available: boolean
 *   - preparationTimeMin: number    — estimated minutes to prepare
 *   - order: number                 — display sort order within category
 *
 * Collection: restaurants/{restaurantId}/orders/{orderId}
 *   - tableId: string
 *   - tableNumber: number
 *   - restaurantId: string
 *   - status: "pending" | "confirmed" | "preparing" | "ready" | "delivered" | "cancelled"
 *   - items: Array<{
 *       productId: string
 *       productName: string
 *       quantity: number
 *       unitPrice: number
 *       notes: string
 *     }>
 *   - subtotal: number
 *   - total: number
 *   - notes: string                 — general order notes
 *   - paymentStatus: "unpaid" | "paid"
 *   - paymentMethod: "cash" | "card" | "yape" | "plin" | null
 *   - createdAt: Timestamp
 *   - updatedAt: Timestamp
 *   - servedBy: string | null       — waiter userId
 *
 * Collection: restaurants/{restaurantId}/service_requests/{requestId}
 *   - tableId: string
 *   - tableNumber: number
 *   - type: "waiter" | "bill" | "condiment" | "other"
 *   - message: string
 *   - status: "open" | "acknowledged" | "resolved"
 *   - createdAt: Timestamp
 *   - resolvedAt: Timestamp | null
 *   - resolvedBy: string | null     — waiter userId
 *
 * ═══════════════════════════════════════════════════════════════
 *  FIRESTORE SECURITY RULES (reference)
 * ═══════════════════════════════════════════════════════════════
 *
 *  rules_version = '2';
 *  service cloud.firestore {
 *    match /databases/{database}/documents {
 *
 *      // Guests can read menu data (products, categories) without auth
 *      match /restaurants/{restaurantId}/products/{productId} {
 *        allow read: if true;
 *        allow write: if isOwner(restaurantId);
 *      }
 *      match /restaurants/{restaurantId}/categories/{categoryId} {
 *        allow read: if true;
 *        allow write: if isOwner(restaurantId);
 *      }
 *
 *      // Orders: guests can create, staff can update
 *      match /restaurants/{restaurantId}/orders/{orderId} {
 *        allow create: if true;
 *        allow read, update: if isStaff(restaurantId);
 *        allow delete: if isOwner(restaurantId);
 *      }
 *
 *      // Service requests: guests create, staff manage
 *      match /restaurants/{restaurantId}/service_requests/{requestId} {
 *        allow create: if true;
 *        allow read, update: if isStaff(restaurantId);
 *      }
 *
 *      function isOwner(restaurantId) {
 *        return request.auth != null &&
 *          get(/databases/$(database)/documents/restaurants/$(restaurantId)).data.ownerId == request.auth.uid;
 *      }
 *
 *      function isStaff(restaurantId) {
 *        return request.auth != null;
 *      }
 *    }
 *  }
 */

/**
 * Dragon Menu — Firebase Configuration (ready for wiring)
 *
 * To activate, run:
 *   npm install firebase
 *
 * Then replace this block with the real SDK imports:
 *
 *   import { initializeApp, getApps } from 'firebase/app';
 *   import { getFirestore } from 'firebase/firestore';
 *   import { getAuth } from 'firebase/auth';
 *   import { getStorage } from 'firebase/storage';
 *
 *   const firebaseConfig = {
 *     apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? '',
 *     authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '',
 *     projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? '',
 *     storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? '',
 *     messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '',
 *     appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? '',
 *   };
 *
 *   const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
 *   export const db      = getFirestore(app);
 *   export const auth    = getAuth(app);
 *   export const storage = getStorage(app);
 *   export default app;
 */

export const FIREBASE_CONFIG = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? '',
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '',
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? '',
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '',
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? '',
} as const;
