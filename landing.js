const languages = {
  'zh-Hans': {
    name: '简体中文', dir: 'ltr', label: '语言',
    message: '指挥官，游戏项目组已未经授权将本工具嵌入到游戏中。目前该工具已失去意义，若您仍需使用，可以到我的战火勋章百科站点，该工具已集成到该站点。',
    link: '前往战火勋章百科工具页',
  },
  'zh-Hant': {
    name: '繁體中文', dir: 'ltr', label: '語言',
    message: '指揮官，遊戲專案組已未經授權將本工具嵌入遊戲中。目前本工具已失去意義，若您仍需使用，可以前往我的戰火勳章百科網站，該工具已整合至該網站。',
    link: '前往戰火勳章百科工具頁',
  },
  en: {
    name: 'English', dir: 'ltr', label: 'Language',
    message: 'Commander, the game team embedded this tool in the game without authorization. This tool has now lost its purpose. If you still need it, you can visit my Warpath encyclopedia site, where the tool is now available.',
    link: 'Visit the Warpath encyclopedia tools page',
  },
  ar: {
    name: 'العربية', dir: 'rtl', label: 'اللغة',
    message: 'أيها القائد، أدرج فريق اللعبة هذه الأداة داخل اللعبة دون إذن. لم تعد هذه الأداة ذات جدوى. إذا كنت لا تزال بحاجة إليها، يمكنك زيارة موسوعة Warpath الخاصة بي، حيث أصبحت الأداة متاحة الآن.',
    link: 'زيارة صفحة أدوات موسوعة Warpath',
  },
  fr: {
    name: 'Français', dir: 'ltr', label: 'Langue',
    message: 'Commandant, l’équipe du jeu a intégré cet outil au jeu sans autorisation. Il a désormais perdu son utilité. Si vous en avez encore besoin, rendez-vous sur mon encyclopédie Warpath, où il est maintenant disponible.',
    link: 'Voir les outils de l’encyclopédie Warpath',
  },
  de: {
    name: 'Deutsch', dir: 'ltr', label: 'Sprache',
    message: 'Kommandant, das Spielteam hat dieses Tool ohne Genehmigung ins Spiel eingebunden. Damit hat es seinen Zweck verloren. Falls du es weiterhin brauchst, findest du es jetzt in meiner Warpath-Enzyklopädie.',
    link: 'Zur Warpath-Enzyklopädie mit Tools',
  },
  id: {
    name: 'Bahasa Indonesia', dir: 'ltr', label: 'Bahasa',
    message: 'Komandan, tim game telah menyematkan alat ini ke dalam game tanpa izin. Kini alat ini tidak lagi berguna. Jika kamu masih membutuhkannya, kunjungi ensiklopedia Warpath saya; alat ini sekarang tersedia di sana.',
    link: 'Kunjungi halaman alat ensiklopedia Warpath',
  },
  it: {
    name: 'Italiano', dir: 'ltr', label: 'Lingua',
    message: 'Comandante, il team del gioco ha integrato questo strumento nel gioco senza autorizzazione. Ora ha perso la sua utilità. Se ti serve ancora, puoi visitare la mia enciclopedia di Warpath, dove lo strumento è disponibile.',
    link: 'Vai agli strumenti dell’enciclopedia Warpath',
  },
  ja: {
    name: '日本語', dir: 'ltr', label: '言語',
    message: '司令官、ゲーム運営チームは許可なくこのツールをゲーム内に組み込みました。このツールは役目を終えましたが、引き続き必要な場合は、ツールを掲載した私のWarpath百科サイトをご利用ください。',
    link: 'Warpath百科のツールページへ',
  },
  ko: {
    name: '한국어', dir: 'ltr', label: '언어',
    message: '지휘관님, 게임 프로젝트팀이 허가 없이 이 도구를 게임에 포함했습니다. 이제 이 도구는 목적을 잃었습니다. 계속 이용하려면 제 Warpath 백과 사이트를 방문해 주세요. 이 도구는 해당 사이트에 통합되어 있습니다.',
    link: 'Warpath 백과 도구 페이지로 이동',
  },
  ms: {
    name: 'Bahasa Melayu', dir: 'ltr', label: 'Bahasa',
    message: 'Komander, pasukan permainan telah memasukkan alat ini ke dalam permainan tanpa kebenaran. Alat ini kini tidak lagi berguna. Jika anda masih memerlukannya, kunjungi ensiklopedia Warpath saya; alat ini kini tersedia di sana.',
    link: 'Lawati halaman alat ensiklopedia Warpath',
  },
  pl: {
    name: 'Polski', dir: 'ltr', label: 'Język',
    message: 'Dowódco, zespół gry bez upoważnienia umieścił to narzędzie w grze. Straciło ono już swoje zastosowanie. Jeśli nadal go potrzebujesz, odwiedź moją encyklopedię Warpath, gdzie jest teraz dostępne.',
    link: 'Otwórz stronę narzędzi encyklopedii Warpath',
  },
  pt: {
    name: 'Português', dir: 'ltr', label: 'Idioma',
    message: 'Comandante, a equipe do jogo incorporou esta ferramenta ao jogo sem autorização. Ela perdeu sua finalidade. Se ainda precisar dela, visite minha enciclopédia de Warpath, onde a ferramenta está disponível.',
    link: 'Acessar as ferramentas da enciclopédia Warpath',
  },
  ru: {
    name: 'Русский', dir: 'ltr', label: 'Язык',
    message: 'Командир, команда игры без разрешения встроила этот инструмент в игру. Он утратил смысл. Если он вам всё ещё нужен, посетите мою энциклопедию Warpath, где теперь доступен этот инструмент.',
    link: 'Перейти к инструментам энциклопедии Warpath',
  },
  es: {
    name: 'Español', dir: 'ltr', label: 'Idioma',
    message: 'Comandante, el equipo del juego ha integrado esta herramienta en el juego sin autorización. Ya ha perdido su utilidad. Si aún la necesitas, visita mi enciclopedia de Warpath, donde ahora está disponible.',
    link: 'Visitar las herramientas de la enciclopedia Warpath',
  },
  th: {
    name: 'ไทย', dir: 'ltr', label: 'ภาษา',
    message: 'ผู้บัญชาการ ทีมพัฒนาเกมได้นำเครื่องมือนี้ไปใส่ไว้ในเกมโดยไม่ได้รับอนุญาต เครื่องมือนี้จึงหมดความหมายแล้ว หากคุณยังต้องการใช้ โปรดไปที่สารานุกรม Warpath ของฉัน ซึ่งได้รวมเครื่องมือนี้ไว้แล้ว',
    link: 'ไปยังหน้าเครื่องมือสารานุกรม Warpath',
  },
  tr: {
    name: 'Türkçe', dir: 'ltr', label: 'Dil',
    message: 'Komutan, oyun ekibi bu aracı izinsiz olarak oyuna ekledi. Artık araç amacını yitirdi. Hâlâ kullanmanız gerekiyorsa, aracın entegre edildiği Warpath ansiklopedi sitemi ziyaret edebilirsiniz.',
    link: 'Warpath ansiklopedi araçları sayfasına git',
  },
  vi: {
    name: 'Tiếng Việt', dir: 'ltr', label: 'Ngôn ngữ',
    message: 'Chỉ huy, nhóm phát triển trò chơi đã đưa công cụ này vào trò chơi mà chưa được phép. Công cụ hiện đã mất ý nghĩa. Nếu bạn vẫn cần sử dụng, hãy truy cập bách khoa toàn thư Warpath của tôi, nơi công cụ này đã được tích hợp.',
    link: 'Đến trang công cụ bách khoa Warpath',
  },
};

function normalizeLanguage(value) {
  if (typeof value !== 'string') return null;
  const subtags = value.toLowerCase().replaceAll('_', '-').split('-');
  const [base, ...extensions] = subtags;
  if (base === 'zh') {
    const script = extensions.find((subtag) => subtag === 'hans' || subtag === 'hant');
    if (script) return script === 'hant' ? 'zh-Hant' : 'zh-Hans';
    const region = extensions.find((subtag) => ['cn', 'sg', 'tw', 'hk', 'mo'].includes(subtag));
    if (region) return ['tw', 'hk', 'mo'].includes(region) ? 'zh-Hant' : 'zh-Hans';
    return 'zh-Hans';
  }
  return Object.hasOwn(languages, base) ? base : null;
}

function readStoredLanguage() {
  try {
    return normalizeLanguage(localStorage.getItem('warpath-language'));
  } catch {
    return null;
  }
}

function detectBrowserLanguage() {
  for (const preference of navigator.languages ?? [navigator.language]) {
    const language = normalizeLanguage(preference);
    if (language) return language;
  }
  return 'en';
}

const selector = document.querySelector('#language');
const pageMessage = document.querySelector('#notice-copy');
const wikiLink = document.querySelector('#wiki-link');
const languageLabel = document.querySelector('#language-label');

function applyLanguage(language) {
  const content = languages[language] ?? languages.en;
  document.documentElement.lang = language;
  document.documentElement.dir = content.dir;
  document.title = content.link;
  languageLabel.textContent = content.label;
  pageMessage.textContent = content.message;
  wikiLink.textContent = content.link;
  selector.value = language;
  try {
    localStorage.setItem('warpath-language', language);
  } catch {
    // 浏览器禁用本地存储时仍允许切换本页语言。
  }
}

selector.replaceChildren();
for (const [code, content] of Object.entries(languages)) {
  selector.add(new Option(content.name, code));
}
selector.addEventListener('change', () => applyLanguage(selector.value));
applyLanguage(readStoredLanguage() ?? detectBrowserLanguage());
