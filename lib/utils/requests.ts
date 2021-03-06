import { IncomingHttpHeaders } from "http";
import { Application } from "express";
import { TradeBot } from "lib/TradeBot";
import {OperationType} from "./database";

export interface IHttpHeadersCarrier {
    headers: IncomingHttpHeaders
}

interface IExpressAppCarrier {
    app: Application
}

export function getTradeBotFromExpress(expressAppCarrier: IExpressAppCarrier): TradeBot {
    return expressAppCarrier.app.get('tradeBot')
}

export function stringToOperationType(str: string): OperationType {
    switch (str) {
        case 'limit_buy': return "limit_buy"
        case 'market_buy': return "market_buy"
        case 'buy_or_cancel': return 'market_buy'
        case 'limit_sell': return "limit_sell"
        case 'market_sell': return "market_sell"
        case 'sell_or_cancel': return 'market_sell'
        default: throw new Error(`${str} is not an operation type.`)
    }
}
