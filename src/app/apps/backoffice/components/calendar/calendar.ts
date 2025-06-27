import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface CalendarEvent {
    id: string;
    title: string;
    date: string;
    time: string;
    type: 'Order' | 'Catering' | 'Training' | 'Holiday' | 'Reminder';
    description?: string;
}

interface CalendarDay {
    date: Date;
    isCurrentMonth: boolean;
    isToday: boolean;
    isSunday: boolean;
    isHoliday: boolean;
    events: CalendarEvent[];
}

@Component({
    selector: 'app-calendar',
    standalone: true,
    imports: [CommonModule, RouterLink, FormsModule],
    template: `
        <div class="max-w-7xl mx-auto p-4">
            <div class="mb-4">
                <button routerLink="../" class="bg-gray-800 hover:bg-gray-900 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-semibold text-xs sm:text-sm transition-colors duration-200 shadow-md flex items-center space-x-1 sm:space-x-2 w-auto">
                    <svg class="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                    </svg>
                    <span class="whitespace-nowrap">Back to Home</span>
                </button>
            </div>
            <!-- Header -->
            <div class="bg-white rounded-xl shadow-lg p-6 mb-6">
                <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Calendar & Scheduling</h1>
                <p class="text-gray-600">Manage orders, deliveries, and special events</p>
            </div>

            <!-- Stats Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div class="bg-white rounded-xl shadow-lg p-6">
                    <h3 class="text-lg font-semibold text-blue-800">Today's Orders</h3>
                    <p class="text-2xl font-bold text-blue-900">{{ getTodayEvents('Order').length }}</p>
                </div>
                <div class="bg-white rounded-xl shadow-lg p-6">
                    <h3 class="text-lg font-semibold text-green-800">Deliveries</h3>
                    <p class="text-2xl font-bold text-green-900">{{ getTodayEvents('Catering').length }}</p>
                </div>
                <div class="bg-white rounded-xl shadow-lg p-6">
                    <h3 class="text-lg font-semibold text-purple-800">Reminders</h3>
                    <p class="text-2xl font-bold text-purple-900">{{ getTodayEvents('Reminder').length }}</p>
                </div>
            </div>

            <!-- Calendar Controls -->
            <div class="bg-white rounded-xl shadow-lg p-6 mb-6">
                <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <!-- View Toggle -->
                    <div class="flex bg-gray-100 rounded-lg p-1">
                        <button
                            (click)="currentView = 'month'"
                            [class]="currentView === 'month' ? 'bg-white text-blue-600 shadow-sm px-3 py-2 rounded-md text-sm font-medium transition-all' : 'text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-all'"
                        >
                            Month
                        </button>
                        <button
                            (click)="currentView = 'week'"
                            [class]="currentView === 'week' ? 'bg-white text-blue-600 shadow-sm px-3 py-2 rounded-md text-sm font-medium transition-all' : 'text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-all'"
                        >
                            Week
                        </button>
                        <button
                            (click)="currentView = 'day'"
                            [class]="currentView === 'day' ? 'bg-white text-blue-600 shadow-sm px-3 py-2 rounded-md text-sm font-medium transition-all' : 'text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-all'"
                        >
                            Day
                        </button>
                    </div>

                    <!-- Navigation -->
                    <div class="flex items-center gap-4">
                        <button (click)="navigateCalendar(-1)" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                            </svg>
                        </button>

                        <h2 class="text-lg sm:text-xl font-semibold text-gray-900 min-w-48 text-center">
                            {{ getCurrentPeriodTitle() }}
                        </h2>

                        <button (click)="navigateCalendar(1)" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                        </button>
                    </div>

                    <!-- Today Button -->
                    <button (click)="goToToday()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">Today</button>
                </div>
            </div>

            <!-- Calendar Grid -->
            <div class="bg-white rounded-xl shadow-lg p-6 mb-6">
                <!-- Month View -->
                <div *ngIf="currentView === 'month'" class="calendar-month">
                    <!-- Weekday Headers -->
                    <div class="grid grid-cols-7 gap-1 mb-4">
                        <div *ngFor="let day of weekDays" class="text-center text-sm font-semibold text-gray-600 p-2">
                            {{ day }}
                        </div>
                    </div>

                    <!-- Calendar Days -->
                    <div class="grid grid-cols-7 gap-1">
                        <div *ngFor="let day of getCalendarDays()" (click)="selectDay(day)" [class]="getDayClasses(day)" class="min-h-24 p-2 border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors relative">
                            <div class="text-sm font-medium mb-1">
                                {{ day.date.getDate() }}
                            </div>

                            <!-- Holiday Indicator -->
                            <div *ngIf="day.isHoliday" class="absolute top-1 right-1">
                                <span class="text-red-500 text-xs">🎉</span>
                            </div>

                            <!-- Events -->
                            <div class="space-y-1">
                                <div *ngFor="let event of day.events.slice(0, 2)" [class]="getEventDotClass(event.type)" class="text-xs px-1 py-0.5 rounded truncate">
                                    {{ event.title }}
                                </div>
                                <div *ngIf="day.events.length > 2" class="text-xs text-gray-500">+{{ day.events.length - 2 }} more</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Week View -->
                <div *ngIf="currentView === 'week'" class="calendar-week">
                    <div class="grid grid-cols-8 gap-1">
                        <!-- Time Column -->
                        <div class="col-span-1">
                            <div class="h-12"></div>
                            <div *ngFor="let hour of getHours()" class="h-16 border-b border-gray-100 text-xs text-gray-500 p-1">
                                {{ hour }}
                            </div>
                        </div>

                        <!-- Week Days -->
                        <div *ngFor="let day of getWeekDays()" class="col-span-1">
                            <div class="h-12 text-center border-b border-gray-200 p-2">
                                <div class="text-sm font-semibold">{{ getWeekDayName(day.date) }}</div>
                                <div [class]="day.isToday ? 'bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mx-auto' : ''" class="text-sm">
                                    {{ day.date.getDate() }}
                                </div>
                            </div>
                            <div class="relative">
                                <div *ngFor="let hour of getHours()" class="h-16 border-b border-gray-100"></div>
                                <div *ngFor="let event of day.events" [class]="getEventDotClass(event.type)" class="absolute text-xs p-1 rounded m-1 cursor-pointer" [style.top.px]="getEventPosition(event.time)" (click)="viewEvent(event)">
                                    {{ event.title }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Day View -->
                <div *ngIf="currentView === 'day'" class="calendar-day">
                    <div class="grid grid-cols-8 gap-1">
                        <!-- Time Column -->
                        <div class="col-span-2">
                            <div class="h-12 border-b border-gray-200 p-2">
                                <h3 class="font-semibold">{{ selectedDay?.date | date: 'fullDate' }}</h3>
                            </div>
                            <div *ngFor="let hour of getHours()" class="h-16 border-b border-gray-100 text-sm text-gray-500 p-2">
                                {{ hour }}
                            </div>
                        </div>

                        <!-- Day Events -->
                        <div class="col-span-6 relative">
                            <div class="h-12 border-b border-gray-200 p-2 flex justify-end">
                                <button (click)="openAddReminderModal()" class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm">Add Reminder</button>
                            </div>
                            <div>
                                <div *ngFor="let hour of getHours()" class="h-16 border-b border-gray-100"></div>
                                <div
                                    *ngFor="let event of selectedDay?.events"
                                    [class]="getEventDotClass(event.type)"
                                    class="absolute text-sm p-2 rounded m-1 cursor-pointer min-w-48"
                                    [style.top.px]="getEventPosition(event.time) + 48"
                                    (click)="viewEvent(event)"
                                >
                                    <div class="font-medium">{{ event.title }}</div>
                                    <div class="text-xs opacity-75">{{ event.time }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Add Reminder Modal -->
            <div *ngIf="showAddReminderModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                    <h2 class="text-xl font-bold mb-4">Add Reminder</h2>

                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input [(ngModel)]="newReminder.title" type="text" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter reminder title" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Date</label>
                            <input [(ngModel)]="newReminder.date" type="date" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Time</label>
                            <input [(ngModel)]="newReminder.time" type="time" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
                            <select [(ngModel)]="newReminder.type" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <option value="Reminder">Reminder</option>
                                <option value="Order">Order</option>
                                <option value="Catering">Catering</option>
                                <option value="Training">Training</option>
                            </select>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                [(ngModel)]="newReminder.description"
                                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                rows="3"
                                placeholder="Enter description (optional)"
                            ></textarea>
                        </div>
                    </div>

                    <div class="flex justify-end gap-3 mt-6">
                        <button (click)="closeAddReminderModal()" class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">Cancel</button>
                        <button (click)="addReminder()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">Add Reminder</button>
                    </div>
                </div>
            </div>

            <!-- Event Details Modal -->
            <div *ngIf="selectedEvent" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                    <div class="flex justify-between items-start mb-4">
                        <h2 class="text-xl font-bold">{{ selectedEvent.title }}</h2>
                        <button (click)="closeEventModal()" class="text-gray-400 hover:text-gray-600">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>

                    <div class="space-y-3">
                        <div class="flex items-center gap-2">
                            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            <span>{{ selectedEvent.date }}</span>
                        </div>

                        <div class="flex items-center gap-2">
                            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span>{{ selectedEvent.time }}</span>
                        </div>

                        <div class="flex items-center gap-2">
                            <span [class]="getEventTypeClass(selectedEvent.type)">{{ selectedEvent.type }}</span>
                        </div>

                        <div *ngIf="selectedEvent.description" class="mt-4">
                            <h4 class="font-medium text-gray-900 mb-2">Description</h4>
                            <p class="text-gray-600">{{ selectedEvent.description }}</p>
                        </div>
                    </div>

                    <div class="flex justify-end gap-3 mt-6">
                        <button *ngIf="selectedEvent.type === 'Reminder'" (click)="deleteEvent(selectedEvent)" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">Delete</button>
                        <button (click)="closeEventModal()" class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">Close</button>
                    </div>
                </div>
            </div>

            <!-- Upcoming Events -->
            <div class="bg-white rounded-xl shadow-lg p-6 mb-6">
                <h3 class="text-xl font-semibold mb-4">Upcoming Events</h3>
                <div class="space-y-4">
                    <div *ngFor="let event of getUpcomingEvents()" class="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg gap-2">
                        <div class="flex-1">
                            <p class="font-semibold">{{ event.title }}</p>
                            <p class="text-sm text-gray-600">{{ event.date }} • {{ event.time }}</p>
                            <p *ngIf="event.description" class="text-sm text-gray-500 mt-1">{{ event.description }}</p>
                        </div>
                        <span [class]="getEventTypeClass(event.type)">{{ event.type }}</span>
                    </div>
                </div>

                <div *ngIf="getUpcomingEvents().length === 0" class="text-center text-gray-500 py-8">No upcoming events</div>
            </div>
        </div>
    `
})
export class Calendar implements OnInit {
    currentView: 'month' | 'week' | 'day' = 'month';
    currentDate = new Date();
    selectedDay: CalendarDay | null = null;
    selectedEvent: CalendarEvent | null = null;
    showAddReminderModal = false;

    weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Sample events with holidays and reminders
    events: CalendarEvent[] = [
        { id: '1', title: 'Wedding Cake Order - Sharma Family', date: '2025-06-15', time: '10:00', type: 'Order' },
        { id: '2', title: 'Birthday Party Catering', date: '2025-06-16', time: '14:00', type: 'Catering' },
        { id: '3', title: 'Staff Training Session', date: '2025-06-18', time: '09:00', type: 'Training' },
        { id: '4', title: 'Independence Day', date: '2025-08-15', time: '00:00', type: 'Holiday' },
        { id: '5', title: 'Gandhi Jayanti', date: '2025-10-02', time: '00:00', type: 'Holiday' },
        { id: '6', title: 'Diwali', date: '2025-11-01', time: '00:00', type: 'Holiday' },
        { id: '7', title: 'Christmas', date: '2025-12-25', time: '00:00', type: 'Holiday' }
    ];

    // New reminder object
    newReminder: Partial<CalendarEvent> = {
        title: '',
        date: '',
        time: '09:00',
        type: 'Reminder',
        description: ''
    };

    ngOnInit() {
        this.currentDate = new Date();
        this.selectedDay = this.createCalendarDay(new Date());
        console.log('Calendar component loaded!');
    }

    // Navigation methods
    navigateCalendar(direction: number) {
        const currentDate = new Date(this.currentDate);

        switch (this.currentView) {
            case 'month':
                currentDate.setMonth(currentDate.getMonth() + direction);
                break;
            case 'week':
                currentDate.setDate(currentDate.getDate() + direction * 7);
                break;
            case 'day':
                currentDate.setDate(currentDate.getDate() + direction);
                break;
        }

        this.currentDate = currentDate;

        if (this.currentView === 'day') {
            this.selectedDay = this.createCalendarDay(this.currentDate);
        }
    }

    goToToday() {
        this.currentDate = new Date();
        if (this.currentView === 'day') {
            this.selectedDay = this.createCalendarDay(this.currentDate);
        }
    }

    getCurrentPeriodTitle(): string {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long'
        };

        switch (this.currentView) {
            case 'month':
                return this.currentDate.toLocaleDateString('en-US', options);
            case 'week':
                const weekStart = this.getWeekStart(this.currentDate);
                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekEnd.getDate() + 6);
                return `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
            case 'day':
                return this.currentDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            default:
                return '';
        }
    }

    // Calendar generation methods
    getCalendarDays(): CalendarDay[] {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        const days: CalendarDay[] = [];
        const currentDate = new Date(startDate);

        for (let i = 0; i < 42; i++) {
            days.push(this.createCalendarDay(new Date(currentDate)));
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return days;
    }

    getWeekDays(): CalendarDay[] {
        const weekStart = this.getWeekStart(this.currentDate);
        const days: CalendarDay[] = [];

        for (let i = 0; i < 7; i++) {
            const date = new Date(weekStart);
            date.setDate(date.getDate() + i);
            days.push(this.createCalendarDay(date));
        }

        return days;
    }

    private getWeekStart(date: Date): Date {
        const start = new Date(date);
        start.setDate(start.getDate() - start.getDay());
        return start;
    }

    private createCalendarDay(date: Date): CalendarDay {
        const today = new Date();
        const dayEvents = this.getEventsForDate(date);

        return {
            date: new Date(date),
            isCurrentMonth: date.getMonth() === this.currentDate.getMonth(),
            isToday: this.isSameDate(date, today),
            isSunday: date.getDay() === 0,
            isHoliday: dayEvents.some((event) => event.type === 'Holiday'),
            events: dayEvents
        };
    }

    // Day selection and styling
    selectDay(day: CalendarDay) {
        this.selectedDay = day;
        if (this.currentView === 'month') {
            this.currentView = 'day';
            this.currentDate = new Date(day.date);
        }
    }

    getDayClasses(day: CalendarDay): string {
        let classes = 'transition-all duration-200 ';

        if (!day.isCurrentMonth) {
            classes += 'text-gray-400 bg-gray-50 ';
        } else {
            classes += 'text-gray-900 ';
        }

        if (day.isToday) {
            classes += 'bg-blue-100 border-blue-300 ';
        }

        if (day.isSunday && day.isCurrentMonth) {
            classes += 'bg-red-50 border-red-200 ';
        }

        if (day.isHoliday) {
            classes += 'bg-yellow-50 border-yellow-300 ';
        }

        classes += 'hover:shadow-md ';

        return classes;
    }

    // Event management
    getEventsForDate(date: Date): CalendarEvent[] {
        const dateString = this.formatDateString(date);
        return this.events.filter((event) => event.date === dateString);
    }

    getTodayEvents(type?: string): CalendarEvent[] {
        const today = this.formatDateString(new Date());
        let todayEvents = this.events.filter((event) => event.date === today);

        if (type) {
            todayEvents = todayEvents.filter((event) => event.type === type);
        }

        return todayEvents;
    }

    getUpcomingEvents(): CalendarEvent[] {
        const today = new Date();
        const todayString = this.formatDateString(today);

        return this.events
            .filter((event) => event.date >= todayString && event.type !== 'Holiday')
            .sort((a, b) => {
                if (a.date === b.date) {
                    return a.time.localeCompare(b.time);
                }
                return a.date.localeCompare(b.date);
            })
            .slice(0, 5);
    }

    // Event styling
    getEventTypeClass(type: string): string {
        switch (type) {
            case 'Order':
                return 'px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800';
            case 'Catering':
                return 'px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800';
            case 'Training':
                return 'px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800';
            case 'Holiday':
                return 'px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800';
            case 'Reminder':
                return 'px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800';
            default:
                return 'px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800';
        }
    }

    getEventDotClass(type: string): string {
        switch (type) {
            case 'Order':
                return 'bg-blue-200 text-blue-800 border-l-4 border-blue-500';
            case 'Catering':
                return 'bg-green-200 text-green-800 border-l-4 border-green-500';
            case 'Training':
                return 'bg-purple-200 text-purple-800 border-l-4 border-purple-500';
            case 'Holiday':
                return 'bg-yellow-200 text-yellow-800 border-l-4 border-yellow-500';
            case 'Reminder':
                return 'bg-orange-200 text-orange-800 border-l-4 border-orange-500';
            default:
                return 'bg-gray-200 text-gray-800 border-l-4 border-gray-500';
        }
    }

    // Week and Day view helpers
    getHours(): string[] {
        const hours = [];
        for (let i = 0; i < 24; i++) {
            const hour = i.toString().padStart(2, '0');
            hours.push(`${hour}:00`);
        }
        return hours;
    }

    getWeekDayName(date: Date): string {
        return date.toLocaleDateString('en-US', { weekday: 'short' });
    }

    getEventPosition(time: string): number {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 64 + (minutes * 64) / 60; // 64px per hour
    }

    // Modal management
    openAddReminderModal() {
        this.newReminder = {
            title: '',
            date: this.selectedDay ? this.formatDateString(this.selectedDay.date) : this.formatDateString(new Date()),
            time: '09:00',
            type: 'Reminder',
            description: ''
        };
        this.showAddReminderModal = true;
    }

    closeAddReminderModal() {
        this.showAddReminderModal = false;
        this.newReminder = {
            title: '',
            date: '',
            time: '09:00',
            type: 'Reminder',
            description: ''
        };
    }

    addReminder() {
        if (this.newReminder.title && this.newReminder.date && this.newReminder.time) {
            const newEvent: CalendarEvent = {
                id: Date.now().toString(),
                title: this.newReminder.title,
                date: this.newReminder.date,
                time: this.newReminder.time,
                type: this.newReminder.type as CalendarEvent['type'],
                description: this.newReminder.description
            };

            this.events.push(newEvent);
            this.closeAddReminderModal();

            // Refresh selected day if it matches the new event date
            if (this.selectedDay && this.formatDateString(this.selectedDay.date) === newEvent.date) {
                this.selectedDay = this.createCalendarDay(this.selectedDay.date);
            }
        }
    }

    viewEvent(event: CalendarEvent) {
        this.selectedEvent = event;
    }

    closeEventModal() {
        this.selectedEvent = null;
    }

    deleteEvent(event: CalendarEvent) {
        const index = this.events.findIndex((e) => e.id === event.id);
        if (index > -1) {
            this.events.splice(index, 1);
            this.closeEventModal();

            // Refresh selected day
            if (this.selectedDay) {
                this.selectedDay = this.createCalendarDay(this.selectedDay.date);
            }
        }
    }

    // Utility methods
    private formatDateString(date: Date): string {
        return date.toISOString().split('T')[0];
    }

    private isSameDate(date1: Date, date2: Date): boolean {
        return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
    }
}
