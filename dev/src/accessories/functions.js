import 'babel-polyfill';

export const _isEmpty = (value) => {
	if(value === 0) return false;
	else if(!value) return true;
	else if(typeof value !== 'object'){
		return false;
	} else if(Array.isArray(value) && value.length === 0){
		return true;
	} else {
		for(var p in value) {
			if(_isEmpty(value[p]) === false) return false;
		}
		return true;
	}
};
export const _isEmailValid = (email) => {
	let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email.trim());
};
export const _isPhoneValid = (phone) => {
	let re = /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1}|)-?[0-9]{3,4}-?[0-9]{4}$/;
	return re.test(phone.trim());
};
export const _isDateValid = (value, form) => {
	if(form == 'Ym'){
		if(1 <= value.year && value.year <= 9999 && 1 <= value.month && value.month <= 12 ){
			return true;
		} else {
			return false;
		}
	}
	else if(form == 'text'){ // 형식: 2016-12-07
		let dateArray = value.split('-');
		if(dateArray.length != 3) return false;
		if(1 <= dateArray[0] && dateArray[0] <= 9999 && dateArray[0].length == 4); else return false;
		if(1 <= dateArray[1] && dateArray[1] <= 12 && dateArray[1].length == 2); else return false;
		if(1 <= dateArray[2] && dateArray[2] <= 31 && dateArray[2].length == 2); else return false;
		return true;
	}
};
export const _displayDate = (date) => {
	let items = [];
	if(date.year) items.push(date.year);
	if(date.month) items.push(date.month);
	if(date.date) items.push(date.date);
	return items.join('/');
};
export const _displayDateOfMilliseconds = (milliseconds) => {
	let regDate = new Date(milliseconds);
	let year = regDate.getFullYear();
	let month = regDate.getMonth()+1; if(month < 10) month = '0'+month;
	let date = regDate.getDate(); if(date < 10) date = '0'+date;
	return  year+'/'+month+'/'+date;
};
export const _isCommon = (array1, array2, equal) => {
	if(!equal){
		for(let i in array1){
			for(let j in array2){
				if(array1[i] == array2[j]) return true;
			}
		}
		return false;
	} else {
		if(array1.length != array2.length) return false;
		for(let i in array1){
			let isEqual = false;
			for(let j in array2){
				if(array1[i] == array2[j]){isEqual = true; break;}
			}
			if(!isEqual) return false;
		}
		return true;
	}
};
export const _mapA = (obj, callBack) => {
	let result = [];
	for(let pn in obj){
		let value = callBack(obj[pn], pn);
		if(value !== undefined) result.push(value);
	}
	return result;
};
export const _mapO = (obj, callBack) => {
	let result = {};
	for(let pn in obj){
		let value = callBack(obj[pn], pn);
		if(value !== undefined) result[value[0]] = value[1];
	}
	return result;
};
export const _forIn = (obj, callBack) => {
	for(let pn in obj){
		let rtn = callBack(obj[pn], pn);
		if(rtn === false) break;
	}
};
export const _delete = (obj, prop) => {
	let newObj = {};
	for(let pn in obj){
		if(pn != prop) newObj[pn] = obj[pn];
	}
	return newObj;
}
export const _findProp = (obj, propValue) => {
	for(let pn in obj){
		if(obj[pn] == propValue) return pn;
	}
};
export const _find = (obj, callBack) => {
	for(let pn in obj){
		if(callBack(obj[pn], pn)) return obj[pn];
	}
};
export const _extract = (obj, callBack) => {
	for(let pn in obj){
		let value = callBack(obj[pn], pn);
		if(value !== undefined) return value;
	}
};
export const _copyOf = (obj, excludeNull) => {
	if(Array.isArray(obj)){
		let array = [];
		for(let i in obj){
			if(excludeNull){
				if(obj[i]) array.push(obj[i]);
			} else {
				array[i] = obj[i];
			}
		}
		return array;
	} else {
		let newObj = {};
		for(let pn in obj){
			if(!excludeNull || obj[pn]) newObj[pn] = obj[pn];
		}
		return newObj;
	}
};
export const _pushpull = (array, value) => {
	let newArray = [];
	if(Array.isArray(value)){
		array.forEach((val) => {if(!value.find((v) => v == val)) newArray.push(val);});
		value.forEach((v) => {if(!array.find((val) => v == val)) newArray.push(v);});
	} else {
		array.forEach((v) => { if(v != value) newArray.push(v); });
		if(array.length === newArray.length) newArray.push(value);
	}
	return newArray;
};
export const _merge = (array1, array2) => {
	let newArray = [].concat(array1);
	array2.forEach((v2) => {if(!array1.find((v1) => v1 == v2)) newArray.push(v2);});
	return newArray;
};
export const _subtract = (arr1, arr2) => { //arr2에서 arr1을 뺀다
	let newArr = [];
	arr2.forEach((v2) => {if(!arr1.find((v1) => v1 == v2)) newArr.push(v2)});
	return newArr;
};
export const _interpolate = (x, y0, y1, x0, x1, unit) => {
	if(x > x1) return null;
	else if(x < x0) x = x0;
	let y = y0 + (y1 - y0)*(x - x0)/(x1 - x0);
	return (unit ? y+unit : y);
};
export const _notNull = (values) => {
	for(let i in values){
		if(values[i] !== null && values[i] !== false && values[i] !== undefined){
			return values[i];
		}
	}
	return null;
};
export const _style = (w, bp, style) => {
	let n;
	for(let i = 0, len = bp.length; i < len - 1; i++){
		if(bp[i] <= w && w < bp[i+1]){n = i; break;}
	}
	if(n === undefined){
		n = (w < bp[0] ? -1 : -2);
	}
	let result = {};
	for(let prop in style){
		if(typeof style[prop] === 'number') {
			result[prop] = style[prop];
		} else {
			if(n >= 0){
				result[prop] = _interpolate(w, style[prop][n+1], style[prop][n+2], bp[n], bp[n+1]);
			}
			else if(n == -1){
				result[prop] = (style[prop][0] === true ? style[prop][1] : style[prop][0]);
			}
			else {
				let m = style[prop].length - 1;
				result[prop] = (style[prop][m] === true ? style[prop][m-1] : style[prop][m]);
			}
		}
	}
	return result;
};
export const _wrap = (callBack) => {
	return callBack();
};
export const _padNumber = (number, digits) => {
	let strNumber = '' + number;
	for(let i = digits, len = strNumber.length; i > len; i--){
		strNumber = '0'+strNumber;
	}
	return strNumber;
};
export const _makeForm = (data) => {
	let formData = new FormData;
	for(let prop in data){
		if(typeof data[prop] === 'object'){
			formData.append(prop, JSON.stringify(data[prop]));
		} else if(data[prop]){
			formData.append(prop, data[prop]);
		}
	}
	return formData;
};
export const _makeQuery = (obj) => {
	return _mapA(obj, (value, prop) => {
		if(!_isEmpty(value)) return prop+'='+(typeof value === 'object' ? JSON.stringify(value) : value);
		else return undefined;
	}).join('&');
};
export const _convQuery = (query) => {
	let result = {};
	query.replace(/^\?/, '').split('&').forEach((q) => {
		let paramArr = q.split('=');
		let prop = paramArr[0];
		let value = paramArr[1];
		result[prop] = (/^[\[,\{]/.test(value) ? JSON.parse(value) : value);
	});
	return result;
};
export const _class = (name, args) => {
	let suffixes = [name];
	_forIn(args, (arg) => {
		switch(typeof arg){
			case 'string':
				suffixes.push(name+'--'+arg); break;
			case 'object':
				if(arg.length && arg.length == 2){
					if(arg[0]) suffixes.push(name+'--'+arg[1]);
				} else {
					let pn = _extract(arg, (pv, pn) => (pv ? pn : undefined));
					if(pn) suffixes.push(name+'--'+pn);
				} break;
			default:
		}
	});
	return suffixes.join(' ');
};
export const _encodeURI = (value) => {
	return (value ? encodeURI(value) : value);
}
export const _requestAnimation = (apply, duration) => {
	let start = null;
	const step = (timestamp) => {
		if(!start) start = timestamp;
		let progress = timestamp - start;
		apply(progress/duration);
		if(progress < duration) {
			window.requestAnimationFrame(step);
		} else {
			apply(1);
		}
	};
	window.requestAnimationFrame(step);
};
export const _animate = (elem, {which, value, duration, delay, complete}) => {
	let oldValue = elem[which];
	const func = () => _requestAnimation((ratio) => {
		let val = oldValue + (value - oldValue)*ratio;
		elem[which] = val;
		if(ratio == 1 && complete) complete();
	}, duration);
	if(delay){
		setTimeout(func, delay);
	} else {
		func();
	}
};
