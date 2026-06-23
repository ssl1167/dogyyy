import { Dog, Map, MoonStar } from 'lucide-react'
import { BackToTop } from './components/BackToTop'
import { GenderBiasVisual, SizeNameHeatmap } from './components/BiasVisuals'
import { BoroughExplorer } from './components/BoroughExplorer'
import { ChapterNav } from './components/ChapterNav'
import { CultureTimeline } from './components/CultureTimeline'
import { DogDecoration } from './components/DogDecoration'
import { DogParade } from './components/DogParade'
import { FigureCard } from './components/ImageLightbox'
import { Hero } from './components/Hero'
import { HumanizationTimeline } from './components/HumanizationTimeline'
import { IntroQuiz } from './components/IntroQuiz'
import { MethodologyPanel } from './components/MethodologyPanel'
import { PawPrintField } from './components/PawPrintField'
import { ParticleNames } from './components/ParticleNames'
import { ReadingProgress } from './components/ReadingProgress'
import {
  chapterFive,
  chapterFour,
  chapterOne,
  chapterThree,
  chapterTwo,
  conclusion,
  figures,
} from './content/article'

function ChapterHeading({ kicker, title }: { kicker: string; title: string }) {
  return <div className="section-heading"><p className="kicker">{kicker}</p><h2>{title}</h2></div>
}

function Paragraphs({ items, subheads = [] }: { items: string[]; subheads?: number[] }) {
  return <>{items.map((text, index) => subheads.includes(index) ? <h3 key={text}>{text}</h3> : <p key={`${index}-${text.slice(0, 12)}`}>{text}</p>)}</>
}

function App() {
  return (
    <>
      <ReadingProgress />
      <ChapterNav />
      <div className="page-body">
        <PawPrintField />
        <Hero />
        <main>
        <article>
          <IntroQuiz />

          <section className="chapter section-shell" id={chapterOne.id} aria-labelledby="chapter-one-title">
            <DogDecoration name="golden-retriever" className="chapter-dog chapter-one-dog" />
            <div id="chapter-one-title"><ChapterHeading kicker={chapterOne.kicker} title={chapterOne.title} /></div>
            <div className="scrolly-layout">
              <div className="scrolly-copy"><Paragraphs items={chapterOne.paragraphs} /></div>
              <aside className="sticky-visual"><ParticleNames /></aside>
            </div>
            <FigureCard figure={figures.nameBubbles} className="wide-figure" />
          </section>

          <section className="chapter borough-chapter" id={chapterTwo.id} aria-labelledby="chapter-two-title">
            <DogDecoration name="pug" className="chapter-dog borough-dog" />
            <div className="section-shell" id="chapter-two-title"><ChapterHeading kicker={chapterTwo.kicker} title={chapterTwo.title} /></div>
            <div className="section-shell scrolly-layout borough-scrolly">
              <div className="scrolly-copy"><Paragraphs items={chapterTwo.paragraphs} subheads={[2, 5, 10, 13]} /></div>
              <aside className="sticky-visual"><BoroughExplorer /></aside>
            </div>
            <div className="section-shell figure-triptych">
              <FigureCard figure={figures.boroughCategory} />
              <FigureCard figure={figures.boroughTop20} />
            </div>
          </section>

          <section className="chapter culture-chapter section-shell" id={chapterThree.id} aria-labelledby="chapter-three-title">
            <DogDecoration name="doberman-sitting" className="chapter-dog culture-dog" intensity={8} />
            <div id="chapter-three-title"><ChapterHeading kicker={chapterThree.kicker} title={chapterThree.title} /></div>
            <div className="article-column"><Paragraphs items={chapterThree.paragraphs} /></div>
            <CultureTimeline />
          </section>

          <section className="chapter mirror-chapter" id={chapterFour.id} aria-labelledby="chapter-four-title">
            <DogDecoration name="french-bulldog" className="chapter-dog mirror-dog" />
            <div className="section-shell" id="chapter-four-title"><ChapterHeading kicker={chapterFour.kicker} title={chapterFour.title} /></div>
            <div className="section-shell scrolly-layout mirror-stage">
              <div className="scrolly-copy"><Paragraphs items={chapterFour.paragraphs.slice(0, 5)} subheads={[2]} /></div>
              <aside className="sticky-visual"><GenderBiasVisual /></aside>
            </div>
            <div className="section-shell scrolly-layout mirror-stage">
              <div className="scrolly-copy"><Paragraphs items={chapterFour.paragraphs.slice(5)} subheads={[0]} /></div>
              <aside className="sticky-visual"><SizeNameHeatmap /></aside>
            </div>
          </section>

          <section className="chapter night-chapter" id={chapterFive.id} aria-labelledby="chapter-five-title">
            <DogDecoration name="bichon" className="chapter-dog night-dog" />
            <div className="night-skyline" aria-hidden="true">{Array.from({ length: 24 }).map((_, index) => <i key={index} />)}</div>
            <div className="section-shell">
              <div id="chapter-five-title"><ChapterHeading kicker={chapterFive.kicker} title={chapterFive.title} /></div>
              <div className="night-intro"><MoonStar aria-hidden="true" /><p>{chapterFive.paragraphs[0]}</p></div>
              <div className="article-column"><Paragraphs items={chapterFive.paragraphs.slice(1, 6)} /></div>
              <HumanizationTimeline />
              <div className="article-column late-copy"><Paragraphs items={chapterFive.paragraphs.slice(6)} /></div>
            </div>
          </section>

          <section className="conclusion section-shell" id={conclusion.id} aria-labelledby="conclusion-title">
            <DogDecoration name="corgi" className="conclusion-dog conclusion-dog-left" intensity={8} />
            <DogDecoration name="boston-terrier" className="conclusion-dog conclusion-dog-right" intensity={8} />     
            <div className="central-park-mark" aria-hidden="true"><Map /><Dog /></div>
            <div id="conclusion-title"><ChapterHeading kicker={conclusion.kicker} title={conclusion.title} /></div>
            <DogParade />
            <div className="article-column conclusion-copy"><Paragraphs items={conclusion.paragraphs} /></div>
            <blockquote className="final-statement">在这个意义上，全城的狗叫什么名字，恰恰是这座城市最精准的情感温度计。它测量的，是我们对归属感的渴望，对美的共识，以及对一份无条件之爱的集体向往。</blockquote>
            <div className="returning-names" aria-hidden="true"><span>Max</span><span>Bella</span><span>Luna</span><span>Charlie</span><span>Coco</span></div>
          </section>
        </article>
      </main>
      <MethodologyPanel />
      <footer>
        <div><span>作品名称</span><strong>纽约狗名大揭秘——从狗名看城市文化、流行趋势与都市情感</strong></div>
        <div><span>小组信息</span><strong>组长：段婕　组员：宋诗琳　包放　谭佳雨</strong></div>
      </footer>
      </div>
      <BackToTop />
    </>
  )
}

export default App
