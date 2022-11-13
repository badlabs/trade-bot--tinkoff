import { ExchangeClient } from './ExchangeClient'
import {AbstractInfoModule} from '../../lib/abstract'
import {
  Currency,
  MarketInstrument,
} from '@tinkoff/invest-openapi-js-sdk'

const securitiesCache = new Map<string, MarketInstrument>()

export class InfoModule extends AbstractInfoModule<ExchangeClient>{

  constructor(exchangeClient: ExchangeClient){
    super(exchangeClient)
  }

  async getCurrencies() {
    return [ 'CHF', "CNY", 'EUR', "GBP", "HKD", "JPY", "RUB", "TRY", "USD" ] as Currency[]
  }

  async getSecurityLastPrice(ticker: string): Promise<number> {
    const { exchangeClient } = this
    const security = await this.getSecurity(ticker, true)
    const orderBook = await exchangeClient.api.orderbookGet({ figi: security?.figi || '' })
    return orderBook?.lastPrice || 0
  }

  async getSecurityCurrency(ticker: string): Promise<Currency> {
    const { getSecurity } = this
    const security = await getSecurity(ticker)
    if (!security) throw new Error(`Security with ticker "${ticker}" was not found`)
    if (!security.currency) throw new Error(`Security with ticker "${ticker}" has no currency`)
    return security.currency
  }

  async getSecurityName(ticker: string): Promise<string> {
    const { getSecurity } = this
    const security = await getSecurity(ticker)
    return security?.name || ''
  }

  async getSecurity(ticker: string, ignoreCache: boolean = false): Promise<MarketInstrument | null> {
    const { exchangeClient } = this
    if (!securitiesCache.has(ticker) || ignoreCache){
      const security = await exchangeClient.api.searchOne({ ticker })
      if (!security) return null
      securitiesCache.set(ticker, security)
      return security
    }
    // @ts-ignore
    return securitiesCache.get(ticker)
  }

  async getSecurityByExchangeId(id: string, ignoreCache: boolean = false): Promise<MarketInstrument | null>{
    const { exchangeClient } = this
    if (!securitiesCache.has(id) || ignoreCache){
      const security = await exchangeClient.api.searchOne({ figi: id })
      if (!security) return null
      securitiesCache.set(id, security)
      return security
    }
    // @ts-ignore
    return securitiesCache.get(id)
  }
}
