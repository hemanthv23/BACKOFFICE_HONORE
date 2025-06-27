// ==========================================================
// src/app/apps/backoffice/components/communication/components/communication-display-utils.ts
// Utility class for formatting display values (e.g., message types, status colors).
// ==========================================================
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root' // Make this service injectable application-wide
})
export class CommunicationDisplayUtils {
    /**
     * Formats a raw message type string into a more user-friendly display string.
     * @param type The raw message type string (e.g., 'SHIPPING_UPDATE').
     * @returns The formatted message type string.
     */
    formatMessageType(type: string): string {
        switch (type) {
            case 'SHIPPING_UPDATE':
                return 'Shipping Update';
            case 'PROMOTIONAL_OFFER':
                return 'Promotional Offer'; // Changed to 'Promotional Offer' for clarity based on original
            case 'NEW_USER_REGISTRATION':
                return 'New User Registration'; // Changed to 'New User Registration'
            case 'PASSWORD_RESET':
                return 'Password Reset';
            case 'NEW_ORDER_CONFIRMATION':
                return 'Order Confirmation';
            default:
                return type; // Return as-is if no specific formatting rule applies
        }
    }

    /**
     * Returns Tailwind CSS classes for status-specific background and text colors.
     * @param status The communication status string (e.g., 'SUCCESS').
     * @returns Tailwind CSS class string.
     */
    getStatusColor(status: string): string {
        switch (status) {
            case 'SUCCESS':
            case 'SMS_MESSAGE_UPLOADED': // Treat uploaded SMS as a success for visual purposes
                return 'bg-green-100 text-green-800';
            case 'PENDING':
            case 'SEND_REQUESTED': // Treat requested sends similarly to pending
                return 'bg-yellow-100 text-yellow-800';
            case 'SEND_FAILED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800'; // Default color for unknown/other statuses
        }
    }

    /**
     * Formats a raw status string into a more user-friendly display string.
     * @param status The raw status string (e.g., 'SMS_MESSAGE_UPLOADED').
     * @returns The formatted status string.
     */
    formatStatus(status: string): string {
        switch (status) {
            case 'SUCCESS':
                return 'Success';
            case 'SMS_MESSAGE_UPLOADED':
                return 'Uploaded';
            case 'PENDING':
                return 'Pending';
            case 'SEND_REQUESTED':
                return 'Requested';
            case 'SEND_FAILED':
                return 'Failed';
            default:
                return status; // Return as-is if no specific formatting rule applies
        }
    }
}
