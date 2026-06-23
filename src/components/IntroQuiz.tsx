
import { ArrowRight, Clock, Copy, Sparkles, RotateCcw, Camera } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { DogDecoration } from './DogDecoration'

// 题目数据：适配滑块维度、叙事文案、极值标签、彩蛋判定关键词
const questions = [
  {
    name: 'Max',
    dimension: '',
    minLabel: '超迷你软萌小狗',
    maxLabel: '强烈硬汉雄性感',
    key: 'male',
  },
  {
    name: 'Coco',
    dimension: '',
    minLabel: '像大型护卫犬',
    maxLabel: '超迷你软萌小狗',
    key: 'tiny',
  },
  {
    name: 'Princess',
    dimension: '',
    minLabel: '力量粗犷风格',
    maxLabel: '温柔娇贵小公主',
    key: 'girly',
  },
]

type AnswerRecord = {
  name: string
  score: number
  dimension: string
  key: string
}

export function IntroQuiz() {
  const [currentIndex, setCurrentIndex] = useState(0)
  // 翻牌状态：未翻开 / 已翻开
  const [isCardFlipped, setIsCardFlipped] = useState(false)
  // 滑块分数 0-10
  const [slideValue, setSlideValue] = useState(5)
  // 全部答题记录
  const [answerList, setAnswerList] = useState<AnswerRecord[]>([])
  // 是否完成全部题目，展示报告
  const [isShowReport, setIsShowReport] = useState(false)
  // 计时相关
  const startTimeRef = useRef<number>(Date.now())
  const [costTime, setCostTime] = useState(0)
  const timerRef = useRef<number | null>(null)
  // 彩蛋动画开关
  const [showEasterEgg, setShowEasterEgg] = useState(false)
  // 页面切换淡入淡出
  const [isSwitching, setIsSwitching] = useState(false)

  const currentQuestion = questions[currentIndex]
  const totalCount = questions.length

  // 计时器
  useEffect(() => {
    startTimeRef.current = Date.now()
    timerRef.current = window.setInterval(() => {
      setCostTime(Math.floor((Date.now() - startTimeRef.current) / 1000))
    }, 1000)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  // 格式化秒数为 分:秒
  const formatTime = (s: number) => {
    const min = Math.floor(s / 60)
    const sec = s % 60
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
  }

  // 翻卡牌
  const flipCard = () => setIsCardFlipped(true)

  // 保存当前答案，进入下一题 / 生成报告
  const saveAnswerAndNext = () => {
    const newRecord: AnswerRecord = {
      name: currentQuestion.name,
      score: slideValue,
      dimension: currentQuestion.dimension,
      key: currentQuestion.key,
    }
    const newAnswers = [...answerList, newRecord]
    setAnswerList(newAnswers)
    setIsSwitching(true)

    setTimeout(() => {
      // 最后一题，展示人格报告
      if (currentIndex >= totalCount - 1) {
        setIsShowReport(true)
        // 判断彩蛋：三道全部高分(≥8)柔美向触发蝴蝶结彩蛋
        const allHighGirly = newAnswers.every(item => item.score >= 8)
        if (allHighGirly) setShowEasterEgg(true)
      } else {
        setCurrentIndex(prev => prev + 1)
        setSlideValue(5)
        setIsCardFlipped(false)
      }
      setIsSwitching(false)
    }, 500)
  }

  // 重置整套测试
  const resetQuiz = () => {
    setCurrentIndex(0)
    setAnswerList([])
    setSlideValue(5)
    setIsCardFlipped(false)
    setIsShowReport(false)
    setShowEasterEgg(false)
    startTimeRef.current = Date.now()
  }

  // 复制报告文本
  const copyReportText = async () => {
    const text = answerList
      .map(item => `${item.name}｜${item.dimension}倾向：${item.score}分/10`)
      .join('\n')
    await navigator.clipboard.writeText(`我的狗狗名字直觉测试报告\n用时${formatTime(costTime)}\n${text}`)
    alert('报告已复制剪贴板，可以截图保存！')
  }

  // 根据滑块分数控制小狗形象参数，传给 DogDecoration
  const getDogAnimationLevel = () => slideValue

  return (
    <section className="intro-quiz section-shell" id="intro" aria-labelledby="intro-title">
      {/* 装饰性狗狗图片 */}
      <img src="/assets/dogs/dog-corgi.png" alt="" className="quiz-deco-dog deco-left" aria-hidden="true" />
      <img src="/assets/dogs/dog-shiba.png" alt="" className="quiz-deco-dog deco-right" aria-hidden="true" />
      <img src="/assets/dogs/dog-bichon.png" alt="" className="quiz-deco-dog deco-bottom-left" aria-hidden="true" />
      <img src="/assets/dogs/dog-golden-retriever.png" alt="" className="quiz-deco-dog deco-bottom-right" aria-hidden="true" />
      
      <div className="section-heading compact">
        <p className="kicker">INTERACTIVE / 趣味名字心理测试</p>
        <h1 id="intro-title">一个名字，会让你看见怎样的狗？</h1>
        <p>翻开狗狗卡牌，滑动滑块表达你的直觉，完成后生成专属狗狗人格报告</p>
      </div>

      {/* 顶部进度+计时栏 */}
      <div className="quiz-header-bar">
        <span className="progress-num">{currentIndex + 1}/{totalCount}</span>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${((currentIndex + 1) / totalCount) * 100}%` }} />
        </div>
        <span className="timer"><Clock size={14} /> {formatTime(costTime)}</span>
      </div>

      {/* 主答题面板 / 报告面板切换 */}
      <div className={`quiz-main-wrap ${isSwitching ? 'fade-out' : 'fade-in'}`}>
        {!isShowReport ? (
          <div className="quiz-card-box">
            {/* 狗狗卡牌容器 */}
            <div className={`dog-flip-card ${isCardFlipped ? 'flipped' : ''}`} onClick={!isCardFlipped ? flipCard : undefined}>
              {/* 卡牌背面（盖住状态） */}
              <div className="card-back">
                <Sparkles size={32} className="sparkle-icon" />
                <p>点击翻开狗狗卡牌</p>
              </div>
              {/* 卡牌正面（翻开后） */}
              <div className="card-front">
                <DogDecoration name="papillon" className="quiz-dog" intensity={getDogAnimationLevel()} />
                <div className="dog-name-tag">{currentQuestion.name}</div>
              </div>
            </div>

            {/* 滑块打分区域，仅翻开卡牌后显示 */}
            {isCardFlipped && (
              <div className="slide-control-group">
                <p className="slide-title">你的直觉倾向：{currentQuestion.dimension}</p>
                <div className="slide-labels">
                  <span className="label-min">{currentQuestion.minLabel}</span>
                  <span className="label-max">{currentQuestion.maxLabel}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={10}
                  value={slideValue}
                  onChange={(e) => setSlideValue(Number(e.target.value))}
                  className="dog-slider"
                />
                <div className="score-display">当前直觉分值：<b>{slideValue}</b> / 10</div>

                <button className="next-step-btn" onClick={saveAnswerAndNext}>
                  {currentIndex < totalCount - 1 ? '记录直觉，下一张卡牌' : '完成测试，生成专属报告'}
                  <ArrowRight size={16} aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        ) : (
          // 完整狗狗人格报告面板
          <div className="report-panel">
            <h3 className="report-title">✨ 你的狗狗名字直觉人格报告</h3>
            <p className="report-time">完成用时：{formatTime(costTime)}</p>

            {/* 彩蛋动画弹窗 */}
            {showEasterEgg && (
              <div className="easter-egg-badge">
                <Sparkles /> 隐藏彩蛋解锁：蝴蝶结小公主爱好者！
              </div>
            )}

            <div className="answer-record-list">
              {answerList.map((item, idx) => (
                <div key={idx} className="record-card">
                  <span className="record-name">{item.name}</span>
                  <span className="record-desc">{item.dimension}</span>
                  <span className="record-score">{item.score} / 10</span>
                </div>
              ))}
            </div>

            <div className="report-desc">
              <p>你的直觉更偏向感性想象，名字会自动关联狗狗体型、性别与气质</p>
              <p>点进下方正文，我们将用真实狗狗数据验证你的主观印象。</p>
            </div>

            <div className="report-btn-group">
              <button className="btn-copy" onClick={copyReportText}>
                <Copy size={16} /> 复制报告文本
              </button>
              <button className="btn-reset" onClick={resetQuiz}>
                <RotateCcw size={16} /> 重新测试
              </button>
              <a href="#chapter-one" className="btn-jump">
                <Camera size={16} /> 进入数据章节 <ArrowRight size={16} />
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}