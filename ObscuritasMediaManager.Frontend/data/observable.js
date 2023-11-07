/** @template T */
export class Observable {
    currentValue;

    /** @type {Subscription[]} */ subscriptions = [];

    /** @param {T} initialValue */
    constructor(initialValue) {
        if (initialValue != null && initialValue != undefined) this.currentValue = initialValue;
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

    refresh() {
        this.next(this.currentValue);
    }

    /**
     * @return {T}
     */
    current() {
        if (this.currentValue != null && this.currentValue != undefined) return this.currentValue;

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
