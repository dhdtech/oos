import type { BlogPostTranslation } from "../blog-posts";

export const zhTranslations: Record<string, BlogPostTranslation> = {
  "why-email-is-not-safe-for-passwords": {
    title: "为什么电子邮件不适合分享密码",
    description: "电子邮件从未被设计用于安全数据传输。了解为什么通过电子邮件发送密码是危险的，以及应该使用什么替代方案。",
    content: `
<p>每天，数百万个密码通过电子邮件分享。IT部门给新员工发送登录凭据。自由职业者在收件箱中收到数据库密码。团队在冗长的邮件线程中交换API密钥。这看起来很方便，但这是分享敏感信息最危险的方式之一。</p>

<h2>电子邮件的实际工作原理</h2>
<p>要理解为什么电子邮件对密码不安全，你需要了解电子邮件的底层工作原理。当你发送一封邮件时，它不会直接从你的电脑传到收件人。它会经过多个服务器：</p>
<ol>
<li>你的邮件客户端将消息发送到你的外发邮件服务器（SMTP）</li>
<li>你的邮件服务器将其路由到收件人的邮件服务器，通常要经过中间服务器</li>
<li>收件人的服务器存储它，直到他们下载或查看</li>
</ol>
<p>在每一个中转站，邮件内容都可能被读取、记录或截获。虽然TLS加密保护了支持它的服务器之间的传输数据，但无法保证链路中的每个服务器都使用TLS。即使使用了TLS，每个服务器也会解密消息来处理它。</p>

<h2>持久性问题</h2>
<p>也许最大的风险不是拦截——而是持久性。电子邮件默认永久存在：</p>
<ul>
<li><strong>"已发送"文件夹</strong> — 密码无限期地保留在你的已发送邮件中</li>
<li><strong>收件人的收件箱</strong> — 密码一直保留到手动删除</li>
<li><strong>服务器备份</strong> — 邮件提供商会备份数据，这意味着已删除的邮件可能仍然存在于备份磁带上</li>
<li><strong>转发</strong> — 收件人可以将邮件（和你的密码）转发给任何人</li>
<li><strong>搜索索引</strong> — 邮件搜索索引使得在某人的账户中找到"密码"变得极其容易</li>
</ul>
<p>如果任一账户在数月或数年后被入侵，攻击者就会获得通过邮件分享的每一个密码。这不是理论风险——邮件账户泄露一直是最常见的攻击向量之一。</p>

<h2>截屏和肩窥</h2>
<p>当密码显示在电子邮件中时，它可以被截屏、拍照或被人从肩后偷看。一旦信息在持久性邮件中显示在屏幕上，就无法控制信息的去向。</p>

<h2>合规风险</h2>
<p>对于受GDPR、HIPAA、SOC 2或PCI DSS等合规框架约束的组织，通过电子邮件分享凭据可能构成合规违规。这些框架要求敏感数据使用适当的加密和访问控制进行传输——电子邮件通常不满足任何一项要求。</p>

<h2>替代方案：自毁加密链接</h2>
<p>解决方案是通过端对端加密的渠道分享密码，该渠道在数据被访问后自动销毁。像<a href="/">Only Once Share</a>这样的自毁密钥分享工具通过以下方式工作：</p>
<ol>
<li>在你的浏览器中使用AES-256-GCM加密密码</li>
<li>仅在服务器上存储加密数据（零知识）</li>
<li>生成一次性链接，查看后自动销毁</li>
<li>仅在URL片段中保留解密密钥（永远不会发送到服务器）</li>
</ol>
<p>这种方法消除了电子邮件分享的所有风险：没有持久副本，没有转发风险，服务器上没有明文，数据在查看一次后自动销毁。</p>

<h2>密码分享最佳实践</h2>
<ul>
<li><strong>永远不要以明文发送密码</strong>——无论是通过电子邮件、Slack、短信还是任何消息平台</li>
<li><strong>使用自毁链接</strong>——来自像<a href="/">Only Once Share</a>这样的零知识工具</li>
<li><strong>设置尽可能短的过期时间</strong> — 如果收件人会在一小时内阅读，设置1小时的TTL</li>
<li><strong>分享后轮换凭据</strong> — 在收件人用于初始设置后更改密码</li>
<li><strong>使用密码管理器</strong>来进行持续的共享访问，而不是分享原始密码</li>
</ul>

<h2>结论</h2>
<p>电子邮件是一个出色的通信工具，但它是为消息设计的，不是为密钥设计的。通过电子邮件分享的密码无限期存在，经过多个服务器，并在每次未来的泄露中成为负担。通过使用加密的自毁链接，你可以安全地分享凭据而不留下痕迹。</p>
`
  },
  "what-is-zero-knowledge-encryption": {
    title: "什么是零知识加密？简明指南",
    description: "零知识加密意味着服务提供商无法访问你的数据。了解它的工作原理以及为什么它对密钥分享很重要。",
    content: `
<p>你可能已经看到注重隐私的工具和服务使用"零知识"这个术语。但它到底意味着什么？你如何判断一个服务是否真正实施了零知识加密，还是只是将其用作营销噱头？</p>

<h2>核心概念</h2>
<p>零知识加密（也称为零知识证明或零访问加密）是一种架构，其中<strong>服务提供商无法访问你的数据</strong>——不是因为政策，而是因为数学。提供商确实不拥有解密你信息所需的密钥。</p>
<p>可以想象成银行的保险柜。银行存储保险柜，但只有你有钥匙。即使银行经理也无法打开它。零知识加密将同样的原理应用于数字数据。</p>

<h2>实际工作原理</h2>
<p>在零知识系统中，加密和解密发生在<strong>客户端</strong>——你的浏览器或设备。工作流程如下：</p>
<ol>
<li><strong>密钥生成</strong> — 你的设备生成一个加密密钥（如AES-256）</li>
<li><strong>客户端加密</strong> — 你的数据在发送到任何地方之前在设备上加密</li>
<li><strong>服务器存储</strong> — 服务器只接收和存储加密的密文</li>
<li><strong>密钥管理</strong> — 加密密钥保留在你的设备上（或URL片段中），永远不会发送到服务器</li>
<li><strong>客户端解密</strong> — 当你（或收件人）访问数据时，在客户端设备上解密</li>
</ol>
<p>关键在于第4步：密钥永远不会接触服务器。没有密钥，服务器存储的本质上是随机噪音。</p>

<h2>零知识 vs. 标准加密</h2>
<p>许多服务声称使用加密，但实施方式让提供商可以访问你的数据：</p>
<table>
<thead><tr><th>特性</th><th>服务器端加密</th><th>零知识加密</th></tr></thead>
<tbody>
<tr><td>加密发生在哪里</td><td>服务器上</td><td>你的浏览器/设备中</td></tr>
<tr><td>谁拥有密钥</td><td>服务器</td><td>只有客户端</td></tr>
<tr><td>提供商能读取你的数据吗？</td><td>能</td><td>不能</td></tr>
<tr><td>服务器泄露的脆弱性</td><td>数据暴露</td><td>只暴露加密的数据块</td></tr>
<tr><td>法律命令的脆弱性</td><td>提供商可以配合</td><td>提供商没有可交出的数据</td></tr>
</tbody>
</table>

<h2>真实案例</h2>
<p><strong>零知识服务：</strong>Signal（消息）、Proton Mail（电子邮件）、<a href="/">Only Once Share</a>（密钥分享）、Tresorit（云存储）。这些服务在你的设备上加密数据，永远无法访问解密密钥。</p>
<p><strong>非零知识服务：</strong>标准Gmail、Slack、大多数云存储。这些服务在传输和存储时加密数据，但自己持有加密密钥。如果需要，它们可以读取你的数据（并且会这样做，用于搜索索引和垃圾邮件检测等功能）。</p>

<h2>Only Once Share如何实现零知识</h2>
<p>在Only Once Share中，零知识通过巧妙使用URL片段来实现：</p>
<ol>
<li>你的浏览器生成一个AES-256-GCM密钥并加密你的密钥</li>
<li>只有加密的密文被发送到服务器</li>
<li>加密密钥放置在URL中<code>#</code>符号之后（"片段"）</li>
<li>URL片段<strong>永远不会在HTTP请求中发送到服务器</strong>——这在RFC 3986中有定义</li>
<li>当收件人打开链接时，他们的浏览器从片段中读取密钥并在本地解密</li>
</ol>
<p>这是设计上的零知识：服务器物理上无法访问密钥，因为Web浏览器被构建为不传输URL片段。</p>

<h2>为什么它很重要</h2>
<p>零知识加密保护你免受：</p>
<ul>
<li><strong>服务器泄露</strong> — 入侵服务器的攻击者只能获得他们无法读取的加密数据</li>
<li><strong>内部威胁</strong> — 服务提供商的员工无法访问你的数据</li>
<li><strong>政府监控</strong> — 提供商无法交出他们无法解密的数据</li>
<li><strong>数据挖掘</strong> — 提供商无法分析你的数据用于广告或画像</li>
</ul>

<h2>如何验证零知识声明</h2>
<p>并非所有声称"零知识"的服务都真正实现了它。以下是验证方法：</p>
<ul>
<li><strong>检查是否开源</strong> — 你能审计加密代码吗？像<a href="https://github.com/dhdtech/only-once-share">Only Once Share</a>这样的工具让你自己验证实现</li>
<li><strong>检查加密发生在哪里</strong> — 使用浏览器开发者工具（网络选项卡）查看是否有明文数据被发送到服务器</li>
<li><strong>检查密钥管理</strong> — 密钥是否留在客户端，还是被上传到服务器？</li>
<li><strong>检查威胁模型</strong> — 文档是否清楚地解释了服务器能和不能访问什么？</li>
</ul>

<h2>结论</h2>
<p>零知识加密是隐私的黄金标准。它意味着你不必信任服务提供商——数学确保他们无法访问你的数据。在选择分享敏感信息的工具时，始终优先选择在客户端加密数据并将密钥保持在服务器触及范围之外的零知识实现。</p>
`
  },
  "how-to-share-password-securely": {
    title: "如何安全地分享密码",
    description: "使用加密自毁链接安全分享密码的分步指南。停止通过电子邮件和Slack发送密码。",
    content: `
<p>无论你是与客人分享Wi-Fi凭据、向同事发送数据库密码，还是给客户提供新账户访问权限，分享密码都有正确和错误的方式。以下是安全操作的完整指南。</p>

<h2>错误的方式：明文渠道</h2>
<p>最常见的错误是通过无限期存储数据的渠道分享密码：</p>
<ul>
<li><strong>电子邮件</strong> — 永久保存在已发送/收件箱文件夹中，在服务器上备份，可搜索</li>
<li><strong>Slack/Teams</strong> — 消息历史被保留，管理员可搜索</li>
<li><strong>短信/iMessage</strong> — 存储在设备和运营商系统中</li>
<li><strong>便利贴</strong> — 物理安全风险，容易被拍照</li>
<li><strong>共享文档</strong> — Google Docs和类似工具记录访问但不加密单个条目</li>
</ul>
<p>任何保留密码的渠道都会创建未来的攻击面。如果该渠道被入侵，通过它分享的每个密码都会暴露。</p>

<h2>正确的方式：自毁加密链接</h2>
<p>安全方法使用三个原则：<strong>加密</strong>密码、<strong>限制访问</strong>为一次查看、以及<strong>自动删除</strong>。</p>

<h3>使用Only Once Share的分步指南</h3>
<ol>
<li><strong>前往<a href="/">ooshare.io</a></strong></li>
<li><strong>输入密码</strong>（或任何密钥文本）</li>
<li><strong>选择过期时间</strong> — 选择最短的实用窗口（如果收件人现在在线则选1小时）</li>
<li><strong>点击"创建密钥链接"</strong> — 你的浏览器在向服务器发送任何内容之前使用AES-256-GCM加密密码</li>
<li><strong>复制生成的链接</strong>并通过任何渠道发送给收件人（电子邮件、Slack、短信——链接本身不包含敏感数据）</li>
<li><strong>收件人打开链接</strong>，查看密码，数据被永久销毁</li>
</ol>
<p>即使你通过电子邮件发送链接，密码本身也不在邮件中。链接只是指向一次查看后自毁的加密数据的指针。</p>

<h2>为什么这种方法有效</h2>
<ul>
<li><strong>没有持久副本</strong> — 密码在查看后被销毁</li>
<li><strong>端对端加密</strong> — 服务器只处理加密数据</li>
<li><strong>零知识</strong> — 加密密钥在URL片段中，永远不会发送到服务器</li>
<li><strong>时间限制</strong> — 即使从未查看，数据也会自动过期</li>
<li><strong>无需账户</strong> — 无需注册，无摩擦</li>
</ul>

<h2>额外最佳实践</h2>
<h3>分享后轮换</h3>
<p>如果你是为初始设置分享密码（如员工入职），让他们在首次登录后立即更改密码。</p>

<h3>使用不同渠道传递上下文</h3>
<p>通过一个渠道发送密钥链接，通过另一个渠道告诉收件人它是用于什么的。</p>

<h3>设置最短实用过期时间</h3>
<p>当收件人正在线时，不要默认设置72小时。设置1小时的过期时间以最小化加密数据存在于任何服务器上的窗口期。</p>
`
  },
  "self-destructing-links-explained": {
    title: "自毁链接解析：它们如何工作",
    description: "自毁链接的技术解析——使密码在被阅读后消失的机制。",
    content: `
<p>自毁链接是共享敏感信息最安全的方式之一。但它们实际上是如何工作的？让我们分解使密码在被阅读后消失的技术机制。</p>

<h2>基本概念</h2>
<p>自毁链接创建了一个数据的临时容器，具有两个关键属性：</p>
<ol>
<li><strong>一次性访问</strong> — 数据只能被检索一次</li>
<li><strong>自动过期</strong> — 数据在设定时间后被删除，无论是否被访问</li>
</ol>

<h2>技术工作流程</h2>
<h3>第1步：客户端加密</h3>
<p>当你创建一个密钥时，你的浏览器生成一个随机的AES-256-GCM密钥和初始化向量（IV）。你的密钥在你的浏览器中加密——在任何数据离开你的设备之前。</p>

<h3>第2步：服务器存储</h3>
<p>只有加密的数据被发送到服务器并附带元数据（过期时间、创建时间戳）。服务器永远不会看到你的明文数据或你的加密密钥。</p>

<h3>第3步：链接生成</h3>
<p>服务器返回一个唯一ID。你的浏览器通过组合服务器URL、消息ID和URL片段（<code>#</code>）后面的加密密钥来构建完整链接。</p>

<h3>第4步：一次性检索</h3>
<p>当收件人打开链接时，服务器执行原子性的读取并删除：它返回加密数据并立即从存储中删除。</p>

<h3>第5步：客户端解密</h3>
<p>收件人的浏览器从URL片段中提取密钥并在本地解密数据。密钥永远不会到达服务器。</p>

<h2>安全属性</h2>
<ul>
<li><strong>前向保密</strong> — 一旦数据被删除，即使服务器后来被入侵也无法恢复</li>
<li><strong>零知识</strong> — 服务器永远不会拥有解密数据的能力</li>
<li><strong>防篡改</strong> — AES-256-GCM提供认证加密，检测任何篡改</li>
<li><strong>访问检测</strong> — 如果链接已被使用，发送者知道有人查看了它</li>
</ul>

<h2>时间限制 (TTL)</h2>
<p>TTL（生存时间）为密钥添加了第二层保护。即使链接未被访问，数据也会在配置的时间后自动删除。</p>

<h2>结论</h2>
<p>自毁链接将客户端加密、一次性访问和自动过期结合成一个简单的URL。密钥永远不会以明文形式触及服务器，数据保证会被删除。</p>
`
  },
  "aes-256-gcm-encryption-explained": {
    title: "AES-256-GCM加密详解",
    description: "深入技术解析AES-256-GCM——Only Once Share和其他安全工具使用的加密标准。了解它为什么是现代安全的黄金标准。",
    content: `
<p>AES-256-GCM是被Only Once Share、Signal、ProtonMail和大多数现代安全工具使用的加密标准。让我们分解它到底是什么、它如何工作，以及为什么它被认为是对称加密的黄金标准。</p>

<h2>分解名称</h2>
<h3>AES（高级加密标准）</h3>
<p>AES是由美国国家标准与技术研究院（NIST）在2001年标准化的对称加密算法。"对称"意味着同一个密钥用于加密和解密。</p>

<h3>256（密钥大小）</h3>
<p>256指的是256位密钥长度。密钥空间是2^256——这个数字大于可观测宇宙中的原子数。</p>

<h3>GCM（伽罗瓦/计数器模式）</h3>
<p>GCM是提供两个关键属性的操作模式：<strong>保密性</strong>（数据被加密）和<strong>认证</strong>（可以检测到任何篡改）。</p>

<h2>为什么选择AES-256-GCM？</h2>
<ul>
<li><strong>认证加密</strong> — 在一次操作中同时加密和认证</li>
<li><strong>硬件加速</strong> — 现代CPU包含AES-NI指令</li>
<li><strong>并行处理</strong> — GCM模式允许并行加密块</li>
<li><strong>广泛审计</strong> — 数十年的密码分析，没有实际漏洞</li>
<li><strong>行业标准</strong> — TLS 1.3、SSH、IPsec都使用它</li>
</ul>

<h2>Only Once Share如何使用AES-256-GCM</h2>
<ol>
<li>使用<code>crypto.getRandomValues()</code>生成256位随机密钥</li>
<li>生成12字节随机IV</li>
<li>使用Web Crypto API加密明文</li>
<li>密文包含认证标签（用于防篡改）</li>
<li>密钥通过URL片段传递（永远不会发送到服务器）</li>
</ol>

<h2>AES-256是否可以被量子计算机破解？</h2>
<p>AES-256被认为具有量子抵抗性。Grover算法将其有效安全级别降低到128位——仍然远远超出任何已知攻击的范围。</p>

<h2>结论</h2>
<p>AES-256-GCM在一个高效的算法中提供了保密性、完整性和认证性。它是对称加密的黄金标准——被政府、军队和现代安全工具用于保护最敏感的数据。</p>
`
  },
  "send-api-keys-securely": {
    title: "如何安全地向开发人员发送API密钥",
    description: "开发人员分享API密钥和令牌的安全方法。停止在Slack中粘贴凭据——使用加密的自毁链接。",
    content: `
<p>API密钥是现代软件开发的命脉。它们认证服务、授权访问并连接系统。但它们的分享方式往往令人震惊地不安全。</p>

<h2>典型（不安全的）API密钥分享</h2>
<ul>
<li>在Slack中粘贴密钥："这是Stripe API密钥：sk_live_..."</li>
<li>提交到Git："暂时硬编码API密钥以进行测试"</li>
<li>在Google Docs中分享凭据电子表格</li>
<li>通过电子邮件发送配置文件</li>
</ul>
<p>每种方法都会留下持久的、可搜索的泄露凭据痕迹。</p>

<h2>为什么API密钥需要特殊处理</h2>
<p>API密钥与密码不同。通常没有第二因素，没有速率限制，没有登录警报。泄露的API密钥就是即时访问。</p>

<h2>安全方法</h2>
<h3>一次性传递</h3>
<ol>
<li>前往<a href="/">ooshare.io</a></li>
<li>粘贴API密钥</li>
<li>设置短过期时间</li>
<li>通过Slack/邮件发送链接</li>
<li>开发人员使用后链接自毁</li>
</ol>

<h3>运行时使用</h3>
<p>对于运行时密钥管理使用环境变量或密钥管理器（HashiCorp Vault、AWS Secrets Manager、Doppler）。</p>

<h2>Git安全</h2>
<p>最危险的错误是将密钥提交到Git。即使你删除了提交，密钥仍然在Git历史中。使用<code>.gitignore</code>排除<code>.env</code>文件，并使用git-secrets等工具扫描。</p>

<h2>结论</h2>
<p>API密钥应该使用加密的自毁链接进行一次性传递，使用环境变量或密钥管理器进行运行时使用，并通过扫描工具防止意外提交。</p>
`
  },
  "best-free-secret-sharing-tools": {
    title: "2025年最佳免费密钥分享工具",
    description: "全面比较免费密钥分享工具。功能、安全性、加密方法和隐私的并排比较。",
    content: `
<p>市场上有许多密钥分享工具。本指南比较了最佳的免费选项，重点关注安全性、隐私和可用性。</p>

<h2>评估标准</h2>
<ul>
<li><strong>加密类型</strong> — 客户端（零知识）vs. 服务器端</li>
<li><strong>开源</strong> — 代码是否可审计？</li>
<li><strong>自托管</strong> — 你能在自己的基础设施上运行它吗？</li>
<li><strong>免费层级</strong> — 免费版本有多大用处？</li>
</ul>

<h2>工具比较</h2>
<table>
<thead><tr><th>工具</th><th>加密</th><th>开源</th><th>自托管</th><th>免费层级</th></tr></thead>
<tbody>
<tr><td><a href="/">Only Once Share</a></td><td>客户端 (AES-256-GCM)</td><td>是</td><td>是 (Docker)</td><td>完全免费</td></tr>
<tr><td>OneTimeSecret</td><td>服务器端</td><td>是</td><td>是</td><td>免费（有限制）</td></tr>
<tr><td>Password Pusher</td><td>服务器端</td><td>是</td><td>是</td><td>免费（有限制）</td></tr>
<tr><td>Yopass</td><td>客户端 (OpenPGP)</td><td>是</td><td>是</td><td>完全免费</td></tr>
<tr><td>scrt.link</td><td>客户端</td><td>否</td><td>否</td><td>免费（有限制）</td></tr>
</tbody>
</table>

<h2>为什么Only Once Share脱颖而出</h2>
<ul>
<li><strong>真正的零知识</strong> — 客户端AES-256-GCM加密</li>
<li><strong>完全免费</strong> — 没有付费层级，没有功能限制</li>
<li><strong>开源</strong> — 在GitHub上完全可审计</li>
<li><strong>6种语言</strong> — 英语、西班牙语、中文、葡萄牙语、印地语、阿拉伯语</li>
<li><strong>自托管就绪</strong> — 使用Docker Compose几分钟即可部署</li>
</ul>

<h2>结论</h2>
<p>在选择密钥分享工具时，优先考虑客户端加密和开源透明度。<a href="/">Only Once Share</a>在这两方面都表现出色，并且完全免费。</p>
`
  },
  "server-side-vs-client-side-encryption": {
    title: "服务器端与客户端加密：为什么差异很重要",
    description: "了解服务器端和客户端加密之间的关键区别。一种保护你的数据免受所有人（包括服务提供商）的侵害。另一种则不能。",
    content: `
<p>"加密"并不自动意味着"私密"。加密发生在<em>哪里</em>决定了<em>谁</em>可以访问你的数据。</p>

<h2>服务器端加密</h2>
<p>数据以明文形式到达服务器，服务器对其进行加密，并将加密数据存储在磁盘上。服务器持有加密密钥。</p>
<p><strong>这意味着：</strong>服务提供商可以随时解密和读取你的数据。你信任他们不会这样做。</p>

<h2>客户端加密（零知识）</h2>
<p>数据在你的浏览器/设备中加密，<em>然后</em>才发送到服务器。服务器永远不会看到你的加密密钥。</p>
<p><strong>这意味着：</strong>即使服务提供商想要，也无法读取你的数据。数学确保了这一点。</p>

<h2>安全影响</h2>
<table>
<thead><tr><th>场景</th><th>服务器端</th><th>客户端</th></tr></thead>
<tbody>
<tr><td>服务器被黑客攻击</td><td>数据暴露</td><td>只有加密的数据块</td></tr>
<tr><td>流氓员工</td><td>可以读取数据</td><td>无法读取数据</td></tr>
<tr><td>政府传票</td><td>必须交出数据</td><td>没有可用数据可交</td></tr>
<tr><td>数据泄露</td><td>明文暴露</td><td>无用的密文</td></tr>
</tbody>
</table>

<h2>如何识别差异</h2>
<ul>
<li>打开浏览器DevTools → 网络标签页</li>
<li>创建一个已知内容的密钥</li>
<li>检查每个请求体是否有明文内容</li>
<li>如果你的明文出现在任何网络请求中 → 服务器端加密</li>
<li>如果只有加密数据离开你的浏览器 → 客户端加密</li>
</ul>

<h2>结论</h2>
<p>服务器端加密保护静态数据但信任服务器。客户端加密不信任任何人——密钥永远不会离开你的设备。对于敏感数据如密码和API密钥，客户端加密（零知识）是唯一提供真正隐私的方法。</p>
`
  },
  "self-host-secret-sharing-docker": {
    title: "如何使用Docker自托管密钥分享工具",
    description: "使用Docker Compose在5分钟内部署自己的密钥分享工具的分步指南。完全控制你的数据。",
    content: `
<p>自托管密钥分享工具让你完全控制数据。使用Docker Compose，你可以在几分钟内在自己的基础设施上运行Only Once Share。</p>

<h2>先决条件</h2>
<ul>
<li>安装了Docker和Docker Compose的服务器</li>
<li>基本的终端知识</li>
<li>（可选）用于HTTPS的域名</li>
</ul>

<h2>快速开始</h2>
<pre><code>git clone https://github.com/dhdtech/only-once-share.git
cd only-once-share
docker compose up -d</code></pre>
<p>就这样。应用程序在端口3000上运行。</p>

<h2>为什么要自托管？</h2>
<ul>
<li><strong>数据主权</strong> — 加密数据永远不会离开你的基础设施</li>
<li><strong>合规</strong> — 满足GDPR、HIPAA、SOC 2数据驻留要求</li>
<li><strong>网络隔离</strong> — 在没有公共互联网暴露的内部网络上运行</li>
<li><strong>自定义</strong> — 修改品牌、TTL选项、大小限制</li>
</ul>

<h2>生产部署</h2>
<p>对于生产环境，在前端添加反向代理（Nginx/Caddy）用于TLS终止。</p>
<pre><code># nginx示例
server {
    listen 443 ssl;
    server_name secrets.yourcompany.com;
    location / {
        proxy_pass http://localhost:3000;
    }
}</code></pre>

<h2>资源需求</h2>
<table>
<thead><tr><th>资源</th><th>最低</th><th>推荐</th></tr></thead>
<tbody>
<tr><td>RAM</td><td>512 MB</td><td>1 GB</td></tr>
<tr><td>CPU</td><td>1 vCPU</td><td>2 vCPU</td></tr>
<tr><td>存储</td><td>1 GB</td><td>5 GB</td></tr>
</tbody>
</table>

<h2>结论</h2>
<p>使用Docker自托管Only Once Share是获得完全数据控制的最简单方法。设置不到5分钟，运行成本低廉，并提供与托管版本相同的零知识加密。</p>
`
  },
  "credential-sharing-employee-onboarding": {
    title: "员工入职期间安全的凭据分享",
    description: "如何在员工入职期间安全地分享密码、API密钥和访问凭据。最佳实践和工具。",
    content: `
<p>员工入职是凭据分享的高峰期。新员工需要多个系统、工具和服务的密码。以下是安全处理方法。</p>

<h2>入职凭据挑战</h2>
<ul>
<li>多个系统需要独立的凭据</li>
<li>IT团队在短时间内分享大量密码</li>
<li>新员工可能不知道安全协议</li>
<li>方便往往优先于安全</li>
</ul>

<h2>安全入职工作流程</h2>
<ol>
<li><strong>为每个凭据创建单独的自毁链接</strong> — 每个系统一个链接</li>
<li><strong>设置短过期时间</strong> — 第一天使用24小时TTL</li>
<li><strong>要求立即更改密码</strong> — 初始登录后立即更改</li>
<li><strong>注册密码管理器</strong> — 为持续访问设置团队密码管理器</li>
<li><strong>启用MFA</strong> — 在所有支持的服务上启用多因素认证</li>
</ol>

<h2>什么不该做</h2>
<ul>
<li>不要在"欢迎"邮件中以明文发送密码</li>
<li>不要使用包含所有凭据的共享电子表格</li>
<li>不要为所有新员工使用相同的临时密码</li>
<li>不要在即时消息中分享凭据</li>
</ul>

<h2>结论</h2>
<p>入职是一个安全关键时刻。使用自毁加密链接进行初始凭据传递，然后立即将新员工过渡到密码管理器和MFA。</p>
`
  },
  "gdpr-compliant-secret-sharing": {
    title: "GDPR合规的密钥分享：你需要知道的一切",
    description: "如何在符合GDPR要求的情况下分享密码和敏感数据。数据最小化、加密要求和合规最佳实践。",
    content: `
<p>通用数据保护条例（GDPR）对组织如何处理个人数据提出了严格要求。这延伸到了密码和凭据的分享方式。</p>

<h2>相关的GDPR原则</h2>
<ul>
<li><strong>数据最小化</strong>（第5(1)(c)条）— 只处理必要的数据</li>
<li><strong>存储限制</strong>（第5(1)(e)条）— 不要保留超过需要的时间</li>
<li><strong>完整性和保密性</strong>（第5(1)(f)条）— 适当的安全措施</li>
<li><strong>设计隐私</strong>（第25条）— 默认内置数据保护</li>
</ul>

<h2>自毁链接如何满足GDPR</h2>
<table>
<thead><tr><th>GDPR要求</th><th>自毁链接如何满足</th></tr></thead>
<tbody>
<tr><td>数据最小化</td><td>只存储加密的密钥</td></tr>
<tr><td>存储限制</td><td>访问后自动删除</td></tr>
<tr><td>加密</td><td>AES-256-GCM客户端加密</td></tr>
<tr><td>设计隐私</td><td>零知识架构</td></tr>
</tbody>
</table>

<h2>合规检查清单</h2>
<ul>
<li>使用端对端加密进行凭据传输</li>
<li>确保凭据不会无限期存储</li>
<li>记录安全分享流程</li>
<li>对凭据分享进行员工培训</li>
<li>定期审计分享实践</li>
</ul>

<h2>结论</h2>
<p>GDPR合规的密钥分享需要加密、数据最小化和自动删除。零知识自毁链接满足所有这些要求。</p>
`
  },
  "devops-secret-sharing-best-practices": {
    title: "DevOps密钥分享最佳实践",
    description: "在DevOps工作流程中安全管理和分享API密钥、令牌和凭据。从一次性传递到CI/CD管道密钥管理。",
    content: `
<p>DevOps团队比几乎任何其他角色处理更多的凭据：API密钥、数据库密码、SSH密钥、云提供商令牌、容器注册凭据、TLS证书和Webhook密钥。挑战不仅仅是保持它们的安全——而是安全地分享它们。</p>

<h2>密钥生命周期</h2>
<h3>1. 初始传递（一次性传输）</h3>
<p><strong>解决方案：</strong>对每次凭据传输使用加密的自毁链接。<a href="/">Only Once Share</a>通过零知识加密处理这个问题。</p>

<h3>2. 活跃使用（运行时）</h3>
<p><strong>解决方案：</strong>使用环境变量、密钥管理器（HashiCorp Vault、AWS Secrets Manager、Doppler）或加密配置。</p>

<h3>3. 轮换</h3>
<p><strong>解决方案：</strong>尽可能自动化轮换。对于手动轮换，使用加密链接传递新凭据。</p>

<h2>常见错误</h2>
<h3>版本控制中的密钥</h3>
<p>最危险的错误是将密钥提交到Git。即使你删除了提交，密钥仍然在Git历史中。</p>

<h3>CI/CD日志中的密钥</h3>
<p>CI/CD管道经常在构建和部署步骤中显示环境变量。</p>

<h2>结论</h2>
<p>DevOps中的密钥管理是一个分层问题。自毁加密链接处理一次性传递；密钥管理器处理运行时访问；CI/CD平台处理管道密钥；扫描工具防止意外暴露。</p>
`
  },
  "complete-guide-one-time-secret-sharing": {
    title: "一次性密钥分享完全指南",
    description: "关于一次性密钥分享你需要知道的一切：工作原理、何时使用、安全考虑以及选择正确的工具。",
    content: `
<p>一次性密钥分享是通过查看后自毁的链接传输敏感信息的做法。本完全指南涵盖了从基础到高级安全考虑的所有内容。</p>

<h2>什么是一次性密钥分享？</h2>
<p>为敏感数据创建一个临时的、加密的容器，只能被访问一次。在第一次（也是唯一一次）访问后，数据被永久销毁。</p>

<h2>何时使用一次性密钥分享</h2>
<h3>理想用例</h3>
<ul>
<li><strong>密码</strong> — 分享初始设置的登录凭据</li>
<li><strong>API密钥和令牌</strong> — 向开发人员分发服务凭据</li>
<li><strong>连接字符串</strong> — 数据库URL、Redis URI、带凭据的端点</li>
<li><strong>SSH密钥</strong> — 用于服务器访问的私钥</li>
<li><strong>个人信息</strong> — 社会安全号码、财务详情</li>
</ul>

<h2>安全级别</h2>
<h3>级别1：服务器端加密</h3>
<p>服务器接收明文，对其加密并存储。服务器可以看到你的数据。</p>

<h3>级别2：客户端加密（零知识）</h3>
<p>浏览器在发送任何内容到服务器之前加密数据。服务器只存储加密的数据块。</p>
<p><em>示例：<a href="/">Only Once Share</a>、scrt.link、Yopass</em></p>

<h3>级别3：客户端+自托管</h3>
<p>与级别2相同，但在你自己的基础设施上运行。</p>

<h2>安全最佳实践</h2>
<ul>
<li><strong>设置最短实用TTL</strong></li>
<li><strong>使用不同渠道传递上下文</strong></li>
<li><strong>分享后轮换</strong></li>
<li><strong>验证接收</strong></li>
<li><strong>优先选择零知识工具</strong></li>
<li><strong>使用开源工具</strong></li>
</ul>

<h2>结论</h2>
<p>一次性密钥分享是传输只需访问一次的敏感信息最安全的方法。选择像<a href="/">Only Once Share</a>这样的零知识工具以获得最强的安全保证。</p>
`
  },
  "open-source-security-transparency": {
    title: "开源安全：为什么透明度很重要",
    description: "为什么开源安全工具比闭源替代方案更值得信赖。社区审计、供应链安全和信任问题。",
    content: `
<p>当涉及到安全软件时，存在一个悖论：最要求你信任的工具往往是你最不应该信任的。以下是为什么开源是安全软件唯一可信的方法。</p>

<h2>信任问题</h2>
<p>每个安全工具都会声称："军事级别加密"、"银行级别安全"、"零知识架构"。但你如何验证这些声明？对于闭源软件，你无法验证。</p>
<p>开源通过公开代码来解决这个问题。任何人都可以阅读代码并验证它是否符合其声明。</p>

<h2>开源和可验证的零知识</h2>
<p>对于<a href="/">Only Once Share</a>，开源不是可选的——它是必不可少的。我们的零知识声明是可验证的，因为你可以阅读<a href="https://github.com/dhdtech/only-once-share">加密代码</a>并验证AES-256-GCM加密发生在客户端。</p>

<h2>自托管：终极信任模型</h2>
<p>开源使自托管成为可能——在你自己的基础设施上运行软件。这甚至消除了信任托管版本的需要。</p>

<h2>结论</h2>
<p>对于安全工具，开源不是奢侈品——它是可信度的要求。你不应该必须相信供应商的话来确认你的数据已加密。使用开源，你可以自己验证。</p>
`
  },
  "incident-response-credential-sharing": {
    title: "事件响应：紧急情况下安全分享凭据",
    description: "当安全事件发生时，团队需要快速分享凭据。如何在事件响应期间平衡速度与安全。",
    content: `
<p>凌晨2点，你的监控系统发出严重警报。生产数据库暴露了。你需要与事件响应团队快速分享紧急访问凭据。速度很重要，但在事件期间不安全地分享凭据可能将一个安全问题变成两个。</p>

<h2>快速且安全的方法</h2>
<p>自毁加密链接非常适合事件响应，因为它们和发送Slack消息一样快，但会自动清理。</p>
<ol>
<li><strong>打开<a href="/">ooshare.io</a></strong>（在事件响应手册中收藏它）</li>
<li><strong>粘贴凭据</strong>（root密码、紧急令牌、管理员密钥）</li>
<li><strong>设置1小时TTL</strong></li>
<li><strong>在事件响应频道分享链接</strong></li>
<li><strong>响应者打开链接</strong>获取凭据——数据被销毁</li>
</ol>
<p>总时间：不到30秒。与Slack消息不同的是，凭据不会在聊天历史中持续存在。</p>

<h2>事件后凭据卫生</h2>
<ol>
<li><strong>轮换</strong>在事件期间分享的每个凭据</li>
<li><strong>轮换</strong>在事件本身中可能被泄露的每个凭据</li>
<li><strong>审查访问日志</strong></li>
<li><strong>更新手册</strong></li>
</ol>

<h2>结论</h2>
<p>事件响应需要速度，但没有安全的速度会产生复合风险。自毁加密链接提供了Slack消息的速度和加密临时数据的安全性。</p>
`
  },
  "web-crypto-api-browser-encryption": {
    title: "Web Crypto API：在浏览器中构建加密",
    description: "面向开发人员的Web Crypto API实用指南。生成密钥、加密数据并完全在浏览器中实现零知识架构。",
    content: `
<p>Web Crypto API是一个浏览器原生的JavaScript API，无需外部库即可提供加密操作。它支持硬件加速加密、密钥生成和直接在浏览器中进行哈希运算。</p>

<h2>为什么选择Web Crypto API？</h2>
<ul>
<li><strong>无外部依赖</strong> — 内置于所有现代浏览器中</li>
<li><strong>硬件加速</strong> — 使用CPU的AES-NI指令集</li>
<li><strong>安全随机数生成</strong> — <code>crypto.getRandomValues()</code>使用操作系统的CSPRNG</li>
<li><strong>异步设计</strong> — 通过Promises进行非阻塞操作</li>
</ul>

<h2>核心操作</h2>
<h3>1. 生成随机值</h3>
<pre><code>const iv = crypto.getRandomValues(new Uint8Array(12));</code></pre>

<h3>2. AES-256-GCM密钥生成</h3>
<pre><code>const key = await crypto.subtle.generateKey(
  { name: "AES-GCM", length: 256 },
  true,
  ["encrypt", "decrypt"]
);</code></pre>

<h3>3. 数据加密</h3>
<pre><code>const ciphertext = await crypto.subtle.encrypt(
  { name: "AES-GCM", iv, additionalData, tagLength: 128 },
  key,
  data
);</code></pre>

<h3>4. 使用HKDF进行密钥派生</h3>
<pre><code>const derivedKey = await crypto.subtle.deriveKey(
  { name: "HKDF", hash: "SHA-256", salt, info: new TextEncoder().encode(messageId) },
  keyMaterial,
  { name: "AES-GCM", length: 256 },
  false,
  ["encrypt", "decrypt"]
);</code></pre>

<h2>构建零知识架构</h2>
<p>Web Crypto API使构建零知识系统变得容易。<a href="/">Only Once Share</a>使用的关键设计模式：在浏览器中生成密钥，客户端加密数据，只将密文发送到服务器，将密钥放在URL片段（<code>#</code>）中。</p>

<h2>结论</h2>
<p>Web Crypto API提供了构建安全、隐私优先的应用程序所需的一切，无需外部加密库。</p>
`
  },
  "zero-knowledge-architecture-deep-dive": {
    title: "零知识架构：技术深度探索",
    description: "Web应用程序零知识架构模式的技术探索。密钥管理、URL片段和威胁建模。",
    content: `
<p>零知识架构是一种系统设计模式，其中服务提供商无法访问用户数据。不是因为政策——而是因为数学上的不可能性。</p>

<h2>定义零知识</h2>
<p>当以下条件满足时，系统是零知识的：</p>
<ol>
<li>数据在离开客户端之前被加密</li>
<li>服务器永远不拥有解密密钥</li>
<li>服务器只存储它无法解密的密文</li>
<li>解密完全在客户端进行</li>
</ol>

<h2>密钥分发问题</h2>
<h3>方案1：URL片段</h3>
<p><a href="/">Only Once Share</a>使用的方法。密钥放置在URL中<code>#</code>之后：</p>
<pre><code>https://ooshare.io/s/abc123#decryption-key-here</code></pre>
<p>URL片段在RFC 3986中被定义为仅限客户端——浏览器永远不会将它们包含在HTTP请求中。</p>

<h3>方案2：基于密码的密钥派生</h3>
<p>用户提供密码，PBKDF2或Argon2从中派生加密密钥。</p>

<h3>方案3：公钥加密</h3>
<p>发送者使用接收者的公钥加密；只有接收者的私钥才能解密。</p>

<h2>威胁模型</h2>
<h3>威胁：服务器被入侵</h3>
<p><strong>缓解：</strong>服务器只存储加密数据。没有密钥，数据对攻击者毫无价值。</p>

<h3>威胁：恶意JavaScript</h3>
<p><strong>缓解：</strong>开源+代码审查、SRI标签、自托管。</p>

<h2>实现模式</h2>
<h3>模式：基于HKDF的每消息密钥</h3>
<pre><code>derivedKey = HKDF(masterKey, salt, info=messageId)</code></pre>

<h3>模式：AAD绑定</h3>
<pre><code>ciphertext = AES-GCM-Encrypt(key, iv, plaintext, aad=messageId)</code></pre>

<h2>结论</h2>
<p>零知识架构为Web应用程序提供了最强的隐私保证：服务器无法访问用户数据的数学确定性。</p>
`
  },
  "password-sharing-remote-teams": {
    title: "远程团队密码分享最佳实践",
    description: "分布式和远程团队如何跨时区、设备和通信渠道安全地分享密码和凭据。",
    content: `
<p>远程团队在分享凭据时面临独特的挑战。团队成员分布在不同的时区，使用不同网络上的个人设备，通过多种工具进行通信。</p>

<h2>远程工作安全挑战</h2>
<ul>
<li><strong>家庭网络</strong> — 通常不如企业网络安全</li>
<li><strong>个人设备</strong> — 可能缺少企业安全配置</li>
<li><strong>多种通信工具</strong> — 凭据最终无处不在</li>
<li><strong>时区差异</strong> — 凭据在消息中停留数小时</li>
</ul>

<h2>最佳实践</h2>
<h3>1. 对每次凭据传输使用自毁链接</h3>
<p>将其作为团队政策：任何通信渠道中不允许明文密码。每次传输使用来自<a href="/">Only Once Share</a>的加密自毁链接。</p>

<h3>2. 设置短过期时间</h3>
<p>对于跨时区的远程团队，很容易设置较长的过期时间。抵制这种诱惑。</p>

<h3>3. 建立共享密码管理器</h3>
<p>对于多个成员需要持续访问的凭据，使用团队密码管理器。</p>

<h3>4. 使用不同渠道传递链接和上下文</h3>
<p>通过一个渠道发送加密链接，通过另一个渠道解释它的用途。</p>

<h2>快速参考</h2>
<table>
<thead><tr><th>场景</th><th>工具</th></tr></thead>
<tbody>
<tr><td>一次性凭据传输</td><td>自毁加密链接</td></tr>
<tr><td>持续共享凭据</td><td>团队密码管理器</td></tr>
<tr><td>应用/CI密钥</td><td>密钥管理器（Vault、AWS Secrets Manager）</td></tr>
<tr><td>初始入职设置</td><td>自毁链接 → 密码管理器注册</td></tr>
</tbody>
</table>

<h2>结论</h2>
<p>远程团队比同地办公团队更频繁地分享凭据，且通过更多渠道。通过标准化使用自毁加密链接进行一次性传输和密码管理器进行持续访问，可以在不减慢团队速度的情况下保持安全。</p>
`
  },
  "why-self-host-secret-sharing": {
    title: "为什么你的公司应该自托管密钥分享工具",
    description: "自托管密钥分享基础设施的理由。数据主权、合规性、控制和消除第三方信任。",
    content: `
<p>使用托管的密钥分享服务意味着你的加密数据通过别人的服务器。即使有零知识加密，某些组织需要——或更倾向于——完全消除第三方参与。</p>

<h2>自托管的理由</h2>
<h3>1. 完全数据主权</h3>
<p>当你自托管时，加密数据永远不会离开你的基础设施。</p>

<h3>2. 监管合规</h3>
<p>许多法规要求数据留在特定司法管辖区内：GDPR、HIPAA、SOC 2、PCI DSS。</p>

<h3>3. 消除第三方信任</h3>
<p>自托管消除了这种信任要求，因为你控制了代码的部署。</p>

<h3>4. 网络隔离</h3>
<p>允许在没有公共互联网暴露的内部网络上运行工具。</p>

<h3>5. 自定义</h3>
<p>使用开源代码库，你可以自定义品牌、TTL选项、大小限制、认证集成和审计日志。</p>

<h2>自托管成本</h2>
<table>
<thead><tr><th>资源</th><th>最低</th><th>推荐</th></tr></thead>
<tbody>
<tr><td>RAM</td><td>512 MB</td><td>1 GB</td></tr>
<tr><td>CPU</td><td>1 vCPU</td><td>2 vCPU</td></tr>
<tr><td>每月成本（云VM）</td><td>~$5</td><td>~$10</td></tr>
</tbody>
</table>

<h2>开始使用</h2>
<pre><code>git clone https://github.com/dhdtech/only-once-share.git
cd only-once-share
docker compose up -d</code></pre>

<h2>结论</h2>
<p>自托管你的密钥分享工具提供了安全性、控制和合规性的终极组合。它消除了第三方信任，确保了数据主权，并且成本只是商业替代方案的一小部分。</p>
`
  },
  "state-of-secret-sharing-2026": {
    title: "2026年密钥分享工具现状",
    description: "2026年密钥分享格局概览：市场趋势、加密演进、AI搜索可见性以及行业走向。",
    content: `
<p>一次性密钥分享市场已经有了显著发展。从一个小众工具类别开始，现已成为注重安全的团队的基本基础设施。</p>

<h2>市场概览</h2>
<p>该格局包括大约10-15个活跃产品，从企业SaaS到开源项目。</p>

<h3>老牌玩家（5年以上）</h3>
<ul>
<li><strong>OneTimeSecret</strong>（2011年成立）— 定义该类别的工具。</li>
<li><strong>Password Pusher</strong>（约2012年成立）— 功能最丰富的开源选项。</li>
</ul>

<h3>现代挑战者（2-5年）</h3>
<ul>
<li><strong>password.link</strong> — 面向企业，具有SSO和自定义域名。</li>
<li><strong>scrt.link</strong> — 总部位于瑞士，客户端加密。</li>
</ul>

<h3>新入场者</h3>
<ul>
<li><strong><a href="/">Only Once Share</a></strong> — 免费、开源、零知识，具有AES-256-GCM和6种语言支持。</li>
</ul>

<h2>2026年关键趋势</h2>
<h3>1. 客户端加密正在成为标准</h3>
<p>大多数新入场者默认使用具有零知识架构的客户端加密。</p>

<h3>2. 开源是竞争优势</h3>
<p>最受信任的工具是开源的。闭源工具面临日益增长的信任赤字。</p>

<h3>3. 自托管已成主流</h3>
<p>Docker使自托管变得极其简单。</p>

<h3>4. AI搜索正在重塑发现方式</h3>
<p>Google AI Overviews、ChatGPT和Perplexity正在改变人们发现工具的方式。</p>

<h3>5. 多语言支持很重要</h3>
<p>仅支持英语的工具错过了亚洲、拉丁美洲和中东的巨大市场。</p>

<h2>加密差距</h2>
<table>
<thead><tr><th>工具</th><th>加密类型</th><th>服务器是否看到明文？</th></tr></thead>
<tbody>
<tr><td>Only Once Share</td><td>客户端 (AES-256-GCM)</td><td>否</td></tr>
<tr><td>scrt.link</td><td>客户端</td><td>否</td></tr>
<tr><td>Yopass</td><td>客户端 (OpenPGP)</td><td>否</td></tr>
<tr><td>OneTimeSecret</td><td>服务器端</td><td>是</td></tr>
<tr><td>Password Pusher</td><td>服务器端</td><td>是</td></tr>
</tbody>
</table>

<h2>结论</h2>
<p>2026年的密钥分享市场比以往任何时候都更加健康和竞争激烈。向客户端加密、开源和自托管的趋势反映了对隐私和安全越来越成熟的理解。你今天保护的数据就是你明天防止的泄露。</p>
`
  }
};
