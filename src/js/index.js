import hello from './modules/hello';
console.log('hello index');
console.log(hello);

import AirDatepicker from 'air-datepicker';
import 'air-datepicker/air-datepicker.css';

document.addEventListener('DOMContentLoaded', () => {
	// new AirDatepicker('#my-element'[,options]);// есть еще настройки локали
	new AirDatepicker('#date', { visible: false });
});
