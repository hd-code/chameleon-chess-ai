# Ziel dieser Arbeit

Ziel dieser Arbeit ist es, einen Computergegner für das Brettspiel "Chamäleon Schach" zu entwickeln. Zur Zeit wird eine digitale Version des Spieles erarbeitet. Es entsteht eine App für mobile Endgeräte. Die Umsetzung erfolgt mit dem JavaScript Framework React Native. Die komplette App ist also in JavaScript implementiert. Daher soll der Computergegner optimalerweise ebenfalls in JavaScript geschrieben werden.

Eine besondere Herausforderung ist, dass die App auf dem mobilen Endgerät ausgeführt wird, ohne Nutzung eines Servers. Das heißt, dass komplizierte Berechnungen nicht in einen Cloud Service ausgelagert werden können. Alle Berechnungen müssen auf dem Endgerät selbst, mit den entsprechend beschränkten Ressourcen, durchführbar sein. Im Design-Prozess der App ist festgestellt worden, dass es besser aussieht, wenn der Computer nicht "sofort" seinen Zug ausführt, sondern sich eine kleine "Bedenkzeit" lässt. Dabei hat sich ein Zeitraum von einer Sekunde als optimal erwiesen. Die Berechnungen können also ohne Probleme bis zu einer Sekunde dauern.

Gleichzeitig soll der Computergegner natürlich so stark wie möglich sein. Es soll in Zukunft zwar auch verschiedene Schwierigkeitslevel geben, diese werden aber durch ein künstliches Abschwächen des optimalen Computergegners umgesetzt und spielen hier keine Rolle.

Im Rahmen dieser Arbeit liegt der Fokus auf "klassischen" algorithmischen Verfahren zur Umsetzung von Computergegnern. Verschiedene Algorithmen werden im Verlaufe der Arbeit vorgestellt, implementiert und miteinander verglichen. Am Ende wird der beste Algorithmus ermittelt und in die App eingebaut.
