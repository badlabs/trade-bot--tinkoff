import { ExchangeClient } from "../exchange";
import {BotAuth, BotLogger, ExchangeAnalyzer, ExchangeTrader, ExchangeWatcher} from "./modules";

export class TradeBot {
    private readonly _analyzer: ExchangeAnalyzer
    private readonly _trader: ExchangeTrader
    private readonly _watcher: ExchangeWatcher
    private readonly _exchangeClient: ExchangeClient
    private readonly _logger: BotLogger
    private readonly _auth: BotAuth

    constructor({exchangeToken, botToken}: { exchangeToken: string, botToken: string }) {
        this._analyzer = new ExchangeAnalyzer(this)
        this._trader = new ExchangeTrader(this)
        this._watcher = new ExchangeWatcher(this)
        this._logger = new BotLogger()
        this._exchangeClient = new ExchangeClient(exchangeToken)
        this._auth = new BotAuth(botToken)
    }

    public static createBotByEnv() {
        return new TradeBot({ 
            exchangeToken: process.env.TINKOFF_SANDBOX_API_KEY || '',
            botToken: process.env.BOT_TOKEN || ''
        })
    }

    public get analyzer(): ExchangeAnalyzer { return this._analyzer }
    public get trader(): ExchangeTrader { return this._trader }
    public get watcher(): ExchangeWatcher { return this._watcher }
    public get exchangeClient(): ExchangeClient { return this._exchangeClient }
    public get logger(): BotLogger { return this._logger }
    public get auth(): BotAuth { return this._auth }
}
