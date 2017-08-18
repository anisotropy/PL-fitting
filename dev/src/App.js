import React, {Component} from 'react';
import {render} from 'react-dom';
import {Provider, connect} from 'react-redux';
import Body from './components/Body';
import './style/index.less';

render(
	<div className="plfitting">
		<Body />
	</div>,
	document.getElementById('root')
);
