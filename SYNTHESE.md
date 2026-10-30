# Synthèse : problèmes, corrections, résultats

## Résultats

| Indicateur                    | Avant                    | Après      |
| ----------------------------- | ------------------------ | ---------- |
| `npm run test`                | Ne démarre pas           | 11 réussis |
| Tests                         | 2 (une fois Jest réparé) | 11         |
| Couverture des lignes (Jest)  | 66,66 %                  | 96,77 %    |
| Couverture New Code (Sonar)   | 60 %                     | 95,3 %     |
| ESLint                        | 1 warning                | 0          |
| Prettier                      | 9 fichiers à reformater  | 0          |
| Hotspots de sécurité à revoir | 1                        | 0          |
| Bugs, vulnérabilités, smells  | 0                        | 0          |
| Duplication                   | 0 %                      | 0 %        |
| Quality Gate (avec New Code)  | **FAILED**               | **PASSED** |

Une simulation de la CI depuis un clone propre (`npm ci`, lint, format, `test:cov`) passe aussi.

## Problèmes du code

| Problème                                                  | Correction                             |
| --------------------------------------------------------- | -------------------------------------- |
| Variable `UNUSED` inutilisée                              | Supprimée                              |
| Formatage incohérent                                      | `prettier --write .`                   |
| Hotspot Sonar : l'en-tête `X-Powered-By` révèle Express   | `app.disable("x-powered-by")`          |
| `POST /todos` accepte un titre `123` ou composé d'espaces | Le titre doit être une chaîne non vide |
| Liste, suppression et cas d'erreur non testés             | 9 tests ajoutés                        |

## Problèmes de l'outillage du starter

| Problème                                                          | Correction                                           |
| ----------------------------------------------------------------- | ---------------------------------------------------- |
| Jest ne charge pas les modules ESM                                | Scripts lancés avec `node --experimental-vm-modules` |
| Pas de `package-lock.json`, alors que `npm ci` en a besoin        | Fichier généré et commité                            |
| Pas de `.gitignore`                                               | Ajouté                                               |
| ESLint analyserait le rapport `coverage/`                         | `ignorePatterns`                                     |
| Un warning ESLint ne bloque pas la pipeline                       | `--max-warnings 0`                                   |
| Scripts du gate : URL `add_condition` inexistante, erreur masquée | Remplacée par `create_condition`                     |
| `NPM_CACHE_FOLDER` sans effet dans la CI GitLab                   | `npm_config_cache`                                   |
| Historique git absent lors du scan en CI                          | `GIT_DEPTH: "0"`                                     |
| Sous Linux, le scanner en conteneur ne joint pas `localhost`      | `--network host` (README)                            |
| Port 9000 parfois déjà occupé                                     | Variable `SONAR_PORT`                                |

## Lecture du tableau de bord

Le premier scan affiche PASSED avec seulement 60 % de couverture. Ce résultat ne prouve rien : sans New Code, les conditions de couverture et de duplication ne sont pas évaluées. Une fois le code commité et rescanné, le gate passe à FAILED sur `new_coverage` (60 % pour 80 % exigés) et le scan se termine en erreur. C'est ce qui rend le gate bloquant dans la CI.

## Limites

- La ligne `app.listen` n'est pas couverte, car elle ne s'exécute pas en mode test.
- `npm audit` signale 6 vulnérabilités de faible gravité, dans la chaîne de dépendances de Jest (développement uniquement). La correction proposée impose un changement majeur, elle n'est donc pas appliquée.
- Le stockage est en mémoire : les tests partagent le même état, ils ne supposent donc pas une liste vide.
