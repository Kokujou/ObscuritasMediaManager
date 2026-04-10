export {};

declare global {
    interface Date {
        addDays(days: number): Date;
    }
}

Date.prototype.addDays = function (this: Date, days: number): Date {
    const date = new Date(this.valueOf());
    date.setHours(23, 59, 59, 999);
    date.setDate(date.getDate() + days);
    return date;
};
