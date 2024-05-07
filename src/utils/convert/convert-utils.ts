// Constants for time conversion
const GU_MILLISECOND = 1;
const GU_SECOND = 1000 * GU_MILLISECOND;
const GU_UNION = 60 * GU_SECOND;
const GU_PERIOD = 60 * GU_UNION;
const GU_EQUINOX = 24 * GU_PERIOD;
const GU_SEMESTER = 45 * GU_EQUINOX;
const GU_YEAR = 32 * GU_SEMESTER;

// GU Epoch details
const GU_EPOCH_YEAR = -1853;
const GU_EPOCH_MONTH = 3;
const GU_EPOCH_DAY = 26;
const GU_EPOCH_HOUR = 10;
const GU_EPOCH_MINUTE = 54;
const GU_EPOCH_SECOND = 28;
const GU_EPOCH_MILLISECOND = 150;

const GUYS_MAX = Number.MAX_SAFE_INTEGER;
const SEMESTERS_MAX = 32;
const EQUINOXES_MAX = 45;
const PERIODS_MAX = 24;
const UNIONS_MAX = 60;
const DUONS_MAX = 60;
const TRIONS_MAX = 999;

// Correction for the GU calendar
const correctionDays = 59;

// Helper functions
function isLeapYear(year: number): boolean {
    if (year % 400 === 0) return true;
    if (year % 100 === 0) return false;
    return year % 4 === 0;
}

function daysInMonth(year: number, month: number): number {
    if (month === 2) {
        return isLeapYear(year) ? 29 : 28;
    } else if ([4, 6, 9, 11].includes(month)) {
        return 30;
    } else {
        return 31;
    }
}

function daysSinceEpoch(year: number, month: number, day: number): number {
    let days = 0;
    const yearStep = GU_EPOCH_YEAR < year ? 1 : -1;
    for (let y = GU_EPOCH_YEAR; y !== year; y += yearStep) {
        days += isLeapYear(y) ? 366 : 365;
    }
    for (let m = 1; m < month; m++) {
        days += daysInMonth(year, m);
    }
    days += day;
    days -=
        year > GU_EPOCH_YEAR ||
        (year === GU_EPOCH_YEAR && (month > GU_EPOCH_MONTH || (month === GU_EPOCH_MONTH && day >= GU_EPOCH_DAY)))
            ? GU_EPOCH_DAY
            : GU_EPOCH_DAY - days;
    return days;
}

function totalMillisecondsSinceEpoch(
    year: number,
    month: number,
    day: number,
    hour: number,
    minute: number,
    second: number,
    millisecond: number
): number {
    const days = daysSinceEpoch(year, month, day);
    const totalHours = days * 24 + hour - GU_EPOCH_HOUR;
    const totalMinutes = totalHours * 60 + minute - GU_EPOCH_MINUTE;
    const totalSeconds = totalMinutes * 60 + second - GU_EPOCH_SECOND;
    const totalMilliseconds = totalSeconds * 1000 + millisecond - GU_EPOCH_MILLISECOND;
    return totalMilliseconds;
}

// Conversion functions
function earthToGU(
    year: number,
    month: number,
    day: number,
    hour: number,
    minute: number,
    second: number,
    millisecond: number
): [number, number, number, number, number, number, number] {
    const totalMilliseconds = totalMillisecondsSinceEpoch(year, month, day, hour, minute, second, millisecond);
    const guys = Math.floor(totalMilliseconds / GU_YEAR);
    const remainder = totalMilliseconds % GU_YEAR;

    // Convert remainder to other GU time units
    let semesters = Math.floor(remainder / GU_SEMESTER);
    let remainderMilliseconds = remainder % GU_SEMESTER;

    let equinoxes = Math.floor(remainderMilliseconds / GU_EQUINOX);
    remainderMilliseconds %= GU_EQUINOX;

    let periods = Math.floor(remainderMilliseconds / GU_PERIOD);
    remainderMilliseconds %= GU_PERIOD;

    let unions = Math.floor(remainderMilliseconds / GU_UNION);
    remainderMilliseconds %= GU_UNION;

    let seconds = Math.floor(remainderMilliseconds / GU_SECOND);
    let milliseconds = remainderMilliseconds % GU_SECOND;

    return [guys, semesters, equinoxes, periods, unions, seconds, milliseconds];
}

function guToEarth(
    guys: number,
    semesters: number,
    equinoxes: number,
    periods: number,
    unions: number,
    seconds: number,
    milliseconds: number
): [number, number, number, number, number, number, number] {
    let totalMilliseconds =
        guys * GU_YEAR +
        semesters * GU_SEMESTER +
        equinoxes * GU_EQUINOX +
        periods * GU_PERIOD +
        unions * GU_UNION +
        seconds * GU_SECOND +
        milliseconds;

    let year = GU_EPOCH_YEAR;
    let month = GU_EPOCH_MONTH;
    let day = GU_EPOCH_DAY - correctionDays; // Apply correction directly here
    let hour = GU_EPOCH_HOUR;
    let minute = GU_EPOCH_MINUTE;
    let second = GU_EPOCH_SECOND;
    let millisecond = GU_EPOCH_MILLISECOND;

    // Convert total milliseconds to days and adjust the date
    let totalDays = Math.floor(totalMilliseconds / (24 * 60 * 60 * 1000));
    totalMilliseconds %= 24 * 60 * 60 * 1000;

    day += totalDays;
    while (day > daysInMonth(year, month) || day <= 0) {
        if (day > daysInMonth(year, month)) {
            day -= daysInMonth(year, month);
            month++;
        } else if (day <= 0) {
            month--;
            day += daysInMonth(year, month);
        }
        if (month > 12) {
            month = 1;
            year++;
        } else if (month < 1) {
            month = 12;
            year--;
        }
    }

    // Adjust hours, minutes, seconds, and milliseconds
    hour += Math.floor(totalMilliseconds / (60 * 60 * 1000));
    totalMilliseconds %= 60 * 60 * 1000;
    minute += Math.floor(totalMilliseconds / (60 * 1000));
    totalMilliseconds %= 60 * 1000;
    second += Math.floor(totalMilliseconds / 1000);
    millisecond += totalMilliseconds % 1000;

    // Normalize time overflows
    if (millisecond >= 1000) {
        second += Math.floor(millisecond / 1000);
        millisecond %= 1000;
    }
    if (second >= 60) {
        minute += Math.floor(second / 60);
        second %= 60;
    }
    if (minute >= 60) {
        hour += Math.floor(minute / 60);
        minute %= 60;
    }
    if (hour >= 24) {
        day += Math.floor(hour / 24);
        hour %= 24;
        if (day > daysInMonth(year, month)) {
            day = 1;
            month++;
            if (month > 12) {
                month = 1;
                year++;
            }
        }
    }

    return [year, month, day, hour, minute, second, millisecond];
}

function validateGU(
    semesters: number,
    equinoxes: number,
    periods: number,
    unions: number,
    duons: number,
    trions: number
): boolean {
    if (
        semesters < 1 ||
        semesters > SEMESTERS_MAX ||
        equinoxes < 1 ||
        equinoxes > EQUINOXES_MAX ||
        periods < 0 ||
        periods > PERIODS_MAX ||
        unions < 0 ||
        unions > UNIONS_MAX ||
        duons < 0 ||
        duons > DUONS_MAX ||
        trions < 0 ||
        trions > TRIONS_MAX
    ) {
        return false;
    }
    return true;
}

function validateEarth(
    year: number,
    month: number,
    day: number,
    hour: number,
    minute: number,
    second: number,
    millisecond: number
): boolean {
    if (
        year < 0 ||
        month < 1 ||
        month > 12 ||
        day < 1 ||
        day > daysInMonth(year, month) ||
        hour < 0 ||
        hour >= 24 ||
        minute < 0 ||
        minute >= 60 ||
        second < 0 ||
        second >= 60 ||
        millisecond < 0 ||
        millisecond >= 1000
    ) {
        return false;
    }
    return true;
}

// Test cases
function test() {
    const testCases: [number[], number[]][] = [
        [[2023, 5, 1, 12, 0, 0, 0], [2023, 5, 1, 12, 0, 0, 0]],
        [[2022, 12, 31, 23, 59, 59, 999], [2022, 12, 31, 23, 59, 59, 999]],
        [[2000, 1, 1, 0, 0, 0, 0], [2000, 1, 1, 0, 0, 0, 0]],
        [[1970, 1, 1, 0, 0, 0, 0], [1970, 1, 1, 0, 0, 0, 0]],
        [[1900, 2, 28, 23, 59, 59, 999], [1900, 2, 28, 23, 59, 59, 999]],
    ];

    let allMatch = true;
    for (const [input] of testCases as [[number, number, number, number, number, number, number], number[]][]) {
        const guTime: [number, number, number, number, number, number, number] = earthToGU(...input);
        const earthTime = guToEarth(...guTime);
        const inputStr = input.join(', ');
        const outputStr = earthTime.join(', ');
        const match = inputStr === outputStr;
        console.log(`Input: ${inputStr}`);
        console.log(`Output: ${outputStr}`);
        console.log(`Match: ${match}`);
        console.log('---');
        if (!match) {
            allMatch = false;
        }
    }

    console.log(`All inputs and outputs match: ${allMatch.toString().toUpperCase()}`);
}

export default { earthToGU, guToEarth, validateGU, validateEarth, test };
