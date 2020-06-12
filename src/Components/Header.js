import Autocomplete from "@material-ui/lab/Autocomplete";
import FontAwesome from 'react-fontawesome';
import Hotkeys from "react-hot-keys";
import React, { Component } from 'react';
import TextField from "@material-ui/core/TextField";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import '../styles/Header.css';

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cryptoassets: require("../cryptoassets.json").slice(0, props.settings.limit),
      displayAddSection: false,
      cryptoassetRef: null
    }
  }

  focusAddCryptoasset() {
    setTimeout(() => {
      document.getElementById('currency').focus();
    }, 50);
  }

  getPortfolioBalance() {
    if (!this.props.settings.showPortfolioBalance || !this.props.coins)
      return;

    var balance = 0;

    Object.entries(this.props.coins).forEach(([id, coin]) => {
      if (coin.holdings > 0 && coin.price) {
        balance += coin.price * coin.holdings;
      }
    });

    return <span className="sub-title">Portfolio: {(balance).toLocaleString(window.navigator.language, { style: 'currency', currency: this.props.settings.currency, minimumFractionDigits: 2})}</span>;
  }

  toggleAddSection(){
    this.setState({displayAddSection: !this.state.displayAddSection});
  }

  render() {
    let displayAddSection = "none";
    let addIconClass = "add-section-icon";
    let addIconTitle = "Show cryptoasset selector";

    if (!this.props.settings.addDropdownHideable) {
      addIconClass += " invisible";
      displayAddSection = "block";
    }
    else if (this.state.displayAddSection) {
      displayAddSection = "block";
      addIconClass += " rotate";
      addIconTitle = "Hide cryptoasset selector";
    }

    return(
      <div className="header">
        <div className="col-12">
          <h2 className="title">
          <FontAwesome
            className={addIconClass}
            name="plus"
            onClick={() => this.toggleAddSection()}
            pull="left"
            title={addIconTitle}
          />
          CryptoDash
          <FontAwesome
            className="menu-icon"
            name="cogs"
            onClick={() => this.props.toggleShowSettings()}
            pull="right"
          />
          {this.getPortfolioBalance()}
          </h2>

        </div>
        <div className="col-12" style={{display: displayAddSection}}>
          <Autocomplete
              autoComplete={false}
              autoHighlight
              blurOnSelect
              className="w-100"
              clearOnBlur
              disablePortal={true}
              getOptionLabel={(option) => `${option.name} (${option.symbol})`}
              id="currency"
              onChange={
                (event, cryptoasset) => {
                  if (cryptoasset) {
                    this.props.addCrypto(cryptoasset.cmc_id, cryptoasset.cg_id, cryptoasset.symbol)
                  }
                }
              }
              options={this.state.cryptoassets}
              renderInput={(params) => <TextField {...params} label="Add Cryptoasset" variant="outlined" />}
              size="small"
              value={null}
          />
        </div>
        <Hotkeys
          keyName="/"
          onKeyDown={this.focusAddCryptoasset.bind(this)}
        />
      </div>
    )
  }
}

export default Header;
