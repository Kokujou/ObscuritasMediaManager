export class TimeSpan {
    days = 0;
    hours = 0;
    minutes = 0;
    seconds = 0;
    milliseconds = 0;

    static fromString(value: string) {
        var result = new TimeSpan();
        if (!value) return result;
        var splitted = value.split(':');

        if (splitted?.length <= 1) return result;

        if (splitted[0].includes('.')) {
            var dayHourSplit = splitted[0].split('.');
            result.days = Number.parseInt(dayHourSplit[0]);
            result.hours = Number.parseInt(dayHourSplit[1]);
        } else result.hours = Number.parseInt(splitted[0]);

        result.minutes = Number.parseInt(splitted[1]);

        if (splitted.length < 3) return result;
        if (splitted[2].includes('.')) {
            var millisecondSplit = splitted[2].split('.');
            result.seconds = Number.parseInt(millisecondSplit[0]);
            result.milliseconds = Number.parseInt(millisecondSplit[1]);
        } else result.seconds = Number.parseInt(splitted[2]);

        return result;
    }

    static format(input: string) {
        var timespan = TimeSpan.fromString(input);
        var hours = timespan.days * 24 + timespan.hours;
        var result = '';
        if (hours) result += hours + ' Std. ';
        if (timespan.minutes) result += timespan.minutes + ' Min.';
        return result;
    }

    toString() {
        return (
            this.days +
            '.' +
            this.hours.toString().padStart(2, '0') +
            ':' +
            this.minutes.toString().padStart(2, '0') +
            ':' +
            this.seconds.toString().padStart(2, '0')
        );
    }
}
