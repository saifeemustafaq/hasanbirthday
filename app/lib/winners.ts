export interface WinnerData {
  number: number;
  emoji: string;
  headline: string;
  message: string;
}

export const winners: WinnerData[] = [
  {
    number: 1,
    emoji: "✈️",
    headline: "Golden Boarding Pass",
    message:
      "Congratulations! You've received a Golden Boarding Pass! Please collect your special birthday gift.",
  },
  {
    number: 2,
    emoji: "🎉",
    headline: "Lucky Traveler",
    message:
      "Lucky Traveler! Your journey today comes with a surprise. Head over and claim your prize!",
  },
  {
    number: 3,
    emoji: "🛫",
    headline: "You've Landed a Win!",
    message:
      "You've landed a WIN! Thank you for celebrating Hasan's first birthday. Enjoy your special gift!",
  },
  {
    number: 4,
    emoji: "🌟",
    headline: "Destination: Winner!",
    message:
      "Destination: Winner! Your boarding pass has unlocked a birthday surprise. Congratulations!",
  },
  {
    number: 5,
    emoji: "🎈",
    headline: "Lucky Flyer",
    message:
      "You're one of Hasan's Lucky Flyers! Please collect your exclusive birthday reward.",
  },
  {
    number: 6,
    emoji: "🎁",
    headline: "First-Class Winner!",
    message:
      "First-Class Winner! You've been upgraded to a special surprise. Enjoy the celebration!",
  },
  {
    number: 7,
    emoji: "✨",
    headline: "Good Fortune Arrived",
    message:
      "Your flight has arrived with good fortune! A special birthday gift is waiting just for you.",
  },
  {
    number: 8,
    emoji: "🏅",
    headline: "Winner Alert!",
    message:
      "Winner Alert! You found one of Hasan's lucky boarding passes. Claim your prize and enjoy the party!",
  },
  {
    number: 9,
    emoji: "🎊",
    headline: "Adventure Reward Unlocked!",
    message:
      "Adventure Reward Unlocked! Thanks for joining Hasan's first trip around the sun. Your gift awaits!",
  },
  {
    number: 10,
    emoji: "🚀",
    headline: "Lucky Destination Reached",
    message:
      "You've reached your lucky destination! Please collect your birthday surprise and keep smiling.",
  },
  {
    number: 11,
    emoji: "💙",
    headline: "Lucky Passenger",
    message:
      "Lucky Passenger! Your boarding pass comes with a special birthday treat. Congratulations!",
  },
  {
    number: 12,
    emoji: "🌍",
    headline: "Bonus Stop: Winner!",
    message:
      "Bonus Stop: Winner! Your journey includes a surprise gift. Have an amazing celebration!",
  },
  {
    number: 13,
    emoji: "🎉",
    headline: "What a Lucky Landing!",
    message:
      "What a lucky landing! You're one of today's special winners. Please collect your prize.",
  },
  {
    number: 14,
    emoji: "✈️",
    headline: "Boarding Pass Selected!",
    message:
      "Your boarding pass has been selected! Enjoy a little extra happiness with a special birthday gift.",
  },
  {
    number: 15,
    emoji: "🏆",
    headline: "Congratulations, Explorer!",
    message:
      "Congratulations, Explorer! You've discovered one of Hasan's hidden birthday surprises. Please claim your gift and enjoy the celebration!",
  },
];

export function getWinner(id: number): WinnerData | null {
  return winners.find((w) => w.number === id) ?? null;
}
