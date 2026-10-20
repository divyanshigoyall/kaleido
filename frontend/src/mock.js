// Sample data so the GUI works without the backend.
// The real backend should return the same shape (see evReport below).
export const STAGES = ['Searching sources', 'Retrieving passages', 'Grouping perspectives', 'Writing and verifying claims']

const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const fmt = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()))

const sources = [
  { id: 's1', title: 'Subsidy design and electric vehicle uptake: a multi-country panel study', publisher: 'Journal of Transport Economics', author: 'A. Rahman, L. Ortiz', type: 'academic', url: 'https://example.com/sources/1', retrieved: 'Sep 10, 2025', license: 'Open access (CC BY)' },
  { id: 's2', title: 'Who claims EV rebates? Evidence from tax records', publisher: 'Public Finance Review', author: 'M. Chen', type: 'academic', url: 'https://example.com/sources/2', retrieved: 'Sep 10, 2025', license: 'Publisher licence' },
  { id: 's3', title: 'Charging networks and adoption: a regional comparison', publisher: 'Urban Mobility Institute', author: '', type: 'research', url: 'https://example.com/sources/3', retrieved: 'Sep 10, 2025', license: 'Open access (CC BY)' },
  { id: 's4', title: 'Rebate cuts hit showroom sales, dealers say', publisher: 'The Daily Ledger', author: 'S. Kapoor', type: 'news', url: 'https://example.com/sources/4', retrieved: 'Sep 10, 2025', license: 'Licensed for analysis' },
  { id: 's5', title: 'Phase-down schedules for clean vehicle incentives', publisher: 'Centre for Energy Policy', author: 'R. Idowu', type: 'research', url: 'https://example.com/sources/5', retrieved: 'Sep 10, 2025', license: 'Open access (CC BY-NC)' },
  { id: 's6', title: 'The cost of a tonne avoided: comparing climate policies', publisher: 'The Daily Ledger', author: 'N. Verma', type: 'news', url: 'https://example.com/sources/6', retrieved: 'Sep 10, 2025', license: 'Licensed for analysis' },
]

const evidence = [
  { id: 'e1', source_id: 's1', relevance: 0.91, passage: 'In markets with the largest rebates, the gap in total cost of ownership between electric and petrol cars narrowed noticeably within two years of introduction.' },
  { id: 'e2', source_id: 's6', relevance: 0.84, passage: 'Estimates of public cost per tonne of emissions avoided range widely, depending on the baseline and on how many buyers would have purchased anyway.' },
  { id: 'e3', source_id: 's4', relevance: 0.58, passage: 'Dealers reported a drop in orders in the quarter after the rebate was reduced, though several said stock shortages also played a part.' },
  { id: 'e4', source_id: 's5', relevance: 0.77, passage: 'Countries that tied incentives to local assembly saw faster growth in domestic production capacity over the following five years.' },
  { id: 'e5', source_id: 's2', relevance: 0.89, passage: 'Rebate claims were concentrated in the upper income bands, and a large share of claimants reported they were already planning to buy an electric vehicle.' },
  { id: 'e6', source_id: 's4', relevance: 0.31, passage: 'Some analysts argued that maker-specific credits could blunt price competition, but no comparison data was presented.' },
  { id: 'e7', source_id: 's5', relevance: 0.72, passage: 'Point-of-sale rebates with income caps reached a higher share of first-time buyers than flat tax credits claimed at filing.' },
  { id: 'e8', source_id: 's3', relevance: 0.8, passage: 'Charger density within a short drive was a stronger predictor of regional adoption than the size of the purchase incentive.' },
]

const claims = [
  { id: 'c1', perspective: 'supportive', stance: 'support', verification: 'supported', evidence_ids: ['e1'], text: 'Purchase incentives narrowed the price gap between electric and petrol cars in early-adoption markets.' },
  { id: 'c2', perspective: 'supportive', stance: 'support', verification: 'weak', evidence_ids: ['e3'], text: 'Markets that cut subsidies abruptly saw sales dip the following quarter.' },
  { id: 'c3', perspective: 'supportive', stance: 'support', verification: 'supported', evidence_ids: ['e4'], text: 'Domestic EV manufacturing grew fastest where incentives came with local production rules.' },
  { id: 'c4', perspective: 'critical', stance: 'oppose', verification: 'supported', evidence_ids: ['e5'], text: 'A large share of subsidy spending went to households that would have bought an EV anyway.' },
  { id: 'c5', perspective: 'critical', stance: 'oppose', verification: 'supported', evidence_ids: ['e5'], text: 'Rebates were claimed disproportionately by higher-income buyers.' },
  { id: 'c6', perspective: 'critical', stance: 'oppose', verification: 'unsupported', evidence_ids: ['e6'], text: 'Maker-specific credits reduced price competition between manufacturers.' },
  { id: 'c7', perspective: 'critical', stance: 'neutral', verification: 'supported', evidence_ids: ['e2'], text: 'The public cost per tonne of CO2 avoided varies widely between estimates.' },
  { id: 'c8', perspective: 'balanced', stance: 'neutral', verification: 'supported', evidence_ids: ['e1', 'e7'], text: 'Incentives matter most early in adoption and become less effective as the market matures.' },
  { id: 'c9', perspective: 'balanced', stance: 'support', verification: 'weak', evidence_ids: ['e7'], text: 'Income-capped, point-of-sale rebates reach more first-time buyers than flat tax credits.' },
  { id: 'c10', perspective: 'alternative', stance: 'support', verification: 'supported', evidence_ids: ['e8'], text: 'Public charging density predicts regional adoption better than purchase price.' },
  { id: 'c11', perspective: 'alternative', stance: 'neutral', verification: 'weak', evidence_ids: ['e8'], text: 'Emission standards can shift manufacturer behaviour without direct fiscal cost, but evidence covers only a few markets.' },
]

function evReport() {
  return {
    summary: 'Electric vehicle subsidies aim to speed up the move to cleaner transport and to grow a domestic EV industry. Supporters point to lower purchase prices and faster adoption. Critics say the money often goes to buyers who would have purchased anyway. The sources agree that charging infrastructure matters and that incentives work best early on. They split on cost-effectiveness and on who benefits.',
    reading_minutes: 8,
    perspectives: [
      { key: 'supportive', label: 'Supportive', stance: 'Subsidies should continue to speed up adoption and the clean energy transition.', points: ['Lower the upfront cost of EVs', 'Help meet climate goals', 'Build a domestic EV industry and jobs'], evidence: 'strong', sources_count: 4, details: 'Supporters rely mostly on adoption and market-structure studies. Their strongest evidence concerns early markets, where price gaps were largest. Evidence on long-run effects is thinner.' },
      { key: 'critical', label: 'Critical', stance: 'Subsidies are costly and may not work well in the long run.', points: ['High public cost per tonne avoided', 'Benefits skew toward higher-income buyers', 'Possible market distortion'], evidence: 'mixed', sources_count: 5, details: 'This is the most widely cited viewpoint across the sources, but its evidence is uneven. The claim about who benefits is well documented. The claim about reduced competition rests on one passage with low relevance.' },
      { key: 'balanced', label: 'Balanced', stance: 'Subsidies should be reduced over time and better targeted.', points: ['Keep incentives for early adoption', 'Phase them out as the market matures', 'Focus on lower-income buyers'], evidence: 'moderate', sources_count: 3, details: 'Balanced views draw on both camps and mostly discuss design: income caps, point-of-sale payments and phase-out schedules.' },
      { key: 'alternative', label: 'Alternative view', stance: 'Focus should shift to non-monetary incentives and infrastructure.', points: ['Invest in charging networks', 'Support research and innovation', 'Use regulation such as emission standards'], evidence: 'limited', sources_count: 2, details: 'Few sources take this position directly. The charging evidence is solid, while the case for regulation rests on a small number of markets.' },
    ],
    agreement: [
      { text: 'Cleaner transport is a shared goal.', claims: [] },
      { text: 'Charging infrastructure matters for long-term adoption.', claims: ['c10'] },
      { text: 'Incentives work best early in adoption.', claims: ['c8', 'c1'] },
    ],
    disagreement: [
      { text: 'Whether subsidy spending is cost-effective compared with other climate measures.', claims: ['c4', 'c7'] },
      { text: 'Who actually benefits from rebates.', claims: ['c5', 'c9'] },
      { text: 'Whether subsidies distort competition between manufacturers.', claims: ['c6'] },
    ],
    uncertainty: [
      { text: 'How much long-term emission reduction can be credited to subsidies alone.', claims: [] },
      { text: 'How phase-out timing affects manufacturer investment.', claims: ['c2'] },
      { text: 'Whether emission standards work as well outside the few markets studied.', claims: ['c11'] },
    ],
    claims, evidence, sources,
  }
}

function genericReport() {
  const s = sources.slice(0, 4)
  const e = evidence.slice(0, 4).map((x, i) => ({ ...x, id: `e${i + 1}`, source_id: s[i].id }))
  const c = (id, perspective, stance, verification, ev, text) => ({ id, perspective, stance, verification, evidence_ids: ev, text })
  return {
    summary: 'The sources disagree about this question, and the disagreement is mostly about weighing benefits against costs. Several viewpoints are well documented, others rest on a single study. The sections below show what each side claims, how strong the evidence is, and what remains unknown.',
    reading_minutes: 6,
    perspectives: [
      { key: 'supportive', label: 'Supportive', stance: 'The benefits outweigh the costs.', points: ['Benefits are documented in several sources', 'Early results point in a positive direction', 'Supporters cite long-term gains'], evidence: 'moderate', sources_count: 3, details: 'Supporters rely on a mix of studies and reporting. The evidence is consistent but covers a limited period.' },
      { key: 'critical', label: 'Critical', stance: 'The costs or risks are larger than claimed.', points: ['Costs are often understated', 'Benefits are unevenly shared', 'Side effects are underreported'], evidence: 'mixed', sources_count: 3, details: 'Critics cite documented costs, but some claims depend on assumptions the sources do not test.' },
      { key: 'balanced', label: 'Balanced', stance: 'The answer depends on design and context.', points: ['Results differ by setting', 'Implementation details matter', 'Revisit as evidence grows'], evidence: 'moderate', sources_count: 2, details: 'Balanced views focus on conditions under which each side is right.' },
      { key: 'alternative', label: 'Alternative view', stance: 'The question is framed too narrowly.', points: ['Other approaches may work better', 'Consider indirect factors', 'Evidence is still emerging'], evidence: 'limited', sources_count: 1, details: 'Only one source argues this directly, so treat it as an open suggestion.' },
    ],
    agreement: [{ text: 'The question matters and deserves careful evidence.', claims: [] }, { text: 'Context changes the outcome.', claims: ['c5'] }],
    disagreement: [{ text: 'How large the benefits are.', claims: ['c1', 'c3'] }, { text: 'How the costs should be counted.', claims: ['c4'] }],
    uncertainty: [{ text: 'Long-term effects are not yet measured.', claims: [] }, { text: 'The alternative framing has limited evidence.', claims: ['c7'] }],
    claims: [
      c('c1', 'supportive', 'support', 'supported', ['e1'], 'Documented benefits appear in several independent sources.'),
      c('c2', 'supportive', 'support', 'weak', ['e2'], 'Early results will continue over the long term.'),
      c('c3', 'critical', 'oppose', 'supported', ['e3'], 'Reported costs are higher than first estimates.'),
      c('c4', 'critical', 'oppose', 'unsupported', ['e4'], 'Side effects are widely underreported.'),
      c('c5', 'balanced', 'neutral', 'supported', ['e1', 'e3'], 'Outcomes differ meaningfully by setting.'),
      c('c6', 'balanced', 'support', 'weak', ['e3'], 'Targeted designs perform better than broad ones.'),
      c('c7', 'alternative', 'neutral', 'weak', ['e4'], 'Indirect approaches may achieve similar goals at lower cost.'),
    ],
    evidence: e, sources: s,
  }
}

export async function mockReport(question, opts = {}, onStage = () => {}) {
  for (let i = 0; i < STAGES.length; i++) { onStage(i); await wait(650) }
  onStage(STAGES.length)
  if (/#error/i.test(question)) throw new Error('The language model service did not respond in time.')
  const base = /electric|\bev\b|subsid/i.test(question) ? evReport() : genericReport()
  return { ...base, mock: true, id: uid(), question, scope: opts.scope || 'all', searched_on: fmt(new Date()), source_total: base.sources.length }
}

export function seedReports() {
  const day = 86400000
  return [['Is remote work still growing?', 2], ['Does social media harm teen mental health?', 4], ['Should AI replace software engineers?', 7]].map(([q, ago]) => ({
    ...genericReport(), mock: true, id: uid(), question: q, scope: 'all', searched_on: fmt(new Date(Date.now() - ago * day)), source_total: 4,
  }))
}
