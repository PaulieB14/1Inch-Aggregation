import {
  BitInvalidatorUpdated as BitInvalidatorUpdatedEvent,
  EIP712DomainChanged as EIP712DomainChangedEvent,
  EpochIncreased as EpochIncreasedEvent,
  OrderCancelled as OrderCancelledEvent,
  OrderFilled as OrderFilledEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  Paused as PausedEvent,
  Unpaused as UnpausedEvent,
  Swapped as SwappedEvent
} from "../generated/AggregationRouterV6/AggregationRouterV6"
import {
  BitInvalidatorUpdated,
  EIP712DomainChanged,
  EpochIncreased,
  OrderCancelled,
  OrderFilled,
  OwnershipTransferred,
  Paused,
  Unpaused,
  Swapped,
  User,
  Token,
  DailyStats
} from "../generated/schema"
import { BigInt, Bytes } from "@graphprotocol/graph-ts"

// Helper function to get or create user
function getOrCreateUser(address: Bytes): User {
  let user = User.load(address)
  if (!user) {
    user = new User(address)
    user.totalSwaps = BigInt.fromI32(0)
    user.totalVolume = BigInt.fromI32(0)
    user.firstSeen = BigInt.fromI32(0)
    user.lastSeen = BigInt.fromI32(0)
    user.swapCount = BigInt.fromI32(0)
  }
  return user
}

// Helper function to get or create token
function getOrCreateToken(address: Bytes): Token {
  let token = Token.load(address)
  if (!token) {
    token = new Token(address)
    token.symbol = ""
    token.name = ""
    token.decimals = 0
    token.totalSupply = BigInt.fromI32(0)
    token.transferCount = BigInt.fromI32(0)
    token.approvalCount = BigInt.fromI32(0)
  }
  return token
}

// Helper function to get or create daily stats
function getOrCreateDailyStats(timestamp: BigInt): DailyStats {
  let date = timestamp.toI32() / 86400 // Convert to days
  let dateString = date.toString()
  let dailyStats = DailyStats.load(dateString)
  if (!dailyStats) {
    dailyStats = new DailyStats(dateString)
    dailyStats.date = BigInt.fromI32(date * 86400)
    dailyStats.totalVolume = BigInt.fromI32(0)
    dailyStats.swapCount = BigInt.fromI32(0)
    dailyStats.uniqueUsers = BigInt.fromI32(0)
  }
  return dailyStats
}

export function handleBitInvalidatorUpdated(
  event: BitInvalidatorUpdatedEvent
): void {
  let entity = new BitInvalidatorUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.maker = event.params.maker
  entity.slotIndex = event.params.slotIndex
  entity.slotValue = event.params.slotValue

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleEIP712DomainChanged(
  event: EIP712DomainChangedEvent
): void {
  let entity = new EIP712DomainChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleEpochIncreased(event: EpochIncreasedEvent): void {
  let entity = new EpochIncreased(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.maker = event.params.maker
  entity.series = event.params.series
  entity.newEpoch = event.params.newEpoch

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOrderCancelled(event: OrderCancelledEvent): void {
  let entity = new OrderCancelled(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.orderHash = event.params.orderHash

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOrderFilled(event: OrderFilledEvent): void {
  let entity = new OrderFilled(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.orderHash = event.params.orderHash
  entity.remainingAmount = event.params.remainingAmount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePaused(event: PausedEvent): void {
  let entity = new Paused(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.account = event.params.account

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUnpaused(event: UnpausedEvent): void {
  let entity = new Unpaused(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.account = event.params.account

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSwapped(event: SwappedEvent): void {
  let entity = new Swapped(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.sender = event.params.sender
  entity.srcReceiver = event.params.srcReceiver
  entity.dstReceiver = event.params.dstReceiver
  entity.srcToken = event.params.srcToken
  entity.dstToken = event.params.dstToken
  entity.amount = event.params.amount
  entity.amountReceived = event.params.amountReceived

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  // Set up relationships using @derivedFrom instead of arrays
  entity.user = event.params.sender
  entity.srcTokenInfo = event.params.srcToken
  entity.dstTokenInfo = event.params.dstToken
  
  // Set up daily stats relationship
  let dailyStats = getOrCreateDailyStats(event.block.timestamp)
  entity.dailyStats = dailyStats.id

  entity.save()

  // Update analytics (mutable entities)
  let user = getOrCreateUser(event.params.sender)
  user.totalSwaps = user.totalSwaps.plus(BigInt.fromI32(1))
  user.totalVolume = user.totalVolume.plus(event.params.amount)
  if (user.firstSeen.equals(BigInt.fromI32(0))) {
    user.firstSeen = event.block.timestamp
  }
  user.lastSeen = event.block.timestamp
  user.save()

  // Update daily stats
  dailyStats.swapCount = dailyStats.swapCount.plus(BigInt.fromI32(1))
  dailyStats.totalVolume = dailyStats.totalVolume.plus(event.params.amount)
  dailyStats.save()
}
