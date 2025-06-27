// ==========================================================
// src/app/apps/backoffice/components/communication/components/communication-filtering.ts
// Contains logic for filtering and searching communications.
// ==========================================================
import { Injectable, computed, signal, effect, OnDestroy } from '@angular/core';
import { Communication } from './interfaces';
import { CommunicationData } from './communication-data';

@Injectable({
    providedIn: 'root'
})
export class CommunicationFiltering implements OnDestroy {
    searchTerm = signal('');
    statusFilter = signal('All');
    typeFilter = signal('All');
    messageTypeFilter = signal('All');

    private searchDebounceTimeout: any;
    public debouncedSearchTerm = signal('');

    constructor(private communicationData: CommunicationData) {
        console.log('CommunicationFiltering: Service constructor called.');

        effect(
            () => {
                const currentSearchTerm = this.searchTerm();
                console.log(`CommunicationFiltering: 'searchTerm' changed to: '${currentSearchTerm}'. Setting up debounce.`);
                clearTimeout(this.searchDebounceTimeout);
                this.searchDebounceTimeout = setTimeout(() => {
                    this.debouncedSearchTerm.set(currentSearchTerm);
                    console.log(`CommunicationFiltering: Debounced search term updated to: '${currentSearchTerm}'.`);
                }, 300);
            },
            { allowSignalWrites: true }
        );

        effect(() => {
            // These dependencies ensure that `filteredCommunications` re-runs when any filter changes.
            this.debouncedSearchTerm();
            this.statusFilter();
            this.typeFilter();
            this.messageTypeFilter();
            // Added a more explicit log here to confirm the effect is indeed running.
            console.log('CommunicationFiltering: A filter signal or debounced search term changed. `filteredCommunications` computed signal will now re-evaluate.');
        });
    }

    filteredCommunications = computed(() => {
        const comms = this.communicationData.allCommunications(); // Access the signal value
        const searchTerm = this.debouncedSearchTerm().toLowerCase();
        const statusFilter = this.statusFilter();
        const typeFilter = this.typeFilter();
        const messageTypeFilter = this.messageTypeFilter();

        console.log(`CommunicationFiltering: filteredCommunications computed - START. Original items: ${comms.length}. Current filters: Search='${searchTerm}', Status='${statusFilter}', Type='${typeFilter}', MsgType='${messageTypeFilter}'`);

        const filtered = comms.filter((comm) => {
            if (statusFilter !== 'All' && comm.status !== statusFilter) {
                // console.log(`  - Skipping ID ${comm.id}: Status filter '${statusFilter}' mismatch ('${comm.status}')`);
                return false;
            }
            if (typeFilter !== 'All' && comm.type !== typeFilter) {
                // console.log(`  - Skipping ID ${comm.id}: Type filter '${typeFilter}' mismatch ('${comm.type}')`);
                return false;
            }
            if (messageTypeFilter !== 'All' && comm.messageType !== messageTypeFilter) {
                // console.log(`  - Skipping ID ${comm.id}: Message Type filter '${messageTypeFilter}' mismatch ('${comm.messageType}')`);
                return false;
            }

            if (searchTerm && (!comm.searchableText || !comm.searchableText.includes(searchTerm))) {
                // console.log(`  - Skipping ID ${comm.id}: Search term '${searchTerm}' not found in '${comm.searchableText}'`);
                return false;
            }

            // console.log(`  - Including ID ${comm.id}`);
            return true;
        });

        console.log('CommunicationFiltering: filteredCommunications computed - END. Filtered count:', filtered.length);
        return filtered;
    });

    ngOnDestroy(): void {
        if (this.searchDebounceTimeout) {
            clearTimeout(this.searchDebounceTimeout);
            console.log('CommunicationFiltering: Debounce timeout cleared on destroy.');
        }
    }
}
