import { Transfer as TransferEvent } from "../generated/OneInchToken/OneInchToken"
import { User, Token, DailyStats } from "../generated/schema"
import { BigInt, Bytes, Address } from "@graphprotocol/graph-ts"

// AggregationRouterV6 contract address
const AGGREGATION_ROUTER = "0x111111125421cA6dc452d289314280a0f8842A65"

// Store pending input transfers (to router) to pair with output transfers (from router)
let pendingInputs = new Map<string, TransferEvent>()

// Helper function to get or create a User entity
export function getOrCreateUser(address: Bytes): User {
  let user = User.load(address)
  if (!user) {
    user = new User(address)
    user.totalSwaps = BigInt.fromI32(0)
    user.totalVolume = BigInt.fromI32(0)
    user.firstSeen = BigInt.fromI32(0)
    user.lastSeen = BigInt.fromI32(0)
    user.swapCount = BigInt.fromI32(0)
    user.save()
  }
  return user
}

// Helper function to get or create a Token entity
export function getOrCreateToken(address: Bytes): Token {
  let token = Token.load(address)
  if (!token) {
    token = new Token(address)
    token.symbol = ""
    token.name = ""
    token.decimals = 18
    token.totalSupply = BigInt.fromI32(0)
    token.transferCount = BigInt.fromI32(0)
    token.approvalCount = BigInt.fromI32(0)
    token.save()
  }
  return token
}

// Helper function to get or create DailyStats entity
export function getOrCreateDailyStats(timestamp: BigInt): DailyStats {
  let dayStartTimestamp = timestamp.div(BigInt.fromI32(86400)).times(BigInt.fromI32(86400))
  let dayId = dayStartTimestamp.toString()
  let dailyStats = DailyStats.load(dayId)

  if (!dailyStats) {
    dailyStats = new DailyStats(dayId)
    dailyStats.date = dayStartTimestamp
    dailyStats.totalVolume = BigInt.fromI32(0)
    dailyStats.swapCount = BigInt.fromI32(0)
    dailyStats.uniqueUsers = BigInt.fromI32(0)
    dailyStats.save()
  }
  return dailyStats
}

// Handle Transfer events from any contract
export function handleTransfer(event: TransferEvent): void {
  let from = event.params.from
  let to = event.params.to
  let value = event.params.value
  let token = event.address
  let txHash = event.transaction.hash
  let blockNumber = event.block.number
  let timestamp = event.block.timestamp

  // Check if this is a transfer TO the AggregationRouterV6 (input)
  if (to.toHexString().toLowerCase() == AGGREGATION_ROUTER.toLowerCase()) {
    // Store this as a pending input transfer
    let inputKey = txHash.toHexString() + "-" + from.toHexString()
    pendingInputs.set(inputKey, event)
  }
  
  // Check if this is a transfer FROM the AggregationRouterV6 (output)
  if (from.toHexString().toLowerCase() == AGGREGATION_ROUTER.toLowerCase()) {
    // Look for a matching input transfer
    let inputKey = txHash.toHexString() + "-" + to.toHexString()
    let inputEvent = pendingInputs.get(inputKey)
    
    if (inputEvent) {
      // We found a matching input/output pair - create a Swap entity
      createSwapEntity(inputEvent, event)
      pendingInputs.delete(inputKey)
    }
  }

  // Update User and Token entities
  let fromUser = getOrCreateUser(from)
  if (fromUser.firstSeen == BigInt.fromI32(0)) {
    fromUser.firstSeen = timestamp
  }
  fromUser.lastSeen = timestamp
  fromUser.save()

  let toUser = getOrCreateUser(to)
  if (toUser.firstSeen == BigInt.fromI32(0)) {
    toUser.firstSeen = timestamp
  }
  toUser.lastSeen = timestamp
  toUser.save()

  let tokenEntity = getOrCreateToken(token)
  tokenEntity.save()
}

// Create a Swap entity from input/output transfer pair
function createSwapEntity(inputEvent: TransferEvent, outputEvent: TransferEvent): void {
  // For now, we'll just update the analytics without creating Swap entities
  // since the Swap entity isn't generated yet
  
  let user = getOrCreateUser(inputEvent.params.from)
  if (user.firstSeen == BigInt.fromI32(0)) {
    user.firstSeen = inputEvent.block.timestamp
  }
  user.lastSeen = inputEvent.block.timestamp
  user.totalSwaps = user.totalSwaps.plus(BigInt.fromI32(1))
  user.totalVolume = user.totalVolume.plus(inputEvent.params.value)
  user.save()

  let inputToken = getOrCreateToken(inputEvent.address)
  inputToken.save()

  let outputToken = getOrCreateToken(outputEvent.address)
  outputToken.save()

  let dailyStats = getOrCreateDailyStats(inputEvent.block.timestamp)
  dailyStats.totalVolume = dailyStats.totalVolume.plus(inputEvent.params.value)
  dailyStats.swapCount = dailyStats.swapCount.plus(BigInt.fromI32(1))
  dailyStats.uniqueUsers = dailyStats.uniqueUsers.plus(BigInt.fromI32(1))
  dailyStats.save()
} 