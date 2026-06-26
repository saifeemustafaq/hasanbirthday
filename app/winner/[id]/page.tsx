import { notFound } from "next/navigation";
import BoardingPass from "../../components/BoardingPass";
import { getWinner } from "../../lib/winners";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return Array.from({ length: 15 }, (_, i) => ({ id: String(i + 1) }));
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const num = parseInt(id, 10);
  const winner = getWinner(num);
  if (!winner) return { title: "Not Found" };
  return {
    title: `Winner #${winner.number} — Hasan's Birthday ✈️`,
    description: winner.headline,
  };
}

export default async function WinnerPage({ params }: Props) {
  const { id } = await params;
  const num = parseInt(id, 10);
  const winner = getWinner(num);

  if (!winner || isNaN(num)) {
    notFound();
  }

  return (
    <BoardingPass
      type="winner"
      number={winner.number}
      emoji={winner.emoji}
      headline={winner.headline}
      message={winner.message}
    />
  );
}
