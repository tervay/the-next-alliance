import AllianceSelectionTable from '@/components/tba/allianceSelectionTable';
import TbaMatchTable from '@/components/tba/matchTable';
import {
  getTbaEvent,
  getTbaEventAlliances,
  getTbaEventMatches,
  getTbaEventRankings,
  getTbaEventTeams,
  parseDateString,
  sortMatches,
} from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  EventAlliance,
  EventMatch,
  EventRankings,
  Ranking,
  Team,
} from '@/lib/TBATypes';

async function TeamAccordionEntry(props: {
  team: Team;
  alliance?: EventAlliance;
  ranking?: Ranking;
  matches: EventMatch[];
}) {
  const team = props.team;
  return (
    <AccordionItem value={team.key} key={team.key}>
      <AccordionTrigger>
        {team.key.substring(3)} - {team.nickname}
      </AccordionTrigger>
      <AccordionContent>
        <TbaMatchTable
          matches={sortMatches(
            props.matches.filter(
              (m) =>
                m.alliances.red.team_keys.includes(team.key) ||
                m.alliances.blue.team_keys.includes(team.key),
            ),
          )}
        />
      </AccordionContent>
    </AccordionItem>
  );
}

export default async function Event({
  params,
}: {
  params: { eventKey: string };
}) {
  const [eventInfo, eventAlliances, eventRankings, eventMatches, eventTeams] =
    await Promise.all([
      getTbaEvent(params.eventKey),
      getTbaEventAlliances(params.eventKey),
      getTbaEventRankings(params.eventKey),
      getTbaEventMatches(params.eventKey),
      getTbaEventTeams(params.eventKey),
    ]);

  const teams = eventTeams.sort((a, b) => a.team_number - b.team_number);
  const firstHalfTeams = teams.slice(0, Math.ceil(teams.length / 2));
  const secondHalfTeams = teams.slice(Math.ceil(teams.length / 2));

  return (
    <>
      <div className="mt-8"></div>
      <div className="text-4xl font-medium">
        {eventInfo.name} {eventInfo.year}
      </div>
      <div>[Other Divisions Placeholder]</div>
      {eventInfo.parent_event_key && (
        <div>Winners advance to {eventInfo.parent_event_key}</div>
      )}
      <div>
        {parseDateString(eventInfo.start_date).toLocaleString('en-US', {
          month: 'long',
          day: 'numeric',
        })}{' '}
        to{' '}
        {parseDateString(eventInfo.end_date).toLocaleString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })}
      </div>
      <div>
        {eventInfo.location_name}, {eventInfo.city}, {eventInfo.state_prov},{' '}
        {eventInfo.country}
      </div>

      <Tabs defaultValue="results" className="pt-4">
        <TabsList>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="rankings">Rankings</TabsTrigger>
          <TabsTrigger value="awards">Awards</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
        </TabsList>

        <TabsContent value="results">
          <div className="flex justify-evenly mt-4">
            <TbaMatchTable
              matches={eventMatches
                .filter((m) => m.comp_level === 'qm')
                .sort((a, b) => a.match_number - b.match_number)}
              bigHeader="Qualification Matches"
            />
            <div>
              <AllianceSelectionTable alliances={eventAlliances} />

              <TbaMatchTable
                matches={sortMatches(
                  eventMatches.filter((m) => m.comp_level !== 'qm'),
                )}
                bigHeader="Playoff Matches"
              />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="rankings">Change your rankings here.</TabsContent>
        <TabsContent value="teams">
          <div className="flex justify-evenly">
            <Accordion type="multiple" className="w-full">
              {firstHalfTeams.map((team) => (
                <TeamAccordionEntry
                  team={team}
                  ranking={eventRankings.rankings.find(
                    (r) => r.team_key === team.key,
                  )}
                  key={team.key}
                  matches={eventMatches.filter((m) =>
                    sortMatches(
                      eventMatches.filter(
                        (m) =>
                          m.alliances.red.team_keys.includes(team.key) ||
                          m.alliances.blue.team_keys.includes(team.key),
                      ),
                    ),
                  )}
                />
              ))}
            </Accordion>
            <Accordion type="multiple" className="w-full">
              {secondHalfTeams.map((team) => (
                <TeamAccordionEntry
                  team={team}
                  ranking={eventRankings.rankings.find(
                    (r) => r.team_key === team.key,
                  )}
                  key={team.key}
                  matches={eventMatches.filter((m) =>
                    sortMatches(
                      eventMatches.filter(
                        (m) =>
                          m.alliances.red.team_keys.includes(team.key) ||
                          m.alliances.blue.team_keys.includes(team.key),
                      ),
                    ),
                  )}
                />
              ))}
            </Accordion>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}
