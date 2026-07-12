/* PancreAI localized food database layer. Keeps nutrition data in Portuguese IDs and localizes user-facing labels. */
(function () {
  const api = window.PancreAII18n;
  const LANGS = ["en", "es", "fr", "de", "it"];
  const FALLBACK = "pt-BR";
  const FOOD_ROWS = {
  "Abacate": [
    "Avocado",
    "Aguacate",
    "Avocat",
    "Avocado",
    "Avocado"
  ],
  "Abobrinha refogada": [
    "Sauteed zucchini",
    "Calabacín salteado",
    "Courgette sautée",
    "Gedünstete Zucchini",
    "Zucchine saltate"
  ],
  "Abóbora assada": [
    "Roasted pumpkin",
    "Calabaza asada",
    "Courge rôtie",
    "Gerösteter Kürbis",
    "Zucca arrostita"
  ],
  "Acai com banana": [
    "Acai with banana",
    "Açaí con plátano",
    "Açaï à la banane",
    "Acai mit Banane",
    "Acai con banana"
  ],
  "Acaraje": [
    "Acarajé",
    "Acarajé",
    "Acarajé",
    "Acarajé",
    "Acarajé"
  ],
  "Alface": [
    "Lettuce",
    "Lechuga",
    "Laitue",
    "Kopfsalat",
    "Lattuga"
  ],
  "Amendoim torrado": [
    "Roasted peanuts",
    "Cacahuetes tostados",
    "Cacahuètes grillées",
    "Geröstete Erdnüsse",
    "Arachidi tostate"
  ],
  "Arroz branco": [
    "White rice",
    "Arroz blanco",
    "Riz blanc",
    "Weißer Reis",
    "Riso bianco"
  ],
  "Arroz com legumes": [
    "Rice with vegetables",
    "Arroz con verduras",
    "Riz aux légumes",
    "Reis mit Gemüse",
    "Riso con verdure"
  ],
  "Arroz de carreteiro": [
    "Carreteiro rice",
    "Arroz carreteiro",
    "Riz carreteiro",
    "Carreteiro-Reis",
    "Riso carreteiro"
  ],
  "Arroz integral": [
    "Brown rice",
    "Arroz integral",
    "Riz complet",
    "Vollkornreis",
    "Riso integrale"
  ],
  "Aveia": [
    "Oats",
    "Avena",
    "Avoine",
    "Hafer",
    "Avena"
  ],
  "Azeite": [
    "Olive oil",
    "Aceite de oliva",
    "Huile d’olive",
    "Olivenöl",
    "Olio d’oliva"
  ],
  "Bacon": [
    "Bacon",
    "Bacon",
    "Bacon",
    "Bacon",
    "Bacon"
  ],
  "Banana": [
    "Banana",
    "Plátano",
    "Banane",
    "Banane",
    "Banana"
  ],
  "Banana com canela": [
    "Banana with cinnamon",
    "Plátano con canela",
    "Banane à la cannelle",
    "Banane mit Zimt",
    "Banana con cannella"
  ],
  "Barra de cereal": [
    "Cereal bar",
    "Barra de cereal",
    "Barre de céréales",
    "Müsliriegel",
    "Barretta ai cereali"
  ],
  "Batata frita": [
    "French fries",
    "Patatas fritas",
    "Frites",
    "Pommes frites",
    "Patatine fritte"
  ],
  "Batata palha": [
    "Shoestring potatoes",
    "Patata paja",
    "Pommes paille",
    "Kartoffelsticks",
    "Patatine a fiammifero"
  ],
  "Berinjela assada": [
    "Roasted eggplant",
    "Berenjena asada",
    "Aubergine rôtie",
    "Geröstete Aubergine",
    "Melanzana arrostita"
  ],
  "Beterraba cozida": [
    "Cooked beetroot",
    "Remolacha cocida",
    "Betterave cuite",
    "Gekochte Rote Bete",
    "Barbabietola cotta"
  ],
  "Bife grelhado": [
    "Grilled steak",
    "Filete a la plancha",
    "Steak grillé",
    "Gegrilltes Steak",
    "Bistecca grigliata"
  ],
  "Bobó de camarão": [
    "Shrimp bobó",
    "Bobó de camarón",
    "Bobó de crevettes",
    "Garnelen-Bobó",
    "Bobó di gamberi"
  ],
  "Bolo simples": [
    "Plain cake",
    "Bizcocho simple",
    "Gâteau simple",
    "Einfacher Kuchen",
    "Torta semplice"
  ],
  "Brigadeiro": [
    "Brigadeiro",
    "Brigadeiro",
    "Brigadeiro",
    "Brigadeiro",
    "Brigadeiro"
  ],
  "Brócolis cozido": [
    "Cooked broccoli",
    "Brócoli cocido",
    "Brocoli cuit",
    "Gekochter Brokkoli",
    "Broccoli cotti"
  ],
  "Burrito de frango": [
    "Chicken burrito",
    "Burrito de pollo",
    "Burrito au poulet",
    "Hähnchen-Burrito",
    "Burrito di pollo"
  ],
  "Café com leite": [
    "Coffee with milk",
    "Café con leche",
    "Café au lait",
    "Milchkaffee",
    "Caffè latte"
  ],
  "Café preto": [
    "Black coffee",
    "Café solo",
    "Café noir",
    "Schwarzer Kaffee",
    "Caffè nero"
  ],
  "Calabresa acebolada": [
    "Calabresa sausage with onions",
    "Calabresa encebollada",
    "Saucisse calabresa aux oignons",
    "Calabresa mit Zwiebeln",
    "Calabresa con cipolle"
  ],
  "Caldo verde": [
    "Kale soup",
    "Caldo verde",
    "Caldo verde",
    "Caldo verde",
    "Caldo verde"
  ],
  "Camarao grelhado": [
    "Grilled shrimp",
    "Camarón a la plancha",
    "Crevettes grillées",
    "Gegrillte Garnelen",
    "Gamberi grigliati"
  ],
  "Canjica": [
    "Sweet corn pudding",
    "Canjica",
    "Canjica",
    "Canjica",
    "Canjica"
  ],
  "Carne assada": [
    "Roast beef",
    "Carne asada",
    "Viande rôtie",
    "Rinderbraten",
    "Carne arrosto"
  ],
  "Carne de panela": [
    "Pot roast",
    "Carne guisada",
    "Bœuf mijoté",
    "Schmorbraten",
    "Spezzatino di manzo"
  ],
  "Carne seca desfiada": [
    "Shredded dried beef",
    "Carne seca deshebrada",
    "Viande séchée effilochée",
    "Gezupftes Trockenfleisch",
    "Carne secca sfilacciata"
  ],
  "Castanha-do-pará": [
    "Brazil nut",
    "Nuez de Brasil",
    "Noix du Brésil",
    "Paranuss",
    "Noce del Brasile"
  ],
  "Cenoura ralada": [
    "Grated carrot",
    "Zanahoria rallada",
    "Carotte râpée",
    "Geriebene Karotte",
    "Carota grattugiata"
  ],
  "Chia": [
    "Chia",
    "Chía",
    "Chia",
    "Chia",
    "Chia"
  ],
  "Chili com carne": [
    "Chili con carne",
    "Chili con carne",
    "Chili con carne",
    "Chili con Carne",
    "Chili con carne"
  ],
  "Costela bovina assada": [
    "Roasted beef ribs",
    "Costilla de res asada",
    "Côtes de bœuf rôties",
    "Geröstete Rinderrippen",
    "Costine di manzo arrosto"
  ],
  "Couve refogada": [
    "Sauteed collard greens",
    "Col salteada",
    "Chou vert sauté",
    "Gedünsteter Grünkohl",
    "Cavolo saltato"
  ],
  "Coxa de frango assada": [
    "Roasted chicken thigh",
    "Muslo de pollo asado",
    "Cuisse de poulet rôtie",
    "Gebratene Hähnchenkeule",
    "Coscia di pollo arrosto"
  ],
  "Coxinha": [
    "Coxinha",
    "Coxinha",
    "Coxinha",
    "Coxinha",
    "Coxinha"
  ],
  "Creme de abóbora": [
    "Pumpkin cream soup",
    "Crema de calabaza",
    "Velouté de courge",
    "Kürbiscremesuppe",
    "Crema di zucca"
  ],
  "Cuscuz nordestino": [
    "Brazilian corn couscous",
    "Cuscús brasileño de maíz",
    "Couscous brésilien de maïs",
    "Brasilianischer Mais-Couscous",
    "Couscous brasiliano di mais"
  ],
  "Empada de frango": [
    "Chicken empada",
    "Empada de pollo",
    "Empada au poulet",
    "Hähnchen-Empada",
    "Empada di pollo"
  ],
  "Ervilha": [
    "Peas",
    "Guisantes",
    "Petits pois",
    "Erbsen",
    "Piselli"
  ],
  "Escondidinho de carne seca": [
    "Dried beef escondidinho",
    "Escondidinho de carne seca",
    "Escondidinho à la viande séchée",
    "Escondidinho mit Trockenfleisch",
    "Escondidinho di carne secca"
  ],
  "Esfiha de carne": [
    "Meat esfiha",
    "Esfiha de carne",
    "Esfiha à la viande",
    "Fleisch-Esfiha",
    "Esfiha di carne"
  ],
  "Esfiha de queijo": [
    "Cheese esfiha",
    "Esfiha de queso",
    "Esfiha au fromage",
    "Käse-Esfiha",
    "Esfiha al formaggio"
  ],
  "Falafel assado": [
    "Baked falafel",
    "Falafel al horno",
    "Falafel au four",
    "Gebackener Falafel",
    "Falafel al forno"
  ],
  "Farofa temperada": [
    "Seasoned farofa",
    "Farofa condimentada",
    "Farofa assaisonnée",
    "Gewürzte Farofa",
    "Farofa condita"
  ],
  "Feijoada": [
    "Feijoada",
    "Feijoada",
    "Feijoada",
    "Feijoada",
    "Feijoada"
  ],
  "Feijão carioca": [
    "Carioca beans",
    "Frijoles carioca",
    "Haricots carioca",
    "Carioca-Bohnen",
    "Fagioli carioca"
  ],
  "Feijão fradinho": [
    "Black-eyed peas",
    "Frijoles carita",
    "Haricots cornille",
    "Augenbohnen",
    "Fagioli dall’occhio"
  ],
  "Feijão preto": [
    "Black beans",
    "Frijoles negros",
    "Haricots noirs",
    "Schwarze Bohnen",
    "Fagioli neri"
  ],
  "Filé de frango empanado": [
    "Breaded chicken fillet",
    "Filete de pollo empanado",
    "Filet de poulet pané",
    "Paniertes Hähnchenfilet",
    "Filetto di pollo impanato"
  ],
  "Filé de peixe empanado": [
    "Breaded fish fillet",
    "Filete de pescado empanado",
    "Filet de poisson pané",
    "Paniertes Fischfilet",
    "Filetto di pesce impanato"
  ],
  "Filé de pescada": [
    "Hake fillet",
    "Filete de merluza",
    "Filet de merlu",
    "Seehechtfilet",
    "Filetto di nasello"
  ],
  "Frango desfiado": [
    "Shredded chicken",
    "Pollo deshebrado",
    "Poulet effiloché",
    "Gezupftes Hähnchen",
    "Pollo sfilacciato"
  ],
  "Frango desfiado temperado": [
    "Seasoned shredded chicken",
    "Pollo deshebrado sazonado",
    "Poulet effiloché assaisonné",
    "Gewürztes gezupftes Hähnchen",
    "Pollo sfilacciato condito"
  ],
  "Galinhada": [
    "Brazilian chicken rice",
    "Arroz brasileño con pollo",
    "Riz brésilien au poulet",
    "Brasilianischer Hähnchenreis",
    "Riso brasiliano con pollo"
  ],
  "Granola": [
    "Granola",
    "Granola",
    "Granola",
    "Granola",
    "Granola"
  ],
  "Grao-de-bico cozido": [
    "Cooked chickpeas",
    "Garbanzos cocidos",
    "Pois chiches cuits",
    "Gekochte Kichererbsen",
    "Ceci cotti"
  ],
  "Guacamole": [
    "Guacamole",
    "Guacamole",
    "Guacamole",
    "Guacamole",
    "Guacamole"
  ],
  "Guioza grelhado": [
    "Grilled gyoza",
    "Gyoza a la plancha",
    "Gyoza grillé",
    "Gegrillte Gyoza",
    "Gyoza alla griglia"
  ],
  "Hambúrguer bovino": [
    "Beef burger patty",
    "Hamburguesa de res",
    "Steak haché de bœuf",
    "Rindfleisch-Burgerpatty",
    "Hamburger di manzo"
  ],
  "Hambúrguer de frango": [
    "Chicken burger",
    "Hamburguesa de pollo",
    "Burger au poulet",
    "Hähnchenburger",
    "Hamburger di pollo"
  ],
  "Hambúrguer de grão-de-bico": [
    "Chickpea burger",
    "Hamburguesa de garbanzos",
    "Burger aux pois chiches",
    "Kichererbsenburger",
    "Hamburger di ceci"
  ],
  "Hambúrguer de lentilha": [
    "Lentil burger",
    "Hamburguesa de lentejas",
    "Burger aux lentilles",
    "Linsenburger",
    "Hamburger di lenticchie"
  ],
  "Homus": [
    "Hummus",
    "Hummus",
    "Houmous",
    "Hummus",
    "Hummus"
  ],
  "Iogurte grego": [
    "Greek yogurt",
    "Yogur griego",
    "Yaourt grec",
    "Griechischer Joghurt",
    "Yogurt greco"
  ],
  "Iogurte natural": [
    "Plain yogurt",
    "Yogur natural",
    "Yaourt nature",
    "Naturjoghurt",
    "Yogurt naturale"
  ],
  "Kafta grelhada": [
    "Grilled kafta",
    "Kafta a la plancha",
    "Kafta grillée",
    "Gegrillte Kafta",
    "Kafta grigliata"
  ],
  "Lasanha de frango": [
    "Chicken lasagna",
    "Lasaña de pollo",
    "Lasagnes au poulet",
    "Hähnchenlasagne",
    "Lasagna di pollo"
  ],
  "Lasanha à bolonhesa": [
    "Bolognese lasagna",
    "Lasaña boloñesa",
    "Lasagnes à la bolognaise",
    "Lasagne Bolognese",
    "Lasagna alla bolognese"
  ],
  "Legumes grelhados": [
    "Grilled vegetables",
    "Verduras a la plancha",
    "Légumes grillés",
    "Gegrilltes Gemüse",
    "Verdure grigliate"
  ],
  "Leite condensado": [
    "Condensed milk",
    "Leche condensada",
    "Lait concentré",
    "Kondensmilch",
    "Latte condensato"
  ],
  "Leite em po": [
    "Powdered milk",
    "Leche en polvo",
    "Lait en poudre",
    "Milchpulver",
    "Latte in polvere"
  ],
  "Lentilha cozida": [
    "Cooked lentils",
    "Lentejas cocidas",
    "Lentilles cuites",
    "Gekochte Linsen",
    "Lenticchie cotte"
  ],
  "Linguiça acebolada": [
    "Sausage with onions",
    "Longaniza encebollada",
    "Saucisse aux oignons",
    "Wurst mit Zwiebeln",
    "Salsiccia con cipolle"
  ],
  "Lombo suíno assado": [
    "Roasted pork loin",
    "Lomo de cerdo asado",
    "Longe de porc rôtie",
    "Gebratener Schweinerücken",
    "Lonza di maiale arrosto"
  ],
  "Macarrão alho e óleo": [
    "Garlic and oil pasta",
    "Pasta con ajo y aceite",
    "Pâtes à l’ail et à l’huile",
    "Pasta mit Knoblauch und Öl",
    "Pasta aglio e olio"
  ],
  "Macarrão ao sugo": [
    "Pasta with tomato sauce",
    "Pasta con salsa de tomate",
    "Pâtes à la sauce tomate",
    "Pasta mit Tomatensauce",
    "Pasta al sugo"
  ],
  "Macarrão com molho suave": [
    "Pasta with mild sauce",
    "Pasta con salsa suave",
    "Pâtes à la sauce douce",
    "Pasta mit milder Sauce",
    "Pasta con salsa delicata"
  ],
  "Macarrão à bolonhesa": [
    "Bolognese pasta",
    "Pasta boloñesa",
    "Pâtes à la bolognaise",
    "Pasta Bolognese",
    "Pasta alla bolognese"
  ],
  "Mamão": [
    "Papaya",
    "Papaya",
    "Papaye",
    "Papaya",
    "Papaya"
  ],
  "Mandioca cozida": [
    "Boiled cassava",
    "Yuca cocida",
    "Manioc bouilli",
    "Gekochte Maniok",
    "Manioca bollita"
  ],
  "Manteiga": [
    "Butter",
    "Mantequilla",
    "Beurre",
    "Butter",
    "Burro"
  ],
  "Maçã": [
    "Apple",
    "Manzana",
    "Pomme",
    "Apfel",
    "Mela"
  ],
  "Mel": [
    "Honey",
    "Miel",
    "Miel",
    "Honig",
    "Miele"
  ],
  "Milho": [
    "Corn",
    "Maíz",
    "Maïs",
    "Mais",
    "Mais"
  ],
  "Mini hambúrguer": [
    "Mini burger",
    "Mini hamburguesa",
    "Mini burger",
    "Mini-Burger",
    "Mini hamburger"
  ],
  "Mini pizza de mussarela": [
    "Mini mozzarella pizza",
    "Mini pizza de mozzarella",
    "Mini pizza à la mozzarella",
    "Mini-Mozzarella-Pizza",
    "Mini pizza alla mozzarella"
  ],
  "Molho de iogurte": [
    "Yogurt sauce",
    "Salsa de yogur",
    "Sauce au yaourt",
    "Joghurtsauce",
    "Salsa allo yogurt"
  ],
  "Molho de tomate": [
    "Tomato sauce",
    "Salsa de tomate",
    "Sauce tomate",
    "Tomatensauce",
    "Salsa di pomodoro"
  ],
  "Molho pesto": [
    "Pesto sauce",
    "Salsa pesto",
    "Sauce pesto",
    "Pestosauce",
    "Salsa pesto"
  ],
  "Moqueca baiana": [
    "Bahian moqueca",
    "Moqueca bahiana",
    "Moqueca bahianaise",
    "Moqueca nach Bahia-Art",
    "Moqueca baiana"
  ],
  "Moqueca capixaba": [
    "Capixaba moqueca",
    "Moqueca capixaba",
    "Moqueca capixaba",
    "Moqueca capixaba",
    "Moqueca capixaba"
  ],
  "Morango": [
    "Strawberry",
    "Fresa",
    "Fraise",
    "Erdbeere",
    "Fragola"
  ],
  "Mousse de chocolate": [
    "Chocolate mousse",
    "Mousse de chocolate",
    "Mousse au chocolat",
    "Schokoladenmousse",
    "Mousse al cioccolato"
  ],
  "Nhoque ao sugo": [
    "Gnocchi with tomato sauce",
    "Ñoquis con salsa de tomate",
    "Gnocchis à la sauce tomate",
    "Gnocchi mit Tomatensauce",
    "Gnocchi al sugo"
  ],
  "Nuggets de frango": [
    "Chicken nuggets",
    "Nuggets de pollo",
    "Nuggets de poulet",
    "Chicken Nuggets",
    "Nuggets di pollo"
  ],
  "Omelete de queijo": [
    "Cheese omelet",
    "Tortilla de queso",
    "Omelette au fromage",
    "Käseomelett",
    "Omelette al formaggio"
  ],
  "Ovo cozido": [
    "Boiled egg",
    "Huevo cocido",
    "Œuf dur",
    "Gekochtes Ei",
    "Uovo sodo"
  ],
  "Ovo frito": [
    "Fried egg",
    "Huevo frito",
    "Œuf au plat",
    "Spiegelei",
    "Uovo fritto"
  ],
  "Ovos mexidos": [
    "Scrambled eggs",
    "Huevos revueltos",
    "Œufs brouillés",
    "Rührei",
    "Uova strapazzate"
  ],
  "Pamonha": [
    "Sweet corn pamonha",
    "Pamonha dulce",
    "Pamonha sucrée",
    "Süße Pamonha",
    "Pamonha dolce"
  ],
  "Panqueca americana": [
    "American pancake",
    "Panqueque americano",
    "Pancake américain",
    "Amerikanischer Pancake",
    "Pancake americano"
  ],
  "Panqueca de carne": [
    "Beef pancake",
    "Panqueque de carne",
    "Crêpe farcie à la viande",
    "Pfannkuchen mit Fleisch",
    "Crespella di carne"
  ],
  "Panqueca de frango": [
    "Chicken pancake",
    "Panqueque de pollo",
    "Crêpe farcie au poulet",
    "Pfannkuchen mit Hähnchen",
    "Crespella di pollo"
  ],
  "Pasta de amendoim": [
    "Peanut butter",
    "Crema de cacahuete",
    "Beurre de cacahuète",
    "Erdnussbutter",
    "Burro di arachidi"
  ],
  "Pastel de carne": [
    "Meat pastel",
    "Pastel de carne",
    "Pastel à la viande",
    "Fleisch-Pastel",
    "Pastel di carne"
  ],
  "Pastel de queijo": [
    "Cheese pastel",
    "Pastel de queso",
    "Pastel au fromage",
    "Käse-Pastel",
    "Pastel al formaggio"
  ],
  "Patinho moído": [
    "Ground lean beef",
    "Carne magra molida",
    "Bœuf maigre haché",
    "Mageres Rinderhack",
    "Manzo magro macinato"
  ],
  "Paçoca": [
    "Peanut candy",
    "Dulce de cacahuete",
    "Confiserie d’arachide",
    "Erdnusskonfekt",
    "Dolce di arachidi"
  ],
  "Peito de frango grelhado": [
    "Grilled chicken breast",
    "Pechuga de pollo a la plancha",
    "Blanc de poulet grillé",
    "Gegrillte Hähnchenbrust",
    "Petto di pollo grigliato"
  ],
  "Peito de peru": [
    "Turkey breast",
    "Pechuga de pavo",
    "Blanc de dinde",
    "Putenbrust",
    "Petto di tacchino"
  ],
  "Pepino": [
    "Cucumber",
    "Pepino",
    "Concombre",
    "Gurke",
    "Cetriolo"
  ],
  "Pernil assado": [
    "Roasted pork shoulder",
    "Pernil asado",
    "Jambon de porc rôti",
    "Gebratene Schweineschulter",
    "Pernil arrosto"
  ],
  "Picadinho de carne": [
    "Diced beef stew",
    "Picadillo de carne",
    "Bœuf en petits morceaux",
    "Rindergulasch",
    "Spezzatino di manzo"
  ],
  "Picanha grelhada": [
    "Grilled picanha",
    "Picanha a la plancha",
    "Picanha grillée",
    "Gegrillte Picanha",
    "Picanha grigliata"
  ],
  "Pirao": [
    "Pirão",
    "Pirão",
    "Pirão",
    "Pirão",
    "Pirão"
  ],
  "Pizza de calabresa": [
    "Calabresa sausage pizza",
    "Pizza de calabresa",
    "Pizza à la calabresa",
    "Calabresa-Pizza",
    "Pizza alla calabresa"
  ],
  "Pizza de frango com catupiry": [
    "Chicken and Catupiry pizza",
    "Pizza de pollo con Catupiry",
    "Pizza poulet et Catupiry",
    "Pizza mit Hähnchen und Catupiry",
    "Pizza pollo e Catupiry"
  ],
  "Pizza de mussarela": [
    "Mozzarella pizza",
    "Pizza de mozzarella",
    "Pizza à la mozzarella",
    "Mozzarella-Pizza",
    "Pizza alla mozzarella"
  ],
  "Pizza margherita": [
    "Margherita pizza",
    "Pizza margarita",
    "Pizza margherita",
    "Pizza Margherita",
    "Pizza margherita"
  ],
  "Pizza portuguesa": [
    "Portuguese pizza",
    "Pizza portuguesa",
    "Pizza portugaise",
    "Portugiesische Pizza",
    "Pizza portoghese"
  ],
  "Polenta frita": [
    "Fried polenta",
    "Polenta frita",
    "Polenta frite",
    "Frittierte Polenta",
    "Polenta fritta"
  ],
  "Presunto": [
    "Ham",
    "Jamón",
    "Jambon",
    "Schinken",
    "Prosciutto cotto"
  ],
  "Pudim de leite": [
    "Caramel flan",
    "Flan de leche",
    "Flan au lait",
    "Milchpudding",
    "Budino al latte"
  ],
  "Purê de batata": [
    "Mashed potatoes",
    "Puré de patata",
    "Purée de pommes de terre",
    "Kartoffelpüree",
    "Purè di patate"
  ],
  "Pão de forma": [
    "Sliced bread",
    "Pan de molde",
    "Pain de mie",
    "Toastbrot",
    "Pane in cassetta"
  ],
  "Pão de hambúrguer": [
    "Burger bun",
    "Pan de hamburguesa",
    "Pain à burger",
    "Burgerbrötchen",
    "Panino per hamburger"
  ],
  "Pão francês": [
    "French roll",
    "Pan francés",
    "Petit pain français",
    "Französisches Brötchen",
    "Panino francese"
  ],
  "Pão integral": [
    "Whole wheat bread",
    "Pan integral",
    "Pain complet",
    "Vollkornbrot",
    "Pane integrale"
  ],
  "Queijo cheddar": [
    "Cheddar cheese",
    "Queso cheddar",
    "Cheddar",
    "Cheddar",
    "Formaggio cheddar"
  ],
  "Queijo coalho": [
    "Coalho cheese",
    "Queso coalho",
    "Fromage coalho",
    "Coalho-Käse",
    "Formaggio coalho"
  ],
  "Queijo minas": [
    "Minas cheese",
    "Queso Minas",
    "Fromage Minas",
    "Minas-Käse",
    "Formaggio Minas"
  ],
  "Queijo ralado": [
    "Grated cheese",
    "Queso rallado",
    "Fromage râpé",
    "Geriebener Käse",
    "Formaggio grattugiato"
  ],
  "Quesadilla de queijo": [
    "Cheese quesadilla",
    "Quesadilla de queso",
    "Quesadilla au fromage",
    "Käse-Quesadilla",
    "Quesadilla al formaggio"
  ],
  "Quiabo refogado": [
    "Sauteed okra",
    "Okra salteada",
    "Gombo sauté",
    "Gedünstete Okra",
    "Okra saltata"
  ],
  "Quibe assado": [
    "Baked kibbeh",
    "Kibbeh al horno",
    "Kibbeh au four",
    "Gebackener Kibbeh",
    "Kibbeh al forno"
  ],
  "Quibe frito": [
    "Fried kibbeh",
    "Kibbeh frito",
    "Kibbeh frit",
    "Frittierter Kibbeh",
    "Kibbeh fritto"
  ],
  "Quinoa cozida": [
    "Cooked quinoa",
    "Quinoa cocida",
    "Quinoa cuite",
    "Gekochte Quinoa",
    "Quinoa cotta"
  ],
  "Refrigerante cola": [
    "Cola soda",
    "Refresco de cola",
    "Soda cola",
    "Cola-Limonade",
    "Bibita alla cola"
  ],
  "Requeijão": [
    "Cream cheese spread",
    "Queso crema para untar",
    "Fromage frais à tartiner",
    "Frischkäsecreme",
    "Formaggio spalmabile"
  ],
  "Risoto de frango": [
    "Chicken risotto",
    "Risotto de pollo",
    "Risotto au poulet",
    "Hähnchenrisotto",
    "Risotto di pollo"
  ],
  "Risoto de legumes": [
    "Vegetable risotto",
    "Risotto de verduras",
    "Risotto aux légumes",
    "Gemüserisotto",
    "Risotto alle verdure"
  ],
  "Salada de folhas com manga": [
    "Leafy salad with mango",
    "Ensalada de hojas con mango",
    "Salade de feuilles à la mangue",
    "Blattsalat mit Mango",
    "Insalata di foglie con mango"
  ],
  "Salada de quinoa": [
    "Quinoa salad",
    "Ensalada de quinoa",
    "Salade de quinoa",
    "Quinoasalat",
    "Insalata di quinoa"
  ],
  "Salada de tomate": [
    "Tomato salad",
    "Ensalada de tomate",
    "Salade de tomates",
    "Tomatensalat",
    "Insalata di pomodoro"
  ],
  "Salada verde": [
    "Green salad",
    "Ensalada verde",
    "Salade verte",
    "Grüner Salat",
    "Insalata verde"
  ],
  "Salmão grelhado": [
    "Grilled salmon",
    "Salmón a la plancha",
    "Saumon grillé",
    "Gegrillter Lachs",
    "Salmone grigliato"
  ],
  "Salsicha": [
    "Hot dog sausage",
    "Salchicha",
    "Saucisse",
    "Würstchen",
    "Wurstel"
  ],
  "Sanduiche natural de atum": [
    "Tuna sandwich",
    "Sándwich natural de atún",
    "Sandwich au thon",
    "Thunfischsandwich",
    "Tramezzino al tonno"
  ],
  "Sanduiche natural de frango": [
    "Chicken sandwich",
    "Sándwich natural de pollo",
    "Sandwich au poulet",
    "Hähnchensandwich",
    "Tramezzino al pollo"
  ],
  "Sardinha grelhada": [
    "Grilled sardines",
    "Sardina a la plancha",
    "Sardines grillées",
    "Gegrillte Sardinen",
    "Sardine grigliate"
  ],
  "Sashimi de salmão": [
    "Salmon sashimi",
    "Sashimi de salmón",
    "Sashimi de saumon",
    "Lachs-Sashimi",
    "Sashimi di salmone"
  ],
  "Shimeji na manteiga": [
    "Shimeji mushrooms in butter",
    "Shimeji con mantequilla",
    "Shimeji au beurre",
    "Shimeji in Butter",
    "Shimeji al burro"
  ],
  "Sopa de legumes": [
    "Vegetable soup",
    "Sopa de verduras",
    "Soupe de légumes",
    "Gemüsesuppe",
    "Zuppa di verdure"
  ],
  "Strogonoff de carne": [
    "Beef stroganoff",
    "Stroganoff de carne",
    "Stroganoff de bœuf",
    "Rindergeschnetzeltes Stroganoff",
    "Stroganoff di manzo"
  ],
  "Strogonoff de frango": [
    "Chicken stroganoff",
    "Stroganoff de pollo",
    "Stroganoff de poulet",
    "Hähnchen-Stroganoff",
    "Stroganoff di pollo"
  ],
  "Suco de caixinha": [
    "Boxed juice",
    "Zumo en caja",
    "Jus en brique",
    "Saft aus der Packung",
    "Succo in brick"
  ],
  "Suco de laranja": [
    "Orange juice",
    "Zumo de naranja",
    "Jus d’orange",
    "Orangensaft",
    "Succo d’arancia"
  ],
  "Suco de uva": [
    "Grape juice",
    "Zumo de uva",
    "Jus de raisin",
    "Traubensaft",
    "Succo d’uva"
  ],
  "Suco verde": [
    "Green juice",
    "Zumo verde",
    "Jus vert",
    "Grüner Saft",
    "Succo verde"
  ],
  "Sushi combinado": [
    "Sushi combo",
    "Combinado de sushi",
    "Assortiment de sushi",
    "Sushi-Kombination",
    "Sushi misto"
  ],
  "Tabule": [
    "Tabbouleh",
    "Tabulé",
    "Taboulé",
    "Taboulé",
    "Tabbouleh"
  ],
  "Taco de carne": [
    "Beef taco",
    "Taco de carne",
    "Taco au bœuf",
    "Rindfleisch-Taco",
    "Taco di carne"
  ],
  "Tapioca": [
    "Tapioca",
    "Tapioca",
    "Tapioca",
    "Tapioka",
    "Tapioca"
  ],
  "Temaki de salmão": [
    "Salmon temaki",
    "Temaki de salmón",
    "Temaki de saumon",
    "Lachs-Temaki",
    "Temaki di salmone"
  ],
  "Tilápia grelhada": [
    "Grilled tilapia",
    "Tilapia a la plancha",
    "Tilapia grillé",
    "Gegrillte Tilapia",
    "Tilapia grigliata"
  ],
  "Tofu grelhado": [
    "Grilled tofu",
    "Tofu a la plancha",
    "Tofu grillé",
    "Gegrillter Tofu",
    "Tofu grigliato"
  ],
  "Tofu mexido": [
    "Scrambled tofu",
    "Tofu revuelto",
    "Tofu brouillé",
    "Rührtofu",
    "Tofu strapazzato"
  ],
  "Tomate": [
    "Tomato",
    "Tomate",
    "Tomate",
    "Tomate",
    "Pomodoro"
  ],
  "Torresmo": [
    "Pork cracklings",
    "Torreznos",
    "Grattons de porc",
    "Schweinekrusten",
    "Ciccioli"
  ],
  "Vatapa": [
    "Vatapá",
    "Vatapá",
    "Vatapá",
    "Vatapá",
    "Vatapá"
  ],
  "Vinagrete": [
    "Vinaigrette",
    "Vinagreta",
    "Vinaigrette",
    "Vinaigrette",
    "Vinaigrette"
  ],
  "Waffle": [
    "Waffle",
    "Gofre",
    "Gaufre",
    "Waffel",
    "Waffle"
  ],
  "Wrap integral de frango": [
    "Whole wheat chicken wrap",
    "Wrap integral de pollo",
    "Wrap complet au poulet",
    "Vollkorn-Wrap mit Hähnchen",
    "Wrap integrale di pollo"
  ],
  "Wrap integral de legumes": [
    "Whole wheat vegetable wrap",
    "Wrap integral de verduras",
    "Wrap complet aux légumes",
    "Vollkorn-Wrap mit Gemüse",
    "Wrap integrale alle verdure"
  ],
  "Yakisoba de carne": [
    "Beef yakisoba",
    "Yakisoba de carne",
    "Yakisoba au bœuf",
    "Yakisoba mit Rind",
    "Yakisoba di manzo"
  ],
  "Yakisoba de frango": [
    "Chicken yakisoba",
    "Yakisoba de pollo",
    "Yakisoba au poulet",
    "Yakisoba mit Hähnchen",
    "Yakisoba di pollo"
  ],
  "Água de coco": [
    "Coconut water",
    "Agua de coco",
    "Eau de coco",
    "Kokoswasser",
    "Acqua di cocco"
  ]
};
  const CATEGORY_ROWS = {
  "Almoço": [
    "Lunch",
    "Almuerzo",
    "Déjeuner",
    "Mittagessen",
    "Pranzo"
  ],
  "Café da manhã": [
    "Breakfast",
    "Desayuno",
    "Petit-déjeuner",
    "Frühstück",
    "Colazione"
  ],
  "Fast Food": [
    "Fast food",
    "Comida rápida",
    "Fast food",
    "Fast Food",
    "Fast food"
  ],
  "Fitness": [
    "Fitness",
    "Fitness",
    "Fitness",
    "Fitness",
    "Fitness"
  ],
  "Infantil": [
    "Child-friendly",
    "Infantil",
    "Enfant",
    "Kinderfreundlich",
    "Bambini"
  ],
  "Jantar": [
    "Dinner",
    "Cena",
    "Dîner",
    "Abendessen",
    "Cena"
  ],
  "Lanche da manhã": [
    "Morning snack",
    "Merienda de la mañana",
    "Collation du matin",
    "Vormittagssnack",
    "Spuntino del mattino"
  ],
  "Lanche da tarde": [
    "Afternoon snack",
    "Merienda de la tarde",
    "Collation de l’après-midi",
    "Nachmittagssnack",
    "Spuntino pomeridiano"
  ],
  "Sobremesa": [
    "Dessert",
    "Postre",
    "Dessert",
    "Dessert",
    "Dessert"
  ],
  "Vegano": [
    "Vegan",
    "Vegano",
    "Végane",
    "Vegan",
    "Vegano"
  ],
  "Vegetariano": [
    "Vegetarian",
    "Vegetariano",
    "Végétarien",
    "Vegetarisch",
    "Vegetariano"
  ]
};
  const EXTRA_ROWS = {
  "Editar": [
    "Edit",
    "Editar",
    "Modifier",
    "Bearbeiten",
    "Modifica"
  ],
  "Remover": [
    "Remove",
    "Eliminar",
    "Supprimer",
    "Entfernen",
    "Rimuovi"
  ],
  "Package detected": [
    "Package detected",
    "Envase detectado",
    "Emballage détecté",
    "Verpackung erkannt",
    "Confezione rilevata"
  ],
  "Embalagem detectada": [
    "Package detected",
    "Envase detectado",
    "Emballage détecté",
    "Verpackung erkannt",
    "Confezione rilevata"
  ],
  "Parece que há um alimento embalado. No futuro será possível ler automaticamente a tabela nutricional.": [
    "It looks like there is packaged food. In the future, the nutrition label may be read automatically.",
    "Parece que hay un alimento envasado. En el futuro, la tabla nutricional podrá leerse automáticamente.",
    "Il semble y avoir un aliment emballé. À l’avenir, l’étiquette nutritionnelle pourra être lue automatiquement.",
    "Es sieht nach einem verpackten Lebensmittel aus. In Zukunft kann die Nährwerttabelle automatisch gelesen werden.",
    "Sembra esserci un alimento confezionato. In futuro, l’etichetta nutrizionale potrà essere letta automaticamente."
  ],
  "Esta análise possui baixa confiança. Recomendamos fotografar novamente.": [
    "This analysis has low confidence. We recommend taking the photo again.",
    "Este análisis tiene baja confianza. Recomendamos tomar la foto de nuevo.",
    "Cette analyse a une faible confiance. Nous recommandons de reprendre la photo.",
    "Diese Analyse hat eine geringe Zuverlässigkeit. Wir empfehlen, das Foto erneut aufzunehmen.",
    "Questa analisi ha bassa affidabilità. Consigliamo di scattare di nuovo la foto."
  ],
  "A precisão pode ser reduzida devido às condições da foto.": [
    "Accuracy may be reduced because of the photo conditions.",
    "La precisión puede verse reducida por las condiciones de la foto.",
    "La précision peut être réduite à cause des conditions de la photo.",
    "Die Genauigkeit kann durch die Fotoqualität verringert sein.",
    "La precisione può essere ridotta a causa delle condizioni della foto."
  ],
  "Confiança alta para uma simulação realista.": [
    "High confidence for a realistic simulation.",
    "Alta confianza para una simulación realista.",
    "Confiance élevée pour une simulation réaliste.",
    "Hohe Zuverlässigkeit für eine realistische Simulation.",
    "Alta affidabilità per una simulazione realistica."
  ],
  "Revise a foto": [
    "Review the photo",
    "Revisa la foto",
    "Vérifiez la photo",
    "Foto prüfen",
    "Controlla la foto"
  ],
  "Confira os alimentos antes de calcular.": [
    "Check the foods before calculating.",
    "Comprueba los alimentos antes de calcular.",
    "Vérifiez les aliments avant le calcul.",
    "Lebensmittel vor der Berechnung prüfen.",
    "Controlla gli alimenti prima del calcolo."
  ],
  "BASTIDOR TÉCNICO": [
    "TECHNICAL BACKGROUND",
    "TRASFONDO TÉCNICO",
    "COULISSE TECHNIQUE",
    "TECHNISCHER HINTERGRUND",
    "RETROSCENA TECNICO"
  ],
  "Bastidor técnico": [
    "Technical background",
    "Trasfondo técnico",
    "Coulisse technique",
    "Technischer Hintergrund",
    "Retroscena tecnico"
  ],
  "Importante": [
    "Important",
    "Importante",
    "Important",
    "Wichtig",
    "Importante"
  ],
  "Esta tela resume os detalhes técnicos do projeto: o que já funciona, o que ainda é simulado e como o PancreAI foi pensado para evoluir.": [
    "This screen summarizes the technical details of the project: what already works, what is still simulated, and how PancreAI was designed to evolve.",
    "Esta pantalla resume los detalles técnicos del proyecto: qué ya funciona, qué aún está simulado y cómo PancreAI fue pensado para evolucionar.",
    "Cet écran résume les détails techniques du projet : ce qui fonctionne déjà, ce qui est encore simulé et comment PancreAI a été conçu pour évoluer.",
    "Dieser Bildschirm fasst die technischen Details des Projekts zusammen: was bereits funktioniert, was noch simuliert wird und wie PancreAI weiterentwickelt werden kann.",
    "Questa schermata riassume i dettagli tecnici del progetto: cosa funziona già, cosa è ancora simulato e come PancreAI è stato pensato per evolvere."
  ],
  "alimentos cadastrados": [
    "registered foods",
    "alimentos registrados",
    "aliments enregistrés",
    "gespeicherte Lebensmittel",
    "alimenti registrati"
  ],
  "Base nutricional local": [
    "Local nutrition database",
    "Base nutricional local",
    "Base nutritionnelle locale",
    "Lokale Nährwertdatenbank",
    "Database nutrizionale locale"
  ],
  "refeições estruturadas": [
    "structured meals",
    "comidas estructuradas",
    "repas structurés",
    "strukturierte Mahlzeiten",
    "pasti strutturati"
  ],
  "Combinações coerentes": [
    "Coherent combinations",
    "Combinaciones coherentes",
    "Combinaisons cohérentes",
    "Stimmige Kombinationen",
    "Combinazioni coerenti"
  ],
  "APIs externas": [
    "External APIs",
    "APIs externas",
    "API externes",
    "Externe APIs",
    "API esterne"
  ],
  "Demonstração local e auditável": [
    "Local and auditable demo",
    "Demostración local y auditable",
    "Démonstration locale et vérifiable",
    "Lokale und prüfbare Demo",
    "Dimostrazione locale e verificabile"
  ],
  "O problema que o PancreAI explora": [
    "The problem PancreAI explores",
    "El problema que PancreAI explora",
    "Le problème que PancreAI explore",
    "Das Problem, das PancreAI betrachtet",
    "Il problema che PancreAI esplora"
  ],
  "Pacientes com fibrose cística que usam enzimas pancreáticas precisam transformar refeições em estimativas práticas. O PancreAI propõe uma experiência mais clara, visual e revisável para apoiar esse processo.": [
    "People with cystic fibrosis who use pancreatic enzymes need to turn meals into practical estimates. PancreAI proposes a clearer, visual, reviewable experience to support that process.",
    "Las personas con fibrosis quística que usan enzimas pancreáticas necesitan convertir comidas en estimaciones prácticas. PancreAI propone una experiencia más clara, visual y revisable para apoyar ese proceso.",
    "Les personnes atteintes de mucoviscidose qui utilisent des enzymes pancréatiques doivent transformer les repas en estimations pratiques. PancreAI propose une expérience plus claire, visuelle et vérifiable pour soutenir ce processus.",
    "Menschen mit Mukoviszidose, die Pankreasenzyme verwenden, müssen Mahlzeiten in praktische Schätzungen übersetzen. PancreAI bietet dafür eine klarere, visuelle und prüfbare Erfahrung.",
    "Le persone con fibrosi cistica che usano enzimi pancreatici devono trasformare i pasti in stime pratiche. PancreAI propone un’esperienza più chiara, visiva e revisionabile per supportare questo processo."
  ],
  "O app nunca decide sozinho": [
    "The app never decides alone",
    "La app nunca decide sola",
    "L’app ne décide jamais seule",
    "Die App entscheidet nie allein",
    "L’app non decide mai da sola"
  ],
  "A identificação inicial apenas sugere alimentos. O cálculo só acontece depois que o usuário revisa porções, remove erros, adiciona itens e confirma ingredientes ocultos.": [
    "The initial identification only suggests foods. Calculation happens only after the user reviews portions, removes errors, adds items, and confirms hidden ingredients.",
    "La identificación inicial solo sugiere alimentos. El cálculo ocurre solo después de que el usuario revisa porciones, elimina errores, agrega elementos y confirma ingredientes ocultos.",
    "L’identification initiale suggère seulement des aliments. Le calcul n’a lieu qu’après vérification des portions, suppression des erreurs, ajout d’éléments et confirmation des ingrédients cachés.",
    "Die erste Erkennung schlägt nur Lebensmittel vor. Die Berechnung erfolgt erst, nachdem Portionen geprüft, Fehler entfernt, Elemente ergänzt und versteckte Zutaten bestätigt wurden.",
    "L’identificazione iniziale suggerisce solo alimenti. Il calcolo avviene solo dopo che l’utente controlla le porzioni, rimuove errori, aggiunge elementi e conferma ingredienti nascosti."
  ],
  "A IA sugere, não decide": [
    "AI suggests; it does not decide",
    "La IA sugiere; no decide",
    "L’IA suggère ; elle ne décide pas",
    "Die KI macht Vorschläge; sie entscheidet nicht",
    "L’IA suggerisce; non decide"
  ],
  "O reconhecimento visual não controla o banco nutricional, a prescrição nem o cálculo. Essa separação reduz o impacto de uma sugestão incorreta e torna a revisão visível.": [
    "Visual recognition does not control the nutrition database, prescription, or calculation. This separation reduces the impact of an incorrect suggestion and makes review visible.",
    "El reconocimiento visual no controla la base nutricional, la prescripción ni el cálculo. Esta separación reduce el impacto de una sugerencia incorrecta y hace visible la revisión.",
    "La reconnaissance visuelle ne contrôle ni la base nutritionnelle, ni la prescription, ni le calcul. Cette séparation réduit l’impact d’une suggestion incorrecte et rend la vérification visible.",
    "Die visuelle Erkennung steuert weder die Nährwertdatenbank noch die Verordnung oder die Berechnung. Diese Trennung verringert die Auswirkungen eines falschen Vorschlags und macht die Prüfung sichtbar.",
    "Il riconoscimento visivo non controlla il database nutrizionale, la prescrizione o il calcolo. Questa separazione riduce l’impatto di un suggerimento errato e rende visibile la revisione."
  ],
  "Responsabilidades separadas": [
    "Separate responsibilities",
    "Responsabilidades separadas",
    "Responsabilités séparées",
    "Getrennte Verantwortlichkeiten",
    "Responsabilità separate"
  ],
  "O limite da simulação é claro": [
    "The simulation boundary is clear",
    "El límite de la simulación es claro",
    "La limite de la simulation est claire",
    "Die Grenze der Simulation ist klar",
    "Il limite della simulazione è chiaro"
  ],
  "A simulação existe apenas na etapa de reconhecimento. Depois dela, o app segue um fluxo funcional, revisável e transparente.": [
    "The simulation exists only in the recognition step. After that, the app follows a functional, reviewable, transparent flow.",
    "La simulación existe solo en la etapa de reconocimiento. Después, la app sigue un flujo funcional, revisable y transparente.",
    "La simulation existe uniquement à l’étape de reconnaissance. Ensuite, l’app suit un flux fonctionnel, vérifiable et transparent.",
    "Die Simulation existiert nur im Erkennungsschritt. Danach folgt die App einem funktionalen, prüfbaren und transparenten Ablauf.",
    "La simulazione esiste solo nella fase di riconoscimento. Dopo, l’app segue un flusso funzionale, revisionabile e trasparente."
  ],
  "Simulado nesta versão": [
    "Simulated in this version",
    "Simulado en esta versión",
    "Simulé dans cette version",
    "In dieser Version simuliert",
    "Simulato in questa versione"
  ],
  "Funcional no MVP": [
    "Functional in the MVP",
    "Funcional en el MVP",
    "Fonctionnel dans le MVP",
    "Im MVP funktional",
    "Funzionale nell’MVP"
  ],
  "Reconhecimento visual dos alimentos": [
    "Visual food recognition",
    "Reconocimiento visual de alimentos",
    "Reconnaissance visuelle des aliments",
    "Visuelle Lebensmittelerkennung",
    "Riconoscimento visivo degli alimenti"
  ],
  "Estimativa inicial das porções": [
    "Initial portion estimate",
    "Estimación inicial de porciones",
    "Estimation initiale des portions",
    "Erste Portionsschätzung",
    "Stima iniziale delle porzioni"
  ],
  "Qualidade da foto": [
    "Photo quality",
    "Calidad de la foto",
    "Qualité de la photo",
    "Fotoqualität",
    "Qualità della foto"
  ],
  "Confiança da análise": [
    "Analysis confidence",
    "Confianza del análisis",
    "Confiance de l’analyse",
    "Analysezuverlässigkeit",
    "Affidabilità dell’analisi"
  ],
  "Detecção de embalagem": [
    "Package detection",
    "Detección de envase",
    "Détection d’emballage",
    "Verpackungserkennung",
    "Rilevamento confezione"
  ],
  "Alimento desconhecido": [
    "Unknown food",
    "Alimento desconocido",
    "Aliment inconnu",
    "Unbekanntes Lebensmittel",
    "Alimento sconosciuto"
  ],
  "Cadastro do paciente": [
    "Patient registration",
    "Registro del paciente",
    "Enregistrement du patient",
    "Patientendaten",
    "Registrazione del paziente"
  ],
  "Dose prescrita e potência da cápsula": [
    "Prescribed dose and capsule strength",
    "Dosis prescrita y potencia de la cápsula",
    "Dose prescrite et dosage de la gélule",
    "Verordnete Dosis und Kapselstärke",
    "Dose prescritta e potenza della capsula"
  ],
  "Banco de alimentos": [
    "Food database",
    "Base de alimentos",
    "Base d’aliments",
    "Lebensmitteldatenbank",
    "Database alimentare"
  ],
  "Banco de refeições coerentes": [
    "Coherent meal database",
    "Base de comidas coherentes",
    "Base de repas cohérents",
    "Datenbank stimmiger Mahlzeiten",
    "Database di pasti coerenti"
  ],
  "Revisão manual obrigatória": [
    "Required manual review",
    "Revisión manual obligatoria",
    "Vérification manuelle obligatoire",
    "Erforderliche manuelle Prüfung",
    "Revisione manuale obbligatoria"
  ],
  "Ingredientes ocultos": [
    "Hidden ingredients",
    "Ingredientes ocultos",
    "Ingrédients cachés",
    "Versteckte Zutaten",
    "Ingredienti nascosti"
  ],
  "Cálculo por gordura": [
    "Fat-based calculation",
    "Cálculo por grasa",
    "Calcul basé sur les graisses",
    "Fettbasierte Berechnung",
    "Calcolo basato sui grassi"
  ],
  "Avisos de segurança": [
    "Safety warnings",
    "Avisos de seguridad",
    "Avertissements de sécurité",
    "Sicherheitshinweise",
    "Avvisi di sicurezza"
  ],
  "Resultado explicado": [
    "Explained result",
    "Resultado explicado",
    "Résultat expliqué",
    "Erklärtes Ergebnis",
    "Risultato spiegato"
  ],
  "Histórico local": [
    "Local history",
    "Historial local",
    "Historique local",
    "Lokaler Verlauf",
    "Cronologia locale"
  ],
  "Banco de refeições": [
    "Meal database",
    "Base de comidas",
    "Base de repas",
    "Mahlzeitendatenbank",
    "Database pasti"
  ],
  "Refeições coerentes, não sorteios aleatórios": [
    "Coherent meals, not random picks",
    "Comidas coherentes, no sorteos aleatorios",
    "Repas cohérents, pas de tirages au hasard",
    "Stimmige Mahlzeiten statt Zufallsauswahl",
    "Pasti coerenti, non scelte casuali"
  ],
  "Se a IA local não conseguir carregar ou reconhecer a imagem, o app mostra um erro. Os casos preparados só são usados quando o modo demonstrativo é escolhido explicitamente.": [
    "If the local AI cannot load or recognize the image, the app shows an error. Prepared cases are used only when demo mode is explicitly selected.",
    "Si la IA local no puede cargar o reconocer la imagen, la app muestra un error. Los casos preparados solo se usan cuando se elige explícitamente el modo demostración.",
    "Si l’IA locale ne peut pas charger ou reconnaître l’image, l’app affiche une erreur. Les cas préparés ne sont utilisés que lorsque le mode démonstration est choisi explicitement.",
    "Wenn die lokale KI das Bild nicht laden oder erkennen kann, zeigt die App einen Fehler an. Vorbereitete Fälle werden nur verwendet, wenn der Demomodus ausdrücklich gewählt wird.",
    "Se l’IA locale non riesce a caricare o riconoscere l’immagine, l’app mostra un errore. I casi preparati vengono usati solo quando si sceglie esplicitamente la modalità dimostrativa."
  ],
  "Almoço brasileiro": [
    "Brazilian lunch",
    "Almuerzo brasileño",
    "Déjeuner brésilien",
    "Brasilianisches Mittagessen",
    "Pranzo brasiliano"
  ],
  "Café da manhã": [
    "Breakfast",
    "Desayuno",
    "Petit-déjeuner",
    "Frühstück",
    "Colazione"
  ],
  "Fluxo funcional": [
    "Functional flow",
    "Flujo funcional",
    "Flux fonctionnel",
    "Funktionaler Ablauf",
    "Flusso funzionale"
  ],
  "Fluxo funcional do MVP": [
    "MVP functional flow",
    "Flujo funcional del MVP",
    "Flux fonctionnel du MVP",
    "Funktionaler MVP-Ablauf",
    "Flusso funzionale dell’MVP"
  ],
  "O MVP não pula etapas críticas. Mesmo quando a refeição é sugerida pelo módulo simulado, o cálculo só acontece após revisão humana.": [
    "The MVP does not skip critical steps. Even when the meal is suggested by the simulated module, calculation only happens after human review.",
    "El MVP no salta etapas críticas. Incluso cuando la comida es sugerida por el módulo simulado, el cálculo solo ocurre tras la revisión humana.",
    "Le MVP ne saute pas les étapes critiques. Même quand le repas est suggéré par le module simulé, le calcul n’a lieu qu’après vérification humaine.",
    "Das MVP überspringt keine kritischen Schritte. Auch wenn die Mahlzeit vom simulierten Modul vorgeschlagen wird, erfolgt die Berechnung erst nach menschlicher Prüfung.",
    "L’MVP non salta passaggi critici. Anche quando il pasto è suggerito dal modulo simulato, il calcolo avviene solo dopo una revisione umana."
  ],
  "Provider simulado": [
    "Simulated provider",
    "Proveedor simulado",
    "Fournisseur simulé",
    "Simulierter Provider",
    "Provider simulato"
  ],
  "Por que simular o reconhecimento agora?": [
    "Why simulate recognition now?",
    "¿Por qué simular el reconocimiento ahora?",
    "Pourquoi simuler la reconnaissance maintenant ?",
    "Warum die Erkennung jetzt simulieren?",
    "Perché simulare ora il riconoscimento?"
  ],
  "A simulação não é um atalho visual. É uma decisão de arquitetura.": [
    "The simulation is not a visual shortcut. It is an architecture decision.",
    "La simulación no es un atajo visual. Es una decisión de arquitectura.",
    "La simulation n’est pas un raccourci visuel. C’est une décision d’architecture.",
    "Die Simulation ist keine visuelle Abkürzung. Sie ist eine Architekturentscheidung.",
    "La simulazione non è una scorciatoia visiva. È una decisione architetturale."
  ],
  "Motor de cálculo": [
    "Calculation engine",
    "Motor de cálculo",
    "Moteur de calcul",
    "Berechnungsmodul",
    "Motore di calcolo"
  ],
  "O cálculo é determinístico e transparente": [
    "The calculation is deterministic and transparent",
    "El cálculo es determinista y transparente",
    "Le calcul est déterministe et transparent",
    "Die Berechnung ist deterministisch und transparent",
    "Il calcolo è deterministico e trasparente"
  ],
  "Gordura total": [
    "Total fat",
    "Grasa total",
    "Graisse totale",
    "Gesamtfett",
    "Grassi totali"
  ],
  "Dose prescrita": [
    "Prescribed dose",
    "Dosis prescrita",
    "Dose prescrite",
    "Verordnete Dosis",
    "Dose prescritta"
  ],
  "Lipase necessária": [
    "Required lipase",
    "Lipasa necesaria",
    "Lipase nécessaire",
    "Benötigte Lipase",
    "Lipasi necessaria"
  ],
  "Potência da cápsula": [
    "Capsule strength",
    "Potencia de la cápsula",
    "Dosage de la gélule",
    "Kapselstärke",
    "Potenza della capsula"
  ],
  "Cápsulas estimadas": [
    "Estimated capsules",
    "Cápsulas estimadas",
    "Gélules estimées",
    "Geschätzte Kapseln",
    "Capsule stimate"
  ],
  "Validações antes do resultado": [
    "Checks before the result",
    "Validaciones antes del resultado",
    "Validations avant le résultat",
    "Prüfungen vor dem Ergebnis",
    "Controlli prima del risultato"
  ],
  "Persistência local da refeição": [
    "Local meal persistence",
    "Persistencia local de la comida",
    "Persistance locale du repas",
    "Lokale Speicherung der Mahlzeit",
    "Persistenza locale del pasto"
  ],
  "Hoje": [
    "Today",
    "Hoy",
    "Aujourd’hui",
    "Heute",
    "Oggi"
  ],
  "Futuro": [
    "Future",
    "Futuro",
    "Futur",
    "Zukunft",
    "Futuro"
  ],
  "O reconhecimento muda. A arquitetura permanece.": [
    "Recognition changes. The architecture remains.",
    "El reconocimiento cambia. La arquitectura permanece.",
    "La reconnaissance change. L’architecture reste.",
    "Die Erkennung ändert sich. Die Architektur bleibt.",
    "Il riconoscimento cambia. L’architettura resta."
  ],
  "Por que esta tela existe": [
    "Why this screen exists",
    "Por qué existe esta pantalla",
    "Pourquoi cet écran existe",
    "Warum dieser Bildschirm existiert",
    "Perché esiste questa schermata"
  ],
  "O restante do app mostra a experiência ideal do usuário. Esta tela mostra a engenharia por trás da demonstração.": [
    "The rest of the app shows the ideal user experience. This screen shows the engineering behind the demo.",
    "El resto de la app muestra la experiencia ideal del usuario. Esta pantalla muestra la ingeniería detrás de la demostración.",
    "Le reste de l’app montre l’expérience utilisateur idéale. Cet écran montre l’ingénierie derrière la démonstration.",
    "Der Rest der App zeigt die ideale Nutzererfahrung. Dieser Bildschirm zeigt die Technik hinter der Demo.",
    "Il resto dell’app mostra l’esperienza utente ideale. Questa schermata mostra l’ingegneria dietro la demo."
  ],
  "Simulação honesta": [
    "Honest simulation",
    "Simulación honesta",
    "Simulation honnête",
    "Ehrliche Simulation",
    "Simulazione onesta"
  ],
  "Banco nutricional": [
    "Nutrition database",
    "Base nutricional",
    "Base nutritionnelle",
    "Nährwertdatenbank",
    "Database nutrizionale"
  ],
  "Dados estruturados": [
    "Structured data",
    "Datos estructurados",
    "Données structurées",
    "Strukturierte Daten",
    "Dati strutturati"
  ],
  "Refeições coerentes": [
    "Coherent meals",
    "Comidas coherentes",
    "Repas cohérents",
    "Stimmige Mahlzeiten",
    "Pasti coerenti"
  ],
  "Cálculo real": [
    "Real calculation",
    "Cálculo real",
    "Calcul réel",
    "Echte Berechnung",
    "Calcolo reale"
  ],
  "Segurança": [
    "Safety",
    "Seguridad",
    "Sécurité",
    "Sicherheit",
    "Sicurezza"
  ],
  "Validação": [
    "Validation",
    "Validación",
    "Validation",
    "Validierung",
    "Validazione"
  ],
  "Confiabilidade": [
    "Reliability",
    "Confiabilidad",
    "Fiabilité",
    "Zuverlässigkeit",
    "Affidabilità"
  ],
  "Revisão humana": [
    "Human review",
    "Revisión humana",
    "Vérification humaine",
    "Menschliche Prüfung",
    "Revisione umana"
  ],
  "Cálculo": [
    "Calculation",
    "Cálculo",
    "Calcul",
    "Berechnung",
    "Calcolo"
  ]
};


  /* ADDITIONAL_EXTRA_ROWS */
  Object.assign(EXTRA_ROWS, {
  "Arroz": [
    "Rice",
    "Arroz",
    "Riz",
    "Reis",
    "Riso"
  ],
  "Feijão": [
    "Beans",
    "Frijoles",
    "Haricots",
    "Bohnen",
    "Fagioli"
  ],
  "Frango grelhado": [
    "Grilled chicken",
    "Pollo a la plancha",
    "Poulet grillé",
    "Gegrilltes Hähnchen",
    "Pollo grigliato"
  ],
  "Salada": [
    "Salad",
    "Ensalada",
    "Salade",
    "Salat",
    "Insalata"
  ],
  "Óleo": [
    "Oil",
    "Aceite",
    "Huile",
    "Öl",
    "Olio"
  ],
  "Molhos": [
    "Sauces",
    "Salsas",
    "Sauces",
    "Saucen",
    "Salse"
  ],
  "Foto": [
    "Photo",
    "Foto",
    "Photo",
    "Foto",
    "Foto"
  ],
  "Análise": [
    "Analysis",
    "Análisis",
    "Analyse",
    "Analyse",
    "Analisi"
  ],
  "Cálculo de lipase": [
    "Lipase calculation",
    "Cálculo de lipasa",
    "Calcul de lipase",
    "Lipaseberechnung",
    "Calcolo della lipasi"
  ],
  "Histórico": [
    "History",
    "Historial",
    "Historique",
    "Verlauf",
    "Cronologia"
  ],
  "A câmera e a galeria recebem fotos reais. Uma rede Food-101 analisa a imagem no próprio navegador e sugere categorias de alimentos e porções aproximadas.": [
    "The camera and gallery receive real photos. A Food-101 network analyzes the image directly in the browser and suggests food categories and approximate portions.",
    "La cámara y la galería reciben fotos reales. Una red Food-101 analiza la imagen directamente en el navegador y sugiere categorías de alimentos y porciones aproximadas.",
    "L’appareil photo et la galerie reçoivent de vraies photos. Un réseau Food-101 analyse l’image directement dans le navigateur et suggère des catégories d’aliments et des portions approximatives.",
    "Kamera und Galerie verwenden echte Fotos. Ein Food-101-Netz analysiert das Bild direkt im Browser und schlägt Lebensmittelkategorien sowie ungefähre Portionen vor.",
    "La fotocamera e la galleria ricevono foto reali. Una rete Food-101 analizza l’immagine direttamente nel browser e suggerisce categorie di alimenti e porzioni approssimative."
  ],
  "O app não usa calorias como base principal. Ele soma a gordura dos alimentos confirmados, aplica a dose prescrita em U/g de gordura e converte a lipase necessária em cápsulas de Creon.": [
    "The app does not use calories as the main basis. It adds the fat from confirmed foods, applies the prescribed dose in U/g of fat, and converts the required lipase into Creon capsules.",
    "La app no usa calorías como base principal. Suma la grasa de los alimentos confirmados, aplica la dosis prescrita en U/g de grasa y convierte la lipasa necesaria en cápsulas de Creon.",
    "L’app n’utilise pas les calories comme base principale. Elle additionne les graisses des aliments confirmés, applique la dose prescrite en U/g de graisse et convertit la lipase nécessaire en gélules de Creon.",
    "Die App verwendet Kalorien nicht als Hauptgrundlage. Sie summiert das Fett der bestätigten Lebensmittel, wendet die verordnete Dosis in U/g Fett an und rechnet die benötigte Lipase in Creon-Kapseln um.",
    "L’app non usa le calorie come base principale. Somma i grassi degli alimenti confermati, applica la dose prescritta in U/g di grassi e converte la lipasi necessaria in capsule di Creon."
  ],
  "O arredondamento segue a regra conservadora atual do app: a estimativa sobe para a próxima cápsula inteira.": [
    "Rounding follows the app’s current conservative rule: the estimate is rounded up to the next whole capsule.",
    "El redondeo sigue la regla conservadora actual de la app: la estimación sube a la siguiente cápsula entera.",
    "L’arrondi suit la règle conservatrice actuelle de l’app : l’estimation monte à la gélule entière suivante.",
    "Die Rundung folgt der aktuellen konservativen Regel der App: Die Schätzung wird auf die nächste ganze Kapsel aufgerundet.",
    "L’arrotondamento segue l’attuale regola conservativa dell’app: la stima sale alla capsula intera successiva."
  ],
  "Antes de mostrar a estimativa, o app verifica situações que exigem revisão: baixa confiança, foto ruim, alimento desconhecido, porções incompatíveis, gordura muito alta ou resultado fora do padrão esperado.": [
    "Before showing the estimate, the app checks situations that require review: low confidence, poor photo, unknown food, incompatible portions, very high fat, or a result outside the expected range.",
    "Antes de mostrar la estimación, la app verifica situaciones que requieren revisión: baja confianza, foto mala, alimento desconocido, porciones incompatibles, grasa muy alta o resultado fuera del patrón esperado.",
    "Avant d’afficher l’estimation, l’app vérifie les situations qui exigent une révision : faible confiance, mauvaise photo, aliment inconnu, portions incompatibles, graisse très élevée ou résultat hors du schéma attendu.",
    "Bevor die Schätzung angezeigt wird, prüft die App Situationen, die eine Überprüfung erfordern: geringe Zuverlässigkeit, schlechtes Foto, unbekanntes Lebensmittel, unpassende Portionen, sehr viel Fett oder ein Ergebnis außerhalb des erwarteten Bereichs.",
    "Prima di mostrare la stima, l’app verifica situazioni che richiedono revisione: bassa affidabilità, foto scarsa, alimento sconosciuto, porzioni incompatibili, grassi molto alti o risultato fuori dal modello atteso."
  ],
  "O histórico registra alimentos confirmados, porções, gordura total, lipase, cápsulas, qualidade da foto, confiança, ingredientes adicionados, alterações feitas e provider utilizado. Os dados são salvos localmente no navegador durante esta demonstração.": [
    "History records confirmed foods, portions, total fat, lipase, capsules, photo quality, confidence, added ingredients, changes made, and the provider used. Data is saved locally in the browser during this demo.",
    "El historial registra alimentos confirmados, porciones, grasa total, lipasa, cápsulas, calidad de la foto, confianza, ingredientes agregados, cambios realizados y proveedor utilizado. Los datos se guardan localmente en el navegador durante esta demostración.",
    "L’historique enregistre les aliments confirmés, les portions, la graisse totale, la lipase, les gélules, la qualité de la photo, la confiance, les ingrédients ajoutés, les modifications et le fournisseur utilisé. Les données sont enregistrées localement dans le navigateur pendant cette démonstration.",
    "Der Verlauf speichert bestätigte Lebensmittel, Portionen, Gesamtfett, Lipase, Kapseln, Fotoqualität, Zuverlässigkeit, hinzugefügte Zutaten, Änderungen und den verwendeten Provider. Die Daten werden während dieser Demo lokal im Browser gespeichert.",
    "La cronologia registra alimenti confermati, porzioni, grassi totali, lipasi, capsule, qualità della foto, affidabilità, ingredienti aggiunti, modifiche effettuate e provider utilizzato. I dati vengono salvati localmente nel browser durante questa demo."
  ],
  "A IA sugere nomes e porções; o banco local fornece nutrientes; o modo demonstrativo mantém casos preparados separados do fluxo real.": [
    "AI suggests names and portions; the local database provides nutrients; demo mode keeps prepared cases separate from the real flow.",
    "La IA sugiere nombres y porciones; la base local proporciona nutrientes; el modo demostración mantiene los casos preparados separados del flujo real.",
    "L’IA suggère des noms et des portions ; la base locale fournit les nutriments ; le mode démonstration maintient les cas préparés séparés du flux réel.",
    "Die KI schlägt Namen und Portionen vor; die lokale Datenbank liefert Nährwerte; der Demomodus hält vorbereitete Fälle vom realen Ablauf getrennt.",
    "L’IA suggerisce nomi e porzioni; il database locale fornisce i nutrienti; la modalità dimostrativa mantiene i casi preparati separati dal flusso reale."
  ],
  "O PancreAI não tenta esconder que a IA ainda não foi implementada. Ele mostra exatamente onde ela entrará, quais partes já funcionam e por que o projeto foi pensado para evoluir.": [
    "PancreAI does not try to hide that AI has not been implemented yet. It shows exactly where it will enter, which parts already work, and why the project was designed to evolve.",
    "PancreAI no intenta ocultar que la IA aún no fue implementada. Muestra exactamente dónde entrará, qué partes ya funcionan y por qué el proyecto fue pensado para evolucionar.",
    "PancreAI n’essaie pas de cacher que l’IA n’a pas encore été implémentée. Il montre exactement où elle interviendra, quelles parties fonctionnent déjà et pourquoi le projet a été pensé pour évoluer.",
    "PancreAI versucht nicht zu verbergen, dass die KI noch nicht implementiert ist. Es zeigt genau, wo sie später eingesetzt wird, welche Teile bereits funktionieren und warum das Projekt weiterentwickelt werden kann.",
    "PancreAI non cerca di nascondere che l’IA non è ancora stata implementata. Mostra esattamente dove entrerà, quali parti funzionano già e perché il progetto è stato pensato per evolvere."
  ],
  "Este MVP não tenta parecer mais inteligente do que é. Ele tenta ser honesto, funcional e preparado para evoluir.": [
    "This MVP does not try to look smarter than it is. It tries to be honest, functional, and ready to evolve.",
    "Este MVP no intenta parecer más inteligente de lo que es. Intenta ser honesto, funcional y preparado para evolucionar.",
    "Ce MVP n’essaie pas de paraître plus intelligent qu’il ne l’est. Il essaie d’être honnête, fonctionnel et prêt à évoluer.",
    "Dieses MVP versucht nicht, intelligenter zu wirken, als es ist. Es versucht ehrlich, funktional und entwicklungsbereit zu sein.",
    "Questo MVP non cerca di sembrare più intelligente di quanto sia. Cerca di essere onesto, funzionale e pronto a evolvere."
  ],
  "Seus dados": [
    "Your data",
    "Tus datos",
    "Vos données",
    "Ihre Daten",
    "I tuoi dati"
  ],
  "Peso cadastrado": [
    "Registered weight",
    "Peso registrado",
    "Poids enregistré",
    "Gespeichertes Gewicht",
    "Peso registrato"
  ],
  "Não informado": [
    "Not provided",
    "No informado",
    "Non renseigné",
    "Nicht angegeben",
    "Non indicato"
  ],
  "País/região": [
    "Country/region",
    "País/región",
    "Pays/région",
    "Land/Region",
    "Paese/regione"
  ],
  "Potência": [
    "Strength",
    "Potencia",
    "Dosage",
    "Stärke",
    "Potenza"
  ],
  "Não informada": [
    "Not provided",
    "No informada",
    "Non renseignée",
    "Nicht angegeben",
    "Non indicata"
  ],
  "Unidade de medida": [
    "Unit of measure",
    "Unidad de medida",
    "Unité de mesure",
    "Maßeinheit",
    "Unità di misura"
  ],
  "Porções": [
    "Portions",
    "Porciones",
    "Portions",
    "Portionen",
    "Porzioni"
  ],
  "Configuração de cálculo": [
    "Calculation setup",
    "Configuración de cálculo",
    "Configuration du calcul",
    "Berechnungseinstellung",
    "Configurazione del calcolo"
  ],
  "Base do cálculo": [
    "Calculation basis",
    "Base del cálculo",
    "Base du calcul",
    "Berechnungsbasis",
    "Base del calcolo"
  ],
  "Gordura estimada x dose prescrita": [
    "Estimated fat x prescribed dose",
    "Grasa estimada x dosis prescrita",
    "Graisse estimée x dose prescrite",
    "Geschätztes Fett x verordnete Dosis",
    "Grassi stimati x dose prescritta"
  ],
  "Divisor": [
    "Divisor",
    "Divisor",
    "Diviseur",
    "Divisor",
    "Divisore"
  ],
  "Unidades de lipase por unidade do medicamento": [
    "Lipase units per medication unit",
    "Unidades de lipasa por unidad del medicamento",
    "Unités de lipase par unité de médicament",
    "Lipase-Einheiten pro Medikamenteinheit",
    "Unità di lipasi per unità di farmaco"
  ],
  "Arredondamento": [
    "Rounding",
    "Redondeo",
    "Arrondi",
    "Rundung",
    "Arrotondamento"
  ],
  "Conversão para unidades inteiras": [
    "Conversion to whole units",
    "Conversión a unidades enteras",
    "Conversion en unités entières",
    "Umrechnung in ganze Einheiten",
    "Conversione in unità intere"
  ],
  "Avisos médicos": [
    "Medical warnings",
    "Avisos médicos",
    "Avertissements médicaux",
    "Medizinische Hinweise",
    "Avvisi medici"
  ],
  "Ativados": [
    "On",
    "Activados",
    "Activés",
    "Aktiv",
    "Attivi"
  ],
  "Desativados": [
    "Off",
    "Desactivados",
    "Désactivés",
    "Deaktiviert",
    "Disattivi"
  ],
  "Cálculos confirmados": [
    "Confirmed calculations",
    "Cálculos confirmados",
    "Calculs confirmés",
    "Bestätigte Berechnungen",
    "Calcoli confermati"
  ],
  "Nenhum ainda": [
    "None yet",
    "Ninguno todavía",
    "Aucun pour le moment",
    "Noch keine",
    "Ancora nessuno"
  ],
  "Mudanças na dose": [
    "Dose changes",
    "Cambios en la dosis",
    "Changements de dose",
    "Dosisänderungen",
    "Modifiche della dose"
  ],
  "Ajustes manuais": [
    "Manual adjustments",
    "Ajustes manuales",
    "Ajustements manuels",
    "Manuelle Anpassungen",
    "Regolazioni manuali"
  ],
  "Nenhum ajuste manual": [
    "No manual adjustment",
    "Ningún ajuste manual",
    "Aucun ajustement manuel",
    "Keine manuelle Anpassung",
    "Nessuna regolazione manuale"
  ],
  "Dose sugerida média": [
    "Average suggested dose",
    "Dosis sugerida media",
    "Dose suggérée moyenne",
    "Durchschnittlich vorgeschlagene Dosis",
    "Dose suggerita media"
  ],
  "Dose usada média": [
    "Average used dose",
    "Dosis usada media",
    "Dose utilisée moyenne",
    "Durchschnittlich verwendete Dosis",
    "Dose usata media"
  ],
  "Última dose usada": [
    "Last used dose",
    "Última dosis usada",
    "Dernière dose utilisée",
    "Zuletzt verwendete Dosis",
    "Ultima dose usata"
  ],
  "Último cálculo": [
    "Last calculation",
    "Último cálculo",
    "Dernier calcul",
    "Letzte Berechnung",
    "Ultimo calcolo"
  ],
  "Observações": [
    "Notes",
    "Observaciones",
    "Observations",
    "Hinweise",
    "Osservazioni"
  ],
  "Reanálises feitas": [
    "Reanalyses made",
    "Reanálisis realizados",
    "Réanalyse effectuées",
    "Erneute Analysen",
    "Rianalisi effettuate"
  ],
  "Nenhuma": [
    "None",
    "Ninguna",
    "Aucune",
    "Keine",
    "Nessuna"
  ],
  "Correções manuais": [
    "Manual corrections",
    "Correcciones manuales",
    "Corrections manuelles",
    "Manuelle Korrekturen",
    "Correzioni manuali"
  ],
  "Este relatório organiza informações cadastradas no app para facilitar a conversa com profissionais de saúde. Ele não substitui orientação médica.": [
    "This report organizes information entered in the app to make conversations with health professionals easier. It does not replace medical guidance.",
    "Este informe organiza información registrada en la app para facilitar la conversación con profesionales de salud. No sustituye la orientación médica.",
    "Ce rapport organise les informations saisies dans l’app afin de faciliter l’échange avec les professionnels de santé. Il ne remplace pas un avis médical.",
    "Dieser Bericht ordnet die in der App gespeicherten Informationen, um Gespräche mit medizinischem Fachpersonal zu erleichtern. Er ersetzt keine medizinische Beratung.",
    "Questo report organizza le informazioni registrate nell’app per facilitare il dialogo con i professionisti sanitari. Non sostituisce il parere medico."
  ]
});


  /* COUNTRY_EXTRA_ROWS */
  Object.assign(EXTRA_ROWS, {
  "Brasil": [
    "Brazil",
    "Brasil",
    "Brésil",
    "Brasilien",
    "Brasile"
  ],
  "Estados Unidos": [
    "United States",
    "Estados Unidos",
    "États-Unis",
    "Vereinigte Staaten",
    "Stati Uniti"
  ],
  "Reino Unido": [
    "United Kingdom",
    "Reino Unido",
    "Royaume-Uni",
    "Vereinigtes Königreich",
    "Regno Unito"
  ],
  "Canadá": [
    "Canada",
    "Canadá",
    "Canada",
    "Kanada",
    "Canada"
  ],
  "Austrália": [
    "Australia",
    "Australia",
    "Australie",
    "Australien",
    "Australia"
  ],
  "Espanha": [
    "Spain",
    "España",
    "Espagne",
    "Spanien",
    "Spagna"
  ],
  "França": [
    "France",
    "Francia",
    "France",
    "Frankreich",
    "Francia"
  ],
  "Alemanha": [
    "Germany",
    "Alemania",
    "Allemagne",
    "Deutschland",
    "Germania"
  ],
  "Itália": [
    "Italy",
    "Italia",
    "Italie",
    "Italien",
    "Italia"
  ],
  "Rússia": [
    "Russia",
    "Rusia",
    "Russie",
    "Russland",
    "Russia"
  ],
  "Polônia": [
    "Poland",
    "Polonia",
    "Pologne",
    "Polen",
    "Polonia"
  ],
  "Turquia": [
    "Turkey",
    "Turquía",
    "Turquie",
    "Türkei",
    "Turchia"
  ],
  "Holanda": [
    "Netherlands",
    "Países Bajos",
    "Pays-Bas",
    "Niederlande",
    "Paesi Bassi"
  ],
  "Arábia Saudita": [
    "Saudi Arabia",
    "Arabia Saudita",
    "Arabie saoudite",
    "Saudi-Arabien",
    "Arabia Saudita"
  ],
  "China": [
    "China",
    "China",
    "Chine",
    "China",
    "Cina"
  ],
  "Índia": [
    "India",
    "India",
    "Inde",
    "Indien",
    "India"
  ],
  "Bangladesh": [
    "Bangladesh",
    "Bangladesh",
    "Bangladesh",
    "Bangladesch",
    "Bangladesh"
  ],
  "Japão": [
    "Japan",
    "Japón",
    "Japon",
    "Japan",
    "Giappone"
  ],
  "Coreia do Sul": [
    "South Korea",
    "Corea del Sur",
    "Corée du Sud",
    "Südkorea",
    "Corea del Sud"
  ],
  "Grécia": [
    "Greece",
    "Grecia",
    "Grèce",
    "Griechenland",
    "Grecia"
  ],
  "Suécia": [
    "Sweden",
    "Suecia",
    "Suède",
    "Schweden",
    "Svezia"
  ],
  "Noruega": [
    "Norway",
    "Noruega",
    "Norvège",
    "Norwegen",
    "Norvegia"
  ],
  "Dinamarca": [
    "Denmark",
    "Dinamarca",
    "Danemark",
    "Dänemark",
    "Danimarca"
  ],
  "Finlândia": [
    "Finland",
    "Finlandia",
    "Finlande",
    "Finnland",
    "Finlandia"
  ],
  "Chéquia": [
    "Czechia",
    "Chequia",
    "Tchéquie",
    "Tschechien",
    "Cechia"
  ],
  "Romênia": [
    "Romania",
    "Rumanía",
    "Roumanie",
    "Rumänien",
    "Romania"
  ],
  "Ucrânia": [
    "Ukraine",
    "Ucrania",
    "Ukraine",
    "Ukraine",
    "Ucraina"
  ],
  "Israel": [
    "Israel",
    "Israel",
    "Israël",
    "Israel",
    "Israele"
  ],
  "Europa": [
    "Europe",
    "Europa",
    "Europe",
    "Europa",
    "Europa"
  ],
  "Outro": [
    "Other",
    "Otro",
    "Autre",
    "Andere",
    "Altro"
  ]
});

  Object.assign(FOOD_ROWS, {
    "Carne bovina": ["Beef", "Carne de res", "Bœuf", "Rindfleisch", "Manzo"],
    "Couve": ["Collard greens", "Col rizada", "Chou vert", "Blattkohl", "Cavolo verde"],
    "Estrogonofe de frango": ["Chicken stroganoff", "Estrogonof de pollo", "Stroganoff de poulet", "Hähnchen-Stroganoff", "Stroganoff di pollo"],
    "Farofa": ["Toasted cassava flour", "Farofa", "Farofa", "Farofa", "Farofa"],
    "Framboesa": ["Raspberry", "Frambuesa", "Framboise", "Himbeere", "Lampone"],
    "Raspberry": ["Raspberry", "Frambuesa", "Framboise", "Himbeere", "Lampone"],
    "Jabuticaba": ["Jabuticaba", "Jabuticaba", "Jabuticaba", "Jabuticaba", "Jabuticaba"],
    "Kiwi": ["Kiwi", "Kiwi", "Kiwi", "Kiwi", "Kiwi"],
    "Laranja": ["Orange", "Naranja", "Orange", "Orange", "Arancia"],
    "Linguiça": ["Sausage", "Salchicha", "Saucisse", "Bratwurst", "Salsiccia"],
    "Manga": ["Mango", "Mango", "Mangue", "Mango", "Mango"],
    "Ovo": ["Egg", "Huevo", "Œuf", "Ei", "Uovo"],
    "Petit gâteau": ["Chocolate lava cake", "Coulant de chocolate", "Fondant au chocolat", "Schokoladenküchlein", "Tortino al cioccolato"],
    "Pizza de mussarela com presunto": ["Mozzarella and ham pizza", "Pizza de mozzarella y jamón", "Pizza mozzarella-jambon", "Pizza mit Mozzarella und Schinken", "Pizza con mozzarella e prosciutto"],
    "Queijo mussarela": ["Mozzarella", "Queso mozzarella", "Mozzarella", "Mozzarella", "Mozzarella"],
    "Sorvete de creme": ["Vanilla ice cream", "Helado de vainilla", "Glace à la vanille", "Vanilleeis", "Gelato alla vaniglia"],
    "Espaguete": ["Spaghetti", "Espaguetis", "Spaghettis", "Spaghetti", "Spaghetti"],
    "Spaghetti": ["Spaghetti", "Espaguetis", "Spaghettis", "Spaghetti", "Spaghetti"],
    "Churrasco": ["Brazilian barbecue", "Churrasco brasileño", "Barbecue brésilien", "Brasilianisches Barbecue", "Barbecue brasiliano"]
  });

  Object.assign(CATEGORY_ROWS, {
    "Prato brasileiro": ["Brazilian dish", "Plato brasileño", "Plat brésilien", "Brasilianisches Gericht", "Piatto brasiliano"],
    "Frutas": ["Fruit", "Frutas", "Fruits", "Obst", "Frutta"],
    "Fast food": ["Fast food", "Comida rápida", "Restauration rapide", "Fast Food", "Fast food"],
    "Pizza": ["Pizza", "Pizza", "Pizza", "Pizza", "Pizza"],
    "Massa": ["Pasta", "Pasta", "Pâtes", "Pasta", "Pasta"],
    "carboidrato": ["carbohydrate", "carbohidrato", "glucide", "Kohlenhydrat", "carboidrato"],
    "leguminosa": ["legume", "legumbre", "légumineuse", "Hülsenfrucht", "legume"],
    "proteína": ["protein", "proteína", "protéine", "Protein", "proteina"],
    "gordura/carboidrato": ["fat/carbohydrate", "grasa/carbohidrato", "graisse/glucide", "Fett/Kohlenhydrat", "grassi/carboidrati"],
    "vegetal": ["vegetable", "vegetal", "légume", "Gemüse", "verdura"],
    "proteína/molho": ["protein/sauce", "proteína/salsa", "protéine/sauce", "Protein/Soße", "proteine/salsa"],
    "fruta": ["fruit", "fruta", "fruit", "Obst", "frutta"],
    "prato principal": ["main dish", "plato principal", "plat principal", "Hauptgericht", "piatto principale"],
    "acompanhamento": ["side dish", "guarnición", "accompagnement", "Beilage", "contorno"],
    "laticínio": ["dairy", "lácteo", "produit laitier", "Milchprodukt", "latticino"],
    "proteína/gordura": ["protein/fat", "proteína/grasa", "protéine/graisse", "Protein/Fett", "proteine/grassi"],
    "massa/laticínio": ["pasta/dairy", "pasta/lácteo", "pâtes/produit laitier", "Pasta/Milchprodukt", "pasta/latticino"],
    "sobremesa/laticínio": ["dessert/dairy", "postre/lácteo", "dessert/produit laitier", "Dessert/Milchprodukt", "dessert/latticino"],
    "massa": ["pasta", "pasta", "pâtes", "Pasta", "pasta"],
    "molho": ["sauce", "salsa", "sauce", "Soße", "salsa"]
  });

  Object.assign(EXTRA_ROWS, {
    "Calda": ["Syrup", "Sirope", "Coulis", "Soße", "Sciroppo"],
    "Chocolate": ["Chocolate", "Chocolate", "Chocolat", "Schokolade", "Cioccolato"],
    "Creme de leite": ["Cream", "Crema de leche", "Crème", "Sahne", "Panna"],
    "Gordura da carne": ["Meat fat", "Grasa de la carne", "Graisse de la viande", "Fleischfett", "Grasso della carne"],
    "Maionese": ["Mayonnaise", "Mayonesa", "Mayonnaise", "Mayonnaise", "Maionese"],
    "Manteiga na farofa": ["Butter in the farofa", "Mantequilla en la farofa", "Beurre dans la farofa", "Butter in der Farofa", "Burro nella farofa"],
    "Manteiga no pão": ["Butter on the bun", "Mantequilla en el pan", "Beurre sur le pain", "Butter auf dem Brötchen", "Burro nel pane"],
    "Molho": ["Sauce", "Salsa", "Sauce", "Soße", "Salsa"],
    "Não tinha": ["None", "Ninguno", "Aucun", "Keiner", "Nessuno"],
    "Queijo extra": ["Extra cheese", "Queso extra", "Fromage supplémentaire", "Extra Käse", "Formaggio extra"],
    "pequena": ["small", "pequeña", "petite", "klein", "piccola"],
    "média": ["medium", "mediana", "moyenne", "mittel", "media"],
    "grande": ["large", "grande", "grande", "groß", "grande"],
    "Arroz, feijão, carne e batata": ["Rice, beans, beef, and fries", "Arroz, frijoles, carne y papas fritas", "Riz, haricots, bœuf et frites", "Reis, Bohnen, Rindfleisch und Pommes", "Riso, fagioli, manzo e patatine"],
    "Com tomate e alface": ["With tomato and lettuce", "Con tomate y lechuga", "Avec tomate et laitue", "Mit Tomate und Salat", "Con pomodoro e lattuga"],
    "Arroz, feijão, carne bovina, batata frita, tomate e alface.": ["Rice, beans, beef, fries, tomato, and lettuce.", "Arroz, frijoles, carne, papas fritas, tomate y lechuga.", "Riz, haricots, bœuf, frites, tomate et laitue.", "Reis, Bohnen, Rindfleisch, Pommes, Tomate und Salat.", "Riso, fagioli, manzo, patatine, pomodoro e lattuga."],
    "Com arroz e batata palha": ["With rice and shoestring potatoes", "Con arroz y papas paja", "Avec riz et pommes paille", "Mit Reis und Kartoffelsticks", "Con riso e patate a fiammifero"],
    "Estrogonofe de frango com arroz e batata palha.": ["Chicken stroganoff with rice and shoestring potatoes.", "Estrogonof de pollo con arroz y papas paja.", "Stroganoff de poulet avec riz et pommes paille.", "Hähnchen-Stroganoff mit Reis und Kartoffelsticks.", "Stroganoff di pollo con riso e patate a fiammifero."],
    "Salada de frutas": ["Fruit salad", "Ensalada de frutas", "Salade de fruits", "Obstsalat", "Macedonia di frutta"],
    "Manga, morango, kiwi e frutas vermelhas": ["Mango, strawberry, kiwi, and berries", "Mango, fresa, kiwi y frutos rojos", "Mangue, fraise, kiwi et fruits rouges", "Mango, Erdbeere, Kiwi und Beeren", "Mango, fragola, kiwi e frutti di bosco"],
    "Salada de frutas com manga, morango, kiwi, jabuticaba e framboesa.": ["Fruit salad with mango, strawberry, kiwi, jabuticaba, and raspberry.", "Ensalada de frutas con mango, fresa, kiwi, jabuticaba y frambuesa.", "Salade de fruits avec mangue, fraise, kiwi, jabuticaba et framboise.", "Obstsalat mit Mango, Erdbeere, Kiwi, Jabuticaba und Himbeere.", "Macedonia con mango, fragola, kiwi, jabuticaba e lampone."],
    "Com arroz, farofa, couve e laranja": ["With rice, farofa, collard greens, and orange", "Con arroz, farofa, col rizada y naranja", "Avec riz, farofa, chou vert et orange", "Mit Reis, Farofa, Blattkohl und Orange", "Con riso, farofa, cavolo verde e arancia"],
    "Feijoada com arroz, farofa, couve e laranja.": ["Feijoada with rice, farofa, collard greens, and orange.", "Feijoada con arroz, farofa, col rizada y naranja.", "Feijoada avec riz, farofa, chou vert et orange.", "Feijoada mit Reis, Farofa, Blattkohl und Orange.", "Feijoada con riso, farofa, cavolo verde e arancia."],
    "Hambúrguer grande": ["Large burger", "Hamburguesa grande", "Grand hamburger", "Großer Burger", "Hamburger grande"],
    "Com ovo, bacon e dois queijos": ["With egg, bacon, and two cheeses", "Con huevo, bacon y dos quesos", "Avec œuf, bacon et deux fromages", "Mit Ei, Bacon und zwei Käsesorten", "Con uovo, bacon e due formaggi"],
    "Hambúrguer grande com pão, carne, queijo cheddar, bacon, tomate, alface, ovo e queijo mussarela.": ["Large burger with bun, beef, cheddar, bacon, tomato, lettuce, egg, and mozzarella.", "Hamburguesa grande con pan, carne, queso cheddar, bacon, tomate, lechuga, huevo y mozzarella.", "Grand hamburger avec pain, bœuf, cheddar, bacon, tomate, laitue, œuf et mozzarella.", "Großer Burger mit Brötchen, Rindfleisch, Cheddar, Bacon, Tomate, Salat, Ei und Mozzarella.", "Hamburger grande con pane, manzo, cheddar, bacon, pomodoro, lattuga, uovo e mozzarella."],
    "Porção de 2 fatias": ["2-slice serving", "Porción de 2 trozos", "Portion de 2 parts", "Portion mit 2 Stücken", "Porzione da 2 fette"],
    "Petit gâteau com sorvete": ["Chocolate lava cake with ice cream", "Coulant de chocolate con helado", "Fondant au chocolat avec glace", "Schokoladenküchlein mit Eis", "Tortino al cioccolato con gelato"],
    "Com uma bola de sorvete de creme": ["With one scoop of vanilla ice cream", "Con una bola de helado de vainilla", "Avec une boule de glace à la vanille", "Mit einer Kugel Vanilleeis", "Con una pallina di gelato alla vaniglia"],
    "Petit gâteau com uma bola de sorvete de creme.": ["Chocolate lava cake with one scoop of vanilla ice cream.", "Coulant de chocolate con una bola de helado de vainilla.", "Fondant au chocolat avec une boule de glace à la vanille.", "Schokoladenküchlein mit einer Kugel Vanilleeis.", "Tortino al cioccolato con una pallina di gelato alla vaniglia."],
    "Espaguete com molho de tomate": ["Spaghetti with tomato sauce", "Espaguetis con salsa de tomate", "Spaghettis à la sauce tomate", "Spaghetti mit Tomatensoße", "Spaghetti al pomodoro"],
    "Massa ao molho de tomate": ["Pasta with tomato sauce", "Pasta con salsa de tomate", "Pâtes à la sauce tomate", "Pasta mit Tomatensoße", "Pasta al pomodoro"],
    "Espaguete com molho de tomate.": ["Spaghetti with tomato sauce.", "Espaguetis con salsa de tomate.", "Spaghettis à la sauce tomate.", "Spaghetti mit Tomatensoße.", "Spaghetti al pomodoro."],
    "Carne bovina, linguiça e farofa": ["Beef, sausage, and farofa", "Carne, salchicha y farofa", "Bœuf, saucisse et farofa", "Rindfleisch, Bratwurst und Farofa", "Manzo, salsiccia e farofa"],
    "Carne bovina, linguiça e farofa.": ["Beef, sausage, and farofa.", "Carne, salchicha y farofa.", "Bœuf, saucisse et farofa.", "Rindfleisch, Bratwurst und Farofa.", "Manzo, salsiccia e farofa."]
  });
  const LOCAL_AI_ROWS = {
    "Uma rede Food-101 executada no navegador sugere categorias de alimentos, porções aproximadas e qualidade da foto. Essas sugestões podem estar erradas e precisam ser revisadas antes do cálculo.": [
      "A Food-101 network running in the browser suggests food categories, approximate portions, and photo quality. These suggestions may be wrong and must be reviewed before calculation.",
      "Una red Food-101 que se ejecuta en el navegador sugiere categorías de alimentos, porciones aproximadas y calidad de la foto. Estas sugerencias pueden ser incorrectas y deben revisarse antes del cálculo.",
      "Un réseau Food-101 exécuté dans le navigateur suggère des catégories d’aliments, des portions approximatives et la qualité de la photo. Ces suggestions peuvent être erronées et doivent être vérifiées avant le calcul.",
      "Ein im Browser ausgeführtes Food-101-Netz schlägt Lebensmittelkategorien, ungefähre Portionen und die Fotoqualität vor. Diese Vorschläge können falsch sein und müssen vor der Berechnung geprüft werden.",
      "Una rete Food-101 eseguita nel browser suggerisce categorie di alimenti, porzioni approssimative e qualità della foto. Questi suggerimenti possono essere errati e devono essere controllati prima del calcolo."
    ],
    "Foto analisada localmente, sem envio a um serviço de IA": ["Photo analyzed locally, without sending it to an AI service", "Foto analizada localmente, sin enviarla a un servicio de IA", "Photo analysée localement, sans envoi à un service d’IA", "Foto lokal analysiert, ohne Übertragung an einen KI-Dienst", "Foto analizzata localmente, senza invio a un servizio di IA"],
    "Primeiro uso baixa o modelo; os próximos aproveitam o cache do navegador": ["The first use downloads the model; later uses rely on the browser cache", "El primer uso descarga el modelo; los siguientes aprovechan la caché del navegador", "La première utilisation télécharge le modèle ; les suivantes utilisent le cache du navigateur", "Bei der ersten Nutzung wird das Modell geladen; spätere Nutzungen verwenden den Browser-Cache", "Il primo utilizzo scarica il modello; i successivi usano la cache del browser"],
    "Análise visual local": ["Local visual analysis", "Análisis visual local", "Analyse visuelle locale", "Lokale Bildanalyse", "Analisi visiva locale"],
    "no navegador": ["in the browser", "en el navegador", "dans le navigateur", "im Browser", "nel browser"],
    "Nenhuma chave de API ou conta é necessária": ["No API key or account is required", "No se necesita una clave de API ni una cuenta", "Aucune clé d’API ni aucun compte n’est nécessaire", "Kein API-Schlüssel und kein Konto erforderlich", "Non servono chiavi API né account"],
    "A rede local devolve apenas sugestões visuais": ["The local network returns visual suggestions only", "La red local devuelve solo sugerencias visuales", "Le réseau local renvoie uniquement des suggestions visuelles", "Das lokale Netz liefert nur visuelle Vorschläge", "La rete locale restituisce solo suggerimenti visivi"],
    "Worker do navegador": ["Browser worker", "Worker del navegador", "Worker du navigateur", "Browser-Worker", "Worker del browser"],
    "IA local Food-101": ["Local Food-101 AI", "IA local Food-101", "IA locale Food-101", "Lokale Food-101-KI", "IA locale Food-101"],
    "A foto da refeição permanece no aparelho durante a análise. Ainda assim, fotografe apenas o prato e revise cuidadosamente as sugestões.": ["The meal photo remains on the device during analysis. Even so, photograph only the plate and carefully review the suggestions.", "La foto de la comida permanece en el dispositivo durante el análisis. Aun así, fotografía solo el plato y revisa cuidadosamente las sugerencias.", "La photo du repas reste sur l’appareil pendant l’analyse. Photographiez néanmoins uniquement l’assiette et vérifiez attentivement les suggestions.", "Das Foto der Mahlzeit bleibt während der Analyse auf dem Gerät. Fotografieren Sie dennoch nur den Teller und prüfen Sie die Vorschläge sorgfältig.", "La foto del pasto rimane sul dispositivo durante l’analisi. Fotografa comunque solo il piatto e controlla attentamente i suggerimenti."],
    "modelo visual local": ["local visual model", "modelo visual local", "modèle visuel local", "lokales Bildmodell", "modello visivo locale"],
    "Executado em worker no navegador": ["Runs in a browser worker", "Se ejecuta en un worker del navegador", "Exécuté dans un worker du navigateur", "Wird in einem Browser-Worker ausgeführt", "Eseguito in un worker del browser"],
    "A foto permanece no aparelho durante a análise. Fotografe somente a refeição e não inclua dados pessoais ou informações desnecessárias.": ["The photo remains on the device during analysis. Photograph only the meal and do not include personal data or unnecessary information.", "La foto permanece en el dispositivo durante el análisis. Fotografía solo la comida y no incluyas datos personales ni información innecesaria.", "La photo reste sur l’appareil pendant l’analyse. Photographiez uniquement le repas et n’incluez pas de données personnelles ni d’informations inutiles.", "Das Foto bleibt während der Analyse auf dem Gerät. Fotografieren Sie nur die Mahlzeit und fügen Sie keine personenbezogenen oder unnötigen Informationen hinzu.", "La foto rimane sul dispositivo durante l’analisi. Fotografa solo il pasto e non includere dati personali o informazioni non necessarie."]
  };
  const MAP_CACHE = new Map();
  const FOOD_KEYS_SORTED = Object.keys(FOOD_ROWS).sort(function (a, b) { return b.length - a.length; });

  function normalizeLanguage(languageCode) {
    return api?.normalizeLanguageCode?.(languageCode || api?.getCurrentLanguage?.()) || FALLBACK;
  }

  function normalizeText(value) {
    return String(value ?? "").trim().replace(/\s+/g, " ");
  }

  function normalizeKey(value) {
    return normalizeText(value).toLocaleLowerCase("pt-BR");
  }

  function normalizeSearch(value) {
    return normalizeText(value).toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function rowStoreName(rows) {
    if (rows === FOOD_ROWS) return "foods";
    if (rows === CATEGORY_ROWS) return "categories";
    return "extras";
  }

  function mapFor(rows, languageCode) {
    const lang = normalizeLanguage(languageCode);
    const index = LANGS.indexOf(lang);
    if (index < 0) return null;
    const cacheKey = rowStoreName(rows) + ":" + lang;
    if (MAP_CACHE.has(cacheKey)) return MAP_CACHE.get(cacheKey);
    const map = new Map();
    Object.entries(rows).forEach(function (entry) {
      map.set(normalizeKey(entry[0]), entry[1][index]);
    });
    MAP_CACHE.set(cacheKey, map);
    return map;
  }

  function exactFrom(rows, value, languageCode) {
    const lang = normalizeLanguage(languageCode);
    if (lang === FALLBACK) return null;
    const map = mapFor(rows, lang);
    return map?.get(normalizeKey(value)) || null;
  }

  function escapeRegExp(value) {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function replaceConnectors(text, lang) {
    const connector = {
      en: { com: "with", e: "and", de: "of", da: "of", do: "of", dos: "of", das: "of", ao: "with", a: "with" },
      es: { com: "con", e: "y", de: "de", da: "de", do: "de", dos: "de", das: "de", ao: "con", a: "con" },
      fr: { com: "avec", e: "et", de: "de", da: "de", do: "de", dos: "de", das: "de", ao: "à la", a: "à" },
      de: { com: "mit", e: "und", de: "von", da: "von", do: "von", dos: "von", das: "von", ao: "mit", a: "mit" },
      it: { com: "con", e: "e", de: "di", da: "di", do: "di", dos: "di", das: "di", ao: "con", a: "con" }
    }[lang];
    if (!connector) return text;
    return text.replace(/\b(com|e|de|da|do|dos|das|ao|a)\b/gi, function (word) {
      return connector[word.toLocaleLowerCase()] || word;
    });
  }

  function shouldTryCompositeTranslation(text) {
    const source = normalizeText(text);
    if (!source || source.length > 120) return false;
    if (/[.!?;:]/.test(source)) return false;
    return source.includes(",") || /\b(com|e|de|da|do|dos|das|ao|a)\b/i.test(source);
  }

  function translateComposite(value, languageCode) {
    const lang = normalizeLanguage(languageCode);
    if (lang === FALLBACK) return null;
    const original = normalizeText(value);
    if (!original) return null;

    if (original.includes(",")) {
      const parts = original.split(",").map(function (part) { return part.trim(); });
      const translatedParts = parts.map(function (part) { return translateText(part, lang) || part; });
      if (translatedParts.some(function (part, index) { return part !== parts[index]; })) {
        return translatedParts.join(", ");
      }
    }

    const foodMap = mapFor(FOOD_ROWS, lang);
    if (!foodMap) return null;
    let text = original;
    const replacements = [];
    FOOD_KEYS_SORTED.forEach(function (key) {
      const translated = foodMap.get(normalizeKey(key));
      if (!translated) return;
      const token = "__PANCREAI_FOOD_" + replacements.length + "__";
      const next = text.replace(new RegExp(escapeRegExp(key), "gi"), token);
      if (next !== text) {
        text = next;
        replacements.push([token, translated]);
      }
    });

    if (!replacements.length) return null;
    text = replaceConnectors(text, lang);
    replacements.forEach(function (pair) {
      text = text.replaceAll(pair[0], pair[1]);
    });
    return text.replace(/\s+/g, " ").trim();
  }

  function translateText(value, languageCode) {
    const lang = normalizeLanguage(languageCode);
    if (lang === FALLBACK) return String(value ?? "");
    const source = normalizeText(value);
    if (!source) return String(value ?? "");
    return exactFrom(LOCAL_AI_ROWS, source, lang)
      || exactFrom(EXTRA_ROWS, source, lang)
      || exactFrom(FOOD_ROWS, source, lang)
      || exactFrom(CATEGORY_ROWS, source, lang)
      || (shouldTryCompositeTranslation(source) ? translateComposite(source, lang) : null)
      || null;
  }

  function translateExactOnly(value, languageCode) {
    const lang = normalizeLanguage(languageCode);
    if (lang === FALLBACK) return String(value ?? "");
    const source = normalizeText(value);
    if (!source) return String(value ?? "");
    return exactFrom(LOCAL_AI_ROWS, source, lang)
      || exactFrom(EXTRA_ROWS, source, lang)
      || exactFrom(FOOD_ROWS, source, lang)
      || exactFrom(CATEGORY_ROWS, source, lang)
      || null;
  }

  function translateFood(name, languageCode) {
    return exactFrom(FOOD_ROWS, name, languageCode) || String(name ?? "");
  }

  function translateCategory(name, languageCode) {
    return exactFrom(CATEGORY_ROWS, name, languageCode) || String(name ?? "");
  }

  function translateMeal(name, languageCode) {
    return translateText(name, languageCode) || String(name ?? "");
  }

  function localizeFood(food, languageCode) {
    return food ? { ...food, displayName: translateFood(food.name, languageCode) } : food;
  }

  function patchNutritionSearch() {
    const db = window.PancreAIData?.nutritionDatabase;
    if (!db || db.__foodI18nSearchPatched) return false;
    const originalSearch = db.search.bind(db);
    db.search = function localizedSearch(query) {
      const base = originalSearch(query);
      const searchText = normalizeSearch(query);
      if (!searchText) return base;
      const lang = normalizeLanguage();
      if (lang === FALLBACK) return base;
      const localized = (db.foods || []).filter(function (food) {
        return normalizeSearch(translateFood(food.name, lang)).includes(searchText)
          || normalizeSearch(translateMeal(food.name, lang)).includes(searchText);
      });
      const seen = new Set();
      return base.concat(localized).filter(function (food) {
        const key = food.id || food.name;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    };
    db.__foodI18nSearchPatched = true;
    return true;
  }

  function apply(root) {
    api?.apply?.(root || document);
  }

  if (api?.registerPhraseTranslator) {
    api.registerPhraseTranslator(function (source, lang) {
      return translateExactOnly(source, lang);
    });
  }

  let patchAttempts = 0;
  function schedulePatchSearch() {
    if (patchNutritionSearch() || patchAttempts > 40) return;
    patchAttempts += 1;
    window.setTimeout(schedulePatchSearch, 80);
  }

  window.PancreAIFoodI18n = {
    translateText,
    translateFood,
    translateMeal,
    translateCategory,
    localizeFood,
    apply,
    patchNutritionSearch
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      schedulePatchSearch();
      apply(document);
    });
  } else {
    schedulePatchSearch();
    apply(document);
  }

  window.addEventListener("pancreai:languagechange", function () {
    apply(document);
  });
})();
