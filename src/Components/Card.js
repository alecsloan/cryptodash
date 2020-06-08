import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import FontAwesome from 'react-fontawesome';
import '../styles/Card.css';

function MyBalance(props) {
  if (props.holdings > 0 && props.settings.showCardBalances) {
    return(
      <div className="mt-2">
        My Balance: {(props.price * props.holdings).toLocaleString(window.navigator.language, { style: 'currency', currency: props.settings.currency, minimumFractionDigits: 2})}
      </div>
    );
  }

  return (
      <div></div>
  )
}

class Card extends Component {
  constructor(props){
    super(props);
    this.state ={
      flip: false,
      holdings: props.coin.holdings,
      settings: props.settings,
      simulate: 0
    };
  }

  getPercentChange(quote, period) {
    let showPeriodChange = false;
    let percentChange = 0;

    if (period === "1h") {
      showPeriodChange = this.state.settings.show1hChange;
      percentChange = quote.percent_change_1h;
    }
    else if (period === "24h") {
      showPeriodChange = this.state.settings.show24hChange;
      percentChange = quote.percent_change_24h;
    }
    else if (period === "7d") {
      showPeriodChange = this.state.settings.show7dChange;
      percentChange = quote.percent_change_7d;
    }

    if (showPeriodChange) {
      let hourColor = String(percentChange).includes("-") ? 'red' : 'green';

      let percent = <span>{(percentChange * .01).toLocaleString(window.navigator.language, {style: 'percent', minimumFractionDigits: 2})}</span>;

      return (
        <div>
          {period}
          <b className={hourColor + " ml-2"}>
            {percent}
          </b>
        </div>
      )
    }
  }

  getLocalizedPrice(price) {
    var maxDigits;

    if (price < this.props.settings.decimals4) {
      maxDigits = 4;
    }
    else if (price < this.props.settings.decimals3) {
      maxDigits = 3;
    }
    else if (price < this.props.settings.decimals2) {
      maxDigits = 2;
    }
    else {
      maxDigits = 0;
    }

    return price.toLocaleString(
        window.navigator.language,
        {
          style: 'currency',
          currency: this.state.settings.currency,
          maximumFractionDigits: maxDigits,
          minimumFractionDigits: maxDigits
        }
    );
  }

  toggleSettings(){
    this.setState({flip: !this.state.flip});
  }

  render() {
    let quote = this.props.coin.quote[this.state.settings.currency];

    let front = this.state.flip ? 'none' : '';
    let back = this.state.flip ? '' : 'none';
    return(
      <div className="col-xs-12 col-sm-6 col-lg-4 card-container">
        <div className="card">
          <div className={(window.innerWidth <= 760) ? "row" : ""} style={{display: front}} onClick={() => this.toggleSettings()}>
            <div className={(window.innerWidth <= 760) ? "ml-2 w-50" : ""}>
            <FontAwesome
              className='settings pull-right'
              name='gear'
              onClick={() => this.toggleSettings()}
              size='2x'
              spin
            />
            <img
                alt={this.props.coin.name + ' Logo'}
                className="card-img-top center"
                src={'https://s2.coinmarketcap.com/static/img/coins/128x128/'+ this.props.coin.id +'.png'}
            />
            <h4 className="card-title">{this.props.coin.name} ({this.props.coin.symbol})</h4>
            </div>
            <div className="card-body">
              <div className="card-text">
                <div>Price: {this.getLocalizedPrice(quote.price)}</div>
                {this.getPercentChange(quote, "1h")}
                {this.getPercentChange(quote, "24h")}
                {this.getPercentChange(quote, "7d")}
                <MyBalance holdings={this.state.holdings} price={quote.price} settings={this.state.settings} />
              </div>
            </div>
          </div>
          <div style={{display: back}}>
            <FontAwesome
              className='settings pull-left'
              name='trash'
              onClick={() => this.props.removeCrypto(this.props.coin.id)}
              size='2x'
            />
            <FontAwesome
              className='settings'
              name='save'
              onClick={() => this.toggleSettings()}
              size='2x'
            />
            <div className="card-body">
              <h4 className="card-title settings-title">
                {this.props.coin.name} ({this.props.coin.symbol})
              </h4>

              <div className="card-text">
                <label htmlFor="holdings">
                  My Holdings:
                </label>
                <input
                  defaultValue={this.state.holdings || null}
                  onChange={
                    event => {
                      this.setState({
                        holdings: parseFloat(event.target.value).toFixed(9)
                      });
                      this.props.updateHoldings(event, this.props.coin)
                    }
                  }
                  size="15"
                  type="text"
                />

                <input
                    className="slider"
                    max={this.state.settings.sliderMax}
                    min="-100"
                    onChange={
                      event =>
                          this.setState({
                            simulate: event.target.value
                          })
                    }
                    style={{width: "80%"}}
                    type="range"
                    value={this.state.simulate}
                />

                <div>
                  Simulated Percent:
                  <input
                      maxLength="6"
                      onChange={
                        event =>
                            this.setState({
                              simulate: event.target.value
                            })
                      }
                      size="6"
                      type="text"
                      value={this.state.simulate}
                  />%
                </div>

                <div>
                  Simulated Price: {this.getLocalizedPrice(quote.price + ((quote.price) * (this.state.simulate * .01)))}
                </div>
                <div>
                  Simulated Value: {this.getLocalizedPrice((quote.price + ((quote.price) * (this.state.simulate * .01))) * (this.state.holdings) || 0)}
                </div>
                <div>
                  Simulated Cap: {this.getLocalizedPrice(this.props.coin.circulating_supply * (quote.price + (quote.price * (this.state.simulate * .01))))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Card;
