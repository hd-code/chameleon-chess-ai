# Auswertung

Nun folgt der finale Schritt, in dem alle Algorithmen gegeneinander antreten und der beste ermittelt wird.

## Bewertungsfunktionen

Als erstes gilt es die beste Bewertungsfunktion zu finden. Diese wird dann im Folgenden für alle Algorithmen verwendet. Dazu sind vier Instanzen des Max^N^-Algorithmus erzeugt worden, jede mit einer anderen Bewertungsfunktion. Da das Session-Framework auch vier Algorithmen gleichzeitig gegeneinander antreten lassen kann, werden alle vier Instanzen gleichzeitig gegeneinander spielen.

Um die Effektivität der Bewertungsfunktionen miteinander vergleichen zu können, sollten die Algorithmen eine feste Suchtiefe haben. Tendenziell werden die Algorithmen ja umso stärker, je weiter sie den Spielbaum aufbauen und in die Zukunft schauen können. Daher ist die Vergleichbarkeit nur bei einer statischen Suchtiefe gegeben.

Es sind insgesamt vier Sessions gespielt worden. Die vorgegebene feste Suchtiefe betrug eins, zwei, drei und vier. Die folgende Tabelle fasst die Ergebnisse dieser vier Sessions zusammen:

| Algorithmus | Siege | Unentschieden | Niederlagen | Rechenzeit in ms |
|-------------|------:|------:|------:|------:
| countPawns         | 13 | 0 | 83 | 659 |
| countPawns10Roles  | 29 | 4 | 63 | 503 |
| countPawns100Roles | 29 | 3 | 64 | 523 |
| countPawns100Moves | 19 | 6 | 71 | 1.857 |

: Vergleich der Bewertungsfunktionen mit fester Tiefe

Da vier Algorithmen gegeneinander angetreten sind, wurden 24 Spiele pro Session gespielt. In der Tabelle ist für jede Bewertungsfunktion aufgelistet, wie häufig diese gewonnen, verloren oder unentschieden gespielt hat. Außerdem ist die durchschnittliche Rechenzeit angegeben.

Die Anzahl an gewonnenen, verlorenen und unentschieden geendeten Spielen für eine Bewertungsfunktion ist der wichtigste Indikator dafür, wie gut die jeweilige Funktion ist. Je besser die Qualität der vorhergesagten Auszahlung, desto besser spielt ein Algorithmus. Eine überlegene Bewertungsfunktion müsste bei gleicher Suchtiefe bessere Vorhersagen liefern. Dadurch trifft der Algorithmus bessere Entscheidungen und gewinnt häufiger. Die Anzahl der Siege ist damit die zentrale Metrik, um zu bestimmen, welche Bewertungsfunktion die beste ist.

Es fällt direkt auf, dass der `countPawns` am schlechtesten gespielt hat. Er hat die wenigsten Siege erringen können und am häufigsten verloren. Diese Bewertungsfunktion bestimmt die Auszahlung anhand der Anzahl der Figuren je Spieler. Die Rollen der Figuren werden nicht betrachtet. Allerdings ist ja gerade ein Hauptmerkmal von "Chamäleon Schach", dass sich die Rollen der Figuren ständig ändern. Insofern ist nicht verwunderlich, dass diese Bewertungsfunktion den anderen unterlegen ist. Alle anderen lassen zusätzlich noch die Rolle einer Figur mit in die Bewertung einfließen.

Eine zweite sehr erstaunliche Erkenntnis ist ebenfalls zu sehen: Der `countPawns100Moves` braucht im Schnitt die drei- bis vierfache Rechenzeit. Die anderen Bewertungsfunktionen brauchen zwischen 503 und 659 Millisekunden; `countPawns100Moves` liegt bei 1.857 Millisekunden. Bei dieser Funktion wird zu der Anzahl der Figuren je Spieler zusätzlich noch gezählt, wieviele mögliche Züge die jeweiligen Figuren aktuell ausführen können. Anscheinend ist dies ein sehr aufwendiger Vorgang. Da diese Bewertungsfunktion auch nur recht mittelmäßig abgeschnitten hat, wird sie ebenfalls nicht weiter verwendet werden. Es ist wichtig, dass die Algorithmen so viele Berechnungen wie möglich in der kurzen verfügbaren Zeit durchführen. Da ist eine langsame Bewertungsfunktion nicht brauchbar.

Damit bleiben noch `countPawns10Roles` und `countPawns100Roles` übrig. Beide führen eine Rollengewichtung anhand von festen Punkten je Rolle durch ([siehe vorheriges Kapitel](#bewfunk)). Der Unterschied liegt darin, wie stark dazu die Anzahl der Figuren je Spieler gewichtet wird. Beide Funktionen liefern in etwa die gleiche Performance. Beide haben jeweils 29 mal gewonnen, der `countPawns10Roles` hat einmal mehr unentschieden gespielt.

Um einen klaren Sieger zu ermitteln, wird nun der Vorgang nur mit diesen beiden Funktionen wiederholt. Das heißt, es werden wieder vier Sessions gespielt. Dieses mal aber nur mit den beiden verbleibenden Bewertungsfunktionen. Die Ergebnisse sind in der folgenden Tabelle festgehalten:

| Algorithmus | Siege | Unentschieden | Niederlagen | Rechenzeit in ms |
|-------------|------:|------:|------:|------:|
| countPawns10Roles  | 71 | 4 | 77 | 607 |
| countPawns100Roles | 77 | 4 | 71 | 595 |

: Vergleich der Bewertungsfunktionen mit Rollengewichtung mit fester Tiefe

Im direkten Vergleich gegeneinander scheint der `countPawns100Roles` ein wenig besser abzuschneiden. Er hat 77 Spiele gewonnen, sein Kontrahent nur 71. Dieses Ergebnis deckt sich mit der Spielerfahrung des Autors: Der `countPawns100Roles` gewichtet die Anzahl der Figuren je Spieler deutlich stärker als sein Bruder. Dadurch ist es zwar auch wichtig, die eigenen Figuren möglichst gut zu positionieren, am wichtigsten ist es aber für die Funktion, keine Figuren zu verlieren. Der Autor kann bestätigen, dass es im Spiel am wichtigsten ist, dafür zu sorgen, dass keine eigenen Figuren geschlagen werden. Das ist viel wichtiger als eine starke Rolle inne zu haben.

Damit ist die Bewertungsfunktion für "Chamäleon Schach" gefunden: es ist der **`countPawns100Roles`**.

## Paranoid - normiert oder nicht

Bevor nun die verschiedenen Algorithmen gegeneinander antreten können, müssen noch zwei Fragen geklärt werden: Sowohl der Paranoid als auch der Hypermax verfügen beide über einen internen Mechanismus, um die Bewertungen der einzelnen Spieler gegeneinander zu gewichten. Daher ist die Normierung der Ergebnisse der Bewertungsfunktion (wie sie beim Max^N^ und beim Max^N^IS verwendet wird) eventuell obsolet.

Um festzustellen, welche Version verwendet werden soll, treten nun die Algorithmen einmal in der normierten und einmal in der nicht normierten Form gegeneinander an. Wie zuvor ist die Anzahl der gewonnenen Spiele die entscheidende Metrik. Sie zeigt, wie gut die berechneten Auszahlungen sind, auf deren Grundlage die Entscheidungen getroffen werden.

Als erstes wird der Paranoid betrachtet. Es sind vier Sessions mit konstanter Suchtiefe von eins, zwei, drei und vier gespielt worden. Das sind die Ergebnisse:

| Algorithmus | Siege | Unentschieden | Niederlagen | Rechenzeit in ms |
|-------------|------:|------:|------:|------:|
| n. normiert | 70 | 5 | 77 | 224 |
| normiert    | 77 | 5 | 70 | 228 |

: Vergleich des Paranoid mit und ohne Normierung mit fester Suchtiefe

Die normierte Version hat etwas besser abgeschnitten. Sie hat 77 Siege erringen können, die nicht normierte nur 70. Die Rechenzeit unterschiedet sich kaum. Die Normierung ist aber ein zusätzlicher Rechenschritt, daher benötigt die normierte Version vier Millisekunden länger.

Trotzdem soll nun sichergestellt werden, dass der Unterschied in der Rechenzeit wirklich keinen Einfluss auf das Ergebnis hat. Deswegen sind weitere drei Sessions gespielt worden: dieses mal mit einer vorgegebenen Rechenzeit von 10, 100 und 1.000 Millisekunden. Das sind die Ergebnisse:

| Algorithmus | Siege | Unentschieden | Niederlagen | Suchtiefe (Median) |
|-------------|------:|------:|------:|------:|------:|
| n. normiert | 45 | 3 | 66 | 3,50 |
| normiert    | 66 | 3 | 45 | 3,46 |

: Vergleich des Paranoid mit und ohne Normierung mit fester Rechenzeit

In diesem Modus ist die normierte Version sogar noch stärker als die nicht normierte. 66 Siege der normierten zu 45 Siegen der nicht normierten Version sprechen für sich. Durch den zusätzlichen Rechenschritt schafft die normierte Version nicht die gleiche Suchtiefe, aber die Werte liegen fast gleich auf. Warum zum Vergleich der Suchtiefe der Median verwendet wird, wird später erklärt.

Der Unterschied in der Performance lässt sich folgendermaßen erklären: In der nicht normierten Version werden die *isolierten Einzelbewertungen* der Spieler gegeneinander gerechnet. Die normierte Version hingegen gewichtet die *Gewinnwahrscheinlichkeiten* der Spieler gegeneinander. Die Gewinnwahrscheinlichkeiten sind in ihrem Charakter deutlich kompetitiver. Deswegen spielt diese Version des Paranoid besser.

Der Paranoid wird also im **normierten** Modus gegen die anderen Algorithmen antreten.

## Hypermax - normiert oder nicht

Der gleiche Vorgang wie beim Paranoid wird nun für den Hypermax wiederholt. Zunächst also die Ergebnisse von vier Sessions mit fester Suchtiefe von eins, zwei, drei und vier:

| Algorithmus | Siege | Unentschieden | Niederlagen | Rechenzeit in ms |
|-------------|------:|------:|------:|------:|
| n. normiert | 77 | 3 | 72 | 363 |
| normiert    | 72 | 3 | 77 | 369 |

: Vergleich des Hypermax mit und ohne Normierung mit fester Tiefe

Für den Hypermax scheint die nicht normierte Version geringfügig stärker zu sein. Sie hat 77 mal gewonnen, die normierte Version nur 72 mal. Fridenfalk [-@fridenfalk2014] hat selbst angeführt, dass seine Tranformation des Auszahlungsvektors in den "Zero-Space" vollkommen ausreichend ist, um die Auszahlungen gegeneinander zu gewichten. Die Normierung ist nur ein zusätzlicher Rechenschritt, der keinen Mehrwert liefert.

Zur Sicherheit werden noch drei weitere Sessions mit einer festen Rechenzeit von 10, 100 und 1.000 Millisekunden gespielt. Hier die Ergebnisse:

| Algorithmus | Siege | Unentschieden | Niederlagen | Suchtiefe (Median) |
|-------------|------:|------:|------:|------:|
| n. normiert | 55 | 6 | 53 | 3,76 |
| normiert    | 53 | 6 | 55 | 3,70 |

: Vergleich des Hypermax mit und ohne Normierung mit fester Rechenzeit

Auch hier scheint die nicht normierte Version leicht überlegen zu sein – sie hat zwei Spiele mehr gewonnen als die nicht normierte. Allerdings sind sechs Spiele unentschieden ausgegangen. Die Normierung hat also faktisch keinen wirklichen Einfluss auf die Performance des Hypermax. Die erreichte Suchtiefe ist aber etwas geringer mit Normierung aufgrund des zusätzlichen Rechenschritts, der stets durchgeführt werden muss.

Der Hypermax wird also **ohne Normierung** arbeiten.

## Bester Algorithmus für Chamäleon Schach

Endlich folgt die finale Auswertung. Es gilt, den besten Algorithmus für "Chamäleon Schach" zu finden. Wie zuvor, wird die Performance eines Algorithmus daran festgemacht, wie häufig er im Vergleich zu den anderen gewinnt.

Da insgesamt vier Algorithmen implementiert worden sind und "Chamäleon Schach" zu viert gespielt werden kann, treten alle vier gleichzeitig gegeneinander an. Als erstes sind vier Sessions mit fester Suchtiefe gespielt worden. Wie üblich waren die Suchtiefen eins, zwei, drei und vier. Die folgende Tabelle zeigt die Ergebnisse der vier Sessions:

| Algorithmus | Siege | Unentschieden | Niederlagen | Rechenzeit in ms |
|-------------|------:|------:|------:|------:|
| --- Suchtiefe: 1 | | | |
| Max^N^   | 6 | 0 | 18 | < 1 |
| Max^N^IS | 6 | 0 | 18 | < 1 |
| Hypermax | 6 | 0 | 18 | < 1 | 
| Paranoid | 6 | 0 | 18 | < 1 |
| --- Suchtiefe: 2 | | | |
| Max^N^   | 5 | 4 | 15 | 2 |
| Max^N^IS | 5 | 4 | 15 | 2 |
| Hypermax | 4 | 4 | 16 | 2 | 
| Paranoid | 4 | 0 | 20 | 3 |
| --- Suchtiefe: 3 | | | |
| Max^N^   | 8 | 0 | 16 | 70 |
| Max^N^IS | 8 | 0 | 16 | 69 |
| Hypermax | 8 | 0 | 16 | 69 | 
| Paranoid | 0 | 0 | 24 | 33 |
| --- Suchtiefe: 4 | | | |
| Max^N^   | 7 | 0 | 17 | 2.524 |
| Max^N^IS | 7 | 0 | 17 | 2.513 |
| Hypermax | 4 | 0 | 20 | 2.637 | 
| Paranoid | 6 | 0 | 18 |   651 |

: Vergleich der vier Algorithmen mit fester Suchtiefe

Mit einer Suchtiefe von eins spielen alle Algorithmen gleich gut. Dies ist nicht verwunderlich, da hier keine Rückwärtsauflösung und kein Pruning stattfindet. Da alle Algorithmen die gleiche Bewertungsfunktion verwenden, spielen sie alle komplett gleich.

Mit steigender Suchtiefe schneiden der Paranoid und der Hypermax immer schlechter im Vergleich zu den Max^N^-Algorithmen ab. Auch dieses Ergebnis ist zu erwarten gewesen. Der Hypermax beschneidet teilweise zu radikal den Spielbaum und liefert damit schlechtere Auszahlungen. Der Paranoid geht von der falschen Annahme aus, alle Gegner hätten sich gegen den Spieler verbündet. Bei beiden Algorithmen ist klar, dass die Qualität ihrer Ergebnisse mit steigender Suchtiefe immer schlechter wird. Ihr Vorteil soll darin liegen, dass sie durch effektiveres Pruning eine höhere Suchtiefe in der gleichen Rechenzeit erreichen und dadurch bessere "weitsichtigere" Auszahlungen liefern. Da hier alle Algorithmen die gleiche Suchtiefe verwenden, schneiden sie entsprechend schlechter ab.

Es ist außerdem sehr deutlich zu sehen, wie effektiv das Alpha-Beta Pruning im Paranoid funktioniert. Bei einer Suchtiefe von vier brauchen die anderen Algorithmen durchschnittlich circa 2.600 Millisekunden für die Berechnung. Der Paranoid ist mit 651 Millisekunden viel früher fertig.

Die Effektivität des Prunings im Hypermax ist nicht zu erkennen. Auf Suchtiefe vier ist er sogar der langsamste Algorithmus. Allerdings hat er da auch die meisten Spiele verloren. Gerade gegen Ende des Spieles gehen die Berechnungen sehr schnell, weil nur noch wenige Figuren übrig sind und die Spielbäume entsprechend kleiner werden. Das könnte der Grund sein, warum der Hypermax so "lange" braucht. Er hat einfach zu wenige "schnelle" Berechnungen aus dem Endspiel vorzuweisen.

Die entscheidende Frage ist aber, wie die Algorithmen gegeneinander abschneiden, wenn die Rechenzeit fest vorgegeben ist. Dies ist ja das Szenario, welches auch in der App verwendet wird. Außerdem können nun effektivere Pruning Verfahren den entscheidenden Unterschied liefern, da in der gleichen Zeit wesentlich mehr Züge im Spielbaum untersucht werden können. Daher sind nun drei Sessions mit fester Rechenzeit gespielt worden. Die verfügbaren Zeiten waren 10, 100 und 1.000 Millisekunden. Die folgende Tabelle zeigt die Ergebnisse:

| Algorithmus | Siege | Unentschieden | Niederlagen | Suchtiefe (Durchschnitt) | Suchtiefe (Median) |
|--------------|------:|-------:|------:|------:|------:|
| --- Rechenzeit: 10ms | | | |
| Max^N^   | 3 | 2 | 19 | 3,58 | 2,50 |
| Max^N^IS | 3 | 3 | 18 | 4,42 | 3,14 |
| Hypermax | 3 | 1 | 20 | 4,11 | 2,32 |
| Paranoid | 9 | 6 |  9 | 4,55 | 4,09 |
| --- Rechenzeit: 100ms | | | |
| Max^N^   |  5 | 2 | 17 | 4,97 | 3,50 |
| Max^N^IS | 11 | 1 | 12 | 5,98 | 3,90 |
| Hypermax |  3 | 2 | 19 | 5,39 | 3,57 |
| Paranoid |  2 | 1 | 21 | 5,27 | 4,08 |
| --- Rechenzeit: 1000ms | | | |
| Max^N^   |  9 | 0 | 15 | 5,17 | 4,08 |
| Max^N^IS | 10 | 1 | 13 | 7,60 | 4,11 |
| Hypermax |  4 | 0 | 20 | 5,37 | 4,02 |
| Paranoid |  0 | 1 | 23 | 6,06 | 4,21 |

: Vergleich der vier Algorithmen mit fester Rechenzeit

Die erreichte Suchtiefe ist in der Tabelle sowohl im Durchschnitt als auch im Median angegeben. Es ist deutlich zu sehen, dass der Durchschnitt stets wesentlich höher liegt als der Median. Außerdem ist die durchschnittliche Suchtiefe sehr "sprunghaft" (die Werte bei einer Rechenzeit von 1.000 Millisekunden sind sehr durchwachsen im Durchschnitt, im Median liegen sie viel näher beieinander). Der Hintergrund dazu ist, dass gegen Ende des Spieles die Spielbäume sehr klein werden, weil nur noch wenige Figuren übrig sind. Dadurch werden hier extrem hohe Suchtiefen erreicht. Ein Algorithmus, der sehr häufig gewinnt, hat dadurch sehr viele hohe Ausreißer in der Suchtiefe. Daher ist der Median der zuverlässigere Vergleichswert. Das ist auch der Grund, warum in den vorherigen Tabellen stets nur die Ergebnisse im Median angegeben worden sind.

Der Paranoid erreicht bei einer Rechenzeit von 10 Millisekunden eine sehr hohe Suchtiefe von 4,09. Damit liegt er viel höher als die anderen Algorithmen mit weitem Abstand. Diese hohe Suchtiefe ist mit Erfolg gekrönt. Er hat neun Spiele gewonnen und sechs unentschieden gespielt. Damit ist er der klare Sieger und es ist deutlich zu sehen, wie das effektive Pruning-Verfahren tatsächlich zu einer stärkeren Spielweise führt.

Dieser Erfolg ist allerdings nicht von Dauer. Bei einer Rechenzeit von 100 Millisekunden gewinnt der Paranoid nur noch zwei von 24 Spielen und bei einer Sekunde kann er gar keinen Sieg mehr vorweisen. In jedem Fall ist er der Algorithmus mit der höchsten erreichten Suchtiefe. Allerdings holen die anderen Algorithmen in Bezug auf die Suchtiefe sehr schnell auf. Dadurch fällt die "falsche" Prämisse des Paranoid immer stärker ins Gewicht und seine Performance sinkt rapide.

Je höher die verfügbare Rechenzeit ist, desto mehr gleichen sich die erreichten Suchtiefen der Algorithmen einander an. Dies ist damit zu erklären, dass die Komplexität des Spielbaumes exponentiell wächst. Die Pruning-Verfahren bringen nur in bestimmten Fällen eine Verbesserung der Rechenzeit. Die Komplexität wächst aber schneller als der Effekt der verschiedenen Pruning-Verfahren. Mit höherer Rechenzeit sinken also die Unterschiede in der erreichten Suchtiefe der Algorithmen. Mit anderen Worten, je mehr Zeit zur Verfügung steht, desto unwichtiger wird das verwendete Pruning-Verfahren.

Dieses Phänomen ist sehr deutlich beim Paranoid zu sehen. Bei einer Rechenzeit von 10 Millisekunden erreicht er eine Suchtiefe von 4,09. Mit der hundertfachen Rechenzeit (von einer Sekunde) liegt die erreichte Suchtiefe "nur" bei 4,21. Das ist zwar trotzdem die höchste Suchtiefe im Vergleich zu den anderen Algorithmen, dennoch ist es verwunderlich, dass beide Werte so nah beieinander liegen. Es muss allerdings berücksichtigt werden, dass der Paranoid bei der langen Rechenzeit gar kein Spiel mehr gewonnen hat. Dadurch ist er nie in der Endphase des Spieles gewesen, wo viele hohe Ergebnisse in der Suchtiefe erzielt werden.

Würde die verfügbare Rechenzeit in der App nur sehr kurz sein, dann wäre der Paranoid die beste Wahl. Da laut Design-Konzept aber eine Sekunde "Bedenkzeit" zur Verfügung steht, wird der Paranoid nicht als Computergegner für "Chamäleon Schach" verwendet werden.

Die persönliche Spielerfahrung des Autors gibt einen Hinweis darauf, warum der Paranoid so schlecht abgeschnitten hat: Es ist eine recht geschickte Taktik, sich zu Beginn des Spieles etwas "einzumauern". Man platziert seine Figuren so, dass sie sich alle gegenseitig decken. Dadurch haben die Gegner kaum Interesse, die eigenen Figuren zu schlagen. Nachdem sich die gegnerischen Spieler dann schon ein wenig gegenseitig "dezimiert" haben, wechselt man zu einer offensiveren Spielweise. Dieses Vorgehen hat sich schon öfter als sehr effektive Taktik erwiesen. Auf diese Spielweise würde der Paranoid allerdings nicht kommen, da er ja davon ausgeht, dass alle Gegner im Team zusammen spielen. Sie hätten demnach auch keinen Grund sich gegenseitig zu schlagen, aber genau das tun sie in Wirklichkeit rigoros. Daher ist der paranoide Ansatz in anderen Spielen sicher eine solide Lösung, für "Chamäleon Schach" macht er aber keinen Sinn – sofern genug Rechenzeit zur Verfügung steht.

Sehr enttäuschend ist das Ergebnis des Hypermax. Er hat in jeder Session nur drei oder vier Siege errungen. In den meisten Fällen ist er auch der Algorithmus mit der geringsten erreichten Suchtiefe. Das ist sehr erstaunlich, da der Max^N^ ja gar kein Pruning verwendet und trotzdem tiefer zu suchen scheint. Dies ist nur damit zu erklären, dass der Hypermax immer sehr früh im Spiel ausgeschieden ist. Gerade am Anfang sind viele Figuren auf dem Brett und die Spielbäume entsprechend komplex. Allerdings spricht etwas gegen diese Theorie: Seine durchschnittliche Suchtiefe liegt stets höher als die des Max^N^. Es scheint also noch andere Einflüsse zu geben, die aber aus den erhobenen Daten nicht ersichtlich sind. Tatsächlich spielt das aber auch keine große Rolle. Der Hypermax wird nicht als Algorithmus für "Chamäleon Schach" verwendet werden.

Damit bleiben noch die Max^N^-Algorithmen übrig. Sie lieferten beide sehr solide Ergebnisse. Ab 100 Millisekunden steht ihnen auch genügend Rechenzeit zur Verfügung, dass sie eine ordentliche Suchtiefe erreichen. Ab dieser Menge an verfügbarer Zeit sind sie die klaren Sieger und gewinnen praktisch jedes Spiel. Der Max^N^IS kann durch die Pruning-Verfahren tatsächlich den Spielbaum schneller durchsuchen und erreicht stets eine höhere Suchtiefe als der Max^N^ ohne Pruning. Dadurch spielt er auch besser und gewinnt mehr Spiele. Bei einer Rechenzeit von einer Sekunde erreicht der Max^N^IS sogar im Durchschnitt eine extrem hohe Suchtiefe von 7,6. Dieser Wert kommt vor allem dadurch zustande, dass der Max^N^IS die meisten Spiele gewonnen hat und demnach viele hohe Ausreißer in der Suchtiefe aus dem Endspiel hat. Hinzu kommt, dass die Pruning-Verfahren Immediate and Shallow Pruning vorwiegend gegen Ende des Spieles ihre volle Effektivität entwickeln. Dadurch nehmen die hohen Ausreißer noch extremere Werte an.

Insgesamt ist damit der beste Algorithmus für "Chamäleon Schach" gefunden: Es ist der **Max^N^IS**.

Der Vollständigkeit halber sind noch drei weitere Sessions gespielt worden. Hierbei sind die Algorithmen Max^N^IS, Hypermax und Paranoid nochmal einzeln gegeneinander angetreten. Sie haben mit einer festen Rechenzeit von einer Sekunde gegeneinander gespielt. Die Ergebnisse sind in den folgenden drei Tabellen festgehalten:

| Algorithmus | Siege | Unentschieden | Niederlagen | Suchtiefe (Durchschnitt) | Suchtiefe (Median) |
|-------------|------:|-------:|------:|------:|------:|
| Max^N^IS | 20 | 4 | 14 | 11.08 | 4.56 |
| Hypermax | 14 | 4 | 20 |  9.09 | 5.09 |

: Max^N^IS vs Hypermax mit fester Rechenzeit von 1.000ms

| Algorithmus | Siege | Unentschieden | Niederlagen | Suchtiefe (Durchschnitt) | Suchtiefe (Median) |
|-------------|------:|-------:|------:|------:|------:|
| Max^N^IS | 21 | 0 | 17 | 7.58 | 4.11 |
| Paranoid | 17 | 0 | 21 | 5.90 | 4.27 |

: Max^N^IS vs Paranoid mit fester Rechenzeit von 1.000ms

| Algorithmus | Siege | Unentschieden | Niederlagen | Suchtiefe (Durchschnitt) | Suchtiefe (Median) |
|-------------|------:|-------:|------:|------:|------:|
| Hypermax | 23 | 1 | 14 | 6.56 | 4.28 |
| Paranoid | 14 | 1 | 23 | 5.79 | 4.23 |

: Hypermax vs Paranoid mit fester Rechenzeit von 1.000ms

Die Ergebnisse bestätigen allerdings nur die vorherigen. Der Max^N^IS ist stets der Algorithmus mit den meisten Siegen. Der Paranoid ist bei diesen langen Rechenzeiten stets der Verlierer.

Auch der Hypermax schneidet genauso ab wie zuvor, in Bezug auf Siege und Niederlagen. Allerdings gibt es in diesem Versuch mehrere Spiele, in denen der Hypermax auch gewonnen hat. Damit ist er häufiger im Endspiel und erreicht wesentlich bessere Ergebnisse in der erreichten Suchtiefe. Tatsächlich ist er hier immer der Algorithmus mit der höchsten Suchtiefe. Er übertrifft sogar den Paranoid.

Trotzdem bringen diese Erkenntnisse keine Änderungen im Ergebnis: Der Sieger bleibt der **Max^N^IS**.
