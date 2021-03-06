import { D_AlgorithmRun } from "@prisma/client";
import { ExchangeAnalyzer } from "../../lib/modules";
import { AbstractTradeAlgorithm } from "../../lib/modules/TradeBot/ExchangeAnalyzer/TradeAlgorithms";
import { addSecondsToDate, OrderDetails } from '../../lib/utils'
import {Job} from "node-schedule";

type HammerInput = {
  order: OrderDetails,
  date: Date,
  seconds_before: number
}
type HammerState = {
  send_date: Date
}
type HammerStopData = {
  job: Job
}

export class HammerAlgorithm extends AbstractTradeAlgorithm<HammerInput, HammerState, HammerStopData> {
  get name(): string { return 'hammer' }
  get description(): string { return 'hammer' }
  get inputs(): any {
    return {
      order: 'OrderDetails',
      date: 'Date',
      seconds_before: 'number'
    }
  }

  constructor(analyzer: ExchangeAnalyzer){
    super(analyzer)
  }

  async sendUntilNotRejected(order: OrderDetails, run_id: number) {
    try {
      const status = await this.trader.sendOrder(order, run_id)
      if (status === 'rejected') await this.sendUntilNotRejected(order, run_id)
    }
    catch (e) { await this.fixError(run_id, e) }
  }

  async main(inputs: HammerInput): Promise<D_AlgorithmRun> {
    const { order, seconds_before, date } = inputs
    const { trader } = this

    const send_date = addSecondsToDate(new Date(date), -seconds_before)

    const algorithmRun: D_AlgorithmRun = await this.fixStart(inputs, { send_date })

    const job = trader.scheduleAction(async () => {
      await this.sendUntilNotRejected(order, algorithmRun.id)
      await this.fixFinish(algorithmRun.id)
    }, send_date)

    this.stopData.set(algorithmRun.id, { job })

    return algorithmRun
  }

  async continue(id: number): Promise<D_AlgorithmRun> {
    const algorithmRun: D_AlgorithmRun = await this.loadProgress(id)
    const { order } = JSON.parse(algorithmRun.inputs)
    const { send_date } = JSON.parse(algorithmRun.state)
    const { trader } = this

    const job = trader.scheduleAction(async () => {
      await this.sendUntilNotRejected(order, algorithmRun.id)
      await this.fixFinish(algorithmRun.id)
    }, new Date(send_date))

    this.stopData.set(algorithmRun.id, { job })

    return await this.fixContinue(id)
  }

  async stop(id: number): Promise<D_AlgorithmRun> {
    const stopData = this.stopData.get(id)
    if (!stopData) throw new Error(`Algorithm run with id:${id} was not found.`)
    stopData?.job?.cancel()
    return await this.fixStop(id)
  }

}
