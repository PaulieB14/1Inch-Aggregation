import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import {
  NonceIncreased,
  OrderFilled,
  OrderFilledRFQ
} from "../generated/LimitOrderProtocol/LimitOrderProtocol"

export function createNonceIncreasedEvent(
  maker: Address,
  newNonce: BigInt
): NonceIncreased {
  let nonceIncreasedEvent = changetype<NonceIncreased>(newMockEvent())

  nonceIncreasedEvent.parameters = new Array()

  nonceIncreasedEvent.parameters.push(
    new ethereum.EventParam("maker", ethereum.Value.fromAddress(maker))
  )
  nonceIncreasedEvent.parameters.push(
    new ethereum.EventParam(
      "newNonce",
      ethereum.Value.fromUnsignedBigInt(newNonce)
    )
  )

  return nonceIncreasedEvent
}

export function createOrderFilledEvent(
  maker: Address,
  orderHash: Bytes,
  remaining: BigInt
): OrderFilled {
  let orderFilledEvent = changetype<OrderFilled>(newMockEvent())

  orderFilledEvent.parameters = new Array()

  orderFilledEvent.parameters.push(
    new ethereum.EventParam("maker", ethereum.Value.fromAddress(maker))
  )
  orderFilledEvent.parameters.push(
    new ethereum.EventParam(
      "orderHash",
      ethereum.Value.fromFixedBytes(orderHash)
    )
  )
  orderFilledEvent.parameters.push(
    new ethereum.EventParam(
      "remaining",
      ethereum.Value.fromUnsignedBigInt(remaining)
    )
  )

  return orderFilledEvent
}

export function createOrderFilledRFQEvent(
  orderHash: Bytes,
  makingAmount: BigInt
): OrderFilledRFQ {
  let orderFilledRfqEvent = changetype<OrderFilledRFQ>(newMockEvent())

  orderFilledRfqEvent.parameters = new Array()

  orderFilledRfqEvent.parameters.push(
    new ethereum.EventParam(
      "orderHash",
      ethereum.Value.fromFixedBytes(orderHash)
    )
  )
  orderFilledRfqEvent.parameters.push(
    new ethereum.EventParam(
      "makingAmount",
      ethereum.Value.fromUnsignedBigInt(makingAmount)
    )
  )

  return orderFilledRfqEvent
}
