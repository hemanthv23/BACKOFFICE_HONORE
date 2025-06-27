// ================================
// src/app/apps/backoffice/components/preferences/components/preferences-modals.ts
// Manages the state and logic for all modal dialogs in the Preferences module.
// Encapsulates form data, editing state, and custom message/confirmation modals.
// ================================
import { Injectable } from '@angular/core';
import { Slab, SlabFormData, CustomModalData } from './preferences-interfaces'; // Import interfaces
import { PreferencesDataService } from './preferences-data'; // For pre-filling edit form

@Injectable({
    providedIn: 'root'
})
export class PreferencesModalsService {
    // State for Add/Edit Slab Form Modal
    showAddForm: boolean = false;
    editingSlabId: number | null = null; // Stores the ID of the slab being edited, or null if adding

    // Data model for the slab form (used for both adding and editing)
    formData: SlabFormData = {
        customerType: '',
        amountType: '',
        minAmount: '',
        maxAmount: '',
        amountValue: '',
        gstAmount: ''
    };

    // Predefined lists for dropdowns in the form
    customerTypes: string[] = ['Individual', 'Business', 'Commercial', 'POS', 'Community Support'];
    amountTypes: string[] = ['Fixed', 'Percentage', 'Tiered'];

    // State for Generic Custom Modal (replaces alert/confirm)
    showCustomModal: boolean = false;
    customModalData: CustomModalData = {
        title: '',
        message: '',
        type: 'alert', // 'alert' or 'confirm'
        onConfirm: null,
        onCancel: null
    };

    // State for simple message box
    showMessageBox: boolean = false;
    messageBoxContent: string = '';
    messageBoxTitle: string = 'Notification'; // Default title for message box

    constructor(private dataService: PreferencesDataService) {
        console.log('PreferencesModalsService initialized.');
    }

    // --- Add/Edit Slab Form Modal Methods ---
    /**
     * Opens the form modal for adding a new slab.
     * Resets the form and clears any editing state.
     */
    openAddForm(): void {
        this.resetForm();
        this.editingSlabId = null;
        this.showAddForm = true;
        console.log('PreferencesModalsService: Opened add slab form.');
    }

    /**
     * Opens the form modal for editing an existing slab.
     * Populates the form with the slab's current data.
     * @param slabId The ID of the slab to edit.
     */
    openEditForm(slabId: number): void {
        const slabToEdit = this.dataService.findSlabById(slabId);
        if (slabToEdit) {
            this.editingSlabId = slabId;
            // Populate formData with existing slab data
            this.formData = {
                customerType: slabToEdit.customerType,
                amountType: slabToEdit.slabType, // Assuming slabType corresponds to amountType in form
                minAmount: slabToEdit.minAmount,
                maxAmount: slabToEdit.maxAmount,
                amountValue: slabToEdit.amountValue,
                gstAmount: slabToEdit.gstValue
            };
            this.showAddForm = true;
            console.log('PreferencesModalsService: Opened edit slab form for ID:', slabId);
        } else {
            this.showAlertDialog('Error', 'Slab not found for editing.');
            console.warn('PreferencesModalsService: Slab not found for editing with ID:', slabId);
        }
    }

    /**
     * Closes the Add/Edit Slab form modal and resets the form.
     */
    closeAddForm(): void {
        this.showAddForm = false;
        this.editingSlabId = null;
        this.resetForm();
        console.log('PreferencesModalsService: Closed add/edit slab form.');
    }

    /**
     * Resets the slab form data to its initial empty state.
     */
    resetForm(): void {
        this.formData = {
            customerType: '',
            amountType: '',
            minAmount: '',
            maxAmount: '',
            amountValue: '',
            gstAmount: ''
        };
        console.log('PreferencesModalsService: Slab form reset.');
    }

    // --- Custom Modal (Alert/Confirm) Methods ---
    /**
     * Displays a generic alert dialog.
     * @param title The title of the alert.
     * @param message The message content of the alert.
     */
    showAlertDialog(title: string, message: string): void {
        this.customModalData = {
            title: title,
            message: message,
            type: 'alert',
            onConfirm: () => this.closeCustomModal(),
            onCancel: null // No cancel for alert
        };
        this.showCustomModal = true;
        console.log(`PreferencesModalsService: Displaying alert: "${title}" - "${message}"`);
    }

    /**
     * Displays a generic confirmation dialog.
     * @param title The title of the confirmation.
     * @param message The message content of the confirmation.
     * @param onConfirm Callback function to execute if 'Confirm' is clicked.
     */
    showConfirmDialog(title: string, message: string, onConfirm: () => void): void {
        this.customModalData = {
            title: title,
            message: message,
            type: 'confirm',
            onConfirm: () => {
                onConfirm(); // Execute provided callback
                this.closeCustomModal();
            },
            onCancel: () => this.closeCustomModal() // Just close on cancel
        };
        this.showCustomModal = true;
        console.log(`PreferencesModalsService: Displaying confirmation: "${title}" - "${message}"`);
    }

    /**
     * Closes the generic custom modal.
     * Resets its data and callbacks.
     */
    closeCustomModal(): void {
        this.showCustomModal = false;
        this.customModalData = {
            title: '',
            message: '',
            type: 'alert',
            onConfirm: null,
            onCancel: null
        };
        console.log('PreferencesModalsService: Custom modal closed.');
    }

    // --- Simple Message Box (for success/quick notifications) ---
    /**
     * Displays a simple, non-blocking message box.
     * @param message The message to display.
     * @param title Optional title for the message box. Defaults to 'Notification'.
     */
    showMessage(message: string, title: string = 'Notification'): void {
        this.messageBoxContent = message;
        this.messageBoxTitle = title;
        this.showMessageBox = true;
        console.log(`PreferencesModalsService: Displaying message box: "${title}" - "${message}"`);
    }

    /**
     * Closes the simple message box.
     */
    closeMessageBox(): void {
        this.showMessageBox = false;
        this.messageBoxContent = '';
        this.messageBoxTitle = 'Notification';
        console.log('PreferencesModalsService: Message box closed.');
    }

    // --- General Close All Modals ---
    /**
     * Closes all possible modals controlled by this service.
     * Useful for ensuring a clean state.
     */
    closeAllModals(): void {
        this.closeAddForm(); // Closes add/edit form
        this.closeCustomModal(); // Closes alert/confirm modal
        this.closeMessageBox(); // Closes simple message box
        console.log('PreferencesModalsService: All modals closed.');
    }
}
