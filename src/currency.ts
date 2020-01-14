const Regexp = {
    FLOAT: /^-?\d+(\.\d+)?$/,
    FLOAT_COMMA: /^-?\d+(,\d+)?$/,
    ENGLISH: /^-?(([1-9]\d{0,2}(,\d{3})*)|0)?\.\d{1,2}$/,
    EUROPEAN: /^-?\d{1,3}(?:[. ]\d{3})*(?:,\d+)?$/,
    ENGLISH_INT: /^-?(([1-9]\d{0,2}(,\d{3})*)|0)?$/,
    GROUP: /(\d)(?=(\d{3})+\b)/g,
    DASH: /^-/,
    SINGLE_DIGIT: /\b\d\b/,
    TWO_OR_MORE_SEPARATORS: /[.,]{2,}/g
};

export enum Separator {
    PERIOD = '.',
    COMMA = ',',
    SPACE = ' ',
    EMPTY = ''
}

const defaults: Options = {
    thousandSeparator: Separator.SPACE,
    decimalSeparator: Separator.COMMA,
    precision: 2,
    groups: Regexp.GROUP
};

interface Options {
    thousandSeparator: Separator;
    decimalSeparator: Separator;
    precision: number;
    groups: RegExp;
}

const Lang = {
    EN: 'en',
    SV: 'sv'
};

const Type = {
    number: 'number',
    string: 'string'
};

/**
 * Class Currency.
 * Formats currency values to either Swedish or English/American currency format.
 * Provides both the formatted string, and the numeric value.
 */
export class Currency {

    private readonly _settings: Options;
    private readonly _value: number;
    private readonly _pattern = '#';
    private readonly _negativePattern = '-#';
    private readonly _format: string;
    private readonly _lang: string;
    private _isValid: boolean;

    get value() {
        return this._value;
    }

    get format() {
        return this._format;
    }

    get isValid() {
        return this._isValid;
    }

    constructor(
        v: any,
        lang: string,
        private options: Options = defaults,
        useRounding = true,
        decimalsIfEven = true) {
        // Set separators according to language
        options.decimalSeparator = lang === Lang.SV ? Separator.COMMA : Separator.PERIOD;
        options.thousandSeparator = lang === Lang.SV ? Separator.SPACE : Separator.COMMA;
        this._lang = lang;

        this._settings = Object.assign({}, defaults, options);
        this._value = this._parse(v, this._settings, useRounding) / this.pow(this._settings.precision);
        this._format = this._transform(this._value, decimalsIfEven);
    }

    public pow = (precision: number) => Math.pow(10, precision);

    /**
     * Parse the input value to a number.
     * If rounding is set to true, round to two decimals.
     */
    private _parse(value: any, options: Options, useRounding): number {
        let intValue: any = 0;
        const precision: number = this.pow(options.precision);
        const isNumber: boolean = typeof value === Type.number;
        const isString: boolean = typeof value === Type.string;

        if (isNumber) {
            intValue = ((isNumber ? value : value.value) * precision);
            this._isValid = !!intValue;
        } else if (isString) {
            value = this._parseString(value.trim());

            // scale number to integer value or set to 0 if not possible
            intValue = Number(value) * precision || 0;
            this._isValid = !!intValue;
        } else {
            this._isValid = false;
            if (value) {
                throw new Error('Invalid input. Please use number or string.');
            }
        }

        // Handle additional decimal for proper rounding.
        intValue = intValue.toFixed(4);
        return useRounding ? Math.round(intValue) : intValue;
    }

    /**
     * Transforms the input value to a formatted currency string with decimal and thousand separators (collected from
     * the settings object).
     */
    private _transform(value: number, decimalsIfEven: boolean): string {
        const {thousandSeparator, decimalSeparator, groups} = this._settings;
        const values = `${value}`.replace(Regexp.DASH, Separator.EMPTY).split(Separator.PERIOD);
        const integer = values[0];
        // Check if decimals is a single digit, if so add a trailing zero.
        const points = String(values[1]).match(Regexp.SINGLE_DIGIT) ? `${values[1]}0` : values[1];

        return (value >= 0 ? this._pattern : this._negativePattern)
            // Replace all occurrences of groups (i.e thousands) with the thousand separator.
            .replace(this._pattern, `${integer.replace(groups, '$1' + thousandSeparator)}` +
                `${points ? `${decimalSeparator}${points}` : (decimalsIfEven ? `${decimalSeparator}00` : Separator.EMPTY)}`);
    }

    /**
     * Strips the value to a string with no thousand separators and sets the decimal to either
     * comma or period depending on the input language.
     */
    private _parseString(value: string): string {
        const {decimalSeparator} = this.options;

        // If english format replace all thousand separators with nothing to create a "floating point" string with
        // period as decimal separator.
        value = value.match(Regexp.ENGLISH) ? value.replace(/,/g, Separator.EMPTY) : value;

        // If english format not validating, but language is english the user probably entered a value with comma as
        // thousand separator. We need a check for that and a correction, otherwise the output will not be correct.
        if (!value.match(Regexp.ENGLISH) && this._lang === Lang.EN && value.match(Regexp.ENGLISH_INT)) {
            value = value.replace(/,/g, Separator.EMPTY);
        }

        // If european (matches swedish, german and the general euro format) replace thousand separators (space and periods)
        // with nothing to create a "floating point" string with comma as decimal separator.
        if (value.match(Regexp.EUROPEAN)) {
            value = value.replace(/ /g, Separator.EMPTY);
            value = value.replace(/[.]/g, Separator.EMPTY);
        }

        // If we got a valid floating number (as string) replace period with set decimal separator according to language
        value = value.match(Regexp.FLOAT) ? value.replace(Separator.PERIOD, decimalSeparator) : value;

        // If we got a valid floating number (as string) but with a comma as separator set decimal separator according to language
        value = value.match(Regexp.FLOAT_COMMA) ? value.replace(Separator.COMMA, decimalSeparator) : value;

        // Checking if input has two or more consecutive commas/periods. If no match proceed to replace separators.
        // If matching, do nothing and set to 0 on line 110 and thus invalid.
        value = !value.match(Regexp.TWO_OR_MORE_SEPARATORS) ? value
            // allow negative e.g. (1.99)
            .replace(/\((.*)\)/, '-$1')
            // replace any non numeric values
            .replace(new RegExp('[^-\\d' + decimalSeparator + ']', 'g'), '')
            // convert any decimal values
            .replace(new RegExp('\\' + decimalSeparator, 'g'), '.') : value;

        // We need to make sure that that the input decimal separator matches the desired formatted output, if not the result will be bananas.
        // Here we may have a string input in format either as 1000, 1000.01 or 1000,01 depending on what language is set and, because of that, which outcome we want.
        // If language is set to swedish we want a string with comma as decimal separator and the formatted result will be 1 000,01.
        // If language is set to english we want a string with period as decimal separator and the formatted result will be 1,000.01.
        return value;
    }
}
