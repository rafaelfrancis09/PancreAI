(function () {
  const api = window.PancreAII18n;
  if (!api || api.__fullTranslationLayer) return;

  const languages = ["en", "es", "fr", "de", "it"];

  const keyRows = [
    ["common.continue", "Continue", "Continuar", "Continuer", "Weiter", "Continua"],
    ["common.back", "Back", "Volver", "Retour", "Zurück", "Indietro"],
    ["common.save", "Save", "Guardar", "Enregistrer", "Speichern", "Salva"],
    ["common.cancel", "Cancel", "Cancelar", "Annuler", "Abbrechen", "Annulla"],
    ["common.confirm", "Confirm", "Confirmar", "Confirmer", "Bestätigen", "Conferma"],
    ["common.edit", "Edit", "Editar", "Modifier", "Bearbeiten", "Modifica"],
    ["common.remove", "Remove", "Eliminar", "Supprimer", "Entfernen", "Rimuovi"],
    ["common.add", "Add", "Agregar", "Ajouter", "Hinzufügen", "Aggiungi"],
    ["common.next", "Next", "Siguiente", "Suivant", "Weiter", "Avanti"],
    ["common.finish", "Finish", "Finalizar", "Terminer", "Fertig", "Fine"],
    ["common.close", "Close", "Cerrar", "Fermer", "Schließen", "Chiudi"],
    ["common.review", "Review", "Revisar", "Vérifier", "Prüfen", "Controlla"],
    ["common.warning", "Warning", "Aviso", "Avertissement", "Warnung", "Avviso"],
    ["common.error", "Error", "Error", "Erreur", "Fehler", "Errore"],
    ["common.info", "Information", "Información", "Information", "Information", "Informazione"],
    ["common.comingSoon", "Coming soon", "Próximamente", "Bientôt", "Demnächst", "Prossimamente"],
    ["common.availableNow", "Available now", "Disponible ahora", "Disponible maintenant", "Jetzt verfügbar", "Disponibile ora"],
    ["nav.home", "Home", "Inicio", "Accueil", "Home", "Home"],
    ["nav.history", "History", "Historial", "Historique", "Verlauf", "Cronologia"],
    ["nav.profile", "Profile", "Perfil", "Profil", "Profil", "Profilo"],
    ["nav.favorites", "Favorites", "Favoritos", "Favoris", "Favoriten", "Preferiti"],
    ["nav.settings", "Settings", "Ajustes", "Réglages", "Einstellungen", "Impostazioni"],
    ["nav.terms", "Terms of use", "Términos de uso", "Conditions d’utilisation", "Nutzungsbedingungen", "Termini d’uso"],
    ["nav.language", "Language", "Idioma", "Langue", "Sprache", "Lingua"],
    ["language.title", "Choose your language", "Elige tu idioma", "Choisissez votre langue", "Sprache auswählen", "Scegli la lingua"],
    ["language.description", "PancreAI is being prepared for multilingual support. Choose one of the available languages to continue.", "PancreAI se está preparando para soporte multilingüe. Elige uno de los idiomas disponibles para continuar.", "PancreAI se prépare au support multilingue. Choisissez une langue disponible pour continuer.", "PancreAI wird für mehrsprachige Nutzung vorbereitet. Wählen Sie eine verfügbare Sprache aus.", "PancreAI si sta preparando al supporto multilingue. Scegli una lingua disponibile per continuare."],
    ["language.availableTitle", "Available now", "Disponibles ahora", "Disponibles maintenant", "Jetzt verfügbar", "Disponibili ora"],
    ["language.futureTitle", "Future languages", "Idiomas futuros", "Langues futures", "Zukünftige Sprachen", "Lingue future"],
    ["language.futureDescription", "We are preparing PancreAI to reach more people. These languages will be released in future versions.", "Estamos preparando PancreAI para llegar a más personas. Estos idiomas se lanzarán en próximas versiones.", "Nous préparons PancreAI pour atteindre plus de personnes. Ces langues seront publiées dans de prochaines versions.", "Wir bereiten PancreAI darauf vor, mehr Menschen zu erreichen. Diese Sprachen erscheinen in späteren Versionen.", "Stiamo preparando PancreAI per raggiungere più persone. Queste lingue arriveranno nelle prossime versioni."],
    ["language.availableDescription", "Interface available in this version", "Interfaz disponible en esta versión", "Interface disponible dans cette version", "Oberfläche in dieser Version verfügbar", "Interfaccia disponibile in questa versione"],
    ["language.continue", "Continue", "Continuar", "Continuer", "Weiter", "Continua"],
    ["language.toastFuture", "This language will be added in the future.", "Este idioma se agregará en el futuro.", "Cette langue sera ajoutée plus tard.", "Diese Sprache wird später hinzugefügt.", "Questa lingua sarà aggiunta in futuro."],
    ["intro.welcomeTitle", "Welcome to PancreAI", "Bienvenido a PancreAI", "Bienvenue sur PancreAI", "Willkommen bei PancreAI", "Benvenuto in PancreAI"],
    ["intro.welcomeText", "An app to estimate enzymes with more clarity, safety, and manual confirmation before calculation.", "Una app para estimar enzimas con más claridad, seguridad y confirmación manual antes del cálculo.", "Une app pour estimer les enzymes avec plus de clarté, de sécurité et une confirmation manuelle avant le calcul.", "Eine App zur Enzymschätzung mit mehr Klarheit, Sicherheit und manueller Bestätigung vor der Berechnung.", "Un’app per stimare gli enzimi con più chiarezza, sicurezza e conferma manuale prima del calcolo."],
    ["intro.reviewTitle", "Take a photo, review, and confirm", "Fotografías, revisas y confirmas", "Photographiez, vérifiez et confirmez", "Foto aufnehmen, prüfen und bestätigen", "Scatta, controlla e conferma"],
    ["intro.reviewText", "PancreAI never calculates by itself. First the meal is analyzed, then you calmly check everything.", "PancreAI nunca calcula solo. Primero se analiza la comida y luego revisas todo con calma.", "PancreAI ne calcule jamais seul. Le repas est d’abord analysé, puis vous vérifiez tout calmement.", "PancreAI berechnet nie allein. Erst wird die Mahlzeit analysiert, dann prüfst du alles in Ruhe.", "PancreAI non calcola mai da solo. Prima il pasto viene analizzato, poi controlli tutto con calma."],
    ["intro.setupTitle", "First, set up your treatment", "Primero, configura tu tratamiento", "D’abord, configurez votre traitement", "Zuerst die Behandlung einrichten", "Prima configura il trattamento"],
    ["intro.setupText", "Weight, prescribed dose, and pancreatic enzyme are saved and used automatically in future calculations.", "El peso, la dosis prescrita y la enzima pancreática quedan guardados y se usan automáticamente en los próximos cálculos.", "Le poids, la dose prescrite et l’enzyme pancréatique sont enregistrés et utilisés automatiquement dans les prochains calculs.", "Gewicht, verordnete Dosis und Pankreasenzym werden gespeichert und automatisch für spätere Berechnungen verwendet.", "Peso, dose prescritta ed enzima pancreatico vengono salvati e usati automaticamente nei prossimi calcoli."],
    ["treatment.title", "My Treatment", "Mi tratamiento", "Mon traitement", "Meine Behandlung", "Il mio trattamento"],
    ["treatment.intro", "These details are used in calculations and stay saved locally on your device. Choose only the treatment already prescribed.", "Estos datos se usan en los cálculos y quedan guardados localmente en tu dispositivo. Elige solo el tratamiento ya prescrito.", "Ces données sont utilisées dans les calculs et restent enregistrées localement sur votre appareil. Choisissez uniquement le traitement déjà prescrit.", "Diese Angaben werden für Berechnungen genutzt und lokal auf deinem Gerät gespeichert. Wähle nur die bereits verordnete Behandlung.", "Questi dati vengono usati nei calcoli e restano salvati localmente sul dispositivo. Scegli solo il trattamento già prescritto."],
    ["treatment.country", "Treatment country or region", "País o región del tratamiento", "Pays ou région du traitement", "Land oder Region der Behandlung", "Paese o regione del trattamento"],
    ["treatment.countryNone", "None", "Ninguno", "Aucun", "Keine", "Nessuno"],
    ["treatment.selectCountry", "Select a country or region to see medication options.", "Selecciona un país o región para ver las opciones de medicamento.", "Sélectionnez un pays ou une région pour voir les options de médicament.", "Wähle ein Land oder eine Region, um Medikamentenoptionen zu sehen.", "Seleziona un paese o una regione per vedere le opzioni di farmaco."],
    ["treatment.countryHelp", "This helps the app show more likely medication options. Availability may vary.", "Esto ayuda a la app a mostrar opciones de medicamento más probables. La disponibilidad puede variar.", "Cela aide l’app à afficher les options de médicament les plus probables. La disponibilité peut varier.", "Dies hilft der App, wahrscheinlichere Medikamentenoptionen anzuzeigen. Die Verfügbarkeit kann variieren.", "Questo aiuta l’app a mostrare le opzioni di farmaco più probabili. La disponibilità può variare."],
    ["treatment.weight", "Patient weight", "Peso del paciente", "Poids du patient", "Patientengewicht", "Peso del paziente"],
    ["treatment.prescribedDose", "Prescribed dose", "Dosis prescrita", "Dose prescrite", "Verordnete Dosis", "Dose prescritta"],
    ["treatment.prescribedDoseHelp", "Lipase units per gram of fat.", "Unidades de lipasa por gramo de grasa.", "Unités de lipase par gramme de graisse.", "Lipase-Einheiten pro Gramm Fett.", "Unità di lipasi per grammo di grassi."],
    ["treatment.medication", "Prescribed enzyme medication", "Medicamento enzimático prescrito", "Médicament enzymatique prescrit", "Verordnetes Enzymmedikament", "Farmaco enzimatico prescritto"],
    ["treatment.medicationHelp", "Choose only the medication that has already been prescribed.", "Elige solo el medicamento que ya fue prescrito.", "Choisissez uniquement le médicament déjà prescrit.", "Wähle nur das Medikament aus, das bereits verordnet wurde.", "Scegli solo il farmaco già prescritto."],
    ["treatment.lipasePerUnit", "Lipase units per capsule/tablet/unit", "Unidades de lipasa por cápsula/comprimido/unidad", "Unités de lipase par gélule/comprimé/unité", "Lipase-Einheiten pro Kapsel/Tablette/Einheit", "Unità di lipasi per capsula/compressa/unità"],
    ["treatment.customMedication", "My medication is not listed", "Mi medicamento no está en la lista", "Mon médicament n’est pas dans la liste", "Mein Medikament ist nicht in der Liste", "Il mio farmaco non è nell’elenco"],
    ["treatment.customHelp", "Enter only values shown on your prescription, package, or leaflet.", "Ingresa solo valores que aparezcan en tu receta, envase o prospecto.", "Saisissez uniquement les valeurs indiquées sur votre prescription, l’emballage ou la notice.", "Gib nur Werte ein, die auf Verordnung, Verpackung oder Beipackzettel stehen.", "Inserisci solo valori presenti nella prescrizione, confezione o foglietto illustrativo."],
    ["treatment.form", "Medication form", "Forma del medicamento", "Forme du médicament", "Form des Medikaments", "Forma del farmaco"],
    ["treatment.unitName", "Unit name", "Nombre de la unidad", "Nom de l’unité", "Name der Einheit", "Nome dell’unità"],
    ["treatment.prescriptionNote", "Prescription note", "Nota de la receta", "Note de prescription", "Hinweis zur Verordnung", "Nota della prescrizione"],
    ["treatment.save", "Save treatment", "Guardar tratamiento", "Enregistrer le traitement", "Behandlung speichern", "Salva trattamento"],
    ["treatment.saved", "Treatment saved.", "Tratamiento guardado.", "Traitement enregistré.", "Behandlung gespeichert.", "Trattamento salvato."],
    ["treatment.noSubstitution", "PancreAI does not recommend changing medication.", "PancreAI no recomienda cambiar de medicamento.", "PancreAI ne recommande pas de changer de médicament.", "PancreAI empfiehlt keinen Medikamentenwechsel.", "PancreAI non consiglia di cambiare farmaco."],
    ["treatment.onlyPrescription", "Change this option only if it matches your prescription. Enzyme medicines can have different strengths and forms.", "Cambia esta opción solo si coincide con tu receta. Los medicamentos enzimáticos pueden tener potencias y formas diferentes.", "Modifiez cette option uniquement si elle correspond à votre prescription. Les médicaments enzymatiques peuvent avoir des dosages et formes différents.", "Ändere diese Option nur, wenn sie deiner Verordnung entspricht. Enzymmedikamente können unterschiedliche Stärken und Formen haben.", "Modifica questa opzione solo se corrisponde alla prescrizione. I farmaci enzimatici possono avere potenze e forme diverse."],
    ["treatment.manualPower", "Enter the strength shown on your prescription or package.", "Ingresa la potencia que aparece en tu receta o envase.", "Indiquez le dosage affiché sur votre prescription ou emballage.", "Gib die Stärke ein, die auf Verordnung oder Verpackung steht.", "Inserisci la potenza indicata sulla prescrizione o confezione."],
    ["treatment.confirmPower", "Check that the lipase strength was entered exactly as shown on the prescription or package.", "Confirma que la potencia de lipasa se ingresó exactamente como aparece en la receta o el envase.", "Vérifiez que le dosage de lipase a été saisi exactement comme sur la prescription ou l’emballage.", "Prüfe, dass die Lipase-Stärke exakt wie auf Verordnung oder Verpackung eingegeben wurde.", "Controlla che la potenza di lipasi sia stata inserita esattamente come nella prescrizione o confezione."],
    ["treatment.completeRequired", "Enter weight and prescribed dose to continue.", "Ingresa peso y dosis prescrita para continuar.", "Saisissez le poids et la dose prescrite pour continuer.", "Gib Gewicht und verordnete Dosis ein, um fortzufahren.", "Inserisci peso e dose prescritta per continuare."],
    ["treatment.selectMedication", "Select a verified option or use “My medication is not listed” to enter it manually.", "Selecciona una opción verificada o usa “Mi medicamento no está en la lista” para registrarlo manualmente.", "Sélectionnez une option vérifiée ou utilisez “Mon médicament n’est pas dans la liste” pour le saisir manuellement.", "Wähle eine geprüfte Option oder nutze „Mein Medikament ist nicht in der Liste“, um es manuell einzugeben.", "Seleziona un’opzione verificata o usa “Il mio farmaco non è nell’elenco” per inserirlo manualmente."],
    ["treatment.manualNameRequired", "Enter the manual medication name.", "Ingresa el nombre del medicamento manual.", "Saisissez le nom du médicament manuel.", "Gib den Namen des manuell erfassten Medikaments ein.", "Inserisci il nome del farmaco manuale."],
    ["treatment.savedSuccess", "Treatment saved successfully.", "Tratamiento guardado correctamente.", "Traitement enregistré avec succès.", "Behandlung erfolgreich gespeichert.", "Trattamento salvato correttamente."],
    ["home.welcome", "Welcome!", "¡Bienvenido!", "Bienvenue !", "Willkommen!", "Benvenuto!"],
    ["home.ready", "Ready to analyze your meal?", "¿Listo para analizar tu comida?", "Prêt à analyser votre repas ?", "Bereit, deine Mahlzeit zu analysieren?", "Pronto ad analizzare il pasto?"],
    ["home.analyzeMeal", "Analyze meal", "Analizar comida", "Analyser le repas", "Mahlzeit analysieren", "Analizza pasto"],
    ["home.howItWorks", "How it works", "Cómo funciona", "Comment ça marche", "So funktioniert es", "Come funziona"],
    ["home.howItWorksText", "Take or choose a photo. Gemini identifies foods; you review them and the app calculates with local data.", "Toma o elige una foto. Gemini identifica alimentos; tú los revisas y la app calcula con datos locales.", "Prenez ou choisissez une photo. Gemini identifie les aliments ; vous les vérifiez et l’app calcule avec les données locales.", "Nimm ein Foto auf oder wähle eines aus. Gemini erkennt Lebensmittel; du prüfst sie und die App berechnet mit lokalen Daten.", "Scatta o scegli una foto. Gemini identifica gli alimenti; tu li controlli e l’app calcola con i dati locali."],
    ["home.shortcuts", "Shortcuts", "Atajos", "Raccourcis", "Kurzwege", "Scorciatoie"],
    ["analysis.confirmTitle", "Confirm analysis", "Confirmar análisis", "Confirmer l’analyse", "Analyse bestätigen", "Conferma analisi"],
    ["analysis.detectedFoods", "Detected foods", "Alimentos detectados", "Aliments détectés", "Erkannte Lebensmittel", "Alimenti rilevati"],
    ["analysis.reviewBeforeCalculate", "Review foods before calculating.", "Revisa los alimentos antes de calcular.", "Vérifiez les aliments avant de calculer.", "Prüfe die Lebensmittel vor der Berechnung.", "Controlla gli alimenti prima del calcolo."],
    ["analysis.addFood", "Add food", "Agregar alimento", "Ajouter un aliment", "Lebensmittel hinzufügen", "Aggiungi alimento"],
    ["analysis.confirm", "Confirm analysis", "Confirmar análisis", "Confirmer l’analyse", "Analyse bestätigen", "Conferma analisi"],
    ["analysis.reanalyze", "Analyze again", "Analizar de nuevo", "Analyser à nouveau", "Erneut analysieren", "Analizza di nuovo"],
    ["result.title", "Result", "Resultado", "Résultat", "Ergebnis", "Risultato"],
    ["result.summary", "Summary", "Resumen", "Résumé", "Zusammenfassung", "Riepilogo"],
    ["result.totalFat", "Total fat", "Grasa total", "Graisse totale", "Gesamtfett", "Grassi totali"],
    ["result.fat", "Fat", "Grasa", "Graisse", "Fett", "Grassi"],
    ["result.protein", "Protein", "Proteína", "Protéine", "Protein", "Proteine"],
    ["result.carbs", "Carbs", "Carbohidratos", "Glucides", "Kohlenhydrate", "Carboidrati"],
    ["result.prescribedDose", "Prescribed dose", "Dosis prescrita", "Dose prescrite", "Verordnete Dosis", "Dose prescritta"],
    ["result.medication", "Medication", "Medicamento", "Médicament", "Medikament", "Farmaco"],
    ["result.power", "Strength", "Potencia", "Dosage", "Stärke", "Potenza"],
    ["result.requiredLipase", "Required lipase", "Lipasa necesaria", "Lipase nécessaire", "Benötigte Lipase", "Lipasi necessaria"],
    ["result.calculation", "Calculation", "Cálculo", "Calcul", "Berechnung", "Calcolo"],
    ["result.estimatedUnits", "Suggested units", "Unidades sugeridas", "Unités suggérées", "Vorgeschlagene Einheiten", "Unità suggerite"],
    ["result.unitsInUse", "Units in use", "Unidades en uso", "Unités utilisées", "Verwendete Einheiten", "Unità in uso"],
    ["result.deliveredLipase", "Delivered lipase", "Lipasa entregada", "Lipase fournie", "Abgegebene Lipase", "Lipasi erogata"],
    ["result.fullCalculation", "View full calculation", "Ver cálculo completo", "Voir le calcul complet", "Vollständige Berechnung anzeigen", "Vedi calcolo completo"],
    ["result.saveFavorite", "Save favorite meal", "Guardar comida favorita", "Enregistrer le repas favori", "Lieblingsmahlzeit speichern", "Salva pasto preferito"],
    ["result.favoriteSaved", "Meal saved to favorites", "Comida guardada en favoritos", "Repas enregistré dans les favoris", "Mahlzeit in Favoriten gespeichert", "Pasto salvato nei preferiti"],
    ["result.favoriteSavedToast", "Meal saved", "Comida guardada", "Repas enregistré", "Mahlzeit gespeichert", "Pasto salvato"],
    ["result.adjustDose", "Adjust dose", "Ajustar dosis", "Ajuster la dose", "Dosis anpassen", "Regola dose"],
    ["result.adjustedDoseNote", "Dose manually adjusted from the suggestion of {dose}.", "Dosis ajustada manualmente respecto a la sugerencia de {dose}.", "Dose ajustée manuellement par rapport à la suggestion de {dose}.", "Dosis manuell gegenüber dem Vorschlag von {dose} angepasst.", "Dose modificata manualmente rispetto al suggerimento di {dose}."],
    ["result.unusual", "We found an unusual result. Review the foods before using this calculation.", "Encontramos un resultado inusual. Revisa los alimentos antes de usar este cálculo.", "Nous avons trouvé un résultat inhabituel. Vérifiez les aliments avant d’utiliser ce calcul.", "Wir haben ein ungewöhnliches Ergebnis gefunden. Prüfe die Lebensmittel, bevor du diese Berechnung nutzt.", "Abbiamo trovato un risultato insolito. Controlla gli alimenti prima di usare questo calcolo."],
    ["result.estimatedNote", "This result is an estimate based on the registered data and does not replace professional guidance.", "Este resultado es una estimación basada en los datos registrados y no reemplaza la orientación profesional.", "Ce résultat est une estimation basée sur les données enregistrées et ne remplace pas un avis professionnel.", "Dieses Ergebnis ist eine Schätzung auf Basis der gespeicherten Daten und ersetzt keine professionelle Beratung.", "Questo risultato è una stima basata sui dati registrati e non sostituisce il parere professionale."],
    ["profile.subtitle", "Settings and preferences", "Ajustes y preferencias", "Réglages et préférences", "Einstellungen und Präferenzen", "Impostazioni e preferenze"],
    ["profile.preferences", "Preferences", "Preferencias", "Préférences", "Präferenzen", "Preferenze"],
    ["profile.notifications", "Notifications", "Notificaciones", "Notifications", "Benachrichtigungen", "Notifiche"],
    ["profile.security", "Safety", "Seguridad", "Sécurité", "Sicherheit", "Sicurezza"],
    ["profile.about", "About", "Acerca de", "À propos", "Über", "Info"],
    ["profile.childMode", "Child mode", "Modo infantil", "Mode enfant", "Kindermodus", "Modalità bambino"],
    ["profile.medicalAlerts", "Medical warnings", "Avisos médicos", "Avertissements médicaux", "Medizinische Hinweise", "Avvisi medici"],
    ["profile.mealReminders", "Meal reminders", "Recordatorios de comidas", "Rappels de repas", "Mahlzeit-Erinnerungen", "Promemoria pasti"],
    ["profile.photoTutorial", "Photo tutorial", "Tutorial de fotos", "Tutoriel photo", "Foto-Tutorial", "Tutorial foto"],
    ["profile.medicalReport", "Medical report", "Informe médico", "Rapport médical", "Medizinischer Bericht", "Report medico"],
    ["profile.aboutFlow", "About and how it works", "Acerca de y funcionamiento", "À propos et fonctionnement", "Über und Funktionsweise", "Info e funzionamento"],
    ["profile.favoriteMeals", "Favorite meals", "Comidas favoritas", "Repas favoris", "Lieblingsmahlzeiten", "Pasti preferiti"]
  ];

  const phraseRows = [
    ["Continuar em português", "Continue in Portuguese", "Continuar en portugués", "Continuer en portugais", "Auf Portugiesisch fortfahren", "Continua in portoghese"],
    ["Interface completa nesta versão", "Full interface in this version", "Interfaz completa en esta versión", "Interface complète dans cette version", "Vollständige Oberfläche in dieser Version", "Interfaccia completa in questa versione"],
    ["DISPONÍVEL AGORA", "AVAILABLE NOW", "DISPONIBLE AHORA", "DISPONIBLE MAINTENANT", "JETZT VERFÜGBAR", "DISPONIBILE ORA"],
    ["IDIOMAS FUTUROS", "FUTURE LANGUAGES", "IDIOMAS FUTUROS", "LANGUES FUTURES", "ZUKÜNFTIGE SPRACHEN", "LINGUE FUTURE"],
    ["Bem-vindo!", "Welcome!", "¡Bienvenido!", "Bienvenue !", "Willkommen!", "Benvenuto!"],
    ["Pronto para analisar sua refeição?", "Ready to analyze your meal?", "¿Listo para analizar tu comida?", "Prêt à analyser votre repas ?", "Bereit, deine Mahlzeit zu analysieren?", "Pronto ad analizzare il pasto?"],
    ["Analisar refeição", "Analyze meal", "Analizar comida", "Analyser le repas", "Mahlzeit analysieren", "Analizza pasto"],
    ["Como funciona", "How it works", "Cómo funciona", "Comment ça marche", "So funktioniert es", "Come funziona"],
    ["Tire uma foto da sua refeição ou escolha da galeria. O app estima a gordura e sugere a quantidade de unidades enzimáticas.", "Take a photo of your meal or choose one from the gallery. The app estimates fat and suggests enzyme units.", "Toma una foto de tu comida o elige una de la galería. La app estima la grasa y sugiere unidades enzimáticas.", "Prenez une photo du repas ou choisissez-en une dans la galerie. L’app estime la graisse et suggère des unités enzymatiques.", "Mache ein Foto deiner Mahlzeit oder wähle eines aus der Galerie. Die App schätzt Fett und schlägt Enzymeinheiten vor.", "Scatta una foto del pasto o scegline una dalla galleria. L’app stima i grassi e suggerisce unità enzimatiche."],
    ["Atalhos", "Shortcuts", "Atajos", "Raccourcis", "Kurzwege", "Scorciatoie"],
    ["Favoritas", "Favorites", "Favoritas", "Favoris", "Favoriten", "Preferite"],
    ["Tutorial", "Tutorial", "Tutorial", "Tutoriel", "Tutorial", "Tutorial"],
    ["Relatório", "Report", "Informe", "Rapport", "Bericht", "Report"],
    ["Adicionar refeição", "Add meal", "Agregar comida", "Ajouter un repas", "Mahlzeit hinzufügen", "Aggiungi pasto"],
    ["Tirar foto", "Take photo", "Tomar foto", "Prendre une photo", "Foto aufnehmen", "Scatta foto"],
    ["Escolher da galeria", "Choose from gallery", "Elegir de la galería", "Choisir dans la galerie", "Aus Galerie wählen", "Scegli dalla galleria"],
    ["Cancelar", "Cancel", "Cancelar", "Annuler", "Abbrechen", "Annulla"],
    ["Câmera", "Camera", "Cámara", "Caméra", "Kamera", "Fotocamera"],
    ["Posicione a refeição no quadro.", "Position the meal inside the frame.", "Coloca la comida dentro del encuadre.", "Placez le repas dans le cadre.", "Positioniere die Mahlzeit im Rahmen.", "Posiziona il pasto nell’inquadratura."],
    ["Abrindo câmera...", "Opening camera...", "Abriendo cámara...", "Ouverture de la caméra...", "Kamera wird geöffnet...", "Apertura fotocamera..."],
    ["Centralize o prato no guia.", "Center the plate in the guide.", "Centra el plato en la guía.", "Centrez l’assiette dans le guide.", "Zentriere den Teller in der Führung.", "Centra il piatto nella guida."],
    ["Prato centralizado.", "Plate centered.", "Plato centrado.", "Assiette centrée.", "Teller zentriert.", "Piatto centrato."],
    ["Capturando foto...", "Capturing photo...", "Capturando foto...", "Capture de la photo...", "Foto wird aufgenommen...", "Acquisizione foto..."],
    ["Não foi possível acessar a câmera. Use a galeria.", "Could not access the camera. Use the gallery.", "No fue posible acceder a la cámara. Usa la galería.", "Impossible d’accéder à la caméra. Utilisez la galerie.", "Kamera konnte nicht geöffnet werden. Nutze die Galerie.", "Impossibile accedere alla fotocamera. Usa la galleria."],
    ["Analisando refeição...", "Analyzing meal...", "Analizando comida...", "Analyse du repas...", "Mahlzeit wird analysiert...", "Analisi del pasto..."],
    ["Detectando alimentos...", "Detecting foods...", "Detectando alimentos...", "Détection des aliments...", "Lebensmittel werden erkannt...", "Rilevamento alimenti..."],
    ["Estimando porções...", "Estimating portions...", "Estimando porciones...", "Estimation des portions...", "Portionen werden geschätzt...", "Stima porzioni..."],
    ["Consultando banco nutricional...", "Checking nutrition database...", "Consultando banco nutricional...", "Consultation de la base nutritionnelle...", "Nährwertdatenbank wird geprüft...", "Consultazione banca nutrizionale..."],
    ["Calculando composição nutricional...", "Calculating nutritional composition...", "Calculando composición nutricional...", "Calcul de la composition nutritionnelle...", "Nährwerte werden berechnet...", "Calcolo composizione nutrizionale..."],
    ["Confirmar análise", "Confirm analysis", "Confirmar análisis", "Confirmer l’analyse", "Analyse bestätigen", "Conferma analisi"],
    ["Alimentos detectados", "Detected foods", "Alimentos detectados", "Aliments détectés", "Erkannte Lebensmittel", "Alimenti rilevati"],
    ["Revise os alimentos antes de calcular.", "Review foods before calculating.", "Revisa los alimentos antes de calcular.", "Vérifiez les aliments avant de calculer.", "Prüfe die Lebensmittel vor der Berechnung.", "Controlla gli alimenti prima del calcolo."],
    ["A precisão pode ser reduzida devido às condições da foto.", "Accuracy may be reduced because of photo conditions.", "La precisión puede reducirse por las condiciones de la foto.", "La précision peut être réduite à cause des conditions de la photo.", "Die Genauigkeit kann durch die Fotobedingungen sinken.", "La precisione può ridursi per le condizioni della foto."],
    ["Confiança alta para uma simulação realista.", "Good visual confidence. Review foods before calculation.", "Alta confianza para una simulación realista.", "Confiance élevée pour une simulation réaliste.", "Hohe Zuverlässigkeit für eine realistische Simulation.", "Alta affidabilità per una simulazione realistica."],
    ["Esta análise possui baixa confiança. Recomendamos fotografar novamente.", "This analysis has low confidence. We recommend taking another photo.", "Este análisis tiene baja confianza. Recomendamos fotografiar de nuevo.", "Cette analyse a une faible confiance. Nous recommandons de reprendre la photo.", "Diese Analyse hat geringe Zuverlässigkeit. Wir empfehlen ein neues Foto.", "Questa analisi ha bassa affidabilità. Consigliamo di rifare la foto."],
    ["Revise a foto", "Review the photo", "Revisa la foto", "Vérifiez la photo", "Foto prüfen", "Controlla la foto"],
    ["Confira os alimentos antes de calcular.", "Check the foods before calculating.", "Revisa los alimentos antes de calcular.", "Vérifiez les aliments avant de calculer.", "Prüfe die Lebensmittel vor der Berechnung.", "Controlla gli alimenti prima del calcolo."],
    ["Qualidade da foto", "Photo quality", "Calidad de la foto", "Qualité de la photo", "Fotoqualität", "Qualità della foto"],
    ["Imagem tremida", "Blurry image", "Imagen movida", "Image floue", "Verwackeltes Bild", "Immagine mossa"],
    ["Foto boa", "Good photo", "Foto buena", "Bonne photo", "Gutes Foto", "Foto buona"],
    ["Foto excelente", "Excellent photo", "Foto excelente", "Excellente photo", "Ausgezeichnetes Foto", "Foto eccellente"],
    ["Embalagem detectada", "Package detected", "Envase detectado", "Emballage détecté", "Verpackung erkannt", "Confezione rilevata"],
    ["Alimento não identificado", "Unidentified food", "Alimento no identificado", "Aliment non identifié", "Nicht erkanntes Lebensmittel", "Alimento non identificato"],
    ["O módulo de análise encontrou um item sem identificação confiável.", "The analysis module found an item without reliable identification.", "El módulo de análisis encontró un elemento sin identificación confiable.", "Le module d’analyse a trouvé un élément sans identification fiable.", "Das Analysemodul fand ein Element ohne verlässliche Erkennung.", "Il modulo di analisi ha trovato un elemento senza identificazione affidabile."],
    ["Confirmar", "Confirm", "Confirmar", "Confirmer", "Bestätigen", "Conferma"],
    ["Identificação confirmada", "Identification confirmed", "Identificación confirmada", "Identification confirmée", "Identifizierung bestätigt", "Identificazione confermata"],
    ["Confirmado", "Confirmed", "Confirmado", "Confirmé", "Bestätigt", "Confermato"],
    ["Sem dados nutricionais no banco — não incluído no cálculo.", "No nutrition data in the database — not included in the calculation.", "Sin datos nutricionales en la base — no se incluyó en el cálculo.", "Aucune donnée nutritionnelle dans la base — non inclus dans le calcul.", "Keine Nährwertdaten in der Datenbank — nicht in die Berechnung einbezogen.", "Nessun dato nutrizionale nel database — non incluso nel calcolo."],
    ["Cálculo parcial", "Partial calculation", "Cálculo parcial", "Calcul partiel", "Teilberechnung", "Calcolo parziale"],
    ["Alimentos confirmados sem dados nutricionais no banco não foram incluídos no cálculo.", "Confirmed foods without nutrition data in the database were not included in the calculation.", "Los alimentos confirmados sin datos nutricionales en la base no se incluyeron en el cálculo.", "Les aliments confirmés sans données nutritionnelles dans la base n’ont pas été inclus dans le calcul.", "Bestätigte Lebensmittel ohne Nährwertdaten in der Datenbank wurden nicht in die Berechnung einbezogen.", "Gli alimenti confermati senza dati nutrizionali nel database non sono stati inclusi nel calcolo."],
    ["Substituir", "Replace", "Sustituir", "Remplacer", "Ersetzen", "Sostituisci"],
    ["Adicionar alimento", "Add food", "Agregar alimento", "Ajouter un aliment", "Lebensmittel hinzufügen", "Aggiungi alimento"],
    ["Reanalisar foto", "Analyze again", "Analizar de nuevo", "Analyser à nouveau", "Erneut analysieren", "Analizza di nuovo"],
    ["Resultado", "Result", "Resultado", "Résultat", "Ergebnis", "Risultato"],
    ["Refeição analisada", "Analyzed meal", "Comida analizada", "Repas analysé", "Analysierte Mahlzeit", "Pasto analizzato"],
    ["Resumo", "Summary", "Resumen", "Résumé", "Zusammenfassung", "Riepilogo"],
    ["Gordura", "Fat", "Grasa", "Graisse", "Fett", "Grassi"],
    ["Proteína", "Protein", "Proteína", "Protéine", "Protein", "Proteine"],
    ["Carboidratos", "Carbs", "Carbohidratos", "Glucides", "Kohlenhydrate", "Carboidrati"],
    ["Carboidrato", "Carb", "Carbohidrato", "Glucide", "Kohlenhydrat", "Carboidrato"],
    ["Calorias", "Calories", "Calorías", "Calories", "Kalorien", "Calorie"],
    ["Lipase", "Lipase", "Lipasa", "Lipase", "Lipase", "Lipasi"],
    ["Cápsulas", "Capsules", "Cápsulas", "Gélules", "Kapseln", "Capsule"],
    ["Dose estimada", "Estimated dose", "Dosis estimada", "Dose estimée", "Geschätzte Dosis", "Dose stimata"],
    ["Medicamento cadastrado", "Registered medication", "Medicamento registrado", "Médicament enregistré", "Gespeichertes Medikament", "Farmaco registrato"],
    ["Estimativa baseada no seu perfil.", "Estimate based on your profile.", "Estimación basada en tu perfil.", "Estimation basée sur votre profil.", "Schätzung basierend auf deinem Profil.", "Stima basata sul tuo profilo."],
    ["Ver cálculo completo", "View full calculation", "Ver cálculo completo", "Voir le calcul complet", "Vollständige Berechnung anzeigen", "Vedi calcolo completo"],
    ["Salvar refeição favorita", "Save favorite meal", "Guardar comida favorita", "Enregistrer le repas favori", "Lieblingsmahlzeit speichern", "Salva pasto preferito"],
    ["Ajustar dose", "Adjust dose", "Ajustar dosis", "Ajuster la dose", "Dosis anpassen", "Regola dose"],
    ["Concluir", "Finish", "Finalizar", "Terminer", "Fertig", "Fine"],
    ["Histórico atualizado", "History updated", "Historial actualizado", "Historique mis à jour", "Verlauf aktualisiert", "Cronologia aggiornata"],
    ["Refeição salva nos favoritos", "Meal saved to favorites", "Comida guardada en favoritos", "Repas enregistré dans les favoris", "Mahlzeit in Favoriten gespeichert", "Pasto salvato nei preferiti"],
    ["Refeição salva", "Meal saved", "Comida guardada", "Repas enregistré", "Mahlzeit gespeichert", "Pasto salvato"],
    ["Pesquisar alimento", "Search food", "Buscar alimento", "Rechercher un aliment", "Lebensmittel suchen", "Cerca alimento"],
    ["Histórico", "History", "Historial", "Historique", "Verlauf", "Cronologia"],
    ["Suas refeições anteriores", "Your previous meals", "Tus comidas anteriores", "Vos repas précédents", "Deine früheren Mahlzeiten", "I tuoi pasti precedenti"],
    ["Nenhuma refeição analisada", "No analyzed meals yet", "Ninguna comida analizada", "Aucun repas analysé", "Noch keine Mahlzeit analysiert", "Nessun pasto analizzato"],
    ["Quando você analisar sua primeira refeição, ela aparecerá aqui", "When you analyze your first meal, it will appear here", "Cuando analices tu primera comida, aparecerá aquí", "Lorsque vous analyserez votre premier repas, il apparaîtra ici", "Wenn du deine erste Mahlzeit analysierst, erscheint sie hier", "Quando analizzi il primo pasto, apparirà qui"],
    ["Analisar primeira refeição", "Analyze first meal", "Analizar primera comida", "Analyser le premier repas", "Erste Mahlzeit analysieren", "Analizza primo pasto"],
    ["Detalhes", "Details", "Detalles", "Détails", "Details", "Dettagli"],
    ["Alimentos e quantidades", "Foods and quantities", "Alimentos y cantidades", "Aliments et quantités", "Lebensmittel und Mengen", "Alimenti e quantità"],
    ["Resumo nutricional", "Nutrition summary", "Resumen nutricional", "Résumé nutritionnel", "Nährwertübersicht", "Riepilogo nutrizionale"],
    ["Análise por IA","AI analysis","Análisis por IA","Analyse par IA","KI-Analyse","Analisi IA"],
    ["Confiança", "Confidence", "Confianza", "Confiance", "Zuverlässigkeit", "Affidabilità"],
    ["Qualidade", "Quality", "Calidad", "Qualité", "Qualität", "Qualità"],
    ["Reanálises", "Reanalyses", "Reanálisis", "Réanalyses", "Neue Analysen", "Rianalisi"],
    ["Alterações realizadas", "Changes made", "Cambios realizados", "Modifications effectuées", "Vorgenommene Änderungen", "Modifiche effettuate"],
    ["Nenhuma alteração manual registrada.", "No manual change recorded.", "Ningún cambio manual registrado.", "Aucune modification manuelle enregistrée.", "Keine manuelle Änderung gespeichert.", "Nessuna modifica manuale registrata."],
    ["Encontramos um resultado incomum. Revise os alimentos antes de utilizar este cálculo.", "We found an unusual result. Review the foods before using this calculation.", "Encontramos un resultado inusual. Revisa los alimentos antes de usar este cálculo.", "Nous avons trouvé un résultat inhabituel. Vérifiez les aliments avant d’utiliser ce calcul.", "Wir haben ein ungewöhnliches Ergebnis gefunden. Prüfe die Lebensmittel, bevor du diese Berechnung nutzt.", "Abbiamo trovato un risultato insolito. Controlla gli alimenti prima di usare questo calcolo."],
    ["Perfil", "Profile", "Perfil", "Profil", "Profil", "Profilo"],
    ["Configurações e preferências", "Settings and preferences", "Ajustes y preferencias", "Réglages et préférences", "Einstellungen und Präferenzen", "Impostazioni e preferenze"],
    ["Preferências", "Preferences", "Preferencias", "Préférences", "Präferenzen", "Preferenze"],
    ["Notificações", "Notifications", "Notificaciones", "Notifications", "Benachrichtigungen", "Notifiche"],
    ["Segurança", "Safety", "Seguridad", "Sécurité", "Sicherheit", "Sicurezza"],
    ["Sobre", "About", "Acerca de", "À propos", "Über", "Info"],
    ["Configuração inicial", "Initial setup", "Configuración inicial", "Configuration initiale", "Ersteinrichtung", "Configurazione iniziale"],
    ["Unidade de medida", "Measurement unit", "Unidad de medida", "Unité de mesure", "Maßeinheit", "Unità di misura"],
    ["Modo infantil", "Child mode", "Modo infantil", "Mode enfant", "Kindermodus", "Modalità bambino"],
    ["Lembretes de refeições", "Meal reminders", "Recordatorios de comidas", "Rappels de repas", "Mahlzeit-Erinnerungen", "Promemoria pasti"],
    ["Avisos médicos", "Medical warnings", "Avisos médicos", "Avertissements médicaux", "Medizinische Hinweise", "Avvisi medici"],
    ["Refeições favoritas", "Favorite meals", "Comidas favoritas", "Repas favoris", "Lieblingsmahlzeiten", "Pasti preferiti"],
    ["Tutorial de fotos", "Photo tutorial", "Tutorial de fotos", "Tutoriel photo", "Foto-Tutorial", "Tutorial foto"],
    ["Relatório médico", "Medical report", "Informe médico", "Rapport médical", "Medizinischer Bericht", "Report medico"],
    ["Sobre e funcionamento", "About and how it works", "Acerca de y funcionamiento", "À propos et fonctionnement", "Über und Funktionsweise", "Info e funzionamento"],
    ["Idioma", "Language", "Idioma", "Langue", "Sprache", "Lingua"],
    ["Termos de uso", "Terms of use", "Términos de uso", "Conditions d’utilisation", "Nutzungsbedingungen", "Termini d’uso"],
    ["Privacidade", "Privacy", "Privacidad", "Confidentialité", "Datenschutz", "Privacy"],
    ["Meu Tratamento", "My Treatment", "Mi tratamiento", "Mon traitement", "Meine Behandlung", "Il mio trattamento"],
    ["País ou região do tratamento", "Treatment country or region", "País o región del tratamiento", "Pays ou région du traitement", "Land oder Region der Behandlung", "Paese o regione del trattamento"],
    ["Peso do paciente", "Patient weight", "Peso del paciente", "Poids du patient", "Patientengewicht", "Peso del paziente"],
    ["Dose prescrita", "Prescribed dose", "Dosis prescrita", "Dose prescrite", "Verordnete Dosis", "Dose prescritta"],
    ["Medicamento enzimático prescrito", "Prescribed enzyme medication", "Medicamento enzimático prescrito", "Médicament enzymatique prescrit", "Verordnetes Enzymmedikament", "Farmaco enzimatico prescritto"],
    ["Meu medicamento não está na lista", "My medication is not listed", "Mi medicamento no está en la lista", "Mon médicament n’est pas dans la liste", "Mein Medikament ist nicht in der Liste", "Il mio farmaco non è nell’elenco"],
    ["Forma do medicamento", "Medication form", "Forma del medicamento", "Forme du médicament", "Form des Medikaments", "Forma del farmaco"],
    ["Nome da unidade", "Unit name", "Nombre de la unidad", "Nom de l’unité", "Name der Einheit", "Nome dell’unità"],
    ["Observação da prescrição", "Prescription note", "Nota de la receta", "Note de prescription", "Hinweis zur Verordnung", "Nota della prescrizione"],
    ["Salvar tratamento", "Save treatment", "Guardar tratamiento", "Enregistrer le traitement", "Behandlung speichern", "Salva trattamento"],
    ["Mostrar mais", "Show more", "Mostrar más", "Afficher plus", "Mehr anzeigen", "Mostra altro"],
    ["Ver mais", "See more", "Ver más", "Voir plus", "Mehr anzeigen", "Mostra altro"],
    ["Fotografe o prato de cima", "Photograph the plate from above", "Fotografía el plato desde arriba", "Photographiez l’assiette du dessus", "Fotografiere den Teller von oben", "Fotografa il piatto dall’alto"],
    ["Mantenha o celular acima da refeição para facilitar a identificação.", "Keep the phone above the meal to make identification easier.", "Mantén el celular sobre la comida para facilitar la identificación.", "Gardez le téléphone au-dessus du repas pour faciliter l’identification.", "Halte das Handy über die Mahlzeit, damit sie leichter erkannt wird.", "Tieni il telefono sopra il pasto per facilitare l’identificazione."],
    ["Enquadre toda a refeição", "Frame the whole meal", "Encuadra toda la comida", "Cadrez tout le repas", "Rahme die ganze Mahlzeit ein", "Inquadra tutto il pasto"],
    ["Todos os alimentos precisam aparecer completamente.", "All foods need to appear completely.", "Todos los alimentos deben aparecer completos.", "Tous les aliments doivent apparaître entièrement.", "Alle Lebensmittel müssen vollständig sichtbar sein.", "Tutti gli alimenti devono comparire per intero."],
    ["Utilize boa iluminação", "Use good lighting", "Usa buena iluminación", "Utilisez une bonne lumière", "Nutze gutes Licht", "Usa una buona illuminazione"],
    ["Ambientes claros ajudam na identificação dos alimentos.", "Bright environments help identify foods.", "Los ambientes claros ayudan a identificar los alimentos.", "Les environnements clairs aident à identifier les aliments.", "Helle Umgebungen helfen bei der Erkennung.", "Gli ambienti luminosi aiutano a identificare gli alimenti."],
    ["Evite mover o celular", "Avoid moving the phone", "Evita mover el celular", "Évitez de bouger le téléphone", "Bewege das Handy nicht", "Evita di muovere il telefono"],
    ["Espere alguns segundos antes de fotografar.", "Wait a few seconds before taking the photo.", "Espera unos segundos antes de fotografiar.", "Attendez quelques secondes avant de prendre la photo.", "Warte ein paar Sekunden vor dem Foto.", "Aspetta alcuni secondi prima di fotografare."],
    ["Retire embalagens e objetos", "Remove packages and objects", "Retira envases y objetos", "Retirez emballages et objets", "Entferne Verpackungen und Gegenstände", "Rimuovi confezioni e oggetti"],
    ["Deixe apenas os alimentos visíveis.", "Leave only the foods visible.", "Deja visibles solo los alimentos.", "Ne laissez visibles que les aliments.", "Lasse nur die Lebensmittel sichtbar.", "Lascia visibili solo gli alimenti."],
    ["Revise antes de calcular", "Review before calculating", "Revisa antes de calcular", "Vérifiez avant de calculer", "Vor dem Berechnen prüfen", "Controlla prima di calcolare"],
    ["Sempre confirme os alimentos encontrados antes do cálculo.", "Always confirm the detected foods before the calculation.", "Siempre confirma los alimentos encontrados antes del cálculo.", "Confirmez toujours les aliments détectés avant le calcul.", "Bestätige immer die erkannten Lebensmittel vor der Berechnung.", "Conferma sempre gli alimenti rilevati prima del calcolo."],
    ["Voltar para a home", "Back to home", "Volver al inicio", "Retour à l’accueil", "Zurück zur Startseite", "Torna alla home"],
    ["Voltar para o perfil", "Back to profile", "Volver al perfil", "Retour au profil", "Zurück zum Profil", "Torna al profilo"],
    ["Próximo", "Next", "Siguiente", "Suivant", "Weiter", "Avanti"],
    ["Começar", "Start", "Comenzar", "Commencer", "Starten", "Inizia"],
    ["Voltar", "Back", "Volver", "Retour", "Zurück", "Indietro"],
    ["Horários cadastrados", "Saved times", "Horarios guardados", "Horaires enregistrés", "Gespeicherte Uhrzeiten", "Orari salvati"],
    ["Limite atingido", "Limit reached", "Límite alcanzado", "Limite atteinte", "Limit erreicht", "Limite raggiunto"],
    ["Limite de horários atingido", "Time limit reached", "Límite de horarios alcanzado", "Limite d’horaires atteinte", "Zeitlimit erreicht", "Limite di orari raggiunto"],
    ["Adicionar horário", "Add time", "Agregar horario", "Ajouter un horaire", "Uhrzeit hinzufügen", "Aggiungi orario"],
    ["Café da manhã", "Breakfast", "Desayuno", "Petit-déjeuner", "Frühstück", "Colazione"],
    ["Almoço", "Lunch", "Almuerzo", "Déjeuner", "Mittagessen", "Pranzo"],
    ["Jantar", "Dinner", "Cena", "Dîner", "Abendessen", "Cena"],
    ["Novo horário", "New time", "Nuevo horario", "Nouvel horaire", "Neue Uhrzeit", "Nuovo orario"],
    ["Nome", "Name", "Nombre", "Nom", "Name", "Nome"],
    ["Horário", "Time", "Hora", "Heure", "Uhrzeit", "Orario"],
    ["Nome do lembrete", "Reminder name", "Nombre del recordatorio", "Nom du rappel", "Name der Erinnerung", "Nome promemoria"],
    ["Horário do lembrete", "Reminder time", "Hora del recordatorio", "Heure du rappel", "Uhrzeit der Erinnerung", "Orario promemoria"],
    ["Nenhuma refeição favorita", "No favorite meal yet", "Ninguna comida favorita", "Aucun repas favori", "Noch keine Lieblingsmahlzeit", "Nessun pasto preferito"],
    ["Salve uma refeição após o cálculo para vê-la aqui.", "Save a meal after calculation to see it here.", "Guarda una comida después del cálculo para verla aquí.", "Enregistrez un repas après le calcul pour le voir ici.", "Speichere eine Mahlzeit nach der Berechnung, um sie hier zu sehen.", "Salva un pasto dopo il calcolo per vederlo qui."],
    ["Escolha como deseja visualizar as quantidades de alimentos", "Choose how you want to view food quantities", "Elige cómo deseas ver las cantidades de alimentos", "Choisissez comment afficher les quantités d’aliments", "Wähle, wie du Lebensmittelmengen sehen möchtest", "Scegli come visualizzare le quantità degli alimenti"],
    ["Gramas (g)", "Grams (g)", "Gramos (g)", "Grammes (g)", "Gramm (g)", "Grammi (g)"],
    ["Peso em gramas", "Weight in grams", "Peso en gramos", "Poids en grammes", "Gewicht in Gramm", "Peso in grammi"],
    ["Colheres", "Spoons", "Cucharas", "Cuillères", "Löffel", "Cucchiai"],
    ["Colheres de sopa", "Tablespoons", "Cucharadas", "Cuillères à soupe", "Esslöffel", "Cucchiai da tavola"],
    ["Porções", "Servings", "Porciones", "Portions", "Portionen", "Porzioni"],
    ["Porções estimadas", "Estimated servings", "Porciones estimadas", "Portions estimées", "Geschätzte Portionen", "Porzioni stimate"],
    ["Resumo da refeição", "Meal summary", "Resumen de la comida", "Résumé du repas", "Mahlzeitübersicht", "Riepilogo pasto"],
    ["Refeição sugerida", "Suggested meal", "Comida sugerida", "Repas suggéré", "Vorgeschlagene Mahlzeit", "Pasto suggerito"],
    ["Gordura estimada", "Estimated fat", "Grasa estimada", "Graisse estimée", "Geschätztes Fett", "Grassi stimati"],
    ["Sugestão do cálculo", "Calculation suggestion", "Sugerencia del cálculo", "Suggestion du calcul", "Berechnungsvorschlag", "Suggerimento del calcolo"],
    ["Ajuste da dose", "Dose adjustment", "Ajuste de la dosis", "Ajustement de la dose", "Dosisanpassung", "Regolazione dose"],
    ["Diminuir dose", "Decrease dose", "Disminuir dosis", "Diminuer la dose", "Dosis verringern", "Diminuisci dose"],
    ["Aumentar dose", "Increase dose", "Aumentar dosis", "Augmenter la dose", "Dosis erhöhen", "Aumenta dose"],
    ["Dose igual à sugestão", "Dose matches the suggestion", "La dosis coincide con la sugerencia", "La dose correspond à la suggestion", "Dosis entspricht dem Vorschlag", "La dose corrisponde al suggerimento"],
    ["Enzima", "Enzyme", "Enzima", "Enzyme", "Enzym", "Enzima"],
    ["Dose total", "Total dose", "Dosis total", "Dose totale", "Gesamtdosis", "Dose totale"],
    ["Confirmar dose", "Confirm dose", "Confirmar dosis", "Confirmer la dose", "Dosis bestätigen", "Conferma dose"],
    ["Consulte seu médico antes de alterar sua dose", "Ask your doctor before changing your dose", "Consulta a tu médico antes de cambiar tu dosis", "Consultez votre médecin avant de modifier votre dose", "Frage deinen Arzt, bevor du die Dosis änderst", "Consulta il medico prima di cambiare dose"],
    ["Gerar PDF", "Generate PDF", "Generar PDF", "Générer le PDF", "PDF erstellen", "Genera PDF"],
    ["Resumo objetivo para consulta: dados cadastrados, configuração de dose e ajustes manuais feitos no app.", "Objective summary for appointments: registered data, dose settings, and manual dose changes made in the app.", "Resumen objetivo para consulta: datos registrados, configuración de dosis y ajustes manuales hechos en la app.", "Résumé objectif pour consultation : données enregistrées, réglage de dose et ajustements manuels faits dans l’app.", "Sachliche Übersicht für Termine: gespeicherte Daten, Dosiseinstellung und manuelle Anpassungen aus der App.", "Riepilogo obiettivo per la visita: dati registrati, impostazioni dose e modifiche manuali fatte nell’app."],
    ["Seus dados", "Your data", "Tus datos", "Vos données", "Deine Daten", "I tuoi dati"],
    ["Peso cadastrado", "Registered weight", "Peso registrado", "Poids enregistré", "Gespeichertes Gewicht", "Peso registrato"],
    ["País/região", "Country/region", "País/región", "Pays/région", "Land/Region", "Paese/regione"],
    ["Medicamento", "Medication", "Medicamento", "Médicament", "Medikament", "Farmaco"],
    ["Potência", "Strength", "Potencia", "Dosage", "Stärke", "Potenza"],
    ["Não informado", "Not informed", "No informado", "Non renseigné", "Nicht angegeben", "Non indicato"],
    ["Não informada", "Not informed", "No informada", "Non renseignée", "Nicht angegeben", "Non indicata"],
    ["Configuração de cálculo", "Calculation settings", "Configuración de cálculo", "Configuration du calcul", "Berechnungseinstellungen", "Impostazioni di calcolo"],
    ["Base do cálculo", "Calculation basis", "Base del cálculo", "Base du calcul", "Berechnungsgrundlage", "Base del calcolo"],
    ["Gordura estimada x dose prescrita", "Estimated fat x prescribed dose", "Grasa estimada x dosis prescrita", "Graisse estimée x dose prescrite", "Geschätztes Fett x verordnete Dosis", "Grassi stimati x dose prescritta"],
    ["Divisor", "Divider", "Divisor", "Diviseur", "Teiler", "Divisore"],
    ["Unidades de lipase por unidade do medicamento", "Lipase units per medication unit", "Unidades de lipasa por unidad del medicamento", "Unités de lipase par unité de médicament", "Lipase-Einheiten pro Medikamenteneinheit", "Unità di lipasi per unità del farmaco"],
    ["Arredondamento", "Rounding", "Redondeo", "Arrondi", "Rundung", "Arrotondamento"],
    ["Conversão para unidades inteiras", "Conversion to whole units", "Conversión a unidades enteras", "Conversion en unités entières", "Umrechnung in ganze Einheiten", "Conversione in unità intere"],
    ["Ativados", "On", "Activados", "Activés", "Aktiviert", "Attivi"],
    ["Desativados", "Off", "Desactivados", "Désactivés", "Deaktiviert", "Disattivi"],
    ["Cálculos confirmados", "Confirmed calculations", "Cálculos confirmados", "Calculs confirmés", "Bestätigte Berechnungen", "Calcoli confermati"],
    ["Nenhum ainda", "None yet", "Ninguno todavía", "Aucun pour l’instant", "Noch keine", "Nessuno ancora"],
    ["Mudanças na dose", "Dose changes", "Cambios en la dosis", "Changements de dose", "Dosisänderungen", "Modifiche della dose"],
    ["Ajustes manuais", "Manual adjustments", "Ajustes manuales", "Ajustements manuels", "Manuelle Anpassungen", "Modifiche manuali"],
    ["Nenhum ajuste manual", "No manual adjustment", "Ningún ajuste manual", "Aucun ajustement manuel", "Keine manuelle Anpassung", "Nessuna modifica manuale"],
    ["Dose sugerida média", "Average suggested dose", "Dosis sugerida media", "Dose suggérée moyenne", "Durchschnittlich vorgeschlagene Dosis", "Dose suggerita media"],
    ["Dose usada média", "Average used dose", "Dosis usada media", "Dose utilisée moyenne", "Durchschnittlich verwendete Dosis", "Dose usata media"],
    ["Última dose usada", "Last used dose", "Última dosis usada", "Dernière dose utilisée", "Zuletzt verwendete Dosis", "Ultima dose usata"],
    ["Último cálculo", "Last calculation", "Último cálculo", "Dernier calcul", "Letzte Berechnung", "Ultimo calcolo"],
    ["Observações", "Notes", "Observaciones", "Observations", "Hinweise", "Osservazioni"],
    ["Reanálises feitas", "Reanalyses made", "Reanálisis realizados", "Réanalyses effectuées", "Erneute Analysen", "Rianalisi effettuate"],
    ["Nenhuma", "None", "Ninguna", "Aucune", "Keine", "Nessuna"],
    ["Correções manuais", "Manual corrections", "Correcciones manuales", "Corrections manuelles", "Manuelle Korrekturen", "Correzioni manuali"],
    ["Sem registro", "No record", "Sin registro", "Aucun registre", "Kein Eintrag", "Nessun registro"],
    ["Sem cálculos confirmados", "No confirmed calculations", "Sin cálculos confirmados", "Aucun calcul confirmé", "Keine bestätigten Berechnungen", "Nessun calcolo confermato"],
    ["Este relatório organiza informações cadastradas no app para facilitar a conversa com profissionais de saúde. Ele não substitui orientação médica.", "This report organizes information registered in the app to make conversations with health professionals easier. It does not replace medical guidance.", "Este informe organiza información registrada en la app para facilitar la conversación con profesionales de salud. No reemplaza la orientación médica.", "Ce rapport organise les informations enregistrées dans l’app pour faciliter l’échange avec les professionnels de santé. Il ne remplace pas un avis médical.", "Dieser Bericht ordnet App-Daten, damit Gespräche mit medizinischem Fachpersonal leichter werden. Er ersetzt keine ärztliche Beratung.", "Questo report organizza le informazioni registrate nell’app per facilitare il dialogo con professionisti sanitari. Non sostituisce il parere medico."],
    ["Importante", "Important", "Importante", "Important", "Wichtig", "Importante"],
    ["Esta tela resume como o PancreAI funciona, as responsabilidades da IA e dos cálculos locais e os cuidados necessários antes de usar um resultado.","This screen summarizes how PancreAI works, the responsibilities of AI and local calculations, and the care required before using a result.","Esta pantalla resume cómo funciona PancreAI, las responsabilidades de la IA y los cálculos locales, y los cuidados necesarios antes de usar un resultado.","Cet écran résume le fonctionnement de PancreAI, les rôles de l’IA et des calculs locaux, ainsi que les précautions avant d’utiliser un résultat.","Dieser Bildschirm fasst die Funktionsweise von PancreAI, die Aufgaben von KI und lokalen Berechnungen sowie die nötige Prüfung zusammen.","Questa schermata riassume il funzionamento di PancreAI, i ruoli dell’IA e dei calcoli locali e le verifiche necessarie prima del risultato."],
    ["Bastidor técnico", "Technical background", "Detalle técnico", "Détail technique", "Technischer Hintergrund", "Dettaglio tecnico"],
    ["Como esta versão funciona hoje", "How this version works today", "Cómo funciona esta versión hoy", "Fonctionnement actuel de cette version", "Wie diese Version heute funktioniert", "Come funziona oggi questa versione"],
    ["O PancreAI envia a foto da refeição por um backend seguro ao Gemini Flash para análise visual real.","PancreAI sends the meal photo through a secure backend to Gemini Flash for real visual analysis.","PancreAI envía la foto de la comida mediante un backend seguro a Gemini Flash para un análisis visual real.","PancreAI envoie la photo du repas via un backend sécurisé à Gemini Flash pour une analyse visuelle réelle.","PancreAI sendet das Mahlzeitenfoto über ein sicheres Backend an Gemini Flash zur echten Bildanalyse.","PancreAI invia la foto del pasto tramite un backend sicuro a Gemini Flash per una vera analisi visiva."],
    ["Depois dessa etapa, o app segue um fluxo funcional: o usuário revisa os alimentos, confirma ingredientes e o cálculo é feito com base nos dados cadastrados.", "After that step, the app follows a functional flow: the user reviews foods, confirms ingredients, and the calculation uses the registered data.", "Después de esa etapa, la app sigue un flujo funcional: el usuario revisa los alimentos, confirma ingredientes y el cálculo se hace con los datos registrados.", "Après cette étape, l’app suit un flux fonctionnel : l’utilisateur vérifie les aliments, confirme les ingrédients et le calcul utilise les données enregistrées.", "Danach folgt die App einem funktionalen Ablauf: Lebensmittel prüfen, Zutaten bestätigen, Berechnung mit gespeicherten Daten.", "Dopo questa fase, l’app segue un flusso funzionale: l’utente controlla gli alimenti, conferma gli ingredienti e il calcolo usa i dati registrati."],
    ["Revise com atenção", "Review carefully", "Revisa con atención", "Vérifiez attentivement", "Sorgfältig prüfen", "Controlla con attenzione"],
    ["Foto pode influenciar a estimativa", "The photo may affect the estimate", "La foto puede influir en la estimación", "La photo peut influencer l’estimation", "Das Foto kann die Schätzung beeinflussen", "La foto può influenzare la stima"],
    ["Ingredientes ocultos podem mudar o resultado", "Hidden ingredients may change the result", "Los ingredientes ocultos pueden cambiar el resultado", "Les ingrédients cachés peuvent changer le résultat", "Versteckte Zutaten können das Ergebnis ändern", "Ingredienti nascosti possono cambiare il risultato"],
    ["Estimativa alterada manualmente", "Estimate changed manually", "Estimación modificada manualmente", "Estimation modifiée manuellement", "Schätzung manuell geändert", "Stima modificata manualmente"],
    ["Este resultado é uma estimativa", "This result is an estimate", "Este resultado es una estimación", "Ce résultat est une estimation", "Dieses Ergebnis ist eine Schätzung", "Questo risultato è una stima"],
    ["Peso não informado", "Weight not informed", "Peso no informado", "Poids non renseigné", "Gewicht nicht angegeben", "Peso non indicato"],
    ["Dose prescrita ausente", "Prescribed dose missing", "Falta la dosis prescrita", "Dose prescrite absente", "Verordnete Dosis fehlt", "Dose prescritta assente"],
    ["Medicamento não selecionado", "Medication not selected", "Medicamento no seleccionado", "Médicament non sélectionné", "Medikament nicht ausgewählt", "Farmaco non selezionato"],
    ["Potência ausente", "Strength missing", "Falta la potencia", "Dosage absent", "Stärke fehlt", "Potenza assente"],
    ["Estimativa muito alta", "Very high estimate", "Estimación muy alta", "Estimation très élevée", "Sehr hohe Schätzung", "Stima molto alta"],
    ["Revisar dose", "Review dose", "Revisar dosis", "Vérifier la dose", "Dosis prüfen", "Rivedi dose"],
    ["Revisar dia", "Review the day", "Revisar el día", "Vérifier la journée", "Tag prüfen", "Rivedi giornata"],
    ["Revisar gordura", "Review fat", "Revisar grasa", "Vérifier la graisse", "Fett prüfen", "Rivedi grassi"],
    ["Medicamento personalizado", "Custom medication", "Medicamento personalizado", "Médicament personnalisé", "Benutzerdefiniertes Medikament", "Farmaco personalizzato"],
    ["Potência a confirmar", "Strength to confirm", "Potencia por confirmar", "Dosage à confirmer", "Stärke zu bestätigen", "Potenza da confermare"],
    ["Arredondamento alto", "High rounding", "Redondeo alto", "Arrondi élevé", "Hohe Rundung", "Arrotondamento alto"],
    ["Forma específica", "Specific form", "Forma específica", "Forme spécifique", "Spezifische Form", "Forma specifica"],
    ["Arroz branco", "White rice", "Arroz blanco", "Riz blanc", "Weißer Reis", "Riso bianco"],
    ["Arroz integral", "Brown rice", "Arroz integral", "Riz complet", "Vollkornreis", "Riso integrale"],
    ["Feijão carioca", "Pinto beans", "Frijoles pintos", "Haricots pinto", "Pintobohnen", "Fagioli borlotti"],
    ["Feijão preto", "Black beans", "Frijoles negros", "Haricots noirs", "Schwarze Bohnen", "Fagioli neri"],
    ["Peito de frango grelhado", "Grilled chicken breast", "Pechuga de pollo a la parrilla", "Blanc de poulet grillé", "Gegrillte Hähnchenbrust", "Petto di pollo grigliato"],
    ["Frango desfiado", "Shredded chicken", "Pollo deshebrado", "Poulet effiloché", "Gezupftes Hähnchen", "Pollo sfilacciato"],
    ["Coxa de frango assada", "Roasted chicken thigh", "Muslo de pollo asado", "Cuisse de poulet rôtie", "Gebratene Hähnchenkeule", "Coscia di pollo arrosto"],
    ["Bife grelhado", "Grilled steak", "Bistec a la parrilla", "Steak grillé", "Gegrilltes Steak", "Bistecca grigliata"],
    ["Carne assada", "Roast beef", "Carne asada", "BÅ“uf rôti", "Rinderbraten", "Carne arrosto"],
    ["Salmão grelhado", "Grilled salmon", "Salmón a la parrilla", "Saumon grillé", "Gegrillter Lachs", "Salmone grigliato"],
    ["Ovo frito", "Fried egg", "Huevo frito", "Å’uf au plat", "Spiegelei", "Uovo fritto"],
    ["Ovo cozido", "Boiled egg", "Huevo cocido", "Å’uf dur", "Gekochtes Ei", "Uovo sodo"],
    ["Ovos mexidos", "Scrambled eggs", "Huevos revueltos", "Å’ufs brouillés", "Rührei", "Uova strapazzate"],
    ["Salada verde", "Green salad", "Ensalada verde", "Salade verte", "Grüner Salat", "Insalata verde"],
    ["Brócolis cozido", "Cooked broccoli", "Brócoli cocido", "Brocoli cuit", "Gekochter Brokkoli", "Broccoli cotti"],
    ["Batata frita", "French fries", "Papas fritas", "Frites", "Pommes frites", "Patatine fritte"],
    ["Macarrão ao sugo", "Pasta with tomato sauce", "Pasta con salsa de tomate", "Pâtes à la sauce tomate", "Nudeln mit Tomatensauce", "Pasta al sugo"],
    ["Pão francês", "French roll", "Pan francés", "Petit pain français", "Brötchen", "Pane francese"],
    ["Manteiga", "Butter", "Mantequilla", "Beurre", "Butter", "Burro"],
    ["Café com leite", "Coffee with milk", "Café con leche", "Café au lait", "Milchkaffee", "Caffellatte"],
    ["Suco de laranja", "Orange juice", "Jugo de naranja", "Jus d’orange", "Orangensaft", "Succo d’arancia"],
    ["Banana", "Banana", "Banana", "Banane", "Banane", "Banana"],
    ["Maçã", "Apple", "Manzana", "Pomme", "Apfel", "Mela"],
    ["Coxinha", "Chicken croquette", "Croqueta de pollo", "Croquette de poulet", "Hähnchenkrokette", "Crocchetta di pollo"],
    ["Pizza de mussarela", "Mozzarella pizza", "Pizza de mozzarella", "Pizza mozzarella", "Mozzarella-Pizza", "Pizza mozzarella"],
    ["Azeite", "Olive oil", "Aceite de oliva", "Huile d’olive", "Olivenöl", "Olio d’oliva"]
  ];


  phraseRows.push(
    ["Última atualização: julho de 2026", "Last updated: July 2026", "Última actualización: julio de 2026", "Dernière mise à jour : juillet 2026", "Letzte Aktualisierung: Juli 2026", "Ultimo aggiornamento: luglio 2026"],
    ["1. Uso do aplicativo", "1. Use of the app", "1. Uso de la aplicación", "1. Utilisation de l’application", "1. Nutzung der App", "1. Uso dell’app"],
    ["O PancreAI analisa visualmente fotos de refeições, sugere alimentos e porções aproximadas e calcula uma estimativa somente depois da revisão do usuário. Ele não é um dispositivo médico.","PancreAI visually analyzes meal photos, suggests foods and approximate portions, and calculates an estimate only after user review. It is not a medical device.","PancreAI analiza visualmente fotos de comidas, sugiere alimentos y porciones aproximadas y calcula una estimación solo después de la revisión del usuario. No es un dispositivo médico.","PancreAI analyse visuellement des photos de repas, suggère des aliments et des portions approximatives, puis calcule une estimation uniquement après vérification. Ce n’est pas un dispositif médical.","PancreAI analysiert Mahlzeitenfotos visuell, schlägt Lebensmittel und ungefähre Portionen vor und berechnet erst nach der Prüfung eine Schätzung. Es ist kein Medizinprodukt.","PancreAI analizza visivamente le foto dei pasti, suggerisce alimenti e porzioni approssimative e calcola una stima solo dopo il controllo. Non è un dispositivo medico."],
    ["2. Dados e privacidade", "2. Data and privacy", "2. Datos y privacidad", "2. Données et confidentialité", "2. Daten und Datenschutz", "2. Dati e privacy"],
    ["A foto é enviada por um backend seguro ao Gemini Flash para análise. Fotografe apenas o prato e não inclua pessoas, documentos ou dados pessoais desnecessários. A chave da API fica somente no servidor. Tratamento, preferências, favoritos e histórico permanecem no navegador nesta versão.","The photo is sent through a secure backend to Gemini Flash for analysis. Photograph only the plate and do not include people, documents, or unnecessary personal data. The API key stays on the server. Treatment, preferences, favorites, and history remain in the browser in this version.","La foto se envía mediante un backend seguro a Gemini Flash para su análisis. Fotografía solo el plato y no incluyas personas, documentos ni datos personales innecesarios. La clave API permanece en el servidor. El tratamiento, las preferencias, los favoritos y el historial permanecen en el navegador en esta versión.","La photo est envoyée via un backend sécurisé à Gemini Flash pour analyse. Photographiez uniquement l’assiette et n’incluez pas de personnes, documents ou données personnelles inutiles. La clé API reste sur le serveur. Le traitement, les préférences, les favoris et l’historique restent dans le navigateur.","Das Foto wird über ein sicheres Backend zur Analyse an Gemini Flash gesendet. Fotografiere nur den Teller und keine Personen, Dokumente oder unnötigen persönlichen Daten. Der API-Schlüssel bleibt auf dem Server. Behandlung, Einstellungen, Favoriten und Verlauf bleiben im Browser.","La foto viene inviata tramite un backend sicuro a Gemini Flash per analisi. Fotografa solo il piatto e non includere persone, documenti o dati personali non necessari. La chiave API resta sul server. Trattamento, preferenze, preferiti e cronologia restano nel browser."],
    ["3. Limitações e precisão", "3. Limitations and accuracy", "3. Limitaciones y precisión", "3. Limites et précision", "3. Einschränkungen und Genauigkeit", "3. Limiti e precisione"],
    ["A IA pode omitir, confundir ou estimar incorretamente alimentos e porções. A revisão do usuário é obrigatória. Nutrientes e cálculos são obtidos localmente após a confirmação e não são fornecidos pela IA.","AI may omit, confuse, or incorrectly estimate foods and portions. User review is required. Nutrients and calculations are obtained locally after confirmation and are not provided by AI.","La IA puede omitir, confundir o estimar incorrectamente alimentos y porciones. La revisión del usuario es obligatoria. Los nutrientes y cálculos se obtienen localmente después de la confirmación y no los proporciona la IA.","L’IA peut omettre, confondre ou mal estimer les aliments et portions. La vérification est obligatoire. Les nutriments et calculs sont obtenus localement après confirmation et ne sont pas fournis par l’IA.","Die KI kann Lebensmittel und Portionen auslassen, verwechseln oder falsch schätzen. Die Prüfung ist erforderlich. Nährwerte und Berechnungen werden nach der Bestätigung lokal ermittelt und nicht von der KI geliefert.","L’IA può omettere, confondere o stimare male alimenti e porzioni. Il controllo è obbligatorio. Nutrienti e calcoli sono ottenuti localmente dopo la conferma e non sono forniti dall’IA."],
    ["4. Responsabilidade médica", "4. Medical responsibility", "4. Responsabilidad médica", "4. Responsabilité médicale", "4. Medizinische Verantwortung", "4. Responsabilità medica"],
    ["O app não prescreve tratamento nem substitui orientação médica ou nutricional. Nunca altere medicamento ou dose sem acompanhamento profissional.", "The app does not prescribe treatment or replace medical or nutritional guidance. Never change medication or dosage without professional supervision.", "La app no prescribe tratamientos ni sustituye la orientación médica o nutricional. Nunca cambies el medicamento o la dosis sin supervisión profesional.", "L’app ne prescrit pas de traitement et ne remplace pas un avis médical ou nutritionnel. Ne modifiez jamais un médicament ou une dose sans suivi professionnel.", "Die App verschreibt keine Behandlung und ersetzt keine medizinische oder ernährungsbezogene Beratung. Ändern Sie Medikamente oder Dosierungen niemals ohne fachliche Begleitung.", "L’app non prescrive trattamenti e non sostituisce il parere medico o nutrizionale. Non modificare mai farmaco o dose senza supervisione professionale."],
    ["5. Serviço de IA e disponibilidade","5. AI service and availability","5. Servicio de IA y disponibilidad","5. Service d’IA et disponibilité","5. KI-Dienst und Verfügbarkeit","5. Servizio IA e disponibilità"],
    ["A análise depende da imagem, da conexão, do serviço Gemini e da cota disponível. O nível gratuito está sujeito a limites e interrupções. Conforme as condições do Google, conteúdo enviado nesse nível pode ser usado para melhoria dos produtos e passar por revisão humana.","Analysis depends on the image, connection, Gemini service, and available quota. The free tier is subject to limits and interruptions. Under Google’s terms, content sent on this tier may be used to improve products and may be reviewed by humans.","El análisis depende de la imagen, la conexión, el servicio Gemini y la cuota disponible. El nivel gratuito está sujeto a límites e interrupciones. Según los términos de Google, el contenido enviado en este nivel puede usarse para mejorar productos y ser revisado por personas.","L’analyse dépend de l’image, de la connexion, du service Gemini et du quota disponible. Le niveau gratuit est soumis à des limites et interruptions. Selon les conditions de Google, le contenu envoyé à ce niveau peut servir à améliorer les produits et être examiné par des personnes.","Die Analyse hängt vom Bild, der Verbindung, dem Gemini-Dienst und dem verfügbaren Kontingent ab. Die kostenlose Stufe unterliegt Limits und Unterbrechungen. Nach den Google-Bedingungen können Inhalte zur Produktverbesserung genutzt und von Menschen geprüft werden.","L’analisi dipende dall’immagine, dalla connessione, dal servizio Gemini e dalla quota disponibile. Il livello gratuito è soggetto a limiti e interruzioni. Secondo i termini di Google, i contenuti possono essere usati per migliorare i prodotti e sottoposti a revisione umana."],
    ["6. Uso responsável e modo infantil","6. Responsible use and child mode","6. Uso responsable y modo infantil","6. Utilisation responsable et mode enfant","6. Verantwortliche Nutzung und Kindermodus","6. Uso responsabile e modalità bambino"],
    ["A análise visual deve ser iniciada por um responsável adulto. O modo infantil altera apenas a apresentação da interface e deve ser usado com supervisão. Ele não muda o processamento, os limites nem a necessidade de revisão.","Visual analysis must be started by a responsible adult. Child mode changes only the interface presentation and requires supervision. It does not change processing, limits, or the need for review.","El análisis visual debe ser iniciado por un adulto responsable. El modo infantil solo cambia la presentación y requiere supervisión. No cambia el procesamiento, los límites ni la necesidad de revisión.","L’analyse visuelle doit être lancée par un adulte responsable. Le mode enfant change uniquement la présentation et exige une supervision. Il ne modifie ni le traitement, ni les limites, ni la vérification nécessaire.","Die Bildanalyse muss von einer verantwortlichen erwachsenen Person gestartet werden. Der Kindermodus ändert nur die Darstellung und erfordert Aufsicht. Verarbeitung, Grenzen und Prüfung bleiben gleich.","L’analisi visiva deve essere avviata da un adulto responsabile. La modalità bambino cambia solo la presentazione e richiede supervisione. Non modifica elaborazione, limiti o necessità di controllo."],
    ["7. Contato", "7. Contact", "7. Contacto", "7. Contact", "7. Kontakt", "7. Contatto"],
    ["Dúvidas ou preocupações: Instagram @pancre.ai", "Questions or concerns: Instagram @pancre.ai", "Dudas o preocupaciones: Instagram @pancre.ai", "Questions ou préoccupations : Instagram @pancre.ai", "Fragen oder Anliegen: Instagram @pancre.ai", "Domande o dubbi: Instagram @pancre.ai"],
    ["Próxima página", "Next page", "Página siguiente", "Page suivante", "Nächste Seite", "Pagina successiva"],
    ["Página anterior", "Previous page", "Página anterior", "Page précédente", "Vorherige Seite", "Pagina precedente"],
    ["Contexto técnico do projeto", "Technical project context", "Contexto técnico del proyecto", "Contexte technique du projet", "Technischer Projektkontext", "Contesto tecnico del progetto"],
    ["Reconhecimento visual dos alimentos", "Visual food recognition", "Reconocimiento visual de alimentos", "Reconnaissance visuelle des aliments", "Visuelle Lebensmittelerkennung", "Riconoscimento visivo degli alimenti"],
    ["Estimativa inicial das porções", "Initial portion estimate", "Estimación inicial de porciones", "Estimation initiale des portions", "Erste Portionsschätzung", "Stima iniziale delle porzioni"],
    ["Detecção de embalagem", "Package detection", "Detección de envase", "Détection d’emballage", "Verpackungserkennung", "Rilevamento confezione"],
    ["Alimento desconhecido", "Unknown food", "Alimento desconocido", "Aliment inconnu", "Unbekanntes Lebensmittel", "Alimento sconosciuto"],
    ["Cadastro do paciente", "Patient registration", "Registro del paciente", "Enregistrement du patient", "Patientendaten", "Registrazione paziente"],
    ["Dose prescrita e potência da cápsula", "Prescribed dose and capsule strength", "Dosis prescrita y potencia de la cápsula", "Dose prescrite et dosage de la gélule", "Verordnete Dosis und Kapselstärke", "Dose prescritta e potenza della capsula"],
    ["Banco de alimentos", "Food database", "Banco de alimentos", "Base d’aliments", "Lebensmitteldatenbank", "Banca alimenti"],
    ["Banco de refeições coerentes", "Coherent meal database", "Banco de comidas coherentes", "Base de repas cohérents", "Datenbank plausibler Mahlzeiten", "Banca pasti coerenti"],
    ["Revisão manual obrigatória", "Required manual review", "Revisión manual obligatoria", "Vérification manuelle obligatoire", "Verpflichtende manuelle Prüfung", "Revisione manuale obbligatoria"],
    ["Ingredientes ocultos", "Hidden ingredients", "Ingredientes ocultos", "Ingrédients cachés", "Versteckte Zutaten", "Ingredienti nascosti"],
    ["Cálculo por gordura", "Fat-based calculation", "Cálculo por grasa", "Calcul basé sur la graisse", "Fettbasierte Berechnung", "Calcolo basato sui grassi"],
    ["Avisos de segurança", "Safety warnings", "Avisos de seguridad", "Avertissements de sécurité", "Sicherheitshinweise", "Avvisi di sicurezza"],
    ["Resultado explicado", "Explained result", "Resultado explicado", "Résultat expliqué", "Erklärtes Ergebnis", "Risultato spiegato"],
    ["Histórico local", "Local history", "Historial local", "Historique local", "Lokaler Verlauf", "Cronologia locale"]
  );

  phraseRows.push(
    ["A análise inicial tem menor confiança. Confira os alimentos e porções antes de calcular.", "The initial analysis has lower confidence. Check foods and portions before calculating.", "El análisis inicial tiene menor confianza. Revisa alimentos y porciones antes de calcular.", "L’analyse initiale a une confiance plus faible. Vérifiez les aliments et portions avant de calculer.", "Die erste Analyse hat geringere Zuverlässigkeit. Prüfe Lebensmittel und Portionen vor der Berechnung.", "L’analisi iniziale ha affidabilità minore. Controlla alimenti e porzioni prima del calcolo."],
    ["Iluminação, distância e enquadramento podem afetar a sugestão inicial dos alimentos.", "Lighting, distance, and framing may affect the initial food suggestion.", "Iluminación, distancia y encuadre pueden afectar la sugerencia inicial de alimentos.", "L’éclairage, la distance et le cadrage peuvent affecter la suggestion initiale des aliments.", "Licht, Abstand und Bildausschnitt können den ersten Lebensmittelvorschlag beeinflussen.", "Illuminazione, distanza e inquadratura possono influenzare il suggerimento iniziale degli alimenti."],
    ["Substitua, edite ou remova este item antes de continuar.", "Replace, edit, or remove this item before continuing.", "Sustituye, edita o elimina este elemento antes de continuar.", "Remplacez, modifiez ou supprimez cet élément avant de continuer.", "Ersetze, bearbeite oder entferne dieses Element, bevor du fortfährst.", "Sostituisci, modifica o rimuovi questo elemento prima di continuare."],
    ["Nesta versão, o app ainda não lê rótulos. Confira manualmente as informações nutricionais.", "The app does not read labels. Check nutrition information manually.", "En esta versión, la app aún no lee etiquetas. Revisa manualmente la información nutricional.", "Dans cette version, l’app ne lit pas encore les étiquettes. Vérifiez manuellement les informations nutritionnelles.", "In dieser Version liest die App noch keine Etiketten. Prüfe Nährwertangaben manuell.", "In questa versione, l’app non legge ancora le etichette. Controlla manualmente le informazioni nutrizionali."],
    ["Revise as possibilidades exibidas e marque apenas o que realmente estava no preparo.", "Review the displayed possibilities and select only what was actually used in the preparation.", "Revisa las posibilidades mostradas y marca solo lo que realmente se utilizó en la preparación.", "Vérifiez les possibilités affichées et sélectionnez uniquement ce qui a réellement été utilisé dans la préparation.", "Prüfe die angezeigten Möglichkeiten und wähle nur aus, was tatsächlich bei der Zubereitung verwendet wurde.", "Controlla le possibilità mostrate e seleziona solo ciò che è stato realmente usato nella preparazione."],
    ["As alterações feitas pelo usuário serão consideradas no cálculo final.", "User changes will be included in the final calculation.", "Los cambios hechos por el usuario se considerarán en el cálculo final.", "Les modifications de l’utilisateur seront prises en compte dans le calcul final.", "Änderungen des Nutzers werden in der finalen Berechnung berücksichtigt.", "Le modifiche fatte dall’utente saranno considerate nel calcolo finale."],
    ["O cálculo usa a gordura estimada da refeição, a dose prescrita cadastrada e a potência do medicamento cadastrado. Ele não substitui orientação médica ou nutricional.", "The calculation uses the estimated meal fat, the registered prescribed dose, and the registered medication strength. It does not replace medical or nutritional guidance.", "El cálculo usa la grasa estimada de la comida, la dosis prescrita registrada y la potencia del medicamento registrado. No reemplaza orientación médica o nutricional.", "Le calcul utilise la graisse estimée du repas, la dose prescrite enregistrée et le dosage du médicament enregistré. Il ne remplace pas un avis médical ou nutritionnel.", "Die Berechnung nutzt das geschätzte Fett der Mahlzeit, die gespeicherte verordnete Dosis und die Medikamentenstärke. Sie ersetzt keine medizinische oder ernährungsbezogene Beratung.", "Il calcolo usa i grassi stimati del pasto, la dose prescritta registrata e la potenza del farmaco registrato. Non sostituisce il parere medico o nutrizionale."],
    ["Esta refeição parece ter mais gordura que a maioria dos registros anteriores. Revise porções e ingredientes adicionados.", "This meal seems to have more fat than most previous records. Review portions and added ingredients.", "Esta comida parece tener más grasa que la mayoría de los registros anteriores. Revisa porciones e ingredientes agregados.", "Ce repas semble plus gras que la plupart des enregistrements précédents. Vérifiez les portions et ingrédients ajoutés.", "Diese Mahlzeit scheint mehr Fett zu enthalten als die meisten früheren Einträge. Prüfe Portionen und hinzugefügte Zutaten.", "Questo pasto sembra avere più grassi della maggior parte dei registri precedenti. Controlla porzioni e ingredienti aggiunti."],
    ["A quantidade estimada de unidades ficou acima do padrão recente do histórico. Confira se os alimentos foram revisados corretamente.", "The estimated number of units is above your recent history pattern. Check that the foods were reviewed correctly.", "La cantidad estimada de unidades quedó por encima del patrón reciente del historial. Verifica que los alimentos fueron revisados correctamente.", "Le nombre estimé d’unités dépasse votre tendance récente. Vérifiez que les aliments ont été correctement contrôlés.", "Die geschätzte Einheitenzahl liegt über deinem jüngsten Verlaufsmuster. Prüfe, ob die Lebensmittel korrekt kontrolliert wurden.", "La quantità stimata di unità è sopra il tuo andamento recente. Controlla che gli alimenti siano stati verificati correttamente."],
    ["Alguns dados da refeição foram estimados ou ficaram incertos. Revise o cálculo completo antes de considerar o resultado.", "Some meal data was estimated or remained uncertain. Review the full calculation before considering the result.", "Algunos datos de la comida fueron estimados o quedaron inciertos. Revisa el cálculo completo antes de considerar el resultado.", "Certaines données du repas ont été estimées ou restent incertaines. Vérifiez le calcul complet avant de considérer le résultat.", "Einige Mahlzeitdaten wurden geschätzt oder blieben unsicher. Prüfe die vollständige Berechnung vor der Nutzung.", "Alcuni dati del pasto sono stati stimati o sono incerti. Controlla il calcolo completo prima di considerare il risultato."],
    ["Cadastre o peso para validar a estimativa por kg.", "Enter weight to validate the estimate per kg.", "Registra el peso para validar la estimación por kg.", "Saisissez le poids pour valider l’estimation par kg.", "Gib das Gewicht ein, um die Schätzung pro kg zu validieren.", "Inserisci il peso per validare la stima per kg."],
    ["Cadastre a dose em U/g de gordura antes de calcular.", "Enter the dose in U/g of fat before calculating.", "Registra la dosis en U/g de grasa antes de calcular.", "Saisissez la dose en U/g de graisse avant de calculer.", "Gib die Dosis in U/g Fett vor der Berechnung ein.", "Inserisci la dose in U/g di grassi prima del calcolo."],
    ["Escolha o medicamento enzimático usado na sua prescrição.", "Choose the enzyme medication used in your prescription.", "Elige el medicamento enzimático usado en tu receta.", "Choisissez le médicament enzymatique indiqué dans votre prescription.", "Wähle das Enzymmedikament aus deiner Verordnung.", "Scegli il farmaco enzimatico usato nella prescrizione."],
    ["Informe as unidades de lipase por unidade do medicamento.", "Enter lipase units per medication unit.", "Informa las unidades de lipasa por unidad del medicamento.", "Indiquez les unités de lipase par unité de médicament.", "Gib Lipase-Einheiten pro Medikamenteneinheit ein.", "Inserisci le unità di lipasi per unità del farmaco."],
    ["Revise os alimentos antes de calcular.", "Review the foods before calculating.", "Revisa los alimentos antes de calcular.", "Vérifiez les aliments avant de calculer.", "Prüfe die Lebensmittel vor der Berechnung.", "Controlla gli alimenti prima del calcolo."],
    ["Não confie neste resultado sem orientação profissional.", "Do not rely on this result without professional guidance.", "No confíes en este resultado sin orientación profesional.", "Ne vous fiez pas à ce résultat sans avis professionnel.", "Verlasse dich nicht ohne professionelle Beratung auf dieses Ergebnis.", "Non fare affidamento su questo risultato senza parere professionale."],
    ["A estimativa ultrapassa 2.500 U de lipase/kg/refeição.", "The estimate exceeds 2,500 U of lipase/kg/meal.", "La estimación supera 2.500 U de lipasa/kg/comida.", "L’estimation dépasse 2 500 U de lipase/kg/repas.", "Die Schätzung überschreitet 2.500 U Lipase/kg/Mahlzeit.", "La stima supera 2.500 U di lipasi/kg/pasto."],
    ["A estimativa diária pode ultrapassar 10.000 U de lipase/kg/dia.", "The daily estimate may exceed 10,000 U of lipase/kg/day.", "La estimación diaria puede superar 10.000 U de lipasa/kg/día.", "L’estimation quotidienne peut dépasser 10 000 U de lipase/kg/jour.", "Die Tagesschätzung kann 10.000 U Lipase/kg/Tag überschreiten.", "La stima giornaliera può superare 10.000 U di lipasi/kg/giorno."],
    ["A estimativa ultrapassa 4.000 U de lipase/g de gordura.", "The estimate exceeds 4,000 U of lipase/g of fat.", "La estimación supera 4.000 U de lipasa/g de grasa.", "L’estimation dépasse 4 000 U de lipase/g de graisse.", "Die Schätzung überschreitet 4.000 U Lipase/g Fett.", "La stima supera 4.000 U di lipasi/g di grassi."],
    ["Confira se a lipase foi cadastrada exatamente como na prescrição.", "Check that lipase was entered exactly as in the prescription.", "Verifica que la lipasa fue registrada exactamente como en la receta.", "Vérifiez que la lipase a été saisie exactement comme sur la prescription.", "Prüfe, ob die Lipase exakt wie in der Verordnung eingetragen wurde.", "Controlla che la lipasi sia stata registrata esattamente come nella prescrizione."],
    ["Confirme a potência na prescrição ou embalagem.", "Confirm the strength on the prescription or package.", "Confirma la potencia en la receta o el envase.", "Confirmez le dosage sur la prescription ou l’emballage.", "Bestätige die Stärke auf Verordnung oder Verpackung.", "Conferma la potenza sulla prescrizione o confezione."],
    ["O arredondamento aumentou bastante a lipase entregue.", "Rounding increased delivered lipase substantially.", "El redondeo aumentó bastante la lipasa entregada.", "L’arrondi a fortement augmenté la lipase fournie.", "Die Rundung hat die abgegebene Lipase deutlich erhöht.", "L’arrotondamento ha aumentato molto la lipasi erogata."],
    ["Esta forma pode exigir orientação específica de uso.", "This form may require specific usage guidance.", "Esta forma puede requerir orientación específica de uso.", "Cette forme peut nécessiter des consignes d’utilisation spécifiques.", "Diese Form kann spezifische Anwendungshinweise erfordern.", "Questa forma può richiedere indicazioni d’uso specifiche."],
    ["A dose pode variar conforme o tipo de alimento e sua resposta individual. Consulte seu médico para ajustes.", "The dose may vary depending on food type and individual response. Consult your doctor for adjustments.", "La dosis puede variar según el tipo de alimento y tu respuesta individual. Consulta a tu médico para ajustes.", "La dose peut varier selon le type d’aliment et votre réponse individuelle. Consultez votre médecin pour les ajustements.", "Die Dosis kann je nach Lebensmittel und individueller Reaktion variieren. Frage deinen Arzt zu Anpassungen.", "La dose può variare in base al tipo di alimento e alla risposta individuale. Consulta il medico per modifiche."],
    ["Histórico local", "Local history", "Historial local", "Historique local", "Lokaler Verlauf", "Cronologia locale"]
  );
  phraseRows.push(
    ["Minha refeição", "My meal", "Mi comida", "Mon repas", "Meine Mahlzeit", "Il mio pasto"],
    ["Fotografe o prato ou use uma refeição salva.", "Take a photo of the plate or use a saved meal.", "Fotografía el plato o usa una comida guardada.", "Photographiez l’assiette ou utilisez un repas enregistré.", "Fotografiere den Teller oder nutze eine gespeicherte Mahlzeit.", "Fotografa il piatto o usa un pasto salvato."],
    ["Fotografar prato", "Photograph plate", "Fotografiar plato", "Photographier l’assiette", "Teller fotografieren", "Fotografare il piatto"],
    ["Ações rápidas", "Quick actions", "Acciones rápidas", "Actions rapides", "Schnellaktionen", "Azioni rapide"],
    ["Usar refeição salva", "Use saved meal", "Usar comida guardada", "Utiliser un repas enregistré", "Gespeicherte Mahlzeit nutzen", "Usa pasto salvato"],
    ["Refeições de hoje", "Today’s meals", "Comidas de hoy", "Repas du jour", "Heutige Mahlzeiten", "Pasti di oggi"],
    ["Chamar responsável", "Call caregiver", "Llamar a un responsable", "Appeler un responsable", "Betreuung rufen", "Chiama un responsabile"],
    ["Refeições", "Meals", "Comidas", "Repas", "Mahlzeiten", "Pasti"],
    ["Responsável", "Caregiver", "Responsable", "Responsable", "Betreuung", "Responsabile"],
    ["Área do responsável", "Caregiver area", "Área del responsable", "Espace responsable", "Bereich für Betreuung", "Area del responsabile"],
    ["Área do Responsável", "Caregiver Area", "Área del responsable", "Espace responsable", "Bereich für Betreuung", "Area del responsabile"],
    ["Essa área contém dados importantes do tratamento e configurações do cálculo.", "This area contains important treatment data and calculation settings.", "Esta área contiene datos importantes del tratamiento y ajustes del cálculo.", "Cette zone contient des données importantes du traitement et les paramètres du calcul.", "Dieser Bereich enthält wichtige Behandlungsdaten und Berechnungseinstellungen.", "Questa area contiene dati importanti del trattamento e impostazioni del calcolo."],
    ["Continuar como responsável", "Continue as caregiver", "Continuar como responsable", "Continuer comme responsable", "Als Betreuung fortfahren", "Continua come responsabile"],
    ["Essa informação precisa ser revisada por um responsável.", "This information needs to be reviewed by a caregiver.", "Esta información debe ser revisada por un responsable.", "Cette information doit être vérifiée par un responsable.", "Diese Information muss von einer Betreuung geprüft werden.", "Questa informazione deve essere verificata da un responsabile."],
    ["Ir para Área do Responsável", "Go to Caregiver Area", "Ir al Área del responsable", "Aller à l’Espace responsable", "Zum Betreuungsbereich", "Vai all’Area del responsabile"]
  );
  phraseRows.push(
    ["Ativar Modo Infantil?", "Turn on Child Mode?", "¿Activar modo infantil?", "Activer le mode enfant ?", "Kindermodus aktivieren?", "Attivare modalità bambino?"],
    ["Desativar Modo Infantil?", "Turn off Child Mode?", "¿Desactivar modo infantil?", "Désactiver le mode enfant ?", "Kindermodus deaktivieren?", "Disattivare modalità bambino?"],
    ["O app vai mostrar apenas o essencial para revisar refeições. Configurações de tratamento, dose, medicamento e histórico completo continuarão disponíveis na Área do Responsável.", "The app will show only what is essential to review meals. Treatment settings, dose, medication, and full history will remain available in the Caregiver Area.", "La app mostrará solo lo esencial para revisar comidas. Los ajustes del tratamiento, dosis, medicamento e historial completo seguirán disponibles en el Área del responsable.", "L’app affichera seulement l’essentiel pour vérifier les repas. Les réglages du traitement, la dose, le médicament et l’historique complet resteront disponibles dans l’Espace responsable.", "Die App zeigt nur das Wesentliche zur Mahlzeitenprüfung. Behandlungseinstellungen, Dosis, Medikament und vollständiger Verlauf bleiben im Betreuungsbereich verfügbar.", "L’app mostrerà solo l’essenziale per controllare i pasti. Impostazioni del trattamento, dose, farmaco e cronologia completa resteranno disponibili nell’Area del responsabile."],
    ["O app voltará a mostrar a experiência completa.", "The app will show the full experience again.", "La app volverá a mostrar la experiencia completa.", "L’app affichera à nouveau l’expérience complète.", "Die App zeigt wieder die vollständige Erfahrung.", "L’app tornerà a mostrare l’esperienza completa."],
    ["Ativar", "Turn on", "Activar", "Activer", "Aktivieren", "Attiva"],
    ["Desativar", "Turn off", "Desactivar", "Désactiver", "Deaktivieren", "Disattiva"],
    ["Vamos revisar seu prato", "Let’s review your plate", "Revisemos tu plato", "Vérifions votre assiette", "Lass uns deinen Teller prüfen", "Rivediamo il tuo piatto"],
    ["Confira se os alimentos estão certos. Um responsável pode revisar depois.", "Check that the foods are right. A caregiver can review later.", "Comprueba si los alimentos están correctos. Un responsable puede revisar después.", "Vérifiez que les aliments sont corrects. Un responsable pourra revoir ensuite.", "Prüfe, ob die Lebensmittel stimmen. Eine Betreuung kann später noch einmal prüfen.", "Controlla che gli alimenti siano corretti. Un responsabile può rivedere dopo."],
    ["Adicionar algo que faltou", "Add something missing", "Añadir algo que falta", "Ajouter ce qui manque", "Fehlendes hinzufügen", "Aggiungi qualcosa che manca"],
    ["Tudo certo", "All set", "Todo bien", "Tout est bon", "Alles passt", "Tutto a posto"],
    ["Quantidade:", "Amount:", "Cantidad:", "Quantité :", "Menge:", "Quantità:"],
    ["Está certo", "Looks right", "Está bien", "C’est correct", "Stimmt", "È corretto"],
    ["Mudar quantidade", "Change amount", "Cambiar cantidad", "Modifier la quantité", "Menge ändern", "Cambia quantità"],
    ["Tem algo que não reconhecemos", "Something was not recognized", "Hay algo que no reconocimos", "Quelque chose n’a pas été reconnu", "Etwas wurde nicht erkannt", "Qualcosa non è stato riconosciuto"],
    ["Peça para um responsável conferir ou substitua pelo alimento correto.", "Ask a caregiver to check or replace it with the right food.", "Pide a un responsable que revise o sustitúyelo por el alimento correcto.", "Demandez à un responsable de vérifier ou remplacez-le par le bon aliment.", "Bitte eine Betreuung um Prüfung oder ersetze es durch das richtige Lebensmittel.", "Chiedi a un responsabile di controllare o sostituiscilo con l’alimento corretto."],
    ["Substituir", "Replace", "Sustituir", "Remplacer", "Ersetzen", "Sostituisci"]
  );
  phraseRows.push(
    ["Quanto tinha?", "How much was there?", "¿Cuánto había?", "Quelle quantité ?", "Wie viel war es?", "Quanto ce n’era?"],
    ["Escolha uma quantidade simples. O app converte para gramas por trás.", "Choose a simple amount. The app converts it to grams in the background.", "Elige una cantidad simple. La app la convierte a gramos por detrás.", "Choisissez une quantité simple. L’app la convertit en grammes en arrière-plan.", "Wähle eine einfache Menge. Die App rechnet sie im Hintergrund in Gramm um.", "Scegli una quantità semplice. L’app la converte in grammi in background."],
    ["Um pouquinho", "A tiny bit", "Un poquito", "Un petit peu", "Ein bisschen", "Un pochino"],
    ["Pouco", "A little", "Poco", "Peu", "Wenig", "Poco"],
    ["Médio", "Medium", "Medio", "Moyen", "Mittel", "Medio"],
    ["Muito", "A lot", "Mucho", "Beaucoup", "Viel", "Molto"],
    ["Bastante", "Plenty", "Bastante", "Beaucoup", "Ziemlich viel", "Abbastanza"],
    ["Meio", "Half", "Medio", "Un demi", "Halb", "Mezzo"],
    ["Um", "One", "Uno", "Un", "Eins", "Uno"],
    ["Dois", "Two", "Dos", "Deux", "Zwei", "Due"],
    ["Quantidade atualizada", "Amount updated", "Cantidad actualizada", "Quantité mise à jour", "Menge aktualisiert", "Quantità aggiornata"],
    ["Quase pronto", "Almost ready", "Casi listo", "Presque prêt", "Fast fertig", "Quasi pronto"],
    ["Chame um responsável para conferir antes de usar.", "Ask a caregiver to review before using.", "Pide a un responsable que revise antes de usar.", "Demandez à un responsable de vérifier avant d’utiliser.", "Bitte eine Betreuung vor der Nutzung um Prüfung.", "Chiedi a un responsabile di controllare prima di usare."],
    ["Resultado estimado", "Estimated result", "Resultado estimado", "Résultat estimé", "Geschätztes Ergebnis", "Risultato stimato"],
    ["Gordura da refeição", "Meal fat", "Grasa de la comida", "Graisses du repas", "Fett der Mahlzeit", "Grassi del pasto"],
    ["Enzima estimada", "Estimated enzyme", "Enzima estimada", "Enzyme estimée", "Geschätztes Enzym", "Enzima stimato"],
    ["Um responsável deve conferir este resultado.", "A caregiver should review this result.", "Un responsable debe revisar este resultado.", "Un responsable doit vérifier ce résultat.", "Eine Betreuung sollte dieses Ergebnis prüfen.", "Un responsabile dovrebbe controllare questo risultato."],
    ["Esse resultado é uma estimativa. Chame um responsável antes de usar.", "This result is an estimate. Ask a caregiver before using it.", "Este resultado es una estimación. Pide a un responsable que revise antes de usarlo.", "Ce résultat est une estimation. Demandez à un responsable avant de l’utiliser.", "Dieses Ergebnis ist eine Schätzung. Bitte vor der Nutzung eine Betreuung fragen.", "Questo risultato è una stima. Chiedi a un responsabile prima di usarlo."],
    ["Salvar refeição", "Save meal", "Guardar comida", "Enregistrer le repas", "Mahlzeit speichern", "Salva pasto"],
    ["Ver explicação para responsável", "See caregiver explanation", "Ver explicación para el responsable", "Voir l’explication pour le responsable", "Erklärung für Betreuung anzeigen", "Vedi spiegazione per responsabile"]
  );
  phraseRows.push(
    ["Primeiro, somamos a gordura dos alimentos.", "First, we add up the fat in the foods.", "Primero, sumamos la grasa de los alimentos.", "D’abord, nous additionnons les graisses des aliments.", "Zuerst addieren wir das Fett der Lebensmittel.", "Prima sommiamo i grassi degli alimenti."],
    ["Depois, usamos a dose cadastrada pelo responsável.", "Then we use the dose entered by the caregiver.", "Después, usamos la dosis registrada por el responsable.", "Ensuite, nous utilisons la dose saisie par le responsable.", "Dann verwenden wir die von der Betreuung eingetragene Dosis.", "Poi usiamo la dose inserita dal responsabile."],
    ["Por fim, o app calcula quantas unidades da enzima seriam necessárias.", "Finally, the app calculates how many enzyme units may be needed.", "Por último, la app calcula cuántas unidades de enzima podrían necesitarse.", "Enfin, l’app calcule combien d’unités d’enzyme pourraient être nécessaires.", "Am Ende berechnet die App, wie viele Enzymeinheiten nötig sein könnten.", "Infine, l’app calcola quante unità di enzima potrebbero servire."],
    ["Esse resultado precisa ser conferido por um responsável.", "This result needs to be checked by a caregiver.", "Este resultado debe ser revisado por un responsable.", "Ce résultat doit être vérifié par un responsable.", "Dieses Ergebnis muss von einer Betreuung geprüft werden.", "Questo risultato deve essere controllato da un responsabile."],
    ["Um resumo simples do dia", "A simple summary of the day", "Un resumen simple del día", "Un résumé simple de la journée", "Eine einfache Tagesübersicht", "Un riepilogo semplice della giornata"],
    ["Nenhuma refeição hoje", "No meals today", "No hay comidas hoy", "Aucun repas aujourd’hui", "Heute keine Mahlzeiten", "Nessun pasto oggi"],
    ["Quando você salvar uma refeição, ela aparecerá aqui.", "When you save a meal, it will appear here.", "Cuando guardes una comida, aparecerá aquí.", "Quand vous enregistrez un repas, il apparaît ici.", "Wenn du eine Mahlzeit speicherst, erscheint sie hier.", "Quando salvi un pasto, apparirà qui."],
    ["Revisado", "Reviewed", "Revisado", "Vérifié", "Geprüft", "Controllato"],
    ["Ver histórico completo", "View full history", "Ver historial completo", "Voir l’historique complet", "Vollständigen Verlauf anzeigen", "Vedi cronologia completa"],
    ["Revisão", "Review", "Revisión", "Vérification", "Prüfung", "Revisione"],
    ["Refeições salvas", "Saved meals", "Comidas guardadas", "Repas enregistrés", "Gespeicherte Mahlzeiten", "Pasti salvati"],
    ["Nenhuma refeição salva", "No saved meals", "No hay comidas guardadas", "Aucun repas enregistré", "Keine gespeicherten Mahlzeiten", "Nessun pasto salvato"],
    ["As refeições salvas aparecerão aqui.", "Saved meals will appear here.", "Las comidas guardadas aparecerán aquí.", "Les repas enregistrés apparaîtront ici.", "Gespeicherte Mahlzeiten erscheinen hier.", "I pasti salvati appariranno qui."],
    ["Refeição salva", "Saved meal", "Comida guardada", "Repas enregistré", "Gespeicherte Mahlzeit", "Pasto salvato"],
    ["Comi isso", "I ate this", "Comí esto", "J’ai mangé ça", "Das habe ich gegessen", "Ho mangiato questo"],
    ["Refeição favorita reutilizada", "Favorite meal reused", "Comida favorita reutilizada", "Repas favori réutilisé", "Lieblingsmahlzeit wiederverwendet", "Pasto preferito riutilizzato"]
  );
  phraseRows.push(
    ["Escolha como deseja analisar sua refeição.", "Choose how you want to analyze your meal.", "Elige cómo quieres analizar tu comida.", "Choisissez comment analyser votre repas.", "Wähle, wie du deine Mahlzeit analysieren möchtest.", "Scegli come vuoi analizzare il pasto."]
  );
  phraseRows.push(
    ["Câmera e galeria usam fotos reais","Camera and gallery use real photos","La cámara y la galería usan fotos reales","L’appareil photo et la galerie utilisent de vraies photos","Kamera und Galerie verwenden echte Fotos","Fotocamera e galleria usano foto reali"],
    ["Com a permissão do usuário, o navegador captura uma foto ou abre uma imagem da galeria. O app valida, redimensiona e comprime o arquivo antes do envio.","With permission, the browser takes a photo or opens one from the gallery. The app validates, resizes, and compresses it before sending.","Con permiso, el navegador toma una foto o abre una de la galería. La app la valida, redimensiona y comprime antes de enviarla.","Avec autorisation, le navigateur prend une photo ou en ouvre une de la galerie. L’app la valide, redimensionne et compresse avant l’envoi.","Mit Zustimmung nimmt der Browser ein Foto auf oder öffnet eines aus der Galerie. Die App prüft, skaliert und komprimiert es vor dem Senden.","Con il permesso, il browser scatta una foto o ne apre una dalla galleria. L’app la convalida, ridimensiona e comprime prima dell’invio."],
    ["O Gemini faz a análise visual","Gemini performs the visual analysis","Gemini realiza el análisis visual","Gemini effectue l’analyse visuelle","Gemini führt die Bildanalyse durch","Gemini esegue l’analisi visiva"],
    ["A foto é enviada pelo backend ao Gemini Flash, que reconhece alimentos e estima porções visuais. A IA pode errar, por isso cada sugestão precisa ser revisada.","The backend sends the photo to Gemini Flash, which recognizes foods and visually estimates portions. AI can make mistakes, so every suggestion must be reviewed.","El backend envía la foto a Gemini Flash, que reconoce alimentos y estima porciones visuales. La IA puede equivocarse, por eso cada sugerencia debe revisarse.","Le backend envoie la photo à Gemini Flash, qui reconnaît les aliments et estime visuellement les portions. L’IA peut se tromper, chaque suggestion doit donc être vérifiée.","Das Backend sendet das Foto an Gemini Flash, das Lebensmittel erkennt und Portionen visuell schätzt. KI kann Fehler machen, daher muss jeder Vorschlag geprüft werden.","Il backend invia la foto a Gemini Flash, che riconosce gli alimenti e stima visivamente le porzioni. L’IA può sbagliare, quindi ogni suggerimento va controllato."],
    ["Os nutrientes vêm do banco local","Nutrients come from the local database","Los nutrientes provienen de la base local","Les nutriments proviennent de la base locale","Nährwerte stammen aus der lokalen Datenbank","I nutrienti provengono dal database locale"],
    ["A resposta da IA é relacionada ao catálogo do PancreAI. Gordura, proteína, carboidratos e calorias vêm somente do banco local e das quantidades confirmadas.","The AI response is matched to the PancreAI catalog. Fat, protein, carbohydrates, and calories come only from the local database and confirmed amounts.","La respuesta de la IA se relaciona con el catálogo de PancreAI. Grasas, proteínas, carbohidratos y calorías provienen solo de la base local y de las cantidades confirmadas.","La réponse de l’IA est associée au catalogue PancreAI. Lipides, protéines, glucides et calories proviennent uniquement de la base locale et des quantités confirmées.","Die KI-Antwort wird dem PancreAI-Katalog zugeordnet. Fett, Eiweiß, Kohlenhydrate und Kalorien stammen nur aus der lokalen Datenbank und den bestätigten Mengen.","La risposta dell’IA viene associata al catalogo PancreAI. Grassi, proteine, carboidrati e calorie provengono solo dal database locale e dalle quantità confermate."],
    ["O cálculo é separado da IA","Calculation is separate from AI","El cálculo está separado de la IA","Le calcul est séparé de l’IA","Die Berechnung ist von der KI getrennt","Il calcolo è separato dall’IA"],
    ["Depois da revisão obrigatória, regras locais somam a gordura, aplicam os dados de tratamento cadastrados e geram avisos. A IA não escolhe nem altera a dose.","After the required review, local rules total the fat, apply registered treatment data, and generate warnings. AI does not choose or change the dose.","Tras la revisión obligatoria, reglas locales suman la grasa, aplican los datos de tratamiento registrados y generan avisos. La IA no elige ni modifica la dosis.","Après la vérification obligatoire, des règles locales additionnent les lipides, appliquent les données de traitement et génèrent des alertes. L’IA ne choisit ni ne modifie la dose.","Nach der verpflichtenden Prüfung summieren lokale Regeln das Fett, wenden gespeicherte Behandlungsdaten an und erzeugen Hinweise. Die KI wählt oder ändert keine Dosis.","Dopo il controllo obbligatorio, regole locali sommano i grassi, applicano i dati di trattamento e generano avvisi. L’IA non sceglie né modifica la dose."],
    ["Reconhecimento visual de alimentos na foto","Visual recognition of foods in the photo","Reconocimiento visual de alimentos en la foto","Reconnaissance visuelle des aliments sur la photo","Visuelle Erkennung der Lebensmittel im Foto","Riconoscimento visivo degli alimenti nella foto"],
    ["Estimativa visual de porções aproximadas","Visual estimate of approximate portions","Estimación visual de porciones aproximadas","Estimation visuelle de portions approximatives","Visuelle Schätzung ungefährer Portionen","Stima visiva di porzioni approssimative"],
    ["Indicação de confiança e qualidade da imagem","Confidence and image-quality indicators","Indicadores de confianza y calidad de imagen","Indicateurs de confiance et de qualité de l’image","Angaben zu Zuverlässigkeit und Bildqualität","Indicatori di affidabilità e qualità dell’immagine"],
    ["Possibilidade de omissões e identificações incorretas","Possible omissions and incorrect identifications","Posibles omisiones e identificaciones incorrectas","Omissions et identifications incorrectes possibles","Mögliche Auslassungen und falsche Erkennungen","Possibili omissioni e identificazioni errate"],
    ["Nenhum nutriente, medicamento ou dose fornecido pela IA é usado no cálculo","No nutrient, medication, or dose supplied by AI is used in the calculation","Ningún nutriente, medicamento o dosis proporcionado por la IA se usa en el cálculo","Aucun nutriment, médicament ou dosage fourni par l’IA n’est utilisé dans le calcul","Keine von der KI gelieferten Nährwerte, Medikamente oder Dosen werden für die Berechnung verwendet","Nessun nutriente, farmaco o dose fornito dall’IA viene usato nel calcolo"],
    ["Validação e compressão da foto no navegador","Photo validation and compression in the browser","Validación y compresión de la foto en el navegador","Validation et compression de la photo dans le navigateur","Prüfung und Komprimierung des Fotos im Browser","Convalida e compressione della foto nel browser"],
    ["Correspondência com o banco nutricional local","Matching with the local nutrition database","Correspondencia con la base nutricional local","Correspondance avec la base nutritionnelle locale","Abgleich mit der lokalen Nährwertdatenbank","Associazione con il database nutrizionale locale"],
    ["Revisão manual obrigatória dos alimentos e porções","Required manual review of foods and portions","Revisión manual obligatoria de alimentos y porciones","Vérification manuelle obligatoire des aliments et portions","Verpflichtende manuelle Prüfung von Lebensmitteln und Portionen","Controllo manuale obbligatorio di alimenti e porzioni"],
    ["Ingredientes ocultos e ajuste de quantidade","Hidden ingredients and amount adjustment","Ingredientes ocultos y ajuste de cantidad","Ingrédients cachés et ajustement des quantités","Versteckte Zutaten und Mengenanpassung","Ingredienti nascosti e modifica delle quantità"],
    ["Cálculo determinístico de gordura, lipase e unidades","Deterministic calculation of fat, lipase, and units","Cálculo determinista de grasa, lipasa y unidades","Calcul déterministe des lipides, de la lipase et des unités","Deterministische Berechnung von Fett, Lipase und Einheiten","Calcolo deterministico di grassi, lipasi e unità"],
    ["Tratamento, preferências, favoritos e histórico salvos localmente","Treatment, preferences, favorites, and history saved locally","Tratamiento, preferencias, favoritos e historial guardados localmente","Traitement, préférences, favoris et historique enregistrés localement","Behandlung, Einstellungen, Favoriten und Verlauf lokal gespeichert","Trattamento, preferenze, preferiti e cronologia salvati localmente"]
  );
  phraseRows.push(
    ["Análise visual com Gemini","Visual analysis with Gemini","Análisis visual con Gemini","Analyse visuelle avec Gemini","Bildanalyse mit Gemini","Analisi visiva con Gemini"],
    ["via backend","through the backend","mediante el backend","via le backend","über das Backend","tramite il backend"],
    ["A chave da API fica somente no servidor","The API key stays only on the server","La clave API permanece solo en el servidor","La clé API reste uniquement sur le serveur","Der API-Schlüssel bleibt ausschließlich auf dem Server","La chiave API rimane solo sul server"],
    ["A foto é enviada ao serviço Gemini para análise","The photo is sent to the Gemini service for analysis","La foto se envía al servicio Gemini para su análisis","La photo est envoyée au service Gemini pour analyse","Das Foto wird zur Analyse an den Gemini-Dienst gesendet","La foto viene inviata al servizio Gemini per l’analisi"],
    ["A resposta contém apenas sugestões visuais para revisão","The response contains only visual suggestions for review","La respuesta contiene solo sugerencias visuales para revisar","La réponse contient uniquement des suggestions visuelles à vérifier","Die Antwort enthält nur visuelle Vorschläge zur Prüfung","La risposta contiene solo suggerimenti visivi da controllare"],
    ["Fonte dos nutrientes usados no cálculo","Source of the nutrients used in the calculation","Fuente de los nutrientes usados en el cálculo","Source des nutriments utilisés dans le calcul","Quelle der für die Berechnung verwendeten Nährwerte","Fonte dei nutrienti usati nel calcolo"],
    ["Valores recalculados pela quantidade confirmada","Values recalculated from the confirmed amount","Valores recalculados según la cantidad confirmada","Valeurs recalculées selon la quantité confirmée","Werte anhand der bestätigten Menge neu berechnet","Valori ricalcolati in base alla quantità confermata"],
    ["Pesquisa para adicionar ou substituir alimentos","Search to add or replace foods","Búsqueda para agregar o sustituir alimentos","Recherche pour ajouter ou remplacer des aliments","Suche zum Hinzufügen oder Ersetzen von Lebensmitteln","Ricerca per aggiungere o sostituire alimenti"],
    ["Dados no dispositivo","Data on the device","Datos en el dispositivo","Données sur l’appareil","Daten auf dem Gerät","Dati sul dispositivo"],
    ["armazenamento local","local storage","almacenamiento local","stockage local","lokale Speicherung","archiviazione locale"],
    ["Tratamento e preferências permanecem no navegador","Treatment and preferences remain in the browser","El tratamiento y las preferencias permanecen en el navegador","Le traitement et les préférences restent dans le navigateur","Behandlung und Einstellungen bleiben im Browser","Trattamento e preferenze restano nel browser"],
    ["Histórico e favoritos ficam no dispositivo","History and favorites stay on the device","El historial y los favoritos permanecen en el dispositivo","L’historique et les favoris restent sur l’appareil","Verlauf und Favoriten bleiben auf dem Gerät","Cronologia e preferiti restano sul dispositivo"],
    ["A chave do Gemini nunca é incluída no código da página","The Gemini key is never included in the page code","La clave de Gemini nunca se incluye en el código de la página","La clé Gemini n’est jamais incluse dans le code de la page","Der Gemini-Schlüssel wird nie in den Seitencode eingefügt","La chiave Gemini non viene mai inclusa nel codice della pagina"],
    ["Câmera ou galeria","Camera or gallery","Cámara o galería","Appareil photo ou galerie","Kamera oder Galerie","Fotocamera o galleria"],
    ["Imagem validada","Validated image","Imagen validada","Image validée","Geprüftes Bild","Immagine convalidata"],
    ["Backend seguro","Secure backend","Backend seguro","Backend sécurisé","Sicheres Backend","Backend sicuro"],
    ["Revisão obrigatória","Required review","Revisión obligatoria","Vérification obligatoire","Verpflichtende Prüfung","Controllo obbligatorio"],
    ["Cálculo determinístico","Deterministic calculation","Cálculo determinista","Calcul déterministe","Deterministische Berechnung","Calcolo deterministico"],
    ["Resultado e histórico","Result and history","Resultado e historial","Résultat et historique","Ergebnis und Verlauf","Risultato e cronologia"],
    ["Toda análise exige conferência","Every analysis requires confirmation","Todo análisis requiere comprobación","Toute analyse exige une vérification","Jede Analyse muss geprüft werden","Ogni analisi richiede un controllo"],
    ["Uma foto não revela com precisão absoluta quantidades, preparo ou ingredientes ocultos. Corrija itens errados e adicione o que não foi reconhecido antes de calcular.","A photo cannot reveal amounts, preparation, or hidden ingredients with absolute accuracy. Correct wrong items and add anything not recognized before calculating.","Una foto no revela con precisión absoluta cantidades, preparación ni ingredientes ocultos. Corrige los elementos erróneos y agrega lo no reconocido antes de calcular.","Une photo ne révèle pas avec une précision absolue les quantités, la préparation ou les ingrédients cachés. Corrigez les erreurs et ajoutez les éléments non reconnus avant le calcul.","Ein Foto zeigt Mengen, Zubereitung oder versteckte Zutaten nicht mit absoluter Genauigkeit. Korrigiere falsche Einträge und ergänze nicht erkannte Lebensmittel vor der Berechnung.","Una foto non mostra con precisione assoluta quantità, preparazione o ingredienti nascosti. Correggi gli elementi errati e aggiungi quelli non riconosciuti prima del calcolo."],
    ["Envie somente a imagem necessária","Send only the necessary image","Envía solo la imagen necesaria","Envoyez uniquement l’image nécessaire","Sende nur das notwendige Bild","Invia solo l’immagine necessaria"],
    ["A foto é enviada para análise pelo Gemini. Fotografe apenas o prato, sem pessoas, documentos ou dados pessoais desnecessários.","The photo is sent to Gemini for analysis. Photograph only the plate, without people, documents, or unnecessary personal data.","La foto se envía a Gemini para su análisis. Fotografía solo el plato, sin personas, documentos ni datos personales innecesarios.","La photo est envoyée à Gemini pour analyse. Photographiez uniquement l’assiette, sans personnes, documents ni données personnelles inutiles.","Das Foto wird zur Analyse an Gemini gesendet. Fotografiere nur den Teller, ohne Personen, Dokumente oder unnötige persönliche Daten.","La foto viene inviata a Gemini per l’analisi. Fotografa solo il piatto, senza persone, documenti o dati personali non necessari."]
  );
  phraseRows.push(
    ["Sobre esta versão","About this version","Acerca de esta versión","À propos de cette version","Über diese Version","Informazioni su questa versione"],
    ["Esta página descreve o funcionamento real do PancreAI, da captura da foto ao resultado revisado.","This page describes how PancreAI actually works, from taking the photo to the reviewed result.","Esta página describe cómo funciona realmente PancreAI, desde la foto hasta el resultado revisado.","Cette page décrit le fonctionnement réel de PancreAI, de la photo au résultat vérifié.","Diese Seite beschreibt die tatsächliche Funktionsweise von PancreAI, von der Aufnahme bis zum geprüften Ergebnis.","Questa pagina descrive il funzionamento reale di PancreAI, dalla foto al risultato controllato."],
    ["Visão geral","Overview","Visión general","Vue d’ensemble","Überblick","Panoramica"],
    ["Como o PancreAI funciona","How PancreAI works","Cómo funciona PancreAI","Comment fonctionne PancreAI","So funktioniert PancreAI","Come funziona PancreAI"],
    ["A câmera e a galeria recebem fotos reais. O backend envia a imagem ao Gemini Flash, que reconhece alimentos e estima porções visuais.","The camera and gallery receive real photos. The backend sends the image to Gemini Flash, which recognizes foods and visually estimates portions.","La cámara y la galería reciben fotos reales. El backend envía la imagen a Gemini Flash, que reconoce alimentos y estima visualmente las porciones.","L’appareil photo et la galerie reçoivent de vraies photos. Le backend envoie l’image à Gemini Flash, qui reconnaît les aliments et estime visuellement les portions.","Kamera und Galerie verwenden echte Fotos. Das Backend sendet das Bild an Gemini Flash, das Lebensmittel erkennt und Portionen visuell schätzt.","Fotocamera e galleria ricevono foto reali. Il backend invia l’immagine a Gemini Flash, che riconosce gli alimenti e stima visivamente le porzioni."],
    ["O usuário revisa essas sugestões. Depois, o banco local fornece os nutrientes e o motor de cálculo aplica regras determinísticas aos dados confirmados e ao tratamento cadastrado.","The user reviews these suggestions. Then the local database supplies nutrients, and the calculation engine applies deterministic rules to confirmed data and registered treatment.","El usuario revisa estas sugerencias. Después, la base local proporciona los nutrientes y el motor de cálculo aplica reglas deterministas a los datos confirmados y al tratamiento registrado.","L’utilisateur vérifie ces suggestions. Ensuite, la base locale fournit les nutriments et le moteur de calcul applique des règles déterministes aux données confirmées et au traitement enregistré.","Der Nutzer prüft die Vorschläge. Danach liefert die lokale Datenbank Nährwerte, und die Rechenlogik wendet feste Regeln auf bestätigte Daten und die gespeicherte Behandlung an.","L’utente controlla i suggerimenti. Poi il database locale fornisce i nutrienti e il motore di calcolo applica regole deterministiche ai dati confermati e al trattamento registrato."],
    ["A IA fornece sugestões visuais. Somente a lista revisada pelo usuário alimenta o cálculo.","AI provides visual suggestions. Only the user-reviewed list is used for calculation.","La IA proporciona sugerencias visuales. Solo la lista revisada por el usuario se usa en el cálculo.","L’IA fournit des suggestions visuelles. Seule la liste vérifiée par l’utilisateur est utilisée dans le calcul.","Die KI liefert visuelle Vorschläge. Nur die vom Nutzer geprüfte Liste wird für die Berechnung verwendet.","L’IA fornisce suggerimenti visivi. Solo l’elenco controllato dall’utente viene usato nel calcolo."],
    ["modelo visual","visual model","modelo visual","modèle visuel","Bildmodell","modello visivo"],
    ["alimentos pesquisáveis","searchable foods","alimentos disponibles en la búsqueda","aliments consultables","durchsuchbare Lebensmittel","alimenti ricercabili"],
    ["revisão necessária","review required","revisión necesaria","vérification nécessaire","Prüfung erforderlich","controllo necessario"],
    ["Antes de todo cálculo","Before every calculation","Antes de cada cálculo","Avant chaque calcul","Vor jeder Berechnung","Prima di ogni calcolo"],
    ["IA para reconhecer, regras locais para calcular","AI for recognition, local rules for calculation","IA para reconocer, reglas locales para calcular","L’IA pour reconnaître, des règles locales pour calculer","KI zur Erkennung, lokale Regeln zur Berechnung","IA per riconoscere, regole locali per calcolare"],
    ["O reconhecimento visual não controla o banco nutricional, a prescrição nem o cálculo. Essa separação reduz o impacto de uma sugestão incorreta e mantém a revisão visível.","Visual recognition does not control the nutrition database, prescription, or calculation. This separation reduces the impact of a wrong suggestion and keeps review visible.","El reconocimiento visual no controla la base nutricional, la prescripción ni el cálculo. Esta separación reduce el impacto de una sugerencia incorrecta y mantiene visible la revisión.","La reconnaissance visuelle ne contrôle ni la base nutritionnelle, ni la prescription, ni le calcul. Cette séparation réduit l’impact d’une suggestion incorrecte et rend la vérification visible.","Die Bilderkennung steuert weder Nährwertdatenbank, Verordnung noch Berechnung. Diese Trennung verringert die Folgen eines falschen Vorschlags und macht die Prüfung sichtbar.","Il riconoscimento visivo non controlla il database nutrizionale, la prescrizione o il calcolo. Questa separazione riduce l’impatto di un suggerimento errato e rende visibile il controllo."],
    ["Funciona dentro do PancreAI","Handled inside PancreAI","Funciona dentro de PancreAI","Géré dans PancreAI","Wird in PancreAI verarbeitet","Gestito all’interno di PancreAI"],
    ["Organização dos dados","Data organization","Organización de los datos","Organisation des données","Datenorganisation","Organizzazione dei dati"],
    ["Cada fonte tem uma responsabilidade","Each source has one responsibility","Cada fuente tiene una responsabilidad","Chaque source a une responsabilité","Jede Quelle hat eine Aufgabe","Ogni fonte ha una responsabilità"],
    ["O Gemini sugere nomes e porções visuais; o banco local fornece nutrientes; o navegador mantém tratamento e histórico no dispositivo.","Gemini suggests names and visual portions; the local database supplies nutrients; the browser keeps treatment and history on the device.","Gemini sugiere nombres y porciones visuales; la base local proporciona nutrientes; el navegador mantiene tratamiento e historial en el dispositivo.","Gemini suggère des noms et des portions visuelles ; la base locale fournit les nutriments ; le navigateur conserve le traitement et l’historique sur l’appareil.","Gemini schlägt Namen und visuelle Portionen vor; die lokale Datenbank liefert Nährwerte; der Browser speichert Behandlung und Verlauf auf dem Gerät.","Gemini suggerisce nomi e porzioni visive; il database locale fornisce i nutrienti; il browser conserva trattamento e cronologia sul dispositivo."],
    ["Da foto real ao histórico","From the real photo to history","De la foto real al historial","De la vraie photo à l’historique","Vom echten Foto zum Verlauf","Dalla foto reale alla cronologia"],
    ["Cada etapa conserva uma responsabilidade clara, e o cálculo só acontece depois da conferência do usuário.","Each step has a clear responsibility, and calculation occurs only after user confirmation.","Cada etapa tiene una responsabilidad clara y el cálculo solo ocurre después de la comprobación del usuario.","Chaque étape a une responsabilité claire et le calcul n’a lieu qu’après la vérification de l’utilisateur.","Jeder Schritt hat eine klare Aufgabe, und die Berechnung erfolgt erst nach der Prüfung durch den Nutzer.","Ogni fase ha una responsabilità chiara e il calcolo avviene solo dopo il controllo dell’utente."],
    ["Cálculo da estimativa","Estimate calculation","Cálculo de la estimación","Calcul de l’estimation","Berechnung der Schätzung","Calcolo della stima"],
    ["O cálculo usa a gordura da refeição revisada","The calculation uses fat from the reviewed meal","El cálculo usa la grasa de la comida revisada","Le calcul utilise les lipides du repas vérifié","Die Berechnung verwendet das Fett der geprüften Mahlzeit","Il calcolo usa i grassi del pasto controllato"],
    ["Primeiro, o app soma a gordura dos alimentos confirmados e dos ingredientes ocultos marcados. Depois aplica a dose prescrita em unidades de lipase por grama de gordura.","First, the app adds fat from confirmed foods and selected hidden ingredients. Then it applies the prescribed dose in lipase units per gram of fat.","Primero, la app suma la grasa de los alimentos confirmados y los ingredientes ocultos seleccionados. Después aplica la dosis prescrita en unidades de lipasa por gramo de grasa.","L’app additionne d’abord les lipides des aliments confirmés et des ingrédients cachés sélectionnés. Elle applique ensuite la dose prescrite en unités de lipase par gramme de graisse.","Zuerst summiert die App das Fett bestätigter Lebensmittel und ausgewählter versteckter Zutaten. Danach wendet sie die verordnete Dosis in Lipase-Einheiten pro Gramm Fett an.","Prima l’app somma i grassi degli alimenti confermati e degli ingredienti nascosti selezionati. Poi applica la dose prescritta in unità di lipasi per grammo di grassi."],
    ["Gordura dos alimentos + ingredientes ocultos","Food fat + hidden ingredients","Grasa de los alimentos + ingredientes ocultos","Lipides des aliments + ingrédients cachés","Fett der Lebensmittel + versteckte Zutaten","Grassi degli alimenti + ingredienti nascosti"],
    ["Lipase necessária","Required lipase","Lipasa necesaria","Lipase nécessaire","Benötigte Lipase","Lipasi necessaria"],
    ["Lipase por unidade do medicamento","Lipase per medication unit","Lipasa por unidad del medicamento","Lipase par unité de médicament","Lipase pro Medikamenteneinheit","Lipasi per unità di farmaco"],
    ["Unidades estimadas","Estimated units","Unidades estimadas","Unités estimées","Geschätzte Einheiten","Unità stimate"],
    ["A IA não participa dessas operações. Os parâmetros de tratamento devem ter sido informados conforme orientação profissional.","AI does not take part in these operations. Treatment parameters must be entered according to professional guidance.","La IA no participa en estas operaciones. Los parámetros de tratamiento deben introducirse según orientación profesional.","L’IA ne participe pas à ces opérations. Les paramètres de traitement doivent être saisis selon les recommandations d’un professionnel.","Die KI ist an diesen Vorgängen nicht beteiligt. Behandlungsparameter müssen nach fachlicher Anleitung eingegeben werden.","L’IA non partecipa a queste operazioni. I parametri di trattamento devono essere inseriti secondo le indicazioni di un professionista."]
  );
  phraseRows.push(
    ["A chave do Gemini permanece protegida no servidor.","The Gemini key remains protected on the server.","La clave de Gemini permanece protegida en el servidor.","La clé Gemini reste protégée sur le serveur.","Der Gemini-Schlüssel bleibt auf dem Server geschützt.","La chiave Gemini rimane protetta sul server."],
    ["Se o serviço estiver indisponível, exceder a cota ou não reconhecer a imagem, o app informa a falha e permite tentar novamente. Nenhum resultado preparado substitui a análise.","If the service is unavailable, exceeds its quota, or cannot recognize the image, the app reports the failure and allows another attempt. No prepared result replaces the analysis.","Si el servicio no está disponible, supera la cuota o no reconoce la imagen, la app informa del fallo y permite intentarlo de nuevo. Ningún resultado preparado sustituye el análisis.","Si le service est indisponible, dépasse son quota ou ne reconnaît pas l’image, l’app signale l’échec et permet de réessayer. Aucun résultat préparé ne remplace l’analyse.","Wenn der Dienst nicht verfügbar ist, das Kontingent überschritten wurde oder das Bild nicht erkennt, meldet die App den Fehler und erlaubt einen neuen Versuch. Kein vorbereitetes Ergebnis ersetzt die Analyse.","Se il servizio non è disponibile, supera la quota o non riconosce l’immagine, l’app segnala l’errore e permette di riprovare. Nessun risultato preparato sostituisce l’analisi."],
    ["Uso responsável e privacidade","Responsible use and privacy","Uso responsable y privacidad","Utilisation responsable et confidentialité","Verantwortliche Nutzung und Datenschutz","Uso responsabile e privacy"],
    ["A análise visual é destinada ao uso por um responsável adulto. O modo infantil altera apenas a apresentação e deve ser usado com supervisão.","Visual analysis is intended for use by a responsible adult. Child mode changes only the presentation and must be supervised.","El análisis visual está destinado al uso por un adulto responsable. El modo infantil solo cambia la presentación y debe usarse con supervisión.","L’analyse visuelle est destinée à un adulte responsable. Le mode enfant modifie uniquement la présentation et doit être supervisé.","Die Bildanalyse ist für eine verantwortliche erwachsene Person bestimmt. Der Kindermodus ändert nur die Darstellung und muss beaufsichtigt werden.","L’analisi visiva è destinata all’uso da parte di un adulto responsabile. La modalità bambino cambia solo la presentazione e deve essere supervisionata."],
    ["A foto é enviada ao Gemini para análise. No nível gratuito, o serviço está sujeito a cotas, e o conteúdo pode ser usado pelo Google para melhoria dos produtos e passar por revisão humana.","The photo is sent to Gemini for analysis. On the free tier, the service is subject to quotas, and content may be used by Google to improve products and may undergo human review.","La foto se envía a Gemini para su análisis. En el nivel gratuito, el servicio está sujeto a cuotas y Google puede usar el contenido para mejorar sus productos y someterlo a revisión humana.","La photo est envoyée à Gemini pour analyse. Au niveau gratuit, le service est soumis à des quotas et le contenu peut être utilisé par Google pour améliorer ses produits et faire l’objet d’un examen humain.","Das Foto wird zur Analyse an Gemini gesendet. In der kostenlosen Stufe gelten Kontingente; Inhalte können von Google zur Produktverbesserung verwendet und von Menschen geprüft werden.","La foto viene inviata a Gemini per l’analisi. Nel livello gratuito il servizio è soggetto a quote e Google può usare i contenuti per migliorare i prodotti e sottoporli a revisione umana."],
    ["A identificação visual e a estimativa de porções podem conter erros. Revise todos os alimentos, quantidades e ingredientes ocultos antes de continuar.","Visual identification and portion estimates may contain errors. Review all foods, amounts, and hidden ingredients before continuing.","La identificación visual y la estimación de porciones pueden contener errores. Revisa todos los alimentos, cantidades e ingredientes ocultos antes de continuar.","L’identification visuelle et l’estimation des portions peuvent comporter des erreurs. Vérifiez tous les aliments, quantités et ingrédients cachés avant de continuer.","Bilderkennung und Portionsschätzungen können Fehler enthalten. Prüfe alle Lebensmittel, Mengen und versteckten Zutaten, bevor du fortfährst.","L’identificazione visiva e la stima delle porzioni possono contenere errori. Controlla tutti gli alimenti, le quantità e gli ingredienti nascosti prima di continuare."],
    ["O PancreAI não é um dispositivo médico e não deve ser usado para alterar tratamento sem orientação profissional.","PancreAI is not a medical device and must not be used to change treatment without professional guidance.","PancreAI no es un dispositivo médico y no debe usarse para cambiar el tratamiento sin orientación profesional.","PancreAI n’est pas un dispositif médical et ne doit pas être utilisé pour modifier un traitement sans avis professionnel.","PancreAI ist kein Medizinprodukt und darf nicht verwendet werden, um eine Behandlung ohne fachliche Anleitung zu ändern.","PancreAI non è un dispositivo medico e non deve essere usato per modificare il trattamento senza indicazioni professionali."],
    ["Confira o rótulo e ajuste o alimento ou a porção manualmente, se necessário.","Check the label and adjust the food or portion manually if needed.","Revisa la etiqueta y ajusta manualmente el alimento o la porción si es necesario.","Vérifiez l’étiquette et ajustez manuellement l’aliment ou la portion si nécessaire.","Prüfe das Etikett und passe Lebensmittel oder Portion bei Bedarf manuell an.","Controlla l’etichetta e modifica manualmente l’alimento o la porzione se necessario."],
    ["O app não lê rótulos. Confira manualmente as informações nutricionais.","The app does not read labels. Check the nutrition information manually.","La app no lee etiquetas. Revisa manualmente la información nutricional.","L’app ne lit pas les étiquettes. Vérifiez manuellement les informations nutritionnelles.","Die App liest keine Etiketten. Prüfe die Nährwertangaben manuell.","L’app non legge le etichette. Controlla manualmente le informazioni nutrizionali."]
  );
  phraseRows.push(
    ["Resumo sobre esta versão","Summary of this version","Resumen de esta versión","Résumé de cette version","Zusammenfassung dieser Version","Riepilogo di questa versione"],
    ["Como o PancreAI funciona atualmente","How PancreAI currently works","Cómo funciona PancreAI actualmente","Fonctionnement actuel de PancreAI","So funktioniert PancreAI aktuell","Come funziona attualmente PancreAI"],
    ["Dados desta versão","Data for this version","Datos de esta versión","Données de cette version","Daten dieser Version","Dati di questa versione"],
    ["Gemini Flash via backend","Gemini Flash through the backend","Gemini Flash mediante el backend","Gemini Flash via le backend","Gemini Flash über das Backend","Gemini Flash tramite il backend"],
    ["Base nutricional local","Local nutrition database","Base nutricional local","Base nutritionnelle locale","Lokale Nährwertdatenbank","Database nutrizionale locale"],
    ["Etapas principais do aplicativo","Main app steps","Etapas principales de la app","Étapes principales de l’app","Wichtigste App-Schritte","Fasi principali dell’app"],
    ["Responsabilidades da IA e do aplicativo","Responsibilities of AI and the app","Responsabilidades de la IA y la app","Responsabilités de l’IA et de l’app","Aufgaben von KI und App","Responsabilità dell’IA e dell’app"],
    ["Responsabilidades separadas","Separate responsibilities","Responsabilidades separadas","Responsabilités séparées","Getrennte Aufgaben","Responsabilità separate"],
    ["Fontes de dados do PancreAI","PancreAI data sources","Fuentes de datos de PancreAI","Sources de données de PancreAI","Datenquellen von PancreAI","Fonti dati di PancreAI"],
    ["Fluxo atual do PancreAI","Current PancreAI flow","Flujo actual de PancreAI","Flux actuel de PancreAI","Aktueller PancreAI-Ablauf","Flusso attuale di PancreAI"],
    ["Fluxo atual","Current flow","Flujo actual","Flux actuel","Aktueller Ablauf","Flusso attuale"],
    ["Como a estimativa é calculada","How the estimate is calculated","Cómo se calcula la estimación","Comment l’estimation est calculée","So wird die Schätzung berechnet","Come viene calcolata la stima"],
    ["Limites e privacidade","Limits and privacy","Límites y privacidad","Limites et confidentialité","Grenzen und Datenschutz","Limiti e privacy"],
    ["Limites","Limits","Límites","Limites","Grenzen","Limiti"],
    ["Partes atuais do aplicativo","Current parts of the app","Partes actuales de la app","Composants actuels de l’app","Aktuelle App-Bestandteile","Parti attuali dell’app"],
    ["Fluxo funcional da análise","Functional analysis flow","Flujo funcional del análisis","Flux fonctionnel de l’analyse","Funktionaler Analyseablauf","Flusso funzionale dell’analisi"],
    ["Fluxo funcional","Functional flow","Flujo funcional","Flux fonctionnel","Funktionaler Ablauf","Flusso funzionale"],
    ["Foto real","Real photo","Foto real","Photo réelle","Echtes Foto","Foto reale"],
    ["Validação","Validation","Validación","Validation","Validierung","Convalida"],
    ["Limites desta versão","Limits of this version","Límites de esta versión","Limites de cette version","Grenzen dieser Version","Limiti di questa versione"],
    ["Voltar ao perfil","Back to profile","Volver al perfil","Retour au profil","Zurück zum Profil","Torna al profilo"],
    ["Câmera e galeria reais","Real camera and gallery","Cámara y galería reales","Appareil photo et galerie réels","Echte Kamera und Galerie","Fotocamera e galleria reali"],
    ["Captura, validação e compressão da foto","Photo capture, validation, and compression","Captura, validación y compresión de la foto","Capture, validation et compression de la photo","Aufnahme, Prüfung und Komprimierung des Fotos","Acquisizione, convalida e compressione della foto"],
    ["Análise visual","Visual analysis","Análisis visual","Analyse visuelle","Bildanalyse","Analisi visiva"],
    ["Foto enviada ao backend e analisada pelo Gemini Flash","Photo sent to the backend and analyzed by Gemini Flash","Foto enviada al backend y analizada por Gemini Flash","Photo envoyée au backend et analysée par Gemini Flash","Foto an das Backend gesendet und von Gemini Flash analysiert","Foto inviata al backend e analizzata da Gemini Flash"],
    ["Correspondência de alimentos","Food matching","Correspondencia de alimentos","Correspondance des aliments","Lebensmittelabgleich","Associazione degli alimenti"],
    ["Sugestões ligadas ao catálogo local sem aceitar nutrientes da IA","Suggestions linked to the local catalog without accepting AI nutrients","Sugerencias vinculadas al catálogo local sin aceptar nutrientes de la IA","Suggestions liées au catalogue local sans accepter les nutriments de l’IA","Vorschläge mit dem lokalen Katalog abgeglichen, ohne KI-Nährwerte zu übernehmen","Suggerimenti collegati al catalogo locale senza accettare nutrienti dall’IA"],
    ["Banco nutricional","Nutrition database","Base nutricional","Base nutritionnelle","Nährwertdatenbank","Database nutrizionale"],
    ["Fonte local dos valores por quantidade confirmada","Local source of values for the confirmed amount","Fuente local de valores para la cantidad confirmada","Source locale des valeurs pour la quantité confirmée","Lokale Wertequelle für die bestätigte Menge","Fonte locale dei valori per la quantità confermata"],
    ["Editar, remover, adicionar e confirmar","Edit, remove, add, and confirm","Editar, eliminar, agregar y confirmar","Modifier, supprimer, ajouter et confirmer","Bearbeiten, entfernen, hinzufügen und bestätigen","Modificare, rimuovere, aggiungere e confermare"],
    ["Motor de cálculo","Calculation engine","Motor de cálculo","Moteur de calcul","Berechnungsmodul","Motore di calcolo"],
    ["Gordura, lipase e unidades calculadas por regras locais","Fat, lipase, and units calculated by local rules","Grasa, lipasa y unidades calculadas mediante reglas locales","Lipides, lipase et unités calculés par des règles locales","Fett, Lipase und Einheiten nach lokalen Regeln berechnet","Grassi, lipasi e unità calcolati da regole locali"],
    ["Avisos antes do resultado","Warnings before the result","Avisos antes del resultado","Alertes avant le résultat","Hinweise vor dem Ergebnis","Avvisi prima del risultato"],
    ["Refeições confirmadas salvas no navegador","Confirmed meals saved in the browser","Comidas confirmadas guardadas en el navegador","Repas confirmés enregistrés dans le navigateur","Bestätigte Mahlzeiten im Browser gespeichert","Pasti confermati salvati nel browser"],
    ["Apresentação simplificada para uso supervisionado por responsável","Simplified presentation for supervised use by a responsible adult","Presentación simplificada para uso supervisado por un adulto responsable","Présentation simplifiée pour un usage supervisé par un adulte responsable","Vereinfachte Darstellung für die beaufsichtigte Nutzung durch eine erwachsene Person","Presentazione semplificata per l’uso supervisionato da un adulto responsabile"]
  );
  phraseRows.push(
    ["Banco nutricional local","Local nutrition database","Base nutricional local","Base nutritionnelle locale","Lokale Nährwertdatenbank","Database nutrizionale locale"]
  );
  phraseRows.push(
    ["Fechar","Close","Cerrar","Fermer","Schließen","Chiudi"],
    ["Navegação principal","Main navigation","Navegación principal","Navigation principale","Hauptnavigation","Navigazione principale"],
    ["Posicione o prato no centro","Position the plate in the center","Coloca el plato en el centro","Placez l’assiette au centre","Positioniere den Teller in der Mitte","Posiziona il piatto al centro"],
    ["Capturar foto","Capture photo","Capturar foto","Prendre la photo","Foto aufnehmen","Scatta foto"],
    ["Galeria","Gallery","Galería","Galerie","Galerie","Galleria"],
    ["Escolher foto","Choose photo","Elegir foto","Choisir une photo","Foto auswählen","Scegli foto"],
    ["Selecione uma imagem para analisar","Select an image to analyze","Selecciona una imagen para analizar","Sélectionnez une image à analyser","Wähle ein Bild zur Analyse aus","Seleziona un’immagine da analizzare"],
    ["Ver fotos anteriores","View previous photos","Ver fotos anteriores","Voir les photos précédentes","Vorherige Fotos anzeigen","Vedi foto precedenti"],
    ["Ver próximas fotos","View next photos","Ver fotos siguientes","Voir les photos suivantes","Nächste Fotos anzeigen","Vedi foto successive"],
    ["Páginas da galeria","Gallery pages","Páginas de la galería","Pages de la galerie","Galerieseiten","Pagine della galleria"],
    ["Prévia da foto","Photo preview","Vista previa de la foto","Aperçu de la photo","Fotovorschau","Anteprima foto"],
    ["Confira antes de analisar","Check before analyzing","Comprueba antes de analizar","Vérifiez avant l’analyse","Vor der Analyse prüfen","Controlla prima dell’analisi"],
    ["Foto da refeição escolhida","Photo of the selected meal","Foto de la comida seleccionada","Photo du repas sélectionné","Foto der ausgewählten Mahlzeit","Foto del pasto selezionato"],
    ["Usar foto","Use photo","Usar foto","Utiliser la photo","Foto verwenden","Usa foto"],
    ["Tentar novamente","Try again","Intentar de nuevo","Réessayer","Erneut versuchen","Riprova"],
    ["Analisando refeição","Analyzing meal","Analizando comida","Analyse du repas","Mahlzeit wird analysiert","Analisi del pasto"],
    ["Prévia da refeição","Meal preview","Vista previa de la comida","Aperçu du repas","Mahlzeitenvorschau","Anteprima del pasto"]
  );
  const keyTranslations = {};
  const phraseTranslations = {};

  languages.forEach((language) => {
    keyTranslations[language] = {};
    phraseTranslations[language] = {};
  });

  keyRows.forEach((row) => {
    languages.forEach((language, index) => {
      keyTranslations[language][row[0]] = row[index + 1];
    });
  });

  phraseRows.forEach((row) => {
    languages.forEach((language, index) => {
      phraseTranslations[language][normalizeText(row[0])] = row[index + 1];
    });
  });

  const externalPhraseTranslators = [];

  const originalText = new WeakMap();
  const originalAttributes = new WeakMap();
  const skippedTags = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "SVG", "PATH", "DEFS", "CLIPPATH", "META", "LINK"]);
  const originalT = api.t.bind(api);
  const originalSetLanguage = api.setCurrentLanguage.bind(api);
  const nativePrompt = window.prompt;
  let applying = false;
  let pendingRoots = new Set();
  let observer = null;
  let queued = false;

  function normalize(languageCode) {
    return api.normalizeLanguageCode(languageCode || api.getCurrentLanguage());
  }

  function normalizeText(text) {
    return String(text ?? "").trim().replace(/\s+/g, " ");
  }

  function interpolate(value, params = {}) {
    return Object.keys(params || {}).reduce((text, key) => {
      return text.replace(new RegExp(`\\{${key}\\}`, "g"), String(params[key]));
    }, value);
  }

  function preserveWhitespace(original, translated) {
    const start = String(original).match(/^\s*/)?.[0] || "";
    const end = String(original).match(/\s*$/)?.[0] || "";
    return `${start}${translated}${end}`;
  }

  api.t = function translateKey(key, params = {}, languageCode) {
    const lang = normalize(languageCode || api.getCurrentLanguage());
    const translated = lang !== api.FALLBACK_LANGUAGE ? keyTranslations[lang]?.[key] : null;
    if (translated) return interpolate(translated, params);
    const original = originalT(key, params, languageCode);
    if (original !== key) return original;
    return interpolate(keyTranslations.en[key] || key, params);
  };

  function translateDynamic(text, lang) {
    const words = {
      en: { capsule: "capsule", capsules: "capsules", unit: "unit", units: "units", fat: "fat", page: "Go to page", activate: "Enable", remove: "Remove", editQty: "Edit quantity of", qty: "Quantity of", grams: "in grams:" },
      es: { capsule: "cápsula", capsules: "cápsulas", unit: "unidad", units: "unidades", fat: "grasa", page: "Ir a página", activate: "Activar", remove: "Eliminar", editQty: "Editar cantidad de", qty: "Cantidad de", grams: "en gramos:" },
      fr: { capsule: "gélule", capsules: "gélules", unit: "unité", units: "unités", fat: "graisse", page: "Aller à la page", activate: "Activer", remove: "Supprimer", editQty: "Modifier la quantité de", qty: "Quantité de", grams: "en grammes :" },
      de: { capsule: "Kapsel", capsules: "Kapseln", unit: "Einheit", units: "Einheiten", fat: "Fett", page: "Gehe zu Seite", activate: "Aktivieren", remove: "Entfernen", editQty: "Menge bearbeiten für", qty: "Menge von", grams: "in Gramm:" },
      it: { capsule: "capsula", capsules: "capsule", unit: "unità", units: "unità", fat: "grassi", page: "Vai alla pagina", activate: "Attiva", remove: "Rimuovi", editQty: "Modifica quantità di", qty: "Quantità di", grams: "in grammi:" }
    }[lang];
    if (!words) return null;
    const childWords = {
      en: { quantity: "Amount:", approx: "approx.", howMuchFood: "How much {food} was there?", estimatedUnit: "estimated unit", estimatedUnits: "estimated units", fatOf: "fat" },
      es: { quantity: "Cantidad:", approx: "aprox.", howMuchFood: "¿Cuánto había de {food}?", estimatedUnit: "unidad estimada", estimatedUnits: "unidades estimadas", fatOf: "grasa" },
      fr: { quantity: "Quantité :", approx: "env.", howMuchFood: "Quelle quantité de {food} ?", estimatedUnit: "unité estimée", estimatedUnits: "unités estimées", fatOf: "graisse" },
      de: { quantity: "Menge:", approx: "ca.", howMuchFood: "Wie viel {food} war es?", estimatedUnit: "geschätzte Einheit", estimatedUnits: "geschätzte Einheiten", fatOf: "Fett" },
      it: { quantity: "Quantità:", approx: "circa", howMuchFood: "Quanto {food} c’era?", estimatedUnit: "unità stimata", estimatedUnits: "unità stimate", fatOf: "grassi" }
    }[lang];

    let childMatch = text.match(/^Quantidade:\s+(.+)$/i);
    if (childMatch && childWords) return `${childWords.quantity} ${translatePhrase(childMatch[1], lang)}`;

    childMatch = text.match(/^aprox\.\s+(\d+(?:[,.]\d+)?)\s*g$/i);
    if (childMatch && childWords) return `${childWords.approx} ${childMatch[1]} g`;

    childMatch = text.match(/^Quanto tinha de\s+(.+)\?$/i);
    if (childMatch && childWords) return childWords.howMuchFood.replace("{food}", translatePhrase(childMatch[1], lang));

    childMatch = text.match(/^(\d+(?:[,.]\d+)?)\s+unidades?\s+estimadas?$/i);
    if (childMatch && childWords) return `${childMatch[1]} ${Number(String(childMatch[1]).replace(",", ".")) === 1 ? childWords.estimatedUnit : childWords.estimatedUnits}`;

    childMatch = text.match(/^(\d+(?:[,.]\d+)?)g\s+de\s+gordura\s+•\s+(\d+)\s+unidades?$/i);
    if (childMatch && childWords) return `${childMatch[1]}g ${childWords.fatOf} • ${childMatch[2]} ${Number(childMatch[2]) === 1 ? childWords.estimatedUnit : childWords.estimatedUnits}`;

    let match = text.match(/^(\d+(?:[,.]\d+)?)\s+cápsulas?$/i);
    if (match) return `${match[1]} ${Number(String(match[1]).replace(",", ".")) === 1 ? words.capsule : words.capsules}`;

    match = text.match(/^(\d+(?:[,.]\d+)?)\s+unidades?$/i);
    if (match) return `${match[1]} ${Number(String(match[1]).replace(",", ".")) === 1 ? words.unit : words.units}`;

    match = text.match(/^(\d+(?:[,.]\d+)?)g\s+gordura\s*\/\s*100g$/i);
    if (match) return `${match[1]}g ${words.fat} / 100g`;

    match = text.match(/^Ir para página\s+(\d+)$/i);
    if (match) return `${words.page} ${match[1]}`;

    match = text.match(/^Ativar\s+(.+)$/i);
    if (match) return `${words.activate} ${translatePhrase(match[1], lang)}`;

    match = text.match(/^Remover\s+(.+)$/i);
    if (match) return `${words.remove} ${translatePhrase(match[1], lang)}`;

    match = text.match(/^Editar quantidade de\s+(.+)\s+em gramas:$/i);
    if (match) return `${words.editQty} ${translatePhrase(match[1], lang)} ${words.grams}`;

    match = text.match(/^Quantidade de\s+(.+)\s+em gramas:$/i);
    if (match) return `${words.qty} ${translatePhrase(match[1], lang)} ${words.grams}`;

    match = text.match(/^(.+):\s+(\d+)g para (\d+)g$/i);
    if (match) return `${translatePhrase(match[1], lang)}: ${match[2]}g → ${match[3]}g`;

    return null;
  }

  function translateExternalPhrase(original, key, lang) {
    for (const translator of externalPhraseTranslators) {
      try {
        const translated = translator(original, lang, key);
        if (translated) return translated;
      } catch (error) {
        console.warn("PancreAI translation extension failed", error);
      }
    }
    return null;
  }

  function translatePhrase(value, languageCode) {
    const lang = normalize(languageCode || api.getCurrentLanguage());
    if (lang === api.FALLBACK_LANGUAGE) return value;
    const original = String(value ?? "");
    const key = normalizeText(original);
    if (!key) return original;
    const external = translateExternalPhrase(original, key, lang);
    const translated = phraseTranslations[lang]?.[key] || phraseTranslations.en[key] || external || translateDynamic(key, lang);
    return translated ? preserveWhitespace(original, translated) : original;
  }

  function shouldSkipTextNode(node) {
    const parent = node.parentElement;
    if (!parent) return true;
    if (skippedTags.has(parent.tagName)) return true;
    return Boolean(parent.closest("[data-i18n-skip]"));
  }

  function translateTextNode(node) {
    if (shouldSkipTextNode(node)) return;
    if (!originalText.has(node)) originalText.set(node, node.nodeValue);
    const source = originalText.get(node);
    const translated = translatePhrase(source);
    if (node.nodeValue !== translated) node.nodeValue = translated;
  }

  function attributeStore(element) {
    let store = originalAttributes.get(element);
    if (!store) {
      store = {};
      originalAttributes.set(element, store);
    }
    return store;
  }

  function translateAttributes(element) {
    if (!element || skippedTags.has(element.tagName) || element.closest?.("[data-i18n-skip]")) return;
    const store = attributeStore(element);
    ["placeholder", "title", "aria-label", "alt"].forEach((attribute) => {
      if (!element.hasAttribute(attribute)) return;
      if (!Object.prototype.hasOwnProperty.call(store, attribute)) store[attribute] = element.getAttribute(attribute);
      element.setAttribute(attribute, translatePhrase(store[attribute]));
    });
  }

  function applyTranslations(root = document) {
    if (applying) return;
    applying = true;
    try {
      const target = root.nodeType === Node.ELEMENT_NODE || root.nodeType === Node.DOCUMENT_NODE ? root : document;
      if (target.nodeType === Node.ELEMENT_NODE) translateAttributes(target);
      const walker = document.createTreeWalker(target, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          if (shouldSkipTextNode(node)) return NodeFilter.FILTER_REJECT;
          return node.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
        }
      });
      let node = walker.nextNode();
      while (node) {
        translateTextNode(node);
        node = walker.nextNode();
      }
      target.querySelectorAll?.("[placeholder], [title], [aria-label], img[alt]").forEach(translateAttributes);
    } finally {
      applying = false;
    }
  }

  function toApplyRoot(node) {
    if (!node) return null;
    if (node.nodeType === Node.DOCUMENT_NODE) return document;
    if (node.nodeType === Node.TEXT_NODE) return node.parentElement || null;
    if (node.nodeType !== Node.ELEMENT_NODE) return null;
    if (skippedTags.has(node.tagName) || node.closest?.("[data-i18n-skip]")) return null;
    return node;
  }

  function compactRoots(roots) {
    const clean = roots.filter((root) => root === document || root.isConnected);
    if (clean.includes(document) || clean.length > 24) return [document];
    return clean.filter((root, index) => {
      return !clean.some((other, otherIndex) => {
        return otherIndex !== index && other !== document && other.contains?.(root);
      });
    });
  }

  function queueApply(root = document) {
    const target = toApplyRoot(root);
    if (target) pendingRoots.add(target);
    if (applying || queued) return;
    queued = true;
    window.setTimeout(() => {
      queued = false;
      const roots = compactRoots(Array.from(pendingRoots));
      pendingRoots = new Set();
      roots.forEach((pendingRoot) => applyTranslations(pendingRoot));
    }, 30);
  }

  function rememberMutationSources(mutations) {
    mutations.forEach((mutation) => {
      if (mutation.type === "characterData" && mutation.target?.nodeType === Node.TEXT_NODE) {
        originalText.set(mutation.target, mutation.target.nodeValue);
      }

      if (mutation.type === "attributes" && mutation.target) {
        const store = attributeStore(mutation.target);
        store[mutation.attributeName] = mutation.target.getAttribute(mutation.attributeName);
      }
    });
  }

  function startObserver() {
    if (observer || !document.body) return;
    observer = new MutationObserver((mutations) => {
      if (applying) return;
      rememberMutationSources(mutations);
      mutations.forEach((mutation) => {
        if (mutation.type === "characterData") {
          queueApply(mutation.target);
          return;
        }

        if (mutation.type === "attributes") {
          queueApply(mutation.target);
          return;
        }

        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => queueApply(node));
        }
      });
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["placeholder", "title", "aria-label", "alt"]
    });
  }

  api.setCurrentLanguage = function setCurrentLanguageAndTranslate(languageCode, countryCode) {
    const result = originalSetLanguage(languageCode, countryCode);
    applyTranslations(document);
    window.dispatchEvent(new CustomEvent("pancreai:languagechange", { detail: result }));
    return result;
  };

  api.translatePhrase = translatePhrase;
  api.registerPhraseTranslator = function registerPhraseTranslator(translator) {
    if (typeof translator !== "function" || externalPhraseTranslators.includes(translator)) return externalPhraseTranslators.length;
    externalPhraseTranslators.push(translator);
    applyTranslations(document);
    return externalPhraseTranslators.length;
  };
  api.apply = applyTranslations;
  api.__fullTranslationLayer = true;

  if (typeof nativePrompt === "function" && !window.__pancreaiTranslatedPrompt) {
    window.prompt = function translatedPrompt(message, defaultValue) {
      return nativePrompt.call(window, translatePhrase(message), defaultValue);
    };
    window.__pancreaiTranslatedPrompt = true;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      applyTranslations(document);
      startObserver();
    });
  } else {
    applyTranslations(document);
    startObserver();
  }
})();








