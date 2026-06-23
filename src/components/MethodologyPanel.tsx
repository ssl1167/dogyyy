import { Database, FileText, Layers3 } from 'lucide-react'

export function MethodologyPanel() {
  return (
    <aside className="methodology section-shell" aria-label="内容与实现说明">
      <details>
        <summary><FileText aria-hidden="true" /> 内容与数据说明</summary>
        <div className="details-body">
          
          <p>纽约五大区简化轮廓只承担选择和导航功能；区域面板仅展示主文档正文或原图中能够确认的信息。</p>
          <p>流行文化章节的补充人物与活动图片来自 Wikimedia Commons，仅作为事件背景图像，每张图片均保留来源链接。</p>
        </div>
      </details>
      <details>
        <summary><Database aria-hidden="true" /> 可视化说明</summary>
        <div className="details-body">
          <p>粒子动画为性能可控的视觉抽样示意，不是 154,406 个点逐一对应记录。所有原始图表均保留，并可点击进入大图查看。</p>
          <p>趋势高亮、地图切换与时间滑块用于引导阅读，不新增原图无法确认的数值。</p>
        </div>
      </details>
      <details>
        <summary><Layers3 aria-hidden="true" /> 设计参考边界</summary>
        <div className="details-body">
          <p>仅参考其他新闻中滚动叙事、Sticky 布局、进度条、地图探索、弹窗与响应式方法；其正文、案例介绍和截图均未进入本网页。</p>
        </div>
      </details>
    </aside>
  )
}
