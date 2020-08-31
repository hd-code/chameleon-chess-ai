# Implementierung

Für die Umsetzung muss zuerst eine geeignete heuristische Bewertungsfunktion ermittelt werden. Danach werden die verschiedenen vorgestellten Algorithmen implementiert. Anschließend spielen die Algorithmen gegeneinander, um den finalen Sieger-Algorithmus zu finden.

## Bewertungsfunktion {#bewfunk}

Für die heuristische Bewertungsfunktion $\vec h(s)$ ist entscheidend, welche Faktoren in einem Spiel zu einem Sieg führen und welche Informationen während des Spielverlaufes vorliegen. [vgl. @sturtevant2003, pp. 26 - 27]

Die Gewinnbedingung für "Chamäleon Schach" ist sehr klar: der letzte Spieler, der noch Figuren auf dem Brett hat, gewinnt. Das bedeutet: je mehr Figuren ein Spieler noch hat, desto besser stehen seine Gewinnchancen. Die Anzahl der Spielfiguren eines Spielers ist außerdem zu jeder Zeit direkt vom Spielbrett ablesbar. Die Anzahl der Figuren wird damit die Basismetrik für die Bewertungsfunktion sein.

Die Besonderheit von "Chamäleon Schach" liegt aber auch darin begründet, dass die gleiche Figur auf Feldern mit unterschiedlichen Farben auch unterschiedliche Rollen annimmt. Eine Dame kann viel weiter ziehen als ein Springer. Damit hat eine Dame auch mehr Möglichkeiten sich zu bewegen, sich in Sicherheit zu bringen, gegnerische Figuren zu schlagen usw. Daher wird auch die Rolle, welche die jeweiligen Figuren zur Zeit innehaben, wichtig für die Bewertung sein. Auch diese Information kann direkt dem Spielbrett entnommen werden.

Nun stellt sich die Frage, wie die verschiedenen Rollen zu gewichten sind. Dazu ist die folgende Tabelle erstellt worden:

| Rolle | Eckfeld | Mitte | Durchschnitt | Punkte |
|-|-|-|-|-|
| Springer |  2 |  8 |  5   | 1 |
| Läufer   |  7 | 14 | 10.5 | 2 |
| Turm     | 14 | 14 | 14   | 3 |
| Dame     | 21 | 28 | 24.5 | 5 |

: Wertigkeiten der Schach-Rollen anhand ihrer Bewegungsweite

Die möglichen Züge einer Figur sind auch abhängig davon, wo die Figur auf dem Schachbrett steht. Auf einem Eckfeld haben die meisten Figuren wesentlich weniger Zugmöglichkeiten als auf einem der vier mittleren Felder des Brettes. Die Tabelle zeigt daher die möglichen Züge einer Figur, wenn sie sich auf einem Eckfeld und in der Mitte befindet. Aus diesen Werten wird der Durchschnitt gebildet. Daraus sind die finalen Punkte abgeleitet worden, die grob die Verhältnisse zwischen den Zugmöglichkeiten der Figuren und damit ihre relative Stärke zueinander widerspiegeln.

Ein alternativer Ansatz für die Gewichtung der Rollen könnte darin bestehen, zu zählen, wieviel Züge die jeweilige Figur aktuell ausführen kann. Auf diese Art und Weise wird eine stärkere Rolle automatisch besser bewertet. Außerdem wird dadurch auch berücksichtigt, dass eine starke Rolle in einer "engen" Spielsituation gar nicht so stark ist, da ihre Bewegung eingeschränkt wird. Ein Nachteil könnte diese Methode aber auch mit sich bringen: Da die Bewertung umso besser ausfällt, je weiter sich eine Figur bewegen kann, vermeidet der Computer dadurch u.U. die Einengung des Spielfeldes. Aus der persönlichen Spielerfahrung weiß der Autor aber zu berichten, dass gerade die bewusste Einengung der Spielfeldgröße elementar für eine gute Taktik ist. Dadurch werden die Gegner stark unter Druck gesetzt.

Beide Ansätze müssen miteinander verglichen werden. Der folgenden Tabelle sind die verschiedenen Bewertungsfunktionen zu entnehmen, die gegeneinander getestet werden:

| Name | Berechnung | Kommentar |
|--------------------|:----------:|--------------------------------------------|
| countPawns         | $p$               | Die Rollen der Figuren werden ignoriert |
| countPawns10Roles  | $10 \cdot p + r$  | Die Rollen werden verhältnismäßig stark gewichtet |
| countPawns100Roles | $100 \cdot p + r$ | Die Anzahl der Figuren wird am stärksten gewichtet |
| countPawns100Moves | $100 \cdot p + m$ | Die Rollengewichtung erfolgt über die Anzahl der möglichen Züge einer Figur |

: Die zu vergleichenden Bewertungsfunktionen

$p..$Anzahl der Figuren,  
$r..$Punkte für die Rollen nach der vorherigen Tabelle,  
$m..$Anzahl der möglichen Züge der Figuren

Insgesamt werden vier Versionen gegeneinander antreten. Die Anzahl der Figuren ist bei allen die wichtigste Metrik. `countPawns` wird dabei die Basis-Version darstellen, da hier die Rollen der Figuren gar nicht mit bewertet werden. Zwei verschiedene Versionen der Rollengewichtung nach der Punktetabelle sind mit `countPawns10Roles` und `countPawns100Roles` vertreten. In der ersten Version wird die Anzahl der Spielfiguren mit dem Faktor $10$ gewichtet. Da zwei Damen auch insgesamt $10$ Punkte geben, erhält die Rollengewichtung einen stärkeren Einfluss auf das Ergebnis. Bei der zweiten Version ist der Faktor $100$. Dadurch ist die Anzahl der Figuren stets die wichtigste Metrik und die Rollengewichtung erhält eine relativ kleine Bedeutung. Der alternative Ansatz, wo die Anzahl der Züge der Figuren gezählt werden, findet sich im `countPawns100Moves` wieder. Die Figurenanzahl wird hier ebenfalls mit $100$ multipliziert.

Ein letzter Punkt ist noch wichtig zu beachten: Alle Versionen der Bewertungsfunktion gewichten die Spieler einzeln und getrennt von einander. Allerdings ist nicht nur wichtig, wie gut ein einzelner Spieler gerade dasteht. Viel mehr interessiert, wie ein Spieler *im Verhältnis zu den anderen* abschneidet. Um dies zu bewerkstelligen, wird die [im vorigen Kapitel](#normierung) angesprochene *Normierung* verwendet. Dadurch sind die Bewertungen nicht länger von einander getrennt, sondern stehen im unmittelbaren Zusammenhang. Verbessert ein Spieler seine eigene Bewertung, sinkt automatisch die Bewertung der anderen Spieler. Dadurch ist der strikt-kompetitive Charakter des Spieles wiederhergestellt.

## Algorithmen

### Allgemein

Alle Algorithmen sind in einer rekursiven Form implementiert worden. Dies liefert u.U. nicht die besten Performance. Da JavaScript keine rein funktionale Programmiersprache ist, werden kaum Optimierungen von rekursiven Konstrukten vorgenommen. Die rekursive Definition ist aber deutlich einfacher zu implementieren gewesen. Da alle Algorithmen auf diese Art geschrieben sind, dürfte die Vergleichbarkeit dennoch gegeben sein.

Zusätzlich müssen alle Algorithmen ein gewisses Rahmen-Konstrukt implementieren, damit sie im Zusammenhang mit dem eigens für dieses Spiel entwickelte [Session-Framework](#framework) verwendet werden können. Auf diese Art und Weise ist der meiste Code für alle Algorithmen gleich und nur die spezifischen Details ändern sich.

Die Bewertungsfunktion ist dabei komplett parametrisiert. Sie wird also separat definiert und kann dann von jedem Algorithmus beliebig verwendet werden. Dies erzeugt einen hohen Grad an Modularität und Flexibilität. Jede beliebige Bewertungsfunktion kann mit jedem beliebigen Algorithmus kombiniert werden.

### Max^N^

Der Max^N^ ist die Implementierung des Algorithmus von Luckhart und Irani [-@luckhart1986]. In dieser Implementierung wird kein Pruning verwendet. Dieser Algorithmus entspricht am exaktesten dem Vorgehen aus der Spieltheorie. Es ist also der reinste Algorithmus in Bezug auf die Validität seiner Ergebnisse.

Er wird zum Vergleich mit den anderen Algorithmen dienen. Es müsste sich um den langsamsten Algorithmus handeln. Außerdem wird er zum Einsatz kommen, um die verschiedenen Bewertungsfunktionen miteinander zu vergleichen. Dadurch hat keine Berechnung einen Vorteil durch das Pruning.

Dieser Algorithmus verfügt über keinen eigenen Mechanismus, um die Bewertungen der Spieler gegeneinander zu vergleichen. Deswegen werden stets die normierten Ergebnisse der Bewertungsfunktion verwendet.

Der folgende Pseudocode basiert auf der Darstellung des Max^N^ aus dem Paper von Mikael Fridenfalk [-@fridenfalk2014]. Alle diese Pseudocodes zeigen, wie algorithmisch die Auszahlung für einen bestimmten Spielbrettzustand ($gs$) mit einer vorgegebenen Tiefe ($depth$) ermittelt wird.

\begin{center}
\begin{pseudo}[kw]*
\hd{MaxN}(gs, depth)                            \\
    if \fn{isGameOver}(gs) or $depth \leq 0$    \\+
        return \fn{normalize}(\fn{eval}(gs))    \\-
    $\vec{bestScore} = 0$                       \\
    foreach $nextGS$                            \\+
        $\vec{score} =$ \fn{MaxN}(nextGS, depth - 1)\\
        if $\vec{bestScore}_{player} < \vec{score}_{player}$\\+
            $\vec{bestScore} = \vec{score}$     \\--
    return $\vec{bestScore}$ 
\end{pseudo}
\end{center}

### Max^N^IS

Diese Implementierung verwendet das Immediate und Shallow Pruning im Max^N^-Algorithmus. Dazu wird immer die aktuell beste Bewertung des Vaters an den Kindknoten übergeben (beim rekursiven Aufruf). Diese Variante müsste vor allem gegen Ende des Spieles tiefer suchen können als der normale Max^N^ und dadurch bessere Ergebnisse erzielen.

Auch dieser Algorithmus verwendet stets die normierten Ergebnisse der Bewertungsfunktion.

Der folgende Pseudocode entspricht im Wesentlichen dem Max^N^, enthält allerdings kleine Modifizierungen, um das Immediate und Shallow Pruning umzusetzen.

\begin{center}
\begin{pseudo}[kw]*
\hd{MaxNIS}(gs, depth, parentBestScore)         \\
    if \fn{isGameOver}(gs) or $depth \leq 0$    \\+
        return \fn{normalize}(\fn{eval}(gs))    \\-
    $maxScore =$ \cn{MaxSum} $- parentBestScore$\\
    $\vec{bestScore} = 0$                       \\
    foreach $nextGS$                            \\+
        $\vec{score} =$ \nf{MaxNIS}$(nextGS, depth-1, \vec{bestScore}_{player})$\\
        if $\vec{bestScore}_{player} < \vec{score}_{player}$\\+
            $\vec{bestScore} = \vec{score}$     \\-
        if $\vec{bestScore}_{player} \geq maxScore$ \ct{pruning condition}\\+
            break                               \\--
    return $\vec{bestScore}$ 
\end{pseudo}
\end{center}

Die $MaxSum$ beträgt $1$. Dies ist schließlich der höchste mögliche Wert, den eine Auszahlung nach der Normierung annehmen kann.

### Paranoid

Der Paranoid ist der "paranoide" Ansatz von Sturtevant und Korf [-@sturtevant2000]. Alle Gegner werden hier als ein Team betrachtet, die zusammen gegen den aktuellen Spieler spielen. Dadurch ist der Minimax-Algorithmus mit Alpha-Beta Pruning anwendbar. Dies ist das effektivste Pruning Verfahren, also müsste dieser Algorithmus theoretisch die höchste Suchtiefe erreichen.

Die Implementierung erfolgt so, dass beim ersten Aufruf ein Parameter gesetzt wird. Dieser Parameter enthält den "Spieler Max", also den, der gegen das "Team Min" spielt. Die Bewertungsfunktionen werden ganz normal verwendet, wie bei den anderen Algorithmen auch. Sie gibt also einen Auszahlungsvektor zurück. Allerdings werden nun die Ergebnisse von Team Min von dem Ergebnis des Spielers Max abgezogen. Es ist also ein zusätzlicher Rechenschritt nötig. Dies sollte aber nicht zu stark ins Gewicht fallen.

Dieser Algorithmus gewichtet ja die einzelnen Bewertungen der Spieler automatisch gegeneinander, indem er sie von einander abzieht. Dadurch könnte die vorherige Normierung der Ergebnisse überflüssig sein. Die Normierung kann mittels eines Flags an- und ausgeschaltet werden. Es werden beide Versionen gegeneinander getestet und die bessere Variante wird anschließend gegen die anderen Algorithmen antreten.

Der folgende Pseudocode basiert auf der Darstellung des Minimax mit Alpha-Beta Pruning aus dem Paper von Mikael Fridenfalk [-@fridenfalk2014]. Allerdings sind die speziellen Erweiterungen für "Chamäleon Schach" hinzugefügt worden.

\begin{center}
\begin{pseudo}[kw]*
\hd{Paranoid}(gs, depth, maxPlayer, \alpha, \beta, normalize)\\
    if \fn{isGameOver}(gs) or $depth \leq 0$        \\+
        $\vec{score} =$ \fn{eval}(gs)               \\
        if $normalize$                              \\+
            $\vec{score} =$ \fn{normalize}(\vec{score})\\-
        return $2 \cdot \vec{score}_{maxPlayer} -$ \fn{sum}(\vec{score})\\-
    foreach $nextGS$                                \\+
        $score =$ \fn{Paranoid}(nextGS, depth - 1, maxPlayer, \alpha, \beta, normalize)\\
        if $gs_{player} \== maxPlayer$              \\+
            $\alpha =$ \fn{max}(\alpha, score)      \\-
        else                                        \\+
            $\beta =$ \fn{min}(\beta, score)        \\-
        if $\alpha \geq \beta$ \ct{pruning condition}\\+
            break                                   \\--
    if $gs_{player} \== maxPlayer$                  \\+
        return $\alpha$                             \\-
    else                                            \\+
        return $\beta$
\end{pseudo}
\end{center}

### Hypermax

Der Hypermax ist der Algorithmus nach Fridenfalk [-@fridenfalk2014].

Für "Chamäleon Schach" sind ein paar kleine Modifizierungen nötig gewesen. Bei der Initialisierung des $\vec \alpha$, der die besten erreichten Bewertungen der jeweiligen Spieler speichert, dürfen nur die Spieler mit $-\infty$ initialisiert werden, die tatsächlich noch mitspielen. Ansonsten bleiben die Werte der Spieler, die nicht mehr dabei sind, auf $-\infty$ stehen und die Pruning-Bedingung wird niemals erreicht. Daher wird bei der Initialisierung ein Array der noch lebenden Spieler erzeugt und stets als Parameter mitgegeben.

Die Ergebnisse der Bewertungsfunktion werden ja mittels eines speziellen Verfahrens in den "Zero-Space" transferiert. Dadurch werden die Bewertungen bereits gegeneinander gewichtet, sodass eine Normierung nicht mehr nötig ist. Fridenfalk sagt selbst, dass dennoch gerne ausprobiert werden kann, ob sich die Ergebnisse durch eine Normierung verbessern. Daher kann die Normierung mittels eines Flags an- und ausgeschaltet werden. Ähnlich wie beim Paranoid werden auch hier zuerst diese beiden Versionen gegeneinander antreten und die bessere dann gegen die anderen Algorithmen.

Der folgende Pseudocode basiert auf dem Paper von Mikael Fridenfalk [-@fridenfalk2014]. Allerdings sind die speziellen Erweiterungen für "Chamäleon Schach" hinzugefügt worden.

\begin{center}
\begin{pseudo}[kw]*
\hd{Hypermax}(gs, depth, \vec\alpha, players, normalize)\\
    if \fn{isGameOver}(gs) or $depth \leq 0$            \\+
        $\vec{score} =$ \fn{eval}(gs)                   \\
        if $normalize$                                  \\+
            $\vec{score} =$ \fn{normalize}(score)       \\-
        return $\vec{score}_{players} -$ \nf{avg}$(\vec{score}_{players})$\\-
    $\vec{bestScore} = -\infty$                         \\
    foreach $nextGS$                                    \\+
        $score =$ \fn{Hypermax}(nextGS, depth - 1, \vec\alpha, players, normalize)\\
        if $\vec\alpha_{player} < \vec{score}_{player}$ \\+
            $\vec\alpha_{player} = \vec{score}_{player}$\\
            $\vec{bestScore} = \vec{score}$             \\-
        if \fn{sum}(\vec\alpha) $\geq 0$ \ct{pruning condition}\\+
            break                                       \\--
    return $\vec{bestScore}$
\end{pseudo}
\end{center}

## Session-Framework {#framework}

Um die Vergleichbarkeit der Algorithmen zu gewährleisten, sollten die Algorithmen sich so viel Code wie möglich teilen. Nur die spezifischen Unterschiede in der Berechnung der Auszahlung werden separat implementiert.

Dazu ist für "Chamäleon Schach" ein Rahmen-Konstrukt entworfen, entwickelt und implementiert worden. Dieses Konstrukt (welches im Folgenden als Session-Framework bezeichnet wird) umfasst eine Algorithmus-Factory, mit der einheitliche Instanzen von den Algorithmen erzeugt werden können. Weiterhin definiert das Framework eine sog. Session. Diese Sessions werden verwendet, um die Algorithmus-Instanzen gegeneinander antreten zu lassen.

### Algorithmus-Factory

Die Algorithmus-Factory erzeugt spezifische Algorithmus-Instanzen. Alle erzeugten Instanzen haben die gleiche Signatur: `algorithm: (gs, mode, modeValue) => (gs', depth, time)`.

Das bedeutet, dass eine Algorithmus-Instanz einen Spielbrettzustand `gs` übergeben bekommt. Zusätzlich noch den gewünschten Modus `mode` für die Berechnung sowie den Wert für den jeweiligen Modus `modeValue`. Als Ergebnis liefert die Berechnung den nächsten Spielbrettzustand `gs'`. Dies ist also der Spielbrettzustand, der entsteht, wenn der beste Zug (nach der Berechnung des Algorithmus) durchgeführt wird. `depth` und `time` sind die erreichte Suchtiefe der Berechnung sowie die benötigte Rechenzeit.

Eine Algorithmus-Instanz kann in zwei verschiedenen Modi arbeiten: `depth` oder `time`. Im `depth`-Modus wird der Spielbaum nur bis zu der festgelegten Tiefe aufgebaut. Die benötigte Rechenzeit spielt keine Rolle. Im `time`-Modus wird zunächst der Spielbaum auf der ersten Ebene aufgebaut und bewertet. Steht dann noch Rechenzeit zur Verfügung, so wird der Spielbaum um eine Ebene erweitert und wieder bewertet usw. Die verfügbare Rechenzeit wird dabei in Millisekunden definiert. Dieser Modus ist also die Implementierung des Iterative Deepening.

Die Algorithmus-Factory definiert einen festen Rahmen. Um Algorithmus-Instanzen erzeugen zu können, muss jeder Algorithmus ein spezielles Interface implementieren. Dann können damit Instanzen erstellt werden.

Das Interface erwartet zunächst die Definition von drei generischen Datentypen:

- `S`: das genaue Format des Bewertungsergebnisses. Die meisten Algorithmen verwenden für die Bewertung den besagten Ergebnisvektor mit einem Eintrag je Spieler. Der Paranoid arbeitet allerdings mit skalaren Bewertungsergebnissen. Daher muss hier der verwendete Typ definiert werden.
- `A`: zusätzliche Daten. Wie zuvor erwähnt, brauchen die meisten Algorithmen zusätzliche Daten für die Berechnung. Der Paranoid braucht die Information, wer Spieler Max ist und die aktuellen $\alpha$- und $\beta$-Werte. Der Hypermax braucht die Information, welche Spieler überhaupt noch mitspielen usw. In dieser generischen Datenstruktur können also zusätzliche Informationen für die Algorithmen definiert werden.
- `P`: generischer Start-Parameter. Hiermit können zusätzliche Parameter für die Initialisierung der Algorithmus-Instanz definiert werden. Er wird verwendet, um beim Paranoid und beim Hypermax die Normierung an- und ausschalten zu können.

Darüber hinaus müssen vier Funktionen implementiert werden:

- `init: (gs, P) => A`. Die Init-Funktion bekommt den aktuellen Spielzustand `gs` und den generischen Parameter `P` übergeben. Als Ergebnis gibt die Funktion ein Objekt vom generischen Typ `A` zurück. Mit dieser Funktion werden also die initialen Werte für die zusätzlichen Daten `A` gesetzt. Dies sind z.B. die noch mitspielenden Spieler für den Hypermax oder die $\alpha$- und $\beta$-Werte für den Paranoid etc.
- `evalGameState: (gs, d, ef, A) => (S,A)` ist die Kernfunktion. Hiermit werden die möglichen Spielzustände bewertet. Dazu wird der zu bewertende Spielzustand `gs`, die geforderte Suchtiefe `d`, die Bewertungsfunktion `ef` und das generische Objekt `A` an die Funktion übergeben. Als Ergebnis entsteht ein Tupel aus der Bewertung für den Zustand `S` und einer eventuell modifizierten Version der zusätzlichen Daten `A`.
- `onNextDepth: A => A` ist ein Hook für den `time`-Modus. Bei manchen Algorithmen müssen die Daten in `A` angepasst werden, wenn die nächst höhere Suchtiefe erreicht wird. Beispielsweise müssen die $\alpha$- und $\beta$-Werte für den Paranoid wieder erneut initialisiert werden usw. Diese Funktion wird also aufgerufen, wenn die nächste Suchtiefe erreicht wird und sie dient der Modifizierung von `A`.
- `findBestScoreIndex: (S[], A) => int` wird ganz am Ende der Berechnung aufgerufen. Es muss ermittelt werden, welcher Folgespielzustand derjenige mit der besten Bewertung ist. Da die Bewertungen ja entweder Skalare oder Vektoren sind (abhängig von Typ `S`), muss diese Funktion definiert werden, um entsprechend die beste Bewertung finden zu können.

Sobald ein Algorithmus dieses Interface implementiert, kann zusammen mit der Implementierung und einer der Bewertungsfunktionen eine Algorithmus-Instanz erzeugt werden.

### Session

Mit den Algorithmus-Instanzen kann nun eine Session durchgeführt werden. Eine Session erwartet eine Liste aus Algorithmus-Instanzen, den Modus (`depth` oder `time`) und den Modus-Wert. Anschließend spielt sie mehrere Spiele mit verschiedenen Anordnungen der Algorithmen um das Spielbrett. Der komplette Spielverlauf sowie die erreichten Suchtiefen und Rechenzeiten werden getrackt und abgespeichert.

*Hintergrund*: Bis zu vier Leute können bei "Chamäleon Schach" mitspielen. Spieler Rot ist dabei immer der Startspieler, also derjenige, der als erster seinen Zug ausführt. Danach folgen Spieler Blau, Gelb und Grün. Diese Reihenfolge ist immer so festgelegt. Es ist gut möglich, dass die Startposition einen Einfluss auf das Spielergebnis hat. U.U. gewinnt ein Spieler auf einer bestimmten Position häufiger oder seltener. Deswegen ist es wichtig, dass die Algorithmen mehrere Spiele in verschiedenen Anordnungen gegeneinander spielen.

Die Session geht nun so vor, dass sie alle möglichen Anordnungen (Permutationen) der Algorithmen um das Spielbrett generiert. Die genaue Anzahl an Permutationen ist davon abhängig, wieviele Algorithmen an die Session übergeben worden sind:

- Bei vier Algorithmen gibt es 24 verschiedene Möglichkeiten die Algorithmen auf die verschiedenen Startpositionen zu verteilen. Es werden ausschließlich Vier-Spieler-Spiele gespielt.
- Bei drei Algorithmen werden sowohl alle Permutationen für Drei- als auch für Vier-Spieler-Spiele generiert und gespielt. Die Vier-Spieler-Spiele laufen dabei so ab, dass immer jeweils einer der Algorithmen zwei Spielerpositionen übernimmt. Der Algorithmus spielt dann also nicht nur gegen die anderen, sondern auch gegen eine Instanz von sich selbst. Es werden nur Spiele mit klar verschiedenen Anordnungen der Algorithmen gespielt. Insgesamt werden hier 54 Spiele durchgeführt.
- Bei zwei Algorithmen werden sowohl Zwei-, Drei- also auch Vier-Spieler-Spiele gespielt. In den Drei- und Vier-Spieler-Spielen werden also Spielerpositionen doppelt bzw. auch dreimal mit dem selben Algorithmus besetzt. Wenn mehrere Anordnungen identisch zueinander sind, wird nur ein Spiel mit der jeweiligen Konstellation gespielt. Dadurch liegt die Zahl an durchgeführten Spielen hier bei 38.

Nach der Generierung der verschiedenen Permutationen, werden die Spiele in den entsprechenden Anordnungen gespielt. Die Ergebnisse werden in JSON-Dateien gespeichert. Dadurch stehen die Daten aus der Session für weitere spätere Analysen bereit. Die genaue Projektstruktur findet sich im angehängten Git-Repository.

Während der Versuche ist ein Phänomen aufgetreten, welches es so noch nicht gegeben hat:
Die Algorithmen haben gegen Ende des Spieles eine Konstellation gefunden, in der sie ewig weiterspielen können. Sie haben im Spielbaum einen unendlichen Pfad entdeckt. Auf diesem Pfad geht das Spiel endlos weiter und keiner der Algorithmen kann den anderen in die Enge treiben und so einen Sieg erringen. Es ist praktisch für beide Algorithmen stets möglich, eine Niederlage zu vermeiden.

Im Spiel mit realen Menschen ist eine solche Situation noch nie vorgekommen. Entsprechend ist in den originalen Spielregeln auch kein Unentschieden vorgesehen gewesen. Die Algorithmen sind aber in der Lage, eine solche Konstellation zu finden. Daher ist nun eine neue Regel definiert worden: Ein Spiel endet mit einem Unentschieden für die noch lebenden Spieler, wenn nach dem 100. Zug noch immer kein Gewinner feststeht. Auf diese Art und Weise werden unendlich lange Spiele vermieden.

Anhand der Daten aus einer Session können nun Tabellen generiert werden, welche die Ergebnisse der Session zusammenfassen. Diese sind für die [Auswertung](#auswertung) verwendet worden. Die Ergebnisse geben zu jedem Algorithmus die Anzahl an Siegen, Niederlagen und Unentschieden wieder. Außerdem die erreichte Suchtiefe und die benötigte Rechenzeit. Beide Metriken werden sowohl im Median als auch im Durchschnitt berechnet. Mehr dazu im nächsten Kapitel.
