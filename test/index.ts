import {TradeBot} from "../lib/TradeBot";
import { OperationType, awaitTime } from "../lib/utils";

(async () => {

  const tradeBot = new TradeBot()

  console.info(`${new Date()} Waiting initialization...`)

  while (!tradeBot.exchangeClient.isAccountInitialized){
    await awaitTime(10)
  }
  await tradeBot.analyzer.updateCurrencies()
  console.info(`${new Date()} Starting tests...`)

  await tradeBot.trader.sendOrder({ ticker: 'AAPL', lots: 5, operation: 'limit_buy', price: 200 })
  await tradeBot.trader.sendOrder({ ticker: 'AAPL', lots: 5, operation: 'limit_buy', price: 300 })
  await tradeBot.trader.sendOrder({ ticker: 'AAPL', lots: 2, operation: 'limit_sell', price: 100 })
  console.table((await tradeBot.exchangeClient.api.currencies()).instruments)
  console.table((await tradeBot.exchangeClient.api.portfolio()).positions)
  console.table((await tradeBot.exchangeClient.api.portfolioCurrencies()).currencies)
})()

