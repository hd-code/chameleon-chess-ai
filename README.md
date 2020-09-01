# chameleon-chess-ai

Dieses Projekt enthält den Eigenanteil zu der Bachelor Arbeit:

"Implementierung eines Computergegners für Chamäleon Schach nach heuristischem Ansatz"  
von *Hannes Dröse*  
Registriernummer: AI-2020-BA-012

In dieser Arbeit wird ein Computergegner für das Brettspiel "Chamäleon Schach" implementiert. Die ausführlichen Spielregeln finden sich im Anhang der Bachelor Arbeit.

## Vorraussetzungen

Die meisten Teile dieses Projektes sind in Node.js implementiert. Daher wird benötigt:

- **Node.js** v12 oder höher
- **NPM** v6 oder höher

Zusätzlich ist die Ermittlung des Branching Factors und der durchschnittlichen Depth des Spieles mit einem Jupyter-Notebook erfolgt. Entweder muss also **Jupyter** installiert sein oder alternativ: **Docker**. Dieses Projekt enthält auch ein Docker-Compose-file, welches eine Jupyter-Notebook-Instanz hochfahren kann.

## Installation

Um die Größe des Projektes möglichst klein zu halten, sind externe Abhängigkeiten nicht in diesem Projekt enthalten, sondern müssen separat installiert werden. Dazu bitte den folgenden Anweisungen folgen:

```sh
# Git Repository klonen (falls dies nicht anderweitig schon geschehen ist)
git clone https://github.com/hd-code/chameleon-chess-ai

# In den Ordner des Repositories wechseln
cd chameleon-chess-ai

# NPM installiert alle externen Abhängigkeiten automatisch
npm install
```

Unter den NPM-Abhängigkeiten ist auch die Spiellogik von "Chamäeleon Schach". Die Spiellogik ist in einem separaten Repository implementiert worden. Sollte die Spiellogik nicht automatisch installiert werden können, dann bitte von hier herunterladen: <https://github.com/hd-code/chameleon-chess-logic>. Wenn das immer noch nicht funktioniert, dann bitte bei mir melden!

## Usage

### Node.js Scripts

Im Ordner `scripts` finden sich alle Skripte, die verwendet worden sind, um die Daten für die Bachelor Arbeit zu generieren. Ein beliebiges Skript kann wie folgt aufgerufen werden:

```sh
npx ts-node scripts/<dateiname_des_skriptes>
```

### Jupyter-Notebook (mit Docker)

Um das Jupyter-Notebook zu starten einfach:

```sh
docker-compose up
```

ausführen.

Das Jupyter Notebook kann nun im Webbrowser abgerufen werden unter:  
<http://localhost:5010>

Das Passwort lautet: `secret`

## Projektstruktur

- `data` enthält JSON- und CSV-Dateien, welche die von den Skripten generierten Daten speichern. Dadurch müssen die Skripte nicht immer alles neu generieren, sondern geben einfach die gecachten Daten aus.
- `docs` enthält PDF-Dokumente, die von den Jupyter Notebooks erzeugt worden sind. Außerdem liegen hier TXT-Dateien mit den Konsolenausgaben der Skripte aus dem Ordner `scripts`.
- `lib` enthält externe Software-Bibliotheken. Das sind alles meine eigenen Hilfsbibliotheken, die in einem separaten Repository liegen. Um nicht noch mehr externe Abhängigkeiten laden zu müssen, sind diese Komponenten einfach in diesen Ordner gepackt worden.
- `notebooks` enthält Jupiter-Notebook-Dateien.
- `scripts` enthält alle Skripte, die Daten für die Bachelor Arbeit generieren und darstellen.
- `src` enthält den Source-Code für die Bewertungsfunktionen, die Implementierungen der Algorithmen sowie weitere Software-Komponenten, die zum Beispiel von den Skripten verwendet werden.
- `thesis` enthält die Dateien, mit denen die fertige Bachelor Arbeit als PDF generiert worden ist.

## Skripte

Folgende Skripte sind erstellt worden:

- `1-best-eval.ts`: spielt mehrere Sessions mit MaxN-Instanzen, um verschiedenen Bewertungsfunktionen gegeneinander zu testen. Ziel ist es, die beste Bewertungsfunktion zu finden.
- `2-paranoid.ts`: spielt mehrere Sessions mit dem Paranoid-Algorithmus in normierter und nicht normierter Form. Ziel ist es, herauszufinden, ob der Paranoid mit oder ohne Normierung arbeiten soll.
- `3-hypermax.ts`: macht das gleiche wie `2-paranoid.ts`, allerdings mit dem Hypermax statt dem Paranoid.
- `4-best-algo.ts`: spielt mehrere Sessions mit dem MaxN, MaxNIS, Hypermax und Paranoid, um den besten Algorithmus für "Chamäleon Schach" zu ermitteln.
- `branching-factor-and-depth.ts`: nutzt den Sieger-Algorithmus (MaxNIS), um wiederholt Spiele gegen sich selbst zu spielen. Dabei wird mit verschiedenen Wahrscheinlichkeiten ein Zufallszug ausgeführt. Die gespielten Spiele sind gespeichert und anschließend mit einem Jupyter-Notebook analysiert worden.

Alle Sessions speichern den kompletten Spielverlauf in einer Datei im Ordner `data`, welche den gleichen Namen wie die Session trägt. Aus diesem Grund steht bei den Tabellen, die von den Skripten generiert werden immer "cached" dahinter. Dies zeigt, dass die Wert nicht neu berechnet worden sind, sondern aus den JSON-Dateien im `data`-Ordner stammen. Wenn Berechnungen erneut durchgeführt werden sollen, muss unbedingt die zugehörige JSON-Datei gelöscht werden. Ansonsten werden immer nur die gecachten Daten ausgegeben. 

## Bachelor Arbeit

Im Ordner `thesis` liegen die Dateien, mit denen die BA generiert worden ist. Die BA ist in Markdown geschrieben. Anschließend ist das Tool "Pandoc" benutzt worden, um daraus das fertige PDF zu erstellen. Im Ordner `thesis/docker` liegt ein Dockerfile, welches einen Container mit Pandoc erstellt. Dort liegt außerdem eine Dateien mit den Konsolen-Befehlen, um den Pandoc-Container zu starten und die BA generieren zu lassen.