// ==========================================================
// src/app/apps/backoffice/components/communication/components/interfaces.ts
// Defines interfaces for Communication data structure and statistics dashboard.
// ==========================================================

export interface Communication {
    id: number;
    emailPhone: string;
    type: 'EMAIL' | 'SMS';
    messageType: string; // e.g., 'SHIPPING_UPDATE', 'PROMOTIONAL_OFFER'
    status: 'SUCCESS' | 'PENDING' | 'SEND_REQUESTED' | 'SEND_FAILED' | 'SMS_MESSAGE_UPLOADED';
    dateSent: string; // Format: DD-MM-YYYY
    time: string; // Format: HH:MM AM/PM
    searchableText?: string; // Added field for combined searchable content (email, phone, type, status, messageType)
}

export interface Stats {
    total: number;
    successful: number;
    pending: number;
    failed: number;
    emails: number;
    sms: number;
}
