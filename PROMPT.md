You are buiding a live, kahoot-style game where players compete to create the funniest meme captions in real time and vote on the best ones.

Here is the stack:
- React with Vite
- Convex

The database needs the following entities:

## Users
userId: uuid (PK)
gameId: uuid (FK)
name: str

## Captions
captionId: uuid (PK)
userId: uuid (FK)
roundId: uuid (FK)
text: str
score: int (incremented +1 for upvote and -1 for downvote)
exposureCount: int (number of votes)

## Votes
userId: uuid
captionId: uuid
value: bool

## Round
roudId: uuid
imageURL: str
state: Enum[RoundState]
captionEndsAt: datetime
voteEndsAt: datetime

## Game
gameId: uuid
rounds: int

## GameRound
gameId: uuid
roundId: uuid

## RoundState:
- Lobby
- Caption
- Vote
- Finished

**Other considerations:**
- To start a game, users should be able to scan a QR code and input a username. The person starting the game should choose the number of rounds (max 10).
- In each round, there should be 1 minute of creating captions and 1 minute of voting.
- Votes should be distributed randomly so each vote has equal chance of being shown. However, this should be easily extendable so in the future we can have an algorithm that filters out frequently downvoted captions or duplicates etc.
- Users should only see one caption at a time and vote upvote or downvote.
- Users should not see the same caption twice or see captions that they created.

Create a plan to build a minimal frontend and completed backend.