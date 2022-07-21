/** @template T */
export class Observable {
    currentValue;
    promise;

    /** @type {Subscription[]} */ subscriptions = [];

    constructor(initialValue) {
        if (initialValue) this.currentValue = initialValue;
    }

    /**
     * @returns {Subscription}
     * @param {( newValue: T,oldValue: T)=> void} observer
     */
    subscribe(observer) {
        var subscription = new Subscription(
            observer,
            () => (this.subscriptions = this.subscriptions.filter((x) => x != subscription))
        );
        this.subscriptions.push(subscription);
        observer(this.currentValue, null);
        return subscription;
    }

    /**
     * @param {T} value
     */
    next(value) {
        var oldValue = this.currentValue;
        this.currentValue = value;

        this.subscriptions.forEach((subscription) => {
            try {
                subscription.observer(this.currentValue, oldValue);
            } catch {
                //
            }
        });
    }

    /**
     * @return {T}
     */
    current() {
        if (this.currentValue) return this.currentValue;

        /** @type {any} */
        const empty = {};
        return empty;
    }
}

export class Subscription {
    /** @type {(oldValue, newValue)=> void} */ observer;
    /** @type {()=>void} */ unsubscribe;

    /**
     * @param {()=>void} [unsubscribeAction]
     *  @param {(oldValue, newValue)=> void} observer
     */
    constructor(observer, unsubscribeAction) {
        this.observer = observer;
        this.unsubscribe = unsubscribeAction;
    }
}
