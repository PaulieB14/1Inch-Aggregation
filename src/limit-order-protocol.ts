import {
  NonceIncreased as NonceIncreasedEvent,
  OrderFilled as OrderFilledEvent,
  OrderFilledRFQ as OrderFilledRFQEvent,
} from "../generated/LimitOrderProtocol/LimitOrderProtocol"
import {
  NonceIncreased,
  LimitOrderProtocolOrderFilled,
  OrderFilledRFQ,
} from "../generated/schema"

export function handleNonceIncreased(event: NonceIncreasedEvent): void {
  let entity = new NonceIncreased(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.maker = event.params.maker
  entity.newNonce = event.params.newNonce

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOrderFilled(event: OrderFilledEvent): void {
  let entity = new LimitOrderProtocolOrderFilled(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.maker = event.params.maker
  entity.orderHash = event.params.orderHash
  entity.remaining = event.params.remaining

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOrderFilledRFQ(event: OrderFilledRFQEvent): void {
  let entity = new OrderFilledRFQ(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.orderHash = event.params.orderHash
  entity.makingAmount = event.params.makingAmount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
