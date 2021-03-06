import { Request } from "express"
import { IncomingMessage } from "http"
import { config } from "../../../config"
import {IHttpHeadersCarrier} from "../../utils/requests";

export class BotAuth{
  private readonly botToken: string

  constructor(botToken: string){
    this.botToken = botToken
  }

  authByToken(token: string): boolean {
    if (!config.auth.required) return true
    return this.botToken === token
  }

  authByRequest(request: IHttpHeadersCarrier): boolean {
    const token = request.headers.authorization?.replace('Bearer ', '')
    return this.authByToken(token || '')
  }
}
