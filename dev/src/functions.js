import {_forIn, _mapA} from './accessories/functions';

export const _paramNames =
	['A11', 'A12', 'A21', 'A22', 'G1', 'G2', 'Eg1', 'Eg2', 'DEh2', 'Ef', 'Eloc', 'Efh', 'Te', 'Th', 'me', 'mh'];

const intensity = ([A11, A12, A21, A22, G1, G2, Eg1, Eg2, DEh2, Ef, Eloc, Efh, Te, Th, me, mh], localized, hw) => {
	const A = [[null], [null, A11, A12], [null, A21, A22]];
	const Eg = [null, Eg1, Eg2];
	const G = [null, G1, G2];
	const DEh = [null, 0, DEh2];
	const k = 8.6173303e-5;

	const D = (i, j) => (1/(1 + Math.exp(-(hw - DEh[j] - Eg[i])/G[i])));
	const fe = (i, j) => (1/(1 + Math.exp(((mh/(me + mh))*(hw - DEh[j]) + (me/(me + mh))*Eg[i] - Ef)/(k*Te))));
	const fh = (i, j) => {
		if(localized){
			return (hw - DEh[j] - Eg[i] < 0 ? 1 : 1/Math.pow((1 + (me/(me + mh))*(hw - DEh[j] - Eg[i])/(Eloc - DEh[j])), 2));
		} else {
			return 1/(1 + Math.exp(((me/(me + mh))*(hw - DEh[j] - Eg[i]) - (Efh - DEh[j]))/(k*Th)));
		}
	};
	const intens = (i, j) => A[i][j]*D(i, j)*fe(i, j)*fh(i, j);

	return [intens(1, 1), intens(1, 2), intens(2, 1), intens(2, 2)];
}

export const _pl = (allParams, localized, checked) => (params) => (hw) => {
	let all = _mapA(allParams, (p) => p);
	_forIn(params, (p, i) => {all[checked[i]] = p;});
	let ps = intensity(all, localized, hw);
	return ps[0] + ps[1] + ps[2] + ps[3];
};

export const _plData = (params, localized, xData) => {
	let partial = [[], [], [], []];
	let total = [];
	_forIn(xData, (hw) => {
		let ps = intensity(params, localized, hw);
		partial[0].push(ps[0]);
		partial[1].push(ps[1]);
		partial[2].push(ps[2]);
		partial[3].push(ps[3]);
		total.push(ps[0] + ps[1] + ps[2] + ps[3]);
	});
 	return {partial, total};
};
