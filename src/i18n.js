// 国际化文本与浏览器语言识别。
const zhCN = {
  title: '深度计算器', intro: '录入品阶，判断本次结果是否值得保留。', language: '语言', current: '当前品阶', result: '本次洗练结果',
  attribute: '词条 {n}', quality: '品', mode: '洗练方式', all: '三条一起洗练 · {cost} 张', lock: '锁定词条 {n} · {cost} 张',
  goal: '目标：三条均达到 {cap} 品', compare: '查看建议', reset: '重置', loading: '正在加载模型…', loadError: '数据加载失败，请刷新重试。', retry: '重试',
  equalNote: '默认三个词条等价；实际上根据玩家的兵卡配置，三个词条的价值并不完全相同。', modelNote: '暂定模型：结果独立抽取，配置索引视为当前品阶；不计保底与追赶效果。',
  version: '游戏版本 {game} · runtime {runtime}', method: '模型与使用说明', methodText: '建议比较整组结果到三条满品所需的期望剩余深度计算卡，不只比较总品阶。已支付的本次洗练费用不影响保留与放弃的比较。',
  lockedNote: '锁定模式只比较本次结果，后续期望耗卡按不锁策略计算。', unsupported: '该结果不在当前配置的概率表内，建议仅供参考；服务端选档或补偿规则尚未确认。',
  accept: '建议保留', discard: '建议放弃', indifferent: '两种选择等价', complete: '已达到目标', completeText: '三个词条都已满品，无需继续洗练。',
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
  {code:'zh-CN',name:'简体中文',dir:'ltr'},{code:'zh-TW',name:'繁體中文',dir:'ltr'},
  ...[['en','English'],['ar','العربية'],['fr','Français'],['de','Deutsch'],['id','Bahasa Indonesia'],['it','Italiano'],['ja','日本語'],['ko','한국어'],['ms','Bahasa Melayu'],['pl','Polski'],['pt','Português'],['ru','Русский'],['es','Español'],['th','ไทย'],['tr','Türkçe'],['vi','Tiếng Việt']].map(([code,name])=>({code,name,dir:code==='ar'?'rtl':'ltr'}))
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
