export class Observable<T> {
    currentValue: T;
    finalized: boolean;
    resolve?: (item: T) => void;

    subscriptions: Subscription[] = [];

    constructor(initialValue: T) {
        if (initialValue != null && initialValue != undefined) this.currentValue = initialValue;
    }

    subscribe(observer: (newValue: T, oldValue: T) => void, fireInitial = false) {
        let subscription = new Subscription(this, observer);
        this.subscriptions.push(subscription);
        if (fireInitial) observer(this.current(), this.current());
        return subscription;
    }

    async next(value: T) {
        var oldValue = this.currentValue;
        this.currentValue = value;

        this.subscriptions = this.subscriptions.filter((x) => !x.unsubscribed);

        // iterate a copy: an observer may unsubscribe itself while it runs
        for (var subscription of [...this.subscriptions]) {
            try {
                var result = subscription.observer(this.currentValue, oldValue);
                if (result instanceof Promise) await result;
            } catch (error) {
                // never rethrow - one broken observer must not stop the others - but a swallowed
                // render error used to be completely invisible
                console.error('observer failed', error);
            }
        }
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
    declare public unsubscribed: boolean;

    constructor(
        public observable: Observable<any>,
        public observer: (oldValue: any, newValue: any) => any,
    ) {}

    unsubscribe() {
        this.unsubscribed = true;
        // drop the reference immediately instead of waiting for the next next()
        const index = this.observable.subscriptions.indexOf(this);
        if (index >= 0) this.observable.subscriptions.splice(index, 1);
    }
}
