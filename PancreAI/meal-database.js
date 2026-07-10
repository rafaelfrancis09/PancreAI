(function () {
  function mealFood(nome, min, max) {
    return { nome, min, max };
  }

  function meal(nome, categoria, alimentos, acompanhamentos) {
    return {
      nome,
      categoria,
      alimentos,
      acompanhamentos: acompanhamentos || []
    };
  }

  function proteinVariant(label, nome, min, max) {
    return { label, nome, min, max };
  }

  function expandProteinMeals(baseLabel, categoria, baseFoods, proteins, acompanhamentos) {
    return proteins.map((protein) => meal(
      `${baseLabel}${protein.label}`,
      categoria,
      [...baseFoods, mealFood(protein.nome, protein.min, protein.max)],
      acompanhamentos
    ));
  }

  const foodCatalog = [
    { nome: "Arroz branco", fat: 1.1, protein: 2.6, carbs: 28.2, calories: 130 },
    { nome: "Arroz integral", fat: 1.0, protein: 2.7, carbs: 25.8, calories: 124 },
    { nome: "Feijão carioca", fat: 0.8, protein: 8.7, carbs: 20.8, calories: 130 },
    { nome: "Feijão preto", fat: 0.5, protein: 8.9, carbs: 23.7, calories: 132 },
    { nome: "Feijão fradinho", fat: 0.6, protein: 8.1, carbs: 20.0, calories: 120 },
    { nome: "Peito de frango grelhado", fat: 3.6, protein: 31.0, carbs: 0.0, calories: 165 },
    { nome: "Frango desfiado", fat: 4.0, protein: 27.0, carbs: 0.0, calories: 170 },
    { nome: "Coxa de frango assada", fat: 8.1, protein: 26.0, carbs: 0.0, calories: 210 },
    { nome: "Bife grelhado", fat: 12.0, protein: 26.0, carbs: 0.0, calories: 230 },
    { nome: "Patinho moído", fat: 9.0, protein: 26.0, carbs: 0.0, calories: 215 },
    { nome: "Picadinho de carne", fat: 12.8, protein: 22.0, carbs: 4.0, calories: 230 },
    { nome: "Carne de panela", fat: 13.0, protein: 24.0, carbs: 5.0, calories: 240 },
    { nome: "Carne assada", fat: 14.0, protein: 25.0, carbs: 0.0, calories: 250 },
    { nome: "Lombo suíno assado", fat: 9.0, protein: 28.0, carbs: 0.0, calories: 220 },
    { nome: "Pernil assado", fat: 14.0, protein: 25.0, carbs: 0.0, calories: 250 },
    { nome: "Tilápia grelhada", fat: 2.3, protein: 20.1, carbs: 0.0, calories: 96 },
    { nome: "Filé de pescada", fat: 1.8, protein: 19.5, carbs: 0.0, calories: 92 },
    { nome: "Sardinha grelhada", fat: 10.5, protein: 24.0, carbs: 0.0, calories: 208 },
    { nome: "Salmão grelhado", fat: 13.0, protein: 20.0, carbs: 0.0, calories: 208 },
    { nome: "Ovo frito", fat: 11.0, protein: 13.0, carbs: 1.1, calories: 155 },
    { nome: "Ovo cozido", fat: 10.6, protein: 12.6, carbs: 1.1, calories: 143 },
    { nome: "Ovos mexidos", fat: 11.0, protein: 13.5, carbs: 1.4, calories: 160 },
    { nome: "Omelete de queijo", fat: 14.0, protein: 13.0, carbs: 2.0, calories: 180 },
    { nome: "Linguiça acebolada", fat: 27.0, protein: 14.0, carbs: 2.0, calories: 310 },
    { nome: "Calabresa acebolada", fat: 32.0, protein: 15.0, carbs: 1.0, calories: 340 },
    { nome: "Farofa temperada", fat: 9.5, protein: 3.3, carbs: 44.2, calories: 290 },
    { nome: "Vinagrete", fat: 1.5, protein: 0.8, carbs: 5.0, calories: 35 },
    { nome: "Salada verde", fat: 0.5, protein: 1.2, carbs: 4.1, calories: 30 },
    { nome: "Salada de tomate", fat: 0.2, protein: 0.9, carbs: 3.9, calories: 22 },
    { nome: "Brócolis cozido", fat: 0.4, protein: 2.8, carbs: 6.6, calories: 35 },
    { nome: "Abobrinha refogada", fat: 1.9, protein: 1.3, carbs: 4.0, calories: 34 },
    { nome: "Abóbora assada", fat: 0.2, protein: 1.0, carbs: 6.5, calories: 26 },
    { nome: "Couve refogada", fat: 1.8, protein: 2.5, carbs: 6.0, calories: 45 },
    { nome: "Quiabo refogado", fat: 0.4, protein: 1.9, carbs: 7.5, calories: 33 },
    { nome: "Purê de batata", fat: 4.4, protein: 2.2, carbs: 19.5, calories: 150 },
    { nome: "Batata frita", fat: 14.0, protein: 3.5, carbs: 31.0, calories: 280 },
    { nome: "Mandioca cozida", fat: 0.3, protein: 1.2, carbs: 34.0, calories: 140 },
    { nome: "Polenta frita", fat: 8.0, protein: 2.5, carbs: 29.0, calories: 200 },
    { nome: "Macarrão ao sugo", fat: 3.0, protein: 5.5, carbs: 29.0, calories: 180 },
    { nome: "Macarrão à bolonhesa", fat: 7.5, protein: 8.5, carbs: 27.0, calories: 220 },
    { nome: "Macarrão alho e óleo", fat: 6.8, protein: 5.0, carbs: 28.0, calories: 205 },
    { nome: "Lasanha à bolonhesa", fat: 10.2, protein: 12.0, carbs: 34.0, calories: 260 },
    { nome: "Lasanha de frango", fat: 9.5, protein: 13.0, carbs: 32.0, calories: 250 },
    { nome: "Nhoque ao sugo", fat: 3.0, protein: 4.0, carbs: 31.0, calories: 170 },
    { nome: "Risoto de frango", fat: 6.0, protein: 8.5, carbs: 26.0, calories: 190 },
    { nome: "Risoto de legumes", fat: 4.5, protein: 4.0, carbs: 28.0, calories: 170 },
    { nome: "Yakisoba de frango", fat: 6.5, protein: 8.0, carbs: 20.0, calories: 170 },
    { nome: "Yakisoba de carne", fat: 7.5, protein: 9.0, carbs: 20.0, calories: 185 },
    { nome: "Strogonoff de frango", fat: 15.0, protein: 14.0, carbs: 8.0, calories: 230 },
    { nome: "Strogonoff de carne", fat: 16.0, protein: 15.0, carbs: 8.5, calories: 245 },
    { nome: "Feijoada", fat: 17.0, protein: 13.0, carbs: 18.0, calories: 280 },
    { nome: "Torresmo", fat: 34.0, protein: 23.0, carbs: 0.0, calories: 430 },
    { nome: "Costela bovina assada", fat: 24.0, protein: 20.0, carbs: 0.0, calories: 320 },
    { nome: "Picanha grelhada", fat: 20.0, protein: 24.0, carbs: 0.0, calories: 300 },
    { nome: "Kafta grelhada", fat: 15.0, protein: 18.0, carbs: 3.0, calories: 220 },
    { nome: "Quibe assado", fat: 11.0, protein: 12.0, carbs: 16.0, calories: 210 },
    { nome: "Homus", fat: 9.6, protein: 8.0, carbs: 14.0, calories: 166 },
    { nome: "Tabule", fat: 3.0, protein: 2.5, carbs: 12.0, calories: 85 },
    { nome: "Falafel assado", fat: 13.0, protein: 10.0, carbs: 31.0, calories: 250 },
    { nome: "Cuscuz nordestino", fat: 0.7, protein: 3.8, carbs: 36.0, calories: 160 },
    { nome: "Carne seca desfiada", fat: 12.0, protein: 26.0, carbs: 1.0, calories: 230 },
    { nome: "Queijo coalho", fat: 24.0, protein: 21.0, carbs: 3.0, calories: 320 },
    { nome: "Tapioca", fat: 0.1, protein: 0.2, carbs: 43.0, calories: 170 },
    { nome: "Frango desfiado temperado", fat: 4.5, protein: 26.0, carbs: 1.0, calories: 170 },
    { nome: "Queijo minas", fat: 17.0, protein: 17.0, carbs: 3.0, calories: 240 },
    { nome: "Presunto", fat: 7.0, protein: 14.0, carbs: 2.0, calories: 145 },
    { nome: "Peito de peru", fat: 2.0, protein: 17.0, carbs: 2.0, calories: 104 },
    { nome: "Tomate", fat: 0.2, protein: 0.9, carbs: 3.9, calories: 18 },
    { nome: "Alface", fat: 0.2, protein: 1.4, carbs: 2.9, calories: 15 },
    { nome: "Pão francês", fat: 1.4, protein: 8.5, carbs: 54.0, calories: 260 },
    { nome: "Pão integral", fat: 3.3, protein: 12.0, carbs: 43.0, calories: 250 },
    { nome: "Pão de forma", fat: 3.2, protein: 8.0, carbs: 49.0, calories: 265 },
    { nome: "Manteiga", fat: 81.0, protein: 0.8, carbs: 0.6, calories: 717 },
    { nome: "Requeijão", fat: 25.0, protein: 8.0, carbs: 4.0, calories: 280 },
    { nome: "Café com leite", fat: 2.0, protein: 3.0, carbs: 5.0, calories: 60 },
    { nome: "Café preto", fat: 0.0, protein: 0.1, carbs: 0.0, calories: 2 },
    { nome: "Suco de laranja", fat: 0.2, protein: 0.7, carbs: 10.0, calories: 45 },
    { nome: "Suco de uva", fat: 0.1, protein: 0.3, carbs: 14.0, calories: 60 },
    { nome: "Suco verde", fat: 0.3, protein: 1.0, carbs: 8.0, calories: 35 },
    { nome: "Refrigerante cola", fat: 0.0, protein: 0.0, carbs: 10.6, calories: 42 },
    { nome: "Água de coco", fat: 0.2, protein: 0.7, carbs: 3.7, calories: 19 },
    { nome: "Iogurte natural", fat: 3.3, protein: 3.5, carbs: 4.7, calories: 61 },
    { nome: "Granola", fat: 11.0, protein: 10.0, carbs: 64.0, calories: 430 },
    { nome: "Banana", fat: 0.3, protein: 1.3, carbs: 22.8, calories: 89 },
    { nome: "Maçã", fat: 0.2, protein: 0.4, carbs: 13.8, calories: 52 },
    { nome: "Mamão", fat: 0.3, protein: 0.5, carbs: 10.8, calories: 43 },
    { nome: "Morango", fat: 0.3, protein: 0.7, carbs: 7.7, calories: 32 },
    { nome: "Aveia", fat: 7.0, protein: 17.0, carbs: 66.0, calories: 389 },
    { nome: "Barra de cereal", fat: 6.0, protein: 4.0, carbs: 65.0, calories: 380 },
    { nome: "Castanha-do-pará", fat: 66.0, protein: 14.0, carbs: 12.0, calories: 656 },
    { nome: "Amendoim torrado", fat: 49.0, protein: 26.0, carbs: 16.0, calories: 585 },
    { nome: "Pasta de amendoim", fat: 49.0, protein: 25.0, carbs: 21.0, calories: 588 },
    { nome: "Sanduiche natural de frango", fat: 7.0, protein: 13.0, carbs: 22.0, calories: 195 },
    { nome: "Sanduiche natural de atum", fat: 8.0, protein: 14.0, carbs: 21.0, calories: 205 },
    { nome: "Wrap integral de frango", fat: 6.0, protein: 15.0, carbs: 24.0, calories: 210 },
    { nome: "Wrap integral de legumes", fat: 4.0, protein: 6.0, carbs: 26.0, calories: 180 },
    { nome: "Coxinha", fat: 13.0, protein: 9.0, carbs: 30.0, calories: 280 },
    { nome: "Pastel de queijo", fat: 14.0, protein: 7.0, carbs: 27.0, calories: 270 },
    { nome: "Pastel de carne", fat: 15.0, protein: 8.0, carbs: 27.0, calories: 280 },
    { nome: "Empada de frango", fat: 16.0, protein: 8.0, carbs: 22.0, calories: 290 },
    { nome: "Quibe frito", fat: 12.0, protein: 14.0, carbs: 18.0, calories: 230 },
    { nome: "Esfiha de carne", fat: 10.0, protein: 9.0, carbs: 26.0, calories: 220 },
    { nome: "Esfiha de queijo", fat: 11.0, protein: 8.0, carbs: 25.0, calories: 230 },
    { nome: "Hambúrguer bovino", fat: 17.0, protein: 18.0, carbs: 24.0, calories: 320 },
    { nome: "Pão de hambúrguer", fat: 3.8, protein: 8.0, carbs: 47.0, calories: 270 },
    { nome: "Queijo cheddar", fat: 33.0, protein: 24.0, carbs: 1.3, calories: 402 },
    { nome: "Bacon", fat: 42.0, protein: 12.0, carbs: 1.4, calories: 460 },
    { nome: "Hambúrguer de frango", fat: 12.0, protein: 17.0, carbs: 18.0, calories: 250 },
    { nome: "Salsicha", fat: 18.0, protein: 12.0, carbs: 2.0, calories: 240 },
    { nome: "Molho de tomate", fat: 0.8, protein: 1.4, carbs: 7.0, calories: 39 },
    { nome: "Milho", fat: 1.5, protein: 3.4, carbs: 19.0, calories: 96 },
    { nome: "Ervilha", fat: 0.4, protein: 5.0, carbs: 14.0, calories: 81 },
    { nome: "Batata palha", fat: 34.0, protein: 6.0, carbs: 52.0, calories: 520 },
    { nome: "Pizza de mussarela", fat: 12.0, protein: 15.0, carbs: 36.0, calories: 280 },
    { nome: "Pizza de calabresa", fat: 14.0, protein: 15.0, carbs: 34.0, calories: 295 },
    { nome: "Pizza de frango com catupiry", fat: 15.0, protein: 16.0, carbs: 33.0, calories: 300 },
    { nome: "Pizza portuguesa", fat: 13.5, protein: 15.0, carbs: 35.0, calories: 290 },
    { nome: "Pizza margherita", fat: 11.0, protein: 13.0, carbs: 34.0, calories: 270 },
    { nome: "Temaki de salmão", fat: 8.0, protein: 11.0, carbs: 18.0, calories: 190 },
    { nome: "Sushi combinado", fat: 2.5, protein: 7.0, carbs: 24.0, calories: 150 },
    { nome: "Sashimi de salmão", fat: 13.0, protein: 20.0, carbs: 0.0, calories: 208 },
    { nome: "Shimeji na manteiga", fat: 6.0, protein: 3.0, carbs: 6.0, calories: 80 },
    { nome: "Guioza grelhado", fat: 7.0, protein: 8.0, carbs: 20.0, calories: 180 },
    { nome: "Taco de carne", fat: 11.0, protein: 10.0, carbs: 22.0, calories: 240 },
    { nome: "Burrito de frango", fat: 10.0, protein: 12.0, carbs: 28.0, calories: 250 },
    { nome: "Quesadilla de queijo", fat: 13.0, protein: 11.0, carbs: 24.0, calories: 260 },
    { nome: "Chili com carne", fat: 8.0, protein: 11.0, carbs: 18.0, calories: 180 },
    { nome: "Guacamole", fat: 14.0, protein: 2.0, carbs: 9.0, calories: 160 },
    { nome: "Acaraje", fat: 19.0, protein: 8.0, carbs: 28.0, calories: 290 },
    { nome: "Vatapa", fat: 13.0, protein: 5.0, carbs: 12.0, calories: 180 },
    { nome: "Moqueca baiana", fat: 11.5, protein: 17.0, carbs: 4.0, calories: 190 },
    { nome: "Moqueca capixaba", fat: 7.0, protein: 18.0, carbs: 3.0, calories: 150 },
    { nome: "Bobó de camarão", fat: 12.0, protein: 10.0, carbs: 15.0, calories: 210 },
    { nome: "Camarao grelhado", fat: 1.5, protein: 24.0, carbs: 0.0, calories: 110 },
    { nome: "Arroz de carreteiro", fat: 8.5, protein: 11.0, carbs: 24.0, calories: 210 },
    { nome: "Galinhada", fat: 6.0, protein: 11.0, carbs: 21.0, calories: 175 },
    { nome: "Pirao", fat: 2.2, protein: 1.7, carbs: 18.0, calories: 95 },
    { nome: "Escondidinho de carne seca", fat: 10.0, protein: 10.0, carbs: 24.0, calories: 220 },
    { nome: "Panqueca de carne", fat: 8.0, protein: 9.0, carbs: 20.0, calories: 190 },
    { nome: "Panqueca de frango", fat: 7.0, protein: 10.0, carbs: 19.0, calories: 185 },
    { nome: "Sopa de legumes", fat: 2.5, protein: 2.5, carbs: 10.0, calories: 70 },
    { nome: "Caldo verde", fat: 7.0, protein: 4.0, carbs: 9.0, calories: 115 },
    { nome: "Creme de abóbora", fat: 3.5, protein: 1.8, carbs: 11.0, calories: 75 },
    { nome: "Salada de quinoa", fat: 4.0, protein: 5.0, carbs: 19.0, calories: 140 },
    { nome: "Quinoa cozida", fat: 2.0, protein: 4.4, carbs: 21.0, calories: 120 },
    { nome: "Grao-de-bico cozido", fat: 2.6, protein: 8.9, carbs: 27.4, calories: 164 },
    { nome: "Lentilha cozida", fat: 0.4, protein: 9.0, carbs: 20.0, calories: 116 },
    { nome: "Tofu grelhado", fat: 8.0, protein: 14.0, carbs: 3.0, calories: 145 },
    { nome: "Tofu mexido", fat: 7.0, protein: 11.0, carbs: 3.5, calories: 120 },
    { nome: "Hambúrguer de grão-de-bico", fat: 8.0, protein: 9.0, carbs: 23.0, calories: 210 },
    { nome: "Hambúrguer de lentilha", fat: 6.0, protein: 10.0, carbs: 22.0, calories: 190 },
    { nome: "Berinjela assada", fat: 1.2, protein: 1.0, carbs: 8.0, calories: 45 },
    { nome: "Legumes grelhados", fat: 2.5, protein: 2.0, carbs: 8.0, calories: 60 },
    { nome: "Salada de folhas com manga", fat: 2.0, protein: 1.5, carbs: 10.0, calories: 60 },
    { nome: "Azeite", fat: 100.0, protein: 0.0, carbs: 0.0, calories: 884 },
    { nome: "Molho pesto", fat: 28.0, protein: 4.0, carbs: 6.0, calories: 290 },
    { nome: "Queijo ralado", fat: 28.0, protein: 35.0, carbs: 3.0, calories: 390 },
    { nome: "Pudim de leite", fat: 7.0, protein: 5.0, carbs: 25.0, calories: 180 },
    { nome: "Mousse de chocolate", fat: 12.0, protein: 4.0, carbs: 24.0, calories: 220 },
    { nome: "Brigadeiro", fat: 11.0, protein: 3.0, carbs: 22.0, calories: 180 },
    { nome: "Canjica", fat: 3.2, protein: 2.8, carbs: 23.0, calories: 130 },
    { nome: "Pamonha", fat: 6.2, protein: 3.0, carbs: 28.0, calories: 180 },
    { nome: "Acai com banana", fat: 5.0, protein: 2.0, carbs: 22.0, calories: 145 },
    { nome: "Leite em po", fat: 26.0, protein: 26.0, carbs: 38.0, calories: 496 },
    { nome: "Leite condensado", fat: 8.0, protein: 7.0, carbs: 56.0, calories: 320 },
    { nome: "Paçoca", fat: 26.0, protein: 18.0, carbs: 40.0, calories: 500 },
    { nome: "Banana com canela", fat: 0.3, protein: 1.3, carbs: 23.0, calories: 92 },
    { nome: "Nuggets de frango", fat: 16.0, protein: 14.0, carbs: 18.0, calories: 260 },
    { nome: "Arroz com legumes", fat: 2.0, protein: 3.5, carbs: 25.0, calories: 140 },
    { nome: "Mini pizza de mussarela", fat: 12.0, protein: 12.0, carbs: 28.0, calories: 240 },
    { nome: "Macarrão com molho suave", fat: 3.0, protein: 5.0, carbs: 27.0, calories: 170 },
    { nome: "Filé de frango empanado", fat: 9.0, protein: 21.0, carbs: 10.0, calories: 220 },
    { nome: "Filé de peixe empanado", fat: 8.0, protein: 18.0, carbs: 12.0, calories: 200 },
    { nome: "Mini hambúrguer", fat: 14.0, protein: 14.0, carbs: 21.0, calories: 240 },
    { nome: "Suco de caixinha", fat: 0.1, protein: 0.1, carbs: 11.0, calories: 44 },
    { nome: "Bolo simples", fat: 12.0, protein: 5.0, carbs: 48.0, calories: 320 },
    { nome: "Panqueca americana", fat: 7.0, protein: 6.0, carbs: 35.0, calories: 220 },
    { nome: "Waffle", fat: 10.0, protein: 6.0, carbs: 33.0, calories: 240 },
    { nome: "Iogurte grego", fat: 5.0, protein: 9.0, carbs: 8.0, calories: 100 },
    { nome: "Mel", fat: 0.0, protein: 0.3, carbs: 82.0, calories: 304 },
    { nome: "Chia", fat: 31.0, protein: 17.0, carbs: 42.0, calories: 486 },
    { nome: "Abacate", fat: 15.0, protein: 2.0, carbs: 9.0, calories: 160 },
    { nome: "Cenoura ralada", fat: 0.2, protein: 0.9, carbs: 10.0, calories: 41 },
    { nome: "Beterraba cozida", fat: 0.1, protein: 1.6, carbs: 9.6, calories: 43 },
    { nome: "Pepino", fat: 0.1, protein: 0.7, carbs: 3.6, calories: 16 },
    { nome: "Molho de iogurte", fat: 3.0, protein: 2.0, carbs: 4.0, calories: 55 }
  ];

  const accompaniments = {
    brasileiro: [
      mealFood("Farofa temperada", 18, 45),
      mealFood("Vinagrete", 20, 55),
      mealFood("Suco de laranja", 180, 300)
    ],
    massa: [
      mealFood("Queijo ralado", 8, 22),
      mealFood("Suco de uva", 180, 300),
      mealFood("Azeite", 8, 18)
    ],
    fastFood: [
      mealFood("Batata frita", 70, 140),
      mealFood("Refrigerante cola", 220, 400),
      mealFood("Suco de caixinha", 180, 300)
    ],
    cafe: [
      mealFood("Café com leite", 160, 260),
      mealFood("Suco de laranja", 180, 280),
      mealFood("Iogurte natural", 120, 180)
    ],
    saudavel: [
      mealFood("Suco verde", 180, 280),
      mealFood("Azeite", 8, 16),
      mealFood("Molho de iogurte", 20, 45)
    ],
    japones: [
      mealFood("Shimeji na manteiga", 60, 120),
      mealFood("Guioza grelhado", 60, 120)
    ],
    mexicano: [
      mealFood("Guacamole", 35, 80),
      mealFood("Refrigerante cola", 220, 400)
    ],
    arabe: [
      mealFood("Homus", 45, 90),
      mealFood("Tabule", 45, 90)
    ],
    sobremesa: [
      mealFood("Paçoca", 20, 45),
      mealFood("Leite condensado", 18, 40)
    ],
    infantil: [
      mealFood("Suco de caixinha", 180, 250),
      mealFood("Batata frita", 55, 120)
    ]
  };

  const breakfastBreads = [
    meal("Pão francês com ovos mexidos", "Café da manhã", [mealFood("Pão francês", 50, 70), mealFood("Ovos mexidos", 80, 130)], accompaniments.cafe),
    meal("Pão na chapa com café com leite", "Café da manhã", [mealFood("Pão francês", 50, 70), mealFood("Manteiga", 8, 16), mealFood("Café com leite", 180, 260)], accompaniments.cafe),
    meal("Pão integral com queijo minas e tomate", "Café da manhã", [mealFood("Pão integral", 50, 80), mealFood("Queijo minas", 35, 70), mealFood("Tomate", 20, 50)], accompaniments.cafe),
    meal("Pão francês com presunto e queijo", "Café da manhã", [mealFood("Pão francês", 50, 70), mealFood("Presunto", 25, 45), mealFood("Queijo minas", 25, 45)], accompaniments.cafe),
    meal("Pão integral com pasta de amendoim e banana", "Café da manhã", [mealFood("Pão integral", 50, 80), mealFood("Pasta de amendoim", 18, 35), mealFood("Banana", 70, 110)], accompaniments.cafe),
    meal("Pão de forma com requeijão e peito de peru", "Café da manhã", [mealFood("Pão de forma", 50, 80), mealFood("Requeijão", 18, 35), mealFood("Peito de peru", 25, 45)], accompaniments.cafe)
  ];

  const breakfastTapiocas = [
    meal("Tapioca com queijo minas", "Café da manhã", [mealFood("Tapioca", 70, 130), mealFood("Queijo minas", 35, 70)], accompaniments.cafe),
    meal("Tapioca com frango desfiado", "Café da manhã", [mealFood("Tapioca", 70, 130), mealFood("Frango desfiado temperado", 50, 100)], accompaniments.cafe),
    meal("Tapioca com banana e mel", "Café da manhã", [mealFood("Tapioca", 70, 130), mealFood("Banana", 60, 100), mealFood("Mel", 10, 20)], accompaniments.cafe),
    meal("Tapioca com ovo e queijo coalho", "Café da manhã", [mealFood("Tapioca", 70, 130), mealFood("Ovo cozido", 45, 70), mealFood("Queijo coalho", 30, 60)], accompaniments.cafe),
    meal("Tapioca com pasta de amendoim", "Café da manhã", [mealFood("Tapioca", 70, 130), mealFood("Pasta de amendoim", 18, 35)], accompaniments.cafe),
    meal("Tapioca com presunto e queijo", "Café da manhã", [mealFood("Tapioca", 70, 130), mealFood("Presunto", 25, 45), mealFood("Queijo minas", 25, 45)], accompaniments.cafe)
  ];

  const breakfastCuscuz = [
    meal("Cuscuz nordestino com ovos", "Café da manhã", [mealFood("Cuscuz nordestino", 100, 180), mealFood("Ovos mexidos", 80, 130)], accompaniments.cafe),
    meal("Cuscuz com queijo coalho", "Café da manhã", [mealFood("Cuscuz nordestino", 100, 180), mealFood("Queijo coalho", 35, 70)], accompaniments.cafe),
    meal("Cuscuz com carne seca", "Café da manhã", [mealFood("Cuscuz nordestino", 100, 180), mealFood("Carne seca desfiada", 45, 90)], accompaniments.cafe),
    meal("Cuscuz com frango desfiado", "Café da manhã", [mealFood("Cuscuz nordestino", 100, 180), mealFood("Frango desfiado temperado", 45, 90)], accompaniments.cafe),
    meal("Cuscuz com banana e queijo", "Café da manhã", [mealFood("Cuscuz nordestino", 100, 180), mealFood("Banana", 50, 90), mealFood("Queijo minas", 25, 50)], accompaniments.cafe)
  ];

  const breakfastPlates = [
    meal("Iogurte com granola e banana", "Café da manhã", [mealFood("Iogurte natural", 140, 220), mealFood("Granola", 25, 45), mealFood("Banana", 60, 100)], accompaniments.cafe),
    meal("Iogurte grego com morango e chia", "Café da manhã", [mealFood("Iogurte grego", 120, 180), mealFood("Morango", 60, 110), mealFood("Chia", 8, 18)], accompaniments.cafe),
    meal("Panqueca americana com mel e frutas", "Café da manhã", [mealFood("Panqueca americana", 120, 200), mealFood("Mel", 10, 20), mealFood("Morango", 40, 90)], accompaniments.cafe),
    meal("Waffle com banana e mel", "Café da manhã", [mealFood("Waffle", 110, 180), mealFood("Banana", 60, 100), mealFood("Mel", 10, 20)], accompaniments.cafe),
    meal("Café da manhã americano com ovos e pão", "Café da manhã", [mealFood("Ovos mexidos", 90, 140), mealFood("Pão de forma", 50, 90), mealFood("Manteiga", 8, 14)], accompaniments.cafe),
    meal("Café colonial com pão, queijo e bolo simples", "Café da manhã", [mealFood("Pão francês", 50, 80), mealFood("Queijo minas", 30, 60), mealFood("Bolo simples", 50, 100)], accompaniments.cafe),
    meal("Vitamina de banana com aveia", "Café da manhã", [mealFood("Banana", 80, 130), mealFood("Aveia", 20, 35), mealFood("Café com leite", 180, 260)], accompaniments.cafe),
    meal("Pão integral com omelete de queijo", "Café da manhã", [mealFood("Pão integral", 50, 80), mealFood("Omelete de queijo", 90, 150)], accompaniments.cafe)
  ];

  const morningSnacks = [
    meal("Iogurte natural com granola", "Lanche da manhã", [mealFood("Iogurte natural", 130, 200), mealFood("Granola", 20, 40)], accompaniments.saudavel),
    meal("Banana com pasta de amendoim", "Lanche da manhã", [mealFood("Banana", 70, 110), mealFood("Pasta de amendoim", 15, 30)], accompaniments.saudavel),
    meal("Maçã com castanha-do-pará", "Lanche da manhã", [mealFood("Maçã", 100, 160), mealFood("Castanha-do-pará", 12, 22)], accompaniments.saudavel),
    meal("Mamão com chia", "Lanche da manhã", [mealFood("Mamão", 110, 180), mealFood("Chia", 8, 16)], accompaniments.saudavel),
    meal("Barra de cereal e iogurte", "Lanche da manhã", [mealFood("Barra de cereal", 22, 40), mealFood("Iogurte natural", 130, 180)], accompaniments.saudavel),
    meal("Sanduiche natural de frango", "Lanche da manhã", [mealFood("Sanduiche natural de frango", 120, 190)], accompaniments.saudavel),
    meal("Sanduiche natural de atum", "Lanche da manhã", [mealFood("Sanduiche natural de atum", 120, 190)], accompaniments.saudavel),
    meal("Wrap integral de frango", "Lanche da manhã", [mealFood("Wrap integral de frango", 120, 200)], accompaniments.saudavel),
    meal("Wrap integral de legumes", "Lanche da manhã", [mealFood("Wrap integral de legumes", 120, 190)], accompaniments.saudavel),
    meal("Morango com iogurte grego", "Lanche da manhã", [mealFood("Morango", 70, 130), mealFood("Iogurte grego", 120, 180)], accompaniments.saudavel),
    meal("Banana com aveia", "Lanche da manhã", [mealFood("Banana", 70, 110), mealFood("Aveia", 15, 30)], accompaniments.saudavel),
    meal("Mix de frutas com granola", "Lanche da manhã", [mealFood("Banana", 50, 90), mealFood("Maçã", 60, 100), mealFood("Granola", 20, 35)], accompaniments.saudavel),
    meal("Iogurte com banana e mel", "Lanche da manhã", [mealFood("Iogurte natural", 130, 190), mealFood("Banana", 60, 100), mealFood("Mel", 8, 16)], accompaniments.saudavel),
    meal("Maçã com pasta de amendoim", "Lanche da manhã", [mealFood("Maçã", 100, 160), mealFood("Pasta de amendoim", 15, 28)], accompaniments.saudavel),
    meal("Barra de cereal com suco de laranja", "Lanche da manhã", [mealFood("Barra de cereal", 22, 40), mealFood("Suco de laranja", 180, 260)], accompaniments.saudavel)
  ];

  const classicLunchProteins = [
    proteinVariant("frango grelhado", "Peito de frango grelhado", 100, 220),
    proteinVariant("bife grelhado", "Bife grelhado", 100, 220),
    proteinVariant("tilapia grelhada", "Tilápia grelhada", 110, 220),
    proteinVariant("ovo frito", "Ovo frito", 90, 140),
    proteinVariant("patinho moído", "Patinho moído", 100, 190),
    proteinVariant("carne de panela", "Carne de panela", 110, 220),
    proteinVariant("picadinho de carne", "Picadinho de carne", 110, 220),
    proteinVariant("coxa de frango assada", "Coxa de frango assada", 110, 220),
    proteinVariant("lombo suino assado", "Lombo suíno assado", 110, 220),
    proteinVariant("pernil assado", "Pernil assado", 110, 220),
    proteinVariant("sardinha grelhada", "Sardinha grelhada", 90, 160),
    proteinVariant("filé de pescada", "Filé de pescada", 100, 200),
    proteinVariant("linguica acebolada", "Linguiça acebolada", 90, 160),
    proteinVariant("calabresa acebolada", "Calabresa acebolada", 80, 150)
  ];

  const classicLunches = expandProteinMeals(
    "Arroz branco, feijão carioca e ",
    "Almoço",
    [mealFood("Arroz branco", 120, 220), mealFood("Feijão carioca", 70, 130), mealFood("Salada verde", 30, 80)],
    classicLunchProteins,
    accompaniments.brasileiro
  );

  const lunchSpecials = [
    meal("Arroz integral, feijão preto e salmão grelhado", "Almoço", [mealFood("Arroz integral", 120, 210), mealFood("Feijão preto", 70, 130), mealFood("Salmão grelhado", 100, 180), mealFood("Brócolis cozido", 40, 90)], accompaniments.saudavel),
    meal("Arroz branco, tutu de feijão e bisteca suína", "Almoço", [mealFood("Arroz branco", 120, 220), mealFood("Feijão preto", 70, 120), mealFood("Lombo suíno assado", 110, 210), mealFood("Couve refogada", 30, 70)], accompaniments.brasileiro),
    meal("Arroz branco, feijão preto e picanha grelhada", "Almoço", [mealFood("Arroz branco", 120, 220), mealFood("Feijão preto", 70, 130), mealFood("Picanha grelhada", 110, 220), mealFood("Salada de tomate", 30, 70)], accompaniments.brasileiro),
    meal("Arroz branco, feijão carioca e frango desfiado", "Almoço", [mealFood("Arroz branco", 120, 220), mealFood("Feijão carioca", 70, 130), mealFood("Frango desfiado", 100, 180), mealFood("Abóbora assada", 40, 90)], accompaniments.brasileiro),
    meal("Arroz branco, feijão fradinho e peixe grelhado", "Almoço", [mealFood("Arroz branco", 110, 210), mealFood("Feijão fradinho", 70, 120), mealFood("Filé de pescada", 110, 200), mealFood("Salada verde", 30, 80)], accompaniments.brasileiro),
    meal("Arroz branco, lentilha e carne assada", "Almoço", [mealFood("Arroz branco", 110, 210), mealFood("Lentilha cozida", 70, 130), mealFood("Carne assada", 110, 220), mealFood("Salada verde", 30, 80)], accompaniments.brasileiro),
    meal("Arroz branco, grão-de-bico e frango grelhado", "Almoço", [mealFood("Arroz branco", 110, 210), mealFood("Grao-de-bico cozido", 70, 130), mealFood("Peito de frango grelhado", 100, 220), mealFood("Pepino", 20, 60)], accompaniments.saudavel),
    meal("Arroz de carreteiro com salada", "Almoço", [mealFood("Arroz de carreteiro", 180, 300), mealFood("Salada verde", 30, 80)], accompaniments.brasileiro),
    meal("Galinhada com salada de tomate", "Almoço", [mealFood("Galinhada", 180, 300), mealFood("Salada de tomate", 30, 70)], accompaniments.brasileiro),
    meal("Panqueca de carne com arroz branco", "Almoço", [mealFood("Panqueca de carne", 180, 280), mealFood("Arroz branco", 90, 170), mealFood("Salada verde", 30, 80)], accompaniments.brasileiro)
  ];

  const regionalMeals = [
    meal("Feijoada completa", "Almoço", [mealFood("Feijoada", 180, 320), mealFood("Arroz branco", 90, 160), mealFood("Couve refogada", 30, 70)], accompaniments.brasileiro),
    meal("Churrasco com arroz, farofa e vinagrete", "Almoço", [mealFood("Picanha grelhada", 110, 220), mealFood("Arroz branco", 90, 170), mealFood("Farofa temperada", 20, 45), mealFood("Vinagrete", 20, 50)], accompaniments.brasileiro),
    meal("Moqueca baiana com arroz branco", "Almoço", [mealFood("Moqueca baiana", 180, 280), mealFood("Arroz branco", 100, 180), mealFood("Pirao", 60, 110)], accompaniments.brasileiro),
    meal("Moqueca capixaba com arroz branco", "Almoço", [mealFood("Moqueca capixaba", 180, 280), mealFood("Arroz branco", 100, 180), mealFood("Pirao", 60, 110)], accompaniments.brasileiro),
    meal("Bobó de camarão com arroz branco", "Almoço", [mealFood("Bobó de camarão", 180, 280), mealFood("Arroz branco", 100, 180)], accompaniments.brasileiro),
    meal("Acaraje com vatapa", "Almoço", [mealFood("Acaraje", 130, 220), mealFood("Vatapa", 50, 100)], accompaniments.brasileiro),
    meal("Escondidinho de carne seca", "Almoço", [mealFood("Escondidinho de carne seca", 180, 300), mealFood("Salada verde", 30, 80)], accompaniments.brasileiro),
    meal("Carne de panela com purê e arroz", "Almoço", [mealFood("Carne de panela", 110, 220), mealFood("Purê de batata", 90, 180), mealFood("Arroz branco", 90, 170)], accompaniments.brasileiro),
    meal("Picadinho com arroz e farofa", "Almoço", [mealFood("Picadinho de carne", 130, 220), mealFood("Arroz branco", 100, 180), mealFood("Farofa temperada", 18, 40)], accompaniments.brasileiro),
    meal("Frango à parmegiana com arroz e salada", "Almoço", [mealFood("Filé de frango empanado", 130, 220), mealFood("Molho de tomate", 40, 90), mealFood("Queijo minas", 25, 50), mealFood("Arroz branco", 90, 170), mealFood("Salada verde", 30, 80)], accompaniments.brasileiro),
    meal("Tilápia grelhada com mandioca cozida", "Almoço", [mealFood("Tilápia grelhada", 110, 220), mealFood("Mandioca cozida", 90, 180), mealFood("Salada verde", 30, 80)], accompaniments.brasileiro),
    meal("Kafta com arroz e tabule", "Almoço", [mealFood("Kafta grelhada", 110, 200), mealFood("Arroz branco", 90, 170), mealFood("Tabule", 45, 90)], accompaniments.arabe)
  ];

  const internationalMeals = [
    meal("Macarrão à bolonhesa com queijo ralado", "Almoço", [mealFood("Macarrão à bolonhesa", 190, 320), mealFood("Queijo ralado", 8, 18)], accompaniments.massa),
    meal("Macarrão ao sugo com frango grelhado", "Almoço", [mealFood("Macarrão ao sugo", 180, 300), mealFood("Peito de frango grelhado", 100, 180)], accompaniments.massa),
    meal("Macarrão alho e óleo com brócolis", "Almoço", [mealFood("Macarrão alho e óleo", 170, 280), mealFood("Brócolis cozido", 40, 90)], accompaniments.massa),
    meal("Lasanha à bolonhesa", "Almoço", [mealFood("Lasanha à bolonhesa", 200, 320), mealFood("Salada verde", 30, 80)], accompaniments.massa),
    meal("Lasanha de frango com salada", "Almoço", [mealFood("Lasanha de frango", 200, 320), mealFood("Salada verde", 30, 80)], accompaniments.massa),
    meal("Nhoque ao sugo com queijo ralado", "Almoço", [mealFood("Nhoque ao sugo", 180, 300), mealFood("Queijo ralado", 8, 18)], accompaniments.massa),
    meal("Risoto de frango com salada", "Almoço", [mealFood("Risoto de frango", 180, 300), mealFood("Salada verde", 30, 80)], accompaniments.massa),
    meal("Risoto de legumes com frango grelhado", "Almoço", [mealFood("Risoto de legumes", 180, 300), mealFood("Peito de frango grelhado", 90, 170)], accompaniments.massa),
    meal("Yakisoba de frango", "Almoço", [mealFood("Yakisoba de frango", 180, 300)], accompaniments.japones),
    meal("Yakisoba de carne", "Almoço", [mealFood("Yakisoba de carne", 180, 300)], accompaniments.japones),
    meal("Sushi combinado com sashimi de salmão", "Jantar", [mealFood("Sushi combinado", 180, 320), mealFood("Sashimi de salmão", 70, 140)], accompaniments.japones),
    meal("Temaki de salmão com guioza grelhado", "Jantar", [mealFood("Temaki de salmão", 130, 220), mealFood("Guioza grelhado", 60, 120)], accompaniments.japones),
    meal("Taco de carne com guacamole", "Jantar", [mealFood("Taco de carne", 160, 260), mealFood("Guacamole", 35, 80)], accompaniments.mexicano),
    meal("Burrito de frango com salada", "Jantar", [mealFood("Burrito de frango", 180, 300), mealFood("Salada verde", 30, 80)], accompaniments.mexicano),
    meal("Quesadilla de queijo com guacamole", "Jantar", [mealFood("Quesadilla de queijo", 170, 270), mealFood("Guacamole", 35, 80)], accompaniments.mexicano),
    meal("Chili com carne e arroz branco", "Jantar", [mealFood("Chili com carne", 180, 280), mealFood("Arroz branco", 90, 160)], accompaniments.mexicano),
    meal("Quibe assado com tabule", "Jantar", [mealFood("Quibe assado", 180, 260), mealFood("Tabule", 50, 100)], accompaniments.arabe),
    meal("Falafel com homus e salada", "Jantar", [mealFood("Falafel assado", 160, 240), mealFood("Homus", 45, 90), mealFood("Salada verde", 30, 80)], accompaniments.arabe)
  ];

  const afternoonSnacks = [
    meal("Coxinha com suco de laranja", "Lanche da tarde", [mealFood("Coxinha", 120, 190), mealFood("Suco de laranja", 180, 260)], accompaniments.fastFood),
    meal("Pastel de queijo com refrigerante", "Lanche da tarde", [mealFood("Pastel de queijo", 120, 190), mealFood("Refrigerante cola", 220, 350)], accompaniments.fastFood),
    meal("Pastel de carne com suco", "Lanche da tarde", [mealFood("Pastel de carne", 120, 190), mealFood("Suco de laranja", 180, 260)], accompaniments.fastFood),
    meal("Empada de frango com café", "Lanche da tarde", [mealFood("Empada de frango", 100, 170), mealFood("Café preto", 120, 220)], accompaniments.cafe),
    meal("Quibe frito com suco de uva", "Lanche da tarde", [mealFood("Quibe frito", 100, 170), mealFood("Suco de uva", 180, 260)], accompaniments.fastFood),
    meal("Esfiha de carne com suco", "Lanche da tarde", [mealFood("Esfiha de carne", 110, 180), mealFood("Suco de laranja", 180, 260)], accompaniments.arabe),
    meal("Esfiha de queijo com café com leite", "Lanche da tarde", [mealFood("Esfiha de queijo", 110, 180), mealFood("Café com leite", 180, 260)], accompaniments.cafe),
    meal("Sanduiche natural de frango com suco verde", "Lanche da tarde", [mealFood("Sanduiche natural de frango", 120, 190), mealFood("Suco verde", 180, 260)], accompaniments.saudavel),
    meal("Sanduiche natural de atum com agua de coco", "Lanche da tarde", [mealFood("Sanduiche natural de atum", 120, 190), mealFood("Água de coco", 180, 280)], accompaniments.saudavel),
    meal("Wrap integral de frango com iogurte", "Lanche da tarde", [mealFood("Wrap integral de frango", 120, 200), mealFood("Iogurte natural", 120, 180)], accompaniments.saudavel),
    meal("Wrap integral de legumes com suco verde", "Lanche da tarde", [mealFood("Wrap integral de legumes", 120, 190), mealFood("Suco verde", 180, 260)], accompaniments.saudavel),
    meal("Tapioca com queijo minas", "Lanche da tarde", [mealFood("Tapioca", 70, 130), mealFood("Queijo minas", 35, 70)], accompaniments.cafe),
    meal("Tapioca com frango desfiado", "Lanche da tarde", [mealFood("Tapioca", 70, 130), mealFood("Frango desfiado temperado", 50, 100)], accompaniments.cafe),
    meal("Cuscuz com queijo coalho", "Lanche da tarde", [mealFood("Cuscuz nordestino", 100, 180), mealFood("Queijo coalho", 35, 70)], accompaniments.cafe),
    meal("Pão francês com manteiga e café", "Lanche da tarde", [mealFood("Pão francês", 50, 70), mealFood("Manteiga", 8, 16), mealFood("Café preto", 120, 220)], accompaniments.cafe),
    meal("Pão integral com requeijão", "Lanche da tarde", [mealFood("Pão integral", 50, 80), mealFood("Requeijão", 18, 35)], accompaniments.cafe),
    meal("Iogurte com granola e morango", "Lanche da tarde", [mealFood("Iogurte natural", 130, 200), mealFood("Granola", 20, 40), mealFood("Morango", 60, 100)], accompaniments.saudavel),
    meal("Banana com aveia e mel", "Lanche da tarde", [mealFood("Banana", 70, 110), mealFood("Aveia", 15, 30), mealFood("Mel", 8, 16)], accompaniments.saudavel),
    meal("Barra de cereal com agua de coco", "Lanche da tarde", [mealFood("Barra de cereal", 22, 40), mealFood("Água de coco", 180, 280)], accompaniments.saudavel),
    meal("Bolo simples com café com leite", "Lanche da tarde", [mealFood("Bolo simples", 50, 100), mealFood("Café com leite", 180, 260)], accompaniments.cafe)
  ];

  const dinners = [
    meal("Sopa de legumes com frango desfiado", "Jantar", [mealFood("Sopa de legumes", 220, 360), mealFood("Frango desfiado", 60, 120)], accompaniments.saudavel),
    meal("Caldo verde com pão francês", "Jantar", [mealFood("Caldo verde", 220, 340), mealFood("Pão francês", 40, 70)], accompaniments.cafe),
    meal("Creme de abóbora com frango grelhado", "Jantar", [mealFood("Creme de abóbora", 220, 340), mealFood("Peito de frango grelhado", 80, 150)], accompaniments.saudavel),
    meal("Omelete de queijo com salada", "Jantar", [mealFood("Omelete de queijo", 110, 180), mealFood("Salada verde", 40, 90)], accompaniments.saudavel),
    meal("Arroz integral com salmão grelhado e brócolis", "Jantar", [mealFood("Arroz integral", 100, 180), mealFood("Salmão grelhado", 100, 180), mealFood("Brócolis cozido", 40, 90)], accompaniments.saudavel),
    meal("Tilápia grelhada com legumes", "Jantar", [mealFood("Tilápia grelhada", 100, 180), mealFood("Legumes grelhados", 80, 150)], accompaniments.saudavel),
    meal("Panqueca de frango com salada", "Jantar", [mealFood("Panqueca de frango", 170, 260), mealFood("Salada verde", 30, 80)], accompaniments.brasileiro),
    meal("Quinoa com frango grelhado e legumes", "Jantar", [mealFood("Quinoa cozida", 110, 180), mealFood("Peito de frango grelhado", 90, 160), mealFood("Legumes grelhados", 70, 140)], accompaniments.saudavel),
    meal("Salada completa com frango", "Jantar", [mealFood("Salada verde", 70, 140), mealFood("Peito de frango grelhado", 90, 160), mealFood("Tomate", 30, 60), mealFood("Cenoura ralada", 20, 45)], accompaniments.saudavel),
    meal("Salada completa com atum e grão-de-bico", "Jantar", [mealFood("Salada verde", 70, 140), mealFood("Grao-de-bico cozido", 70, 120), mealFood("Pepino", 20, 50), mealFood("Tomate", 20, 50)], accompaniments.saudavel),
    meal("Macarrão ao pesto com salada", "Jantar", [mealFood("Macarrão ao sugo", 160, 260), mealFood("Molho pesto", 20, 40), mealFood("Salada verde", 30, 80)], accompaniments.massa),
    meal("Risoto de legumes", "Jantar", [mealFood("Risoto de legumes", 180, 280), mealFood("Salada verde", 30, 80)], accompaniments.massa),
    meal("Sushi combinado", "Jantar", [mealFood("Sushi combinado", 180, 300)], accompaniments.japones),
    meal("Burrito de frango", "Jantar", [mealFood("Burrito de frango", 180, 280), mealFood("Guacamole", 30, 70)], accompaniments.mexicano)
  ];

  const desserts = [
    meal("Acai com banana e granola", "Sobremesa", [mealFood("Acai com banana", 180, 320), mealFood("Granola", 20, 45)], accompaniments.sobremesa),
    meal("Acai com leite em po", "Sobremesa", [mealFood("Acai com banana", 180, 320), mealFood("Leite em po", 15, 35)], accompaniments.sobremesa),
    meal("Acai com leite condensado", "Sobremesa", [mealFood("Acai com banana", 180, 320), mealFood("Leite condensado", 15, 35)], accompaniments.sobremesa),
    meal("Pudim de leite", "Sobremesa", [mealFood("Pudim de leite", 90, 180)], accompaniments.sobremesa),
    meal("Mousse de chocolate", "Sobremesa", [mealFood("Mousse de chocolate", 90, 180)], accompaniments.sobremesa),
    meal("Brigadeiro de colher", "Sobremesa", [mealFood("Brigadeiro", 50, 110)], accompaniments.sobremesa),
    meal("Canjica cremosa", "Sobremesa", [mealFood("Canjica", 120, 220)], accompaniments.sobremesa),
    meal("Pamonha doce", "Sobremesa", [mealFood("Pamonha", 100, 200)], accompaniments.sobremesa),
    meal("Banana com canela", "Sobremesa", [mealFood("Banana com canela", 100, 180)], accompaniments.sobremesa),
    meal("Morango com iogurte grego", "Sobremesa", [mealFood("Morango", 70, 120), mealFood("Iogurte grego", 100, 160)], accompaniments.sobremesa),
    meal("Bolo simples com café preto", "Sobremesa", [mealFood("Bolo simples", 50, 100), mealFood("Café preto", 120, 220)], accompaniments.sobremesa),
    meal("Paçoquinha com café", "Sobremesa", [mealFood("Paçoca", 20, 45), mealFood("Café preto", 120, 220)], accompaniments.sobremesa),
    meal("Acai com banana e paçoca", "Sobremesa", [mealFood("Acai com banana", 180, 320), mealFood("Paçoca", 20, 40)], accompaniments.sobremesa),
    meal("Pudim com morangos", "Sobremesa", [mealFood("Pudim de leite", 90, 180), mealFood("Morango", 50, 90)], accompaniments.sobremesa),
    meal("Mousse de chocolate com banana", "Sobremesa", [mealFood("Mousse de chocolate", 90, 180), mealFood("Banana", 50, 90)], accompaniments.sobremesa)
  ];

  const fastFoods = [
    meal("Hambúrguer clássico com queijo e batata frita", "Fast Food", [mealFood("Pão de hambúrguer", 60, 90), mealFood("Hambúrguer bovino", 100, 170), mealFood("Queijo cheddar", 20, 40), mealFood("Tomate", 15, 35), mealFood("Alface", 10, 25), mealFood("Batata frita", 80, 150)], accompaniments.fastFood),
    meal("Hambúrguer com bacon e batata frita", "Fast Food", [mealFood("Pão de hambúrguer", 60, 90), mealFood("Hambúrguer bovino", 100, 170), mealFood("Bacon", 15, 35), mealFood("Queijo cheddar", 20, 40), mealFood("Batata frita", 80, 150)], accompaniments.fastFood),
    meal("Hambúrguer de frango com salada", "Fast Food", [mealFood("Pão de hambúrguer", 60, 90), mealFood("Hambúrguer de frango", 100, 170), mealFood("Alface", 10, 25), mealFood("Tomate", 15, 35), mealFood("Batata frita", 70, 140)], accompaniments.fastFood),
    meal("Cachorro-quente completo", "Fast Food", [mealFood("Pão francês", 50, 80), mealFood("Salsicha", 70, 120), mealFood("Molho de tomate", 25, 50), mealFood("Milho", 20, 45), mealFood("Ervilha", 20, 45), mealFood("Batata palha", 12, 25)], accompaniments.fastFood),
    meal("Cachorro-quente com purê e batata palha", "Fast Food", [mealFood("Pão francês", 50, 80), mealFood("Salsicha", 70, 120), mealFood("Purê de batata", 40, 80), mealFood("Batata palha", 12, 25)], accompaniments.fastFood),
    meal("Pizza de mussarela", "Fast Food", [mealFood("Pizza de mussarela", 180, 320)], accompaniments.fastFood),
    meal("Pizza de calabresa", "Fast Food", [mealFood("Pizza de calabresa", 180, 320)], accompaniments.fastFood),
    meal("Pizza de frango com catupiry", "Fast Food", [mealFood("Pizza de frango com catupiry", 180, 320)], accompaniments.fastFood),
    meal("Pizza portuguesa", "Fast Food", [mealFood("Pizza portuguesa", 180, 320)], accompaniments.fastFood),
    meal("Pizza margherita", "Fast Food", [mealFood("Pizza margherita", 180, 320)], accompaniments.fastFood),
    meal("Mini hambúrguer com batata frita", "Fast Food", [mealFood("Mini hambúrguer", 150, 260), mealFood("Batata frita", 70, 140)], accompaniments.fastFood),
    meal("Pastel de carne com batata frita", "Fast Food", [mealFood("Pastel de carne", 120, 180), mealFood("Batata frita", 60, 120)], accompaniments.fastFood),
    meal("Pastel de queijo com refrigerante", "Fast Food", [mealFood("Pastel de queijo", 120, 180), mealFood("Refrigerante cola", 220, 350)], accompaniments.fastFood),
    meal("Esfiha de carne com refrigerante", "Fast Food", [mealFood("Esfiha de carne", 120, 200), mealFood("Refrigerante cola", 220, 350)], accompaniments.fastFood),
    meal("Quesadilla de queijo", "Fast Food", [mealFood("Quesadilla de queijo", 170, 260)], accompaniments.fastFood),
    meal("Taco de carne", "Fast Food", [mealFood("Taco de carne", 160, 250)], accompaniments.fastFood)
  ];

  const fitnessMeals = [
    meal("Frango grelhado com arroz integral e brócolis", "Fitness", [mealFood("Peito de frango grelhado", 110, 200), mealFood("Arroz integral", 90, 170), mealFood("Brócolis cozido", 50, 100)], accompaniments.saudavel),
    meal("Tilápia grelhada com legumes", "Fitness", [mealFood("Tilápia grelhada", 110, 190), mealFood("Legumes grelhados", 80, 150)], accompaniments.saudavel),
    meal("Salmão grelhado com quinoa", "Fitness", [mealFood("Salmão grelhado", 100, 180), mealFood("Quinoa cozida", 90, 160), mealFood("Salada verde", 40, 90)], accompaniments.saudavel),
    meal("Omelete de queijo com salada verde", "Fitness", [mealFood("Omelete de queijo", 110, 180), mealFood("Salada verde", 60, 120)], accompaniments.saudavel),
    meal("Salada completa com frango grelhado", "Fitness", [mealFood("Salada verde", 80, 150), mealFood("Peito de frango grelhado", 90, 170), mealFood("Tomate", 25, 50), mealFood("Pepino", 25, 50)], accompaniments.saudavel),
    meal("Salada de quinoa com tofu grelhado", "Fitness", [mealFood("Salada de quinoa", 140, 240), mealFood("Tofu grelhado", 90, 160)], accompaniments.saudavel),
    meal("Wrap integral de frango com salada", "Fitness", [mealFood("Wrap integral de frango", 120, 200), mealFood("Salada verde", 40, 90)], accompaniments.saudavel),
    meal("Iogurte grego com granola e morango", "Fitness", [mealFood("Iogurte grego", 130, 190), mealFood("Granola", 20, 35), mealFood("Morango", 60, 100)], accompaniments.saudavel),
    meal("Frango desfiado com purê de abóbora", "Fitness", [mealFood("Frango desfiado", 100, 180), mealFood("Abóbora assada", 90, 170)], accompaniments.saudavel),
    meal("Carne magra com arroz integral e salada", "Fitness", [mealFood("Patinho moído", 100, 180), mealFood("Arroz integral", 90, 170), mealFood("Salada verde", 40, 90)], accompaniments.saudavel),
    meal("Tapioca com frango desfiado e suco verde", "Fitness", [mealFood("Tapioca", 70, 120), mealFood("Frango desfiado temperado", 50, 100), mealFood("Suco verde", 180, 260)], accompaniments.saudavel),
    meal("Cuscuz com ovos e salada", "Fitness", [mealFood("Cuscuz nordestino", 90, 160), mealFood("Ovo cozido", 60, 100), mealFood("Salada verde", 30, 70)], accompaniments.saudavel),
    meal("Bowl de grão-de-bico com legumes", "Fitness", [mealFood("Grao-de-bico cozido", 100, 170), mealFood("Legumes grelhados", 80, 150), mealFood("Salada verde", 40, 90)], accompaniments.saudavel),
    meal("Quinoa com salmão e abobrinha", "Fitness", [mealFood("Quinoa cozida", 90, 160), mealFood("Salmão grelhado", 100, 170), mealFood("Abobrinha refogada", 60, 120)], accompaniments.saudavel),
    meal("Ovos mexidos com pão integral e frutas", "Fitness", [mealFood("Ovos mexidos", 80, 130), mealFood("Pão integral", 40, 70), mealFood("Banana", 60, 100)], accompaniments.saudavel)
  ];

  const vegetarianMeals = [
    meal("Arroz integral, lentilha e legumes grelhados", "Vegetariano", [mealFood("Arroz integral", 100, 180), mealFood("Lentilha cozida", 80, 140), mealFood("Legumes grelhados", 80, 150)], accompaniments.saudavel),
    meal("Risoto de legumes com salada", "Vegetariano", [mealFood("Risoto de legumes", 180, 280), mealFood("Salada verde", 40, 90)], accompaniments.massa),
    meal("Nhoque ao sugo com queijo minas", "Vegetariano", [mealFood("Nhoque ao sugo", 180, 280), mealFood("Queijo minas", 25, 50)], accompaniments.massa),
    meal("Panqueca de queijo com salada", "Vegetariano", [mealFood("Panqueca americana", 120, 180), mealFood("Queijo minas", 30, 60), mealFood("Salada verde", 30, 80)], accompaniments.saudavel),
    meal("Cuscuz com queijo coalho e tomate", "Vegetariano", [mealFood("Cuscuz nordestino", 100, 180), mealFood("Queijo coalho", 35, 70), mealFood("Tomate", 20, 50)], accompaniments.cafe),
    meal("Omelete de queijo com salada verde", "Vegetariano", [mealFood("Omelete de queijo", 110, 180), mealFood("Salada verde", 50, 100)], accompaniments.saudavel),
    meal("Quibe assado vegetariano com tabule", "Vegetariano", [mealFood("Quibe assado", 160, 240), mealFood("Tabule", 50, 100)], accompaniments.arabe),
    meal("Tapioca com queijo minas e tomate", "Vegetariano", [mealFood("Tapioca", 70, 130), mealFood("Queijo minas", 35, 70), mealFood("Tomate", 20, 50)], accompaniments.cafe),
    meal("Salada de quinoa com queijo minas", "Vegetariano", [mealFood("Salada de quinoa", 140, 220), mealFood("Queijo minas", 30, 55)], accompaniments.saudavel),
    meal("Arroz branco, feijão carioca e ovo cozido", "Vegetariano", [mealFood("Arroz branco", 100, 180), mealFood("Feijão carioca", 70, 130), mealFood("Ovo cozido", 70, 120), mealFood("Salada verde", 30, 80)], accompaniments.brasileiro),
    meal("Macarrão alho e óleo com brócolis", "Vegetariano", [mealFood("Macarrão alho e óleo", 170, 280), mealFood("Brócolis cozido", 40, 90)], accompaniments.massa),
    meal("Hambúrguer de grão-de-bico com salada", "Vegetariano", [mealFood("Hambúrguer de grão-de-bico", 130, 220), mealFood("Salada verde", 40, 90)], accompaniments.saudavel)
  ];

  const veganMeals = [
    meal("Arroz integral, feijão preto e abóbora assada", "Vegano", [mealFood("Arroz integral", 100, 180), mealFood("Feijão preto", 80, 140), mealFood("Abóbora assada", 80, 150), mealFood("Salada verde", 30, 80)], accompaniments.saudavel),
    meal("Bowl vegano de grão-de-bico e quinoa", "Vegano", [mealFood("Grao-de-bico cozido", 100, 170), mealFood("Quinoa cozida", 90, 160), mealFood("Legumes grelhados", 80, 150)], accompaniments.saudavel),
    meal("Tofu grelhado com arroz integral e brócolis", "Vegano", [mealFood("Tofu grelhado", 100, 170), mealFood("Arroz integral", 90, 170), mealFood("Brócolis cozido", 50, 100)], accompaniments.saudavel),
    meal("Tofu mexido com tapioca", "Vegano", [mealFood("Tofu mexido", 100, 160), mealFood("Tapioca", 70, 120)], accompaniments.saudavel),
    meal("Hambúrguer de lentilha com salada", "Vegano", [mealFood("Hambúrguer de lentilha", 130, 220), mealFood("Salada verde", 40, 90), mealFood("Tomate", 20, 45)], accompaniments.saudavel),
    meal("Salada de folhas com manga e quinoa", "Vegano", [mealFood("Salada de folhas com manga", 120, 220), mealFood("Quinoa cozida", 70, 130)], accompaniments.saudavel),
    meal("Cuscuz com legumes grelhados", "Vegano", [mealFood("Cuscuz nordestino", 100, 180), mealFood("Legumes grelhados", 80, 150)], accompaniments.saudavel),
    meal("Macarrão ao sugo com berinjela assada", "Vegano", [mealFood("Macarrão ao sugo", 180, 280), mealFood("Berinjela assada", 70, 140)], accompaniments.massa),
    meal("Sopa de legumes com lentilha", "Vegano", [mealFood("Sopa de legumes", 220, 360), mealFood("Lentilha cozida", 70, 130)], accompaniments.saudavel),
    meal("Arroz branco, feijão fradinho e couve refogada", "Vegano", [mealFood("Arroz branco", 100, 180), mealFood("Feijão fradinho", 80, 130), mealFood("Couve refogada", 40, 90), mealFood("Tomate", 20, 45)], accompaniments.saudavel)
  ];

  const kidsMeals = [
    meal("Arroz com legumes e nuggets de frango", "Infantil", [mealFood("Arroz com legumes", 120, 200), mealFood("Nuggets de frango", 100, 170)], accompaniments.infantil),
    meal("Mini hambúrguer com batata frita", "Infantil", [mealFood("Mini hambúrguer", 150, 240), mealFood("Batata frita", 60, 120)], accompaniments.infantil),
    meal("Macarrão com molho suave e frango", "Infantil", [mealFood("Macarrão com molho suave", 150, 240), mealFood("Frango desfiado", 60, 110)], accompaniments.infantil),
    meal("Panqueca de frango", "Infantil", [mealFood("Panqueca de frango", 160, 240)], accompaniments.infantil),
    meal("Filé de peixe empanado com purê", "Infantil", [mealFood("Filé de peixe empanado", 100, 170), mealFood("Purê de batata", 80, 150)], accompaniments.infantil),
    meal("Pizza de mussarela", "Infantil", [mealFood("Pizza de mussarela", 150, 260)], accompaniments.infantil),
    meal("Ovos mexidos com pão de forma", "Infantil", [mealFood("Ovos mexidos", 70, 120), mealFood("Pão de forma", 40, 70)], accompaniments.infantil),
    meal("Arroz branco, feijão e filé de frango empanado", "Infantil", [mealFood("Arroz branco", 90, 160), mealFood("Feijão carioca", 60, 100), mealFood("Filé de frango empanado", 100, 170)], accompaniments.infantil),
    meal("Cachorro-quente simples", "Infantil", [mealFood("Pão francês", 45, 70), mealFood("Salsicha", 60, 100), mealFood("Molho de tomate", 20, 40)], accompaniments.infantil),
    meal("Pão francês com queijo minas", "Infantil", [mealFood("Pão francês", 45, 70), mealFood("Queijo minas", 25, 45)], accompaniments.infantil),
    meal("Acai com banana", "Infantil", [mealFood("Acai com banana", 160, 260)], accompaniments.infantil),
    meal("Tapioca com queijo minas", "Infantil", [mealFood("Tapioca", 70, 110), mealFood("Queijo minas", 30, 55)], accompaniments.infantil)
  ];

  const meals = [
    ...breakfastBreads,
    ...breakfastTapiocas,
    ...breakfastCuscuz,
    ...breakfastPlates,
    ...morningSnacks,
    ...classicLunches,
    ...lunchSpecials,
    ...regionalMeals,
    ...internationalMeals,
    ...afternoonSnacks,
    ...dinners,
    ...desserts,
    ...fastFoods,
    ...fitnessMeals,
    ...vegetarianMeals,
    ...veganMeals,
    ...kidsMeals
  ];

  window.PancreAIMealDatabase = {
    foodCatalog,
    meals,
    accompanimentChance: 0.2
  };
})();
