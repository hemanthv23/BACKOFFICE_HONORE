import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap, map, switchMap } from 'rxjs/operators';

import { Coupon, CouponStatusEnum, CouponTypeEnum } from '../interfaces';

@Injectable({
    providedIn: 'root'
})
export class CouponData {
    private apiUrl = 'https://localhost:7233/api/Coupons';

    public allCoupons$: BehaviorSubject<Coupon[]> = new BehaviorSubject<Coupon[]>([]);

    constructor(private http: HttpClient) {}

    getAllCoupons(): Observable<Coupon[]> {
        return this.http.get<Coupon[]>(this.apiUrl).pipe(
            tap((coupons) => {
                this.allCoupons$.next(coupons);
                console.log('Coupons fetched from API:', coupons);
            }),
            catchError(this.handleError<Coupon[]>('getAllCoupons', []))
        );
    }

    getCouponById(id: number): Observable<Coupon> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.get<Coupon>(url).pipe(catchError(this.handleError<Coupon>(`getCouponById id=${id}`)));
    }

    addCoupon(coupon: Coupon): Observable<Coupon> {
        const couponToSend = {
            name: coupon.name,
            code: coupon.code,
            description: coupon.description,
            discountType: Number(coupon.discountType),
            discountValue: coupon.discountValue,
            status: Number(coupon.status),
            startDate: coupon.startDate,
            endDate: coupon.endDate,
            usageCount: coupon.usageCount,
            maxUsage: coupon.maxUsage,
            customerName: coupon.customerName,
            communityName: coupon.communityName,
            type: Number(coupon.type)
        };

        return this.http.post<Coupon>(this.apiUrl, couponToSend).pipe(
            tap((newCoupon) => {
                const currentCoupons = this.allCoupons$.getValue();
                this.allCoupons$.next([...currentCoupons, newCoupon]);
                console.log('Coupon added via API:', newCoupon);
            }),
            catchError(this.handleError<Coupon>('addCoupon'))
        );
    }

    updateCoupon(updatedCoupon: Coupon): Observable<any> {
        const url = `${this.apiUrl}/${updatedCoupon.id}`;

        const couponToSend = {
            id: updatedCoupon.id, // ✅ INCLUDE ID in the body
            name: updatedCoupon.name,
            code: updatedCoupon.code,
            description: updatedCoupon.description,
            discountType: Number(updatedCoupon.discountType),
            discountValue: updatedCoupon.discountValue,
            status: Number(updatedCoupon.status),
            startDate: updatedCoupon.startDate,
            endDate: updatedCoupon.endDate,
            usageCount: updatedCoupon.usageCount,
            maxUsage: updatedCoupon.maxUsage,
            customerName: updatedCoupon.customerName,
            communityName: updatedCoupon.communityName,
            type: Number(updatedCoupon.type),
            updatedAt: new Date().toISOString()
        };

        return this.http.put(url, couponToSend).pipe(
            tap(() => {
                const currentCoupons = this.allCoupons$.getValue();
                const index = currentCoupons.findIndex((c) => c.id === updatedCoupon.id);
                if (index !== -1) {
                    currentCoupons[index] = { ...updatedCoupon, ...couponToSend };
                    this.allCoupons$.next([...currentCoupons]);
                    console.log('Coupon updated via API:', couponToSend);
                }
            }),
            catchError(this.handleError<any>('updateCoupon'))
        );
    }

    deleteCoupon(id: number): Observable<any> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.delete(url).pipe(
            tap(() => {
                const currentCoupons = this.allCoupons$.getValue();
                this.allCoupons$.next(currentCoupons.filter((coupon) => coupon.id !== id));
                console.log('Coupon deleted via API:', id);
            }),
            catchError(this.handleError<any>('deleteCoupon'))
        );
    }

    updateCouponStatus(id: number, newStatus: CouponStatusEnum): Observable<any> {
        return this.getCouponById(id).pipe(
            map((coupon) => {
                if (!coupon) throw new Error(`Coupon with ID ${id} not found.`);
                const updatedCoupon = {
                    ...coupon,
                    status: newStatus,
                    updatedAt: new Date().toISOString()
                };
                return updatedCoupon;
            }),
            switchMap((updatedCoupon) => this.updateCoupon(updatedCoupon)),
            catchError(this.handleError<any>('updateCouponStatus'))
        );
    }

    getCustomerCoupons(): Observable<Coupon[]> {
        const url = `${this.apiUrl}/customer`;
        return this.http.get<Coupon[]>(url).pipe(catchError(this.handleError<Coupon[]>('getCustomerCoupons', [])));
    }

    getCommunityCoupons(): Observable<Coupon[]> {
        const url = `${this.apiUrl}/community`;
        return this.http.get<Coupon[]>(url).pipe(catchError(this.handleError<Coupon[]>('getCommunityCoupons', [])));
    }

    searchCouponsByName(name: string): Observable<Coupon[]> {
        let httpParams = new HttpParams();
        if (name) {
            httpParams = httpParams.set('name', name);
        }
        const url = `${this.apiUrl}/search`;
        return this.http.get<Coupon[]>(url, { params: httpParams }).pipe(catchError(this.handleError<Coupon[]>('searchCouponsByName', [])));
    }

    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.error(`API Error - ${operation}:`, error);
            return throwError(() => new Error(`An error occurred during ${operation}. Please try again later. Details: ${error.message || error.statusText || 'Unknown error'}`));
        };
    }
}
