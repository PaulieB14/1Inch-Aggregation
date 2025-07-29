import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import { BitInvalidatorUpdated } from "../generated/schema"
import { BitInvalidatorUpdated as BitInvalidatorUpdatedEvent } from "../generated/AggregationRouterV6/AggregationRouterV6"
import { handleBitInvalidatorUpdated } from "../src/aggregation-router-v-6"
import { createBitInvalidatorUpdatedEvent } from "./aggregation-router-v-6-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let maker = Address.fromString("0x0000000000000000000000000000000000000001")
    let slotIndex = BigInt.fromI32(234)
    let slotValue = BigInt.fromI32(234)
    let newBitInvalidatorUpdatedEvent = createBitInvalidatorUpdatedEvent(
      maker,
      slotIndex,
      slotValue
    )
    handleBitInvalidatorUpdated(newBitInvalidatorUpdatedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("BitInvalidatorUpdated created and stored", () => {
    assert.entityCount("BitInvalidatorUpdated", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "BitInvalidatorUpdated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "maker",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "BitInvalidatorUpdated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "slotIndex",
      "234"
    )
    assert.fieldEquals(
      "BitInvalidatorUpdated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "slotValue",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
