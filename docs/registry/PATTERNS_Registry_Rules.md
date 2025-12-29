# Registry Patterns — L4 Rules

Les 9 règles fondamentales du registry L4.

```
STATUS: CANONICAL
```

---

## Les 9 Rules

| Rule | Pattern | Principe |
|------|---------|----------|
| **P1** | Registry = existence | Si pas dans le registry, n'existe pas |
| **P2** | Registry ≠ contactable | Exister ≠ être joignable. L3 gère la découverte |
| **P3** | JWT verification | Standard industrie, crypto-proof |
| **P4** | Hash-based routing | SHA256(JWT + node_id) = preuve unforgeable |
| **P5** | Public by default | L4 = Law. Les lois sont publiques |
| **P6** | Registry = Graph | Une seule source de vérité |
| **P7** | Membrane only | Single gate = single point de sécurité |
| **P8** | Graph MCP calls | Pas de Cypher = pas d'injection |
| **P9** | Skill + Procedure | Tout traceable, reproductible |

---

## Pourquoi cet ensemble est solide

### 1. Sécurité par design

```
Attacker veut modifier le registry?
→ Doit passer par Membrane (P7)
→ Membrane vérifie JWT (P3)
→ Membrane vérifie hash (P4)
→ Pas d'accès direct au graph
```

### 2. Simplicité

- Pas d'API à maintenir (P6)
- Pas de Cypher à debugger (P8)
- Pas de cache à invalider (P6 - single source)
- Pas de sync entre systèmes (P6)

### 3. Auditabilité

- Tout est public (P5)
- Tout est un skill tracé (P9)
- Tout passe par un seul point (P7)
- → Logs complets, audit facile

### 4. Évolutivité

```
Ajouter une opération?
→ Créer un skill + procedure (P9)
→ Utiliser les mêmes MCP ops (P8)
→ Pas de nouvelle infra
```

### 5. Robustesse

- Graph down? → Tout down (pas de partial failure)
- Membrane down? → Rien ne passe (fail-safe)
- Pas de race conditions (transactions graph)
- Pas d'état inconsistent

---

## Le Pattern Clé: Graph Physics

```
Au lieu de:                      On fait:
───────────────────────────────────────────────────────
SELECT * FROM citizens           graph.get_linked(org_id, type="citizen")
WHERE org_id = ?
                                 → Le graph structure = la query
JOIN endpoints ON...             → Suivre les links = la logique
WHERE status != 'suspended'      → Les propriétés = les filtres
```

**Le graph fait le travail. On ne fait que suivre les liens.**

---

## Application aux Procédures

| Procedure | Rules appliquées |
|-----------|------------------|
| `registry_list_citizens` | P6, P7, P8, P9 |
| `registry_list_orgs` | P6, P7, P8, P9 |

### Exemple: list_citizens

```yaml
# P7: Membrane only
procedure: registry_list_citizens

# P8: Graph MCP calls (pas de Cypher)
steps:
  query_citizens:
    type: query
    auto_fetch:
      - query:
          find: actor
          where:
            type: citizen

# P9: Traceable
output:
  returns:
    items: "{transformed}"
```

---

## Anti-patterns

| ❌ Ne pas faire | ✅ Faire | Rule violée |
|-----------------|----------|-------------|
| REST API direct au graph | Membrane procedure | P7 |
| Cypher queries | Graph MCP ops | P8 |
| Cache séparé | Graph = source | P6 |
| Tokens custom | JWT standard | P3 |
| Opérations non-documentées | Skill + Procedure | P9 |
