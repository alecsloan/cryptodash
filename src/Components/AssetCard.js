import React, { Component } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/Card.css'
import TextField from '@material-ui/core/TextField'
import { Card, IconButton } from '@material-ui/core'
import { BarChart, Delete, Save, Settings as SettingsIcon } from '@material-ui/icons'
import Button from '@material-ui/core/Button'
import * as Util from '../Util/index'
import { Skeleton } from '@material-ui/lab'

function MyBalance (props) {
  if (props.holdings > 0 && props.settings.showCardBalances) {
    return (
      <div className='mt-2'>
        My Balance: {Util.getLocalizedPrice(props.price * props.holdings, props.settings)}
      </div>
    )
  }

  return (
    <div />
  )
}

function PercentChange (props) {
  let showPeriodChange = false

  if (props.period === '1h') {
    showPeriodChange = props.settings.show1hChange
  } else if (props.period === '24h') {
    showPeriodChange = props.settings.show24hChange
  } else if (props.period === '7d') {
    showPeriodChange = props.settings.show7dChange
  }

  if (showPeriodChange) {
    const hourColor = String(props.percentChange).includes('-') ? 'red' : 'green'

    const percent = <span>{Util.getLocalizedPercent(props.percentChange * 0.01)}</span>

    return (props.percentChange)
      ? (
        <div>
          {props.period}
          <b className={hourColor + ' ml-2'}>
            {percent}
          </b>
        </div>
        )
      : <Skeleton className='m-auto' height={20} width='50%' />
  }
}

class AssetCard extends Component {
  constructor (props) {
    super(props)
    this.state = {
      flip: false,
      settings: props.settings
    }
  }

  toggleSettings () {
    this.setState({ flip: !this.state.flip })
  }

  render () {
    const price = this.props.asset.price

    const front = this.state.flip ? 'none' : ''
    const back = this.state.flip ? '' : 'none'

    return (
      <Card className='card'>
        <div className={(window.innerWidth <= 760) ? 'row' : ''} style={{ display: front }} onClick={() => this.toggleSettings()}>
          <div className={(window.innerWidth <= 760) ? 'ml-2 w-50' : ''}>
            <IconButton
              aria-label={this.props.asset.name + ' settings'}
              className='settings pull-right'
              color='inherit'
              onClick={() => this.toggleSettings()}
            >
              <SettingsIcon />
            </IconButton>
            {
              this.props.asset.imageURL
                ? <img
                    alt={this.props.asset.name + ' Logo'}
                    className='card-img-top center'
                    src={this.props.asset.imageURL}
                  />
                : <Skeleton className='card-img-top m-auto' variant='circle' height={100} />
            }
            <h4 className='card-title'>
              {
              (this.props.asset.name && this.props.asset.symbol)
                ? `${this.props.asset.name} (${this.props.asset.symbol})`
                : <Skeleton className='m-auto' height={28} width='50%' />
            }
            </h4>
          </div>
          <div className='card-body'>
            <div className='card-text'>
              {price ? <div>Price: {Util.getLocalizedPrice(price, this.props.settings)}</div> : <Skeleton className='m-auto' height={20} width='50%' />}
              <PercentChange period='1h' percentChange={this.props.asset.percent_change_1h} settings={this.props.settings} />
              <PercentChange period='24h' percentChange={this.props.asset.percent_change_24h} settings={this.props.settings} />
              <PercentChange period='7d' percentChange={this.props.asset.percent_change_7d} settings={this.props.settings} />
              <MyBalance holdings={this.props.asset.holdings} price={price} settings={this.props.settings} />
            </div>
          </div>
        </div>
        <div className='back' style={{ display: back }}>
          <div className='card-body p-0'>
            <div className='row'>
              <IconButton
                aria-label={'remove ' + this.props.asset.name}
                className='settings pull-left visible'
                color='inherit'
                onClick={() => this.props.removeCrypto(this.props.asset.symbol)}
              >
                <Delete />
              </IconButton>
              <IconButton
                aria-label={'save ' + this.props.asset.name}
                className='settings pull-right visible'
                color='inherit'
                onClick={() => this.toggleSettings()}
              >
                <Save />
              </IconButton>
            </div>
            <h4 className='card-title settings-title'>
              <a className='text-white' href={this.props.asset.url} rel='noopener noreferrer' target='_blank'>
                {this.props.asset.name} ({this.props.asset.symbol})
              </a>
            </h4>

            <div className='card-text'>
              <div className='mb-2'>Price: {Util.getLocalizedPrice(price, this.props.settings)}</div>

              <TextField
                label='My Holdings'
                onChange={
                  event => {
                    this.props.updateHoldings(event.target.value, this.props.asset.symbol)
                  }
                }
                size='small'
                value={Util.getLocalizedNumber(this.props.asset.holdings, this.props.settings)}
                variant='outlined'
              />

              <MyBalance holdings={this.props.asset.holdings} price={price} settings={this.props.settings} />
            </div>

            <hr />

            <Button
              variant='contained'
              className='mb-2'
              color='primary'
              startIcon={<BarChart />}
              onClick={() => this.props.setAssetUtilityShown(this.props.asset)}
            >
              Simulation and more
            </Button>
          </div>
        </div>
      </Card>
    )
  }
}

export default AssetCard
