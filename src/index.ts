import {Currency} from './currency';

const currency = new Currency(100000, 'sv');

console.log('value', currency.value); // 100000
console.log('format', currency.format); // 10 000,00
