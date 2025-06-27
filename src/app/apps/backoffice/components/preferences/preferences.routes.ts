// ================================
// src/app/apps/backoffice/components/preferences/preferences.routes.ts
// Defines the routing for the Preferences module.
// ================================
import { Routes } from '@angular/router';
import { Preferences } from './preferences'; // Import the main Preferences component

export const PREFERENCES_ROUTES: Routes = [
    {
        path: '',
        component: Preferences,
        title: 'App Preferences'
    }
    // Add more routes here if you have sub-pages within Preferences
];
