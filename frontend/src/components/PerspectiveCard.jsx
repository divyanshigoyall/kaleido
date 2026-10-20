import { Evidence } from './bits'

export default function PerspectiveCard({ p, onExplore }) {
  return (
    <article className={`persp ${p.key}`}>
      <h3>{p.label}</h3>
      <p className="stance">{p.stance}</p>
      <ul>{p.points.map((pt) => <li key={pt}>{pt}</li>)}</ul>
      <footer>
        <Evidence level={p.evidence} />
        <button className="link" onClick={onExplore}>Explore</button>
      </footer>
    </article>
  )
}
