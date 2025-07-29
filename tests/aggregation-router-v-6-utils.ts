import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import {
  BitInvalidatorUpdated,
  EIP712DomainChanged,
  EpochIncreased,
  OrderCancelled,
  OrderFilled,
  OwnershipTransferred,
  Paused,
  Unpaused
} from "../generated/AggregationRouterV6/AggregationRouterV6"

export function createBitInvalidatorUpdatedEvent(
  maker: Address,
  slotIndex: BigInt,
  slotValue: BigInt
): BitInvalidatorUpdated {
  let bitInvalidatorUpdatedEvent =
    changetype<BitInvalidatorUpdated>(newMockEvent())

  bitInvalidatorUpdatedEvent.parameters = new Array()

  bitInvalidatorUpdatedEvent.parameters.push(
    new ethereum.EventParam("maker", ethereum.Value.fromAddress(maker))
  )
  bitInvalidatorUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "slotIndex",
      ethereum.Value.fromUnsignedBigInt(slotIndex)
    )
  )
  bitInvalidatorUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "slotValue",
      ethereum.Value.fromUnsignedBigInt(slotValue)
    )
  )

  return bitInvalidatorUpdatedEvent
}

export function createEIP712DomainChangedEvent(): EIP712DomainChanged {
  let eip712DomainChangedEvent = changetype<EIP712DomainChanged>(newMockEvent())

  eip712DomainChangedEvent.parameters = new Array()

  return eip712DomainChangedEvent
}

export function createEpochIncreasedEvent(
  maker: Address,
  series: BigInt,
  newEpoch: BigInt
): EpochIncreased {
  let epochIncreasedEvent = changetype<EpochIncreased>(newMockEvent())

  epochIncreasedEvent.parameters = new Array()

  epochIncreasedEvent.parameters.push(
    new ethereum.EventParam("maker", ethereum.Value.fromAddress(maker))
  )
  epochIncreasedEvent.parameters.push(
    new ethereum.EventParam("series", ethereum.Value.fromUnsignedBigInt(series))
  )
  epochIncreasedEvent.parameters.push(
    new ethereum.EventParam(
      "newEpoch",
      ethereum.Value.fromUnsignedBigInt(newEpoch)
    )
  )

  return epochIncreasedEvent
}

export function createOrderCancelledEvent(orderHash: Bytes): OrderCancelled {
  let orderCancelledEvent = changetype<OrderCancelled>(newMockEvent())

  orderCancelledEvent.parameters = new Array()

  orderCancelledEvent.parameters.push(
    new ethereum.EventParam(
      "orderHash",
      ethereum.Value.fromFixedBytes(orderHash)
    )
  )

  return orderCancelledEvent
}

export function createOrderFilledEvent(
  orderHash: Bytes,
  remainingAmount: BigInt
): OrderFilled {
  let orderFilledEvent = changetype<OrderFilled>(newMockEvent())

  orderFilledEvent.parameters = new Array()

  orderFilledEvent.parameters.push(
    new ethereum.EventParam(
      "orderHash",
      ethereum.Value.fromFixedBytes(orderHash)
    )
  )
  orderFilledEvent.parameters.push(
    new ethereum.EventParam(
      "remainingAmount",
      ethereum.Value.fromUnsignedBigInt(remainingAmount)
    )
  )

  return orderFilledEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent =
    changetype<OwnershipTransferred>(newMockEvent())

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createPausedEvent(account: Address): Paused {
  let pausedEvent = changetype<Paused>(newMockEvent())

  pausedEvent.parameters = new Array()

  pausedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )

  return pausedEvent
}

export function createUnpausedEvent(account: Address): Unpaused {
  let unpausedEvent = changetype<Unpaused>(newMockEvent())

  unpausedEvent.parameters = new Array()

  unpausedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )

  return unpausedEvent
}
