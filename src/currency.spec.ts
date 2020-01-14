
// All these tests should pass if one installs a runner like jest.

/**
import {Currency} from './currency';

describe('Currency', () => {

  const Lang = {
    EN: 'en',
    SV: 'sv'
  };

  describe('transform different formats to output according to set language', () => {

    describe('transform numbers (as strings) to scandinavian format', () => {
      const lang = Lang.SV;
      it('should transform integer', () => {
        const currency = new Currency('1000', lang);
        expect(currency.format).toBe('1 000,00');
        expect(currency.isValid).toBe(true);
      });

      it('should transform float', () => {
        const currency = new Currency('2000.05', lang);
        expect(currency.format).toBe('2 000,05');
        expect(currency.isValid).toBe(true);
      });
    });

    describe('transform numbers (as strings) to english format', () => {
      const lang = Lang.EN;
      it('should transform integer', () => {
        const currency = new Currency('1000', lang);
        expect(currency.format).toBe('1,000.00');
        expect(currency.isValid).toBe(true);
      });

      it('should transform float', () => {
        const currency = new Currency('1000.05', lang);
        expect(currency.format).toBe('1,000.05');
        expect(currency.isValid).toBe(true);
      });
    });

    describe('transform scandinavian format', () => {
      it('should be the same input as output if lang is sett to SV', () => {
        const lang = Lang.SV;
        const currency = new Currency('1 000 000,55', lang);
        expect(currency.format).toBe('1 000 000,55');
        expect(currency.isValid).toBe(true);
      });

      it('should transform scandinavian to english format', () => {
        const lang = Lang.EN;
        const currency = new Currency('2 000 000,55', lang);
        expect(currency.format).toBe('2,000,000.55');
        expect(currency.isValid).toBe(true);
      });
    });

    describe('transform english format', () => {
      it('should be the same input as output if lang is sett to EN', () => {
        const lang = Lang.EN;
        const currency = new Currency('1,000,000.55', lang);
        expect(currency.format).toBe('1,000,000.55');
        expect(currency.isValid).toBe(true);
      });

      it('should transform english to scandinavian format', () => {
        const lang = Lang.SV;
        const currency = new Currency('1,000,000.55', lang);
        expect(currency.format).toBe('1 000 000,55');
        expect(currency.isValid).toBe(true);
      });
    });

    describe('transform european formats to scandinavian format', () => {
      const lang = Lang.SV;
      it('should transform standard EU format', () => {
        const currency = new Currency('1.000.000,55', lang);
        expect(currency.format).toBe('1 000 000,55');
        expect(currency.isValid).toBe(true);
      });
      it('should transform special German format', () => {
        const currency = new Currency('1 000.000,55', lang);
        expect(currency.format).toBe('1 000 000,55');
        expect(currency.isValid).toBe(true);
      });
    });

    describe('transform european formats to english format', () => {
      const lang = Lang.EN;
      it('should transform standard EU format', () => {
        const currency = new Currency('1.000.000,55', lang);
        expect(currency.format).toBe('1,000,000.55');
        expect(currency.isValid).toBe(true);
      });
      it('should transform special German format', () => {
        const currency = new Currency('1 000.000,55', lang);
        expect(currency.format).toBe('1,000,000.55');
        expect(currency.isValid).toBe(true);
      });
    });
  });

  describe('parse different formats to numeric equivalent', () => {

    describe('parse scandinavian format', () => {
      const lang = Lang.SV;
      it('should parse an integer', () => {
        const currency = new Currency('1 000', lang);
        expect(currency.value).toBe(1000);
        expect(currency.isValid).toBe(true);
      });

      it('should parse a float', () => {
        const currency = new Currency('1 000,05', lang);
        expect(currency.value).toBe(1000.05);
        expect(currency.isValid).toBe(true);
      });

      it('should parse a larger amount', () => {
        const currency = new Currency('1 100 000 000,05', lang);
        expect(currency.value).toBe(1100000000.05);
        expect(currency.isValid).toBe(true);
      });
    });

    describe('parse english format', () => {
      const lang = Lang.EN;
      it('should parse an integer', () => {
        const currency = new Currency('1,000', lang);
        expect(currency.value).toBe(1000);
        expect(currency.isValid).toBe(true);
      });

      it('should parse a float', () => {
        const currency = new Currency('1,000.05', lang);
        expect(currency.value).toBe(1000.05);
        expect(currency.isValid).toBe(true);
      });

      it('should parse a larger amount', () => {
        const currency = new Currency('1,100,000,000.05', lang);
        expect(currency.value).toBe(1100000000.05);
        expect(currency.isValid).toBe(true);
      });
    });

    describe('parse european formats', () => {

      it('should parse large german format with lang set to EN', () => {
        const currency = new Currency('1 000.000,05', Lang.EN);
        expect(currency.value).toBe(1000000.05);
        expect(currency.isValid).toBe(true);
      });
      it('should parse large german format with lang set to SV', () => {
        const currency = new Currency('1 000.000,05', Lang.SV);
        expect(currency.value).toBe(1000000.05);
        expect(currency.isValid).toBe(true);
      });

      it('should parse large standard eu format with lang set to EN', () => {
        const currency = new Currency('1.000.000,05', Lang.EN);
        expect(currency.value).toBe(1000000.05);
        expect(currency.isValid).toBe(true);
      });

      it('should parse standard eu format with lang set to EN', () => {
        let currency = new Currency('1.000', Lang.EN);
        expect(currency.value).toBe(1000);
        expect(currency.isValid).toBe(true);
        currency = new Currency('1.000,05', Lang.EN);
        expect(currency.value).toBe(1000.05);
        expect(currency.isValid).toBe(true);
      });

      it('should parse large standard eu format with lang set to SV', () => {
        const currency = new Currency('1.000.000,05', Lang.SV);
        expect(currency.value).toBe(1000000.05);
        expect(currency.isValid).toBe(true);
      });

      it('should parse smaller standard eu format with lang set to SV', () => {
        let currency = new Currency('1.000', Lang.SV);
        expect(currency.value).toBe(1000);
        expect(currency.isValid).toBe(true);
        currency = new Currency('1.000,05', Lang.SV);
        expect(currency.value).toBe(1000.05);
        expect(currency.isValid).toBe(true);
      });
    });
  });

  describe('negative inputs', () => {
    describe('parse scandinavian format', () => {
      const lang = Lang.SV;
      it('should parse an integer', () => {
        const currency = new Currency('-1 000', lang);
        expect(currency.value).toBe(-1000);
        expect(currency.isValid).toBe(true);
      });

      it('should parse a float', () => {
        const currency = new Currency('-1 000,05', lang);
        expect(currency.value).toBe(-1000.05);
        expect(currency.isValid).toBe(true);
      });

      it('should parse a larger amount', () => {
        const currency = new Currency('-1 100 000 000,05', lang);
        expect(currency.value).toBe(-1100000000.05);
        expect(currency.isValid).toBe(true);
      });
    });
    describe('parse english format', () => {
      const lang = Lang.EN;
      it('should parse an integer', () => {
        const currency = new Currency('-1,000', lang);
        expect(currency.value).toBe(-1000);
        expect(currency.isValid).toBe(true);
      });

      it('should parse a float', () => {
        const currency = new Currency('-1,000.05', lang);
        expect(currency.value).toBe(-1000.05);
        expect(currency.isValid).toBe(true);
      });

      it('should parse a larger amount', () => {
        const currency = new Currency('-1,100,000,000.05', lang);
        expect(currency.value).toBe(-1100000000.05);
        expect(currency.isValid).toBe(true);
      });
    });
    describe('transform scandinavian format', () => {
      it('should be the same input as output if lang is sett to SV', () => {
        const lang = Lang.SV;
        const currency = new Currency('-1 000 000,55', lang);
        expect(currency.format).toBe('-1 000 000,55');
        expect(currency.isValid).toBe(true);
      });

      it('should transform scandinavian to english format', () => {
        const lang = Lang.EN;
        const currency = new Currency('-2 000 000,55', lang);
        expect(currency.format).toBe('-2,000,000.55');
        expect(currency.isValid).toBe(true);
      });
    });

    describe('transform english format', () => {
      it('should be the same input as output if lang is sett to EN', () => {
        const lang = Lang.EN;
        const currency = new Currency('-1,000,000.55', lang);
        expect(currency.format).toBe('-1,000,000.55');
        expect(currency.isValid).toBe(true);
      });

      it('should transform english to scandinavian format', () => {
        const lang = Lang.SV;
        const currency = new Currency('-1,000,000.55', lang);
        expect(currency.format).toBe('-1 000 000,55');
        expect(currency.isValid).toBe(true);
      });
    });
  });

  describe('other cases', () => {

    test('input as a number', () => {
      const currency = new Currency(1000, Lang.SV);
      expect(currency.format).toBe('1 000,00');
      expect(currency.value).toBe(1000);
      expect(currency.isValid).toBe(true);
    });

    test('input as a negative number', () => {
      const currency = new Currency(-1000, Lang.SV);
      expect(currency.format).toBe('-1 000,00');
      expect(currency.value).toBe(-1000);
      expect(currency.isValid).toBe(true);
    });

    it('should throw error when input is an object', () => {
      try {
        const currency = new Currency({}, Lang.SV);
        expect(currency.isValid).toBe(false);
      } catch (e) {
        expect(e.message).toBe('Invalid input. Please use number or string.');
      }
    });

    test('null input', () => {
      const currency = new Currency(null, Lang.SV);
      expect(currency.isValid).toBe(false);
      expect(currency.format).toBe('0,00');
      expect(currency.value).toBe(0);
    });

    test('crazy input sv', () => {
      const currency = new Currency('1,,,,,321,,,144', Lang.SV);
      expect(currency.isValid).toBe(false);
      expect(currency.value).toBe(0);
      expect(currency.format).toBe('0,00');
    });

    test('crazy input en', () => {
      const currency = new Currency('1,,,,,321,,,144', Lang.EN);
      expect(currency.isValid).toBe(false);
      expect(currency.value).toBe(0);
      expect(currency.format).toBe('0.00');
    });

    test('loads of points sv', () => {
      const currency = new Currency('1.65432134545523158', Lang.SV);
      expect(currency.isValid).toBe(true);
      expect(currency.value).toBe(1.65);
      expect(currency.format).toBe('1,65');
    });

    test('loads of points en', () => {
      const currency = new Currency('1,65432134545523158', Lang.EN);
      expect(currency.isValid).toBe(true);
      expect(currency.value).toBe(1.65);
      expect(currency.format).toBe('1.65');
    });

    test('largest number allowed in input using the directive, 13 digits (i.e trillions)', () => {
      const currency = new Currency('2222222222222', Lang.EN);
      expect(currency.isValid).toBe(true);
      expect(currency.format).toBe('2,222,222,222,222.00');
      expect(currency.value).toBe(2222222222222);
    });
  });
});
 */