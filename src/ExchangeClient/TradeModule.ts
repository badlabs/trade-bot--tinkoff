import { ExchangeClient } from "./ExchangeClient";
import { OrderDetails } from "../../lib/utils";
import { C_Order } from "../exchangeClientTypes";
import {AbstractTradeModule} from "../../lib/modules";
import {PlacedLimitOrder, PlacedMarketOrder} from "@tinkoff/invest-openapi-js-sdk";

export class TradeModule extends AbstractTradeModule{

  constructor(exchangeClient: ExchangeClient){
    super(exchangeClient)
  }

  private static placedLimitOrderToOrder(order: PlacedLimitOrder, figi: string, price: number): C_Order {
    return {
      figi,
      operation: order.operation,
      price,
      status: order.status,
      orderId: order.orderId,
      requestedLots: order.requestedLots,
      type: "Limit",
      executedLots: order.executedLots
    }
  }

  private async placedMarketOrderToOrder(order: PlacedMarketOrder, figi: string, ticker: string): Promise<C_Order> {
    const price = await this.exchangeClient.infoModule.getSecurityLastPrice(ticker)
    return {
      figi,
      operation: order.operation,
      price,
      status: order.status,
      orderId: order.orderId,
      requestedLots: order.requestedLots,
      type: "Market",
      executedLots: order.executedLots
    }
  }

  private async getFigi(ticker: string): Promise<string> {
    const { exchangeClient } = this
    const security = await exchangeClient.infoModule.getSecurity(ticker, false)
    if (!security) throw new Error(`Security ${ticker} not found`)
    const { figi } = security
    return figi
  }

  public async sell({ ticker, lots, price }: OrderDetails): Promise<C_Order> {
    const { exchangeClient } = this
    const figi = await this.getFigi(ticker)
    const placedOrder = await exchangeClient.api.limitOrder({figi, operation: 'Sell', lots, price})
    return TradeModule.placedLimitOrderToOrder(placedOrder, figi, price)
  }

  public async buy({ ticker, lots, price }: OrderDetails): Promise<C_Order> {
    const { exchangeClient } = this
    const figi = await this.getFigi(ticker)
    const placedOrder = await exchangeClient.api.limitOrder({figi, operation: 'Buy', lots, price})
    return TradeModule.placedLimitOrderToOrder(placedOrder, figi, price)
  }

  public async marketSell({ ticker, lots }: OrderDetails): Promise<C_Order> {
    const { exchangeClient } = this
    const figi = await this.getFigi(ticker)
    const placedOrder = await exchangeClient.api.marketOrder({figi, operation: 'Sell', lots})
    return this.placedMarketOrderToOrder(placedOrder, figi, ticker)
  }

  public async marketBuy({ ticker, lots }: OrderDetails): Promise<C_Order> {
    const { exchangeClient } = this
    const figi = await this.getFigi(ticker)
    const placedOrder = await exchangeClient.api.marketOrder({figi, operation: 'Buy', lots})
    return this.placedMarketOrderToOrder(placedOrder, figi, ticker)
  }

  public async sellOrCancel(): Promise<C_Order> {
    throw new Error("Method not implemented.");
  }

  public async buyOrCancel(): Promise<C_Order> {
    throw new Error("Method not implemented.");
  }

}
