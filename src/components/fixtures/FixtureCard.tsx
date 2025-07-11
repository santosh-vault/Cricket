import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, Trophy, ExternalLink, Globe, Star } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Fixture } from '../../hooks/useFixtures';

interface FixtureCardProps {
  fixture: Fixture;
  compact?: boolean;
  showScore?: boolean;
  isInternational?: boolean;
}

// Copy of isInternationalMatch from useFixtures
const isInternationalMatch = (fixture: Fixture): boolean => {
  const countryTeams = [
    'india', 'australia', 'england', 'south africa', 'new zealand', 'pakistan',
    'sri lanka', 'bangladesh', 'west indies', 'afghanistan', 'zimbabwe', 'ireland',
    'scotland', 'netherlands', 'nepal', 'oman', 'uae', 'united arab emirates',
    'papua new guinea', 'namibia', 'kenya', 'uganda', 'canada', 'usa', 'united states',
    'ind', 'aus', 'eng', 'sa', 'nz', 'pak', 'sl', 'ban', 'wi', 'afg', 'zim', 'ire',
    'sco', 'ned', 'nep', 'oma', 'png', 'nam', 'ken', 'uga', 'can',
    'india u19', 'australia u19', 'england u19', 'south africa u19', 'new zealand u19',
    'pakistan u19', 'sri lanka u19', 'bangladesh u19', 'west indies u19', 'afghanistan u19',
    'india under 19', 'australia under 19', 'england under 19', 'south africa under 19',
    'india women', 'australia women', 'england women', 'south africa women', 'new zealand women',
    'pakistan women', 'sri lanka women', 'bangladesh women', 'west indies women',
    'india w', 'australia w', 'england w', 'south africa w', 'new zealand w',
    'india a', 'australia a', 'england a', 'south africa a', 'new zealand a',
    'pakistan a', 'sri lanka a', 'bangladesh a'
  ];
  const internationalTournaments = [
    'world cup', 'icc', 't20 world cup', 'odi world cup', 'champions trophy',
    'asia cup', 'test championship', 'wtc', 'world test championship',
    'bilateral', 'tour', 'series', 'ashes', 'border-gavaskar', 'trophy',
    'international', 'tri-series', 'quadrangular', 'emerging teams',
    'under 19 world cup', 'u19 world cup', "women's world cup",
    'commonwealth games', 'asian games'
  ];
  const domesticLeagues = [
    'ipl', 'indian premier league', 'big bash', 'bbl', 'cpl', 'caribbean premier league',
    'psl', 'pakistan super league', 'the hundred', 'county', 'ranji', 'duleep',
    'syed mushtaq ali', 'vijay hazare', 'sheffield shield', 'plunket shield',
    'royal london', 'vitality blast', 'natwest', 'friends provident',
    'super smash', 'ford trophy', 'mzansi super league', 'csa t20',
    'bangladesh premier league', 'bpl', 'afghanistan premier league', 'apl',
    'everest premier league', 'epl', 'lanka premier league', 'lpl'
  ];
  const matchName = fixture.name?.toLowerCase() || '';
  const matchType = fixture.matchType?.toLowerCase() || '';
  const venue = fixture.venue?.toLowerCase() || '';
  const isDomestic = domesticLeagues.some(keyword =>
    matchName.includes(keyword) || matchType.includes(keyword) || venue.includes(keyword)
  );
  if (isDomestic) return false;
  const hasCountryTeams = fixture.teams?.some(team => {
    const teamLower = team.toLowerCase().trim();
    return countryTeams.some(country => {
      return teamLower === country ||
        teamLower.includes(country) ||
        teamLower.split(' ').some(word => word === country);
    });
  }) || false;
  const hasInternationalKeywords = internationalTournaments.some(keyword =>
    matchName.includes(keyword) || matchType.includes(keyword)
  );
  const hasVsInName = matchName.includes(' vs ') || matchName.includes(' v ');
  const isTestOdiT20 = ['test', 'odi', 't20i', 't20 international'].some(format =>
    matchType.includes(format) || matchName.includes(format)
  );
  return hasCountryTeams || hasInternationalKeywords || (hasVsInName && isTestOdiT20);
};

export const FixtureCard: React.FC<FixtureCardProps & { draggableProps?: any; dragHandleProps?: any; }> = ({ 
  fixture, 
  compact = false, 
  showScore = true,
  isInternational = false,
  draggableProps = {},
  dragHandleProps = {}
}) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'live':
        return 'bg-red-600 text-white font-bold animate-pulse shadow-md';
      case 'upcoming':
        return 'bg-brand-light text-white font-semibold';
      case 'completed':
        return 'bg-gray-500 text-white font-medium';
      default:
        return 'bg-gray-400 text-white font-medium';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return {
        date: format(date, 'MMM dd, yyyy'),
        time: format(date, 'hh:mm a')
      };
    } catch {
      return {
        date: 'TBD',
        time: 'TBD'
      };
    }
  };

  const { date, time } = formatDate(fixture.dateTimeGMT || fixture.date);

  const getScoreDisplay = () => {
    if (!fixture.score || fixture.score.length === 0) return null;
    
    // Enhanced score display with better formatting
    if (fixture.score.length === 1) {
      const score = fixture.score[0];
      return `${score.r}/${score.w} (${score.o} ov)`;
    } else if (fixture.score.length === 2) {
      const score1 = fixture.score[0];
      const score2 = fixture.score[1];
      return `${score1.r}/${score1.w} (${score1.o}) vs ${score2.r}/${score2.w} (${score2.o})`;
    }
    
    return fixture.score.map(s => `${s.r}/${s.w} (${s.o})`).join(' • ');
  };

  const getCardBorder = () => {
    if (isInternational) {
      return fixture.status === 'live' 
        ? 'shadow-md ring-1 ring-brand-200' 
        : 'shadow-md';
    }
    return '';
  };

  // Helper to get the correct teamInfo for a given team name
  const getTeamInfoForTeam = (teamName: string) => {
    if (!fixture.teamInfo) return undefined;
    return fixture.teamInfo.find(
      info => info.name.toLowerCase() === teamName.toLowerCase()
    );
  };

  // Enhanced helper to robustly match score to team
  const getTeamScore = (teamName: string, teamInfoEntry?: { name: string; shortname: string; img: string }, teamIdx?: number) => {
    if (!fixture.score) return null;
    const normalized = (str: string) =>
      str.toLowerCase().replace(/\bu19\b|\bwomen\b|\ba\b|under 19|\bw\b/g, '').replace(/[^a-z]/g, '').trim();
    const teamNorm = normalized(teamName);
    // Try full name, short name, abbreviation
    let candidates = [teamName];
    if (teamInfoEntry) {
      candidates.push(teamInfoEntry.shortname);
      candidates.push(teamInfoEntry.name);
    }
    candidates = candidates.filter(Boolean);
    // Try to find a score where the inning string matches any candidate (normalized)
    let found = fixture.score.find(s =>
      candidates.some(c => s.inning && normalized(s.inning).includes(normalized(c)))
    );
    // Fuzzy: try first word of team name
    if (!found) {
      const firstWord = teamName.split(' ')[0];
      found = fixture.score.find(s => s.inning && s.inning.toLowerCase().includes(firstWord.toLowerCase()));
    }
    // Fuzzy: try ignoring 'A', 'U19', 'Women', etc.
    if (!found) {
      found = fixture.score.find(s => normalized(s.inning || '') === teamNorm);
    }
    // Fallback: use original order
    if (!found && fixture.score[teamIdx ?? 0]) {
      found = fixture.score[teamIdx ?? 0];
    }
    return found || null;
  };

  // Helper to determine winner (simple logic: higher runs wins)
  const getWinner = () => {
    if (!fixture.matchEnded || !fixture.score || fixture.score.length === 0) return null;
    const team1Score = getTeamScore(fixture.teams[0] || '', getTeamInfoForTeam(fixture.teams[0] || ''), 0);
    const team2Score = getTeamScore(fixture.teams[1] || '', getTeamInfoForTeam(fixture.teams[1] || ''), 1);
    if (!team1Score || !team2Score) return null;
    if (team1Score.r > team2Score.r) return fixture.teams[0];
    if (team2Score.r > team1Score.r) return fixture.teams[1];
    return 'Draw';
  };

  const CardContent = () => {
    if (compact) {
      return (
        <div {...draggableProps} {...dragHandleProps} className={`bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-300 flex-shrink-0 cursor-grab active:cursor-grabbing group transform hover:-translate-y-1 ${getCardBorder()} w-72 h-40 select-none`}> 
          {/* Status indicator - minimal */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${fixture.status === 'live' ? 'bg-red-500 animate-pulse' : fixture.status === 'upcoming' ? 'bg-blue-500' : 'bg-gray-400'}`}></div>
              <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">{fixture.status}</span>
              {isInternational && (
                <span className="text-xs text-blue-600 font-medium">INT'L</span>
              )}
            </div>
          </div>

          {/* Teams with scores - side by side layout */}
          <div className="mb-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="font-bold text-base text-gray-900 truncate flex-1 pr-2" title={fixture.teams[0] || 'Team 1'}>
                  {fixture.teams[0] || 'Team 1'}
                </div>
                {showScore && fixture.score && fixture.score[0] && (
                  <div className="text-xs font-semibold text-gray-700 whitespace-nowrap">
                    {fixture.score[0].r}/{fixture.score[0].w}
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div className="font-bold text-base text-gray-900 truncate flex-1 pr-2" title={fixture.teams[1] || 'Team 2'}>
                  {fixture.teams[1] || 'Team 2'}
                </div>
                {showScore && fixture.score && fixture.score[1] && (
                  <div className="text-xs font-semibold text-gray-700 whitespace-nowrap">
                    {fixture.score[1].r}/{fixture.score[1].w}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tournament name - subtle */}
          <div className="mb-2">
            <p className="text-xs text-gray-500 truncate" title={fixture.name}>
              {fixture.name}
            </p>
          </div>

          {/* Bottom row - venue and time */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              <span className="truncate max-w-20">{fixture.venue}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              <span>{time}</span>
            </div>
          </div>


        </div>
      );
    }
    return (
      <div {...draggableProps} {...dragHandleProps} className={`bg-white rounded-lg shadow-md hover:shadow-md transition-all duration-300 cursor-grab active:cursor-grabbing group transform hover:-translate-y-1 ${getCardBorder()} p-4 mx-auto flex flex-col justify-between w-full select-none`}> 
        {/* Time & Location at top */}
        <div className="flex items-center justify-between text-xs text-gray-600 mb-2 font-sans">
          <span className="flex items-center"><MapPin className="h-3 w-3 mr-1" />{fixture.venue}</span>
          <span className="flex items-center"><Calendar className="h-3 w-3 mr-1" />{date}</span>
          <span className="flex items-center"><Clock className="h-3 w-3 mr-1" />{time}</span>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold font-sans ${getStatusColor(fixture.status)}`}>{fixture.status === 'live' ? '🔵 LIVE' : fixture.matchType?.toUpperCase() || 'MATCH'}</span>
              {isInternationalMatch(fixture) && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r from-brand to-brand-dark text-white shadow-md font-sans"><Globe className="h-4 w-4 mr-1" />International</span>
              )}
              <span className="text-base text-brand font-semibold font-serif max-w-[16rem] truncate block" title={fixture.name}>{fixture.name.length > 32 ? fixture.name.slice(0, 30) + '…' : fixture.name}</span>
            </div>
            <ExternalLink className="h-5 w-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-all duration-200" />
          </div>
          {/* Teams section */}
          <div className="mb-2">
            <div className="flex items-center justify-center space-x-8 text-center">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-brand mb-1 font-serif max-w-[10rem] truncate" title={fixture.teams[0] || 'Team 1'}>{(fixture.teams[0] || 'Team 1').length > 18 ? (fixture.teams[0] || 'Team 1').slice(0, 16) + '…' : fixture.teams[0] || 'Team 1'}</h3>
                {/* Score for team 1 */}
                {showScore && getTeamScore(fixture.teams[0] || '', getTeamInfoForTeam(fixture.teams[0] || ''), 0) && (
                  <div className="text-2xl font-extrabold text-blue-900 text-center leading-tight">
                    {getTeamScore(fixture.teams[0] || '', getTeamInfoForTeam(fixture.teams[0] || ''), 0)?.r ?? '-'}
                    /
                    {getTeamScore(fixture.teams[0] || '', getTeamInfoForTeam(fixture.teams[0] || ''), 0)?.w ?? '-'}
                    <span className="text-base font-semibold text-gray-500">
                      ({getTeamScore(fixture.teams[0] || '', getTeamInfoForTeam(fixture.teams[0] || ''), 0)?.o ?? '-'} ov)
                    </span>
                  </div>
                )}
              </div>
              <div className="px-4">
                <span className="text-2xl font-bold text-gray-400 font-sans">vs</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-brand mb-1 font-serif max-w-[10rem] truncate" title={fixture.teams[1] || 'Team 2'}>{(fixture.teams[1] || 'Team 2').length > 18 ? (fixture.teams[1] || 'Team 2').slice(0, 16) + '…' : fixture.teams[1] || 'Team 2'}</h3>
                {/* Score for team 2 */}
                {showScore && getTeamScore(fixture.teams[1] || '', getTeamInfoForTeam(fixture.teams[1] || ''), 1) && (
                  <div className="text-2xl font-extrabold text-blue-900 text-center leading-tight">
                    {getTeamScore(fixture.teams[1] || '', getTeamInfoForTeam(fixture.teams[1] || ''), 1)?.r ?? '-'}
                    /
                    {getTeamScore(fixture.teams[1] || '', getTeamInfoForTeam(fixture.teams[1] || ''), 1)?.w ?? '-'}
                    <span className="text-base font-semibold text-gray-500">
                      ({getTeamScore(fixture.teams[1] || '', getTeamInfoForTeam(fixture.teams[1] || ''), 1)?.o ?? '-'} ov)
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Winner at bottom if match completed */}
        {fixture.status === 'completed' && getWinner() && (
          <div className="mt-2 text-center text-green-700 font-bold text-base flex items-center justify-center gap-2"><Trophy className="h-5 w-5 text-yellow-500 inline-block mr-1" />{typeof getWinner() === 'string' ? `${getWinner()} won` : getWinner()}</div>
        )}
      </div>
    );
  };

  // Make the entire card clickable by wrapping it in a Link
  return (
    <Link 
      to={`/scorecard/${fixture.id}`}
      className="block hover:no-underline"
      onClick={(e) => {
        // Prevent navigation if dragging
        if (e.defaultPrevented) {
          e.preventDefault();
        }
      }}
    >
      <CardContent />
    </Link>
  );
};