import ScrollReveal from './ScrollReveal'

export default function StaggerReveal({ items, className = '', itemClassName = '', delay = 110 }) {
  return <ul className={className} aria-label="Businesses Benta supports">
    {items.map((item, index) => <li className={itemClassName} key={item}><ScrollReveal delay={index * delay} duration={450}>{item}</ScrollReveal></li>)}
  </ul>
}
