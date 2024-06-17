import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from '@/components/ui/table';
import { getTbaEvents, parseDateString } from '@/lib/utils';
import groupBy from 'lodash/groupBy';
import { Event } from '@/lib/TBATypes';
import Link from 'next/link';

async function WeeklyTable(props: { week: number; events: Event[] }) {
  return (
    <div className="mt-4">
      <div>
        <div className="inline-block text-3xl font-medium mr-3">
          Week {props.week + 1}
        </div>
        <div className="inline-block text-gray-600">
          {props.events.length} events
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Event</TableHead>
            <TableHead className="w-1/5">Dates</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {props.events.map((event) => (
            <TableRow key={event.key}>
              <TableCell>
                <div className="text-md font-semibold">
                  <Link href={`/event/${event.key}`}>{event.name}</Link>
                </div>
                <div className="text-sm text-gray-700">
                  {event.city}, {event.state_prov}, {event.country}
                </div>
              </TableCell>
              <TableCell>
                {parseDateString(event.start_date).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}{' '}
                to{' '}
                {parseDateString(event.end_date).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default async function Page() {
  const data = (await getTbaEvents(2024)).filter((e) => e.week !== null);

  const groupedData = groupBy(data, 'week');

  return (
    <>
      {Object.entries(groupedData).map(([key, value]) => (
        <>
          <WeeklyTable week={Number(key)} events={value} />
        </>
      ))}
    </>
  );
}
