export type Figure = {
  src?: string
  alt: string
  caption: string
  type?: 'static' | 'dynamic'
  component?: string
}

export type Chapter = {
  id: string
  shortTitle: string
  title: string
  kicker: string
  paragraphs: string[]
  figures: Figure[]
}

export const articleMeta = {
  title: '纽约狗名大揭秘',
  subtitle: '',
  dek: '狗名是城市的情感温度计。',
}

export const figures = {
  nameBubbles: {
    alt: '纽约Top30犬名气泡图',
    caption: 'Top30犬人气泡图',
    type: 'dynamic',
    component: 'NameBubbleChart',
  },
  boroughCategory: {
    alt: '纽约五大区在奢侈品牌、老派人类名、食物派和神话硬汉四类犬名中的占比热力图。',
    caption: '名字语义分类在纽约五大区的分布。',
    type: 'dynamic',
    component: 'BoroughCategoryChart',
  },
  boroughTop20: {
    alt: '纽约五大区 Top20 犬名标准化占比热力图。',
    caption: '纽约五大区 Top20 犬名标准化占比热力图。',
    type: 'dynamic',
    component: 'BoroughTop20Chart',
  },
  cultureTrends: {
    alt: 'Luna、Bowie、Arya、Loki 四个犬名的出生年份与占比趋势图，并标注 2016、2017 年的流行文化节点。',
    caption: '流行文化的独立涟漪',
    type: 'dynamic',
    component: 'CultureTrendsChart',
  },
  genderBias: {
    alt: '犬名性别偏向分裂图，Princess、Lola 等偏雌性，Max、Rocky 等偏雄性。',
    caption: '名字也有“性别想象”',
    type: 'dynamic',
    component: 'GenderBiasChart',
  },
  sizeHeatmap: {
    alt: '热门犬名在不同体型犬只中的偏好差异热力图。',
    caption: '犬体型与名字画像',
    type: 'dynamic',
    component: 'SizeNameHeatmapChart',
  },
  phonetics: {
    alt: '犬名音节数、元音结尾字母占比和开头结尾字母组合热力图。',
    caption: '名字的声音结构',
    type: 'dynamic',
    component: 'PhoneticsChart',
  },
  humanizationHistory: {
    alt: 'Bella、Max、Coco、Charlie、Lola、Oliver 等犬名随出生年份变化的堆叠面积图。',
    caption: '热门犬名随出生年份的历史变化。',
    type: 'dynamic',
    component: 'HumanizationChart',
  },
} satisfies Record<string, Figure>

export const chapterOne: Chapter = {
  id: 'chapter-one',
  shortTitle: '第一卷',
  title: '第一卷：纽约客的狗，与154,406次心有灵犀',
  kicker: '01 / 共识宇宙',
  paragraphs: [
    '想象一个阳光明媚的周末，你牵着新领养的幼犬，走进纽约中央公园的草坪。你解开牵引绳，充满感情地冲着它欢脱的背影喊了一声：“Max！”',
    '下一秒，三只小狗同时转过了头。',
    '一位正在慢跑的大叔，也下意识地放慢了脚步。',
    '给宠物起名，本该是一件极其私密、充满了个人情感与美好寄望的事。我们总以为自己在千挑万选，试图为这个毛茸茸的小生命找到一个最契合它灵魂的、独一无二的标签。然而，当我们把纽约市154,406只注册犬只的档案全部摊开时，一个极其有趣的现象浮现了：',
    '在起名这件事上，纽约人展现出了惊人的心有灵犀。',
    '我们统计了这十五万只狗的名字，一共找出了22,116个不同的词汇。听起来很丰富，对吧？',
    '但实际上，这并非一个“百花齐放”的世界，而是一座由无数个体审美汇聚成的、壮观而默契的“共识宇宙”。',
    '你看，如果把每一只小狗都变成一颗圆点。在这两万多个名字中，有接近两万个名字就像平铺在最底层的细沙，它们通常只被使用了一两次（比如“Mochi-Taco”或“Sir-Barks-A-Lot”）。',
    '而在沙滩的另一端，极少数几个名字拔地而起，堆成了无法逾越的高山。仅仅是 Bella 和 Max 这两个名字，就稳稳地戴在了超过6000只小狗的项圈上。',
    '我们总以为自己的选择是独一份的，但实际上，全城有将近 15% 的主人，都和你一样，在那个最狭窄的起名池里挑中了同一个词。与其说这是一种盲从，不如说这是我们在庞大、喧嚣的都市生活中，一种心照不宣的审美默契。',
    '——看，原来我们都一样。',
  ],
  figures: [figures.nameBubbles],
}

export const chapterTwo: Chapter = {
  id: 'chapter-two',
  shortTitle: '第二卷',
  title: '第二卷：折叠在名字里的城市故事',
  kicker: '02 / 社区肖像',
  paragraphs: [
    '如果说名字是城市的注脚，那么在纽约，这个注脚则清晰地勾勒出了五大区截然不同的社区性格。',
    '当你不再盯着孤立的名字，而是将它们的语义投射到纽约地图上时，一条由历史、人口构成和生活方式写成的多元生动的社区肖像便浮出了水面。',
    '曼哈顿 · 老钱区的“人类世家”',
    '看看曼哈顿的数据。在这里，“老派人类名”占据了绝对的统治地位，比例高达 65.6%。曼哈顿人给狗起名，就像是在给家族信托基金的继承人起名。Charlie（查理）、Lucy（露西）、Oliver（奥利弗）在这里极度超配。',
    '对许多曼哈顿人来说，狗不只是宠物，更是家庭中一位穿粗花呢大衣的室友。这背后，是曼哈顿作为传统精英聚集地，其核心家庭结构和经典文化审美在宠物命名上的自然投射。',
    '布朗克斯 · 反差萌的“硬汉柔情”',
    '但你只需乘坐地铁前往布朗克斯（Bronx）或史泰登岛（Staten Island），画风便会瞬间切换。',
    '“老派人类名”的比例大幅下降，取而代之的是“神话/硬汉”类名字的异军突起——在布朗克斯，这类名字占比高达 30.7%。在这里，叫 Charlie 的狗少了，但叫 Rocky（洛奇）、Zeus（宙斯）、Diesel（柴油机）的狗满街都是。',
    '这种差异是社区形态的生动缩影：布朗克斯作为传统的蓝领与移民社区，狗往往还保留着看家护院的伙伴角色。给狗起名Zeus或Rocky，是主人对安全感、忠诚与力量感的本能呼唤。',
    '有趣的是，代表极致娇贵感的 Princess（公主）在布朗克斯的出现频率（1.06%），竟然是曼哈顿（0.25%）的四倍以上。这种强烈的反差，恰恰是蓝领阶层对家人（包括毛孩子）一种不加掩饰的、极致宠爱的柔情表达。',
    '布鲁克林 & 皇后区 · 生活方式的“味觉标签”',
    '至于年轻潮人和嬉皮士扎堆的布鲁克林与皇后区？这里是经历了深度“士绅化”（Gentrification）的年轻社区，大量从事创意产业、热爱手冲咖啡和周末农夫市集的千禧一代涌入这里。他们将自己对生活方式的追求，直接“贴”在了狗身上。这里是“食物派”（Mochi, Taco, Peanut）的高地，也是“奢侈品牌”（Chanel, Gucci）名字最活跃的试验场。',
    '一只叫Mochi的狗，完美融入了主人在布鲁克林街头漫步的布波族（Bobo）气质——它不仅是宠物，更是主人品味与生活态度的延伸。',
    '史泰登岛·命名光谱上的中间刻度',
    '如果继续向前走到史泰登岛，你会发现一个有趣的事实：史泰登岛既像“小曼哈顿”，又像“轻量版布朗克斯"。',
    '它的老派人类名占比与曼哈顿同属一个阵营，但它的神话/硬汉类名字又非常逼近布朗克斯，而食物派占比则介于布鲁克林和皇后区之间。',
    '换句话说，史泰登岛哪边都不站，但又哪边都沾一点——它像极了纽约五区这个“命名光谱”上的中间刻度。',
    '这种居中并非偶然。史泰登岛是纽约五区中人口密度最低、公共交通最不便利的区域，长期以来被视为被遗忘的行政区。它的社区结构相对稳定，以中产家庭和爱尔兰、意大利裔后代为主，远离曼哈顿的精英圈，也未被布鲁克林的士绅化浪潮彻底冲刷。这种地理与文化上的“半隔离”状态，让史泰登岛的命名偏好呈现出一种极为独特的 “混合态”——既有传统家庭的经典口味，又保留了蓝领社区的硬朗底色，但没有哪一个极端占据绝对上风。',
    '如果说曼哈顿是“精英的客厅”，布朗克斯是“硬汉的健身房”，布鲁克林是“潮人的厨房”，那史泰登岛更像一个 “普通家庭的客厅”——不刻意彰显什么，也不追赶什么，只是按照自己舒服的方式，给家人取一个顺耳的名字。',
    '在纽约，只需听一声狗名，你大致就能猜出它的主人是端着咖啡在华尔街打卡，还是在布鲁克林的车库玩独立乐队。名字，就这样成了社区性格最直观的“语音标签”。',
  ],
  figures: [figures.boroughCategory, figures.boroughTop20],
}

export const chapterThree: Chapter = {
  id: 'chapter-three',
  shortTitle: '第三卷',
  title: '第三卷：被流行文化选中的“天选之狗”',
  kicker: '03 / 文化涟漪',
  paragraphs: [
    '如果说社区决定了名字的“土壤”，那么流行文化则是那只扇动翅膀、搅动风云的蝴蝶。回到那个悬念：像Luna这样的名字，为什么能在短时间内一路狂飙，打破旧有的命名格局？',
    '答案不在狗身上，而在好莱坞的票房和流媒体的播放量里。2016年，《神奇动物在哪里》上映，主角Luna的名字在纽约幼犬中迎来了一波陡峭的拉升；2017年，《权力的游戏》热播，Arya的登记率也随之攀上高峰。不仅是虚构角色，连音乐巨星David Bowie的离世，都在宠物登记册上留下了一道长长的、向上的致敬轨迹。流行文化像一只看不见的手，悄然却有力地决定了明年中央公园里，哪种名字最容易引发一场心有灵犀的相遇。',
    '流行文化就像一只看不见的手，悄悄地、却又无可违抗地决定了明年中央公园里，哪种名字最容易发生“撞车”。',
  ],
  figures: [figures.cultureTrends],
}

export const chapterFour: Chapter = {
  id: 'chapter-four',
  shortTitle: '第四卷',
  title: '第四卷：我们在叫的不是狗，而是我们的“情感镜像”',
  kicker: '04 / 情感镜像',
  paragraphs: [
    '当一只狗来到人类家庭时，它不仅获得了一个饭碗，还被裹挟进了一整套人类社会的“审美与气质指南”。',
    '狗当然不在乎自己叫什么，但在我们清洗整理的这三十多万条记录中，主人们对名字的性别与体型想象，却构筑了一个极为有趣的“情感镜像”。',
    '粉色与蓝色的温柔结界',
    '看一眼那张向两端撕裂的“性别偏向图”。在纽约，给狗起名依然有着鲜明的“性别默契”。雌性犬的名字，几乎是一本“岁月静好”的词典：Princess（公主）、Stella（星辰）、Daisy（雏菊）。它们被赋予了柔美与花朵般的联想。',
    '而雄性犬的名字，则充满了忠诚、力量与神话色彩：Buddy（兄弟）、Zeus（宙斯）、Maximus。在这个标榜多元的都市里，宠物界依然普遍遵循着一种传统而温柔的性别表达——这是主人对小狗最朴素也最直接的“人设”期许。',
    '名字，是视觉上的“气场补丁”',
    '如果你以为人类的刻板想象只停留在性别上，那就太小看纽约人了。',
    '当我们把狗名按体型进行交叉比对时，一条堪称精准的体型标签链诞生了。像Coco这样的名字，在超小型犬（如吉娃娃、约克夏）中呈现出极高的热度——它听起来就像是能装进香奈儿手袋里的精致挂件。',
    '而那些中大型或超大型的工作犬呢？它们直接承包了古希腊神话和重工业词汇。Diesel（柴油机）、Apollo（阿波罗）、Maximus（角斗士）在大型犬中红得发紫。',
    '你几乎不可能在纽约街头看到一只名叫Diesel的茶杯犬，也很少见一只叫Princess的成年藏獒（除非主人有着极其讽刺的幽默感）。',
    '所以，我们在叫的真的是狗吗？',
    '狗的名字，是我们内心欲望和审美投射的一面柔软镜子。',
  ],
  figures: [figures.genderBias, figures.sizeHeatmap],
}

export const chapterFive: Chapter = {
  id: 'chapter-five',
  shortTitle: '第五卷',
  title: '第五卷：宠物人名化与都市孤独症',
  kicker: '05 / 命名革命',
  paragraphs: [
    '给狗起个好喊的名字，首先是个物理问题。',
    '想象一下纽约街头的底噪：警笛、地铁轰鸣、施工电钻。在这样环境里，如果你的狗叫"Alexander-the-Great"（亚历山大大帝），等喊完，它大概已经跑丢三个街区了。',
    '这完美解释了我们在语言结构数据中发现的规律：极度压缩的音节，和响亮的元音结尾。',
    '95% 的纽约热门狗名都被严格控制在 1 到 2 个音节之内。而且，你会发现 Bella、Luna、Coco、Milo 全是以 a、o、i 等清脆的元音结尾。它们不是名字，它们是被设计用来穿透城市噪音的“声学子弹”。',
    '但仅仅是为了好喊吗？',
    '如果你去查阅几十年前的档案，当时的狗名同样简短好喊：Spot（斑点）、Fido（阿黄）、Fluffy（毛毛）、Rover（流浪者）。 然而今天，这些强调“动物特征”的名字在纽约街头已经彻底灭绝了。取而代之的，是你在幼儿园点名册上能看到的那批名字：Oliver、Chloe、Charlie、Leo。',
    '当你拖动时间滑块，你会看到一场无声的命名革命： 在横轴的左侧，曾经那些带有浓厚畜牧业和动物属性的传统狗名，像被时代抛弃的沙堡一样迅速坍塌。而在横轴的右侧（2000年之后），伴随着复古风潮的回归，Bella 和 Charlie 这类纯正的“人类婴儿名”如同海啸般拔地而起。',
    '过去，人们给狗起名 "Spot"，潜台词是：“你是一只动物，你要看家护院。”',
    '今天，人们给狗起名 "Oliver"，潜台词变成了：“你是我们家的一员。”',
    '这是纽约这座超级大都会里，最轻巧也最深沉的社会诊断。',
    '在这个房价永远在涨、阶级日趋固化、社交充满算计的超级城市里，人与人的关系变得前所未有的脆弱。爱一个具体的人太难了，不仅有被背叛的风险，还常常伴随着关于学区房、消费降级和职场内卷的无尽焦虑。',
    '但狗不会。狗不需要成功，不评价你的社交地位，不要求你买更贵的罐头。它们提供的是现代都市里最稀缺的奢侈品——毫无保留的、确定性的爱与陪伴。',
    '人们把给人类婴儿准备的名字，郑重其事地赋予了小狗。这并非荒诞，而是一种温柔的情感代偿，是我们在这个庞大、冰冷的钢铁森林里，为自己寻得的一份最忠诚、最温暖的确定性。',
  ],
  figures: [figures.phonetics, figures.humanizationHistory],
}

export const conclusion: Chapter = {
  id: 'conclusion',
  shortTitle: '狗名有同，城市有情',
  title: '狗名有同，城市有情',
  kicker: '回到中央公园',
  paragraphs: [
    '所以，下次你在中央公园的那片草坪喊“Max”时，不必尴尬。',
    '那几只同时回头的狗，和那位下意识放慢脚步的大叔，或许和你共享着同一种对“家”的理解。',
    '这是数以万计的纽约人，在这个高度竞争的都市里，不约而同地呼唤着自己最忠诚的家人。',
  ],
  figures: [],
}

export const chapters = [chapterOne, chapterTwo, chapterThree, chapterFour, chapterFive, conclusion]

export const navigation = [
  { id: 'intro', label: '交互导入' },
  ...chapters.map(({ id, title }) => ({ id, label: title })),
]

export const boroughs = [
  {
    id: 'manhattan',
    name: '曼哈顿',
    english: 'Manhattan',
    metric: '老派人类名 65.6%',
    names: ['Charlie', 'Lucy', 'Oliver'],
    summary: '老派人类名占比高达65.6%。在这座精英汇聚的岛屿上，狗是穿着粗花呢大衣的家庭成员。',
  },
  {
    id: 'bronx',
    name: '布朗克斯',
    english: 'Bronx',
    metric: '神话/硬汉 30.7%',
    names: ['Rocky', 'Zeus', 'Diesel', 'Princess'],
    summary: '神话与硬汉名字占比达30.7%。在传统蓝领社区，Zeus和Rocky是主人对安全感与力量感的本能呼唤。',
  },
  {
    id: 'staten-island',
    name: '史泰登岛',
    english: 'Staten Island',
    metric: '老派人类名 52.9%',
    names: ['老派人类名', '神话/硬汉'],
    summary: '史泰登岛哪边都不站，但又哪边都沾一点',
  },
  {
    id: 'brooklyn',
    name: '布鲁克林',
    english: 'Brooklyn',
    metric: '食物派 18.3%',
    names: ['Mochi', 'Taco', 'Peanut', 'Chanel', 'Gucci'],
    summary: '这里是食物派名字的高地。对涌入此地的千禧一代而言，狗是生活品味的延伸。',
  },
  {
    id: 'queens',
    name: '皇后区',
    english: 'Queens',
    metric: '食物派 20.6%',
    names: ['Mochi', 'Taco', 'Peanut'],
    summary: '与布鲁克林一河之隔，同样被年轻创作者的味觉标签所定义，共同勾勒出纽约东部的布波族气质。',
  },
] as const

export const cultureNames = [
  { name: 'Luna', year: '2016年', event: '《神奇动物在哪里》上映' },
  { name: 'Arya', year: '2017年', event: '《权游》第七季热播' },
  { name: 'Bowie', year: '2016年', event: 'David Bowie 离世' },
  { name: 'Loki', year: '2017年', event: '《雷神3》洛基大火' },
] as const
