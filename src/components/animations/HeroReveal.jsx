import ScrollReveal from './ScrollReveal'

export default function HeroReveal({ eyebrow, headline, categories }) {
  return <>
    <ScrollReveal className="hero-eyebrow-reveal" delay={0} duration={400}>{eyebrow}</ScrollReveal>
    <ScrollReveal className="hero-headline-reveal" delay={90} duration={550}>{headline}</ScrollReveal>
    <ScrollReveal className="hero-categories-reveal" delay={170} duration={500}>{categories}</ScrollReveal>
  </>
}
