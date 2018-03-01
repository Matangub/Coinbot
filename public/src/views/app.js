import React from 'react';
import ReactDOM from 'react-dom';
import request from 'superagent'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import Dashboard from './dashboard/Dashboard';
import TradingCenter from './TradingCenter/TradingCenter';

import colors from '../consts/colors'

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: 'TradingCenter'
    };
  }

  renderTabs () {

    switch( this.state.activeTab ) {
      case 'Dashboard':
        return <Dashboard />
      case 'TradingCenter':
        return <TradingCenter />
      default:
        return <Dashboard />
    }
  }

  switch_tabs(tab) {

    this.setState({activeTab: tab})
  }

  render() {
    return (
      <MuiThemeProvider>
        <div style={{backgroundColor: colors.color1, height: '100%'}}>
          <AppBar className="nav_bar" style={{backgroundColor: colors.color1}} title="CRYPTO BOT" iconClassNameRight="muidocs-icon-navigation-expand-more" />

          <Drawer docked={true} containerStyle={{backgroundColor: colors.color1, width: '180px', top: '65px', height: '100%', textAlign: 'left'}}>
            <MenuItem className="menuStyle" onClick={this.switch_tabs.bind(this, 'Dashboard')}> Dashboard </MenuItem>
            <MenuItem className="menuStyle" onClick={this.switch_tabs.bind(this, 'TradingCenter')}>Trading Center</MenuItem>
            <MenuItem className="menuStyle">Purchase History</MenuItem>
          </Drawer>

          <div id="tabs_wrapper">
            { this.renderTabs() }
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}
