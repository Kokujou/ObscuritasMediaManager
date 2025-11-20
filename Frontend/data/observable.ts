export class Observable<T> {
    currentValue: T;
    finalized: boolean;
    resolve?: (item: T) => void;

    subscriptions: Subscription[] = [];

    constructor(initialValue: T) {
        if (initialValue != null && initialValue != undefined) this.currentValue = initialValue;
    }

    subscribe(observer: (newValue: T, oldValue: T) => void, fireInitial = false) {
        let subscription = new Subscription(observer);
        this.subscriptions.push(subscription);
        if (fireInitial) observer(this.current(), this.current());
        return subscription;
    }

    next(value: T) {
        var oldValue = this.currentValue;
        this.currentValue = value;

        this.subscriptions = this.subscriptions.filter((x) => !x.unsubscribed);
        this.subscriptions.forEach(async (subscription) => {
            try {
                var result = subscription.observer(this.currentValue, oldValue);
                if (result instanceof Promise) await result;
            } catch {
                //
            }
        });
    }

    refresh() {
        this.next(this.currentValue);
    }

    finalize() {
        this.finalized = true;
        if (this.resolve) this.resolve(this.currentValue);
    }

    current() {
        if (this.currentValue != null && this.currentValue != undefined) return this.currentValue;

        const empty = {} as T;
        return empty;
    }

    toPromise() {
        return new Promise<T>((resolve) => {
            if (!this.finalized) this.resolve = resolve;
            else resolve(this.currentValue);
        });
    }
}

export class Subscription {
    public declare unsubscribed: boolean;

    constructor(public observer: (oldValue: any, newValue: any) => any) {}

    unsubscribe() {
        this.unsubscribed = true;
    }
}
