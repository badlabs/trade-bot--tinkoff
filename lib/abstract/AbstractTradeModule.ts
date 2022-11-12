import {AbstractExchangeClient} from './AbstractExchangeClient'
import {OrderDetails, SubjectAreaTemplate} from '../types'
import {GetOrderType} from "../types/extractors";


export abstract class AbstractTradeModule<
  ExchangeApiType = any,
  SubjectArea extends SubjectAreaTemplate = SubjectAreaTemplate> {
  protected readonly exchangeClient: AbstractExchangeClient<ExchangeApiType, SubjectArea>

  protected constructor(exchangeClient: AbstractExchangeClient<ExchangeApiType, SubjectArea>){
    this.exchangeClient = exchangeClient
  }

  abstract sell({ ticker, lots, price }: OrderDetails): Promise<GetOrderType<SubjectArea>>

  abstract buy({ ticker, lots, price }: OrderDetails): Promise<GetOrderType<SubjectArea>>

  abstract marketSell({ ticker, lots }: OrderDetails): Promise<GetOrderType<SubjectArea>>

  abstract marketBuy({ ticker, lots }: OrderDetails): Promise<GetOrderType<SubjectArea>>

  abstract sellOrCancel(): Promise<GetOrderType<SubjectArea>>

  abstract buyOrCancel(): Promise<GetOrderType<SubjectArea>>

}