# 🌍 Visualization of Global Cost of Living

## 📋 Objectif du Projet

Ce projet vise à créer une suite de visualisations interactives et intuitives pour explorer et comprendre le coût de la vie dans différentes villes du monde. L'objectif est de fournir aux utilisateurs des outils pour comparer, analyser et prendre des décisions éclairées sur les choix de localisation basés sur des facteurs économiques.

---

## 🎯 Questions Clés et Solutions Proposées

### 1. 📊 Comparaison Visuelle et Intuitive des Coûts de Vie

**Question :** Comment pourrait-on aider les utilisateurs à comparer le coût de la vie entre différentes villes du monde de manière visuelle et intuitive ?

**Solutions Proposées :**
- **Graphique comparatif en barres horizontales** : Permettre aux utilisateurs de sélectionner 2-5 villes et afficher une comparaison côte à côte du coût de la vie global
- **Carte thermique interactive** : Utiliser une dégradation de couleurs (vert = abordable, rouge = cher) pour un aperçu rapide
- **Tableau de bord comparatif** : Afficher les statistiques clés (coût moyen, indice, classement) pour chaque ville sélectionnée

---

### 2. 💰 Représentation du Pouvoir d'Achat

**Question :** Comment pourrait-on représenter le pouvoir d'achat à partir du rapport entre le salaire moyen et le coût global de la vie ?

**Solutions Proposées :**
- **Ratio Salaire/Coût** : Créer un indice du pouvoir d'achat (salaire moyen ÷ coût de vie)
- **Graphique en bulles** : X = salaire moyen, Y = coût de vie, Taille/Couleur = pouvoir d'achat
- **Classement des villes** : Lister les villes avec le meilleur et pire pouvoir d'achat
- **Heatmap interactive** : Montrer visuellement où on gagne le plus relativement au coût de la vie

---

### 3. 🏠 Détail des Dépenses par Catégorie

**Question :** Comment pourrait-on permettre à un utilisateur de visualiser le détail des dépenses (logement, alimentation, transport, loisirs…) pour une ville donnée ?

**Solutions Proposées :**
- **Graphique en camembert (pie chart)** : Distribution des dépenses par catégorie pour une ville
- **Graphique en barres empilées (stacked bar chart)** : Comparaison des catégories de dépenses entre plusieurs villes
- **Diagramme radial/radar chart** : Afficher les 6-8 catégories principales autour d'un cercle
- **Breakdown interactif** : Cliquer sur une catégorie pour voir les sous-catégories détaillées

---

### 4. 🗺️ Inégalités Économiques Régionales

**Question :** Comment pourrait-on montrer les inégalités économiques régionales à travers une carte du monde interactive ?

**Solutions Proposées :**
- **Carte choroplèthe mondiale** : Colorier les pays selon leur coût de vie moyen (vert = bas, rouge = élevé)
- **Carte en clusters** : Grouper les villes par région pour identifier les disparités régionales
- **Indicateurs régionaux** : Afficher la variance et l'écart-type du coût de vie par région
- **Animation temporelle** : Montrer l'évolution des inégalités au fil du temps (si données disponibles)

---

### 5. 🎓 Guide de Choix pour Étudiants et Expatriés

**Question :** Comment pourrait-on aider les étudiants ou expatriés à choisir une ville abordable selon leurs besoins et priorités (logement, alimentation, loisirs) ?

**Solutions Proposées :**
- **Filtre interactif personnalisé** : Sélectionner les catégories prioritaires et pondérer leur importance
- **Quiz de recommandation** : Poser des questions sur les priorités et suggérer des villes adaptées
- **Tableau de comparaison personnalisé** : Afficher les villes classées selon les critères de l'utilisateur
- **Profil de vie type** : Créer des profils (étudiant frugal, expatrié avec famille, jeune professionnel) et recommander des villes

---

### 6. 🎨 Carte des Zones Chères vs Abordables

**Question :** Comment pourrait-on concevoir une carte qui met en évidence les zones les plus chères et les plus abordables à l'échelle mondiale ?

**Solutions Proposées :**
- **Carte interactive avec clustering** : Utiliser des marqueurs de taille variable ou des zones délimitées pour les prix
- **Top 10 et Bottom 10** : Afficher les 10 villes les plus chères et les 10 plus abordables
- **Dégradé géographique** : Appliquer un gradient de couleurs sur la carte mondiale
- **Zones d'intérêt** : Identifier les régions où les prix sont particulièrement avantageux ou élevés

---

### 7. 📈 Création d'un Indice Global du Coût de la Vie

**Question :** Comment pourrait-on créer un indice global du coût de la vie en combinant plusieurs catégories de dépenses du dataset ?

**Solutions Proposées :**
- **Indice pondéré** : Attribuer des poids à chaque catégorie selon leur importance (ex: logement 40%, alimentation 25%, transport 20%, loisirs 15%)
- **Indice normalisé (0-100)** : Standardiser l'indice pour une meilleure comparabilité
- **Indice composite dynamique** : Permettre aux utilisateurs de modifier les poids et recalculer en temps réel
- **Évolution de l'indice** : Montrer comment l'indice a évolué pour chaque ville au fil du temps

---

### 8. 🔄 Comparaisons Interactives et Personnalisées

**Question :** Comment pourrait-on rendre les comparaisons de villes interactives (ex : Paris vs Casablanca) pour rendre la visualisation plus personnalisée ?

**Solutions Proposées :**
- **Sélectionneur de villes (dropdown/search)** : Permettre aux utilisateurs de choisir jusqu'à 5 villes à comparer
- **Visualisation côte à côte** : Afficher les données pour chaque ville en colonnes parallèles
- **Graphique en radar dual** : Comparer 2 villes sur les mêmes dimensions
- **Différence en pourcentage** : Montrer l'écart relatif entre les villes sélectionnées
- **Export des résultats** : Permettre aux utilisateurs de télécharger les comparaisons en PDF ou image

---

### 9. 🏘️ Relation Salaire-Prix des Logements

**Question :** Comment pourrait-on illustrer la relation entre salaire moyen et prix des logements pour mieux comprendre le poids du logement dans le coût de la vie ?

**Solutions Proposées :**
- **Graphique de dispersion (scatter plot)** : X = salaire moyen, Y = prix des logements
- **Ligne de tendance** : Ajouter une régression linéaire pour montrer la corrélation
- **Ratio Loyer/Salaire** : Calculer et afficher le pourcentage du salaire consacré au logement
- **Code couleur par région** : Identifier les villes où le logement est disproportionné par rapport au salaire
- **Bulles annotées** : Taille de la bulle = poids du logement dans le coût total

---

### 10. 💡 Sensibilisation à l'Impact Réel du Coût de la Vie

**Question :** Comment pourrait-on sensibiliser les utilisateurs à l'impact du coût de la vie sur le niveau de vie réel, au-delà des chiffres bruts ?

**Solutions Proposées :**
- **Calculateur de pouvoir d'achat** : Entrer un salaire et voir combien on peut acheter dans chaque ville
- **Scénarios de vie** : Afficher ce qu'on peut se permettre avec un budget type (ex: 1500€/mois)
- **Infographie narrative** : Raconter une histoire avec des exemples concrets (ex: "À Paris, c'est X% du salaire pour se loger")
- **Tableau de vie simulée** : Lister les dépenses mensuelles type pour un mode de vie donné
- **Indicateurs qualitatifs** : Ajouter des symboles (✓/✗) pour montrer l'accessibilité des services essentiels
- **Comparaison de "panier de marché"** : Afficher le coût d'un panier d'articles identiques dans différentes villes

---

## 📊 Dimensions de Données à Analyser

- **Catégories principales** : Logement, Alimentation, Transport, Loisirs, Santé, Éducation, Services
- **Métriques clés** : Coût moyen, Salaire moyen, Indice de coût, Pouvoir d'achat, Variance régionale
- **Dimensions géographiques** : Pays, Région, Ville, Zone urbaine/rurale
- **Contexte** : Population, Développement économique, Qualité de vie

---

## 🛠️ Technologies Proposées

- **Frontend** : D3.js, Plotly, Folium ou MapBox pour les visualisations interactives
- **Backend** : Python (Pandas, NumPy) pour le traitement des données
- **Dashboard** : Dash, Streamlit ou Tableau pour intégrer les visualisations
- **Données** : CSV, JSON avec possibilité de mise à jour régulière

---

## 📈 Plan de Livraison

1. **Phase 1** : Exploration et nettoyage des données
2. **Phase 2** : Développement des visualisations individuelles
3. **Phase 3** : Intégration dans un dashboard interactif
4. **Phase 4** : Tests et optimisations UX
5. **Phase 5** : Documentation et déploiement

---

## 🎯 Conclusion

Ce projet vise à transformer des données brutes en insights visuels et actionnables, permettant aux utilisateurs de mieux comprendre et naviguer les réalités économiques du coût de la vie mondial.
