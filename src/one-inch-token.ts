import {
  Approval as ApprovalEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  Transfer as TransferEvent
} from "../generated/OneInchToken/OneInchToken"
import {
  Approval,
  OneInchTokenOwnershipTransferred,
  Transfer,
  User,
  Token
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
    token.symbol = "1INCH"
    token.name = "1inch Token"
    token.decimals = 18
    token.totalSupply = BigInt.fromI32(0)
    token.transferCount = BigInt.fromI32(0)
    token.approvalCount = BigInt.fromI32(0)
  }
  return token
}

export function handleApproval(event: ApprovalEvent): void {
  let entity = new Approval(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.spender = event.params.spender
  entity.value = event.params.value

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  // Set up relationships
  entity.token = event.address
  entity.user = event.params.owner

  entity.save()

  // Update user analytics
  let user = getOrCreateUser(event.params.owner)
  if (user.firstSeen.equals(BigInt.fromI32(0))) {
    user.firstSeen = event.block.timestamp
  }
  user.lastSeen = event.block.timestamp
  user.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OneInchTokenOwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.from = event.params.from
  entity.to = event.params.to
  entity.value = event.params.value

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  // Set up relationships
  entity.token = event.address
  entity.fromUser = event.params.from
  entity.toUser = event.params.to

  entity.save()

  // Update user analytics for both from and to addresses
  if (!event.params.from.equals(Bytes.fromHexString("0x0000000000000000000000000000000000000000"))) {
    let fromUser = getOrCreateUser(event.params.from)
    if (fromUser.firstSeen.equals(BigInt.fromI32(0))) {
      fromUser.firstSeen = event.block.timestamp
    }
    fromUser.lastSeen = event.block.timestamp
    fromUser.save()
  }

  if (!event.params.to.equals(Bytes.fromHexString("0x0000000000000000000000000000000000000000"))) {
    let toUser = getOrCreateUser(event.params.to)
    if (toUser.firstSeen.equals(BigInt.fromI32(0))) {
      toUser.firstSeen = event.block.timestamp
    }
    toUser.lastSeen = event.block.timestamp
    toUser.save()
  }
}
