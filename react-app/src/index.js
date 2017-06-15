/**
 * Created by User on 06.06.2017.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import MainPage from './main/main';
import Filter from './filter/filter';

import registerServiceWorker from './registerServiceWorker';
import './index.css';

//ReactDOM.render(<MainPage url="/tableData" />, document.getElementById('root'));

ReactDOM.render(
    <MuiThemeProvider>
        <Filter />
    </MuiThemeProvider>
        , document.getElementById('root')
);

registerServiceWorker();
