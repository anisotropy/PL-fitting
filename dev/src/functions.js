import {_forIn, _mapA} from './accessories/functions';

const intensity = ([A11, A12, A21, A22, G1, G2, Eg1, Eg2, DEh2, Ef, Eloc, Efh, Te, Th, me, mhh], hw) => {
	const A = [[null], [null, A11, A12], [null, A21, A22]];
	const Eg = [null, Eg1, Eg2];
	const G = [null, G1, G2];
	const DEh = [null, 0, DEh2];
	const k = 8.6173303 * Math.pow(10, -5);

	const D = (i, j) => (1/(1 + Math.exp(-(hw - DEh[j] - Eg[i])/G[i])));
	const fe = (i, j) => (1/(1 + Math.exp(((mhh/(me + mhh))*(hw - DEh[j]) + (me/(me + mhh))*Eg[i] - Ef)/(k*Te))));
	const fh = (i, j) => {
		//if(Eloc > 0){
		if(true){
			return (hw - DEh[j] - Eg[i] < 0 ? 1 : 1/Math.pow((1 + (me/(me + mhh))*(hw - DEh[j] - Eg[i])/(Eloc - DEh[j])), 2));
		} else {
			return 1/(1 + Math.exp(((me/(me + mhh))*(hw - DEh[j] - Eg[i]) - (Efh - DEh[j]))/(k*Th)));
		}
	};
	const intens = (i, j) => A[i][j]*D(i, j)*fe(i, j)*fh(i, j);

	return [intens(1, 1), intens(1, 2), intens(2, 1), intens(2, 2)];
}

export const _totalIntens = (params) => (hw) => {
	let ps = intensity(params, hw);
	return ps[0] + ps[1] + ps[2] + ps[3];
	//let total = 0;
	//_forIn(partials, (p) => {total += p;});
	//return total;
};

export const _plData = (params, xData) => {
	let partial = [[], [], [], []];
	let total = [];
	_forIn(xData, (hw) => {
		let ps = intensity(params, hw);
		partial[0].push(ps[0]);
		partial[1].push(ps[1]);
		partial[2].push(ps[2]);
		partial[3].push(ps[3]);
		total.push(ps[0] + ps[1] + ps[2] + ps[3]);
	});
 	return {partial, total};
};
