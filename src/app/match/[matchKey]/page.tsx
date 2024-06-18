import { BigMatch } from '@/components/tba/matchPage';

export default async function Match({
  params,
}: {
  params: { matchKey: string };
}) {
  return <BigMatch key={params.matchKey} />;
}
