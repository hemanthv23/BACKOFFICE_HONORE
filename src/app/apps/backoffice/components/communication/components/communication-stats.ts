// ==========================================================
// src/app/apps/backoffice/components/communication/components/communication-stats.ts
// Calculates and provides communication statistics and handles CSV export.
// ==========================================================
import { Injectable, computed } from '@angular/core';
import { Communication, Stats } from './interfaces'; // Import Communication and Stats interfaces
import { CommunicationData } from './communication-data'; // Import CommunicationData service
import { CommunicationFiltering } from './communication-filtering'; // Import CommunicationFiltering service

@Injectable({
    providedIn: 'root' // Make this service injectable application-wide
})
export class CommunicationStats {
    constructor(
        private communicationData: CommunicationData,
        private communicationFiltering: CommunicationFiltering
    ) {}

    /**
     * Computed signal that calculates various statistics based on all communication data.
     * This signal re-evaluates automatically when `communicationData.allCommunications()` changes.
     * @returns {Stats} An object containing total, successful, pending, failed, email, and SMS counts.
     */
    stats = computed(() => {
        const allComms = this.communicationData.allCommunications(); // Get all data, not just filtered, for overall stats
        let total = allComms.length;
        let successful = 0;
        let pending = 0;
        let failed = 0;
        let emails = 0;
        let sms = 0;

        allComms.forEach((comm) => {
            if (comm.status === 'SUCCESS' || comm.status === 'SMS_MESSAGE_UPLOADED') {
                successful++;
            } else if (comm.status === 'PENDING' || comm.status === 'SEND_REQUESTED') {
                pending++;
            } else if (comm.status === 'SEND_FAILED') {
                failed++;
            }

            if (comm.type === 'EMAIL') {
                emails++;
            } else if (comm.type === 'SMS') {
                sms++;
            }
        });

        console.log('CommunicationStats: Recalculated stats:', { total, successful, pending, failed, emails, sms });
        return { total, successful, pending, failed, emails, sms } as Stats; // Type assertion for clarity
    });

    /**
     * Exports the currently filtered communication data to a CSV file.
     * It uses utility functions passed from the component for consistent formatting.
     * @param formatMessageType A utility function to format message types for display in CSV.
     * @param formatStatus A utility function to format status values for display in CSV.
     */
    exportToCsv(formatMessageType: (type: string) => string, formatStatus: (status: string) => string): void {
        // Export the data that is currently visible after all filters have been applied
        const dataToExport = this.communicationFiltering.filteredCommunications();

        if (dataToExport.length === 0) {
            console.warn('CommunicationStats: No data to export. The filtered data set is empty.');
            // In a real application, you might display a user-friendly message or modal here instead of alert.
            return;
        }

        const header = ['ID', 'Email / Phone', 'Type', 'Message Type', 'Status', 'Date Sent', 'Time'];
        const rows = dataToExport.map((comm) => [
            comm.id,
            // Wrap email/phone in quotes to handle potential commas or special characters within the string
            `"${comm.emailPhone}"`,
            formatMessageType(comm.type), // Use the utility function passed from the component
            formatMessageType(comm.messageType), // Use the utility function passed from the component
            formatStatus(comm.status), // Use the utility function passed from the component
            comm.dateSent,
            comm.time
        ]);

        // Combine header and rows into a single CSV string
        const csvContent = [
            header.join(','), // Join header columns with commas
            ...rows.map((row) => row.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(',')) // Quote fields and escape existing quotes
        ].join('\n'); // Join all lines with newline characters

        // Create a Blob containing the CSV content
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

        // Create a temporary anchor element to trigger the download
        const link = document.createElement('a');
        if (link.download !== undefined) {
            // Check if the 'download' attribute is supported by the browser
            const url = URL.createObjectURL(blob); // Create a URL for the Blob
            link.setAttribute('href', url);
            link.setAttribute('download', 'communications.csv'); // Set the download filename
            link.style.visibility = 'hidden'; // Hide the link
            document.body.appendChild(link); // Append to body to make it clickable
            link.click(); // Programmatically click the link to trigger download
            document.body.removeChild(link); // Clean up the temporary link
            URL.revokeObjectURL(url); // Release the object URL
        } else {
            console.error('CommunicationStats: File download not supported in this browser.');
            // Fallback for older browsers (e.g., prompt user to copy paste the data manually)
        }
        console.log('CommunicationStats: Data export to CSV initiated.');
    }
}
