// 国际化文本与浏览器语言识别。
const zhCN = {
  title: '深度计算器', intro: '录入品阶，判断本次结果是否值得保留。', language: '语言', current: '当前品阶', result: '本次洗练结果',
  attribute: '词条 {n}', quality: '品', mode: '洗练方式', all: '三条一起洗练 · {cost} 张', lock: '锁定词条 {n} · {cost} 张',
  goal: '目标：三条均达到 {cap} 品', compare: '查看建议', reset: '重置', loading: '正在加载模型…', loadError: '数据加载失败，请刷新重试。', retry: '重试',
  equalNote: '默认三个词条等价；实际上根据玩家的兵卡配置，三个词条的价值并不完全相同。', modelNote: '暂定模型：结果独立抽取，配置索引视为当前品阶；不计保底与追赶效果。',
  version: '游戏版本 {game} · runtime {runtime}', method: '模型与使用说明', methodText: '建议比较整组结果到三条满品所需的期望剩余深度计算卡，不只比较总品阶。已支付的本次洗练费用不影响保留与放弃的比较。',
  lockedNote: '锁定模式只比较本次结果，后续期望耗卡按不锁策略计算。', unsupported: '该结果不在当前配置的概率表内，建议仅供参考；服务端选档或补偿规则尚未确认。',
  accept: '建议保留', discard: '建议放弃', indifferent: '保留或放弃均可', complete: '三个词条均已满品', completeText: '三个词条均已满品，无需继续洗练。',
  acceptText: '保留本次整组结果，预计后续耗卡更少。', discardText: '保留当前整组词条，预计后续耗卡更少。', indifferentText: '两组结果的期望剩余耗卡相同。',
  currentValue: '放弃后的期望剩余卡数', nextValue: '保留后的期望剩余卡数', savings: '保留预计节省 {value} 张', loss: '保留预计多花 {value} 张', unit: '张',
  apply: '将结果设为当前', nextRoll: '录入下一次结果', invalid: '请输入 0–{cap} 的整数品阶。', lockedError: '锁定词条的品阶必须保持不变。', pending: '请录入本次三个词条的结果',
  author: 'Warpath 钥钥 国际服 uid：35600096', bilibili: '哔哩哔哩主页', footer: '玩家制作的计算工具，与游戏官方无关联。', edited: '录入已更新，请重新查看建议。',
  chipNote: '深度计算卡：不锁 {ordinary} 张／锁一条 {locked} 张。', qualityLabel: '{section} · 词条 {n}', unofficial: '期望值不是保底或耗卡承诺。', dataLink: '查看模型数据', awaitResult: '等待洗练结果。'
};

// 非中文界面采用自然表达，保留产品专名与占位符。
const translations = {
  en: ['Deep Refinement Calculator','Enter quality levels to see whether to keep this result.','Language','Current quality','New result','Attribute {n}','quality','Refinement mode','Refine all three · {cost} cards','Lock attribute {n} · {cost} cards','Goal: all three reach quality {cap}','See recommendation','Reset','Loading model…','Could not load data. Refresh and try again.','Retry','The three attributes are treated as equal by default; their actual value depends on your unit-card setup.','Provisional model: outcomes are drawn independently and the configuration index is treated as current quality; pity and catch-up effects are excluded.','Game version {game} · runtime {runtime}','Model and instructions','Compare the expected remaining Refinement Calculator cards needed for the whole set to reach max quality, rather than comparing total quality alone. The cost already paid for this refinement does not affect the keep-or-discard decision.','Lock mode compares this result only; future expected card use is calculated with the unlocked strategy.','This result is outside the probability table in the current configuration. Treat the recommendation as a guide; server tier selection and compensation rules are unconfirmed.','Keep recommended','Discard recommended','Either choice is equivalent','Goal reached','All three attributes are at max quality. No more refinement is needed.','Keep this complete set; it is expected to use fewer cards later.','Keep the current complete set; it is expected to use fewer cards later.','Both sets have the same expected cards remaining.','Expected cards remaining after discarding','Expected cards remaining after keeping','Keeping is expected to save {value} cards','Keeping is expected to cost {value} more cards','cards','Set result as current','Enter next result','Enter an integer quality from 0 to {cap}.','A locked attribute must keep the same quality.','Enter the three attribute results for this refinement','Warpath KeyKey · Global UID: 35600096','Bilibili profile','A fan-made calculator, not affiliated with the game publisher.','Inputs updated. Review the recommendation again.','Refinement cards: {ordinary} unlocked / {locked} with one locked.','{section} · Attribute {n}','Expected values are not a pity guarantee or a promise of card use.','View model data','Waiting for refinement result.'],
  fr: ['Calculateur de raffinement','Saisissez les qualités pour savoir s’il faut garder ce résultat.','Langue','Qualité actuelle','Nouveau résultat','Attribut {n}','qualité','Mode de raffinement','Raffiner les trois · {cost} cartes','Verrouiller l’attribut {n} · {cost} cartes','Objectif : les trois à la qualité {cap}','Voir la recommandation','Réinitialiser','Chargement du modèle…','Échec du chargement. Actualisez et réessayez.','Réessayer','Les trois attributs sont supposés équivalents ; leur valeur réelle dépend de votre configuration.','Modèle provisoire : tirages indépendants, indice de configuration utilisé comme qualité actuelle ; sans garantie ni rattrapage.','Version du jeu {game} · runtime {runtime}','Modèle et mode d’emploi','Comparez le nombre espéré de cartes restantes pour amener l’ensemble à la qualité maximale, pas seulement la qualité totale. Le coût déjà payé ne change pas la décision.','Le mode verrouillé compare uniquement ce résultat ; la dépense future est calculée sans verrou.','Ce résultat ne figure pas dans la table de probabilités actuelle. Conseil indicatif ; les règles serveur restent à confirmer.','Conserver conseillé','Abandonner conseillé','Choix équivalents','Objectif atteint','Les trois attributs sont au maximum. Raffinement terminé.','Conserver cet ensemble devrait réduire les dépenses futures.','Conserver l’ensemble actuel devrait réduire les dépenses futures.','Les deux ensembles ont le même coût restant espéré.','Cartes restantes espérées après abandon','Cartes restantes espérées après conservation','Conserver devrait économiser {value} cartes','Conserver devrait coûter {value} cartes de plus','cartes','Définir comme résultat actuel','Saisir le prochain résultat','Saisissez une qualité entière de 0 à {cap}.','Un attribut verrouillé doit garder la même qualité.','Saisissez les trois résultats de ce raffinement','Warpath 钥钥 · UID mondial : 35600096','Profil Bilibili','Calculateur créé par des joueurs, sans lien avec l’éditeur.','Saisie mise à jour. Consultez de nouveau le conseil.','Cartes de raffinement : {ordinary} sans verrou / {locked} avec un verrou.','{section} · Attribut {n}','Une valeur espérée n’est ni une garantie ni une promesse de dépense.','Voir les données du modèle','En attente du résultat.'],
  de: ['Tiefenrechner','Gib Qualitätsstufen ein, um zu prüfen, ob du dieses Ergebnis behalten solltest.','Sprache','Aktuelle Qualität','Neues Ergebnis','Attribut {n}','Qualität','Verfeinerungsmodus','Alle drei verfeinern · {cost} Karten','Attribut {n} sperren · {cost} Karten','Ziel: alle drei erreichen Qualität {cap}','Empfehlung ansehen','Zurücksetzen','Modell wird geladen…','Daten konnten nicht geladen werden. Bitte neu laden.','Erneut versuchen','Standardmäßig gelten alle drei Attribute als gleichwertig; tatsächlich hängt ihr Wert von deiner Konfiguration ab.','Vorläufiges Modell: unabhängige Ergebnisse, Konfigurationsindex als aktuelle Qualität; ohne Mitleids- oder Aufholeffekt.','Spielversion {game} · Laufzeit {runtime}','Modell und Anleitung','Vergleiche die erwarteten verbleibenden Karten bis alle Attribute die Höchstqualität erreichen, nicht nur die Gesamtqualität. Bereits bezahlte Kosten beeinflussen die Entscheidung nicht.','Im Sperrmodus wird nur dieses Ergebnis verglichen; zukünftige Kosten werden ohne Sperre berechnet.','Dieses Ergebnis ist nicht in der aktuellen Wahrscheinlichkeitstabelle enthalten. Empfehlung nur als Richtwert; Serverregeln sind unbestätigt.','Behalten empfohlen','Ablehnen empfohlen','Beide Optionen gleichwertig','Ziel erreicht','Alle drei Attribute haben die Höchstqualität. Keine weitere Verfeinerung nötig.','Dieses Set zu behalten sollte künftig weniger Karten kosten.','Das aktuelle Set zu behalten sollte künftig weniger Karten kosten.','Beide Sets haben dieselben erwarteten Restkosten.','Erwartete Restkarten nach Ablehnen','Erwartete Restkarten nach Behalten','Behalten spart voraussichtlich {value} Karten','Behalten kostet voraussichtlich {value} Karten mehr','Karten','Als aktuell festlegen','Nächstes Ergebnis eingeben','Gib eine ganze Qualitätsstufe von 0 bis {cap} ein.','Ein gesperrtes Attribut muss dieselbe Qualität behalten.','Gib die drei Ergebnisse dieser Verfeinerung ein','Warpath 钥钥 · Global-UID: 35600096','Bilibili-Profil','Spielerprojekt, nicht mit dem Spielehersteller verbunden.','Eingabe aktualisiert. Empfehlung erneut ansehen.','Verfeinerungskarten: {ordinary} ohne Sperre / {locked} mit einer Sperre.','{section} · Attribut {n}','Erwartungswerte sind keine Garantie und kein Kostenversprechen.','Modelldaten ansehen','Warte auf Verfeinerungsergebnis.'],
  ja: ['深度計算機','品質を入力して、今回の結果を残すべきか確認します。','言語','現在の品質','今回の結果','属性 {n}','品質','洗練方法','3つをまとめて洗練 · {cost} 枚','属性 {n} をロック · {cost} 枚','目標：3つすべて品質 {cap}','推奨を見る','リセット','モデルを読み込み中…','データを読み込めません。更新して再試行してください。','再試行','初期設定では3属性を同等としますが、実際の価値は兵カードの編成によって異なります。','暫定モデル：結果は独立抽選、設定インデックスを現在品質として扱います。天井と追い上げ効果は含みません。','ゲームバージョン {game} · runtime {runtime}','モデルと使い方','合計品質だけでなく、3属性すべてを最高品質にするまでの期待残りカード数を比較してください。今回支払った費用は判断に影響しません。','ロックモードでは今回の結果のみ比較し、以後の期待消費はロックなしで計算します。','現在の確率表にない結果です。推奨は参考値です。サーバー側の選択・補償ルールは未確認です。','保持を推奨','破棄を推奨','どちらも同等','目標達成','3属性すべて最高品質です。洗練は不要です。','今回の一式を保持すると、今後の消費が少なくなる見込みです。','現在の一式を保持すると、今後の消費が少なくなる見込みです。','両方の期待残り消費は同じです。','破棄後の期待残りカード数','保持後の期待残りカード数','保持すると {value} 枚節約の見込み','保持すると {value} 枚多く必要な見込み','枚','現在の結果に設定','次の結果を入力','品質は 0～{cap} の整数で入力してください。','ロックした属性の品質は変えられません。','今回の3属性の結果を入力してください','Warpath 钥钥 · グローバル UID：35600096','Bilibili プロフィール','プレイヤー制作の計算ツールです。公式とは無関係です。','入力を更新しました。推奨を再確認してください。','深度計算カード：ロックなし {ordinary} 枚／1つロック {locked} 枚。','{section} · 属性 {n}','期待値は天井や消費カード数を保証するものではありません。','モデルデータを見る','洗練結果を待機中。'],
  es: ['Calculadora de refinamiento','Introduce las calidades para saber si conviene conservar este resultado.','Idioma','Calidad actual','Nuevo resultado','Atributo {n}','calidad','Modo de refinamiento','Refinar los tres · {cost} tarjetas','Bloquear atributo {n} · {cost} tarjetas','Objetivo: los tres en calidad {cap}','Ver recomendación','Restablecer','Cargando modelo…','No se pudieron cargar los datos. Actualiza e inténtalo de nuevo.','Reintentar','Por defecto los tres atributos valen lo mismo; su valor real depende de la configuración de tus unidades.','Modelo provisional: resultados independientes e índice de configuración como calidad actual; sin garantía ni recuperación.','Versión del juego {game} · runtime {runtime}','Modelo e instrucciones','Compara las tarjetas restantes esperadas para llevar todo el conjunto a calidad máxima, no solo la calidad total. El coste ya pagado no influye en la decisión.','El modo con bloqueo compara solo este resultado; el gasto futuro se calcula sin bloqueo.','Este resultado no está en la tabla de probabilidades actual. La recomendación es orientativa; las reglas del servidor no están confirmadas.','Se recomienda conservar','Se recomienda descartar','Ambas opciones son equivalentes','Objetivo alcanzado','Los tres atributos están al máximo. No hace falta seguir refinando.','Conservar este conjunto debería reducir el gasto futuro.','Conservar el conjunto actual debería reducir el gasto futuro.','Ambos conjuntos tienen el mismo gasto restante esperado.','Tarjetas restantes esperadas al descartar','Tarjetas restantes esperadas al conservar','Conservar ahorraría {value} tarjetas','Conservar costaría {value} tarjetas más','tarjetas','Establecer como actual','Introducir siguiente resultado','Introduce una calidad entera de 0 a {cap}.','Un atributo bloqueado debe mantener su calidad.','Introduce los tres resultados de este refinamiento','Warpath 钥钥 · UID global: 35600096','Perfil de Bilibili','Calculadora creada por jugadores, sin relación con la empresa del juego.','Datos actualizados. Vuelve a consultar la recomendación.','Tarjetas de refinamiento: {ordinary} sin bloqueo / {locked} con uno bloqueado.','{section} · Atributo {n}','Los valores esperados no son garantía de resultados ni de consumo.','Ver datos del modelo','Esperando el resultado del refinamiento.'],
};

const english = translations.en;
const keys = Object.keys(zhCN);
function fromList(list) { return Object.fromEntries(keys.map((key, i) => [key, list[i]])); }

// 其他语言保留独立、完整的本地化词典，避免缺键时静默回退英语。
const localized = {
  ar: ['حاسبة التنقية','أدخل الجودة لمعرفة ما إذا كان ينبغي الاحتفاظ بهذه النتيجة.','اللغة','الجودة الحالية','النتيجة الجديدة','السمة {n}','جودة','طريقة التنقية','نقِّ الثلاثة · {cost} بطاقة','اقفل السمة {n} · {cost} بطاقة','الهدف: وصول الثلاثة إلى الجودة {cap}','عرض التوصية','إعادة ضبط','جارٍ تحميل النموذج…','تعذر تحميل البيانات. حدّث الصفحة وحاول مجددًا.','إعادة المحاولة','تُعامل السمات الثلاث بالتساوي افتراضيًا؛ وتعتمد قيمتها الفعلية على إعداد بطاقات وحداتك.','نموذج مؤقت: السحوبات مستقلة ويُعد فهرس الإعداد هو الجودة الحالية؛ لا يشمل الضمان أو التعويض.','إصدار اللعبة {game} · runtime {runtime}','النموذج والتعليمات','قارن البطاقات المتبقية المتوقعة لإيصال المجموعة كاملة إلى أقصى جودة، لا مجموع الجودة فقط. تكلفة التنقية المدفوعة لا تؤثر في القرار.','يقارن وضع القفل هذه النتيجة فقط؛ ويُحسب الاستهلاك المستقبلي دون قفل.','هذه النتيجة غير موجودة في جدول الاحتمالات الحالي. التوصية إرشادية وقواعد الخادم غير مؤكدة.','يوصى بالاحتفاظ','يوصى بالتخلي','الخياران متكافئان','تم بلوغ الهدف','وصلت السمات الثلاث إلى أقصى جودة. لا حاجة لمزيد من التنقية.','الاحتفاظ بهذه المجموعة يقلل الاستهلاك المتوقع لاحقًا.','الاحتفاظ بالمجموعة الحالية يقلل الاستهلاك المتوقع لاحقًا.','للمجموعتين الاستهلاك المتبقي المتوقع نفسه.','البطاقات المتبقية المتوقعة بعد التخلي','البطاقات المتبقية المتوقعة بعد الاحتفاظ','يوفر الاحتفاظ {value} بطاقة','يكلف الاحتفاظ {value} بطاقة إضافية','بطاقات','اعتماد النتيجة الحالية','إدخال النتيجة التالية','أدخل جودة صحيحة من 0 إلى {cap}.','يجب أن تبقى جودة السمة المقفلة كما هي.','أدخل نتائج السمات الثلاث لهذه التنقية','Warpath 钥钥 · المعرّف العالمي: 35600096','صفحة Bilibili','حاسبة صنعها لاعبون وغير مرتبطة بناشر اللعبة.','تم تحديث الإدخال. راجع التوصية مجددًا.','بطاقات التنقية: {ordinary} دون قفل / {locked} مع قفل واحد.','{section} · السمة {n}','القيمة المتوقعة ليست ضمانًا أو وعدًا باستهلاك البطاقات.','عرض بيانات النموذج','بانتظار نتيجة التنقية.'],
  pt: ['Calculadora de refinamento','Insira as qualidades para saber se vale a pena manter este resultado.','Idioma','Qualidade atual','Novo resultado','Atributo {n}','qualidade','Modo de refinamento','Refinar os três · {cost} cartas','Bloquear atributo {n} · {cost} cartas','Objetivo: os três chegarem à qualidade {cap}','Ver recomendação','Redefinir','Carregando modelo…','Falha ao carregar os dados. Atualize e tente novamente.','Tentar novamente','Por padrão, os três atributos têm o mesmo valor; na prática, isso depende da configuração das suas unidades.','Modelo provisório: resultados independentes e índice da configuração como qualidade atual; sem garantia ou recuperação.','Versão do jogo {game} · runtime {runtime}','Modelo e instruções','Compare as cartas restantes esperadas para levar o conjunto à qualidade máxima, não apenas a qualidade total. O custo já pago não afeta a decisão.','O modo de bloqueio compara somente este resultado; o gasto futuro é calculado sem bloqueio.','Este resultado não consta na tabela de probabilidades atual. A recomendação é apenas indicativa; as regras do servidor não foram confirmadas.','Recomendado manter','Recomendado descartar','As opções são equivalentes','Objetivo alcançado','Os três atributos estão no máximo. Não é preciso continuar refinando.','Manter este conjunto deve reduzir o gasto futuro.','Manter o conjunto atual deve reduzir o gasto futuro.','Os dois conjuntos têm o mesmo gasto restante esperado.','Cartas restantes esperadas após descartar','Cartas restantes esperadas após manter','Manter deve economizar {value} cartas','Manter deve custar mais {value} cartas','cartas','Definir como atual','Inserir próximo resultado','Insira uma qualidade inteira de 0 a {cap}.','Um atributo bloqueado deve manter a mesma qualidade.','Insira os resultados dos três atributos deste refinamento','Warpath 钥钥 · UID global: 35600096','Perfil no Bilibili','Calculadora feita por jogadores, sem vínculo com a empresa do jogo.','Entrada atualizada. Consulte a recomendação novamente.','Cartas de refinamento: {ordinary} sem bloqueio / {locked} com um bloqueio.','{section} · Atributo {n}','Valores esperados não garantem resultados nem consumo de cartas.','Ver dados do modelo','Aguardando resultado do refinamento.'],
};

// 其余语言在各自词典中使用对应语种的常用界面译文。
const fills = {
  id: ['Kalkulator Refinement','Masukkan kualitas untuk mengetahui apakah hasil ini layak disimpan.','Bahasa','Kualitas saat ini','Hasil baru','Atribut {n}','kualitas','Mode refinement','Refine ketiganya · {cost} kartu','Kunci atribut {n} · {cost} kartu','Target: ketiganya mencapai kualitas {cap}','Lihat rekomendasi','Atur ulang','Memuat model…','Data gagal dimuat. Muat ulang dan coba lagi.','Coba lagi'],
  it: ['Calcolatore di raffinamento','Inserisci i livelli per sapere se conservare questo risultato.','Lingua','Qualità attuale','Nuovo risultato','Attributo {n}','qualità','Modalità di raffinamento','Raffina tutti e tre · {cost} carte','Blocca attributo {n} · {cost} carte','Obiettivo: tutti e tre a qualità {cap}','Vedi consiglio','Reimposta','Caricamento modello…','Caricamento dati non riuscito. Aggiorna e riprova.','Riprova'],
  ko: ['심층 계산기','등급을 입력해 이번 결과를 유지할지 확인하세요.','언어','현재 등급','이번 결과','속성 {n}','등급','세공 방식','세 항목 함께 세공 · 카드 {cost}장','속성 {n} 잠금 · 카드 {cost}장','목표: 세 항목 모두 {cap}등급','추천 보기','초기화','모델을 불러오는 중…','데이터를 불러오지 못했습니다. 새로고침 후 다시 시도하세요.','다시 시도'],
  ms: ['Kalkulator Penalaan','Masukkan kualiti untuk mengetahui sama ada hasil ini wajar disimpan.','Bahasa','Kualiti semasa','Hasil baharu','Atribut {n}','kualiti','Mod penalaan','Tala ketiga-tiganya · {cost} kad','Kunci atribut {n} · {cost} kad','Sasaran: ketiga-tiganya mencapai kualiti {cap}','Lihat cadangan','Tetapkan semula','Memuatkan model…','Data gagal dimuatkan. Muat semula dan cuba lagi.','Cuba lagi'],
  pl: ['Kalkulator ulepszania','Wpisz jakość, aby sprawdzić, czy warto zachować ten wynik.','Język','Bieżąca jakość','Nowy wynik','Atrybut {n}','jakość','Tryb ulepszania','Ulepsz wszystkie trzy · {cost} kart','Zablokuj atrybut {n} · {cost} kart','Cel: wszystkie trzy osiągają jakość {cap}','Zobacz zalecenie','Resetuj','Wczytywanie modelu…','Nie udało się wczytać danych. Odśwież i spróbuj ponownie.','Ponów próbę'],
  ru: ['Калькулятор улучшения','Введите качество, чтобы узнать, стоит ли оставить этот результат.','Язык','Текущее качество','Новый результат','Атрибут {n}','качество','Режим улучшения','Улучшить все три · карт: {cost}','Закрепить атрибут {n} · карт: {cost}','Цель: все три качества — {cap}','Показать рекомендацию','Сбросить','Загрузка модели…','Не удалось загрузить данные. Обновите страницу и повторите попытку.','Повторить'],
  th: ['เครื่องคำนวณการปรับแต่ง','กรอกระดับคุณภาพเพื่อดูว่าควรเก็บผลลัพธ์นี้หรือไม่','ภาษา','ระดับปัจจุบัน','ผลลัพธ์ใหม่','คุณสมบัติ {n}','ระดับคุณภาพ','โหมดปรับแต่ง','ปรับแต่งทั้งสาม · {cost} ใบ','ล็อกคุณสมบัติ {n} · {cost} ใบ','เป้าหมาย: ทั้งสามถึงระดับ {cap}','ดูคำแนะนำ','รีเซ็ต','กำลังโหลดโมเดล…','โหลดข้อมูลไม่สำเร็จ รีเฟรชแล้วลองอีกครั้ง','ลองอีกครั้ง'],
  tr: ['Derinlik Hesaplayıcı','Bu sonucu saklamaya değip değmediğini görmek için kalite girin.','Dil','Mevcut kalite','Yeni sonuç','Özellik {n}','kalite','İyileştirme modu','Üçünü birlikte iyileştir · {cost} kart','Özellik {n} kilitle · {cost} kart','Hedef: üçünün de kalitesi {cap}','Öneriyi gör','Sıfırla','Model yükleniyor…','Veriler yüklenemedi. Yenileyip tekrar deneyin.','Tekrar dene'],
  vi: ['Máy tính tinh luyện','Nhập phẩm cấp để xem có nên giữ kết quả này không.','Ngôn ngữ','Phẩm cấp hiện tại','Kết quả mới','Thuộc tính {n}','phẩm','Chế độ tinh luyện','Tinh luyện cả ba · {cost} thẻ','Khóa thuộc tính {n} · {cost} thẻ','Mục tiêu: cả ba đạt phẩm {cap}','Xem đề xuất','Đặt lại','Đang tải mô hình…','Không tải được dữ liệu. Hãy làm mới rồi thử lại.','Thử lại']
};
const continuation = {
  "id": [
    "Ketiga atribut dianggap setara secara default; nilai sebenarnya bergantung pada susunan kartu unit Anda.",
    "Model sementara: hasil diundi secara independen dan indeks konfigurasi dianggap sebagai kualitas saat ini; tanpa jaminan atau efek kejar.",
    "Versi game {game} · runtime {runtime}",
    "Model dan petunjuk",
    "Bandingkan perkiraan sisa kartu untuk membawa seluruh set ke kualitas maksimum, bukan hanya jumlah kualitas. Biaya yang sudah dibayar tidak memengaruhi keputusan.",
    "Mode kunci hanya membandingkan hasil ini; biaya mendatang dihitung tanpa kunci.",
    "Hasil ini tidak ada di tabel probabilitas konfigurasi saat ini. Rekomendasi hanya panduan; aturan server belum dipastikan.",
    "Disarankan simpan",
    "Disarankan buang",
    "Keduanya setara",
    "Target tercapai",
    "Ketiga atribut sudah maksimum. Tidak perlu refinement lagi.",
    "Menyimpan set ini diperkirakan mengurangi biaya berikutnya.",
    "Menyimpan set saat ini diperkirakan mengurangi biaya berikutnya.",
    "Kedua set memiliki sisa biaya ekspektasian yang sama.",
    "Perkiraan sisa kartu setelah membuang",
    "Perkiraan sisa kartu setelah menyimpan",
    "Simpan menghemat sekitar {value} kartu",
    "Simpan memerlukan {value} kartu tambahan",
    "kartu",
    "Jadikan hasil saat ini",
    "Masukkan hasil berikutnya",
    "Masukkan kualitas bilangan bulat 0–{cap}.",
    "Kualitas atribut terkunci harus tetap sama.",
    "Masukkan hasil ketiga atribut untuk refinement ini",
    "Warpath 钥钥 · UID Global: 35600096",
    "Profil Bilibili",
    "Kalkulator buatan pemain, tidak berafiliasi dengan penerbit game.",
    "Input diperbarui. Tinjau rekomendasi lagi.",
    "Kartu refinement: {ordinary} tanpa kunci / {locked} dengan satu kunci.",
    "{section} · Atribut {n}",
    "Nilai ekspektasian bukan jaminan pity atau penggunaan kartu.",
    "Lihat data model",
    "Menunggu hasil refinement."
  ],
  "it": [
    "I tre attributi sono considerati equivalenti per impostazione predefinita; il valore reale dipende dalla configurazione delle unità.",
    "Modello provvisorio: risultati indipendenti e indice della configurazione come qualità attuale; senza garanzia o recupero.",
    "Versione gioco {game} · runtime {runtime}",
    "Modello e istruzioni",
    "Confronta le carte residue attese per portare l’intero set alla qualità massima, non solo la qualità totale. Il costo già pagato non influisce sulla scelta.",
    "La modalità blocco confronta solo questo risultato; i costi futuri sono calcolati senza blocchi.",
    "Risultato assente dalla tabella delle probabilità corrente. Consiglio indicativo; regole del server non confermate.",
    "Si consiglia di tenere",
    "Si consiglia di scartare",
    "Scelte equivalenti",
    "Obiettivo raggiunto",
    "Tutti e tre gli attributi sono al massimo. Non serve altro raffinamento.",
    "Tenere questo set dovrebbe ridurre i costi futuri.",
    "Tenere il set attuale dovrebbe ridurre i costi futuri.",
    "Entrambi i set hanno lo stesso costo residuo atteso.",
    "Carte residue attese dopo lo scarto",
    "Carte residue attese dopo aver tenuto",
    "Tenere fa risparmiare circa {value} carte",
    "Tenere costa circa {value} carte in più",
    "carte",
    "Imposta come attuale",
    "Inserisci prossimo risultato",
    "Inserisci una qualità intera da 0 a {cap}.",
    "Un attributo bloccato deve mantenere la stessa qualità.",
    "Inserisci i tre risultati di questo raffinamento",
    "Warpath 钥钥 · UID globale: 35600096",
    "Profilo Bilibili",
    "Calcolatore creato dai giocatori, non affiliato al publisher del gioco.",
    "Dati aggiornati. Controlla di nuovo il consiglio.",
    "Carte di raffinamento: {ordinary} senza blocchi / {locked} con un blocco.",
    "{section} · Attributo {n}",
    "I valori attesi non garantiscono risultati o consumo di carte.",
    "Vedi dati modello",
    "In attesa del risultato."
  ],
  "ko": [
    "세 가지 속성은 기본적으로 동일한 것으로 간주됩니다. 실제 값은 유닛 카드 설정에 따라 다릅니다.",
    "임시 모델: 결과는 독립적으로 도출되고 구성 지수는 현재 품질로 처리됩니다. 동정 효과와 따라잡기 효과는 제외됩니다.",
    "게임 버전 {game} · 런타임 {runtime}",
    "모델 및 지침",
    "전체 품질만 비교하는 것이 아니라 전체 세트가 최대 품질에 도달하는 데 필요한 예상 잔여 개선 계산기 카드를 비교하십시오. 이 개선을 위해 이미 지불한 비용은 유지 또는 폐기 결정에 영향을 미치지 않습니다.",
    "잠금 모드는 이 결과만 비교합니다. 향후 예상되는 카드 사용은 잠금 해제된 전략으로 계산됩니다.",
    "이 결과는 현재 구성의 확률표 외부에 있습니다. 권장 사항을 가이드로 삼으십시오. 서버 티어 선정 및 보상 규정은 미확인입니다.",
    "계속 추천",
    "폐기 권장",
    "어느 선택이든 동일합니다.",
    "목표 달성",
    "세 가지 속성 모두 최대 품질입니다. 더 이상 개선이 필요하지 않습니다.",
    "이 완전한 세트를 보관하십시오. 나중에는 더 적은 수의 카드를 사용할 것으로 예상됩니다.",
    "현재 완전한 세트를 유지하십시오. 나중에는 더 적은 수의 카드를 사용할 것으로 예상됩니다.",
    "두 세트 모두 동일한 예상 카드가 남아 있습니다.",
    "폐기 후 남은 예상 카드",
    "보관 후 남은 예상 카드",
    "보관하면 {value} 카드가 절약될 것으로 예상됩니다.",
    "유지하면 {value} 더 많은 카드 비용이 소요될 것으로 예상됩니다.",
    "카드",
    "결과를 현재로 설정",
    "다음 결과 입력",
    "0부터 {cap}까지의 정수 품질을 입력하세요.",
    "잠긴 속성은 동일한 품질을 유지해야 합니다.",
    "이 상세검색에 대한 세 가지 속성 결과를 입력하세요.",
    "Warpath KeyKey · 글로벌 UID: 35600096",
    "빌리빌리 프로필",
    "게임 퍼블리셔와 관련이 없는 팬이 만든 계산기입니다.",
    "입력이 업데이트되었습니다. 권장사항을 다시 검토하세요.",
    "개선 카드: {ordinary} 잠금 해제/{locked}(1개 잠김).",
    "{section} · 속성 {n}",
    "기대값은 유감스러운 보증이나 카드 사용에 대한 약속이 아닙니다.",
    "모델 데이터 보기",
    "개선 결과를 기다리고 있습니다."
  ],
  "ms": [
    "Ketiga-tiga atribut dianggap sama secara lalai; nilai sebenar mereka bergantung pada persediaan kad unit anda.",
    "Model sementara: hasil dilukis secara bebas dan indeks konfigurasi dianggap sebagai kualiti semasa; kasihan dan kesan tangkapan dikecualikan.",
    "Versi permainan {game} · masa jalan {runtime}",
    "Model dan arahan",
    "Bandingkan baki kad Kalkulator Penapisan yang dijangkakan yang diperlukan untuk keseluruhan set mencapai kualiti maksimum, dan bukannya membandingkan jumlah kualiti sahaja. Kos yang telah dibayar untuk pemurnian ini tidak menjejaskan keputusan simpan-atau-buang.",
    "Mod kunci membandingkan hasil ini sahaja; penggunaan kad yang dijangkakan pada masa hadapan dikira dengan strategi yang tidak dikunci.",
    "Keputusan ini berada di luar jadual kebarangkalian dalam konfigurasi semasa. Anggap cadangan sebagai panduan; pemilihan peringkat pelayan dan peraturan pampasan tidak disahkan.",
    "Simpan disyorkan",
    "Buang disyorkan",
    "Mana-mana pilihan adalah setara",
    "Matlamat tercapai",
    "Ketiga-tiga atribut berada pada kualiti maksimum. Tiada pemurnian lagi diperlukan.",
    "Simpan set lengkap ini; ia dijangka menggunakan lebih sedikit kad kemudian.",
    "Simpan set lengkap semasa; ia dijangka menggunakan lebih sedikit kad kemudian.",
    "Kedua-dua set mempunyai baki kad jangkaan yang sama.",
    "Kad dijangka tinggal selepas dibuang",
    "Jangkaan kad kekal selepas disimpan",
    "Penyimpanan dijangka dapat menjimatkan kad {value}",
    "Penyimpanan dijangka akan menelan kos {value} lebih banyak kad",
    "kad",
    "Tetapkan hasil sebagai semasa",
    "Masukkan hasil seterusnya",
    "Masukkan kualiti integer dari 0 hingga {cap}.",
    "Atribut yang dikunci mesti mengekalkan kualiti yang sama.",
    "Masukkan tiga hasil atribut untuk pemurnian ini",
    "Warpath KeyKey · Global UID: 35600096",
    "Profil Bilibili",
    "Kalkulator buatan peminat, tidak bergabung dengan penerbit permainan.",
    "Input dikemas kini. Semak semula pengesyoran itu.",
    "Kad penghalusan: {ordinary} tidak berkunci / {locked} dengan satu terkunci.",
    "{section} · Atribut {n}",
    "Nilai yang dijangkakan bukanlah jaminan kasihan atau janji penggunaan kad.",
    "Lihat data model",
    "Menunggu hasil pemurnian."
  ],
  "pl": [
    "Domyślnie te trzy atrybuty są traktowane jako równe; ich rzeczywista wartość zależy od konfiguracji karty jednostek.",
    "Model tymczasowy: wyniki są losowane niezależnie, a wskaźnik konfiguracji traktowany jest jako bieżąca jakość; wykluczone są efekty litości i nadrabiania zaległości.",
    "Wersja gry {game} · środowisko uruchomieniowe {runtime}",
    "Model i instrukcja",
    "Porównaj oczekiwane pozostałe karty Kalkulatora udoskonalenia potrzebne dla całego zestawu, aby osiągnąć maksymalną jakość, zamiast porównywać samą jakość całkowitą. Koszt już poniesiony za to udoskonalenie nie ma wpływu na decyzję o zatrzymaniu lub odrzuceniu.",
    "Tryb blokady porównuje tylko ten wynik; Przyszłe oczekiwane użycie karty jest obliczane na podstawie odblokowanej strategii.",
    "Wynik ten jest poza tabelą prawdopodobieństwa w bieżącej konfiguracji. Potraktuj zalecenie jako wskazówkę; zasady wyboru poziomu serwera i zasady wynagrodzeń są niepotwierdzone.",
    "Zachowaj zalecane",
    "Zalecane odrzucenie",
    "Każdy wybór jest równoważny",
    "Cel osiągnięty",
    "Wszystkie trzy atrybuty mają maksymalną jakość. Nie potrzeba więcej udoskonaleń.",
    "Zachowaj ten kompletny zestaw; oczekuje się, że później użyje mniejszej liczby kart.",
    "Zachowaj bieżący kompletny zestaw; oczekuje się, że później użyje mniejszej liczby kart.",
    "W obu zestawach pozostały te same oczekiwane karty.",
    "Oczekiwane karty pozostałe po odrzuceniu",
    "Oczekiwane karty pozostałe po zatrzymaniu",
    "Oczekuje się, że przechowywanie pozwoli zaoszczędzić karty {value}",
    "Oczekuje się, że utrzymanie będzie kosztować {value} więcej kart",
    "karty",
    "Ustaw wynik jako bieżący",
    "Wprowadź następny wynik",
    "Wprowadź jakość całkowitą od 0 do {cap}.",
    "Zablokowany atrybut musi zachować tę samą jakość.",
    "Wprowadź trzy wyniki atrybutów dla tego zawężenia",
    "Klucz klucza Warpath · Globalny UID: 35600096",
    "Profil Bilibili",
    "Kalkulator stworzony przez fanów, niezwiązany z wydawcą gry.",
    "Dane wejściowe zaktualizowane. Przejrzyj ponownie zalecenie.",
    "Karty udoskonaleń: {ordinary} odblokowane / {locked} z jedną zablokowaną.",
    "{sekcja} · Atrybut {n}",
    "Oczekiwane wartości nie są gwarancją litości ani obietnicą użycia karty.",
    "Wyświetl dane modelu",
    "Czekam na wynik udoskonalenia."
  ],
  "ru": [
    "По умолчанию эти три атрибута считаются равными; их фактическое значение зависит от настроек вашей карты объекта.",
    "Предварительная модель: результаты рассчитываются независимо, а индекс конфигурации рассматривается как текущее качество; Эффекты жалости и догонялки исключены.",
    "Версия игры {game} · среда выполнения {runtime}",
    "Модель и инструкция",
    "Сравните ожидаемое количество оставшихся карточек усовершенствования, необходимых для достижения максимального качества всего набора, а не сравнивайте только общее качество. Стоимость, уже уплаченная за это уточнение, не влияет на решение оставить или выбросить.",
    "Режим блокировки сравнивает только этот результат; ожидаемое использование карты в будущем рассчитывается с использованием разблокированной стратегии.",
    "Этот результат находится за пределами таблицы вероятностей в текущей конфигурации. Относитесь к рекомендации как к руководству; правила выбора уровня сервера и компенсации не подтверждены.",
    "Рекомендовать",
    "Отменить рекомендованное",
    "Любой выбор эквивалентен",
    "Цель достигнута",
    "Все три атрибута имеют максимальное качество. Больше никаких уточнений не требуется.",
    "Сохраните этот полный комплект; ожидается, что позже будет использоваться меньше карт.",
    "Сохраните текущую комплектацию; ожидается, что позже будет использоваться меньше карт.",
    "В обоих наборах остались одинаковые ожидаемые карты.",
    "Ожидаемое количество карт, оставшихся после сброса",
    "Ожидаемое количество карт, оставшихся после сохранения",
    "Ожидается, что сохранение позволит сохранить карты {value}.",
    "Ожидается, что хранение будет стоить {value} дополнительных карт.",
    "карты",
    "Установить результат как текущий",
    "Введите следующий результат",
    "Введите целое качество от 0 до {cap}.",
    "Заблокированный атрибут должен сохранять то же качество.",
    "Введите три результата атрибута для этого уточнения.",
    "Ключ Warpath · Глобальный UID: 35600096",
    "Профиль Билибили",
    "Фанатский калькулятор, не связанный с издателем игры.",
    "Входы обновлены. Просмотрите рекомендацию еще раз.",
    "Карты доработки: {ordinary} разблокирована / {locked} с одной заблокированной.",
    "{section} · Атрибут {n}",
    "Ожидаемые значения не являются гарантией жалости или обещанием использования карты.",
    "Просмотр данных модели",
    "Ждем результата уточнения."
  ],
  "th": [
    "คุณลักษณะทั้งสามจะถือว่าเท่ากันโดยค่าเริ่มต้น มูลค่าที่แท้จริงขึ้นอยู่กับการตั้งค่าการ์ดยูนิตของคุณ",
    "แบบจำลองชั่วคราว: ผลลัพธ์จะถูกวาดอย่างอิสระและดัชนีการกำหนดค่าจะถือเป็นคุณภาพปัจจุบัน ไม่รวมเอฟเฟกต์ความสงสารและการติดตามผล",
    "เวอร์ชันเกม {game} · รันไทม์ {runtime}",
    "รุ่นและคำแนะนำ",
    "เปรียบเทียบการ์ด Refinement Calculator ที่เหลืออยู่ซึ่งจำเป็นสำหรับทั้งชุดเพื่อให้ได้คุณภาพสูงสุด แทนที่จะเปรียบเทียบคุณภาพโดยรวมเพียงอย่างเดียว ค่าใช้จ่ายที่ชำระไปแล้วสำหรับการปรับปรุงนี้ไม่ส่งผลต่อการตัดสินใจเก็บหรือทิ้ง",
    "โหมดล็อคจะเปรียบเทียบผลลัพธ์นี้เท่านั้น การใช้การ์ดที่คาดหวังในอนาคตจะคำนวณโดยใช้กลยุทธ์การปลดล็อค",
    "ผลลัพธ์นี้อยู่นอกตารางความน่าจะเป็นในการกำหนดค่าปัจจุบัน ปฏิบัติต่อข้อเสนอแนะเป็นแนวทาง กฎการเลือกระดับเซิร์ฟเวอร์และการชดเชยยังไม่ได้รับการยืนยัน",
    "เอาไว้แนะนำครับ",
    "ทิ้งคำแนะนำ",
    "ตัวเลือกใดตัวเลือกหนึ่งก็เทียบเท่ากัน",
    "บรรลุเป้าหมายแล้ว",
    "คุณลักษณะทั้งสามมีคุณภาพสูงสุด ไม่จำเป็นต้องปรับแต่งอีกต่อไป",
    "เก็บครบชุดนี้ไว้ คาดว่าจะใช้บัตรน้อยลงในภายหลัง",
    "เก็บชุดปัจจุบันไว้ คาดว่าจะใช้บัตรน้อยลงในภายหลัง",
    "ทั้งสองชุดมีไพ่ที่คาดหวังไว้เท่ากัน",
    "การ์ดที่คาดว่าจะเหลืออยู่หลังจากทิ้ง",
    "การ์ดที่คาดว่าจะเหลือหลังจากการเก็บรักษา",
    "การเก็บคาดว่าจะบันทึกการ์ด {value}",
    "การเก็บรักษาคาดว่าจะใช้บัตร {value} เพิ่มขึ้น",
    "การ์ด",
    "กำหนดให้ผลลัพธ์เป็นปัจจุบัน",
    "ป้อนผลลัพธ์ถัดไป",
    "ป้อนคุณภาพจำนวนเต็มตั้งแต่ 0 ถึง {cap}",
    "แอตทริบิวต์ที่ถูกล็อกจะต้องคงคุณภาพไว้เหมือนเดิม",
    "ป้อนผลลัพธ์แอตทริบิวต์ 3 รายการสำหรับการปรับแต่งนี้",
    "Warpath KeyKey · UID สากล: 35600096",
    "ข้อมูลส่วนตัวของ Bilibili",
    "เครื่องคิดเลขที่ผลิตโดยแฟน ๆ ไม่มีส่วนเกี่ยวข้องกับผู้เผยแพร่เกม",
    "อัปเดตอินพุตแล้ว ทบทวนคำแนะนำอีกครั้ง",
    "การ์ดการปรับแต่ง: ปลดล็อค {ordinary} / {locked} โดยล็อคไว้หนึ่งใบ",
    "{section} · แอตทริบิวต์ {n}",
    "ค่าที่คาดหวังไม่ใช่การรับประกันที่น่าสมเพชหรือคำมั่นสัญญาในการใช้บัตร",
    "ดูข้อมูลโมเดล",
    "รอผลการปรุงแต่ง"
  ],
  "tr": [
    "Üç nitelik varsayılan olarak eşit olarak değerlendirilir; gerçek değerleri ünite kartı kurulumunuza bağlıdır.",
    "Geçici model: sonuçlar bağımsız olarak çizilir ve konfigürasyon indeksi mevcut kalite olarak ele alınır; acıma ve yakalama efektleri hariçtir.",
    "Oyun sürümü {game} · çalışma zamanı {runtime}",
    "Model ve talimatlar",
    "Yalnızca toplam kaliteyi karşılaştırmak yerine, tüm setin maksimum kaliteye ulaşması için gereken, beklenen kalan İyileştirme Hesaplayıcı kartlarını karşılaştırın. Bu ayrıntılandırma için halihazırda ödenmiş olan maliyet, tut veya at kararını etkilemez.",
    "Kilit modu yalnızca bu sonucu karşılaştırır; gelecekte beklenen kart kullanımı kilitsiz strateji ile hesaplanır.",
    "Bu sonuç mevcut konfigürasyonda olasılık tablosunun dışındadır. Tavsiyeyi bir rehber olarak ele alın; sunucu katmanı seçimi ve telafi kuralları onaylanmadı.",
    "Tavsiye edileni koru",
    "Önerilenleri sil",
    "Her iki seçenek de eşdeğerdir",
    "Hedefe ulaşıldı",
    "Her üç özellik de maksimum kalitededir. Daha fazla ayrıntılandırmaya gerek yok.",
    "Bu komple seti saklayın; ilerleyen zamanlarda daha az kart kullanması bekleniyor.",
    "Mevcut tam seti koruyun; ilerleyen zamanlarda daha az kart kullanması bekleniyor.",
    "Her iki sette de aynı beklenen kartlar kaldı.",
    "Atıldıktan sonra kalan beklenen kartlar",
    "Tuttuktan sonra kalan beklenen kartlar",
    "Tutmanın {value} kartlarını kaydetmesi bekleniyor",
    "Saklamanın {value} daha fazla karta mal olması bekleniyor",
    "kartlar",
    "Sonucu geçerli olarak ayarla",
    "Sonraki sonucu girin",
    "0 ile {cap} arasında bir tam sayı kalitesi girin.",
    "Kilitli bir özellik aynı kaliteyi korumalıdır.",
    "Bu ayrıntılandırma için üç özellik sonucunu girin",
    "Warpath KeyKey · Küresel UID: 35600096",
    "Bilibili profili",
    "Oyun yayıncısına bağlı olmayan, hayran yapımı bir hesap makinesi.",
    "Girişler güncellendi. Öneriyi tekrar inceleyin.",
    "İyileştirme kartları: {ordinary} kilidi açıldı / {locked}, biri kilitli.",
    "{section} · {n} Özelliği",
    "Beklenen değerler bir acıma garantisi ya da kart kullanım vaadi değildir.",
    "Model verilerini görüntüle",
    "Ayrıntılandırma sonucu bekleniyor."
  ],
  "vi": [
    "Theo mặc định, ba thuộc tính được coi là bằng nhau; giá trị thực tế của chúng phụ thuộc vào thiết lập thẻ đơn vị của bạn.",
    "Mô hình tạm thời: kết quả được rút ra độc lập và chỉ số cấu hình được coi là chất lượng hiện tại; hiệu ứng đáng tiếc và bắt kịp được loại trừ.",
    "Phiên bản trò chơi {game} · thời gian chạy {runtime}",
    "Mô hình và hướng dẫn",
    "So sánh số thẻ Máy tính Tinh chỉnh còn lại dự kiến cần cho cả bộ để đạt chất lượng tối đa, thay vì chỉ so sánh tổng chất lượng. Chi phí đã trả cho việc sàng lọc này không ảnh hưởng đến quyết định giữ hoặc loại bỏ.",
    "Chế độ khóa chỉ so sánh kết quả này; việc sử dụng thẻ dự kiến ​​trong tương lai được tính toán bằng chiến lược đã mở khóa.",
    "Kết quả này nằm ngoài bảng xác suất trong cấu hình hiện tại. Hãy coi khuyến nghị như một hướng dẫn; quy tắc lựa chọn và bồi thường cấp máy chủ chưa được xác nhận.",
    "Giữ khuyến nghị",
    "Loại bỏ được đề xuất",
    "Lựa chọn nào cũng tương đương",
    "Đã đạt được mục tiêu",
    "Tất cả ba thuộc tính đều ở chất lượng tối đa. Không cần sàng lọc thêm nữa.",
    "Giữ bộ hoàn chỉnh này; dự kiến ​​sau này sẽ sử dụng ít thẻ hơn.",
    "Giữ bộ hoàn chỉnh hiện tại; dự kiến ​​sau này sẽ sử dụng ít thẻ hơn.",
    "Cả hai bộ đều có cùng số thẻ dự kiến ​​còn lại.",
    "Số thẻ dự kiến còn lại sau khi loại bỏ",
    "Số thẻ dự kiến còn lại sau khi giữ",
    "Giữ lại dự kiến sẽ tiết kiệm được thẻ {value}",
    "Việc giữ lại dự kiến sẽ tốn thêm {value} nhiều thẻ hơn",
    "thẻ",
    "Đặt kết quả như hiện tại",
    "Nhập kết quả tiếp theo",
    "Nhập chất lượng số nguyên từ 0 đến {cap}.",
    "Thuộc tính bị khóa phải giữ nguyên chất lượng.",
    "Nhập ba kết quả thuộc tính cho sàng lọc này",
    "Warpath KeyKey · UID toàn cầu: 35600096",
    "Hồ sơ mật khẩu",
    "Máy tính do người hâm mộ tạo ra, không liên kết với nhà phát hành trò chơi.",
    "Đã cập nhật đầu vào. Xem lại đề xuất một lần nữa.",
    "Thẻ cải tiến: ZZPH normalZZ đã được mở khóa / {locked} với một thẻ bị khóa.",
    "ZZPHphầnZZ · Thuộc tính {n}",
    "Giá trị kỳ vọng không phải là sự đảm bảo đáng tiếc hay lời hứa sử dụng thẻ.",
    "Xem dữ liệu mô hình",
    "Đang chờ kết quả sàng lọc."
  ]
};

const languages = [
  {code:'zh-CN',name:'简体中文',dir:'ltr',flag:'cn'},{code:'zh-TW',name:'繁體中文',dir:'ltr',flag:'tw'},
  ...[['en','English','gb'],['ar','العربية','sa'],['fr','Français','fr'],['de','Deutsch','de'],['id','Bahasa Indonesia','id'],['it','Italiano','it'],['ja','日本語','jp'],['ko','한국어','kr'],['ms','Bahasa Melayu','my'],['pl','Polski','pl'],['pt','Português','br'],['ru','Русский','ru'],['es','Español','es'],['th','ไทย','th'],['tr','Türkçe','tr'],['vi','Tiếng Việt','vn']].map(([code,name,flag])=>({code,name,dir:code==='ar'?'rtl':'ltr',flag}))
];

function completeList(code, head) {
  const rest = continuation[code];
  return [...head, ...rest];
}
const messages = {
  'zh-CN': zhCN,
  'zh-TW': fromList(['深度計算器','輸入品階，判斷本次結果是否值得保留。','語言','目前品階','本次洗練結果','詞條 {n}','品','洗練方式','三條一起洗練 · {cost} 張','鎖定詞條 {n} · {cost} 張','目標：三條均達到 {cap} 品','查看建議','重置','正在載入模型…','資料載入失敗，請重新整理再試。','重試','預設三個詞條等價；實際上依玩家的兵卡配置，三個詞條的價值並不完全相同。','暫定模型：結果獨立抽取，配置索引視為目前品階；不計保底與追趕效果。','遊戲版本 {game} · runtime {runtime}','模型與使用說明','建議比較整組結果到三條滿品所需的期望剩餘深度計算卡，不只比較總品階。已支付的本次洗練費用不影響保留與放棄的比較。','鎖定模式只比較本次結果，後續期望耗卡按不鎖策略計算。','該結果不在目前配置的機率表內，建議僅供參考；伺服器選檔或補償規則尚未確認。','建議保留','建議放棄','兩種選擇等價','已達到目標','三個詞條都已滿品，無需繼續洗練。','保留本次整組結果，預計後續耗卡較少。','保留目前整組詞條，預計後續耗卡較少。','兩組結果的期望剩餘耗卡相同。','放棄後的期望剩餘卡數','保留後的期望剩餘卡數','保留預計節省 {value} 張','保留預計多花 {value} 張','張','將結果設為目前','輸入下一次結果','請輸入 0–{cap} 的整數品階。','鎖定詞條的品階必須保持不變。','請輸入本次三個詞條的結果','Warpath 钥钥 國際服 uid：35600096','哔哩哔哩主页','玩家製作的計算工具，與遊戲官方無關。','輸入已更新，請重新查看建議。','深度計算卡：不鎖 {ordinary} 張／鎖一條 {locked} 張。','{section} · 詞條 {n}','期望值不是保底或耗卡承諾。','查看模型資料','等待洗練結果。'])
};

for (const code of ['en','fr','de','ja','es']) messages[code] = fromList(translations[code]);
for (const code of ['ar','pt']) messages[code] = fromList(localized[code]);
for (const [code, head] of Object.entries(fills)) messages[code] = fromList(completeList(code, head));
const qualityPlaceholders = {
  'zh-CN': '请输入', 'zh-TW': '請輸入', en: 'Enter', ar: 'أدخل', fr: 'Saisir', de: 'Eingeben',
  id: 'Masukkan', it: 'Inserisci', ja: '入力してください', ko: '입력하세요', ms: 'Masukkan', pl: 'Wpisz',
  pt: 'Insira', ru: 'Введите', es: 'Introduce', th: 'ป้อน', tr: 'Girin', vi: 'Nhập',
};
for (const [code, placeholder] of Object.entries(qualityPlaceholders)) messages[code].enterQuality = placeholder;
const chipCostLabels = {
  'zh-CN': '消耗 {cost} 张深度计算卡', 'zh-TW': '消耗 {cost} 張深度計算卡',
  en: 'Uses {cost} Compute Chips', ar: 'تستهلك {cost} من شرائح الحوسبة', fr: 'Coûte {cost} puces informatiques',
  de: 'Verbraucht {cost} Computerchips', id: 'Menggunakan {cost} Chip Komputasi', it: 'Consuma {cost} microchip',
  ja: '{cost}個の演算チップを消費します', ko: '운산칩 {cost}개 소모', ms: 'Menggunakan {cost} Cip Komputer',
  pl: 'Zużywa {cost} procesory', pt: 'Consome {cost} Chips de Computação', ru: 'Расходует {cost} вычислительных чипов',
  es: 'Consume {cost} chips informáticos', th: 'ใช้ {cost} ชิปประมวลผล', tr: '{cost} Hesaplama Çipi tüketir', vi: 'Tiêu hao {cost} Chip Điện Toán',
};
for (const [code, label] of Object.entries(chipCostLabels)) messages[code].chipCost = label;
for (const code of ['zh-CN','zh-TW']) messages[code].author = code === 'zh-CN' ? 'Warpath 钥钥 国际服 uid：35600096' : 'Warpath 钥钥 國際服 uid：35600096';
messages.en.author = 'Warpath 钥钥 · Global UID: 35600096';
messages.en.methodText = messages.en.methodText.replace('Refinement Calculator cards', 'Deep Calculation Cards');
messages['zh-TW'].bilibili = '嗶哩嗶哩主頁';
messages.vi.chipNote = 'Thẻ tính toán chiều sâu: không khóa {ordinary} thẻ / khóa một thuộc tính {locked} thẻ.';
for (const { code } of languages) {
  for (const key of Object.keys(messages['zh-CN'])) {
    const expected = [...messages['zh-CN'][key].matchAll(/\{([a-zA-Z][\w]*)\}/g)].map((match) => match[1]);
    let index = 0;
    const value = messages[code][key].replace(/\{[^{}]+\}/g, () => `{${expected[index++] ?? ''}}`);
    messages[code][key] = value + expected.slice(index).map((name) => ` {${name}}`).join('');
  }
}
const comparisonLabels = {
  'zh-CN': '词条对比',
  'zh-TW': '詞條比較',
  en: 'Attribute Comparison',
  ar: 'مقارنة السمات',
  fr: 'Comparaison des attributs',
  de: 'Attributvergleich',
  id: 'Perbandingan Atribut',
  it: 'Confronto attributi',
  ja: '属性比較',
  ko: '속성 비교',
  ms: 'Perbandingan Atribut',
  pl: 'Porównanie atrybutów',
  pt: 'Comparação de atributos',
  ru: 'Сравнение атрибутов',
  es: 'Comparación de atributos',
  th: 'เปรียบเทียบคุณสมบัติ',
  tr: 'Özellik Karşılaştırması',
  vi: 'So sánh thuộc tính',
};
for (const { code } of languages) messages[code].comparison = comparisonLabels[code];

const newLabels = {
  'zh-CN': ['技能伤害加深/抵抗','全局伤害加深/抵抗','普攻伤害加深/抵抗','洗练增减','词条 {n} 的洗练增减值','不变','根据现有数据，推荐您任何时候都选择消耗5张计算卡同时洗练3个词条。','继续','请输入0到{cap}之间的整数','请选择有效的洗练增减值'],
  'zh-TW': ['技能傷害加深/抵抗','全局傷害加深/抵抗','普攻傷害加深/抵抗','洗練增減','詞條 {n} 的洗練增減值','不變','根據現有資料，建議您任何時候都選擇消耗5張計算卡同時洗練3個詞條。','繼續','請輸入0到{cap}之間的整數','請選擇有效的洗練增減值'],
  en: ['Skill damage dealt/taken','Global damage dealt/taken','Normal attack damage dealt/taken','Refinement change','Refinement change for attribute {n}','Unchanged','Based on the available data, we recommend refining all 3 attributes together for 5 calculator cards at any time.','Continue','Enter an integer from 0 to {cap}','Select a valid refinement change'],
  ar: ['زيادة/مقاومة ضرر المهارة','زيادة/مقاومة الضرر العام','زيادة/مقاومة ضرر الهجوم العادي','تغيير الصقل','تغيير الصقل للسمة {n}','دون تغيير','استنادًا إلى البيانات المتاحة، نوصي دائمًا بصقل السمات الثلاث معًا مقابل 5 بطاقات حاسبة.','متابعة','أدخل عددًا صحيحًا من 0 إلى {cap}','اختر قيمة تغيير صقل صالحة'],
  fr: ['Dégâts de compétence infligés/subis','Dégâts globaux infligés/subis','Dégâts d’attaque normale infligés/subis','Variation du raffinement','Variation du raffinement de l’attribut {n}','Inchangé','D’après les données disponibles, nous recommandons de raffiner les 3 attributs ensemble pour 5 cartes à tout moment.','Continuer','Saisissez un entier entre 0 et {cap}','Choisissez une variation de raffinement valide'],
  de: ['Fertigkeitsschaden verursacht/erlitten','Globaler Schaden verursacht/erlitten','Schaden normaler Angriffe verursacht/erlitten','Verfeinerungsänderung','Verfeinerungsänderung für Attribut {n}','Unverändert','Nach den verfügbaren Daten empfehlen wir jederzeit, alle 3 Attribute zusammen für 5 Rechnerkarten zu verfeinern.','Weiter','Gib eine ganze Zahl von 0 bis {cap} ein','Wähle eine gültige Verfeinerungsänderung'],
  id: ['Kerusakan skill diberikan/diterima','Kerusakan global diberikan/diterima','Kerusakan serangan normal diberikan/diterima','Perubahan penyempurnaan','Perubahan penyempurnaan atribut {n}','Tidak berubah','Berdasarkan data yang tersedia, kami menyarankan untuk selalu menyempurnakan ketiga atribut sekaligus dengan 5 kartu kalkulator.','Lanjutkan','Masukkan bilangan bulat dari 0 sampai {cap}','Pilih perubahan penyempurnaan yang valid'],
  it: ['Danni abilità inflitti/subiti','Danni globali inflitti/subiti','Danni attacco normale inflitti/subiti','Variazione del perfezionamento','Variazione del perfezionamento dell’attributo {n}','Invariato','In base ai dati disponibili, consigliamo sempre di perfezionare insieme tutti e 3 gli attributi con 5 carte calcolatore.','Continua','Inserisci un numero intero da 0 a {cap}','Seleziona una variazione del perfezionamento valida'],
  ja: ['スキルダメージ増加/耐性','全体ダメージ増加/耐性','通常攻撃ダメージ増加/耐性','洗練の増減','属性{n}の洗練増減値','変化なし','現在のデータに基づき、常に計算カード5枚で3属性を同時に洗練することをおすすめします。','続ける','0から{cap}までの整数を入力してください','有効な洗練増減値を選択してください'],
  ko: ['스킬 피해 증가/저항','전체 피해 증가/저항','일반 공격 피해 증가/저항','세공 증감','속성 {n}의 세공 증감값','변화 없음','현재 데이터에 따르면 언제든 계산 카드 5장으로 속성 3개를 함께 세공하는 것을 권장합니다.','계속','0부터 {cap} 사이의 정수를 입력하세요','유효한 세공 증감값을 선택하세요'],
  ms: ['Kerosakan kemahiran diberi/diterima','Kerosakan global diberi/diterima','Kerosakan serangan biasa diberi/diterima','Perubahan penapisan','Perubahan penapisan atribut {n}','Tidak berubah','Berdasarkan data yang tersedia, kami mengesyorkan penapisan ketiga-tiga atribut bersama-sama dengan 5 kad pengira pada bila-bila masa.','Teruskan','Masukkan integer dari 0 hingga {cap}','Pilih perubahan penapisan yang sah'],
  pl: ['Obrażenia umiejętności zadawane/otrzymywane','Obrażenia globalne zadawane/otrzymywane','Obrażenia zwykłego ataku zadawane/otrzymywane','Zmiana udoskonalenia','Zmiana udoskonalenia atrybutu {n}','Bez zmian','Na podstawie dostępnych danych zalecamy zawsze udoskonalać wszystkie 3 atrybuty razem za 5 kart kalkulatora.','Kontynuuj','Wpisz liczbę całkowitą od 0 do {cap}','Wybierz prawidłową zmianę udoskonalenia'],
  pt: ['Dano de habilidade causado/recebido','Dano global causado/recebido','Dano de ataque normal causado/recebido','Variação do refinamento','Variação do refinamento do atributo {n}','Sem alteração','Com base nos dados disponíveis, recomendamos sempre refinar os 3 atributos juntos por 5 cartas de cálculo.','Continuar','Digite um número inteiro de 0 a {cap}','Selecione uma variação de refinamento válida'],
  ru: ['Урон навыков наносимый/получаемый','Общий урон наносимый/получаемый','Урон обычной атаки наносимый/получаемый','Изменение заточки','Изменение заточки атрибута {n}','Без изменений','По имеющимся данным мы всегда рекомендуем улучшать все 3 атрибута одновременно за 5 карт расчёта.','Продолжить','Введите целое число от 0 до {cap}','Выберите допустимое значение изменения заточки'],
  es: ['Daño de habilidad infligido/recibido','Daño global infligido/recibido','Daño de ataque normal infligido/recibido','Cambio de refinamiento','Cambio de refinamiento del atributo {n}','Sin cambios','Según los datos disponibles, recomendamos refinar siempre los 3 atributos juntos por 5 tarjetas de cálculo.','Continuar','Introduce un entero entre 0 y {cap}','Selecciona un cambio de refinamiento válido'],
  th: ['เพิ่ม/ต้านทานความเสียหายจากสกิล','เพิ่ม/ต้านทานความเสียหายโดยรวม','เพิ่ม/ต้านทานความเสียหายจากการโจมตีปกติ','การเปลี่ยนแปลงการขัดเกลา','การเปลี่ยนแปลงการขัดเกลาของคุณสมบัติ {n}','ไม่เปลี่ยนแปลง','จากข้อมูลที่มี เราแนะนำให้ขัดเกลาคุณสมบัติทั้ง 3 พร้อมกันโดยใช้การ์ดคำนวณ 5 ใบทุกครั้ง','ดำเนินการต่อ','กรอกจำนวนเต็มตั้งแต่ 0 ถึง {cap}','เลือกค่าการเปลี่ยนแปลงการขัดเกลาที่ถูกต้อง'],
  tr: ['Verilen/alınan yetenek hasarı','Verilen/alınan genel hasar','Verilen/alınan normal saldırı hasarı','İyileştirme değişimi','{n}. özelliğin iyileştirme değişimi','Değişmedi','Mevcut verilere göre, her zaman 5 hesaplama kartı kullanarak 3 özelliği birlikte iyileştirmenizi öneririz.','Devam et','0 ile {cap} arasında bir tam sayı girin','Geçerli bir iyileştirme değişimi seçin'],
  vi: ['Sát thương kỹ năng gây ra/nhận vào','Sát thương toàn cục gây ra/nhận vào','Sát thương đánh thường gây ra/nhận vào','Mức tăng giảm tinh luyện','Mức tăng giảm tinh luyện của thuộc tính {n}','Không đổi','Theo dữ liệu hiện có, chúng tôi luôn khuyên bạn tinh luyện cả 3 thuộc tính cùng lúc bằng 5 thẻ tính toán.','Tiếp tục','Nhập số nguyên từ 0 đến {cap}','Hãy chọn mức tăng giảm tinh luyện hợp lệ'],
};
for (const { code } of languages) {
  const [skillAttribute, globalAttribute, normalAttribute, delta, deltaLabel, unchanged, lockWarning, continueLabel, qualityRange, invalidChange] = newLabels[code];
  Object.assign(messages[code], { skillAttribute, globalAttribute, normalAttribute, delta, deltaLabel, unchanged, lockWarning, continue: continueLabel, qualityRange, invalidChange });
  messages[code].indifferent = code === 'zh-CN' ? '保留或放弃均可' : code === 'zh-TW' ? '保留或放棄均可'
    : code === 'en' ? 'Keeping or discarding is fine' : code === 'ar' ? 'يمكن الاحتفاظ أو الاستبعاد'
      : code === 'fr' ? 'Conserver ou abandonner, au choix' : code === 'de' ? 'Behalten oder Ablehnen ist gleichwertig'
        : code === 'id' ? 'Disimpan atau dibuang sama saja' : code === 'it' ? 'Conservare o scartare è indifferente'
          : code === 'ja' ? '保持しても破棄しても構いません' : code === 'ko' ? '보관하거나 버려도 됩니다'
            : code === 'ms' ? 'Simpan atau buang, kedua-duanya boleh' : code === 'pl' ? 'Możesz zachować lub odrzucić'
              : code === 'pt' ? 'Pode manter ou descartar' : code === 'ru' ? 'Можно сохранить или отбросить'
                : code === 'es' ? 'Puedes conservarlo o descartarlo' : code === 'th' ? 'เก็บไว้หรือทิ้งก็ได้'
                  : code === 'tr' ? 'Tutabilir veya atabilirsiniz' : 'Có thể giữ lại hoặc bỏ đi';
  messages[code].acceptText = code === 'zh-CN' ? '建议保留本次结果。' : code === 'zh-TW' ? '建議保留本次結果。'
    : code === 'en' ? 'Keep this result.' : code === 'ar' ? 'احتفظ بهذه النتيجة.' : code === 'fr' ? 'Conservez ce résultat.'
      : code === 'de' ? 'Dieses Ergebnis behalten.' : code === 'id' ? 'Simpan hasil ini.' : code === 'it' ? 'Conserva questo risultato.'
        : code === 'ja' ? '今回の結果を保持してください。' : code === 'ko' ? '이번 결과를 보관하세요.'
          : code === 'ms' ? 'Simpan hasil ini.' : code === 'pl' ? 'Zachowaj ten wynik.' : code === 'pt' ? 'Mantenha este resultado.'
            : code === 'ru' ? 'Сохраните этот результат.' : code === 'es' ? 'Conserva este resultado.'
              : code === 'th' ? 'เก็บผลลัพธ์นี้ไว้' : code === 'tr' ? 'Bu sonucu tutun.' : 'Giữ kết quả này.';
  messages[code].discardText = code === 'zh-CN' ? '建议保留当前词条。' : code === 'zh-TW' ? '建議保留目前詞條。'
    : code === 'en' ? 'Keep the current attributes.' : code === 'ar' ? 'احتفظ بالسمات الحالية.' : code === 'fr' ? 'Conservez les attributs actuels.'
      : code === 'de' ? 'Die aktuellen Attribute behalten.' : code === 'id' ? 'Simpan atribut saat ini.' : code === 'it' ? 'Conserva gli attributi attuali.'
        : code === 'ja' ? '現在の属性を保持してください。' : code === 'ko' ? '현재 속성을 보관하세요.'
          : code === 'ms' ? 'Simpan atribut semasa.' : code === 'pl' ? 'Zachowaj obecne atrybuty.' : code === 'pt' ? 'Mantenha os atributos atuais.'
            : code === 'ru' ? 'Сохраните текущие атрибуты.' : code === 'es' ? 'Conserva los atributos actuales.'
              : code === 'th' ? 'เก็บคุณสมบัติปัจจุบันไว้' : code === 'tr' ? 'Mevcut özellikleri tutun.' : 'Giữ các thuộc tính hiện tại.';
  messages[code].indifferentText = code === 'zh-CN' ? '本次结果与当前词条均可保留。' : code === 'zh-TW' ? '本次結果與目前詞條均可保留。'
    : code === 'en' ? 'Either set can be kept.' : code === 'ar' ? 'يمكن الاحتفاظ بأي من المجموعتين.' : code === 'fr' ? 'Les deux ensembles peuvent être conservés.'
      : code === 'de' ? 'Beide Sets können behalten werden.' : code === 'id' ? 'Kedua set dapat disimpan.' : code === 'it' ? 'È possibile conservare entrambi i gruppi.'
        : code === 'ja' ? 'どちらのセットも保持できます。' : code === 'ko' ? '두 세트 모두 보관할 수 있습니다.'
          : code === 'ms' ? 'Kedua-dua set boleh disimpan.' : code === 'pl' ? 'Możesz zachować dowolny zestaw.' : code === 'pt' ? 'Qualquer conjunto pode ser mantido.'
            : code === 'ru' ? 'Можно сохранить любой из наборов.' : code === 'es' ? 'Puedes conservar cualquiera de los conjuntos.'
              : code === 'th' ? 'สามารถเก็บชุดใดก็ได้' : code === 'tr' ? 'Her iki set de tutulabilir.' : 'Có thể giữ lại bộ nào cũng được.';
}

// 使用游戏词条译名；这些名称分别对应技能、全局与普攻伤害字段。
const canonicalUi = {
  'zh-CN': {skillAttribute:'技能伤害加深/抵抗',globalAttribute:'全局伤害加深/抵抗',normalAttribute:'普攻伤害加深/抵抗',complete:'三个词条均已满品',completeText:'三个词条均已满品，无需继续洗练。',server:'服务器',serverCn:'国服',serverInternational:'国际服',stageStatus:'当前配置 {group} · 上限 {cap} 品',clockEstimate:'按本机时间估算',stageNotOpen:'尚未开放深度计算',stageUnsupported:'缺少配置 {group} 的数据，暂时无法给出建议。'},
  'zh-TW': {skillAttribute:'技能傷害加深/抵抗',globalAttribute:'全局傷害加深/抵抗',normalAttribute:'普攻傷害加深/抵抗',complete:'三個詞條均已滿品',completeText:'三個詞條均已滿品，無需繼續洗練。',server:'伺服器',serverCn:'國服',serverInternational:'國際服',stageStatus:'目前配置 {group} · 上限 {cap} 品',clockEstimate:'依本機時間估算',stageNotOpen:'尚未開放深度計算',stageUnsupported:'缺少配置 {group} 的資料，暫時無法提供建議。'},
  en: {skillAttribute:'Skill Dmg Intensity/Resist',globalAttribute:'Dmg Intensity/Resist',normalAttribute:'Bullet Dmg Intensity/Resist',complete:'All three Advanced Metrics are maxed',completeText:'All three Advanced Metrics are at the maximum rank. No further Data Mining is needed.',server:'Server',serverCn:'China server',serverInternational:'International server',stageStatus:'Current configuration {group} · maximum rank {cap}',clockEstimate:'Estimated from local time',stageNotOpen:'Data Mining is not available yet',stageUnsupported:'Data for configuration {group} is unavailable, so no recommendation can be provided yet.'},
  ar: {skillAttribute:'حدة ضرر المهارة/مقاومته',globalAttribute:'حدة الضرر/مقاومته',normalAttribute:'حدة ضرر الرصاص/مقاومته',complete:'اكتملت المقاييس المتقدمة الثلاثة',completeText:'وصلت المقاييس المتقدمة الثلاثة إلى أعلى رتبة. لا حاجة إلى مزيد من التنقيب عن البيانات.',server:'الخادم',serverCn:'الخادم الصيني',serverInternational:'الخادم الدولي',stageStatus:'الإعداد الحالي {group} · الحد الأقصى للرتبة {cap}',clockEstimate:'تقدير حسب الوقت المحلي',stageNotOpen:'التنقيب عن البيانات غير متاح بعد',stageUnsupported:'بيانات الإعداد {group} غير متاحة، لذا يتعذر تقديم توصية حاليًا.'},
  fr: {skillAttribute:'Intensité DGT compétence/Résistance DGT',globalAttribute:'Intensité DGT/Résistance DGT',normalAttribute:'Intensité DGT des balles/Résistance DGT',complete:'Les trois indicateurs avancés sont au maximum',completeText:'Les trois indicateurs avancés ont atteint le rang maximal. Aucun autre cycle d’extraction de données n’est nécessaire.',server:'Serveur',serverCn:'Serveur chinois',serverInternational:'Serveur international',stageStatus:'Configuration actuelle {group} · rang maximal {cap}',clockEstimate:'Estimation selon l’heure locale',stageNotOpen:'L’extraction de données n’est pas encore disponible',stageUnsupported:'Les données de la configuration {group} sont indisponibles ; aucune recommandation ne peut être fournie pour le moment.'},
  de: {skillAttribute:'Fertigkeitssch.-Intensität/Widerstand',globalAttribute:'Schd.-Intensität/Widerstand',normalAttribute:'Kugelsch.-Intensität/Widerstand',complete:'Alle drei Fortgeschrittenen Kennzahlen sind maximiert',completeText:'Alle drei Fortgeschrittenen Kennzahlen haben den höchsten Rang erreicht. Kein weiteres Data-Mining nötig.',server:'Server',serverCn:'China-Server',serverInternational:'Internationaler Server',stageStatus:'Aktuelle Konfiguration {group} · maximaler Rang {cap}',clockEstimate:'Nach lokaler Zeit geschätzt',stageNotOpen:'Data-Mining ist noch nicht verfügbar',stageUnsupported:'Daten für Konfiguration {group} sind nicht verfügbar. Daher kann derzeit keine Empfehlung angezeigt werden.'},
  id: {skillAttribute:'Intensitas Dmg Skill/Ketahanan Dmg',globalAttribute:'Intensitas Dmg/Ketahanan Dmg',normalAttribute:'Intensitas Dmg Peluru/Ketahanan Dmg',complete:'Ketiga Advanced Metric telah mencapai batas',completeText:'Ketiga Advanced Metric telah mencapai rank maksimum. Data Mining lebih lanjut tidak diperlukan.',server:'Server',serverCn:'Server Tiongkok',serverInternational:'Server internasional',stageStatus:'Konfigurasi saat ini {group} · rank maksimum {cap}',clockEstimate:'Perkiraan berdasarkan waktu lokal',stageNotOpen:'Data Mining belum tersedia',stageUnsupported:'Data konfigurasi {group} tidak tersedia, jadi rekomendasi belum dapat diberikan.'},
  it: {skillAttribute:'Intensità danni abilità/Resistenza ai danni',globalAttribute:'Intensità danni/Resistenza ai danni',normalAttribute:'Intensità danni proiettili/Resistenza ai danni',complete:'Tutti e tre gli Advanced Metric sono al massimo',completeText:'Tutti e tre gli Advanced Metric hanno raggiunto il grado massimo. Non serve altro ciclo di estrazione dati.',server:'Server',serverCn:'Server cinese',serverInternational:'Server internazionale',stageStatus:'Configurazione attuale {group} · grado massimo {cap}',clockEstimate:'Stima basata sull’ora locale',stageNotOpen:'L’estrazione dati non è ancora disponibile',stageUnsupported:'I dati per la configurazione {group} non sono disponibili; al momento non è possibile fornire un consiglio.'},
  ja: {skillAttribute:'スキルダメージ増加/ダメージ抵抗',globalAttribute:'ダメージ増加/ダメージ抵抗',normalAttribute:'弾丸ダメージ増加/ダメージ抵抗',complete:'3つの高級データがすべて最高ランク',completeText:'3つの高級データがすべて最高ランクに到達しました。これ以上の高精度演算は不要です。',server:'サーバー',serverCn:'中国サーバー',serverInternational:'国際サーバー',stageStatus:'現在の設定 {group} · 上限ランク {cap}',clockEstimate:'端末の時刻から推定',stageNotOpen:'高精度演算はまだ利用できません',stageUnsupported:'設定 {group} のデータがないため、現在は推奨を表示できません。'},
  ko: {skillAttribute:'스킬 피해 심화/피해 저항',globalAttribute:'피해 심화/피해 저항',normalAttribute:'탄환 피해 심화/피해 저항',complete:'고급 데이터 세 가지가 모두 최대 등급',completeText:'고급 데이터 세 가지가 모두 최고 등급에 도달했습니다. 더 이상 고급 운산이 필요하지 않습니다.',server:'서버',serverCn:'중국 서버',serverInternational:'국제 서버',stageStatus:'현재 설정 {group} · 최대 등급 {cap}',clockEstimate:'현지 시간 기준 추정',stageNotOpen:'고급 운산이 아직 열리지 않았습니다',stageUnsupported:'설정 {group} 데이터가 없어 현재 권장 사항을 제공할 수 없습니다.'},
  ms: {skillAttribute:'Kekuatan Dmg Kemahiran/Dmg Tahan',globalAttribute:'Kekuatan Dmg/Dmg Tahan',normalAttribute:'Kekuatan Dmg Peluru/Dmg Tahan',complete:'Ketiga-tiga Metrik Lanjutan telah mencapai maksimum',completeText:'Ketiga-tiga Metrik Lanjutan telah mencapai pangkat maksimum. Perlombongan Data lanjut tidak diperlukan.',server:'Pelayan',serverCn:'Pelayan China',serverInternational:'Pelayan antarabangsa',stageStatus:'Konfigurasi semasa {group} · pangkat maksimum {cap}',clockEstimate:'Anggaran berdasarkan waktu tempatan',stageNotOpen:'Perlombongan Data belum tersedia',stageUnsupported:'Data untuk konfigurasi {group} tiada, jadi pengesyoran belum dapat diberikan.'},
  pl: {skillAttribute:'Przyrost obr. umiejętności/Odporność na obr.',globalAttribute:'Przyrost obr./Odporność na obr.',normalAttribute:'Przyrost obr. pocisków/Odporność na obr.',complete:'Wszystkie trzy zaawansowane statystyki osiągnęły maksimum',completeText:'Wszystkie trzy zaawansowane statystyki osiągnęły najwyższą rangę. Nie potrzeba dalszego cyklu wydobywania danych.',server:'Serwer',serverCn:'Serwer chiński',serverInternational:'Serwer międzynarodowy',stageStatus:'Bieżąca konfiguracja {group} · maksymalna ranga {cap}',clockEstimate:'Szacunek na podstawie czasu lokalnego',stageNotOpen:'Wydobywanie danych nie jest jeszcze dostępne',stageUnsupported:'Brak danych dla konfiguracji {group}, więc nie można teraz podać zalecenia.'},
  pt: {skillAttribute:'Intensidade Dano de habilidade/Resistência contra Dano',globalAttribute:'Intensidade do Dano/Resistência contra Dano',normalAttribute:'Intensidade Dano de projétil/Resistência contra Dano',complete:'Os três Atributos Avançados chegaram ao máximo',completeText:'Os três Atributos Avançados chegaram ao nível máximo. Não é necessário fazer outra Mineração de Dados.',server:'Servidor',serverCn:'Servidor da China',serverInternational:'Servidor internacional',stageStatus:'Configuração atual {group} · nível máximo {cap}',clockEstimate:'Estimativa baseada na hora local',stageNotOpen:'A Mineração de Dados ainda não está disponível',stageUnsupported:'Os dados da configuração {group} não estão disponíveis; ainda não é possível fornecer uma recomendação.'},
  ru: {skillAttribute:'Интенсивность урона навыка/Сопротивление урону',globalAttribute:'Интенсивность урона/Сопротивление урону',normalAttribute:'Интенсивность урона пуль/Сопротивление урону',complete:'Все три расширенных параметра достигли максимума',completeText:'Все три расширенных параметра достигли максимального ранга. Дальнейшее извлечение данных не требуется.',server:'Сервер',serverCn:'Китайский сервер',serverInternational:'Международный сервер',stageStatus:'Текущая конфигурация {group} · максимальный ранг {cap}',clockEstimate:'Оценка по местному времени',stageNotOpen:'Извлечение данных пока недоступно',stageUnsupported:'Данные для конфигурации {group} отсутствуют, поэтому рекомендацию пока дать нельзя.'},
  es: {skillAttribute:'Intensidad DGT de habilidad/Resistencia al daño',globalAttribute:'Intensidad de daño/Resistencia al daño',normalAttribute:'Intensidad DGT de balas/Resistencia al daño',complete:'Los tres indicadores avanzados están al máximo',completeText:'Los tres indicadores avanzados han alcanzado el rango máximo. No hace falta otro ciclo de extracción de datos.',server:'Servidor',serverCn:'Servidor de China',serverInternational:'Servidor internacional',stageStatus:'Configuración actual {group} · rango máximo {cap}',clockEstimate:'Estimación según la hora local',stageNotOpen:'La extracción de datos aún no está disponible',stageUnsupported:'No hay datos para la configuración {group}, así que todavía no se puede ofrecer una recomendación.'},
  th: {skillAttribute:'ความรุนแรงของความเสียหายจากสกิล/การต้านทานความเสียหาย',globalAttribute:'ความรุนแรงของความเสียหาย/การต้านทานความเสียหาย',normalAttribute:'ความรุนแรงของความเสียหายจากกระสุน/การต้านทานความเสียหาย',complete:'เมตริกขั้นสูงทั้ง 3 รายการถึงระดับสูงสุดแล้ว',completeText:'เมตริกขั้นสูงทั้ง 3 รายการถึงระดับสูงสุดแล้ว ไม่จำเป็นต้องขุดข้อมูลเพิ่มเติม',server:'เซิร์ฟเวอร์',serverCn:'เซิร์ฟเวอร์จีน',serverInternational:'เซิร์ฟเวอร์ต่างประเทศ',stageStatus:'การกำหนดค่าปัจจุบัน {group} · ระดับสูงสุด {cap}',clockEstimate:'ประมาณตามเวลาท้องถิ่น',stageNotOpen:'ยังไม่เปิดให้ใช้การขุดข้อมูล',stageUnsupported:'ไม่มีข้อมูลสำหรับการกำหนดค่า {group} จึงยังไม่สามารถให้คำแนะนำได้'},
  tr: {skillAttribute:'Yetenek Hasarı Yoğunluğu/Hasar Direnci',globalAttribute:'Hasar Yoğunluğu/Hasar Direnci',normalAttribute:'Mermi Hasarı Yoğunluğu/Hasar Direnci',complete:'Üç Gelişmiş Metrik de maksimum seviyede',completeText:'Üç Gelişmiş Metrik de en yüksek dereceye ulaştı. Yeni bir Veri Madenciliği döngüsü gerekmiyor.',server:'Sunucu',serverCn:'Çin sunucusu',serverInternational:'Uluslararası sunucu',stageStatus:'Mevcut yapılandırma {group} · maksimum derece {cap}',clockEstimate:'Yerel saate göre tahmin',stageNotOpen:'Veri Madenciliği henüz kullanılamıyor',stageUnsupported:'{group} yapılandırmasının verileri yok; şu anda öneri sunulamıyor.'},
  vi: {skillAttribute:'Cường Độ Sát Thương kỹ năng/Kháng Sát Thương',globalAttribute:'Cường Độ Sát Thương/Kháng Sát Thương',normalAttribute:'Cường Độ Sát Thương đạn/Kháng Sát Thương',complete:'Cả ba Số Liệu Nâng Cao đều đạt tối đa',completeText:'Cả ba Số Liệu Nâng Cao đã đạt bậc tối đa. Không cần Khai Phá Dữ Liệu thêm.',server:'Máy chủ',serverCn:'Máy chủ Trung Quốc',serverInternational:'Máy chủ quốc tế',stageStatus:'Cấu hình hiện tại {group} · bậc tối đa {cap}',clockEstimate:'Ước tính theo giờ địa phương',stageNotOpen:'Khai Phá Dữ Liệu chưa mở',stageUnsupported:'Không có dữ liệu cho cấu hình {group}, nên hiện chưa thể đưa ra đề xuất.'},
};
const stageAndCanonicalKeys = ['skillAttribute','globalAttribute','normalAttribute','complete','completeText','server','serverCn','serverInternational','stageStatus','clockEstimate','stageNotOpen','stageUnsupported'];
for (const { code } of languages) Object.assign(messages[code], Object.fromEntries(stageAndCanonicalKeys.map((key) => [key, canonicalUi[code][key]])));
// 伤害词根取自 blueprint_deepens 与 blueprint_resistance；类别名前缀取自 Buffname#buff_intro 对应字段。
const canonicalAttributeNames = {
  'zh-CN':['技能伤害加深/抵抗','全局伤害加深/抵抗','普攻伤害加深/抵抗'],
  'zh-TW':['軍官技能強化/抗性','傷害加深/傷害抵抗','普通攻擊強化/抗性'],
  en:['Officer Skill Boost/Resilience','Dmg Intensity/Resist','Normal Attack Boost/Resilience'],
  ar:['تعزيز مهارة الضابط/مرونة مهارة الضابط','حدة الضرر/مقاومة الضرر','تعزيز الهجوم العادي/مرونة الهجوم العادي'],
  fr:["Boost de compétences d'officier/Résilience de compétences d'officier",'Intensité DGT/Résistance DGT',"Boost d'attaque normale/Résilience d'attaque normale"],
  de:['Offiziers-Fähigkeitsboost/-widerstand','Schd.-Intensität/-Widerstand','Normaler Angriff-Boost/-widerstandsfähigkeit'],
  id:['Boost Skill Petugas/Ketangguhan Skill Petugas','Intensitas Dmg/Ketahanan Dmg','Boost Serangan Normal/Ketangguhan Serangan Normal'],
  it:['Potenziamento abilità ufficiali/Resilienza abilità ufficiali','Intensità danni/Resistenza ai danni','Potenziamento attacco normale/Resilienza attacco normale'],
  ja:['指揮官スキル強化/抵抗','ダメージ増加/抵抗','通常攻撃強化/抵抗'],
  ko:['장교 스킬 강화/저항','피해 심화/저항','일반 공격 강화/저항'],
  ms:['Pendorong Kemahiran Pegawai/Ketahanan Kemahiran Pegawai','Kekuatan Dmg/Dmg Tahan','Pendorong Serangan Biasa/Ketahanan Serangan Biasa'],
  pl:['Premia do zdolności oficera/Odporność na zdolności oficera','Przyrost obr./Odporność na obr.','Premia do ataku zwykłego/Odporność na ataki zwykłe'],
  pt:['Reforço da Habilidade de Oficial/Resiliência a Habilidade de Oficial','Intensidade do Dano/Resistência contra Dano','Reforço do Ataque Normal/Resiliência a Ataque Normal'],
  ru:['Усиление навыков офицера/Устойчивость к навыкам офицера','Интенсивность урона/Сопрот. урону','Усиление обычной атаки/Устойчивость к обычной атаке'],
  es:['Aumento de habilidad de oficial/Resiliencia a habilidades de oficiales','Intensidad de daño/Resistencia al daño','Aumento de ataque normal/Resiliencia a ataques normales'],
  th:['บูสต์ทักษะพลทหาร/ต้านทานทักษะพลทหาร','ความรุนแรงของความเสียหาย/ต้านทานความเสียหาย','บูสต์การโจมตีปกติ/ต้านทานการโจมตีปกติ'],
  tr:['Subay Becerisi Takviyesi/Dayanıklılığı','Hasar Yoğunluğu/Direnci','Normal Saldırı Takviyesi/Dayanıklılığı'],
  vi:['Cường Hóa Kỹ Năng Tướng/Chống Chịu Kỹ Năng Tướng','Cường Độ Sát Thương/Kháng Sát Thương','Cường Hóa Đòn Tấn Công Thường/Chống Chịu Đòn Tấn Công Thường'],
};
for (const [code, labels] of Object.entries(canonicalAttributeNames)) {
  [messages[code].skillAttribute, messages[code].globalAttribute, messages[code].normalAttribute] = labels;
}

// 可见计算流程沿用游戏内深度计算、Advanced Metric 与计算芯片的本地名称。
const visibleGameUi = {
  en: {title:'Data Mining Calculator',intro:'Enter current Advanced Metric ranks and compare this Data Mining result.',current:'Current rank',result:'Data Mining result',quality:'rank',delta:'Rank change',deltaLabel:'Rank change for Advanced Metric {n}',unchanged:'No change',mode:'Data Mining method',all:'Data Mine all three · {cost} Compute Chips',lock:'Lock Advanced Metric {n} · {cost} Compute Chips',qualityRange:'Enter an integer rank from 0 to {cap}.',invalidChange:'Choose a valid rank change.',qualityLabel:'{section} · Advanced Metric {n}',apply:'Use result as current',nextRoll:'Enter next Data Mining result',indifferent:'Saving or discarding either set is fine.',stageStatus:'Current configuration {group} · maximum Advanced Metric rank {cap}'},
  ar: {title:'حاسبة التنقيب عن البيانات',intro:'أدخل رتب المقاييس المتقدمة الحالية وقارن نتيجة التنقيب عن البيانات هذه.',current:'الرتبة الحالية',result:'نتيجة التنقيب عن البيانات',quality:'رتبة',delta:'تغيير الرتبة',deltaLabel:'تغيير رتبة المقياس المتقدم {n}',unchanged:'دون تغيير',mode:'طريقة التنقيب عن البيانات',all:'تنقيب البيانات للثلاثة · {cost} شرائح الحوسبة',lock:'قفل المقياس المتقدم {n} · {cost} شرائح الحوسبة',qualityRange:'أدخل رتبة صحيحة من 0 إلى {cap}.',invalidChange:'اختر تغيير رتبة صالحًا.',qualityLabel:'{section} · المقياس المتقدم {n}',apply:'اعتماد النتيجة كالحالية',nextRoll:'أدخل نتيجة التنقيب التالية',indifferent:'يمكن حفظ أي من المجموعتين أو تجاهلها.',stageStatus:'الإعداد الحالي {group} · أعلى رتبة للمقياس المتقدم {cap}'},
  fr: {title:'Calculateur d’extraction de données',intro:'Saisissez les rangs actuels des indicateurs avancés et comparez ce résultat d’extraction de données.',current:'Rang actuel',result:'Résultat d’extraction de données',quality:'rang',delta:'Variation du rang',deltaLabel:'Variation du rang de l’indicateur avancé {n}',unchanged:'Inchangé',mode:'Mode d’extraction de données',all:'Extraire les données des trois · {cost} puces informatiques',lock:'Verrouiller l’indicateur avancé {n} · {cost} puces informatiques',qualityRange:'Saisissez un rang entier de 0 à {cap}.',invalidChange:'Choisissez une variation de rang valide.',qualityLabel:'{section} · Indicateur avancé {n}',apply:'Utiliser le résultat comme valeur actuelle',nextRoll:'Saisir le prochain résultat d’extraction',indifferent:'Vous pouvez sauvegarder ou jeter l’un ou l’autre ensemble.',stageStatus:'Configuration actuelle {group} · rang maximal de l’indicateur avancé {cap}'},
  de: {title:'Data-Mining-Rechner',intro:'Gib die aktuellen Ränge der Fortgeschrittenen Kennzahlen ein und vergleiche dieses Data-Mining-Ergebnis.',current:'Aktueller Rang',result:'Data-Mining-Ergebnis',quality:'Rang',delta:'Rangänderung',deltaLabel:'Rangänderung für Fortgeschrittene Kennzahl {n}',unchanged:'Unverändert',mode:'Data-Mining-Methode',all:'Alle drei per Data-Mining · {cost} Computerchips',lock:'Fortgeschrittene Kennzahl {n} sperren · {cost} Computerchips',qualityRange:'Gib einen ganzzahligen Rang von 0 bis {cap} ein.',invalidChange:'Wähle eine gültige Rangänderung.',qualityLabel:'{section} · Fortgeschrittene Kennzahl {n}',apply:'Ergebnis als aktuell übernehmen',nextRoll:'Nächstes Data-Mining-Ergebnis eingeben',indifferent:'Beide Sets können gespeichert oder verworfen werden.',stageStatus:'Aktuelle Konfiguration {group} · maximaler Rang der Fortgeschrittenen Kennzahl {cap}'},
  id: {title:'Kalkulator Data Mining',intro:'Masukkan rank Advanced Metric saat ini dan bandingkan hasil Data Mining ini.',current:'Rank saat ini',result:'Hasil Data Mining',quality:'rank',delta:'Perubahan rank',deltaLabel:'Perubahan rank Advanced Metric {n}',unchanged:'Tidak berubah',mode:'Metode Data Mining',all:'Data Mining ketiganya · {cost} Chip Komputasi',lock:'Kunci Advanced Metric {n} · {cost} Chip Komputasi',qualityRange:'Masukkan rank bilangan bulat dari 0 sampai {cap}.',invalidChange:'Pilih perubahan rank yang valid.',qualityLabel:'{section} · Advanced Metric {n}',apply:'Jadikan hasil sebagai kondisi saat ini',nextRoll:'Masukkan hasil Data Mining berikutnya',indifferent:'Kedua set sama-sama boleh disimpan atau dibuang.',stageStatus:'Konfigurasi saat ini {group} · rank maksimum Advanced Metric {cap}'},
  it: {title:'Calcolatore di estrazione dati',intro:'Inserisci i gradi attuali delle statistiche avanzate e confronta questo risultato di estrazione dati.',current:'Grado attuale',result:'Risultato di estrazione dati',quality:'grado',delta:'Variazione del grado',deltaLabel:'Variazione del grado della statistica avanzata {n}',unchanged:'Invariato',mode:'Metodo di estrazione dati',all:'Estrai dati per tutti e tre · {cost} microchip',lock:'Blocca la statistica avanzata {n} · {cost} microchip',qualityRange:'Inserisci un grado intero da 0 a {cap}.',invalidChange:'Seleziona una variazione del grado valida.',qualityLabel:'{section} · Statistica avanzata {n}',apply:'Usa il risultato come valore attuale',nextRoll:'Inserisci il prossimo risultato di estrazione dati',indifferent:'Puoi salvare o scartare uno qualsiasi dei due gruppi.',stageStatus:'Configurazione attuale {group} · grado massimo della statistica avanzata {cap}'},
  ja: {title:'高精度演算計算機',intro:'現在の高級データのランクを入力し、今回の高精度演算結果を比較します。',current:'現在のランク',result:'高精度演算結果',quality:'ランク',delta:'ランク変化',deltaLabel:'高級データ{n}のランク変化',unchanged:'変化なし',mode:'高精度演算方法',all:'3項目を同時に高精度演算 · {cost} 演算チップ',lock:'高級データ{n}をロック · {cost} 演算チップ',qualityRange:'0から{cap}までの整数ランクを入力してください。',invalidChange:'有効なランク変化を選択してください。',qualityLabel:'{section} · 高級データ{n}',apply:'今回の結果を現在値に設定',nextRoll:'次の高精度演算結果を入力',indifferent:'どちらのセットも保存または破棄できます。',stageStatus:'現在の設定 {group} · 高級データの上限ランク {cap}'},
  ko: {title:'고급 운산 계산기',intro:'현재 고급 데이터 등급을 입력하고 이번 고급 운산 결과를 비교하세요.',current:'현재 등급',result:'고급 운산 결과',quality:'등급',delta:'등급 변화',deltaLabel:'고급 데이터 {n} 등급 변화',unchanged:'변화 없음',mode:'고급 운산 방식',all:'세 항목 함께 고급 운산 · {cost} 운산칩',lock:'고급 데이터 {n} 잠금 · {cost} 운산칩',qualityRange:'0부터 {cap}까지의 정수 등급을 입력하세요.',invalidChange:'올바른 등급 변화를 선택하세요.',qualityLabel:'{section} · 고급 데이터 {n}',apply:'결과를 현재 값으로 설정',nextRoll:'다음 고급 운산 결과 입력',indifferent:'두 세트 중 어느 쪽이든 저장하거나 버릴 수 있습니다.',stageStatus:'현재 설정 {group} · 고급 데이터 최대 등급 {cap}'},
  ms: {title:'Kalkulator Perlombongan Data',intro:'Masukkan pangkat Metrik Lanjutan semasa dan bandingkan hasil Perlombongan Data ini.',current:'Pangkat semasa',result:'Hasil Perlombongan Data',quality:'pangkat',delta:'Perubahan pangkat',deltaLabel:'Perubahan pangkat Metrik Lanjutan {n}',unchanged:'Tidak berubah',mode:'Kaedah Perlombongan Data',all:'Lombong data ketiga-tiganya · {cost} Cip Komputer',lock:'Kunci Metrik Lanjutan {n} · {cost} Cip Komputer',qualityRange:'Masukkan pangkat integer dari 0 hingga {cap}.',invalidChange:'Pilih perubahan pangkat yang sah.',qualityLabel:'{section} · Metrik Lanjutan {n}',apply:'Tetapkan hasil sebagai keadaan semasa',nextRoll:'Masukkan hasil Perlombongan Data seterusnya',indifferent:'Mana-mana set boleh disimpan atau dibuang.',stageStatus:'Konfigurasi semasa {group} · pangkat maksimum Metrik Lanjutan {cap}'},
  pl: {title:'Kalkulator wydobywania danych',intro:'Wprowadź bieżące rangi zaawansowanych statystyk i porównaj ten wynik wydobywania danych.',current:'Bieżąca ranga',result:'Wynik wydobywania danych',quality:'ranga',delta:'Zmiana rangi',deltaLabel:'Zmiana rangi zaawansowanej statystyki {n}',unchanged:'Bez zmian',mode:'Metoda wydobywania danych',all:'Wydobywanie danych dla wszystkich trzech · {cost} procesory',lock:'Zablokuj zaawansowaną statystykę {n} · {cost} procesory',qualityRange:'Wpisz całkowitą rangę od 0 do {cap}.',invalidChange:'Wybierz prawidłową zmianę rangi.',qualityLabel:'{section} · Zaawansowana statystyka {n}',apply:'Ustaw wynik jako bieżący',nextRoll:'Wprowadź następny wynik wydobywania danych',indifferent:'Możesz zapisać albo odrzucić dowolny zestaw.',stageStatus:'Bieżąca konfiguracja {group} · maksymalna ranga zaawansowanej statystyki {cap}'},
  pt: {title:'Calculadora de Mineração de Dados',intro:'Insira os níveis atuais dos Atributos Avançados e compare este resultado da Mineração de Dados.',current:'Nível atual',result:'Resultado da Mineração de Dados',quality:'nível',delta:'Variação do nível',deltaLabel:'Variação do nível do Atributo Avançado {n}',unchanged:'Sem alteração',mode:'Método de Mineração de Dados',all:'Minerar os três · {cost} Chips de Computação',lock:'Bloquear Atributo Avançado {n} · {cost} Chips de Computação',qualityRange:'Digite um nível inteiro de 0 a {cap}.',invalidChange:'Selecione uma variação de nível válida.',qualityLabel:'{section} · Atributo Avançado {n}',apply:'Usar resultado como atual',nextRoll:'Insira o próximo resultado da Mineração de Dados',indifferent:'Você pode salvar ou descartar qualquer conjunto.',stageStatus:'Configuração atual {group} · nível máximo do Atributo Avançado {cap}'},
  ru: {title:'Калькулятор извлечения данных',intro:'Введите текущие ранги расширенных параметров и сравните результат этого извлечения данных.',current:'Текущий ранг',result:'Результат извлечения данных',quality:'ранг',delta:'Изменение ранга',deltaLabel:'Изменение ранга расширенного параметра {n}',unchanged:'Без изменений',mode:'Режим извлечения данных',all:'Извлечь данные для всех трех · {cost} вычислительных чипов',lock:'Заблокировать расширенный параметр {n} · {cost} вычислительных чипов',qualityRange:'Введите целый ранг от 0 до {cap}.',invalidChange:'Выберите допустимое изменение ранга.',qualityLabel:'{section} · расширенный параметр {n}',apply:'Установить результат как текущий',nextRoll:'Введите следующий результат извлечения данных',indifferent:'Можно сохранить или сбросить любой набор.',stageStatus:'Текущая конфигурация {group} · максимальный ранг расширенного параметра {cap}'},
  es: {title:'Calculadora de extracción de datos',intro:'Introduce los rangos actuales de los indicadores avanzados y compara este resultado de extracción de datos.',current:'Rango actual',result:'Resultado de extracción de datos',quality:'rango',delta:'Cambio de rango',deltaLabel:'Cambio de rango del indicador avanzado {n}',unchanged:'Sin cambios',mode:'Método de extracción de datos',all:'Extraer datos de los tres · {cost} chips informáticos',lock:'Bloquear indicador avanzado {n} · {cost} chips informáticos',qualityRange:'Introduce un rango entero de 0 a {cap}.',invalidChange:'Selecciona un cambio de rango válido.',qualityLabel:'{section} · Indicador avanzado {n}',apply:'Usar el resultado como actual',nextRoll:'Introduce el siguiente resultado de extracción de datos',indifferent:'Puedes guardar o descartar cualquiera de los conjuntos.',stageStatus:'Configuración actual {group} · rango máximo del indicador avanzado {cap}'},
  th: {title:'เครื่องคำนวณการขุดข้อมูล',intro:'กรอกระดับเมตริกขั้นสูงปัจจุบันและเปรียบเทียบผลการขุดข้อมูลครั้งนี้',current:'ระดับปัจจุบัน',result:'ผลการขุดข้อมูล',quality:'ระดับ',delta:'การเปลี่ยนระดับ',deltaLabel:'การเปลี่ยนระดับของเมตริกขั้นสูง {n}',unchanged:'ไม่เปลี่ยนแปลง',mode:'วิธีการขุดข้อมูล',all:'ขุดข้อมูลทั้ง 3 รายการ · {cost} ชิปประมวลผล',lock:'ล็อกเมตริกขั้นสูง {n} · {cost} ชิปประมวลผล',qualityRange:'กรอกระดับจำนวนเต็มตั้งแต่ 0 ถึง {cap}',invalidChange:'เลือกการเปลี่ยนระดับที่ถูกต้อง',qualityLabel:'{section} · เมตริกขั้นสูง {n}',apply:'ตั้งผลลัพธ์เป็นค่าปัจจุบัน',nextRoll:'กรอกผลการขุดข้อมูลครั้งถัดไป',indifferent:'บันทึกหรือละทิ้งชุดใดก็ได้',stageStatus:'การกำหนดค่าปัจจุบัน {group} · ระดับสูงสุดของเมตริกขั้นสูง {cap}'},
  tr: {title:'Veri Madenciliği Hesaplayıcısı',intro:'Mevcut Gelişmiş Metrik derecelerini girip bu Veri Madenciliği sonucunu karşılaştırın.',current:'Mevcut derece',result:'Veri Madenciliği sonucu',quality:'derece',delta:'Derece değişimi',deltaLabel:'Gelişmiş Metrik {n} derece değişimi',unchanged:'Değişmedi',mode:'Veri Madenciliği yöntemi',all:'Üçünü birlikte Veri Madenciliği yap · {cost} Hesaplama Çipi',lock:'Gelişmiş Metrik {n} kilitle · {cost} Hesaplama Çipi',qualityRange:'0 ile {cap} arasında bir tam sayı derece girin.',invalidChange:'Geçerli bir derece değişimi seçin.',qualityLabel:'{section} · Gelişmiş Metrik {n}',apply:'Sonucu mevcut değer olarak ayarla',nextRoll:'Sonraki Veri Madenciliği sonucunu girin',indifferent:'İki setten herhangi biri kaydedilebilir veya atılabilir.',stageStatus:'Mevcut yapılandırma {group} · Gelişmiş Metrik maksimum derecesi {cap}'},
  vi: {title:'Máy Tính Khai Phá Dữ Liệu',intro:'Nhập bậc hiện tại của các Số Liệu Nâng Cao và so sánh kết quả Khai Phá Dữ Liệu này.',current:'Bậc hiện tại',result:'Kết quả Khai Phá Dữ Liệu',quality:'bậc',delta:'Thay đổi bậc',deltaLabel:'Thay đổi bậc của Số Liệu Nâng Cao {n}',unchanged:'Không đổi',mode:'Cách Khai Phá Dữ Liệu',all:'Khai Phá Dữ Liệu cả ba · {cost} Chip Điện Toán',lock:'Khóa Số Liệu Nâng Cao {n} · {cost} Chip Điện Toán',qualityRange:'Nhập bậc số nguyên từ 0 đến {cap}.',invalidChange:'Hãy chọn thay đổi bậc hợp lệ.',qualityLabel:'{section} · Số Liệu Nâng Cao {n}',apply:'Đặt kết quả làm giá trị hiện tại',nextRoll:'Nhập kết quả Khai Phá Dữ Liệu tiếp theo',indifferent:'Có thể lưu hoặc loại bỏ bộ nào cũng được.',stageStatus:'Cấu hình hiện tại {group} · bậc tối đa của Số Liệu Nâng Cao {cap}'},
};
const visibleGameKeys = ['title','current','result','quality','delta','deltaLabel','unchanged','mode','all','qualityRange','invalidChange','qualityLabel','apply','nextRoll','indifferent'];
for (const [code, labels] of Object.entries(visibleGameUi)) Object.assign(messages[code], Object.fromEntries(visibleGameKeys.map((key) => [key, labels[key]])));

const calculateLabels = {
  'zh-CN':'计算','zh-TW':'計算',en:'Calculate',ar:'احسب',fr:'Calculer',de:'Berechnen',id:'Hitung',it:'Calcola',
  ja:'計算',ko:'계산',ms:'Kira',pl:'Oblicz',pt:'Calcular',ru:'Рассчитать',es:'Calcular',th:'คำนวณ',tr:'Hesapla',vi:'Tính toán',
};
for (const [code, label] of Object.entries(calculateLabels)) messages[code].compare = label;

const contentDateStatus = {
  'zh-CN':'当前配置 {group} · 上限 {cap} 品 · 游戏内容日期 {gameDate}',
  'zh-TW':'目前配置 {group} · 上限 {cap} 品 · 遊戲內容日期 {gameDate}',
  en:'Current configuration {group} · maximum rank {cap} · game content date {gameDate}',
  ar:'الإعداد الحالي {group} · الحد الأقصى للرتبة {cap} · تاريخ محتوى اللعبة {gameDate}',
  fr:'Configuration actuelle {group} · rang maximal {cap} · date du contenu du jeu {gameDate}',
  de:'Aktuelle Konfiguration {group} · maximaler Rang {cap} · Spieldatum {gameDate}',
  id:'Konfigurasi saat ini {group} · rank maksimum {cap} · tanggal konten game {gameDate}',
  it:'Configurazione attuale {group} · grado massimo {cap} · data dei contenuti di gioco {gameDate}',
  ja:'現在の設定 {group} · 最大ランク {cap} · ゲーム内容の日付 {gameDate}',
  ko:'현재 설정 {group} · 최대 등급 {cap} · 게임 콘텐츠 날짜 {gameDate}',
  ms:'Konfigurasi semasa {group} · pangkat maksimum {cap} · tarikh kandungan permainan {gameDate}',
  pl:'Bieżąca konfiguracja {group} · maksymalna ranga {cap} · data zawartości gry {gameDate}',
  pt:'Configuração atual {group} · nível máximo {cap} · data do conteúdo do jogo {gameDate}',
  ru:'Текущая конфигурация {group} · максимальный ранг {cap} · дата игрового контента {gameDate}',
  es:'Configuración actual {group} · rango máximo {cap} · fecha del contenido del juego {gameDate}',
  th:'การกำหนดค่าปัจจุบัน {group} · ระดับสูงสุด {cap} · วันที่ของเนื้อหาในเกม {gameDate}',
  tr:'Mevcut yapılandırma {group} · maksimum derece {cap} · oyun içeriği tarihi {gameDate}',
  vi:'Cấu hình hiện tại {group} · bậc tối đa {cap} · ngày nội dung trò chơi {gameDate}',
};
for (const [code, label] of Object.entries(contentDateStatus)) messages[code].stageStatus = label;

const preferenceAndClockUi = {
  'zh-CN': {acceptResult:'我接受本次结果',discardResult:'我放弃本次结果',welcomeServer:'你可以在页面右上方切换国服和国际服。',welcomeClose:'我知道了',timeSync:'网络时间更新失败，继续使用上次同步的时间。',timeError:'无法获取网络时间，请重试。',timeRetry:'重试网络时间'},
  'zh-TW': {acceptResult:'我接受本次結果',discardResult:'我放棄本次結果',welcomeServer:'你可以在頁面右上方切換國服和國際服。',welcomeClose:'我知道了',timeSync:'網路時間更新失敗，繼續使用上次同步的時間。',timeError:'無法取得網路時間，請重試。',timeRetry:'重試網路時間'},
  en: {acceptResult:'I accept this result',discardResult:'I discard this result',welcomeServer:'You can switch between the China and International servers in the upper-right corner.',welcomeClose:'Got it',timeSync:'Network time update failed. Continuing with the last synchronized time.',timeError:'Could not obtain network time. Please retry.',timeRetry:'Retry network time'},
  ar: {acceptResult:'أقبل هذه النتيجة',discardResult:'أرفض هذه النتيجة',welcomeServer:'يمكنك التبديل بين الخادم الصيني والدولي من أعلى يسار الصفحة.',welcomeClose:'حسنًا',timeSync:'فشل تحديث الوقت عبر الشبكة. سيتم استخدام آخر وقت تمت مزامنته.',timeError:'تعذر الحصول على وقت الشبكة. يُرجى إعادة المحاولة.',timeRetry:'إعادة محاولة توقيت الشبكة'},
  fr: {acceptResult:'J’accepte ce résultat',discardResult:'Je rejette ce résultat',welcomeServer:'Vous pouvez changer de serveur chinois ou international en haut à droite.',welcomeClose:'Compris',timeSync:'Échec de la mise à jour de l’heure réseau. La dernière heure synchronisée est utilisée.',timeError:'Impossible d’obtenir l’heure réseau. Veuillez réessayer.',timeRetry:'Réessayer la synchronisation'},
  de: {acceptResult:'Dieses Ergebnis annehmen',discardResult:'Dieses Ergebnis ablehnen',welcomeServer:'Oben rechts kannst du zwischen dem chinesischen und dem internationalen Server wechseln.',welcomeClose:'Verstanden',timeSync:'Netzwerkzeit konnte nicht aktualisiert werden. Die zuletzt synchronisierte Zeit wird weiterverwendet.',timeError:'Netzwerkzeit konnte nicht abgerufen werden. Bitte erneut versuchen.',timeRetry:'Netzwerkzeit erneut abrufen'},
  id: {acceptResult:'Saya menerima hasil ini',discardResult:'Saya menolak hasil ini',welcomeServer:'Kamu dapat beralih antara server Tiongkok dan internasional di pojok kanan atas.',welcomeClose:'Mengerti',timeSync:'Pembaruan waktu jaringan gagal. Waktu terakhir yang tersinkronisasi tetap digunakan.',timeError:'Waktu jaringan tidak dapat diperoleh. Silakan coba lagi.',timeRetry:'Coba sinkronkan waktu lagi'},
  it: {acceptResult:'Accetto questo risultato',discardResult:'Rifiuto questo risultato',welcomeServer:'Puoi passare dal server cinese a quello internazionale in alto a destra.',welcomeClose:'Ho capito',timeSync:'Aggiornamento dell’ora di rete non riuscito. Si continua a usare l’ultima ora sincronizzata.',timeError:'Impossibile ottenere l’ora di rete. Riprova.',timeRetry:'Riprova a sincronizzare l’ora'},
  ja: {acceptResult:'今回の結果を受け入れる',discardResult:'今回の結果を放棄する',welcomeServer:'ページ右上で中国サーバーと国際サーバーを切り替えられます。',welcomeClose:'確認',timeSync:'ネットワーク時刻を更新できません。前回同期した時刻を引き続き使用します。',timeError:'ネットワーク時刻を取得できません。再試行してください。',timeRetry:'ネットワーク時刻を再取得'},
  ko: {acceptResult:'이번 결과를 수락합니다',discardResult:'이번 결과를 포기합니다',welcomeServer:'페이지 오른쪽 위에서 중국 서버와 국제 서버를 전환할 수 있습니다.',welcomeClose:'확인',timeSync:'네트워크 시간 업데이트에 실패했습니다. 마지막으로 동기화된 시간을 계속 사용합니다.',timeError:'네트워크 시간을 가져오지 못했습니다. 다시 시도하세요.',timeRetry:'네트워크 시간 다시 동기화'},
  ms: {acceptResult:'Saya menerima hasil ini',discardResult:'Saya menolak hasil ini',welcomeServer:'Anda boleh menukar antara pelayan China dan antarabangsa di penjuru kanan atas.',welcomeClose:'Faham',timeSync:'Kemas kini waktu rangkaian gagal. Waktu terakhir yang disegerakkan akan terus digunakan.',timeError:'Waktu rangkaian tidak dapat diperoleh. Sila cuba lagi.',timeRetry:'Cuba segerakkan waktu lagi'},
  pl: {acceptResult:'Akceptuję ten wynik',discardResult:'Odrzucam ten wynik',welcomeServer:'W prawym górnym rogu możesz przełączać serwer chiński i międzynarodowy.',welcomeClose:'Rozumiem',timeSync:'Nie udało się zaktualizować czasu sieciowego. Używany jest ostatni zsynchronizowany czas.',timeError:'Nie można pobrać czasu z sieci. Spróbuj ponownie.',timeRetry:'Ponów synchronizację czasu'},
  pt: {acceptResult:'Aceito este resultado',discardResult:'Rejeito este resultado',welcomeServer:'Você pode alternar entre os servidores da China e internacional no canto superior direito.',welcomeClose:'Entendi',timeSync:'Falha ao atualizar o horário da rede. O último horário sincronizado continuará em uso.',timeError:'Não foi possível obter o horário da rede. Tente novamente.',timeRetry:'Tentar sincronizar novamente'},
  ru: {acceptResult:'Принять этот результат',discardResult:'Отклонить этот результат',welcomeServer:'Переключать китайский и международный серверы можно в правом верхнем углу.',welcomeClose:'Понятно',timeSync:'Не удалось обновить сетевое время. Продолжается использование последнего синхронизированного времени.',timeError:'Не удалось получить сетевое время. Повторите попытку.',timeRetry:'Повторить синхронизацию времени'},
  es: {acceptResult:'Acepto este resultado',discardResult:'Rechazo este resultado',welcomeServer:'Puedes cambiar entre los servidores de China e internacional en la esquina superior derecha.',welcomeClose:'Entendido',timeSync:'No se pudo actualizar la hora de la red. Se sigue usando la última hora sincronizada.',timeError:'No se pudo obtener la hora de la red. Inténtalo de nuevo.',timeRetry:'Volver a sincronizar la hora'},
  th: {acceptResult:'ยอมรับผลลัพธ์นี้',discardResult:'ปฏิเสธผลลัพธ์นี้',welcomeServer:'สลับระหว่างเซิร์ฟเวอร์จีนและเซิร์ฟเวอร์นานาชาติได้ที่มุมขวาบน',welcomeClose:'เข้าใจแล้ว',timeSync:'อัปเดตเวลาเครือข่ายไม่สำเร็จ จะใช้เวลาที่ซิงค์ไว้ล่าสุดต่อไป',timeError:'รับเวลาเครือข่ายไม่ได้ โปรดลองอีกครั้ง',timeRetry:'ลองซิงค์เวลาอีกครั้ง'},
  tr: {acceptResult:'Bu sonucu kabul ediyorum',discardResult:'Bu sonucu reddediyorum',welcomeServer:'Sağ üst köşeden Çin ve uluslararası sunucular arasında geçiş yapabilirsiniz.',welcomeClose:'Anladım',timeSync:'Ağ saati güncellenemedi. Son eşitlenen saat kullanılmaya devam ediyor.',timeError:'Ağ saati alınamadı. Lütfen yeniden deneyin.',timeRetry:'Ağ saatini yeniden eşitle'},
  vi: {acceptResult:'Tôi chấp nhận kết quả này',discardResult:'Tôi từ chối kết quả này',welcomeServer:'Bạn có thể chuyển đổi giữa máy chủ Trung Quốc và quốc tế ở góc trên bên phải.',welcomeClose:'Đã hiểu',timeSync:'Không thể cập nhật giờ mạng. Tiếp tục dùng giờ đã đồng bộ gần nhất.',timeError:'Không thể lấy giờ mạng. Vui lòng thử lại.',timeRetry:'Thử đồng bộ giờ mạng lại'},
};
for (const [code, labels] of Object.entries(preferenceAndClockUi)) {
  Object.assign(messages[code], labels);
}
const networkClockLabels = {
  'zh-CN':'网络 UTC 时间','zh-TW':'網路 UTC 時間',en:'Network UTC time',ar:'توقيت UTC عبر الشبكة',
  fr:'Heure UTC réseau',de:'Netzwerkzeit in UTC',id:'Waktu UTC jaringan',it:'Ora UTC di rete',ja:'ネットワークUTC時刻',
  ko:'네트워크 UTC 시간',ms:'Waktu UTC rangkaian',pl:'Sieciowy czas UTC',pt:'Horário UTC da rede',ru:'Сетевое время UTC',
  es:'Hora UTC de la red',th:'เวลา UTC จากเครือข่าย',tr:'Ağ UTC saati',vi:'Giờ UTC qua mạng',
};
for (const [code, label] of Object.entries(networkClockLabels)) messages[code].clockEstimate = label;

const gameActionLabels = {
  'zh-CN': ['建议保留','建议放弃','三个词条均已满品','三个词条均已满品，无需继续洗练。','计算芯片'],
  'zh-TW': ['建議保留','建議不儲存','三個詞條均已滿品','三個詞條均已滿品，無需繼續洗練。','運算晶片'],
  en: ['Save recommended','Discard recommended','All three Advanced Metrics are maxed','All three Advanced Metrics are at the maximum rank. No further Data Mining is needed.','Compute Chips'],
  ar: ['يوصى بالحفظ','يوصى بالتجاهل','اكتملت المقاييس المتقدمة الثلاثة','وصلت المقاييس المتقدمة الثلاثة إلى أعلى رتبة. لا حاجة إلى مزيد من التنقيب عن البيانات.','شرائح الحوسبة'],
  fr: ['Sauvegarde conseillée','Jeter conseillé','Les trois indicateurs avancés sont au maximum','Les trois indicateurs avancés ont atteint le rang maximal. Aucun autre cycle d’extraction de données n’est nécessaire.','puces informatiques'],
  de: ['Speichern empfohlen','Verwerfen empfohlen','Alle drei Fortgeschrittenen Kennzahlen sind maximiert','Alle drei Fortgeschrittenen Kennzahlen haben den höchsten Rang erreicht. Kein weiteres Data-Mining nötig.','Computerchips'],
  id: ['Simpan disarankan','Buang disarankan','Ketiga Advanced Metric telah mencapai batas','Ketiga Advanced Metric telah mencapai rank maksimum. Data Mining lebih lanjut tidak diperlukan.','Chip Komputasi'],
  it: ['Salvataggio consigliato','Scarto consigliato','Tutti e tre gli Advanced Metric sono al massimo','Tutti e tre gli Advanced Metric hanno raggiunto il grado massimo. Non serve altro ciclo di estrazione dati.','microchip'],
  ja: ['保存を推奨','保存しないことを推奨','3つの高級データがすべて最高ランク','3つの高級データがすべて最高ランクに到達しました。これ以上の高精度演算は不要です。','演算チップ'],
  ko: ['저장 권장','저장하지 않음 권장','고급 데이터 세 가지가 모두 최대 등급','고급 데이터 세 가지가 모두 최고 등급에 도달했습니다. 더 이상 고급 운산이 필요하지 않습니다.','운산칩'],
  ms: ['Simpan disyorkan','Buang disyorkan','Ketiga-tiga Metrik Lanjutan telah mencapai maksimum','Ketiga-tiga Metrik Lanjutan telah mencapai pangkat maksimum. Perlombongan Data lanjut tidak diperlukan.','Cip Komputer'],
  pl: ['Zalecane zapisanie','Zalecane odrzucenie','Wszystkie trzy zaawansowane statystyki osiągnęły maksimum','Wszystkie trzy zaawansowane statystyki osiągnęły najwyższą rangę. Nie potrzeba dalszego cyklu wydobywania danych.','Procesory'],
  pt: ['Salvar recomendado','Descartar recomendado','Os três Atributos Avançados chegaram ao máximo','Os três Atributos Avançados chegaram ao nível máximo. Não é necessário fazer outra Mineração de Dados.','Chips de Computação'],
  ru: ['Рекомендуется сохранить','Рекомендуется сбросить','Все три расширенных параметра достигли максимума','Все три расширенных параметра достигли максимального ранга. Дальнейшее извлечение данных не требуется.','вычислительных чипов'],
  es: ['Guardar recomendado','Descartar recomendado','Los tres indicadores avanzados están al máximo','Los tres indicadores avanzados han alcanzado el rango máximo. No hace falta otro ciclo de extracción de datos.','chips informáticos'],
  th: ['แนะนำให้บันทึก','แนะนำให้ละทิ้ง','เมตริกขั้นสูงทั้ง 3 รายการถึงระดับสูงสุดแล้ว','เมตริกขั้นสูงทั้ง 3 รายการถึงระดับสูงสุดแล้ว ไม่จำเป็นต้องขุดข้อมูลเพิ่มเติม','ชิปประมวลผล'],
  tr: ['Kaydetmeniz önerilir','Atmanız önerilir','Üç Gelişmiş Metrik de maksimum seviyede','Üç Gelişmiş Metrik de en yüksek dereceye ulaştı. Yeni bir Veri Madenciliği döngüsü gerekmiyor.','Hesaplama Çipi'],
  vi: ['Lưu được đề xuất','Loại bỏ được đề xuất','Cả ba Số Liệu Nâng Cao đều đạt tối đa','Cả ba Số Liệu Nâng Cao đã đạt bậc tối đa. Không cần Khai Phá Dữ Liệu thêm.','Chip Điện Toán'],
};
for (const { code } of languages) {
  if (code !== 'zh-CN') [messages[code].accept, messages[code].discard] = gameActionLabels[code];
  [messages[code].complete, messages[code].completeText] = [gameActionLabels[code][2], gameActionLabels[code][3]];
  if (code !== 'zh-CN') messages[code].unit = gameActionLabels[code][4];
  const chip = gameActionLabels[code][4];
  const lockWarnings = {
    'zh-CN':'根据现有数据，推荐您任何时候都选择消耗5张计算卡同时洗练3个词条。',
    'zh-TW':`根據現有資料，建議您任何時候都消耗5個${chip}同時洗練3個詞條。`,
    en:`Based on available game data, refine all three attributes together at any time for 5 ${chip}.`,
    ar:`استنادًا إلى بيانات اللعبة، نوصي دائمًا بتنفيذ التنقيب عن البيانات للسمات الثلاث معًا باستخدام 5 ${chip}.`,
    fr:`D’après les données du jeu, nous recommandons de lancer l’extraction de données sur les 3 attributs ensemble avec 5 ${chip}.`,
    de:`Nach den Spieldaten empfehlen wir, alle 3 Attribute jederzeit gemeinsam mit 5 ${chip} durch Data-Mining zu verbessern.`,
    id:`Berdasarkan data game, kami menyarankan Data Mining ketiga atribut sekaligus dengan 5 ${chip} kapan saja.`,
    it:`In base ai dati di gioco, consigliamo di eseguire l’estrazione dati su tutti e 3 gli attributi insieme usando 5 ${chip}.`,
    ja:`ゲームデータに基づき、いつでも${chip}を5枚使って3属性を同時に高精度演算することをおすすめします。`,
    ko:`게임 데이터에 따르면 언제든 ${chip} 5개를 사용해 세 속성을 함께 고급 운산하는 것을 권장합니다.`,
    ms:`Berdasarkan data permainan, kami mengesyorkan Perlombongan Data ketiga-tiga atribut bersama-sama pada bila-bila masa dengan 5 ${chip}.`,
    pl:`Na podstawie danych gry zalecamy w dowolnym momencie wydobywanie danych dla wszystkich 3 atrybutów jednocześnie przy użyciu 5 ${chip}.`,
    pt:`Com base nos dados do jogo, recomendamos fazer Mineração de Dados nos 3 atributos juntos a qualquer momento usando 5 ${chip}.`,
    ru:`По данным игры, мы рекомендуем в любой момент выполнять извлечение данных для всех 3 параметров одновременно за 5 ${chip}.`,
    es:`Según los datos del juego, recomendamos extraer datos de los 3 atributos a la vez en cualquier momento usando 5 ${chip}.`,
    th:`จากข้อมูลในเกม เราแนะนำให้ขุดข้อมูลทั้ง 3 คุณสมบัติพร้อมกันทุกครั้ง โดยใช้${chip} 5 ชิ้น`,
    tr:`Oyun verilerine göre, her zaman 5 ${chip} kullanarak 3 özelliği birlikte Veri Madenciliği yapmanızı öneririz.`,
    vi:`Theo dữ liệu trò chơi, chúng tôi khuyên bạn Khai Phá Dữ Liệu cả 3 thuộc tính cùng lúc bằng 5 ${chip} bất cứ khi nào.`,
  };
  messages[code].lockWarning = lockWarnings[code];
}

// 当前模式只区分三条一起洗练和两条一起洗练；锁定项由词条行内的锁按钮选择。
const selectionLabels = {
  'zh-CN': { two: '洗练两个词条 · {cost} 张', chooseLock: '请点击小锁，选择你在游戏中锁定的词条。', lockAttribute: '锁定词条 {n}', unlockAttribute: '解锁词条 {n}' },
  'zh-TW': { two: '洗練兩個詞條 · {cost} 張', chooseLock: '請點擊小鎖，選擇你在遊戲中鎖定的詞條。', lockAttribute: '鎖定詞條 {n}', unlockAttribute: '解除鎖定詞條 {n}' },
  en: { two: 'Data Mine two Advanced Metrics · {cost} Compute Chips', chooseLock: 'Click the small lock beside the Advanced Metric you locked in-game.', lockAttribute: 'Lock Advanced Metric {n}', unlockAttribute: 'Unlock Advanced Metric {n}' },
  ar: { two: 'تنقيب البيانات لمقياسين متقدمين · {cost} شرائح الحوسبة', chooseLock: 'انقر على القفل الصغير بجوار المقياس المتقدم الذي قفلته في اللعبة.', lockAttribute: 'قفل المقياس المتقدم {n}', unlockAttribute: 'إلغاء قفل المقياس المتقدم {n}' },
  fr: { two: 'Extraire les données de deux indicateurs avancés · {cost} puces informatiques', chooseLock: 'Cliquez sur le petit cadenas à côté de l’indicateur avancé verrouillé dans le jeu.', lockAttribute: 'Verrouiller l’indicateur avancé {n}', unlockAttribute: 'Déverrouiller l’indicateur avancé {n}' },
  de: { two: 'Data-Mining für zwei fortgeschrittene Kennzahlen · {cost} Computerchips', chooseLock: 'Klicke auf das kleine Schloss neben der Fortgeschrittenen Kennzahl, die du im Spiel gesperrt hast.', lockAttribute: 'Fortgeschrittene Kennzahl {n} sperren', unlockAttribute: 'Fortgeschrittene Kennzahl {n} entsperren' },
  id: { two: 'Data Mining untuk dua Advanced Metric · {cost} Chip Komputasi', chooseLock: 'Klik ikon gembok kecil di samping Advanced Metric yang kamu kunci di dalam game.', lockAttribute: 'Kunci Advanced Metric {n}', unlockAttribute: 'Buka kunci Advanced Metric {n}' },
  it: { two: 'Estrai dati per due statistiche avanzate · {cost} microchip', chooseLock: 'Fai clic sul piccolo lucchetto accanto alla statistica avanzata che hai bloccato nel gioco.', lockAttribute: 'Blocca statistica avanzata {n}', unlockAttribute: 'Sblocca statistica avanzata {n}' },
  ja: { two: '2つの高級データを同時に高精度演算 · {cost} 演算チップ', chooseLock: 'ゲーム内でロックした高級データの横にある小さな鍵をクリックしてください。', lockAttribute: '高級データ {n} をロック', unlockAttribute: '高級データ {n} のロックを解除' },
  ko: { two: '고급 데이터 2개 함께 고급 운산 · {cost} 운산칩', chooseLock: '게임에서 잠근 고급 데이터 옆의 작은 자물쇠를 클릭하세요.', lockAttribute: '고급 데이터 {n} 잠금', unlockAttribute: '고급 데이터 {n} 잠금 해제' },
  ms: { two: 'Lombong data untuk dua Metrik Lanjutan · {cost} Cip Komputer', chooseLock: 'Klik ikon mangga kecil di sebelah Metrik Lanjutan yang anda kunci dalam permainan.', lockAttribute: 'Kunci Metrik Lanjutan {n}', unlockAttribute: 'Buka kunci Metrik Lanjutan {n}' },
  pl: { two: 'Wydobywanie danych dla dwóch zaawansowanych statystyk · {cost} procesory', chooseLock: 'Kliknij małą kłódkę obok zaawansowanej statystyki zablokowanej w grze.', lockAttribute: 'Zablokuj zaawansowaną statystykę {n}', unlockAttribute: 'Odblokuj zaawansowaną statystykę {n}' },
  pt: { two: 'Minerar dados de dois Atributos Avançados · {cost} Chips de Computação', chooseLock: 'Clique no pequeno cadeado ao lado do Atributo Avançado bloqueado no jogo.', lockAttribute: 'Bloquear Atributo Avançado {n}', unlockAttribute: 'Desbloquear Atributo Avançado {n}' },
  ru: { two: 'Извлечь данные для двух расширенных параметров · {cost} вычислительных чипов', chooseLock: 'Нажмите на маленький замок рядом с расширенным параметром, заблокированным в игре.', lockAttribute: 'Заблокировать расширенный параметр {n}', unlockAttribute: 'Разблокировать расширенный параметр {n}' },
  es: { two: 'Extraer datos de dos indicadores avanzados · {cost} chips informáticos', chooseLock: 'Haz clic en el candado pequeño junto al indicador avanzado bloqueado en el juego.', lockAttribute: 'Bloquear indicador avanzado {n}', unlockAttribute: 'Desbloquear indicador avanzado {n}' },
  th: { two: 'ขุดข้อมูลเมตริกขั้นสูง 2 รายการ · {cost} ชิปประมวลผล', chooseLock: 'คลิกไอคอนรูปกุญแจเล็กข้างเมตริกขั้นสูงที่ล็อกไว้ในเกม', lockAttribute: 'ล็อกเมตริกขั้นสูง {n}', unlockAttribute: 'ปลดล็อกเมตริกขั้นสูง {n}' },
  tr: { two: 'İki Gelişmiş Metrik için Veri Madenciliği · {cost} Hesaplama Çipi', chooseLock: 'Oyunda kilitlediğin Gelişmiş Metrik yanındaki küçük kilide tıkla.', lockAttribute: '{n}. Gelişmiş Metrik kilitle', unlockAttribute: '{n}. Gelişmiş Metrik kilidini aç' },
  vi: { two: 'Khai Phá Dữ Liệu hai Số Liệu Nâng Cao · {cost} Chip Điện Toán', chooseLock: 'Nhấp vào biểu tượng khóa nhỏ bên cạnh Số Liệu Nâng Cao bạn đã khóa trong trò chơi.', lockAttribute: 'Khóa Số Liệu Nâng Cao {n}', unlockAttribute: 'Mở khóa Số Liệu Nâng Cao {n}' },
};
for (const { code } of languages) {
  messages[code].two = selectionLabels[code].two;
  messages[code].chooseLock = selectionLabels[code].chooseLock;
  messages[code].lockAttribute = selectionLabels[code].lockAttribute;
  messages[code].unlockAttribute = selectionLabels[code].unlockAttribute;
  delete messages[code].lock;
}

const probabilityLabels = {
  'zh-CN': { viewProbabilities:'升降品概率', probabilityTitle:'深度计算概率柱状图', probabilityCaption:'每根柱子表示当前品阶下单个词条的升降概率。', probabilityTable:'查看概率数值', probabilityAxis:'当前品阶', probabilityPercent:'概率', probabilityConfig:'当前配置 {group} · 上限 {cap} 品', probabilityDecreaseTwo:'−2 品', probabilityDecreaseOne:'−1 品', probabilityUnchanged:'不变', probabilityIncreaseOne:'+1 品', probabilityIncreaseTwo:'+2 品', close:'关闭' },
  'zh-TW': { viewProbabilities:'升降品機率', probabilityTitle:'深度計算機率長條圖', probabilityCaption:'每根長條表示目前品階下單一詞條的升降機率。', probabilityTable:'查看機率數值', probabilityAxis:'目前品階', probabilityPercent:'機率', probabilityConfig:'目前配置 {group} · 上限 {cap} 品', probabilityDecreaseTwo:'−2 品', probabilityDecreaseOne:'−1 品', probabilityUnchanged:'不變', probabilityIncreaseOne:'+1 品', probabilityIncreaseTwo:'+2 品', close:'關閉' },
  en: { viewProbabilities:'Rank change probabilities', probabilityTitle:'Data Mining probability chart', probabilityCaption:'Each bar shows one Advanced Metric’s rank-change probabilities at its current rank.', probabilityTable:'View probability values', probabilityAxis:'Current rank', probabilityPercent:'Probability', probabilityConfig:'Current configuration {group} · rank cap {cap}', probabilityDecreaseTwo:'−2 ranks', probabilityDecreaseOne:'−1 rank', probabilityUnchanged:'No change', probabilityIncreaseOne:'+1 rank', probabilityIncreaseTwo:'+2 ranks', close:'Close' },
  ar: { viewProbabilities:'احتمالات تغيّر الجودة', probabilityTitle:'مخطط احتمالات التنقيب عن البيانات', probabilityCaption:'يمثل كل عمود احتمال تغيّر جودة سمة واحدة عند الجودة الحالية.', probabilityTable:'عرض قيم الاحتمالات', probabilityAxis:'الجودة الحالية', probabilityPercent:'الاحتمال', probabilityConfig:'الإعداد الحالي {group} · الحد الأقصى {cap}', probabilityDecreaseTwo:'−٢ جودة', probabilityDecreaseOne:'−١ جودة', probabilityUnchanged:'بلا تغيير', probabilityIncreaseOne:'+١ جودة', probabilityIncreaseTwo:'+٢ جودة', close:'إغلاق' },
  fr: { viewProbabilities:'Probabilités de changement de qualité', probabilityTitle:'Graphique des probabilités d’extraction de données', probabilityCaption:'Chaque barre indique la probabilité de changement de qualité d’un attribut à la qualité actuelle.', probabilityTable:'Voir les valeurs des probabilités', probabilityAxis:'Qualité actuelle', probabilityPercent:'Probabilité', probabilityConfig:'Configuration actuelle {group} · plafond {cap}', probabilityDecreaseTwo:'−2 qualités', probabilityDecreaseOne:'−1 qualité', probabilityUnchanged:'Aucun changement', probabilityIncreaseOne:'+1 qualité', probabilityIncreaseTwo:'+2 qualités', close:'Fermer' },
  de: { viewProbabilities:'Wahrscheinlichkeiten für Qualitätsänderungen', probabilityTitle:'Wahrscheinlichkeitsdiagramm für Data-Mining', probabilityCaption:'Jeder Balken zeigt die Wahrscheinlichkeit einer Qualitätsänderung für ein Attribut bei der aktuellen Qualität.', probabilityTable:'Wahrscheinlichkeitswerte ansehen', probabilityAxis:'Aktuelle Qualität', probabilityPercent:'Wahrscheinlichkeit', probabilityConfig:'Aktuelle Konfiguration {group} · Obergrenze {cap}', probabilityDecreaseTwo:'−2 Qualität', probabilityDecreaseOne:'−1 Qualität', probabilityUnchanged:'Keine Änderung', probabilityIncreaseOne:'+1 Qualität', probabilityIncreaseTwo:'+2 Qualität', close:'Schließen' },
  id: { viewProbabilities:'Probabilitas perubahan kualitas', probabilityTitle:'Grafik probabilitas Data Mining', probabilityCaption:'Setiap batang menunjukkan peluang perubahan kualitas untuk satu atribut pada kualitas saat ini.', probabilityTable:'Lihat nilai probabilitas', probabilityAxis:'Kualitas saat ini', probabilityPercent:'Probabilitas', probabilityConfig:'Konfigurasi saat ini {group} · batas {cap}', probabilityDecreaseTwo:'−2 kualitas', probabilityDecreaseOne:'−1 kualitas', probabilityUnchanged:'Tidak berubah', probabilityIncreaseOne:'+1 kualitas', probabilityIncreaseTwo:'+2 kualitas', close:'Tutup' },
  it: { viewProbabilities:'Probabilità di variazione della qualità', probabilityTitle:'Grafico delle probabilità di estrazione dati', probabilityCaption:'Ogni barra mostra la probabilità di variazione della qualità di un attributo al livello attuale.', probabilityTable:'Visualizza i valori di probabilità', probabilityAxis:'Qualità attuale', probabilityPercent:'Probabilità', probabilityConfig:'Configurazione attuale {group} · limite {cap}', probabilityDecreaseTwo:'−2 qualità', probabilityDecreaseOne:'−1 qualità', probabilityUnchanged:'Nessuna variazione', probabilityIncreaseOne:'+1 qualità', probabilityIncreaseTwo:'+2 qualità', close:'Chiudi' },
  ja: { viewProbabilities:'品質変化の確率', probabilityTitle:'高精度演算の確率グラフ', probabilityCaption:'各棒は、現在の品質における1属性の品質変化確率を示します。', probabilityTable:'確率の数値を見る', probabilityAxis:'現在の品質', probabilityPercent:'確率', probabilityConfig:'現在の設定 {group} · 上限 {cap}', probabilityDecreaseTwo:'品質 −2', probabilityDecreaseOne:'品質 −1', probabilityUnchanged:'変化なし', probabilityIncreaseOne:'品質 +1', probabilityIncreaseTwo:'品質 +2', close:'閉じる' },
  ko: { viewProbabilities:'품질 변화 확률', probabilityTitle:'고급 운산 확률 차트', probabilityCaption:'각 막대는 현재 품질에서 속성 하나의 품질 변화 확률을 나타냅니다.', probabilityTable:'확률 수치 보기', probabilityAxis:'현재 품질', probabilityPercent:'확률', probabilityConfig:'현재 설정 {group} · 상한 {cap}', probabilityDecreaseTwo:'품질 −2', probabilityDecreaseOne:'품질 −1', probabilityUnchanged:'변화 없음', probabilityIncreaseOne:'품질 +1', probabilityIncreaseTwo:'품질 +2', close:'닫기' },
  ms: { viewProbabilities:'Kebarangkalian perubahan kualiti', probabilityTitle:'Carta kebarangkalian Perlombongan Data', probabilityCaption:'Setiap bar menunjukkan kebarangkalian perubahan kualiti bagi satu atribut pada kualiti semasa.', probabilityTable:'Lihat nilai kebarangkalian', probabilityAxis:'Kualiti semasa', probabilityPercent:'Kebarangkalian', probabilityConfig:'Konfigurasi semasa {group} · had {cap}', probabilityDecreaseTwo:'−2 kualiti', probabilityDecreaseOne:'−1 kualiti', probabilityUnchanged:'Tiada perubahan', probabilityIncreaseOne:'+1 kualiti', probabilityIncreaseTwo:'+2 kualiti', close:'Tutup' },
  pl: { viewProbabilities:'Prawdopodobieństwo zmiany jakości', probabilityTitle:'Wykres prawdopodobieństwa wydobywania danych', probabilityCaption:'Każdy słupek pokazuje prawdopodobieństwo zmiany jakości jednego atrybutu przy obecnej jakości.', probabilityTable:'Zobacz wartości prawdopodobieństwa', probabilityAxis:'Obecna jakość', probabilityPercent:'Prawdopodobieństwo', probabilityConfig:'Obecna konfiguracja {group} · limit {cap}', probabilityDecreaseTwo:'−2 jakości', probabilityDecreaseOne:'−1 jakość', probabilityUnchanged:'Bez zmian', probabilityIncreaseOne:'+1 jakość', probabilityIncreaseTwo:'+2 jakości', close:'Zamknij' },
  pt: { viewProbabilities:'Probabilidades de mudança de qualidade', probabilityTitle:'Gráfico de probabilidades da Mineração de Dados', probabilityCaption:'Cada barra mostra a probabilidade de mudança de qualidade de um atributo na qualidade atual.', probabilityTable:'Ver valores de probabilidade', probabilityAxis:'Qualidade atual', probabilityPercent:'Probabilidade', probabilityConfig:'Configuração atual {group} · limite {cap}', probabilityDecreaseTwo:'−2 qualidades', probabilityDecreaseOne:'−1 qualidade', probabilityUnchanged:'Sem mudança', probabilityIncreaseOne:'+1 qualidade', probabilityIncreaseTwo:'+2 qualidades', close:'Fechar' },
  ru: { viewProbabilities:'Вероятности изменения качества', probabilityTitle:'График вероятностей извлечения данных', probabilityCaption:'Каждый столбец показывает вероятность изменения качества одного параметра при текущем качестве.', probabilityTable:'Посмотреть значения вероятностей', probabilityAxis:'Текущее качество', probabilityPercent:'Вероятность', probabilityConfig:'Текущая конфигурация {group} · предел {cap}', probabilityDecreaseTwo:'−2 качества', probabilityDecreaseOne:'−1 качество', probabilityUnchanged:'Без изменений', probabilityIncreaseOne:'+1 качество', probabilityIncreaseTwo:'+2 качества', close:'Закрыть' },
  es: { viewProbabilities:'Probabilidades de cambio de calidad', probabilityTitle:'Gráfico de probabilidades de extracción de datos', probabilityCaption:'Cada barra muestra la probabilidad de cambio de calidad de un atributo en la calidad actual.', probabilityTable:'Ver valores de probabilidad', probabilityAxis:'Calidad actual', probabilityPercent:'Probabilidad', probabilityConfig:'Configuración actual {group} · límite {cap}', probabilityDecreaseTwo:'−2 calidades', probabilityDecreaseOne:'−1 calidad', probabilityUnchanged:'Sin cambios', probabilityIncreaseOne:'+1 calidad', probabilityIncreaseTwo:'+2 calidades', close:'Cerrar' },
  th: { viewProbabilities:'ความน่าจะเป็นของการเปลี่ยนระดับ', probabilityTitle:'กราฟความน่าจะเป็นของการขุดข้อมูล', probabilityCaption:'แท่งแต่ละแท่งแสดงความน่าจะเป็นที่ระดับของคุณสมบัติหนึ่งรายการจะเปลี่ยน ณ ระดับปัจจุบัน', probabilityTable:'ดูค่าความน่าจะเป็น', probabilityAxis:'ระดับปัจจุบัน', probabilityPercent:'ความน่าจะเป็น', probabilityConfig:'การกำหนดค่าปัจจุบัน {group} · สูงสุด {cap}', probabilityDecreaseTwo:'ระดับ −2', probabilityDecreaseOne:'ระดับ −1', probabilityUnchanged:'ไม่เปลี่ยนแปลง', probabilityIncreaseOne:'ระดับ +1', probabilityIncreaseTwo:'ระดับ +2', close:'ปิด' },
  tr: { viewProbabilities:'Derece değişim olasılıkları', probabilityTitle:'Veri Madenciliği olasılık grafiği', probabilityCaption:'Her çubuk, mevcut derecede tek bir özelliğin derece değişimi olasılığını gösterir.', probabilityTable:'Olasılık değerlerini görüntüle', probabilityAxis:'Mevcut derece', probabilityPercent:'Olasılık', probabilityConfig:'Mevcut yapılandırma {group} · üst sınır {cap}', probabilityDecreaseTwo:'−2 derece', probabilityDecreaseOne:'−1 derece', probabilityUnchanged:'Değişiklik yok', probabilityIncreaseOne:'+1 derece', probabilityIncreaseTwo:'+2 derece', close:'Kapat' },
  vi: { viewProbabilities:'Xác suất thay đổi bậc', probabilityTitle:'Biểu đồ xác suất Khai Phá Dữ Liệu', probabilityCaption:'Mỗi cột biểu thị xác suất thay đổi bậc của một thuộc tính ở bậc hiện tại.', probabilityTable:'Xem giá trị xác suất', probabilityAxis:'Bậc hiện tại', probabilityPercent:'Xác suất', probabilityConfig:'Cấu hình hiện tại {group} · giới hạn {cap}', probabilityDecreaseTwo:'−2 bậc', probabilityDecreaseOne:'−1 bậc', probabilityUnchanged:'Không đổi', probabilityIncreaseOne:'+1 bậc', probabilityIncreaseTwo:'+2 bậc', close:'Đóng' },
};
for (const { code } of languages) {
  Object.assign(messages[code], probabilityLabels[code]);
  messages[code].probabilityAxis = messages[code].current;
  messages[code].probabilityDecreaseTwo = `−2 ${messages[code].quality}`;
  messages[code].probabilityDecreaseOne = `−1 ${messages[code].quality}`;
  messages[code].probabilityIncreaseOne = `+1 ${messages[code].quality}`;
  messages[code].probabilityIncreaseTwo = `+2 ${messages[code].quality}`;
}

const probabilityChartFallback = {
  'zh-CN': { probabilityChartLoadError:'概率图加载失败，仍可查阅下方概率数值。', probabilityChartRetry:'重试加载图表' },
  'zh-TW': { probabilityChartLoadError:'機率圖載入失敗，仍可查看下方機率數值。', probabilityChartRetry:'重試載入圖表' },
  en: { probabilityChartLoadError:'The probability chart could not load. You can still view the probability values below.', probabilityChartRetry:'Retry loading chart' },
  ar: { probabilityChartLoadError:'تعذر تحميل مخطط الاحتمالات. لا يزال بإمكانك الاطلاع على القيم أدناه.', probabilityChartRetry:'إعادة محاولة تحميل المخطط' },
  fr: { probabilityChartLoadError:'Le graphique des probabilités n’a pas pu être chargé. Les valeurs restent consultables ci-dessous.', probabilityChartRetry:'Réessayer de charger le graphique' },
  de: { probabilityChartLoadError:'Das Wahrscheinlichkeitsdiagramm konnte nicht geladen werden. Die Werte sind unten weiterhin verfügbar.', probabilityChartRetry:'Diagramm erneut laden' },
  id: { probabilityChartLoadError:'Grafik probabilitas gagal dimuat. Nilainya tetap dapat dilihat di bawah.', probabilityChartRetry:'Coba muat ulang grafik' },
  it: { probabilityChartLoadError:'Impossibile caricare il grafico delle probabilità. I valori sono comunque visibili qui sotto.', probabilityChartRetry:'Riprova a caricare il grafico' },
  ja: { probabilityChartLoadError:'確率グラフを読み込めませんでした。下の確率値は引き続き確認できます。', probabilityChartRetry:'グラフの読み込みを再試行' },
  ko: { probabilityChartLoadError:'확률 차트를 불러오지 못했습니다. 아래에서 확률 수치를 확인할 수 있습니다.', probabilityChartRetry:'차트 다시 불러오기' },
  ms: { probabilityChartLoadError:'Carta kebarangkalian gagal dimuatkan. Nilainya masih boleh dilihat di bawah.', probabilityChartRetry:'Cuba muatkan semula carta' },
  pl: { probabilityChartLoadError:'Nie udało się załadować wykresu prawdopodobieństwa. Wartości nadal można sprawdzić poniżej.', probabilityChartRetry:'Ponów ładowanie wykresu' },
  pt: { probabilityChartLoadError:'Não foi possível carregar o gráfico de probabilidades. Ainda é possível consultar os valores abaixo.', probabilityChartRetry:'Tentar carregar o gráfico novamente' },
  ru: { probabilityChartLoadError:'Не удалось загрузить график вероятностей. Значения по-прежнему доступны ниже.', probabilityChartRetry:'Повторить загрузку графика' },
  es: { probabilityChartLoadError:'No se pudo cargar el gráfico de probabilidades. Aún puedes consultar los valores de abajo.', probabilityChartRetry:'Volver a cargar el gráfico' },
  th: { probabilityChartLoadError:'โหลดกราฟความน่าจะเป็นไม่สำเร็จ แต่ยังดูค่าความน่าจะเป็นด้านล่างได้', probabilityChartRetry:'ลองโหลดกราฟอีกครั้ง' },
  tr: { probabilityChartLoadError:'Olasılık grafiği yüklenemedi. Aşağıdaki olasılık değerlerini yine de görebilirsiniz.', probabilityChartRetry:'Grafiği yeniden yükle' },
  vi: { probabilityChartLoadError:'Không thể tải biểu đồ xác suất. Bạn vẫn có thể xem các giá trị xác suất bên dưới.', probabilityChartRetry:'Thử tải lại biểu đồ' },
};
for (const { code } of languages) Object.assign(messages[code], probabilityChartFallback[code]);

export { languages, messages };

export function detectLanguage(browserLanguages = []) {
  for (const raw of browserLanguages) {
    if (typeof raw !== 'string') continue;
    const normalized = raw.replace('_','-').toLowerCase();
    if (normalized.startsWith('zh-')) {
      if (/zh-(hant|tw|hk|mo)/i.test(normalized)) return 'zh-TW';
      if (/zh-(hans|cn|sg|my)/i.test(normalized)) return 'zh-CN';
    }
    const base = normalized.split('-')[0];
    if (base === 'zh') return 'zh-CN';
    if (messages[base]) return base;
  }
  return 'en';
}

export function translate(code, key, values = {}) {
  const dictionary = messages[code];
  if (!dictionary || !Object.hasOwn(dictionary, key)) throw new Error(`Missing translation: ${code}.${key}`);
  return dictionary[key].replace(/\{([a-zA-Z][\w]*)\}/g, (match, name) => Object.hasOwn(values, name) ? String(values[name]) : match);
}
