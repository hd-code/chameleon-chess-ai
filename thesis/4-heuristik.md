# Heuristischer Ansatz

Das Wort Heuristik beschreibt eine "methodische Anleitung [...] zur Gewinnung neuer Erkenntnisse" [@dudenHeuristik]. Es stammt von dem griechischen heurískein ab, was "finden" oder "entdecken" bedeutet. Heurisitische Methoden versuchen also aus den vorhandenen (häufig unvollständigen) Informationen neue Erkenntnisse zu gewinnen.

## Prinzip

### Heuristische Bewertungsfunktion

Der heuristische Ansatz nutzt im Grundsatz das gleiche Vorgehen wie die Spieltheorie. Der Unterschied besteht in der Definition der Funktion $\vec v^*(s,a)$. Anstatt die zu erwartende Auszahlung über die Generierung und Rückwärtsauflösung des kompletten Spielbaums zu ermitteln, erfolgt die Bewertung anhand des aktuellen Spielzustandes. Es wird versucht, mittels bestimmter Metriken der aktuellen Spielsituation eine Vorhersage über das Endergebnis zu treffen. [vgl. @sturtevant2003, pp. 26 - 27]

Die Metriken, die zur Schätzung des Endergebnisses verwendet werden, sind vom jeweiligen Spiel abhängig. Sie werden von Menschen anhand von Spielerfahrung und einer umfassenden Analyse der Spielregeln erstellt. Häufig ist auch der Vergleich verschiedener Metriken nötig, um eine adäquate Bewertungsfunktion zu finden. [vgl. @sturtevant2003, p. 27]

Beispiele für solche Metriken könnten die Anzahl der Spielfiguren eines Spielers sein oder wie weit ein Spieler schon auf dem Brett vorangekommen ist oder wieviele Stiche er im Vergleich zu den anderen gemacht hat etc.

Diese **heuristische Bewertungsfunktion**, die im Folgenden als $\vec h(s,a)$ bezeichnet wird, ist der erste Baustein des heuristischen Ansatzes.

### Beschränktes Durchsuchen des Spielbaums

In der Spieltheorie wird die Funktion $\vec v^*(s,a)$ verwendet, um direkt die möglichen Züge mit einer Auszahlung zu versehen. Dann wird der Zug mit der besten Auszahlung ausgewählt. Die Ergebnisse der Funktion kommen dadurch zustande, dass der Spielbaum bis zum Ende aufgebaut und die Auszahlungen rückwärts aufgelöst werden. Daher ist es auch naheliegend, dass die Effektivität der Bewertungsfunktion im heuristischen Ansatz gesteigert werden kann, wenn der Spielbaum wenigstens teilweise über ein paar Züge aufgebaut wird.

Im heuristischen Ansatz ist das Vorgehen nun so, dass von der aktuellen Spielsituation aus der Spielbaum über eine festgelegte Tiefe aufgebaut wird. Die heuristische Bewertungsfunktion wird verwendet, um den untersten Knoten eine zu erwartende Auszahlung (Schätzung) zuzuordnen. Anschließend werden die Auszahlungen, wie in der Spieltheorie, rückwärts bis zur ersten Ebene aufgelöst. Dadurch erhalten die Knoten auf der ersten Ebene (welche ja die möglichen Züge sind) eine bessere, weiter "vorausschauende" Auszahlung zugeordnet. Anschließend wird ebenfalls der Zug mit der besten Auszahlung für den Spieler ausgeführt. Dieses Vorgehen verbessert die eher wagen Schätzungen der Bewertungsfunktion immens. [vgl. @sturtevant2003, p. 41]

### Pruning

Spielbäume werden in der Regeln mittels einer Tiefensuche aufgebaut. Manchmal ist während der Generierung eines Zweiges schon absehbar, dass dieser keine besseren Auszahlungen liefern wird, als die bereits durchsuchten vorherigen Zweige. Wenn das auftritt, kann die restliche Generierung des aktuellen Zweiges auch abgebrochen und mit dem nächsten fortgesetzt werden. Dieser Vorgang wird als **Pruning** (engl. beschneiden) bezeichnet. Durch das Pruning kann Rechenzeit gespart werden. [vgl. @sturtevant2003, p. 41]

Wie genau das Pruning eingesetzt werden kann, hängt von dem konkret verwendeten [Algorithmus](#algorithmen) ab.

Alle Algorithmen haben ohne Pruning eine Laufzeit von $\mathcal{O}(b^d)$. Wobei $b$ der branching factor, also die Anzahl der möglichen Züge, die ein Spieler ausführen kann, ist. $d$ ist die Tiefe (engl. depth), also wieviele Züge in die Zukunft geschaut wird. Mit Pruning kann sich diese Laufzeit verbessern. Der Worst Case bleibt aber stets bei $\mathcal{O}(b^d)$.

### Iterative Deepening

Die Komplexität des Spielbaums wächst mit jeder weiteren Ebene exponentiell an. Entsprechend steigt auch die benötigte Rechenzeit exponentiell. Ein typisches Vorgehen besteht deshalb darin, dass der Spielbaum erstmal nur für eine Ebene generiert und bewertet wird. Steht dann noch Rechenzeit zur Verfügung, wird eine weitere Ebene hinzugefügt und die bisherigen Auszahlungen werden entsprechend aktualisiert. Steht dann immer noch Rechenzeit zur Verfügung, kommt eine weitere Ebene hinzu usw. Dieser Vorgang wird als **Iterative Deepening** bezeichnet. [vgl. @sturtevant2003, pp. 91 - 92]

Durch diesen Vorgang wird die Genauigkeit der Berechnung der erwarteten Auszahlungen immer besser, je mehr Zeit zur Verfügung steht. Damit lässt sich z.B. auch die Stärke eines Computergegners steuern, indem er einfach mehr oder weniger Rechenzeit zur Verfügung hat. Durch effektivere Pruning-Verfahren können die Algorithmen in der gleichen Zeit eine höhere Suchtiefe des Spielbaums erreichen und werden dadurch stärker.

## Algorithmen {#algorithmen}

Für die konkrete Umsetzung der Konzepte des heuristischen Ansatzes gibt es eine Vielzahl an konkreten Algorithmen. Alle unterscheiden sich ein wenig in ihrer Arbeitsweise, der Möglichkeiten des Pruning, Eignung für verschiedene Arten von Spielen usw. Tatsächlich gibt es für strikt kompetitive Mehrspieler-Spiele mit perfekter Informationen keinen einzelnen Algorithmus, der pauschal für alle diese Spiele geeignet ist. Stattdessen müssen zumeist mehrere dieser Algorithmen implementiert und gegeneinander getestet werden. [vgl. @sturtevant2003, pp. 3 - 4]

Im Folgenden werden nun die Algorithmen vorgestellt, die auch für "Chamäleon Schach" implementiert und getestet worden sind. In diesem Kapitel werden die Algorithmen und ihre Arbeitsweise allgemein beschrieben. Die konkrete Umsetzung für "Chamäleon Schach" folgt dann im nächsten [Kapitel](#implementierung)

### Minimax mit Alpha-Beta Pruning

#### Prinzip

Der **Minimax-Algorithmus mit Alpha-Beta Pruning** ist die Standardlösung für strikt kompetitive Spiele mit perfekter Informationen – solange es sich um Zwei-Spieler-Spiele handelt. [vgl. @sturtevant2003, pp. 3 - 4]

Der Vorteil bei dieser Variante liegt darin, dass die Auszahlung als Skalar dargestellt werden kann [vgl. @luckhart1986]. Ein Spieler ist Max, der andere ist Min. Die Auszahlung wird nun so definiert, dass positive Auszahlungen für Spieler Max von Vorteil sind und negative entsprechend für Spieler Min. Bei der Rückwärtsauflösung der Auszahlungen wählt Spieler Max also stets die höchstmögliche Auszahlung (er maximiert das Ergebnis) und Spieler Min stets die kleinstmögliche Auszahlung (er minimiert das Ergebnis). Dies ist zulässig, da es sich ja um ein strikt kompetitives Spiel handelt. [vgl. @sturtevant2003, pp. 27 - 28]

#### Alpha-Beta Pruning

Hinzu kommt die Anwendung eines sehr effektiven Pruning-Verfahrens: dem **Alpha-Beta Pruning**.

\begin{figure}
\centering
\begin{tikzpicture}
  \node {Spieler 1\\\textit{Max}}
    child {node {$+3$}}
    child {node {Spieler 2\\\textit{Min}}
      child {node {$-2$}}
      child {node {$\vdots$}}
    };
\end{tikzpicture}
\caption{Alpha-Beta Pruning}
\label{fig:ab-pruning}
\end{figure}

Die Abbildung \ref{fig:ab-pruning} zeigt einen einfachen Spielbaum mit skalaren Auszahlungen. Spieler 1 ist Max und hat auf dem zuerst betrachteten Zweig (links) eine $+3$ als Bewertung erhalten. Spieler 1 würde sich also für diesen Zweig entscheiden, wenn keine höhere Bewertung gefunden wird. Auf dem nächsten Zweig (ein Zug weiter in der Zukunft) würde Spieler 2, welcher Min ist, eine $-2$ als Auszahlung erhalten. Da Spieler 2 immer die kleinstmögliche Auszahlung wählt, wird er auf jeden Fall den Zweig mit der $-2$ oder sogar eine noch kleinere Bewertung wählen. Spieler 1 steht aber eine Ebene darüber und kann auf dem linken Zweig bereits ein $+3$ bekommen. Damit ist klar, dass Spieler 1 niemals den rechten Zweig wählen wird, sondern stets den linken. Der komplette rechte Zweig kann also ignoriert werden, sobald die $-2$ gefunden wurde. Das ist das Alpha-Beta Pruning. [vgl. @sturtevant2003, pp. 41 - 42]

Der Name leitet sich davon ab, dass in einer Variable namens $\alpha$ der beste bisher gefundene Wert für Spieler Max und in $\beta$ der bisher beste Wert für Spieler Min gespeichert wird. $\alpha$ wird mit $-\infty$ initialisiert und nun von Spieler Max maximiert. Bei $\beta$ erfolgt die Initialisierung entsprechend mit $+\infty$ und die Variable wird nun minimiert. In dem Moment, wo $\alpha \geq \beta$ ist, kann beschnitten werden. Denn Spieler Max würde $\alpha$ ja weiter maximieren, Spieler Min hat aber auf einem anderen Zweig schon eine niedrigere (für ihn bessere) Bewertung gefunden und umgekehrt. [vgl. @knuth1975]

Durch dieses Verfahren wird eine Laufzeit von $\mathcal{O}(b^{\frac{d}{2}})$ im Best Case und $\mathcal{O}(b^{\frac{3d}{4}})$ im Average Case erreicht. [vgl. @sturtevant2003, s. 43; zitiert nach @pearl1984]

#### Paranoider Ansatz für N-Spieler

Leider reicht ab drei Spielern eine skalare Bewertung der Spielzustände nicht mehr aus. Damit funktioniert dieser Algorithmus für Spiele ab drei Spielern nicht mehr. Sturtevant und Korf [-@sturtevant2000] geben allerdings eine Lösung dazu: nämlich den **paranoiden Ansatz**.

Der Spieler in der Wurzel des Spielbaumes (der also tatsächlich einen Zug durchführen muss) ist Spieler Max. Alle seine Gegner bilden eine Koalition gegen ihn und sind Spieler Min bzw. Team Min. Nun kann wieder der Minimax-Algorithmus mit Alpha-Beta Pruning verwendet werden. Je nachdem, ob es sich bei der Rückwärtsauflösung dann um einen Knoten von Spieler Max oder um einen Knoten eines der Spieler aus Team Min handelt, wird entweder maximiert oder minimiert.

Die Bewertungsfunktion liefert dabei zunächst einen Auszahlungsvektor mit je einem Element je Spieler. Anschließend wird die Auszahlung von Spieler Max genommen und nacheinander werden die Auszahlungen der Spieler aus Team Min abgezogen. Dadurch wird aus dem Auszahlungsvektor ein skalarer Wert. Formal bedeutet das:

$$v' = v_{max} - sum(\vec v_{min})$$

\begin{figure}
\centering
\begin{tikzpicture}
  \node {Spieler 1\\\textit{Max}}
    child {node {$0$}}
    child {node {Spieler 2\\\textit{Min}}
      child {node {$\boldsymbol1$}}
      child {node {Spieler 3\\\textit{Min}}
        child {node {$3$}}
        child {node {$\boldsymbol2$}}
      }
    };
\end{tikzpicture}
\caption{Rückwärtsauflösung im paranoiden Ansatz}
\label{fig:paranoid}
\end{figure}

Die Rückwärtsauflösung erfolgt wie in Abbildung \ref{fig:paranoid} dargestellt. Der Spieler, welcher in einem Knoten am Zug ist, ist entweder Spieler Max oder gehört zum Team Min. Entsprechend wird also entweder die höchste oder die niedrigste Auszahlung gewählt. Wie in der Abbildung zu sehen ist, wird dadurch durchaus auf mehreren Ebenen des Spielbaums hintereinander nur minimiert. Es sind ja mehrere Spieler im Team Min, aber nur einer ist Max.

Sturtevant und Korf geben allerdings zu bedenken, dass diese Annahme zu fehlerhaftem Spielverhalten führen kann, da ja in der Realität gar keine Koalition zwischen den gegnerischen Spielern besteht. Dieses fehlerhafte Verhalten fällt außerdem mit steigender Suchtiefe immer stärker ins Gewicht. [vgl. @sturtevant2003, pp. 132 - 133]

In Sturtevants Versuchen u.a. mit dem Spiel Chinese Checkers [-@sturtevant2003 p. 118] ist aber der paranoide Ansatz den anderen Algorithmen häufig überlegen gewesen. Unter anderem, weil durch das effektivere Pruning eine wesentlich höhere Suchtiefe erreicht und die Bewertung der Züge dadurch "weitsichtiger" geworden ist.

### Max^N^

#### Prinzip

Der **Max^N^-Algorithmus** ist von Luckhardt und Irani [-@luckhart1986] vorgestellt worden. Die Auszahlungen werden als Vektoren mit je einem Element je Spieler von einer heuristischen Bewertungsfunktion erzeugt. Ein beschränkter Spielbaum wird aufgebaut und die Rückwärtsauflösung erfolgt genauso, wie in der Spieltheorie beschrieben. Es wird also stets der Zweig mit der höchsten Bewertung für den Spieler ausgewählt, welcher im jeweiligen Spielzustand am Zug ist. Der Max^N^ ist damit der "reinste" Algorithmus, der am exaktesten das Vorgehen aus der Spieltheorie umsetzt.

\begin{figure}
\centering
\begin{tikzpicture}
  \node {Spieler 1}
    child {node {$(\boldsymbol3,3,1)$}}
    child {node {Spieler 2}
      child {node {$(2,\boldsymbol2,1)$}}
      child {node {Spieler 3}
        child {node {$(3,1,\boldsymbol3)$}}
        child {node {$(2,2,\boldsymbol2)$}}
      }
    };
\end{tikzpicture}
\caption{Arbeitsweise des Max\textsuperscript N}
\label{fig:maxn}
\end{figure}

Die Abbildung \ref{fig:maxn} zeigt die Arbeitsweise des Max^N^ für ein Spiel mit drei Spielern. Die Auszahlung erfolgt als Vektor mit je einem Element je Spieler. Bei der Rückwärtsauflösung werden nur die Elemente im Vektor betrachtet, welche zu dem jeweiligen Spieler gehören. Es wird stets die höchste Auszahlung für den Spieler ausgewählt. Daher stammt auch der Name Max^N^. Alle Spieler maximieren ihre Auszahlung und es sind $N$ Spieler. [vgl. @luckhart1986]

Luckhardt und Irani [-@luckhart1986] haben in ihrer Arbeit aber auch gezeigt, dass ein so effektives Pruning-Verfahren, wie das Alpha-Beta Pruning, ab drei Spielern nicht mehr möglich ist. Das liegt daran, dass nicht sicher ist, ob die Elemente im Vektor in irgendeinem Bezug zueinander stehen. Wenn es sich bspw. um ein strikt kompetitives Spiel handelt und die Auszahlungsvektoren sich auch entsprechend verhalten (sie weisen eine konstante Summe auf), dann sind spezielle Pruning-Verfahren wieder möglich. Ähnlich ist es, wenn z.B. die Werte im Vektor nur steigen und nicht mehr sinken können etc. Die verschiedenen Pruning-Verfahren sind also an sehr spezielle Bedingungen geknüpft. Egal welches Verfahren dabei zum Einsatz kommen kann, keines erreicht die Effektivtät des Alpha-Beta Prunings. In der Doktorarbeit von Nathan Sturtevant [-@sturtevant2003] sind sehr viele solcher Verfahren aufgeführt. In dieser Arbeit werden allerdings nur solche vorgestellt, die tatsächlich auf "Chamäleon Schach" anwendbar und implementiert worden sind.

#### Immediate Pruning

Diese Art des Prunings kann angewandt werden, wenn es eine *maximale Bewertung* gibt. Eine Bewertung also, die nicht mehr übertroffen werden kann. Sobald ein Blatt im Spielbaum mit der Maximalbewertung gefunden worden ist, können alle weiteren Zweige ignoriert werden, weil sich der Wert nicht mehr verbessern kann. [vgl. @sturtevant2000]

Im absolut besten Fall beträgt die Laufzeit dann $\mathcal{O}(b^{\frac{n-1}{n}})$. In den meisten Spielen, in denen es so einen Höchstwert gibt, kommt dieser aber eher gegen Ende vor. Zu Beginn des Spieles nützt dieses Verfahren also faktisch gar nichts.

#### Shallow Pruning

Die Vorraussetzung für das Shallow Pruning ist, dass es eine maximale Summe der Elemente im Auszahlungsvektor gibt. Wird nun in einem Kindknoten eine Auszahlung gefunden, die zusammen mit der besten bisherigen Auszahlung im Vaterknoten die maximale Summe übersteigt, dann ist die Pruning-Bedingung erreicht. [vgl. @sturtevant2000]

Formal definiert, lautet die Pruning-Bedingung: $v_{Kind} \geq max\Sigma - v_{Vater}$

\begin{figure}
\centering
\begin{tikzpicture}
  \node {Spieler 1}
    child {node {$(\boldsymbol5,3,2)$}}
    child {node {Spieler 2}
      child {node {$(3,\boldsymbol6,1)$}}
      child {node {$\vdots$}}
    };
\end{tikzpicture}
\caption{Shallow Pruning. $max \Sigma = 10$}
\label{fig:shallow}
\end{figure}

In Abbildung \ref{fig:shallow} ist ein Spielbaum für ein Drei-Spieler-Spiel zu sehen. Die maximale Summe der Werte im Auszahlungsvektor beträgt $10$. Spieler 1 würde auf dem linken Zweig eine Auszahlung von $5$ erhalten, da das erste Element im Vektor diesem Spieler zugeordnet ist. Das heißt, Spieler 1 würde sich für diesen Zweig entscheiden, wenn auf dem rechten Zweig keine bessere Auszahlung gefunden wird. Auf dem rechten Zweig hat Spieler 2 nun die Bewertung $(3,6,1)$ erhalten. Damit beträgt die Auszahlung für Spieler 2 bereits $6$ von insgesamt $10$ möglichen Punkten. Spieler 1 kann auf dem rechten Zweig also maximal noch eine Auszahlung von $4$ erreichen. Somit ist klar, dass sich Spieler 1 niemals für den rechten Zweig entscheiden wird. Auf dem linken ist ja bereits eine viel höhere Auszahlung gefunden worden.

Diese Art des Prunings kann nur zwischen unmittelbaren Vater- und Kindknoten durchgeführt werden. Über mehrere Ebenen hinweg (sog. Deep Pruning) liefert dieses Verfahren verfälschte Ergebnisse. [vgl. @sturtevant2000]

\begin{figure}
\centering
\begin{tikzpicture}
  \node {Spieler 1}
    child {node {$(\boldsymbol5,3,2)$}}
    child {node {Spieler 2}
      child {node {Spieler 3}
        child {node {$(1,3,\boldsymbol6)$\\oder\\$(3,1,\boldsymbol6)$}}
        child {node {$(3,0,7)$}}
      }
      child {node {$(7,\boldsymbol2,1)$}}
    };
\end{tikzpicture}
\caption{Deep Pruning liefert falsche Ergebnisse. $max \Sigma = 10$}
\label{fig:deep}
\end{figure}

Abbildung \ref{fig:deep} zeigt einen solchen Fall: Spieler 1 hat bereits eine Auszahlung von $5$ auf dem linken Zweig erreicht. Nun wird mittels Tiefensuche von Spieler 3 eine Auszahlung von $6$ gefunden. Es könnte angenommen werden, dass die Pruning-Bedingung erreicht ist und die restlichen Zweige nicht mehr betrachtet werden müssen. Auf dem linken Zweig von Spieler 3 sind nun zwei verschiedene Auszahlungsvektoren dargestellt. Beide würden die Pruning-Bedingung erfüllen, aber je nachdem welcher Vektor auftritt, ist das Ergebnis der Rückwärtsauflösung verschieden:

- Würde die erste (die obere) Auszahlung gefunden werden, so würde sich Spieler 2 für den linken Zweig entscheiden. Damit bekommt *Spieler 1* auf dem rechten Zweig die Auszahlung $(1,3,6)$ und würde den *linken Zweig* wählen.
- Für die untere Version der Auszahlung ist es anders: Spieler 2 würde nun den rechten Zweig wählen, da er hier eine bessere Bewertung erhält. Damit bekommt Spieler 1 auf dem rechten Zweig eine Auszahlung von $(7,2,1)$. Das ist wesentlich besser als die bisherige. In diesem Fall würde *Spieler 1* also den *rechten Zweig* wählen.

Es kommen also zwei vollkommen unterschiedliche Ergebnisse heraus. Würde der Spielbaum ohne Pruning nach dem Max^N^-Verfahren aufgelöst werden, so würde sich Spieler 3 in jedem der beiden Fälle für den rechten Zweig entscheiden. Bei der weiteren Auflösung würden sich Spieler 2 und schließlich Spieler 1 ebenfalls für die jeweils rechten Zweige entscheiden. Das Deep-Pruning würde also je nach Fall entweder ein richtiges oder ein falsches Ergebnis liefern.

Dadurch beschränkt sich das Pruning nur auf unmittelbar verwandte Knoten und die Effektivität sinkt drastisch. Vor allem wenn die Bewertungen recht gleichverteilt sind zwischen den Spielern, würde die Pruning-Bedingung fast nie erfüllt werden. Im Best Case tendiert diese Lösung gegen $\mathcal{O} (b^{ \frac{d}{2}})$. [vgl. @sturtevant2003 p. 52 - 53]

#### Immediate und Shallow Pruning-Bedingung erzeugen {#normierung}

Immediate und Shallow Pruning sind an zwei Bedingungen geknüpft: es muss einen *Maximalwert* in der Bewertung geben und eine *maximale Summe*. Praktischerweise können diese Vorrausetzungen in fast jeder Implementierung des Max^N^-Algorithmus geschaffen werden. Die Idee dazu hat bereits Sturtevant [-@sturtevant2003 s. 73] gehabt. Dazu ist folgende Modifikation notwendig:

Jedes einzelne Element im Auszahlungsvektor wird durch die Summe aller Elemente im Vektor geteilt. Formal bedeutet das, dass ein Auszahlungsvektor $\vec v \in \mathbb{R}{_0^+}^N$ ($N$ ist die Anzahl der Spieler) in einen Vektor $\vec v'$ durch folgende Operation überführt wird:

$$v'_i = \frac{v_i}{\Sigma \vec v}$$

Durch diese Operation sind alle Bewertungen im Wertebereich von $0$ bis $1$ und die Summe aller Bewertungen ist ebenfalls stets $1$. Der Ergebnisvektor dieser Operation stellt also die *Gewinnwahrscheinlichkeiten* der einzelnen Spieler dar. Damit sind die Bedingungen für Immediate und Shallow Pruning erfüllt. Im weiteren Verlauf wird diese Operation als **Normierung** bezeichnet werden.

_Anmerkung_: $\vec v$ darf kein Nullvektor sein. Ebenso sind negative Werte im Vektor problematisch. Die meisten Bewertungsfunktionen liefern aber ohnehin nur positive Bewertungen. [vgl. @sturtevant2003 p. 73]

### Hypermax

Der Hypermax-Algorithmus ist von Mikael Fridenfalk [-@fridenfalk2014] vorgestellt worden. Das Ziel ist es gewesen, eine Variante des Alpha-Beta Prunings für N-Spieler-Spiele zu entwickeln.

Der entscheidende Punkt für das Alpha-Beta Pruning ist die Eigenschaft des Nullsummenspiels. Eine positive Bewertung ist für Spieler Max im gleichen Maße gut, wie sie für Spieler Min schlecht ist. Formal ist die Pruning-Bedingung, wie bereits beschrieben, als $\alpha \geq \beta$ definiert. Umgeformt könnte die Pruning-Bedingung auch so geschrieben werden: $a_1 + a_2 \geq 0$, wobei $a_1 = \alpha$ und $a_2 = -\beta$ ist. Mit anderen Worten: sobald die Summe der besten bisher gefundenen Werte der Spieler größer oder gleich der konstanten Summe des Spieles ist (in einem Nullsummenspiel ist die Summe also $0$), kann der aktuell betrachtete Zweig im Spielbaum keine Verbesserung mehr bringen. Da es sich nun mal um ein Spiel konstanter Summe handelt, ist klar, dass das Übersteigen dieser Summe nicht zulässig ist.

Fridenfalk führt nun fort, dass Alpha-Beta Pruning möglich wäre, wenn es sich auch beim N-Spieler-Spiel um ein Nullsummenspiel handeln würde. Dazu gibt er eine Methode, dies zu erreichen. $\vec v$ ist wieder das ursprüngliche Ergebnis der Bewertungsfunktion und $\vec v'$ die modifizierte Version. Die Umwandlung in ein Nullsummenspiel (er bezeichnet dies als eine Transformation in einen Zero-Space Vektor) erfolgt, indem von allen Elementen in $\vec v$ der Durchschnitt aller Elemente abgezogen wird. Also: 

$$v'_i = v_i - avg(\vec v)$$

Der Algorithmus funktioniert nun so, dass in einem Vektor (den Fridenfalk $\vec\alpha$ nennt) die jeweils bisher besten Ergebnisse für die jeweiligen Spieler gespeichert werden. Zu Beginn wird jedes Element in $\vec\alpha$ mit $-\infty$ initialisiert. Wann immer eine bessere Bewertung gefunden wird, wird das zum jeweiligen Spieler gehörenden Element in $\vec\alpha$ aktualisiert (maximiert). Sobald nun die Summe von $\vec\alpha$ größer oder gleich $0$ ist, ist die Pruning-Bedingung erreicht und der aktuelle Zweig wird beschnitten.

\begin{figure}
\centering
\begin{tikzpicture}
  \node {Spieler 1}
    child {node {$(\boldsymbol2,-3,1)$\\\textit{Max\textsuperscript N}}}
    child {node {Spieler 2}
      child {node {$(3,\boldsymbol{-2},-1)$\\\textit{Hypermax}}}
      child {node {Spieler 3}
        child {node {$(1,-3,\boldsymbol2)$}}
        child {node {$(-2,-1,\boldsymbol3)$}}
      }
    };
\end{tikzpicture}
\caption{Unterschiede zwischen Max\textsuperscript N und Hypermax}
\label{fig:hypermax}
\end{figure}

In den meisten Fällen sind die Ergebnisse des Max^N^ und des Hypermax identisch. In einigen Fällen beschneidet der Hypermax allerdings Zweige, die Einfluss auf das Endergebnis gehabt hätten. So ein Beispiel ist in Abbildung \ref{fig:hypermax} zu sehen. In dem Moment, wo Spieler 3 den linken Zweig absucht, ist die Pruning-Bedingung des Hypermax erreicht. Spieler 1 hat bisher eine $2$ und Spieler 2 bisher eine $-2$ gefunden. Mit der Auszahlung von $2$ für Spieler 3 ist nun die Summe der besten gefundenen Auszahlungen größer als $0$. Dadurch würde sich Spieler 2 für den linken und Spieler 1 für den rechten Zweig entscheiden. Der Max^N^ ohne Pruning hätte sich aber korrekterweise für den rechten Zweig unter Spieler 3 entschieden (der ja vom Hypermax beschnitten worden wäre). Damit hätte auch Spieler 2 den rechten Zweig gewählt und Spieler 1 dann schließlich den linken. Also zwei vollkommen unterschiedliche Ergebnisse, je nachdem ob Pruning verwendet wird oder nicht.

Fridenfalk ist sich dieser Abweichung im Verhalten bewusst. Er argumentiert allerdings, dass in den meisten Fällen die Ergebnisse gleich sind. Außerdem kann der Hypermax durch das Pruning in der gleichen Zeit den Spielbaum tiefer durchsuchen und findet so bessere "weitsichtigere" Auszahlungen als sein Bruder-Algorithmus. Die Argumentation ist also ähnlich zum paranoiden Ansatz. Nicht die Genauigkeit der Berechnung, sondern die höhere Suchtiefe sollen den entscheidenden Vorteil liefern.

Die Unmöglichkeit von tiefen Pruning-Verfahren für N-Spieler-Spiele ist bereits von Luckhardt und Irani [-@luckhart1986] postuliert worden. Die Abweichungen des Hypermax beruhen u.U. auf dem gleichen Grund, warum auch das Shallow Pruning eben nur zwischen Vater- und Kindknoten korrekt funktioniert. Dies genauer zu analysieren, würde allerdings den Rahmen dieser Arbeit sprengen.
