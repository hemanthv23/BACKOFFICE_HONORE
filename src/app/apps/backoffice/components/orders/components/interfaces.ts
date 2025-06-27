export interface OrderItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
    total: number;
}

export interface Order {
    id: string;
    customer: string;
    email: string;
    phone: string;
    items: OrderItem[];
    totalAmount: number;
    status: 'Pending' | 'Processing' | 'Ready' | 'Completed' | 'Cancelled';
    orderDate: Date;
    deliveryDate?: Date;
    paymentStatus: 'Pending' | 'Paid' | 'Refunded';
    orderType: 'Pickup' | 'Delivery';
    notes?: string;
}
