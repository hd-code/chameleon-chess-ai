---
title: Implementierung eines Computergegners für das Spiel Chamäleon Schach (ein schachähnlichen Brettspiel)
author: Hannes Dröse
date: 
keywords: [chess,ai,td-learning,reinforcement-learning,minimax,maxn,chameleon-chess]
lang: de
header-includes: |
    \usepackage{amsmath}
    \DeclareMathOperator*{\argmax}{arg\,max}
    \DeclareMathOperator*{\argmin}{arg\,min}
documentclass: scrreprt
papersize: a4
bibliography: references.bib # -> funktioniert nicht !
toc: true
geometry:
- left=4cm
- right=3cm
- top=2.5cm
- bottom=2.5cm
abstract: |
  Zusammenfassung der Arbeit ...
nocite: |
  @*
# pagenumbering: Roman
---

# Ziel dieser Arbeit

- Implementierung eines Computergegners für das Brettspiel Chamäleon Schach
- Verwendung in einer App, mobile Endgeräte -> gute Performance nötig, da beschränkte Ressourcen
- Computergegner soll so stark wie möglich sein (nachträgliches Abschwächen ist immer möglich)
- App in React Native implementiert -> nach Möglichkeit ist alles in Node.js umzusetzen
- Vergleich zwischen klassischem heuristischen Ansatz und modernem maschinellem Lernen (TD)
- Implementierung beider Algorithmen, der bessere gewinnt

# Chamäleon Schach

- schachähnliches Brettspiel von meinem Opa erfunden
- 1982 entwickelt und gebaut (Holzausführung) -> Foto einfügen
- 1990/92 verlegt vom Verlag VSK [@grosskopf2019gesellschaftsspiele, s. 31]
- nun Entwicklung des Spieles als Smartphone/Tablet-App durch den Enkel (mir)
- Umbenennung in Chamäleon Schach

## Spielregeln

als Anhang?

- buntes Schachbrett mit vier Farben (rot, grün, gelb, blau)
- bis zu vier Spieler (rot, grün, gelb, blau)
- 4 Figuren pro Spieler, Figuren haben Farbe-Rolle-Zuweisung -> Rolle der Figur von Farbe des aktuellen Feldes abhängig (Rollen: Springer, Dame, Läufer, Turm)
- gespielt wird reihum, wer dran ist bewegt eine seiner Figuren entsprechend der Regeln (Rollen)
- Spielbrett schrumpft -> Größe wir von den äußersten Figuren bestimmt
- Ziel: der letzte Überlebende zu sein
- ...

-> Quellenangabe aus der Spielanleitung nötig?

# Spieltheorie

## Einordnung von Chamäleon Schach

- zugbasiert: fest definierte Spielzustände zwischen den Zügen
- zeitunabhängig
- perfect information game: keine versteckten Information, keine Zufallskomponenten
- finite:
  - Spiele haben fest definiertes Ende
  - kein Unentschieden möglich -> es gibt immer einen klaren Gewinner
- Multiplayer: 2-4 Spieler
- constant sum game:
  - was gut ist für den einen, ist schlecht für den anderen immer im gleichen Maße
  - keine Kooperationen

vgl. [@luckhart1986algorithmic]

## Spielanalyse – Game Tree

- Analyse von Spielen dieser Art ohne Probleme möglich über einen Game Tree
- Game Tree
  - Darstellung aller möglichen Spielverläufe in Baumstruktur
  - Knoten sind die jeweiligen Spielzustände (Game States)
  - Kanten sind die Züge, die von einem Zustand in den flogenden führen
  - dadurch umfassende Analyse möglich
    - Fairness über den Saddle Point
    - optimale Strategie durch z.B. den Minimax-Algorithmus

vgl. [@luckhart1986algorithmic]

Beispiel TicTacToe:

- Regeln: (müssen Regeln zitiert werden? falls ja: [@abu2019tic])
  - 3x3 Felder
  - 2 Spieler: X und O
  - nacheinander platzieren die Spieler ihr Symbol auf den noch freien Feldern
  - Gewinner: drei in einer Reihe (horizontal, vertikal oder diagonal)
  - Unentschieden: keine freien Felder mehr
  
-> Grafik Spielbaum TicTacToe für die ersten 3 Ebenen

## Perfektes Spiel – Minimax-Algorithmus

- nach kompletten Aufbau des Spielbaums -> Bewertung der Endzustände möglich
- bsp: TicTacToe: X gewinnt -> +1, O gewinnt -> -1, unentschieden -> 0
- Backpropagation der Bewertungen nach Minimax-Prinzip
- Minimax:
  - policy für X -> immer die höchste Bewertung wählen (maximieren)
  - policy für O -> immer die niedrigste Bewertung wählen (minimieren)
  
-> Grafik: Ausschnitt aus Game Tree auf unterester Ebene mit Bewertungen

- Minimax-Bewertungen bis nach ganz oben durch propagiert
  - Grafik: Bewertungen der obersten 3 Ebenen
- Analyse: Bewertung des Startzustands -> Saddle Point -> Faires Spiel?
- Minimax gibt uns Bewertungsfunktion:
  - $V^* : s \rightarrow v, s \in S, v \in \mathbb{R}$
  - $S..$Menge der Game States
- Strategie für perfekten Spieler:
  - alle möglichen Folgezüge bewerten
  - höchesten oder niedrigesten wählen (je nach Strategie)

Prinzip beschrieben von @shannon1950xxii, Name Minimax erst später z.B. @duncan1957games oder @luckhart1986algorithmic

## Multiplayer-Problem – MaxN-Algorithmus

- Minimax nur für 2 Spieler Spiele -> Bewertung mit skalarem Wert möglich -> Minimax-Theorem [@duncan1957games]
- für mehr als 2 Spieler -> Bewertung als Vektor
- maxN-Algorithmus wie Minimax, nur eben Vektor mit Bewertung für jeden Spieler einzeln
- jeder Spieler maximiert nur seinen eigenen Wert im Vektor
- ansonsten genau der gleiche Ablauf

[@luckhart1986algorithmic]

## Komplexität von Brettspielen

1. Problem: Rechenzeit

- Game Trees explodieren sehr schnell in ihrem Umfang -> exponentiell
- TicTacToe: Anzahl möglicher Spielverläufe: !!!Zahl suchen!!! (31.896) -> Wikipedia 
                - 255168: https://oeis.org/A061526
  - klein und überschaubar
  - Spiele haben feste Länge (5-9 Züge)
- bei komplexen Spielen nur mit Hilfe des Spielbaums abschätzbar:
  - Branching Factor $b$ -> wieviel mögliche Züge hat eine Spieler im Durchschnitt
  - Depth $d$ -> wieviele Züge braucht ein Spiel im Durchschnitt bis zum Ende?
  - Spielverläufe: $b^d$
- Schach: $b = 30..35$, $d = 80$, Spielverläufe: min. $10^{120}$ (Shannon-number) [@shannon1950xxii]
- Chamäleon-Schach:
  - 2 Spieler: $b = 15$, $d = 22$ -> $10^{25}$
  - 3 Spieler: $b = 18$, $d = 40$ -> $10^{49}$
  - 4 Spieler: $b = 15$, $d = 44$ -> $10^{51}$

-> Vergleich der Komplexität als Tabelle!

2. Problem: Speicherbedarf für $(s,v)$

-> Tabelle mit Anzahl möglicher Game States (wieviele Game States es gibt):

- TicTacToe: 765  -> https://oeis.org/A008907
- Schach: $10^{43}$ [@shannon1950xxii]
- Chamäleon-Schach: $\sum\limits_{i=1}^{16} ({64 \choose i} \times \frac{16!}{(16-i)!}) \approx 10^{28}$
  - $= 14108373601591606657646377985$ nur Figuren-Anordnungen
  - smallest 3x3 Feld: sum ((9 nCr n) * 16! / (16-n)!), n = 1 to 9
  - $= 11453449104 \approx 1.1 \dot 10^{10}$
  - -> mal 36 weil 36 verschiedene 3x3 Felder
  - $= 412324167744 \approx 4.1 \dot 10^{11}$
  - gesamt: $10{28}$

Fazit: Ermittlung und Speicherung von $V^*$ bei Chamäleon Schach nicht möglich

Also gilt es $V^*$ so gut wie möglich zu approximieren

# Klassischer Ansatz – Heuristischer Ansatz

- regelbasiert, dazu aber Analyse des kompletten spielbaums nötig, den wir ja aber nicht haben []
- Standard Methode: Analyse des Game States anhand bestimmter Heuristiken [@shannon1950xxii] [@sutton2018reinforcement, s. 181-182]

## Grundprinzip

- Heuristiken i.d.R. von Menschen festgelegt
- werden für die Spieler einzeln ermittelt und dann miteinander verglichen
- Ergebnis: Bewertung welcher Spieler gerade wahrscheinlich am gewinnen ist
- Außerdem Verwendung von beschränktem Minimax
  - nicht die direkten nächsten Zustände werden bewertet
  - sondern Game Tree wird bis zu einer gewissen Tiefe (abhängig von Ressourcen) aufgebaut
  - unterste Knoten werden bewertet
  - Ergebnis wird nach oben propagiert
  - Je weiter in der Zukunft die Bewertung erfolgt, desto genauer ist sie (weil im Terminate State ist Bewertung ja eindeutig)

-> Grafik wieder TicTacToe als Beispiel ???

## Optimierungen – Pruning

- beim Aufbau des beschränkten Spielbaums können Optimierungen erfolgen
- Zweige müssen nicht weiterverfolgt werden, wenn absehbar ist, dass für die oberste Ebene keine Verbesserung erfolgen kann
- Beschneidung des Baumes -> pruning
- im worst-case ist Laufzeit nach wie vor $O(b^d)$
- Problem: bei Minimax (2 Spieler) sehr effektives Alpha-Beta Pruning möglich
  - reduziert die Laufzeit im best case auf $O(2b^\frac{d}{2})$ [@luckhart1986algorithmic]
  - funktioniert bei maxN aber nicht!
- Arten von Pruning bei maxN: [@sturtevant2000pruning]
  - Immediate Pruning:
    - möglich wenn es eine Maximal-Bewertung (höchstmögliche) gibt
    - sobald ein Zweig mit Maximal-Bewertung gefunden worden ist, können die anderen Zweige direkt ignoriert werden
  - Shallow Pruning:
    - möglich, wenn die Werte im Bewertungsvektor eine fest Summe $v_{maxSum}$ haben
    - wenn der Vater schon eine vorläufige Bewertung hat, dann kann Kindzweig komplett ignoriert werden, sobald dieser eine Bewertung über $v_{maxSum} - {bestScore}_{parent}$ bekommt -> Vater wird diesen Weg niemals wählen

-> Grafik, die Immediate und Shallow Pruning darstellt

## Implementierung für Chamäleon Schach

(Dieser Bereich ist komplett selbst erdacht, daher keine/kaum Quellen, ist das legitim? Es bezieht sich ja alles auf die vorher gezeigten Prinzipien)

### Heuristik

- $f$: Anzahl der Figuren je Spieler
- $z$: Anzahl der Züge ein Spieler kann im nächsten Zug machen (starke Rollen z.B. Damen bevorzugen)

$absScore_{player} = f + z \times 0.01$

- $z$ soll weniger Gewicht haben als die Anzahl der Figuren

### Finaler Ergebnis-Vektor

- bisher nur Vektor mit absoluten Bewertungen der einzelnen Spieler
- aber: noch kein Bezug zu den Bewertungen der anderen
- > Manhattan-Normalisierung des Vektors (das ist ein mathematisches Prinzip, braucht man da eine Quelle für?)
  - $relScore_{player} = \frac{absScore_{player}}{sum(absScore_{all})}$
- dadurch:
  - höchstmögliche Bewertung = 1
  - Summe der Einzelwerte im Vektor = 1
  - heißt: Immediate und Shallow Pruning sind möglich
- im Prinzip stellt der Vektor nun die Gewinnwahrscheinlichkeiten der einzelnen Spieler in Prozent dar

### Ermittlung der Suchtiefe

- Frage: wie weit baut man den Game Tree auf?
- Grenzwert: maximale Laufzeit 1 Sekunde
  - in der App wird ca. 1 Sekunde gewartet, auch wenn der Computergegner schon fertig ist, weil es besser aussieht und wenn der Zug nicht sofort apruppt ausgeführt wird
- experimentell ermittelt:
  - Zufallsspiele generieren
  - für jeden Zug MaxN mit gewisser Tiefe ausführen und Laufzeit messen
  - Analyse der Ergebnisse:
    - wann ist eine höhere Suchtiefe möglich, wann nur eine geringe?
    - Vermutung: je weniger Figuren noch übrig sind, desto tiefer kann die Suchtiefen sein
  - Suchtiefen mit Hilfe der Analyse festlegen
  - erneut MaxN mit allen Spielen durchführen und Laufzeit messen
  - Optimierung der Suchtiefe bis keine Berechnung mehr länger als 1 Sekunde dauert

-> Ausschnitt aus der Tabelle mit den Messwerten -> zeigen welche Faktoren die Laufzeit verlängern

-> finale Tabelle mit den Bedingungen und der zugeordneten Suchtiefe

## Auswertung

10 Spiele gegen mich spielen -> wer gewinnt ermitteln + subjektive Bewertung des Spielverhaltens

(ist das legitim? Viel zu messen gibt es hier nicht)

# Moderner Ansatz – Temporal Difference Learning

Nach wie vor gesucht möglichst gute Approximation von $V^*(s)$

## Einordnung und Grundbegriffe

Maschinelles Lernen

Reinforcement Learning: [@sutton2018reinforcement, s. 1-3]

- engl.: Bestätigung oder Ermutigung (Quelle für Übersetzungen nötig?)
- ein System lernt, was in einer bestimmten Situation die beste auszuführende Aktion ist
- für ausgeführte Aktionen bekommt das System Belohnungen
- das System versucht die größtmögliche Menge an Belohnungen zu akkumulieren
- dies geschieht durch Ausprobieren (Exploration)
- und Anpassung des Verhaltens, sodass mehr und mehr Belohnungen erreicht werden können (Exploitation)

Temporal Difference Learning [@sutton2018reinforcement, s. 9-10]

- Algorithmen, die in einer unbekannten Umgebung Aktionen ausführen
- Lernen direkt aus der ausgeführten Aktion und passen ihr Verhalten an
- Lernen geschieht direkt nach der Aktion und nicht erst am Ende der Episode
- Lernen aus der zeitlichen Differenz von $t$ zu $t+1$

Markov Decision Process: [@sutton2018reinforcement, s. 73]

- Formalisierung von Problemen Reinforcement Problemen
- finite [@sutton2018reinforcement, s. 73]
  - klares Ende und diskrete Zeitschritte
  - alle MDPs werden immer zu finiten umgewandelt, da leichter zu lösen
- besteht aus: [@sutton2018reinforcement, s. 6, s. 47-50 und s. 53]
  - agent: der Algorithmus, der Entscheidungen treffen und daraus lernen soll
  - environment: alles, was zum System gehört, aber nicht zum Agenten
  - reward signal:
    - $R(s,a)$ gibt dem Agenten im Zustand $s$, wenn er die Aktion $a$ ausführt eine Belohnung
    - die Belohnung ist ein skalarer Zahlenwert -> positiv ist gut, negativ ist schlecht
    - repräsentiert das Ziel des Agenten
    - steht für die direkte kurzfristige Belohnung
    - wird auch reinforcement function genannt
  - value function:
    - $V(s,a) = R(s,a) + V(s',a')$ ist die erwartete Summe aller Belohnungen von jetzt bis zum Ende der Episode
    - repräsentiert das langfristig erwartete Ergebnis
    - ist genau unsere Funktion $V^*$, die wir approximieren wollen, da sie ja auch vorhersagt, wie das Spiel enden wird, wenn diese Aktion ausgeführt wird
  - policy:
    - $\pi: s \rightarrow s'$
    - die Strategie, wie der Agent aus den nächsten möglichen Aktionen eine auswählt und durchführt
    - hatten wir auch schon bei Minimax und maxN -> Spieler wählt immer den Zug mit der besten Bewertung
- wichtige Begriffe:
  - episode: kompletter Durchlauf eines MDP vom Startzustand bis zum Endzustand (terminate state)
  - state $s$: aktueller Zustand der Environment, nächster state: $s'$
  - action $a$: Aktion, die der Agent im aktuellen Zustand ausführen kann, actions im nächsten state: $a'$
  - afterstate: [@sutton2018reinforcement, s. 136-137]
    - häufig ist die Action $a$ untrennbar mit dem daraus resultierendem nächsten State $s$ verbunden
    - dann kann man das vereinfachen, indem man statt State-Action Paaren $(s,a)$, einfach von sog. Afterstate $s'$ spricht
    - also: $s$ -> aktueller Zustand, $s'$ -> Folgezustand
      - $(s,a) \equiv s'$
      - $(s',a') \equiv s''$

Hinweis zum Discounting Factor $\gamma$: (ist dieser Hinweis nötig?)

- in meisten Formeln werden nachfolgende Values mit einem Discounting Factor versehen
- $V(s,a) = R(s,a) + \gamma V(s',a')$
- dadurch können zukünftige Rewards weniger stark gewichtet werden als der aktuell erhaltene Reward $R(s,a)$
- @sutton2018reinforcement, s. 253-254 zeigt aber, dass selten Sinn macht, vor allem wenn die Value Function nicht als Tabelle dargestellt werden kann
- daher hier in allen Formeln ignoriert

## $TD(0)$-Algorithmus

- einfachste Form der TD-Algorithmen
- wir haben eine Value Function $V(s,a)$, die zunächst zufällige Ergebnisse produziert
- Agent bewegt sich durch die Episode und lernt mit jedem Schritt aus den Ergebnissen des vorherigen
- update der Value function nach jeden Schritt:
  - $V(s,a) \leftarrow V(s,a) + \alpha (R(s,a) +  V(s',a') - V(s,a))$
  - Value function wird mit dem Reward und dem Ergebnis der Value Function geupdated
- Zeigen am Beispiel TicTacToe:
  - Bewertung der nächsten States -> der beste wird ausgewählt
  - nun ist Gegner am Zug, wählt seinerseits den besten Zug
  - Korrektur der Bewertung aus s' und der Bewertung v'' des Gegners
  - Bsp: Bewertung für $(s,a) = 0.3$, Bewertung für $(s',a') = -0.4$
  - Anpassung der Funktion, sodass in Zukunft $(s,a)$ näher an $-0.4$ ist
- $TD(0)$ -> wir lernen nur aus dem unmittelbar ausgeführten Schritt
- $TD(\lambda)$ -> wir lernen nur aus weiteren folge Schritten

[@sutton2018reinforcement, s. 119-121]

## Neuronale Netze

- benötigt für die Value Function: Funktion, die lernfähig ist
- eine elegante Variante: Neuronale Netze
  - Funktions-Approximator für beliebige auch nicht-lineare Funktion

... entsteht gerade noch

## Implementierung für Chamäleon Schach

### Allgemein

- nur Verwendung von afterstates $s'$, anstatt $(s,a)$
- reward signals und Ergebnisse der value function sind 4D-Vektoren
  - ein Wert pro Spieler: (Rot, Grün, Gelb, Blau)
- Algorithmus lernt indem er gegen sich selbst spielt (self-play) [vgl. @ghory2004reinforcement, s. 23]
  - beste Variante, einfach umzusetzen
  - Training ist am besten, wenn Gegner gleich stark
  - kein Optimierung nur auf eine Strategie

### Reward Signal

- zwei Hauptansätze: [@harmon1997reinforcement]
  - Minimum Time to Goal
    - wenn nicht terminate state: -1
    - wenn terminate state: 0
    - -> Agent wird umso mehr bestraft, je länger er braucht
  - Pure Delayed Reward and Avoidance Problems
    - wenn nicht terminate state: 0
    - wenn terminate state: +1
    - -> Agent will einfach nur gewinnen
- für Chamäleon Schach -> 2. Ansatz

$$
R(s) =
\begin{cases}
    (0,0,0,0) &, \text{für } s \text{ kein terminate state} \\
    (1,0,0,0) &, \text{für Spieler Rot hat gewonnen} \\
    (0,1,0,0) &, \text{für Spieler Grün hat gewonnen} \\
    (0,0,1,0) &, \text{für Spieler Gelb hat gewonnen} \\
    (0,0,0,1) &, \text{für Spieler Blau hat gewonnen}
\end{cases}
$$

### Value Function

- wichtig: Value function gibt den immer den erwarteten zukünftigen Reward
  - $V(s) = R(s) + V(s')$ 
- daher: wenn terminate state, dann $V(s) = (0,0,0,0)$
- reward hat man ja gerade eben erhalten
- jetzt ist Spiel vorbei -> keine weiteren Rewards möglich

Basis: $V(s) = R(s) + V(s')$ 

ursprüngliche V:

$$
V(s) =
\begin{cases}
    R(s) + V(s') &, \text{für } s \text{ kein terminate state} \\
    R(s) + V(s') &, \text{für } s \text{ ist terminate state}
\end{cases}
$$

Einsetzen der Null-Werte in den jeweiligen Cases

$$
V(s) =
\begin{cases}
    0 + V(s') &, \text{für } s \text{ kein terminate state} \\
    R(s) + 0  &, \text{für } s \text{ ist terminate state}
\end{cases}
$$

Verkürzte Value Function

$$
V(s) =
\begin{cases}
    V(s') &, \text{für } s \text{ kein terminate state} \\
    R(s)  &, \text{für } s \text{ ist terminate state}
\end{cases}
$$

- im Falle eine terminate states kommt die Bewertung also von der Reward Function
- im Falle eines nicht terminate states kommt die Bewertung vom Neuronalen Netz (eigentlich ja Rekursion, diese soll durch das NN simuliert werden)

### Policy

- policy im Live-Betrieb genau wie bei maxN: $\pi^*(s) = \argmax_{s'} V(s')$
- also immer Wert mit der besten Bewertung nehmen
- wird auch greedy policy [@sutton2018reinforcement, s. 27] oder optimal-policy [@harmon1997reinforcement] genannt
- Problem unsere Funktion startet mit komplett zufälligen Werten
- daher zufällig manche sehr gute Züge sehr schlecht bewertet -> werden nicht genommen und nie geupdated (also verbessert)
- deshalb immer mal einen Zufallszug ausführen, statt immer den vermeintlich besten
- nennt sich $\epsilon$-greedy policy [@sutton2018reinforcement, s. 28]
- $\pi(s)$ -> ohne Stern heißt $\epsilon$-greedy, mit Stern optimal
- Wahrscheinlichkeit von 10% für Zufallszug

### Architektur des Neuronalen Netzes

- Input Layer: 384 Neuronen + 2 Neuronen = 386 Neuronen
  - 8x8 Felder: (64 x 6 Neuronen = 384 Neuronen)
    - Status: frei, deaktiviert, Figur auf Feld -> 2 Neuronen
    - Spieler: 4 Spieler -> 2 Neuronen (wenn keine Figur auf Feld -> (0,0) )
    - Figur-Art: 4 verschiedene -> 2 Neuronen (wenn keine Figur auf Feld -> (0,0) )
  - Spieler am Zug: 4 spieler -> 2 Neuronen
- Alternativ: Input Layer: 112 + 12 + 2 = 126 Neuronen
  - 16 Pawns: (16 x 7 Neuronen = 112 Neuronen)
    - position: 6 Neuronen
      - row: 0-7 -> 3 Neuronen
      - col: 0-7 -> 3 Neuronen
    - isAlive: 1 Neuron
  - Limits: 12 Neuronen
    - minRow: 0-7 -> 3 Neuronen
    - maxRow: 0-7 -> 3 Neuronen
    - minCol: 0-7 -> 3 Neuronen
    - maxCol: 0-7 -> 3 Neuronen
  - whoseTurn: 4 Spieler -> 2 Neuronen
- Hidden Layer:
  - Aktivierungsfunktion: Sigmoid
  - Neuronen: testen -> 20, 40, 80, 160, 320
  - Alternativ Neuronen: testen -> 32, 64, 128
- Output Layer:
  - Aktivierungsfunktion: Softmax -> Werte zwischen \[0,1], Summe aller Werte ist 1 -> Gewinnwahrscheinlichkeit (wie bei heuristisch)
  - Neuronen: 4 Spieler -> 4 Neuronen (Gewinnwahrscheinlichkeit je Spieler in Prozent)

### Trainingsalgorithmus

---

$w \leftarrow initNN()$

while infinite

$s \leftarrow$ begin new game

while $s$ not terminate state

$s' \leftarrow \pi^*(s)$

$v \leftarrow V(s')$

$w \leftarrow trainNN(w,s,v)$

$s \leftarrow \pi(s)$

---

-> in regelmäßigen Abständen gegen maxN antreten lassen und schauen, wer gewinnt

wieviele Spiele spielen sie gegeneinander ?

## Auswertung

-> Graph Trainingsdurchläufe zu Gewinnen gegen maxN in Prozent

-> wird TD irgendwann besser als maxN

-> TD gegen mich, Gewinnstatistik und Subjektiver Eindruck

# Ausblick

- Champion wird implementiert und in die App eingefügt
- viel Raum für weitere Versuche:
  - heuristisch:
    - andere Bewertungen:
      - Brettgröße
      - Rolle der Figuren -> Rollenkombinationen ?
      - Ausdehnung über das Feld
  - TD-Learning:
    - verschiedene Netz-Topologien
    - andere Aktivierungsfunktionen
    - andere Kodierung der Input-Werte
    - anderer Gegner statt Self-Play -> gegen Algo, gegen Database, gegen Random

---

FRAGEN:

- muss jedes Skript gezeigt und erklärt werden? Oder reichen auch nur die Endergebnisse bzw. dass ich erkläre, was ich gemacht habe?
- müssen Ergebnisse reproduzierbar sein? (seedable Pseudo-Zufallsgeneratoren)
- Ich nutze natürlich exzessiv die Datenstrukturen und Funktionen aus der App für die Spiellogik. Muss die nochmal komplett erklärt und gezeigt werden?
- Generell: Skripte und Code anhängen oder einbetten?
- muss ich Beweise nochmal führen oder kann ich auf das entsprechende Paper verweisen?
- was soll english, was soll deutsch sein?
- veröffentlichung? auch auf english?
- Bücher bekommen ?
- Auch andere Arten der Zitatvermerke erlaubt? 
  - laut Vorgabe: Sut18
  - schöner finde ich: Sutton 2018

---

**Quellen**