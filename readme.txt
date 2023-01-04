Gamestore

Ik heb gekozen voor een API van een gamestore, dit is licht gebasseerd op het principe van de PS-store.

deze bevat een 6-tal routes en modellen.
Namelijk genres, studios, games, users, libraries en auth. 

Om te beginnen moet er eerst een user aangemaakt worden, daarbij moeten er enkele gegevens meegegeven worden.
- name
- email
- birthdate als json formaat (voorbeeld: "2001-10-20T00:00:00")
- password 
- isAdmin (boolean). 

good practice is het niet toegestaan om een soort keuze te geven om al dan niet adminrechten te geven.
Maar om de API iets makkelijker te testen is deze toch toegevoegd.

Vervolgens kan er indien er adminrechten zijn genres aangemaakt worden. Genres heeft maar 1 parameter namelijk "name". 

Met deze adminrechten kunnen er ook studios aangemaakt worden, deze bevatten 2 parameters:
- name
- location

Ook is er in deze klasse een put, indien het nodig is om de naam of de locatie aan te passen van de ingegeven studio.

De games klasse heeft 2 getters die geen authenticatie nodig hebben, de ene get is om de games van een bepaalde studio op te halen
en de andere om de games op te halen van een bepaald genre.
Het game model heeft volgende parameters nodig:
-title
-genreId
-studioId

De post kan enkel gedaan worden door een admin alsook de put.

De volgende klasse is de library klasse. Deze klasse spiegelt de bibliotheek die in hedendaagse appstores ingewerkt zit.
Eerst is er een post nodig, deze maakt een nieuwe library aan voor de userId die meegegeven moet worden in de json string.
Hier kan u zien dat er een lege array zal aangemaakt worden. Ik heb daarvoor bewust gekozen, daar je als consument altijd begint met een lege bibliotheek.

Via de put kunnen er games toegevoegd worden aan de bibliotheek. in de url moet de library id meegegeven worden 
en in de json string een gameId en userId. 
Hierbij zal na de nodige controles de game toegevoegd worden aan de array in de database.

Er is ook een delete optie, deze is echter enkel toegestaan voor admin gebruikers.



