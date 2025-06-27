// ==========================================================
// src/app/apps/backoffice/components/communication/components/communication-data.ts
// Handles data fetching and storage for communications.
// ==========================================================
import { Injectable, signal } from '@angular/core';
import { Communication } from './interfaces';

@Injectable({
    providedIn: 'root'
})
export class CommunicationData {
    allCommunications = signal<Communication[]>([]);

    constructor() {
        console.log('CommunicationData: Service constructor called.');
        this.fetchInitialData();
    }

    fetchInitialData(): void {
        console.log('CommunicationData: fetchInitialData() called. Simulating data load.');
        // Updated mock data to contain exactly 15 items as per requirement.
        const mockData: Communication[] = [
            { id: 1, emailPhone: 'john.doe@example.com', type: 'EMAIL', messageType: 'SHIPPING_UPDATE', status: 'SUCCESS', dateSent: '2023-04-01', time: '10:00' },
            { id: 2, emailPhone: '123-456-7890', type: 'SMS', messageType: 'PROMOTIONAL_OFFER', status: 'PENDING', dateSent: '2023-04-01', time: '11:00' },
            { id: 3, emailPhone: 'jane.smith@example.com', type: 'EMAIL', messageType: 'NEW_USER_REGISTRATION', status: 'SEND_FAILED', dateSent: '2023-04-02', time: '09:15' },
            { id: 4, emailPhone: '987-654-3210', type: 'SMS', messageType: 'PASSWORD_RESET', status: 'SUCCESS', dateSent: '2023-04-02', time: '14:30' },
            { id: 5, emailPhone: 'alice.w@example.com', type: 'EMAIL', messageType: 'NEW_ORDER_CONFIRMATION', status: 'SUCCESS', dateSent: '2023-04-03', time: '16:00' },
            { id: 6, emailPhone: '555-111-2222', type: 'SMS', messageType: 'SHIPPING_UPDATE', status: 'SMS_MESSAGE_UPLOADED', dateSent: '2023-04-03', time: '17:45' },
            { id: 7, emailPhone: 'bob.brown@example.com', type: 'EMAIL', messageType: 'PROMOTIONAL_OFFER', status: 'PENDING', dateSent: '2023-04-04', time: '08:30' },
            { id: 8, emailPhone: '777-888-9999', type: 'SMS', messageType: 'NEW_USER_REGISTRATION', status: 'SEND_REQUESTED', dateSent: '2023-04-04', time: '12:00' },
            { id: 9, emailPhone: 'charlie.d@example.com', type: 'EMAIL', messageType: 'PASSWORD_RESET', status: 'SUCCESS', dateSent: '2023-04-05', time: '13:00' },
            { id: 10, emailPhone: '222-333-4444', type: 'SMS', messageType: 'NEW_ORDER_CONFIRMATION', status: 'SUCCESS', dateSent: '2023-04-05', time: '15:20' },
            { id: 11, emailPhone: 'emma.l@example.com', type: 'EMAIL', messageType: 'SHIPPING_UPDATE', status: 'PENDING', dateSent: '2023-04-06', time: '10:10' },
            { id: 12, emailPhone: '444-555-6666', type: 'SMS', messageType: 'PROMOTIONAL_OFFER', status: 'SEND_FAILED', dateSent: '2023-04-06', time: '11:11' },
            { id: 13, emailPhone: 'frank.g@example.com', type: 'EMAIL', messageType: 'NEW_USER_REGISTRATION', status: 'SUCCESS', dateSent: '2023-04-07', time: '09:00' },
            { id: 14, emailPhone: '666-777-8888', type: 'SMS', messageType: 'PASSWORD_RESET', status: 'SMS_MESSAGE_UPLOADED', dateSent: '2023-04-07', time: '14:00' },
            { id: 15, emailPhone: 'grace.h@example.com', type: 'EMAIL', messageType: 'NEW_ORDER_CONFIRMATION', status: 'PENDING', dateSent: '2023-04-08', time: '16:00' }
        ];

        const processedData = mockData.map((item) => ({
            ...item,
            searchableText: `${item.emailPhone} ${item.emailPhone.replace(/[-\s]/g, '')} ${item.messageType} ${item.type} ${item.status}`.toLowerCase()
        }));

        this.allCommunications.set(processedData);
        console.log(`CommunicationData: Loaded ${processedData.length} communications and set 'searchableText' for filtering.`);
    }

    fetchFreshData(): void {
        console.log('CommunicationData: fetchFreshData() called. Re-fetching initial data.');
        this.fetchInitialData();
    }
}
