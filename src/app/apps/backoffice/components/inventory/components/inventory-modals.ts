// ==========================================================
// src/app/apps/backoffice/components/inventory/components/inventory-modals.ts
// Manages the state and data for all inventory-related modals.
// Reverted: Removed `rawContentForDisplay` and 'raw-content-display' type.
// ==========================================================
import { Injectable } from '@angular/core';
import { InventoryItem } from './interfaces';

@Injectable({
    providedIn: 'root'
})
export class InventoryModalsService {
    // Custom Alert/Confirm Modal properties
    showModal: boolean = false;
    modalTitle: string = '';
    modalMessage: string = '';
    modalType: 'alert' | 'confirm' = 'alert'; // Reverted to original types
    modalConfirmAction: (() => void) | null = null;
    modalCancelAction: (() => void) | null = null;
    // rawContentForDisplay property removed

    // Edit/View Details Modal properties
    showEditModal: boolean = false;
    showViewDetailsModal: boolean = false;
    selectedItem: InventoryItem | null = null; // The item being edited or viewed

    constructor() {
        console.log('InventoryModalsService: Service constructor called.');
    }

    // --- Custom Alert/Confirm Modal Methods ---
    /**
     * Opens a generic custom modal for alerts or confirmations.
     * @param title The title of the modal.
     * @param message The main message content.
     * @param type 'alert' for a simple message, 'confirm' for a yes/no prompt.
     * @param onConfirm Callback function to execute if 'Confirm' (or 'OK' for alert) is clicked.
     * @param onCancel Callback function to execute if 'Cancel' is clicked (only for 'confirm' type).
     */
    openCustomModal(title: string, message: string, type: 'alert' | 'confirm', onConfirm?: () => void, onCancel?: () => void): void {
        this.modalTitle = title;
        this.modalMessage = message;
        this.modalType = type;
        this.modalConfirmAction = onConfirm || null;
        this.modalCancelAction = onCancel || null;
        // rawContentForDisplay is no longer set here
        this.showModal = true;
        console.log(`InventoryModalsService: Opened custom modal: ${title} (${type})`);
    }

    /**
     * Handles the action when the confirm/OK button in the custom modal is clicked.
     */
    onModalConfirm(): void {
        if (this.modalConfirmAction) {
            this.modalConfirmAction();
        }
        this.showModal = false;
        this.resetModalActions();
    }

    /**
     * Handles the action when the cancel button in the custom modal is clicked.
     */
    onModalCancel(): void {
        if (this.modalCancelAction) {
            this.modalCancelAction();
        }
        this.showModal = false;
        this.resetModalActions();
    }

    /**
     * Resets the modal action callbacks.
     */
    private resetModalActions(): void {
        this.modalConfirmAction = null;
        this.modalCancelAction = null;
        // rawContentForDisplay is no longer reset here
    }

    // --- Add/Edit Item Modal Methods ---
    /**
     * Opens the add/edit item modal.
     * If an item is provided, it's for editing; otherwise, for adding a new item.
     * @param item The item to edit, or null for a new item.
     */
    openEditItemModal(item: InventoryItem | null): void {
        this.selectedItem = item
            ? { ...item }
            : {
                  id: -1, // Temporary ID for new item, to be replaced by service
                  productName: '',
                  category: '',
                  capacity: 0,
                  production: 0,
                  sample: 0,
                  damaged: 0,
                  cfQty: 0,
                  cfSold: 0,
                  totalInv: 0,
                  ordered: 0,
                  cfBal: 0,
                  freshBal: 0,
                  currentBal: 0,
                  status: 'Out of Stock',
                  lastUpdated: new Date()
              };
        this.showEditModal = true;
        console.log('InventoryModalsService: Opened edit modal. Editing:', !!item);
    }

    /**
     * Closes the add/edit item modal.
     */
    closeEditItemModal(): void {
        this.showEditModal = false;
        this.selectedItem = null;
        console.log('InventoryModalsService: Closed edit modal.');
    }

    // --- View Details Modal Methods ---
    /**
     * Opens the view details modal for a specific inventory item.
     * @param item The inventory item to display details for.
     */
    openViewDetailsModal(item: InventoryItem): void {
        this.selectedItem = { ...item };
        this.showViewDetailsModal = true;
        console.log('InventoryModalsService: Opened view details modal for ID:', item.id);
    }

    /**
     * Closes the view details modal.
     */
    closeViewDetailsModal(): void {
        this.showViewDetailsModal = false;
        this.selectedItem = null;
        console.log('InventoryModalsService: Closed view details modal.');
    }
}
