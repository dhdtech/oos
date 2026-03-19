import type { BlogPostTranslation } from "../blog-posts";

export const ptTranslations: Record<string, BlogPostTranslation> = {
  "why-email-is-not-safe-for-passwords": {
    title: "Por que o e-mail não é seguro para compartilhar senhas",
    description: "O e-mail nunca foi projetado para transferência segura de dados. Descubra por que enviar senhas por e-mail é perigoso e o que usar no lugar.",
    content: `
<p>Todos os dias, milhões de senhas são compartilhadas por e-mail. Departamentos de TI enviam credenciais de login para novos funcionários. Freelancers recebem senhas de banco de dados em suas caixas de entrada. Equipes trocam chaves de API em longos tópicos de e-mail. Parece conveniente, mas é uma das formas mais perigosas de compartilhar informações sensíveis.</p>

<h2>Como o e-mail realmente funciona</h2>
<p>Para entender por que o e-mail é inseguro para senhas, você precisa entender como o e-mail funciona internamente. Quando você envia um e-mail, ele não viaja diretamente do seu computador para o destinatário. Ele passa por múltiplos servidores:</p>
<ol>
<li>Seu cliente de e-mail envia a mensagem para o servidor de e-mail de saída (SMTP)</li>
<li>Seu servidor de e-mail encaminha para o servidor do destinatário, frequentemente através de servidores intermediários</li>
<li>O servidor do destinatário armazena até que ele baixe ou visualize</li>
</ol>
<p>Em cada salto, o conteúdo do e-mail pode potencialmente ser lido, registrado ou interceptado. Embora a criptografia TLS proteja dados em trânsito entre servidores que a suportam, não há garantia de que cada servidor na cadeia use TLS. E mesmo com TLS, cada servidor descriptografa a mensagem para processá-la.</p>

<h2>O problema da persistência</h2>
<p>Talvez o maior risco não seja a interceptação — é a persistência. E-mails vivem para sempre por padrão:</p>
<ul>
<li><strong>Pasta "Enviados"</strong> — A senha fica nos seus e-mails enviados indefinidamente</li>
<li><strong>Caixa de entrada do destinatário</strong> — A senha permanece até ser excluída manualmente</li>
<li><strong>Backups do servidor</strong> — Provedores de e-mail fazem backup dos dados, o que significa que e-mails excluídos podem ainda existir</li>
<li><strong>Encaminhamento</strong> — O destinatário pode encaminhar o e-mail (e sua senha) para qualquer pessoa</li>
<li><strong>Indexação de busca</strong> — Índices de busca de e-mail facilitam encontrar "senha" na conta de alguém</li>
</ul>
<p>Se qualquer uma das contas for comprometida meses ou anos depois, o atacante obtém todas as senhas já compartilhadas por e-mail. Este não é um risco teórico — violações de contas de e-mail estão consistentemente entre os vetores de ataque mais comuns.</p>

<h2>Capturas de tela e espionagem visual</h2>
<p>Quando uma senha é exibida em um e-mail, ela pode ser capturada em screenshot, fotografada ou lida por cima do ombro. Não há como controlar o que acontece com a informação uma vez exibida na tela em um e-mail persistente.</p>

<h2>Riscos de conformidade</h2>
<p>Para organizações sujeitas a frameworks de conformidade como GDPR, HIPAA, SOC 2 ou PCI DSS, compartilhar credenciais por e-mail pode constituir uma violação. Esses frameworks exigem que dados sensíveis sejam transmitidos usando criptografia apropriada e controles de acesso — o e-mail tipicamente não atende a nenhum dos requisitos.</p>

<h2>A alternativa: links criptografados autodestrutivos</h2>
<p>A solução é compartilhar senhas através de um canal criptografado de ponta a ponta que destrói automaticamente os dados após serem acessados. Ferramentas de compartilhamento de segredos autodestrutivos como <a href="/">Only Once Share</a> funcionam assim:</p>
<ol>
<li>Criptografam a senha no seu navegador usando AES-256-GCM</li>
<li>Armazenam apenas os dados criptografados no servidor (conhecimento zero)</li>
<li>Geram um link de uso único que se autodestrói após a visualização</li>
<li>Mantêm a chave de descriptografia apenas no fragmento da URL (nunca enviada ao servidor)</li>
</ol>
<p>Esta abordagem elimina todos os riscos do e-mail: não há cópia persistente, não há risco de encaminhamento, não há texto simples no servidor, e os dados são automaticamente destruídos após uma visualização.</p>

<h2>Melhores práticas para compartilhamento de senhas</h2>
<ul>
<li><strong>Nunca envie senhas em texto simples</strong> por e-mail, Slack, SMS ou qualquer plataforma de mensagens</li>
<li><strong>Use um link autodestrutivo</strong> de uma ferramenta de conhecimento zero como <a href="/">Only Once Share</a></li>
<li><strong>Defina a expiração mais curta possível</strong> — se o destinatário lerá em uma hora, defina um TTL de 1 hora</li>
<li><strong>Rotacione credenciais</strong> após compartilhar — altere senhas depois que o destinatário as usar para configuração inicial</li>
<li><strong>Use um gerenciador de senhas</strong> para acesso compartilhado contínuo em vez de compartilhar senhas brutas</li>
</ul>

<h2>Conclusão</h2>
<p>E-mail é uma ferramenta de comunicação fantástica, mas foi projetado para mensagens, não para segredos. Senhas compartilhadas por e-mail persistem indefinidamente, passam por múltiplos servidores e se tornam uma vulnerabilidade em cada futura violação. Usando links criptografados autodestrutivos, você pode compartilhar credenciais com segurança sem deixar rastro.</p>
`
  },
  "what-is-zero-knowledge-encryption": {
    title: "O que é criptografia de conhecimento zero? Um guia simples",
    description: "Criptografia de conhecimento zero significa que o provedor de serviço não pode acessar seus dados. Saiba como funciona e por que é importante para compartilhamento de segredos.",
    content: `
<p>Você provavelmente já viu o termo "conhecimento zero" usado por ferramentas e serviços focados em privacidade. Mas o que realmente significa? E como você pode saber se um serviço realmente implementa criptografia de conhecimento zero versus apenas usá-la como termo de marketing?</p>

<h2>O conceito central</h2>
<p>Criptografia de conhecimento zero é uma arquitetura onde <strong>o provedor de serviço não pode acessar seus dados</strong> — não por causa de uma política, mas por causa da matemática. O provedor literalmente não possui as chaves necessárias para descriptografar suas informações.</p>
<p>Pense nisso como um cofre em um banco. O banco armazena o cofre, mas só você tem a chave. Nem o gerente do banco pode abri-lo. A criptografia de conhecimento zero aplica este mesmo princípio aos dados digitais.</p>

<h2>Como funciona na prática</h2>
<p>Em um sistema de conhecimento zero, a criptografia e a descriptografia acontecem no <strong>lado do cliente</strong> — seu navegador ou dispositivo. O fluxo de trabalho funciona assim:</p>
<ol>
<li><strong>Geração de chave</strong> — Seu dispositivo gera uma chave criptográfica (ex.: AES-256)</li>
<li><strong>Criptografia no cliente</strong> — Seus dados são criptografados no seu dispositivo antes de serem enviados para qualquer lugar</li>
<li><strong>Armazenamento no servidor</strong> — O servidor recebe e armazena apenas texto cifrado criptografado</li>
<li><strong>Gerenciamento de chave</strong> — A chave de criptografia fica no seu dispositivo (ou no fragmento da URL) e nunca é enviada ao servidor</li>
<li><strong>Descriptografia no cliente</strong> — Quando você (ou um destinatário) acessa os dados, a descriptografia ocorre no dispositivo cliente</li>
</ol>
<p>O ponto crítico é o passo 4: a chave nunca toca o servidor. Sem a chave, o servidor armazena o que é essencialmente ruído aleatório.</p>

<h2>Conhecimento zero vs. criptografia padrão</h2>
<table>
<thead><tr><th>Recurso</th><th>Criptografia no servidor</th><th>Criptografia de conhecimento zero</th></tr></thead>
<tbody>
<tr><td>Onde a criptografia acontece</td><td>No servidor</td><td>No seu navegador/dispositivo</td></tr>
<tr><td>Quem tem a chave</td><td>O servidor</td><td>Apenas o cliente</td></tr>
<tr><td>O provedor pode ler seus dados?</td><td>Sim</td><td>Não</td></tr>
<tr><td>Vulnerabilidade a violação de servidor</td><td>Dados expostos</td><td>Apenas blobs criptografados expostos</td></tr>
<tr><td>Vulnerabilidade a ordens legais</td><td>Provedor pode cumprir</td><td>Provedor não tem nada para entregar</td></tr>
</tbody>
</table>

<h2>Como Only Once Share implementa conhecimento zero</h2>
<p>No Only Once Share, o conhecimento zero é alcançado através do uso inteligente de fragmentos de URL:</p>
<ol>
<li>Seu navegador gera uma chave AES-256-GCM e criptografa seu segredo</li>
<li>Apenas o texto cifrado criptografado é enviado ao servidor</li>
<li>A chave de criptografia é colocada após o símbolo <code>#</code> na URL (o "fragmento")</li>
<li>Fragmentos de URL <strong>nunca são enviados aos servidores</strong> em requisições HTTP — isso é definido no RFC 3986</li>
<li>Quando o destinatário abre o link, seu navegador lê a chave do fragmento e descriptografa localmente</li>
</ol>

<h2>Por que isso importa</h2>
<p>A criptografia de conhecimento zero protege contra:</p>
<ul>
<li><strong>Violações de servidor</strong> — Atacantes que comprometem o servidor só obtêm dados criptografados que não podem ler</li>
<li><strong>Ameaças internas</strong> — Funcionários do provedor de serviço não podem acessar seus dados</li>
<li><strong>Vigilância governamental</strong> — O provedor não pode entregar dados que não pode descriptografar</li>
<li><strong>Mineração de dados</strong> — O provedor não pode analisar seus dados para publicidade ou perfilamento</li>
</ul>

<h2>Conclusão</h2>
<p>Criptografia de conhecimento zero é o padrão ouro para privacidade. Significa que você não precisa confiar no provedor de serviço — a matemática garante que eles não podem acessar seus dados. Ao escolher ferramentas para compartilhar informações sensíveis, sempre prefira implementações de conhecimento zero.</p>
`
  },
  "how-to-share-password-securely": {
    title: "Como compartilhar uma senha com segurança",
    description: "Guia passo a passo para compartilhar senhas com segurança usando links criptografados autodestrutivos. Pare de enviar senhas por e-mail e Slack.",
    content: `
<p>Seja compartilhando credenciais Wi-Fi com um visitante, enviando senhas de banco de dados para um colega ou dando a um cliente acesso à sua nova conta, há uma maneira certa e uma errada de compartilhar senhas.</p>

<h2>A maneira errada: canais em texto simples</h2>
<ul>
<li><strong>E-mail</strong> — Vive nas pastas de enviados/caixa de entrada para sempre</li>
<li><strong>Slack/Teams</strong> — Histórico de mensagens é retido e pesquisável por administradores</li>
<li><strong>SMS/iMessage</strong> — Armazenado em dispositivos e sistemas de operadoras</li>
<li><strong>Post-its</strong> — Risco de segurança física, facilmente fotografado</li>
</ul>

<h2>A maneira certa: links criptografados autodestrutivos</h2>
<h3>Passo a passo com Only Once Share</h3>
<ol>
<li><strong>Acesse <a href="/">ooshare.io</a></strong></li>
<li><strong>Digite a senha</strong> (ou qualquer texto secreto)</li>
<li><strong>Escolha um tempo de expiração</strong></li>
<li><strong>Clique em "Criar Link Secreto"</strong> — seu navegador criptografa a senha com AES-256-GCM antes de enviar qualquer coisa ao servidor</li>
<li><strong>Copie o link gerado</strong> e envie ao destinatário por qualquer canal</li>
<li><strong>O destinatário abre o link</strong>, vê a senha, e os dados são permanentemente destruídos</li>
</ol>

<h2>Por que esta abordagem funciona</h2>
<ul>
<li><strong>Sem cópias persistentes</strong> — A senha é destruída após visualização</li>
<li><strong>Criptografia ponta a ponta</strong> — O servidor só lida com dados criptografados</li>
<li><strong>Conhecimento zero</strong> — A chave está no fragmento da URL, nunca enviada ao servidor</li>
<li><strong>Limitação temporal</strong> — Mesmo se nunca visualizado, os dados expiram automaticamente</li>
<li><strong>Sem necessidade de conta</strong> — Sem registro, sem atrito</li>
</ul>

<h2>Melhores práticas adicionais</h2>
<h3>Rotacione após compartilhar</h3>
<p>Se está compartilhando uma senha para configuração inicial, peça ao destinatário que altere a senha imediatamente após o primeiro login.</p>

<h3>Use canais diferentes para contexto</h3>
<p>Envie o link secreto por um canal e diga ao destinatário para que serve por outro.</p>

<h2>Conclusão</h2>
<p>Compartilhar senhas com segurança não precisa ser complicado. Com links criptografados autodestrutivos, você pode compartilhar credenciais em segundos sem deixar rastro.</p>
`
  },
  "self-destructing-links-explained": {
    title: "Links autodestrutivos explicados: como funcionam",
    description: "Uma análise técnica de links autodestrutivos — os mecanismos que fazem senhas desaparecerem após serem lidas.",
    content: `
<p>Links autodestrutivos são uma das formas mais seguras de compartilhar informações sensíveis. Mas como eles realmente funcionam? Vamos decompor os mecanismos técnicos.</p>

<h2>O conceito básico</h2>
<ol>
<li><strong>Acesso único</strong> — Os dados só podem ser recuperados uma vez</li>
<li><strong>Expiração automática</strong> — Os dados são excluídos após um tempo definido, independentemente de serem acessados</li>
</ol>

<h2>Fluxo de trabalho técnico</h2>
<h3>Passo 1: Criptografia no cliente</h3>
<p>Quando você cria um segredo, seu navegador gera uma chave AES-256-GCM aleatória e um vetor de inicialização (IV). Seu segredo é criptografado no seu navegador.</p>

<h3>Passo 2: Armazenamento no servidor</h3>
<p>Apenas dados criptografados são enviados ao servidor com metadados (tempo de expiração, timestamp de criação). O servidor nunca vê seus dados em texto simples.</p>

<h3>Passo 3: Geração do link</h3>
<p>O servidor retorna um ID único. Seu navegador constrói o link completo combinando a URL do servidor, o ID da mensagem e a chave de criptografia após o fragmento de URL (<code>#</code>).</p>

<h3>Passo 4: Recuperação única</h3>
<p>Quando o destinatário abre o link, o servidor executa uma leitura atômica e exclusão: retorna os dados criptografados e os exclui imediatamente do armazenamento.</p>

<h3>Passo 5: Descriptografia no cliente</h3>
<p>O navegador do destinatário extrai a chave do fragmento da URL e descriptografa os dados localmente.</p>

<h2>Propriedades de segurança</h2>
<ul>
<li><strong>Sigilo antecipado</strong> — Uma vez excluídos, os dados não podem ser recuperados mesmo se o servidor for comprometido depois</li>
<li><strong>Conhecimento zero</strong> — O servidor nunca possui a capacidade de descriptografar dados</li>
<li><strong>Resistente a adulteração</strong> — AES-256-GCM fornece criptografia autenticada</li>
<li><strong>Detecção de acesso</strong> — Se o link já foi usado, o remetente sabe que alguém o visualizou</li>
</ul>

<h2>Conclusão</h2>
<p>Links autodestrutivos combinam criptografia no cliente, acesso único e expiração automática em uma URL simples. O segredo nunca toca o servidor em texto simples, e os dados são garantidamente excluídos.</p>
`
  },
  "aes-256-gcm-encryption-explained": {
    title: "Criptografia AES-256-GCM explicada",
    description: "Uma análise técnica profunda do AES-256-GCM — o padrão de criptografia usado pelo Only Once Share e outras ferramentas de segurança modernas.",
    content: `
<p>AES-256-GCM é o padrão de criptografia usado pelo Only Once Share, Signal, ProtonMail e a maioria das ferramentas de segurança modernas. Vamos explicar o que é, como funciona e por que é considerado o padrão ouro da criptografia simétrica.</p>

<h2>Decompondo o nome</h2>
<h3>AES (Advanced Encryption Standard)</h3>
<p>AES é um algoritmo de criptografia simétrica padronizado pelo NIST em 2001. "Simétrica" significa que a mesma chave é usada para criptografar e descriptografar.</p>

<h3>256 (Tamanho da chave)</h3>
<p>256 refere-se ao comprimento da chave de 256 bits. O espaço de chaves é 2^256 — um número maior que os átomos no universo observável.</p>

<h3>GCM (Galois/Counter Mode)</h3>
<p>GCM é o modo de operação que fornece <strong>confidencialidade</strong> (dados são criptografados) e <strong>autenticação</strong> (qualquer adulteração pode ser detectada).</p>

<h2>Por que AES-256-GCM?</h2>
<ul>
<li><strong>Criptografia autenticada</strong> — Criptografa e autentica em uma única operação</li>
<li><strong>Aceleração por hardware</strong> — CPUs modernas incluem instruções AES-NI</li>
<li><strong>Processamento paralelo</strong> — O modo GCM permite criptografar blocos em paralelo</li>
<li><strong>Amplamente auditado</strong> — Décadas de criptoanálise, sem vulnerabilidades práticas</li>
<li><strong>Padrão da indústria</strong> — TLS 1.3, SSH, IPsec todos o utilizam</li>
</ul>

<h2>O AES-256 é resistente a computação quântica?</h2>
<p>AES-256 é considerado resistente a computação quântica. O algoritmo de Grover reduz sua segurança efetiva para 128 bits — ainda bem além do alcance de qualquer ataque conhecido.</p>

<h2>Conclusão</h2>
<p>AES-256-GCM fornece confidencialidade, integridade e autenticação em um algoritmo eficiente. É o padrão ouro da criptografia simétrica.</p>
`
  },
  "send-api-keys-securely": {
    title: "Como enviar chaves de API com segurança para desenvolvedores",
    description: "Métodos seguros para desenvolvedores compartilharem chaves de API e tokens. Pare de colar credenciais no Slack — use links criptografados autodestrutivos.",
    content: `
<p>Chaves de API são a essência do desenvolvimento de software moderno. Elas autenticam serviços, autorizam acesso e conectam sistemas. Mas a forma como são compartilhadas é frequentemente chocantemente insegura.</p>

<h2>Compartilhamento típico (inseguro) de chaves de API</h2>
<ul>
<li>Colar chaves no Slack: "Aqui está a chave da API do Stripe: sk_live_..."</li>
<li>Commit no Git: "Chave de API hardcoded temporariamente para testes"</li>
<li>Compartilhar planilha de credenciais no Google Docs</li>
<li>Enviar arquivos de configuração por e-mail</li>
</ul>

<h2>O método seguro</h2>
<ol>
<li>Acesse <a href="/">ooshare.io</a></li>
<li>Cole a chave de API</li>
<li>Defina uma expiração curta</li>
<li>Envie o link via Slack/e-mail</li>
<li>O desenvolvedor usa e o link se autodestrói</li>
</ol>

<h2>Segurança no Git</h2>
<p>O erro mais perigoso é fazer commit de segredos no Git. Mesmo removendo o commit, o segredo permanece no histórico do Git. Use <code>.gitignore</code> para excluir arquivos <code>.env</code>.</p>

<h2>Conclusão</h2>
<p>Chaves de API devem usar links criptografados autodestrutivos para entrega única, variáveis de ambiente ou gerenciadores de segredos para uso em runtime, e ferramentas de varredura para prevenir commits acidentais.</p>
`
  },
  "best-free-secret-sharing-tools": {
    title: "Melhores ferramentas gratuitas de compartilhamento de segredos em 2025",
    description: "Comparação completa de ferramentas gratuitas de compartilhamento de segredos. Comparação lado a lado de recursos, segurança, métodos de criptografia e privacidade.",
    content: `
<p>Existem diversas ferramentas de compartilhamento de segredos no mercado. Este guia compara as melhores opções gratuitas, focando em segurança, privacidade e usabilidade.</p>

<h2>Comparação de ferramentas</h2>
<table>
<thead><tr><th>Ferramenta</th><th>Criptografia</th><th>Open Source</th><th>Auto-hospedagem</th><th>Plano Gratuito</th></tr></thead>
<tbody>
<tr><td><a href="/">Only Once Share</a></td><td>Cliente (AES-256-GCM)</td><td>Sim</td><td>Sim (Docker)</td><td>Totalmente gratuito</td></tr>
<tr><td>OneTimeSecret</td><td>Servidor</td><td>Sim</td><td>Sim</td><td>Gratuito (limitado)</td></tr>
<tr><td>Password Pusher</td><td>Servidor</td><td>Sim</td><td>Sim</td><td>Gratuito (limitado)</td></tr>
<tr><td>Yopass</td><td>Cliente (OpenPGP)</td><td>Sim</td><td>Sim</td><td>Totalmente gratuito</td></tr>
<tr><td>scrt.link</td><td>Cliente</td><td>Não</td><td>Não</td><td>Gratuito (limitado)</td></tr>
</tbody>
</table>

<h2>Por que Only Once Share se destaca</h2>
<ul>
<li><strong>Verdadeiro conhecimento zero</strong> — Criptografia AES-256-GCM no cliente</li>
<li><strong>Totalmente gratuito</strong> — Sem planos pagos, sem limitações</li>
<li><strong>Open source</strong> — Totalmente auditável no GitHub</li>
<li><strong>6 idiomas</strong> — Inglês, espanhol, chinês, português, hindi, árabe</li>
<li><strong>Pronto para auto-hospedagem</strong> — Deploy em minutos com Docker Compose</li>
</ul>

<h2>Conclusão</h2>
<p>Ao escolher uma ferramenta de compartilhamento de segredos, priorize criptografia no cliente e transparência open source. <a href="/">Only Once Share</a> se destaca em ambos e é totalmente gratuito.</p>
`
  },
  "server-side-vs-client-side-encryption": {
    title: "Criptografia no servidor vs. no cliente: por que a diferença importa",
    description: "Entenda a diferença crítica entre criptografia no servidor e no cliente. Uma protege seus dados de todos — incluindo o provedor. A outra não.",
    content: `
<p>"Criptografado" não significa automaticamente "privado". Onde a criptografia acontece determina quem pode acessar seus dados.</p>

<h2>Criptografia no servidor</h2>
<p>Os dados chegam ao servidor em texto simples, o servidor os criptografa e armazena. O servidor detém a chave de criptografia.</p>

<h2>Criptografia no cliente (conhecimento zero)</h2>
<p>Os dados são criptografados no seu navegador/dispositivo antes de serem enviados ao servidor. O servidor nunca vê sua chave.</p>

<h2>Impacto na segurança</h2>
<table>
<thead><tr><th>Cenário</th><th>Servidor</th><th>Cliente</th></tr></thead>
<tbody>
<tr><td>Servidor hackeado</td><td>Dados expostos</td><td>Apenas blobs criptografados</td></tr>
<tr><td>Funcionário desonesto</td><td>Pode ler dados</td><td>Não pode ler dados</td></tr>
<tr><td>Intimação governamental</td><td>Deve entregar dados</td><td>Nenhum dado utilizável para entregar</td></tr>
</tbody>
</table>

<h2>Conclusão</h2>
<p>Criptografia no servidor protege dados em repouso, mas confia no servidor. Criptografia no cliente não confia em ninguém — a chave nunca sai do seu dispositivo. Para dados sensíveis, criptografia no cliente (conhecimento zero) é o único método que oferece verdadeira privacidade.</p>
`
  },
  "self-host-secret-sharing-docker": {
    title: "Como auto-hospedar uma ferramenta de compartilhamento de segredos com Docker",
    description: "Guia passo a passo para implantar sua própria ferramenta de compartilhamento de segredos em 5 minutos com Docker Compose. Controle total dos seus dados.",
    content: `
<p>Auto-hospedar sua ferramenta de compartilhamento de segredos dá controle total sobre os dados. Com Docker Compose, você pode executar Only Once Share na sua própria infraestrutura em minutos.</p>

<h2>Início rápido</h2>
<pre><code>git clone https://github.com/dhdtech/only-once-share.git
cd only-once-share
docker compose up -d</code></pre>

<h2>Por que auto-hospedar?</h2>
<ul>
<li><strong>Soberania de dados</strong> — Dados criptografados nunca saem da sua infraestrutura</li>
<li><strong>Conformidade</strong> — Atende requisitos de residência de dados GDPR, HIPAA, SOC 2</li>
<li><strong>Isolamento de rede</strong> — Execute em rede interna sem exposição à internet pública</li>
<li><strong>Personalização</strong> — Modifique branding, opções de TTL, limites de tamanho</li>
</ul>

<h2>Requisitos de recursos</h2>
<table>
<thead><tr><th>Recurso</th><th>Mínimo</th><th>Recomendado</th></tr></thead>
<tbody>
<tr><td>RAM</td><td>512 MB</td><td>1 GB</td></tr>
<tr><td>CPU</td><td>1 vCPU</td><td>2 vCPU</td></tr>
<tr><td>Armazenamento</td><td>1 GB</td><td>5 GB</td></tr>
</tbody>
</table>

<h2>Conclusão</h2>
<p>Auto-hospedar Only Once Share com Docker é a forma mais fácil de obter controle total dos dados. A configuração leva menos de 5 minutos e fornece a mesma criptografia de conhecimento zero da versão hospedada.</p>
`
  },
  "credential-sharing-employee-onboarding": {
    title: "Compartilhamento seguro de credenciais durante a integração de funcionários",
    description: "Como compartilhar senhas, chaves de API e credenciais de acesso com segurança durante a integração de funcionários.",
    content: `
<p>A integração de funcionários é o momento de pico do compartilhamento de credenciais. Novos funcionários precisam de senhas para múltiplos sistemas, ferramentas e serviços.</p>

<h2>Fluxo de trabalho seguro de integração</h2>
<ol>
<li><strong>Crie links autodestrutivos separados para cada credencial</strong></li>
<li><strong>Defina expirações curtas</strong> — TTL de 24 horas para o primeiro dia</li>
<li><strong>Exija alteração imediata de senha</strong></li>
<li><strong>Inscreva no gerenciador de senhas</strong></li>
<li><strong>Ative MFA</strong> em todos os serviços que suportam</li>
</ol>

<h2>O que não fazer</h2>
<ul>
<li>Não envie senhas em texto simples no e-mail de "boas-vindas"</li>
<li>Não use uma planilha compartilhada com todas as credenciais</li>
<li>Não use a mesma senha temporária para todos os novos funcionários</li>
</ul>

<h2>Conclusão</h2>
<p>A integração é um momento crítico de segurança. Use links criptografados autodestrutivos para entrega inicial de credenciais e depois transfira novos funcionários para gerenciadores de senhas e MFA.</p>
`
  },
  "gdpr-compliant-secret-sharing": {
    title: "Compartilhamento de segredos em conformidade com GDPR",
    description: "Como compartilhar senhas e dados sensíveis em conformidade com o GDPR. Minimização de dados, requisitos de criptografia e melhores práticas.",
    content: `
<p>O Regulamento Geral de Proteção de Dados (GDPR) impõe requisitos rigorosos sobre como organizações lidam com dados pessoais. Isso se estende a como senhas e credenciais são compartilhadas.</p>

<h2>Princípios relevantes do GDPR</h2>
<ul>
<li><strong>Minimização de dados</strong> (Art. 5(1)(c)) — Processe apenas o necessário</li>
<li><strong>Limitação de armazenamento</strong> (Art. 5(1)(e)) — Não retenha mais do que o necessário</li>
<li><strong>Integridade e confidencialidade</strong> (Art. 5(1)(f)) — Medidas de segurança apropriadas</li>
<li><strong>Privacidade por design</strong> (Art. 25) — Proteção de dados incorporada por padrão</li>
</ul>

<h2>Como links autodestrutivos atendem ao GDPR</h2>
<table>
<thead><tr><th>Requisito GDPR</th><th>Como links autodestrutivos atendem</th></tr></thead>
<tbody>
<tr><td>Minimização de dados</td><td>Armazena apenas o segredo criptografado</td></tr>
<tr><td>Limitação de armazenamento</td><td>Exclusão automática após acesso</td></tr>
<tr><td>Criptografia</td><td>Criptografia AES-256-GCM no cliente</td></tr>
<tr><td>Privacidade por design</td><td>Arquitetura de conhecimento zero</td></tr>
</tbody>
</table>

<h2>Conclusão</h2>
<p>Compartilhamento de segredos em conformidade com GDPR requer criptografia, minimização de dados e exclusão automática. Links autodestrutivos de conhecimento zero atendem a todos esses requisitos.</p>
`
  },
  "devops-secret-sharing-best-practices": {
    title: "Melhores práticas de compartilhamento de segredos em DevOps",
    description: "Gerencie e compartilhe chaves de API, tokens e credenciais com segurança em fluxos de trabalho DevOps.",
    content: `
<p>Equipes DevOps lidam com mais credenciais do que quase qualquer outro papel: chaves de API, senhas de banco de dados, chaves SSH, tokens de provedor de nuvem, credenciais de registro de contêiner, certificados TLS e segredos de webhook.</p>

<h2>Ciclo de vida dos segredos</h2>
<h3>1. Entrega inicial (transferência única)</h3>
<p><strong>Solução:</strong> Use um link criptografado autodestrutivo para cada transferência de credencial. <a href="/">Only Once Share</a> lida com isso com criptografia de conhecimento zero.</p>

<h3>2. Uso ativo (runtime)</h3>
<p><strong>Solução:</strong> Use variáveis de ambiente, gerenciadores de segredos (HashiCorp Vault, AWS Secrets Manager, Doppler) ou configuração criptografada.</p>

<h3>3. Rotação</h3>
<p><strong>Solução:</strong> Automatize a rotação sempre que possível. Para rotação manual, use links criptografados para entrega de novas credenciais.</p>

<h2>Erros comuns</h2>
<h3>Segredos no controle de versão</h3>
<p>O erro mais perigoso é fazer commit de segredos no Git. Mesmo removendo o commit, o segredo permanece no histórico.</p>

<h2>Conclusão</h2>
<p>Gerenciamento de segredos em DevOps é um problema em camadas. Links criptografados autodestrutivos lidam com a entrega única; gerenciadores de segredos lidam com o acesso em runtime; plataformas CI/CD lidam com segredos de pipeline.</p>
`
  },
  "complete-guide-one-time-secret-sharing": {
    title: "O guia completo para compartilhamento de segredos únicos",
    description: "Tudo que você precisa saber sobre compartilhamento de segredos únicos: como funciona, quando usar, considerações de segurança e escolha da ferramenta certa.",
    content: `
<p>Compartilhamento de segredos únicos é a prática de transmitir informações sensíveis através de links que se autodestroem após uma única visualização.</p>

<h2>Quando usar compartilhamento de segredos únicos</h2>
<ul>
<li><strong>Senhas</strong> — Compartilhar credenciais de login para configuração inicial</li>
<li><strong>Chaves de API e tokens</strong> — Distribuir credenciais de serviço para desenvolvedores</li>
<li><strong>Strings de conexão</strong> — URLs de banco de dados, URIs Redis</li>
<li><strong>Chaves SSH</strong> — Chaves privadas para acesso a servidores</li>
<li><strong>Informações pessoais</strong> — CPF, detalhes financeiros</li>
</ul>

<h2>Níveis de segurança</h2>
<h3>Nível 1: Criptografia no servidor</h3>
<p>O servidor recebe texto simples, criptografa e armazena. O servidor vê seus dados.</p>

<h3>Nível 2: Criptografia no cliente (conhecimento zero)</h3>
<p>O navegador criptografa os dados antes de enviar ao servidor. O servidor só armazena blobs criptografados.</p>
<p><em>Exemplos: <a href="/">Only Once Share</a>, scrt.link, Yopass</em></p>

<h3>Nível 3: Cliente + auto-hospedado</h3>
<p>Igual ao Nível 2, mas executando na sua própria infraestrutura.</p>

<h2>Conclusão</h2>
<p>Compartilhamento de segredos únicos é o método mais seguro para transmitir informações sensíveis que precisam ser acessadas uma vez. Escolha uma ferramenta de conhecimento zero como <a href="/">Only Once Share</a>.</p>
`
  },
  "open-source-security-transparency": {
    title: "Segurança open source: por que a transparência importa",
    description: "Por que ferramentas de segurança open source são mais confiáveis que alternativas de código fechado. Auditoria comunitária, segurança da cadeia de suprimentos e o problema da confiança.",
    content: `
<p>Quando se trata de software de segurança, existe um paradoxo: as ferramentas que mais pedem sua confiança são frequentemente aquelas em que você deveria menos confiar.</p>

<h2>O problema da confiança</h2>
<p>Toda ferramenta de segurança faz afirmações: "criptografia de nível militar", "segurança de nível bancário", "arquitetura de conhecimento zero". Mas como você verifica essas afirmações? Com software de código fechado, você não pode.</p>
<p>Open source resolve isso tornando o código publicamente disponível.</p>

<h2>Open source e conhecimento zero verificável</h2>
<p>Para <a href="/">Only Once Share</a>, open source não é opcional — é essencial. Nossas afirmações de conhecimento zero são verificáveis porque você pode ler o <a href="https://github.com/dhdtech/only-once-share">código de criptografia</a>.</p>

<h2>Auto-hospedagem: o modelo de confiança definitivo</h2>
<p>Open source permite auto-hospedagem — executar o software na sua própria infraestrutura. Isso elimina até a necessidade de confiar na versão hospedada.</p>

<h2>Conclusão</h2>
<p>Para ferramentas de segurança, open source não é um luxo — é um requisito para credibilidade. Você não deveria ter que confiar na palavra de um fornecedor de que seus dados estão criptografados. Com open source, você pode verificar por si mesmo.</p>
`
  },
  "incident-response-credential-sharing": {
    title: "Resposta a incidentes: compartilhamento seguro de credenciais durante emergências",
    description: "Quando um incidente de segurança acontece, equipes precisam compartilhar credenciais rapidamente. Como equilibrar velocidade com segurança.",
    content: `
<p>Às 2 da manhã, seu sistema de monitoramento dispara um alerta crítico. Um banco de dados de produção está exposto. Você precisa compartilhar credenciais de acesso de emergência com a equipe de resposta a incidentes — rápido.</p>

<h2>Uma abordagem rápida E segura</h2>
<ol>
<li><strong>Abra <a href="/">ooshare.io</a></strong> (salve nos favoritos do seu playbook de resposta a incidentes)</li>
<li><strong>Cole a credencial</strong></li>
<li><strong>Defina TTL de 1 hora</strong></li>
<li><strong>Compartilhe o link</strong> no canal de resposta a incidentes</li>
<li><strong>O respondente abre o link</strong> e obtém a credencial — dados destruídos</li>
</ol>
<p>Tempo total: menos de 30 segundos.</p>

<h2>Higiene de credenciais pós-incidente</h2>
<ol>
<li><strong>Rotacione cada credencial</strong> compartilhada durante o incidente</li>
<li><strong>Rotacione cada credencial</strong> que pode ter sido comprometida no próprio incidente</li>
<li><strong>Revise logs de acesso</strong></li>
<li><strong>Atualize seu playbook</strong></li>
</ol>

<h2>Conclusão</h2>
<p>Resposta a incidentes exige velocidade, mas velocidade sem segurança cria risco composto. Links criptografados autodestrutivos oferecem a velocidade de uma mensagem do Slack com a segurança de dados criptografados e efêmeros.</p>
`
  },
  "web-crypto-api-browser-encryption": {
    title: "Web Crypto API: construindo criptografia no navegador",
    description: "Guia prático da Web Crypto API para desenvolvedores. Gere chaves, criptografe dados e implemente arquiteturas de conhecimento zero no navegador.",
    content: `
<p>A Web Crypto API é uma API JavaScript nativa do navegador que fornece operações criptográficas sem bibliotecas externas.</p>

<h2>Por que Web Crypto API?</h2>
<ul>
<li><strong>Sem dependências externas</strong> — Embutida em todos os navegadores modernos</li>
<li><strong>Aceleração por hardware</strong> — Usa o conjunto de instruções AES-NI da CPU</li>
<li><strong>Geração segura de números aleatórios</strong> — <code>crypto.getRandomValues()</code> usa o CSPRNG do SO</li>
<li><strong>Design assíncrono</strong> — Operações não-bloqueantes via Promises</li>
</ul>

<h2>Operações principais</h2>
<h3>1. Geração de valores aleatórios</h3>
<pre><code>const iv = crypto.getRandomValues(new Uint8Array(12));</code></pre>

<h3>2. Geração de chave AES-256-GCM</h3>
<pre><code>const key = await crypto.subtle.generateKey(
  { name: "AES-GCM", length: 256 },
  true,
  ["encrypt", "decrypt"]
);</code></pre>

<h3>3. Criptografia de dados</h3>
<pre><code>const ciphertext = await crypto.subtle.encrypt(
  { name: "AES-GCM", iv, additionalData, tagLength: 128 },
  key,
  data
);</code></pre>

<h3>4. Derivação de chave com HKDF</h3>
<pre><code>const derivedKey = await crypto.subtle.deriveKey(
  { name: "HKDF", hash: "SHA-256", salt, info: new TextEncoder().encode(messageId) },
  keyMaterial,
  { name: "AES-GCM", length: 256 },
  false,
  ["encrypt", "decrypt"]
);</code></pre>

<h2>Construindo uma arquitetura de conhecimento zero</h2>
<p>A Web Crypto API facilita a construção de sistemas de conhecimento zero. O padrão usado pelo <a href="/">Only Once Share</a>: gerar chave no navegador, criptografar no cliente, enviar apenas texto cifrado ao servidor, colocar a chave no fragmento da URL (<code>#</code>).</p>

<h2>Conclusão</h2>
<p>A Web Crypto API fornece tudo que você precisa para construir aplicações seguras e focadas em privacidade sem bibliotecas criptográficas externas.</p>
`
  },
  "zero-knowledge-architecture-deep-dive": {
    title: "Arquitetura de conhecimento zero: um mergulho técnico profundo",
    description: "Exploração técnica de padrões de arquitetura de conhecimento zero para aplicações web. Gerenciamento de chaves, fragmentos de URL e modelagem de ameaças.",
    content: `
<p>Arquitetura de conhecimento zero é um padrão de design de sistemas onde o provedor de serviço não pode acessar dados do usuário. Não por política — por impossibilidade matemática.</p>

<h2>Definindo conhecimento zero</h2>
<ol>
<li>Dados são criptografados antes de sair do cliente</li>
<li>O servidor nunca possui a chave de descriptografia</li>
<li>O servidor armazena apenas texto cifrado que não pode descriptografar</li>
<li>Descriptografia ocorre exclusivamente no cliente</li>
</ol>

<h2>O problema de distribuição de chaves</h2>
<h3>Solução 1: Fragmentos de URL</h3>
<p>A abordagem usada pelo <a href="/">Only Once Share</a>. A chave é colocada após o <code>#</code> na URL:</p>
<pre><code>https://ooshare.io/s/abc123#chave-de-descriptografia-aqui</code></pre>
<p>Fragmentos de URL são definidos no RFC 3986 como apenas para o cliente — navegadores nunca os incluem em requisições HTTP.</p>

<h3>Solução 2: Derivação de chave baseada em senha</h3>
<p>O usuário fornece uma senha, e PBKDF2 ou Argon2 deriva a chave de criptografia.</p>

<h3>Solução 3: Criptografia de chave pública</h3>
<p>O remetente criptografa com a chave pública do destinatário; apenas a chave privada do destinatário pode descriptografar.</p>

<h2>Modelo de ameaças</h2>
<h3>Ameaça: Servidor comprometido</h3>
<p><strong>Mitigação:</strong> Servidor só armazena dados criptografados. Sem chaves, os dados não têm valor.</p>

<h3>Ameaça: JavaScript malicioso</h3>
<p><strong>Mitigação:</strong> Open source + revisão de código, tags SRI, auto-hospedagem.</p>

<h2>Padrões de implementação</h2>
<pre><code>derivedKey = HKDF(masterKey, salt, info=messageId)</code></pre>
<pre><code>ciphertext = AES-GCM-Encrypt(key, iv, plaintext, aad=messageId)</code></pre>

<h2>Conclusão</h2>
<p>Arquitetura de conhecimento zero fornece a garantia de privacidade mais forte para aplicações web: certeza matemática de que o servidor não pode acessar dados do usuário.</p>
`
  },
  "password-sharing-remote-teams": {
    title: "Melhores práticas de compartilhamento de senhas para equipes remotas",
    description: "Como equipes distribuídas e remotas podem compartilhar senhas e credenciais com segurança através de fusos horários, dispositivos e canais de comunicação.",
    content: `
<p>Equipes remotas enfrentam desafios únicos ao compartilhar credenciais. Membros da equipe estão espalhados por fusos horários, usando dispositivos pessoais em várias redes.</p>

<h2>Desafio de segurança do trabalho remoto</h2>
<ul>
<li><strong>Redes domésticas</strong> — Frequentemente menos seguras que redes corporativas</li>
<li><strong>Dispositivos pessoais</strong> — Podem não ter configurações de segurança empresarial</li>
<li><strong>Múltiplas ferramentas de comunicação</strong> — Credenciais acabam em todos os lugares</li>
<li><strong>Diferenças de fuso horário</strong> — Credenciais ficam em mensagens por horas</li>
</ul>

<h2>Melhores práticas</h2>
<h3>1. Use links autodestrutivos para cada transferência de credencial</h3>
<p>Faça disso uma política da equipe: sem senhas em texto simples em nenhum canal. Cada transferência usa um link criptografado autodestrutivo de <a href="/">Only Once Share</a>.</p>

<h3>2. Defina tempos de expiração curtos</h3>

<h3>3. Estabeleça um gerenciador de senhas compartilhado</h3>

<h3>4. Use canais separados para link e contexto</h3>

<h2>Referência rápida</h2>
<table>
<thead><tr><th>Cenário</th><th>Ferramenta</th></tr></thead>
<tbody>
<tr><td>Transferência única de credencial</td><td>Link criptografado autodestrutivo</td></tr>
<tr><td>Credencial compartilhada contínua</td><td>Gerenciador de senhas da equipe</td></tr>
<tr><td>Segredos de aplicação/CI</td><td>Gerenciador de segredos (Vault, AWS Secrets Manager)</td></tr>
<tr><td>Configuração inicial de integração</td><td>Link autodestrutivo → inscrição no gerenciador de senhas</td></tr>
</tbody>
</table>

<h2>Conclusão</h2>
<p>Equipes remotas compartilham credenciais com mais frequência e através de mais canais. Padronizando links criptografados autodestrutivos para transferências únicas e gerenciadores de senhas para acesso contínuo, você mantém a segurança sem desacelerar a equipe.</p>
`
  },
  "why-self-host-secret-sharing": {
    title: "Por que sua empresa deveria auto-hospedar sua ferramenta de compartilhamento de segredos",
    description: "O caso para auto-hospedar sua infraestrutura de compartilhamento de segredos. Soberania de dados, conformidade, controle e eliminação de confiança em terceiros.",
    content: `
<p>Usar um serviço hospedado de compartilhamento de segredos significa que seus dados criptografados passam pelos servidores de outra pessoa. Mesmo com criptografia de conhecimento zero, algumas organizações precisam — ou preferem — eliminar completamente o envolvimento de terceiros.</p>

<h2>O caso para auto-hospedagem</h2>
<h3>1. Soberania total de dados</h3>
<p>Quando você auto-hospeda, dados criptografados nunca saem da sua infraestrutura.</p>

<h3>2. Conformidade regulatória</h3>
<p>Muitas regulamentações exigem que dados permaneçam em jurisdições específicas: GDPR, HIPAA, SOC 2, PCI DSS.</p>

<h3>3. Eliminar confiança em terceiros</h3>
<p>Auto-hospedagem elimina esse requisito de confiança porque você controla a implantação do código.</p>

<h3>4. Isolamento de rede</h3>
<p>Permite executar a ferramenta em uma rede interna sem exposição à internet pública.</p>

<h3>5. Personalização</h3>
<p>Com o código open source, você pode personalizar branding, opções de TTL, limites de tamanho, integração com autenticação e auditoria.</p>

<h2>Custos de auto-hospedagem</h2>
<table>
<thead><tr><th>Recurso</th><th>Mínimo</th><th>Recomendado</th></tr></thead>
<tbody>
<tr><td>RAM</td><td>512 MB</td><td>1 GB</td></tr>
<tr><td>CPU</td><td>1 vCPU</td><td>2 vCPU</td></tr>
<tr><td>Custo mensal (VM cloud)</td><td>~$5</td><td>~$10</td></tr>
</tbody>
</table>

<h2>Começar</h2>
<pre><code>git clone https://github.com/dhdtech/only-once-share.git
cd only-once-share
docker compose up -d</code></pre>

<h2>Conclusão</h2>
<p>Auto-hospedar sua ferramenta de compartilhamento de segredos fornece a combinação definitiva de segurança, controle e conformidade. Elimina a confiança em terceiros, garante a soberania de dados e custa uma fração das alternativas comerciais.</p>
`
  },
  "state-of-secret-sharing-2026": {
    title: "O estado das ferramentas de compartilhamento de segredos em 2026",
    description: "Uma visão geral do cenário de compartilhamento de segredos em 2026: tendências de mercado, evolução da criptografia, visibilidade em busca por IA e para onde a indústria está indo.",
    content: `
<p>O mercado de compartilhamento de segredos únicos evoluiu significativamente. O que começou como uma categoria de ferramentas de nicho se tornou infraestrutura essencial para equipes conscientes de segurança.</p>

<h2>Visão geral do mercado</h2>
<p>O cenário inclui aproximadamente 10-15 produtos ativos, de SaaS empresarial a projetos open source.</p>

<h3>Players estabelecidos (5+ anos)</h3>
<ul>
<li><strong>OneTimeSecret</strong> (est. 2011) — A ferramenta que definiu a categoria.</li>
<li><strong>Password Pusher</strong> (est. ~2012) — A opção open source mais rica em recursos.</li>
</ul>

<h3>Desafiantes modernos (2-5 anos)</h3>
<ul>
<li><strong>password.link</strong> — Focado em empresas com SSO e domínios personalizados.</li>
<li><strong>scrt.link</strong> — Baseado na Suíça, criptografia no cliente.</li>
</ul>

<h3>Novos entrantes</h3>
<ul>
<li><strong><a href="/">Only Once Share</a></strong> — Gratuito, open source, conhecimento zero com AES-256-GCM e suporte a 6 idiomas.</li>
</ul>

<h2>Tendências-chave em 2026</h2>
<h3>1. Criptografia no cliente está se tornando o padrão</h3>
<p>A maioria dos novos entrantes usa criptografia no cliente com arquitetura de conhecimento zero por padrão.</p>

<h3>2. Open source é uma vantagem competitiva</h3>
<p>As ferramentas mais confiáveis são open source. Ferramentas de código fechado enfrentam um déficit de confiança crescente.</p>

<h3>3. Auto-hospedagem é mainstream</h3>
<p>Docker tornou a auto-hospedagem trivialmente fácil.</p>

<h3>4. Busca por IA está remodelando a descoberta</h3>
<p>Google AI Overviews, ChatGPT e Perplexity estão mudando como pessoas descobrem ferramentas.</p>

<h3>5. Suporte multilíngue importa</h3>
<p>Ferramentas apenas em inglês perdem mercados enormes na Ásia, América Latina e Oriente Médio.</p>

<h2>A lacuna de criptografia</h2>
<table>
<thead><tr><th>Ferramenta</th><th>Tipo de criptografia</th><th>Servidor vê texto simples?</th></tr></thead>
<tbody>
<tr><td>Only Once Share</td><td>Cliente (AES-256-GCM)</td><td>Não</td></tr>
<tr><td>scrt.link</td><td>Cliente</td><td>Não</td></tr>
<tr><td>Yopass</td><td>Cliente (OpenPGP)</td><td>Não</td></tr>
<tr><td>OneTimeSecret</td><td>Servidor</td><td>Sim</td></tr>
<tr><td>Password Pusher</td><td>Servidor</td><td>Sim</td></tr>
</tbody>
</table>

<h2>Conclusão</h2>
<p>O mercado de compartilhamento de segredos em 2026 é mais saudável e competitivo do que nunca. A tendência em direção à criptografia no cliente, open source e auto-hospedagem reflete um entendimento cada vez mais maduro de privacidade e segurança. Os dados que você protege hoje são a violação que você previne amanhã.</p>
`
  },
  "why-share-images-securely": {
    title: "Por que você deveria compartilhar imagens com segurança (e como fazer)",
    description: "Imagens carregam mais dados sensíveis do que você imagina. Saiba por que o compartilhamento seguro de imagens é importante para saúde, jurídico, RH e privacidade pessoal — e como links criptografados e autodestrutivos resolvem o problema.",
    content: `
<p>Quando as pessoas pensam em compartilhar segredos, pensam em senhas e chaves de API. Mas alguns dos dados mais sensíveis que compartilhamos diariamente vêm na forma de imagens — digitalizações de documentos de identidade, registros médicos, contratos assinados, fotos privadas. Diferente do texto, imagens são mais difíceis de censurar, mais fáceis de encaminhar e quase impossíveis de desfazer uma vez vazadas.</p>

<h2>Imagens são alvos de alto valor</h2>
<p>Uma senha vazada pode ser alterada em minutos. Uma imagem vazada do seu passaporte, exame médico ou foto privada não pode ser desfeita. Imagens carregam informações ricas e contextuais:</p>
<ul>
<li><strong>Documentos de identidade</strong> — passaportes, carteiras de motorista e documentos nacionais contêm nome completo, data de nascimento, foto e números de documento. Uma única digitalização vazada é suficiente para roubo de identidade.</li>
<li><strong>Registros médicos</strong> — raios-X, resultados de laboratório, prescrições e imagens diagnósticas são protegidos por regulamentações como HIPAA e LGPD. Compartilhá-los por e-mail ou chat cria risco de conformidade.</li>
<li><strong>Documentos legais</strong> — contratos assinados, documentos judiciais e cartas notariais frequentemente precisam ser compartilhados entre partes, mas nunca deveriam ficar em uma caixa de entrada.</li>
<li><strong>Registros financeiros</strong> — extratos bancários, formulários fiscais e documentos de seguros contêm números de conta e dados financeiros pessoais.</li>
</ul>

<h2>Cenários do mundo real</h2>
<p>Compartilhamento seguro de imagens não é uma necessidade de nicho. Surge constantemente em contextos profissionais e pessoais.</p>

<h3>Saúde</h3>
<p>Um médico precisa compartilhar uma imagem diagnóstica com um especialista. Enviar por e-mail significa que ela fica em duas caixas de entrada indefinidamente. Com um link criptografado e autodestrutivo, o especialista visualiza a imagem uma vez e ela é permanentemente excluída.</p>

<h3>Jurídico e conformidade</h3>
<p>Um advogado envia ao cliente a foto de um acordo assinado. O documento não deveria persistir em threads de e-mail. Um link de uso único garante que seja visualizado e depois desapareça.</p>

<h3>Recursos humanos</h3>
<p>Novos funcionários enviam digitalizações de documentos de identidade e autorizações de trabalho. Departamentos de RH que recebem esses documentos por e-mail acumulam documentos de identidade — alvo principal para violações de dados. Links autodestrutivos resolvem isso.</p>

<h3>Imobiliário e finanças</h3>
<p>Solicitações de hipotecas, escrituras e extratos bancários frequentemente precisam ser compartilhados entre corretores e clientes. Contêm números de conta e assinaturas que não deveriam ficar em threads de e-mail.</p>

<h3>Privacidade pessoal</h3>
<p>Às vezes você precisa enviar uma foto do seu cartão de seguro para um familiar ou compartilhar uma captura de tela de uma conversa privada. Apps de mensagens armazenam imagens em seus servidores e sincronizam com backups na nuvem. Um link criptografado autodestrutivo devolve o controle a você.</p>

<h2>Por que os métodos tradicionais falham</h2>

<h3>E-mail</h3>
<p>O e-mail armazena mensagens e anexos indefinidamente em múltiplos servidores. A maioria dos e-mails não tem criptografia de ponta a ponta. Imagens enviadas por e-mail são trivialmente fáceis de encaminhar.</p>

<h3>Apps de mensagens</h3>
<p>WhatsApp, Slack e Teams frequentemente comprimem e armazenam imagens em seus servidores. Mesmo recursos de "mensagens que desaparecem" não são confiáveis — destinatários podem fazer capturas de tela e políticas de retenção corporativa podem anular as configurações de exclusão.</p>

<h3>Links de armazenamento na nuvem</h3>
<p>Links do Google Drive, Dropbox e OneDrive são persistentes por padrão. Revogar acesso requer ação manual e o arquivo permanece nos servidores do provedor.</p>

<h2>Como links criptografados autodestrutivos resolvem isso</h2>
<p>A ideia central é simples: criptografar a imagem no seu navegador antes de sair do dispositivo, enviar apenas os dados criptografados e gerar um link de uso único. O destinatário abre o link, a imagem é descriptografada no navegador e os dados criptografados são permanentemente excluídos do servidor.</p>
<ul>
<li><strong>Criptografia de conhecimento zero</strong> — O servidor nunca vê a imagem original.</li>
<li><strong>Recuperação única</strong> — A imagem só pode ser visualizada uma vez. Depois, os dados são excluídos atomicamente.</li>
<li><strong>Sem persistência</strong> — Diferente de anexos de e-mail ou links na nuvem, não há cópia esperando para ser violada.</li>
<li><strong>Criptografia no cliente</strong> — A chave de criptografia nunca toca o servidor.</li>
</ul>

<h2>Como o Only Once Share lida com compartilhamento de imagens</h2>
<p><a href="/">Only Once Share</a> suporta compartilhamento de imagens criptografadas:</p>
<ol>
<li><strong>Selecione ou arraste sua imagem</strong> — Arraste e solte ou clique para selecionar um arquivo.</li>
<li><strong>Criptografia no cliente</strong> — A imagem é criptografada no seu navegador usando AES-256-GCM com chave derivada via HKDF-SHA-256.</li>
<li><strong>Compartilhe o link</strong> — Você recebe um link de uso único com a chave incorporada no fragmento da URL.</li>
<li><strong>Destinatário visualiza uma vez</strong> — O destinatário abre o link, a imagem é descriptografada no navegador e os dados são permanentemente excluídos.</li>
</ol>

<h2>Melhores práticas para compartilhar imagens sensíveis</h2>
<ul>
<li><strong>Use o menor tempo de expiração prático</strong> — Se o destinatário abrirá o link em uma hora, configure um TTL de 1 hora.</li>
<li><strong>Nunca use e-mail para digitalizações de documentos</strong> — Passaportes e documentos de identidade nunca deveriam estar no e-mail.</li>
<li><strong>Verifique o destinatário antes de compartilhar</strong> — Um link autodestrutivo é tão seguro quanto o canal que você usa para enviá-lo.</li>
<li><strong>Evite armazenamento na nuvem para compartilhamento temporário</strong> — Se o destinatário só precisa ver a imagem uma vez, um link persistente na nuvem é excessivo.</li>
<li><strong>Verifique requisitos de conformidade</strong> — Se você lida com imagens médicas (HIPAA), dados pessoais (LGPD/GDPR) ou registros financeiros, links criptografados autodestrutivos ajudam a cumprir requisitos de minimização de dados.</li>
</ul>

<h2>Conclusão</h2>
<p>Imagens carregam mais informações sensíveis do que a maioria das pessoas percebe. De exames médicos a documentos de identidade e fotos privadas, as consequências de um vazamento de imagem são frequentemente muito piores do que uma senha vazada. Métodos tradicionais — e-mail, apps de mensagens, links na nuvem — não foram projetados para compartilhamento seguro e único. Links criptografados e autodestrutivos fecham essa lacuna. Da próxima vez que precisar compartilhar uma imagem sensível, pule o anexo de e-mail e <a href="/">crie um link autodestrutivo</a>.</p>
`
  }
};
